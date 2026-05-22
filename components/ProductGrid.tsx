'use client'

import { useState } from 'react'
import { Product } from '@/types'
import { ProductCard } from './ProductCard'
import FilterBar from './FilterBar'

export default function ProductGrid({ products, categories = ['All'] }: { products: Product[]; categories?: string[] }) {
  const [active, setActive] = useState('All')
  const filtered = active === 'All' ? products : products.filter(p => p.category === active)

  return (
    <div>
      <FilterBar categories={categories} activeCategory={active} onSelect={setActive} />
      <p className="mt-3 mb-5 text-xs" style={{ color: 'var(--ink-hint)' }}>
        {filtered.length} produk{active !== 'All' ? ` · ${active}` : ''}
      </p>
      <div className="space-y-4">
        {filtered.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
      </div>
    </div>
  )
}
