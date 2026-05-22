import { NextRequest, NextResponse } from 'next/server'

import { createUnauthorizedResponse, isAdminRequest } from '@/app/lib/admin-auth'
import { getSiteData } from '@/app/lib/site-data'

export async function GET(request: NextRequest) {
  if (!isAdminRequest(request)) {
    return createUnauthorizedResponse()
  }

  try {
    const data = await getSiteData()
    return NextResponse.json(data)
  } catch (error) {
    console.error('GET /api/admin/data error:', error)
    return NextResponse.json({ error: 'Failed to load admin data' }, { status: 500 })
  }
}
