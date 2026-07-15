/**
 * useApiQuery — a tiny fetch-state hook for the data seam.
 *
 * Deliberately dependency-free (no TanStack Query yet) so Phase 1 adds no new
 * runtime deps. It exposes the four states every page needs — loading, error,
 * empty, data — plus `refetch`, and cancels in-flight requests on unmount.
 */

import { useCallback, useEffect, useRef, useState } from 'react'
import { ApiError } from '@/platform/api/types'

export interface QueryState<T> {
  data: T | null
  loading: boolean
  error: ApiError | null
  refetch: () => void
}

/**
 * @param fetcher  Called with an AbortSignal; should return the parsed response.
 * @param deps     Re-runs the query when these change (like useEffect deps).
 * @param enabled  When false, the query is idle (no fetch) — useful for gating.
 */
export function useApiQuery<T>(
  fetcher: (signal: AbortSignal) => Promise<T>,
  deps: readonly unknown[] = [],
  enabled = true,
): QueryState<T> {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState<boolean>(enabled)
  const [error, setError] = useState<ApiError | null>(null)
  const [nonce, setNonce] = useState(0)

  // Keep the latest fetcher without making it a dependency of the effect.
  const fetcherRef = useRef(fetcher)
  fetcherRef.current = fetcher

  const refetch = useCallback(() => setNonce((n) => n + 1), [])

  useEffect(() => {
    if (!enabled) {
      setLoading(false)
      return
    }
    const controller = new AbortController()
    let active = true
    setLoading(true)
    setError(null)

    fetcherRef
      .current(controller.signal)
      .then((result) => {
        if (active) {
          setData(result)
          setLoading(false)
        }
      })
      .catch((err) => {
        if (!active || controller.signal.aborted) return
        setError(
          err instanceof ApiError ? err : new ApiError('Unexpected error.', 'unknown', 0),
        )
        setLoading(false)
      })

    return () => {
      active = false
      controller.abort()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, nonce, ...deps])

  return { data, loading, error, refetch }
}
