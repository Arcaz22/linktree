import { NextResponse } from 'next/server'

import { getSiteData } from '@/app/lib/site-data'

export async function GET() {
  try {
    return NextResponse.json(await getSiteData())
  } catch (err) {
    console.error('GET /api/profile error:', err)
    return NextResponse.json({ error: 'Failed to load data' }, { status: 500 })
  }
}
