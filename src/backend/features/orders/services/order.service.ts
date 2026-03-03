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
  const { createClient } = await import('@/lib/supabase/server')
  const supabase = await createClient()

  // 1. Crear cliente
  const customer = await repo.createCustomer(payload.customer)

  // 2. Normalise to items array (supports both legacy single-item and new multi-item)
  const rawItems: { variant_id: string; quantity: number }[] = payload.items && payload.items.length > 0
    ? payload.items
    : payload.variant_id
      ? [{ variant_id: payload.variant_id, quantity: payload.quantity ?? 1 }]
      : []

  if (rawItems.length === 0) throw new Error('Se requiere al menos un item')

  // 3. Obtener precios de todas las variantes
  const variantIds = rawItems.map(i => i.variant_id)
  const { data: variants } = await supabase
    .from('product_variants')
    .select('id, price')
    .in('id', variantIds)

  if (!variants || variants.length === 0) throw new Error('Variantes no encontradas')

  const priceMap = Object.fromEntries(variants.map(v => [v.id, v.price as number]))

  // 4. Calcular subtotales
  let grossAmount = 0
  const orderItems = rawItems.map(i => {
    const unitPrice = priceMap[i.variant_id]
    if (!unitPrice) throw new Error(`Variante ${i.variant_id} no encontrada`)
    const sub = unitPrice * i.quantity
    grossAmount += sub
    return { variant_id: i.variant_id, quantity: i.quantity, unit_price: unitPrice, subtotal: sub }
  })

  // 5. Aplicar descuento si existe
  let discountCodeId: string | null = null
  let discountAmount = 0

  if (payload.discount_code) {
    const code = await getDiscountByCode(payload.discount_code)
    if (code && code.active && (!code.max_uses || code.times_used < code.max_uses)) {
      discountCodeId = code.id
      discountAmount = (grossAmount * code.discount_percentage) / 100
    }
  }

  const finalAmount = grossAmount - discountAmount

  // 6. Crear pedido (usa variant_id del primer item para compatibilidad con esquema existente)
  return repo.createOrder({
    customer_id: customer.id,
    variant_id: rawItems[0].variant_id,
    quantity: rawItems.reduce((s, i) => s + i.quantity, 0),
    unit_price: orderItems[0].unit_price,
    discount_code_id: discountCodeId,
    discount_amount: discountAmount,
    final_amount: finalAmount,
    payment_method: payload.payment_method,
    notes: payload.notes,
    shipping_address: payload.shipping_address,
    city: payload.city,
    province: payload.province,
    postal_code: payload.postal_code,
  }, orderItems)
}

export async function updateOrderStatus(id: number, payload: UpdateOrderPayload): Promise<OrderComplete> {
  const updates: Record<string, unknown> = { ...payload }
  if (payload.payment_status === 'paid') updates.paid_at = new Date().toISOString()
  if (payload.delivery_status === 'shipped') updates.shipped_at = new Date().toISOString()
  return repo.updateOrder(id, updates)
}
