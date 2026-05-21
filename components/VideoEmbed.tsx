'use client'

import { Embed } from '@/types'

function getThreadsData(url: string): { username: string; postId: string } | null {
  const match = url.match(/threads\.net\/@([a-zA-Z0-9_.-]+)\/post\/([a-zA-Z0-9_-]+)/)
  return match ? { username: match[1], postId: match[2] } : null
}

export default function ContentEmbed({ embed }: { embed: Embed }) {
  if (embed.type === 'threads') {
    const threadsData = getThreadsData(embed.url)
    if (!threadsData) return null

    return (
      <div className="w-full">
        {embed.title && (
          <p className="text-xs text-(--text-hint) mb-2 text-center">{embed.title}</p>
        )}
        <div className="relative w-full rounded-2xl overflow-hidden border border-black/5 dark:border-white/10" style={{ minHeight: '350px' }}>
          <iframe
            className="w-full h-full min-h-87.5"
            src={`https://www.threads.net/embed/post/${threadsData.postId}`}
            title={embed.title || 'Threads post'}
            allowFullScreen
            scrolling="no"
            frameBorder="0"
          />
        </div>
      </div>
    )
  }

  if (embed.type === 'medium') {
    return (
      <div className="w-full">
        {embed.title && (
          <p className="text-xs text-(--text-hint) mb-2 text-center">Baca Cerita Lengkap</p>
        )}
        <a
          href={embed.url}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full p-5 rounded-2xl border border-black/5 dark:border-white/10 bg-black/2 dark:bg-white/2 hover:bg-black/4 dark:hover:bg-white/4 transition-colors"
        >
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1">
              <span className="text-[10px] uppercase tracking-wider font-semibold text-amber-600 dark:text-amber-500">
                Medium Article
              </span>
              <h4 className="text-sm font-serif font-medium mt-1 text-stone-900 dark:text-stone-100">
                {embed.title || 'Buka artikel lengkap di Medium'}
              </h4>
              <p className="text-xs text-stone-500 dark:text-slate-400 mt-2 line-clamp-2">
                Klik untuk membaca esai dan catatan reflektif mendalam mengenai topik ini di Medium.
              </p>
            </div>
            <div className="shrink-0 text-stone-400">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                <polyline points="15 3 21 3 21 9" />
                <line x1="10" y1="14" x2="21" y2="3" />
              </svg>
            </div>
          </div>
        </a>
      </div>
    )
  }

  return null
}
