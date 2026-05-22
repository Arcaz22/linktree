import type { Metadata } from "next";
import "./globals.css";
import { getSiteData } from '@/app/lib/site-data'

export async function generateMetadata(): Promise<Metadata> {
  const { profile, siteUrl } = await getSiteData()
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
