export interface Product {
  id: string
  name: string
  description: string
  category: string
  image: string
  image_url?: string
  affiliateUrl: string
  isActive: boolean
  position: number
}

export interface SocialLinks {
  threads: string
  medium: string
  web: string
}

export interface ProfileInfo {
  name: string
  avatar: string
  intro: string
}

export interface ProfileData {
  profile: ProfileInfo
  socials: SocialLinks
  products: Product[]
  siteUrl: string
}
