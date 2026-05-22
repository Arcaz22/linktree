import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'

import ProductGrid from '@/components/ProductGrid'
import { getSiteData } from '@/app/lib/site-data'

export default async function ProductsPage() {
  const data = await getSiteData()
  const { profile, products } = data

  const activeProducts = [...products]
    .filter(product => product.isActive)
    .sort((a, b) => a.position - b.position)
  const categories = ['All', ...Array.from(new Set(activeProducts.map((product) => product.category).filter(Boolean)))]

  return (
    <main className="min-h-screen bg-(--cream) text-(--ink)">
      <div className="mx-auto max-w-4xl px-5 pb-20 pt-8 sm:px-8 sm:pt-12">
        <section className="rounded-[36px] border px-6 py-8 sm:px-10 sm:py-10"
          style={{ borderColor: 'var(--border)', background: 'rgba(255, 251, 245, 0.82)' }}>
          <div className="flex flex-col gap-5 sm:flex-row sm:items-stretch sm:justify-between">
            <div className="max-w-2xl">
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em]"
                style={{ color: 'var(--terracotta)' }}
              >
                <ChevronLeft size={14} />
                Kembali
              </Link>
              <h1 className="mt-4 font-display text-4xl leading-none sm:text-5xl">
                Catatan Ulasan
              </h1>
              <p className="mt-4 max-w-xl text-base leading-8" style={{ color: 'var(--ink-soft)' }}>
                Kumpulan produk dan utilitas harian yang dikurasi langsung oleh {profile.name}. Gunakan fitur pencarian atau kategori untuk menemukan ulasan.
              </p>
            </div>

            <div className="flex min-w-50 flex-col justify-between rounded-3xl border px-5 py-5 sm:max-w-55"
              style={{ borderColor: 'var(--border)', background: 'var(--paper)' }}>

              <div className="mt-4">
                <p className="font-display text-4xl leading-none" style={{ color: 'var(--ink)' }}>
                  {activeProducts.length}
                </p>
                <p className="mt-2 text-sm leading-6" style={{ color: 'var(--ink-muted)' }}>
                  ulasan aktif saat ini
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-8">
          <ProductGrid products={activeProducts} categories={categories} />
        </section>
      </div>
    </main>
  )
}
