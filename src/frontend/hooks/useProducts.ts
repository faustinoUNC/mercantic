'use client'

import { useState, useEffect, useCallback } from 'react'
import type {
  ProductWithVariants,
  CreateProductPayload, CreateVariantPayload,
  UpdateProductPayload, UpdateVariantPayload,
} from '@/backend/features/products/models/product.model'

export function useProducts(admin = false) {
  const [products, setProducts] = useState<ProductWithVariants[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchProducts = useCallback(async () => {
    setIsLoading(true)
    try {
      const url = admin ? '/api/products?admin=true' : '/api/products'
      const res = await fetch(url)
      const data = await res.json()
      setProducts(data.products ?? [])
    } catch (err) {
      console.error('[useProducts] fetch error:', err)
    } finally {
      setIsLoading(false)
    }
  }, [admin])

  const createProduct = useCallback(async (payload: CreateProductPayload) => {
    const res = await fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'product', ...payload }),
    })
    const data = await res.json()
    if (res.ok) await fetchProducts()
    return { ok: res.ok, product: data.product, error: data.error }
  }, [fetchProducts])

  const createVariant = useCallback(async (payload: CreateVariantPayload) => {
    const res = await fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'variant', ...payload }),
    })
    const data = await res.json()
    if (res.ok) await fetchProducts()
    return { ok: res.ok, variant: data.variant, error: data.error }
  }, [fetchProducts])

  const updateProduct = useCallback(async (id: string, payload: UpdateProductPayload) => {
    const res = await fetch('/api/products', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'product', id, ...payload }),
    })
    if (res.ok) await fetchProducts()
    return res.ok
  }, [fetchProducts])

  const updateVariant = useCallback(async (id: string, payload: UpdateVariantPayload) => {
    const res = await fetch('/api/products', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'variant', id, ...payload }),
    })
    if (res.ok) await fetchProducts()
    return res.ok
  }, [fetchProducts])

  const deleteVariant = useCallback(async (id: string) => {
    const res = await fetch('/api/products', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'variant', id }),
    })
    if (res.ok) await fetchProducts()
    return res.ok
  }, [fetchProducts])

  const deleteProduct = useCallback(async (id: string) => {
    const res = await fetch('/api/products', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'product', id }),
    })
    if (res.ok) await fetchProducts()
    return res.ok
  }, [fetchProducts])

  useEffect(() => { fetchProducts() }, [fetchProducts])

  return { products, isLoading, refresh: fetchProducts, createProduct, createVariant, updateProduct, updateVariant, deleteVariant, deleteProduct }
}
