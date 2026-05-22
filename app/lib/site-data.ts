import 'server-only'

import fs from 'fs'
import path from 'path'

import { ProfileData } from '@/types'
import { getProducts } from '@/app/lib/db'
import { isSupabaseConfigured } from '@/app/lib/supabase'

function getFileData(): ProfileData {
  const raw = fs.readFileSync(path.join(process.cwd(), 'data', 'profile.json'), 'utf-8')
  return JSON.parse(raw) as ProfileData
}

export async function getSiteData(): Promise<ProfileData> {
  const fileData = getFileData()

  if (!isSupabaseConfigured()) {
    return fileData
  }

  try {
    const products = await getProducts()

    return {
      profile: fileData.profile,
      socials: fileData.socials,
      products,
      siteUrl: fileData.siteUrl,
    }
  } catch {
    return fileData
  }
}
