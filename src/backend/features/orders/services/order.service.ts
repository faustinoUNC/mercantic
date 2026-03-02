import * as repo from '../repository/order.repository'
import { getDiscountByCode } from '@/backend/features/discounts/repository/discount.repository'
import type { CreateOrderPayload, OrderComplete, UpdateOrderPayload } from '../models/order.model'

export async function listOrders(): Promise<OrderComplete[]> {
  return repo.getAllOrders()
}

export async function getOrder(id: number): Promise<OrderComplete | null> {
  return repo.getOrderById(id)
}

export async function createOrder(payload: CreateOrderPayload): Promise<OrderComplete> {
  // 1. Crear o reutilizar cliente
  const customer = await repo.createCustomer(payload.customer)

  // 2. Obtener precio de la variante
  const { createClient } = await import('@/lib/supabase/server')
  const supabase = await createClient()
  const { data: variant } = await supabase
    .from('product_variants')
    .select('price')
    .eq('id', payload.variant_id)
    .single()

  if (!variant) throw new Error('Variante no encontrada')

  const unitPrice = variant.price
  const quantity = payload.quantity ?? 1

  // 3. Aplicar descuento si existe
  let discountCodeId: string | null = null
  let discountAmount = 0

  if (payload.discount_code) {
    const code = await getDiscountByCode(payload.discount_code)
    if (code && code.active && (!code.max_uses || code.times_used < code.max_uses)) {
      discountCodeId = code.id
      discountAmount = (unitPrice * quantity * code.discount_percentage) / 100
    }
  }

  const finalAmount = unitPrice * quantity - discountAmount

  // 4. Crear pedido
  return repo.createOrder({
    customer_id: customer.id,
    variant_id: payload.variant_id,
    quantity,
    unit_price: unitPrice,
    discount_code_id: discountCodeId,
    discount_amount: discountAmount,
    final_amount: finalAmount,
    payment_method: payload.payment_method,
    notes: payload.notes,
    shipping_address: payload.shipping_address,
    city: payload.city,
    province: payload.province,
    postal_code: payload.postal_code,
  })
}

export async function updateOrderStatus(id: number, payload: UpdateOrderPayload): Promise<OrderComplete> {
  const updates: Record<string, unknown> = { ...payload }
  if (payload.payment_status === 'paid') updates.paid_at = new Date().toISOString()
  if (payload.delivery_status === 'shipped') updates.shipped_at = new Date().toISOString()
  return repo.updateOrder(id, updates)
}
