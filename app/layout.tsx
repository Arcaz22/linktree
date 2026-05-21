import type { Metadata } from "next";
import "./globals.css";
import fs from 'fs'
import path from 'path'

function getProfile() {
  try {
    const raw = fs.readFileSync(path.join(process.cwd(), 'data', 'profile.json'), 'utf-8')
    return JSON.parse(raw)
  } catch {
    return { profile: { name: 'My Picks' }, siteUrl: '' }
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const { profile, siteUrl } = getProfile()
  return {
    title: `${profile.name} — Ulasan Pribadi`,
    description: profile.intro,
    metadataBase: new URL(siteUrl || 'https://localhost:3000'),
    openGraph: {
      title: `${profile.name} — Ulasan Pribadi`,
      description: profile.intro,
      images: profile.avatar ? [{ url: profile.avatar }] : [],
    },
  }
}


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className="h-full antialiased"
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
