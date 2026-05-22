import { NextRequest, NextResponse } from 'next/server'

import { setAdminSessionCookie, validateAdminCredentials } from '@/app/lib/admin-auth'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const username = typeof body?.username === 'string' ? body.username : ''
    const password = typeof body?.password === 'string' ? body.password : ''

    if (!username || !password || !validateAdminCredentials(username, password)) {
      return NextResponse.json({ error: 'Username atau password salah' }, { status: 401 })
    }

    const response = NextResponse.json({ success: true, username })
    setAdminSessionCookie(response, username)
    return response
  } catch {
    return NextResponse.json({ error: 'Request login tidak valid' }, { status: 400 })
  }
}
