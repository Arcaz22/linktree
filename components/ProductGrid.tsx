'use client'

import { useState } from 'react'
import { Product } from '@/types'
import FilterBar from './FilterBar'
import ProductCard from './ProductCard'

export default function ProductGrid({ products }: { products: Product[] }) {
  const categories = ['All', ...Array.from(new Set(products.map(product => product.category)))]
  const [activeCategory, setActiveCategory] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredProducts = products.filter(product => {
    const matchesCategory = activeCategory === 'All' || product.category === activeCategory
    const normalizedQuery = searchQuery.trim().toLowerCase()
    const matchesSearch = !normalizedQuery
      || product.name.toLowerCase().includes(normalizedQuery)
      || product.description.toLowerCase().includes(normalizedQuery)
      || product.category.toLowerCase().includes(normalizedQuery)

    return matchesCategory && matchesSearch
  })

  if (!products.length) {
    return (
      <div className="rounded-[28px] border px-6 py-14 text-center"
        style={{ borderColor: 'var(--border)', background: 'rgba(255, 251, 245, 0.9)' }}>
        <p className="text-sm" style={{ color: 'var(--ink-muted)' }}>
          No published reviews yet.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-5">
      <div className="rounded-3xl border px-4 py-4"
        style={{ borderColor: 'var(--border)', background: 'rgba(255, 251, 245, 0.9)' }}>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.18em]" style={{ color: 'var(--ink-hint)' }}>
                Telusuri Ulasan
              </p>
            </div>
          </div>

          <input
            type="search"
            value={searchQuery}
            onChange={event => setSearchQuery(event.target.value)}
            placeholder="Cari produk, kategori, atau kata kunci..."
            className="w-full rounded-[20px] border px-4 py-3 text-sm outline-none"
            style={{ borderColor: 'var(--border)', background: 'var(--paper)', color: 'var(--ink)' }}
          />

          {categories.length > 1 && (
            <FilterBar
              categories={categories}
              activeCategory={activeCategory}
              onSelect={setActiveCategory}
            />
          )}
        </div>
      </div>

      {filteredProducts.length ? (
        filteredProducts.map((product, index) => (
          <ProductCard key={product.id} product={product} index={index} />
        ))
      ) : (
        <div className="rounded-[28px] border px-6 py-14 text-center"
          style={{ borderColor: 'var(--border)', background: 'rgba(255, 251, 245, 0.9)' }}>
          <p className="text-sm" style={{ color: 'var(--ink-muted)' }}>
            Tidak ada ulasan yang sesuai dengan pencarian
          </p>
        </div>
      )}
    </div>
  )
}
