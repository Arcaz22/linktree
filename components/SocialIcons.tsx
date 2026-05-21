'use client'

import { SocialLinks } from '@/types'

const ITEMS = [
  {
    key: 'threads',
    label: 'Threads',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 12c-2.3 0-4.5-.3-4.5-2.5S9.7 7 12 7s4.5 2.2 4.5 4.5v1.2c0 1.2-.5 2.3-1.5 2.3s-1.5-1.1-1.5-2.3V11.5c0-1.9-1.3-3.5-3.5-3.5S6.5 9.6 6.5 11.5M12 21a9 9 0 1 1 6.5-2.7" />
      </svg>
    ),
  },
  {
    key: 'medium',
    label: 'Medium',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M13.54 12a6.8 6.8 0 0 1-6.77 6.82A6.8 6.8 0 0 1 0 12a6.8 6.8 0 0 1 6.77-6.82A6.8 6.8 0 0 1 13.54 12zm7.42 0c0 3.54-1.51 6.42-3.38 6.42-1.87 0-3.39-2.88-3.39-6.42s1.52-6.42 3.39-6.42 3.38 2.88 3.38 6.42M24 12c0 3.17-.53 5.75-1.19 5.75-.66 0-1.19-2.58-1.19-5.75s.53-5.75 1.19-5.75C23.47 6.25 24 8.83 24 12z" />
      </svg>
    ),
  },
  {
    key: 'web',
    label: 'Web',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="2" y1="12" x2="22" y2="12" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </svg>
    ),
  },
] as const

export default function SocialIcons({ socials }: { socials: SocialLinks }) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      {ITEMS.map(item => {
        const href = socials[item.key]
        if (!href) return null

        return (
          <a
            key={item.key}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={item.label}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border transition-transform hover:-translate-y-0.5"
            style={{
              borderColor: 'var(--border-strong)',
              background: 'rgba(255, 250, 243, 0.82)',
              color: 'var(--ink-soft)',
            }}
          >
            {item.icon}
          </a>
        )
      })}
    </div>
  )
}
