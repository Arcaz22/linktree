import 'server-only'

import { createHmac, timingSafeEqual } from 'crypto'

import { NextRequest, NextResponse } from 'next/server'

const ADMIN_COOKIE_NAME = 'admin_session'
const ADMIN_SESSION_TTL_SECONDS = 60 * 60 * 24 * 7

function getEnv(name: 'ADMIN_USERNAME' | 'ADMIN_PASSWORD' | 'ADMIN_SESSION_SECRET') {
  const value = process.env[name]
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`)
  }
  return value
}

function sign(value: string) {
  return createHmac('sha256', getEnv('ADMIN_SESSION_SECRET'))
    .update(value)
    .digest('base64url')
}

function safeEqual(left: string, right: string) {
  const leftBuffer = Buffer.from(left)
  const rightBuffer = Buffer.from(right)

  if (leftBuffer.length !== rightBuffer.length) {
    return false
  }

  return timingSafeEqual(leftBuffer, rightBuffer)
}

export function validateAdminCredentials(username: string, password: string) {
  return (
    safeEqual(username, getEnv('ADMIN_USERNAME')) &&
    safeEqual(password, getEnv('ADMIN_PASSWORD'))
  )
}

export function createAdminSession(username: string) {
  const issuedAt = Date.now().toString()
  const payload = `${username}.${issuedAt}`
  const signature = sign(payload)

  return `${payload}.${signature}`
}

export function readAdminSession(token?: string | null) {
  if (!token) return null

  const [username, issuedAt, signature] = token.split('.')
  if (!username || !issuedAt || !signature) return null

  const payload = `${username}.${issuedAt}`
  const expectedSignature = sign(payload)

  if (!safeEqual(signature, expectedSignature)) {
    return null
  }

  if (!safeEqual(username, getEnv('ADMIN_USERNAME'))) {
    return null
  }

  const issuedAtMs = Number(issuedAt)
  if (!Number.isFinite(issuedAtMs)) {
    return null
  }

  const expiresAt = issuedAtMs + ADMIN_SESSION_TTL_SECONDS * 1000
  if (Date.now() > expiresAt) {
    return null
  }

  return { username }
}

export function isAdminRequest(request: NextRequest) {
  return Boolean(readAdminSession(request.cookies.get(ADMIN_COOKIE_NAME)?.value))
}

export function setAdminSessionCookie(response: NextResponse, username: string) {
  response.cookies.set({
    name: ADMIN_COOKIE_NAME,
    value: createAdminSession(username),
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: ADMIN_SESSION_TTL_SECONDS,
  })
}

export function clearAdminSessionCookie(response: NextResponse) {
  response.cookies.set({
    name: ADMIN_COOKIE_NAME,
    value: '',
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 0,
  })
}

export function createUnauthorizedResponse() {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
}
