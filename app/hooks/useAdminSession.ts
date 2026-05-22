'use client'

import { useEffect, useState } from 'react'

type SessionState =
  | { status: 'loading'; username: null; error: string }
  | { status: 'authenticated'; username: string; error: string }
  | { status: 'unauthenticated'; username: null; error: string }

async function parseJson<T>(response: Response): Promise<T> {
  const data = await response.json()

  if (!response.ok) {
    throw new Error(data?.error || 'Request failed')
  }

  return data as T
}

export function useAdminSession() {
  const [session, setSession] = useState<SessionState>({
    status: 'loading',
    username: null,
    error: '',
  })
  const [submitting, setSubmitting] = useState(false)

  async function refreshSession() {
    try {
      const data = await parseJson<{ authenticated: boolean; username?: string }> (
        await fetch('/api/admin/session', { cache: 'no-store' }),
      )

      if (data.authenticated && data.username) {
        setSession({ status: 'authenticated', username: data.username, error: '' })
        return true
      }

      setSession({ status: 'unauthenticated', username: null, error: '' })
      return false
    } catch {
      setSession({ status: 'unauthenticated', username: null, error: '' })
      return false
    }
  }

  useEffect(() => {
    let active = true

    async function syncSession() {
      try {
        const data = await parseJson<{ authenticated: boolean; username?: string }>(
          await fetch('/api/admin/session', { cache: 'no-store' }),
        )

        if (!active) return

        if (data.authenticated && data.username) {
          setSession({ status: 'authenticated', username: data.username, error: '' })
          return
        }

        setSession({ status: 'unauthenticated', username: null, error: '' })
      } catch {
        if (!active) return
        setSession({ status: 'unauthenticated', username: null, error: '' })
      }
    }

    void syncSession()

    return () => {
      active = false
    }
  }, [])

  async function login(username: string, password: string) {
    setSubmitting(true)
    try {
      const data = await parseJson<{ username: string }>(
        await fetch('/api/admin/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password }),
        }),
      )

      setSession({ status: 'authenticated', username: data.username, error: '' })
      return true
    } catch (error) {
      setSession({
        status: 'unauthenticated',
        username: null,
        error: error instanceof Error ? error.message : 'Login gagal',
      })
      return false
    } finally {
      setSubmitting(false)
    }
  }

  async function logout() {
    setSubmitting(true)
    try {
      await fetch('/api/admin/logout', { method: 'POST' })
    } finally {
      setSession({ status: 'unauthenticated', username: null, error: '' })
      setSubmitting(false)
    }
  }

  return {
    ...session,
    submitting,
    login,
    logout,
    refreshSession,
  }
}
