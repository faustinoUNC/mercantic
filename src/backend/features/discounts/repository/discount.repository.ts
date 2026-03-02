import { createClient } from '@/lib/supabase/server'
import type { DiscountCode, CreateDiscountPayload, UpdateDiscountPayload } from '../models/discount.model'

export async function getAllDiscounts(): Promise<DiscountCode[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('discount_codes')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw new Error(error.message)
  return data as DiscountCode[]
}

export async function getDiscountByCode(code: string): Promise<DiscountCode | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('discount_codes')
    .select('*')
    .eq('code', code.toUpperCase())
    .single()

  if (error) return null
  return data as DiscountCode
}

export async function createDiscount(payload: CreateDiscountPayload): Promise<DiscountCode> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('discount_codes')
    .insert({ ...payload, code: payload.code.toUpperCase() })
    .select()
    .single()

  if (error) throw new Error(error.message)
  return data as DiscountCode
}

export async function updateDiscount(id: string, payload: UpdateDiscountPayload): Promise<DiscountCode> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('discount_codes')
    .update(payload)
    .eq('id', id)
    .select()
    .single()

  if (error) throw new Error(error.message)
  return data as DiscountCode
}

export async function deleteDiscount(id: string): Promise<void> {
  const supabase = await createClient()
  const { error } = await supabase.from('discount_codes').delete().eq('id', id)
  if (error) throw new Error(error.message)
}

export async function incrementDiscountUsage(id: string): Promise<void> {
  const supabase = await createClient()
  const { error } = await supabase.rpc('increment_discount_usage', { discount_id: id })
  if (error) {
    // Fallback manual si no existe la función RPC
    const { data: current } = await supabase.from('discount_codes').select('times_used').eq('id', id).single()
    await supabase.from('discount_codes').update({ times_used: (current?.times_used ?? 0) + 1 }).eq('id', id)
  }
}

export async function getDiscountStats() {
  const supabase = await createClient()
  const { data: codes } = await supabase.from('discount_codes').select('*').order('created_at', { ascending: false })
  const { data: orders } = await supabase
    .from('orders')
    .select('discount_code_id, payment_status, final_amount, discount_amount')
    .not('discount_code_id', 'is', null)

  return { codes: codes ?? [], orders: orders ?? [] }
}
