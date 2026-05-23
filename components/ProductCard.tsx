'use client'

import { sanitizeReviewHtml } from '@/app/lib/review-html'
import { Product } from '@/types'

export function ProductCard({ product, index }: { product: Product; index: number }) {
  const reviewHtml = sanitizeReviewHtml(product.description)

  return (
    <article
      className="review-card animate-in rounded-2xl border border-black/5 bg-white/50 p-6 backdrop-blur-sm transition-all duration-200"
      style={{ animationDelay: `${index * 0.08}s`, animationFillMode: 'both' }}>
      <div className="flex min-w-0 flex-col">
        <div className="flex items-center justify-between gap-3">
          <span className="rounded bg-amber-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-amber-700">
            {product.category}
          </span>
          <span className="font-sans text-[10px] tracking-wide text-stone-400">
            CATATAN PRIBADI
          </span>
        </div>

        <h3 className="mt-2 mb-2 font-serif text-xl font-medium text-stone-900">
          {product.name}
        </h3>

        <div
          className="review-rich mb-4 font-sans text-sm italic leading-relaxed text-stone-600"
          dangerouslySetInnerHTML={{ __html: reviewHtml }}
        />

        <div>
          <a
            href={product.affiliateUrl}
            target="_blank"
            rel="noopener noreferrer sponsored"
            className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-amber-800 px-4 py-2 text-xs font-medium text-white transition-colors hover:bg-amber-900">
            Link Produk
            <svg
              aria-hidden="true"
              viewBox="0 0 20 20"
              fill="none"
              className="h-3.5 w-3.5"
              xmlns="http://www.w3.org/2000/svg">
              <path
                d="M7.5 12.5L12.5 7.5M8.75 7.5H12.5V11.25"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M12.5 10.8333V13.125C12.5 13.8154 11.9404 14.375 11.25 14.375H6.875C6.18464 14.375 5.625 13.8154 5.625 13.125V8.75C5.625 8.05964 6.18464 7.5 6.875 7.5H9.16667"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>
        </div>
      </div>
    </article>
  )
}

export default ProductCard
