import { createClient } from '@/lib/supabase/server'
import type {
  Product, ProductWithVariants,
  CreateProductPayload, CreateVariantPayload,
  UpdateVariantPayload, UpdateProductPayload,
} from '../models/product.model'

export async function getAllProducts(): Promise<ProductWithVariants[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('products')
    .select('*, variants:product_variants(*)')
    .eq('active', true)
    .order('featured', { ascending: false })
    .order('created_at')

  if (error) throw new Error(error.message)
  return data as ProductWithVariants[]
}

export async function getAllProductsAdmin(): Promise<ProductWithVariants[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('products')
    .select('*, variants:product_variants(*)')
    .order('created_at')

  if (error) throw new Error(error.message)
  return data as ProductWithVariants[]
}

export async function getProductBySlug(slug: string): Promise<ProductWithVariants | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('products')
    .select('*, variants:product_variants(*)')
    .eq('slug', slug)
    .single()

  if (error) return null
  return data as ProductWithVariants
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
