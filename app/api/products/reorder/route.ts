import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'

import { createUnauthorizedResponse, isAdminRequest } from '@/app/lib/admin-auth'
import { updateProductPositions } from '@/app/lib/db'

export async function POST(req: NextRequest) {
  if (!isAdminRequest(req)) {
    return createUnauthorizedResponse()
  }

  try {
    const { positions } = await req.json()
    await updateProductPositions(positions)
    revalidatePath('/')
    revalidatePath('/products')
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Failed to reorder' }, { status: 500 })
  }
}
