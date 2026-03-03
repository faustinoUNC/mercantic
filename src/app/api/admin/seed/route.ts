import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

const PROVINCES = [
  'Córdoba', 'Buenos Aires', 'Santa Fe', 'Mendoza', 'Tucumán',
  'Salta', 'Entre Ríos', 'Neuquén', 'Río Negro', 'San Juan',
]
const PAYMENT_METHODS = ['transferencia', 'tarjeta', 'efectivo', 'modo'] as const
const PAYMENT_STATUSES = ['paid', 'paid', 'paid', 'pending', 'failed'] as const
const DELIVERY_STATUSES = ['pending', 'shipped', 'delivered'] as const

function rand<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}
function randBetween(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}
function daysAgo(n: number): string {
  const d = new Date()
  d.setDate(d.getDate() - n)
  return d.toISOString()
}

export async function POST() {
  try {
    const supabase = await createClient()

    // Get all active variants
    const { data: variants, error: varError } = await supabase
      .from('product_variants')
      .select('id, price, product_id')
      .eq('active', true)

    if (varError || !variants?.length) {
      return NextResponse.json({ error: 'No hay variantes activas. Crea productos primero.' }, { status: 400 })
    }

    const orders: any[] = []

    for (let i = 0; i < 40; i++) {
      const variant = rand(variants)
      const paymentStatus = rand(PAYMENT_STATUSES)
      const deliveryStatus = paymentStatus === 'paid' ? rand(DELIVERY_STATUSES) : 'pending'
      const province = rand(PROVINCES)
      const daysBack = randBetween(0, 90)
      const price = variant.price + randBetween(-50000, 100000)
      const finalAmount = Math.max(price, 500000)

      orders.push({
        variant_id: variant.id,
        quantity: 1,
        unit_price: finalAmount,
        final_amount: finalAmount,
        discount_amount: 0,
        payment_method: rand(PAYMENT_METHODS),
        payment_status: paymentStatus,
        delivery_status: deliveryStatus,
        province,
        city: province,
        created_at: daysAgo(daysBack),
        paid_at: paymentStatus === 'paid' ? daysAgo(daysBack) : null,
        shipped_at: deliveryStatus === 'shipped' || deliveryStatus === 'delivered' ? daysAgo(daysBack - 1) : null,
      })
    }

    // Create fake customers first
    const customerInserts = orders.map((_, i) => ({
      name: `Cliente Prueba ${i + 1}`,
      phone: `351${String(i).padStart(7, '0')}`,
    }))

    const { data: customers, error: custError } = await supabase
      .from('customers')
      .insert(customerInserts)
      .select('id')

    if (custError) {
      return NextResponse.json({ error: custError.message }, { status: 500 })
    }

    const ordersWithCustomers = orders.map((o, i) => ({
      ...o,
      customer_id: customers![i].id,
    }))

    const { data: inserted, error: ordError } = await supabase
      .from('orders')
      .insert(ordersWithCustomers)
      .select('id')

    if (ordError) {
      return NextResponse.json({ error: ordError.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, count: inserted?.length ?? 0 })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
