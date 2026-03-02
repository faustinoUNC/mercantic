'use client'

import { useState, useEffect, useCallback } from 'react'
import type { DiscountCode, CreateDiscountPayload, UpdateDiscountPayload } from '@/backend/features/discounts/models/discount.model'

export function useDiscounts() {
  const [discounts, setDiscounts] = useState<DiscountCode[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchDiscounts = useCallback(async () => {
    setIsLoading(true)
    try {
      const res = await fetch('/api/discounts')
      const data = await res.json()
      setDiscounts(data.discounts ?? [])
    } catch (err) {
      console.error('[useDiscounts] fetch error:', err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const createDiscount = useCallback(async (payload: CreateDiscountPayload) => {
    const res = await fetch('/api/discounts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    if (res.ok) await fetchDiscounts()
    return res
  }, [fetchDiscounts])

  const updateDiscount = useCallback(async (id: string, payload: UpdateDiscountPayload) => {
    const res = await fetch(`/api/discounts/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    if (res.ok) await fetchDiscounts()
    return res.ok
  }, [fetchDiscounts])

  const deleteDiscount = useCallback(async (id: string) => {
    const res = await fetch(`/api/discounts/${id}`, { method: 'DELETE' })
    if (res.ok) await fetchDiscounts()
    return res.ok
  }, [fetchDiscounts])

  useEffect(() => { fetchDiscounts() }, [fetchDiscounts])

  return { discounts, isLoading, refresh: fetchDiscounts, createDiscount, updateDiscount, deleteDiscount }
}
