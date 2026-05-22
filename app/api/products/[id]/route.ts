import { NextRequest, NextResponse } from 'next/server'

import { createUnauthorizedResponse, isAdminRequest } from '@/app/lib/admin-auth'
import { deleteProduct, upsertProduct } from '@/app/lib/db'
import { Product } from '@/types'

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  if (!isAdminRequest(req)) {
    return createUnauthorizedResponse()
  }

  try {
    const partial: Partial<Product> = await req.json()
    const product = { ...partial, id: params.id } as Product
    await upsertProduct(product)
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  if (!isAdminRequest(req)) {
    return createUnauthorizedResponse()
  }

  try {
    await deleteProduct(params.id)
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 })
  }
}
