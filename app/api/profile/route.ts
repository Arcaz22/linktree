import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const DATA_PATH = path.join(process.cwd(), 'data', 'profile.json')

export async function GET() {
  try {
    const raw = fs.readFileSync(DATA_PATH, 'utf-8')
    const data = JSON.parse(raw)
    return NextResponse.json(data)
  } catch (err) {
    console.error('Failed to read profile.json:', err)
    return NextResponse.json({ error: 'Failed to read profile' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    if (
      !body?.profile ||
      !body?.socials ||
      !Array.isArray(body?.products) ||
      typeof body?.siteUrl !== 'string'
    ) {
      return NextResponse.json({ error: 'Invalid data structure' }, { status: 400 })
    }

    fs.writeFileSync(DATA_PATH, JSON.stringify(body, null, 2), 'utf-8')

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Failed to write profile.json:', err)
    return NextResponse.json({ error: 'Failed to save profile' }, { status: 500 })
  }
}
