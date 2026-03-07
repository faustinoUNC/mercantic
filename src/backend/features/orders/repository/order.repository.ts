import { createClient } from '@/lib/supabase/server'
import type { OrderComplete, UpdateOrderPayload, Customer } from '../models/order.model'

const ORDER_SELECT = `
  *,
  customer:customers(*),
  variant:product_variants(*, product:products(name, slug)),
  discount_code:discount_codes(code)
`

export async function getAllOrders(): Promise<OrderComplete[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('orders')
    .select(ORDER_SELECT)
    .order('created_at', { ascending: false })

  if (error) throw new Error(error.message)
  return data as OrderComplete[]
}

export async function getOrderById(id: number): Promise<OrderComplete | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('orders')
    .select(ORDER_SELECT)
    .eq('id', id)
    .single()

  if (error) return null
  return data as OrderComplete
}

export async function createCustomer(payload: {
  name: string; email?: string; phone?: string; dni?: string
}): Promise<Customer> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('customers')
    .insert(payload)
    .select()
    .single()

  if (error) throw new Error(error.message)
  return data as Customer
}

export async function createOrder(payload: {
  customer_id: string
  variant_id?: string | null
  quantity: number
  unit_price: number
  discount_code_id?: string | null
  discount_amount: number
  final_amount: number
  payment_method: string
  payment_status?: string
  paid_at?: string
  notes?: string
  shipping_address?: string
  city?: string
  province?: string
  postal_code?: string
}, orderItems?: { variant_id: string; quantity: number; unit_price: number; subtotal: number }[]): Promise<OrderComplete> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('orders')
    .insert(payload)
    .select(ORDER_SELECT)
    .single()

  if (error) throw new Error(error.message)
  const order = data as OrderComplete

  // Insert order_items if provided
  if (orderItems && orderItems.length > 0) {
    const rows = orderItems.map(i => ({ order_id: order.id, ...i }))
    const { error: itemsError } = await supabase.from('order_items').insert(rows)
    // Non-fatal: table may not exist yet if migration hasn't been applied
    if (itemsError && !itemsError.message.includes('order_items')) {
      console.error('order_items insert error:', itemsError.message)
    }
  }

  return order
}

export async function updateOrder(id: number, payload: UpdateOrderPayload & {
  paid_at?: string | null
  shipped_at?: string | null
  mp_payment_id?: string
  mp_preference_id?: string
}): Promise<OrderComplete> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('orders')
    .update(payload)
    .eq('id', id)
    .select(ORDER_SELECT)
    .single()

  if (error) throw new Error(error.message)
  return data as OrderComplete
}
