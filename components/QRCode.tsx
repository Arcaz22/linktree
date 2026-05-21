'use client'

import { QRCodeSVG } from 'qrcode.react'

export default function QRCode({ url }: { url: string }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <p className="text-xs text-(--text-hint)">Scan to open</p>
      <div className="p-3 rounded-2xl bg-white border border-white/10">
        <QRCodeSVG
          value={url}
          size={96}
          bgColor="#ffffff"
          fgColor="#0a0a0a"
          level="M"
          includeMargin={false}
        />
      </div>
    </div>
  )
}
