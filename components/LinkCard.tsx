'use client'

import { Link } from '@/types'
import {
  Globe, Mail, FileText, ExternalLink,
  Music, Phone, MapPin, Star, Heart, Zap,
} from 'lucide-react'

const iconMap: Record<string, React.ComponentType<{ size?: number }>> = {
  globe: Globe, mail: Mail, file: FileText, music: Music,
  phone: Phone, map: MapPin, star: Star, heart: Heart, zap: Zap,
}

export default function LinkCard({ link }: { link: Link }) {
  const Icon = iconMap[link.icon || 'globe'] ?? Globe

  return (
    <a
      href={link.url}
      target={link.url.startsWith('mailto:') ? '_self' : '_blank'}
      rel="noopener noreferrer"
      className="link-btn-glow group relative flex items-center gap-3 w-full px-5 py-3.5 rounded-2xl border border-white/10 transition-all duration-300"
      style={{ background: `${link.color || '#534AB7'}18` }}
    >
      {/* Icon circle */}
      <span
        className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-white"
        style={{ background: link.color || '#534AB7' }}
      >
        <Icon size={15} />
      </span>

      {/* Title */}
      <span className="flex-1 text-sm font-medium text-white/90 group-hover:text-white transition-colors">
        {link.title}
      </span>

      {/* External arrow */}
      <ExternalLink
        size={14}
        className="text-white/30 group-hover:text-white/60 transition-colors shrink-0"
      />

      {/* Colored left border accent */}
      <span
        className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 rounded-full opacity-60 group-hover:opacity-100 transition-opacity"
        style={{ background: link.color || '#534AB7' }}
      />
    </a>
  )
}
