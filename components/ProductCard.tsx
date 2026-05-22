'use client'

import Image from 'next/image'
import { ExternalLink } from 'lucide-react'

import { getProductImage } from '@/app/lib/product-image'
import { Product } from '@/types'

export function ProductCard({ product, index }: { product: Product; index: number }) {
  const imageSrc = getProductImage(product.image)

  return (
    <article
      className="review-card grid gap-4 rounded-[28px] p-4 sm:grid-cols-[168px_minmax(0,1fr)] sm:p-5 animate-in"
      style={{ animationDelay: `${index * 0.08}s`, animationFillMode: 'both' }}>

      <div className="relative overflow-hidden rounded-3xl aspect-4/3 flex items-center justify-center"
        style={{ background: 'var(--cream-deep)' }}>
        <Image
          src={imageSrc}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-500 hover:scale-[1.03]"
          sizes="(max-width: 640px) 100vw, 168px"
        />
      </div>

      <div className="flex min-w-0 flex-col">
        <div className="flex items-center justify-between gap-3">
          <span className="rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em]"
            style={{ borderColor: 'var(--border-strong)', color: 'var(--terracotta)' }}>
            {product.category}
          </span>
          <span className="text-[11px] uppercase tracking-[0.18em]" style={{ color: 'var(--ink-hint)' }}>
            Personal Note
          </span>
        </div>

        <h3 className="mt-4 font-display text-2xl leading-tight" style={{ color: 'var(--ink)' }}>
          {product.name}
        </h3>

        <p className="mt-3 text-sm leading-7 sm:text-[15px]" style={{ color: 'var(--ink-soft)' }}>
          {product.description}
        </p>

        <div className="mt-5">
          <a href={product.affiliateUrl} target="_blank" rel="noopener noreferrer sponsored"
            className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-transform hover:-translate-y-0.5"
            style={{ background: 'var(--terracotta)', color: 'var(--paper)' }}>
            Link Produk <ExternalLink size={15} />
          </a>
        </div>
      </div>
    </article>
  )
}

export default ProductCard
