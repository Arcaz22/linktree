import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'

import { createUnauthorizedResponse, isAdminRequest } from '@/app/lib/admin-auth'
import { upsertProduct } from '@/app/lib/db'
import { Product } from '@/types'

function revalidatePublicProductPages() {
  revalidatePath('/')
  revalidatePath('/products')
}

export async function POST(req: NextRequest) {
  if (!isAdminRequest(req)) {
    return createUnauthorizedResponse()
  }

  try {
    const product: Product = await req.json()
    await upsertProduct(product)
    revalidatePublicProductPages()
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('POST /api/products error:', err)
    return NextResponse.json({ error: 'Failed to save product' }, { status: 500 })
  }
}
