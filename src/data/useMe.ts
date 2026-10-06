import { useCallback, useEffect, useState } from 'react'
import { fetchMe, type MeResult } from '../api/auth'
import { ApiError } from '../api/client'

/**
 * Loads `GET /api/users/me` — the member's own record: profile, verification
 * status, rejection reason and any call the admin scheduled. Panels that used
 * to read a local demo profile read this instead.
 */
export function useMe(enabled = true): {
  me: MeResult | null
  loading: boolean
  error: string | null
  reload: () => void
} {
  const [me, setMe] = useState<MeResult | null>(null)
  const [loading, setLoading] = useState(enabled)
  const [error, setError] = useState<string | null>(null)
  const [version, setVersion] = useState(0)

  useEffect(() => {
    if (!enabled) return undefined
    let alive = true
    void (async () => {
      try {
        const result = await fetchMe()
        if (alive) {
          setMe(result)
          setError(null)
        }
      } catch (caught) {
        if (alive) {
          setError(caught instanceof ApiError ? caught.message : 'Could not load your account.')
        }
      } finally {
        if (alive) setLoading(false)
      }
    })()
    return () => {
      alive = false
    }
  }, [enabled, version])

  const reload = useCallback(() => setVersion((value) => value + 1), [])

  return { me, loading, error, reload }
}
