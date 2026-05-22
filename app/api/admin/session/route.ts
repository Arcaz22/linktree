import { NextRequest, NextResponse } from 'next/server'

import { readAdminSession } from '@/app/lib/admin-auth'

export async function GET(request: NextRequest) {
  const session = readAdminSession(request.cookies.get('admin_session')?.value)

  if (!session) {
    return NextResponse.json({ authenticated: false })
  }

  return NextResponse.json({ authenticated: true, username: session.username })
}
