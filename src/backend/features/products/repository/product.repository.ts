import { createClient } from '@/lib/supabase/server'
import { decodeImageUrls } from '@/lib/utils/images'
import type {
  Product, ProductWithVariants,
  CreateProductPayload, CreateVariantPayload,
  UpdateVariantPayload, UpdateProductPayload,
} from '../models/product.model'

/** Normalizes image_urls: prefers the text[] column, falls back to decoding image_url. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function normalize(p: any): ProductWithVariants {
  const image_urls = p.image_urls?.length ? p.image_urls : decodeImageUrls(p.image_url)
  return { ...p, image_urls }
}

export async function getAllProducts(): Promise<ProductWithVariants[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('products')
    .select('*, variants:product_variants(*)')
    .eq('active', true)
    .is('deleted_at', null)
    .order('featured', { ascending: false })
    .order('created_at')
    .order('name')

  if (error) throw new Error(error.message)
  return (data as any[]).map(normalize)
}

export async function getAllProductsAdmin(): Promise<ProductWithVariants[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('products')
    .select('*, variants:product_variants(*)')
    .is('deleted_at', null)
    .order('created_at')

  if (error) throw new Error(error.message)
  return (data as any[]).map(normalize)
}

export async function getProductBySlug(slug: string): Promise<ProductWithVariants | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('products')
    .select('*, variants:product_variants(*)')
    .eq('slug', slug)
    .is('deleted_at', null)
    .single()

  if (error) return null
  return normalize(data)
}

export async function createProduct(payload: CreateProductPayload): Promise<Product> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('products')
    .insert({ ...payload, active: true })
    .select()
    .single()

  if (error) throw new Error(error.message)
  return data as Product
}

export async function createVariant(payload: CreateVariantPayload) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('product_variants')
    .insert({ ...payload, active: true })
    .select()
    .single()

  if (error) throw new Error(error.message)
  return data
}

export async function updateProduct(id: string, payload: UpdateProductPayload): Promise<Product> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('products')
    .update(payload)
    .eq('id', id)
    .select()
    .single()

  if (error) throw new Error(error.message)
  return data as Product
}

export async function updateVariant(id: string, payload: UpdateVariantPayload) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('product_variants')
    .update(payload)
    .eq('id', id)
    .select()
    .single()

  if (error) throw new Error(error.message)
  return data
}

export async function deleteVariant(id: string): Promise<void> {
  const supabase = await createClient()
  const { error } = await supabase.from('product_variants').delete().eq('id', id)
  if (error) throw new Error(error.message)
}

/** Soft delete: marks deleted_at instead of removing the row. */
export async function deleteProduct(id: string): Promise<void> {
  const supabase = await createClient()
  const { error } = await supabase
    .from('products')
    .update({ deleted_at: new Date().toISOString() })
    .eq('id', id)
  if (error) throw new Error(error.message)
}

/** Restore a soft-deleted product. */
export async function restoreProduct(id: string): Promise<void> {
  const supabase = await createClient()
  const { error } = await supabase
    .from('products')
    .update({ deleted_at: null })
    .eq('id', id)
  if (error) throw new Error(error.message)
}

/** List soft-deleted products (for admin archive view). */
export async function getDeletedProducts(): Promise<ProductWithVariants[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('products')
    .select('*, variants:product_variants(*)')
    .not('deleted_at', 'is', null)
    .order('deleted_at', { ascending: false })

  if (error) throw new Error(error.message)
  return (data as any[]).map(normalize)
}
