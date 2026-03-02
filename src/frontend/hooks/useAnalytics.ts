'use client'

import { useState, useEffect, useCallback } from 'react'
import type { GeneralStats, ViewMode } from '@/backend/features/analytics/models/analytics.model'

export function useAnalytics(viewMode: ViewMode = 'days', offset = 0) {
  const [stats, setStats] = useState<GeneralStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const fetchStats = useCallback(async () => {
    setIsLoading(true)
    try {
      const res = await fetch(`/api/analytics/general?viewMode=${viewMode}&offset=${offset}`)
      const data = await res.json()
      setStats(data)
    } catch (err) {
      console.error('[useAnalytics] fetch error:', err)
    } finally {
      setIsLoading(false)
    }
  }, [viewMode, offset])

  useEffect(() => { fetchStats() }, [fetchStats])

  return { stats, isLoading, refresh: fetchStats }
}
