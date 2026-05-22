export const DEFAULT_PRODUCT_IMAGE =
  'https://plus.unsplash.com/premium_photo-1683758342885-7acf321f5d53?q=80&w=870&auto=format&fit=crop'

export function getProductImage(image?: string): string {
  return image?.trim() || DEFAULT_PRODUCT_IMAGE
}
