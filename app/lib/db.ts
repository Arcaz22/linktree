import 'server-only'

import { Product } from '@/types'
import { getSupabase } from '@/app/lib/supabase'

export async function getProducts(): Promise<Product[]> {
  const { data, error } = await getSupabase()
    .from('products')
    .select('*')
    .order('position', { ascending: true })

  if (error) throw error

  return (data ?? []).map((row) => ({
    id: row.id,
    name: row.name,
    description: row.description ?? '',
    category: row.category ?? '',
    image: row.image ?? '',
    affiliateUrl: row.affiliate_url,
    isActive: row.is_active,
    position: row.position,
  }))
}

export async function upsertProduct(product: Product): Promise<void> {
  const { error } = await getSupabase().from('products').upsert({
    id: product.id,
    name: product.name,
    description: product.description,
    category: product.category,
    image: product.image,
    affiliate_url: product.affiliateUrl,
    is_active: product.isActive,
    position: product.position,
  })

  if (error) throw error
}

export async function deleteProduct(id: string): Promise<void> {
  const { error } = await getSupabase().from('products').delete().eq('id', id)

  if (error) throw error
}

export async function updateProductPositions(products: { id: string; position: number }[]): Promise<void> {
  for (const product of products) {
    const { error } = await getSupabase()
      .from('products')
      .update({ position: product.position })
      .eq('id', product.id)

    if (error) throw error
  }
}
