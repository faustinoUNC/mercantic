'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import type { GeneralStats, ViewMode } from '@/backend/features/analytics/models/analytics.model'

export function useAnalytics(viewMode: ViewMode = 'days', offset = 0) {
  const [stats, setStats] = useState<GeneralStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const hasLoaded = useRef(false)

  const fetchStats = useCallback(async () => {
    // First load: show full skeleton. Subsequent loads: show refreshing overlay.
    if (hasLoaded.current) {
      setIsRefreshing(true)
    } else {
      setIsLoading(true)
    }
    try {
      const res = await fetch(`/api/analytics/general?viewMode=${viewMode}&offset=${offset}`)
      const data = await res.json()
      setStats(data)
      hasLoaded.current = true
    } catch (err) {
      console.error('[useAnalytics] fetch error:', err)
    } finally {
      setIsLoading(false)
      setIsRefreshing(false)
    }
  }, [viewMode, offset])

  useEffect(() => { fetchStats() }, [fetchStats])

  return { stats, isLoading, isRefreshing, refresh: fetchStats }
}
