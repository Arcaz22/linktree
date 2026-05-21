import fs from 'fs'
import path from 'path'
import Image from 'next/image'
import Link from 'next/link'
import { ProfileData } from '@/types'
import SocialIcons from '@/components/SocialIcons'

function getData(): ProfileData {
  const raw = fs.readFileSync(path.join(process.cwd(), 'data', 'profile.json'), 'utf-8')
  return JSON.parse(raw)
}

export default function Home() {
  const data = getData()
  const { profile, socials, products } = data

  const activeProducts = [...products]
    .filter(product => product.isActive)
    .sort((a, b) => a.position - b.position)

  return (
    <main className="flex min-h-screen items-center bg-(--cream) text-(--ink)">
      <div className="mx-auto w-full max-w-4xl px-5 py-8 sm:px-8 sm:py-12">
        <section className="hero-shell relative overflow-hidden rounded-[36px] px-6 py-8 sm:px-10 sm:py-12">
          <div className="pointer-events-none absolute inset-0 opacity-90"
            style={{ background: 'radial-gradient(circle at top right, rgba(190, 102, 69, 0.18), transparent 32%)' }} />

          <div className="relative flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
            <div className="max-w-2xl">
              <p className="text-xs uppercase tracking-[0.24em]" style={{ color: 'var(--terracotta)' }}>
                Feed publik
              </p>
              <h1 className="mt-4 font-display text-4xl leading-none sm:text-6xl">
                Personal Reviews
              </h1>
              <p className="mt-5 max-w-xl text-base leading-8 sm:text-lg" style={{ color: 'var(--ink-soft)' }}>
                {profile.intro}
              </p>
            </div>

            <div className="flex justify-center rounded-[28px] border p-4 sm:w-[320px]"
              style={{ borderColor: 'var(--border)', background: 'rgba(255, 251, 245, 0.72)' }}>
              <div className="relative h-48 w-48 overflow-hidden rounded-4xl border sm:h-64 sm:w-64"
                style={{ borderColor: 'var(--border-strong)' }}>
                <Image
                  src={profile.avatar}
                  alt={profile.name}
                  fill
                  sizes="1000px"
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          </div>

          <div className="relative mt-8 flex flex-col gap-4 border-t pt-5 sm:flex-row sm:items-center sm:justify-between"
            style={{ borderColor: 'var(--border)' }}>
            <SocialIcons socials={socials} />
            <Link
              href="/products"
              className="inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-semibold transition-transform hover:-translate-y-0.5"
              style={{ background: 'var(--terracotta)', color: 'var(--paper)' }}
            >
              Lihat {activeProducts.length} Ulasan Terbaru
            </Link>
          </div>
        </section>
      </div>
    </main>
  )
}
