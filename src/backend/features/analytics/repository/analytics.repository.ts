import { createClient } from '@/lib/supabase/server'

export async function getOrdersSummary() {
  const supabase = await createClient()
  const { data, error } = await supabase.from('orders').select('payment_status, delivery_status, final_amount, created_at')
  if (error) throw new Error(error.message)
  return data
}

export async function getOrdersByPeriod(from: string, to: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('orders')
    .select('final_amount, payment_status, created_at')
    .gte('created_at', from)
    .lte('created_at', to)
    .order('created_at')

  if (error) throw new Error(error.message)
  return data
}

export async function getOrdersByProduct() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('orders')
    .select(`
      payment_status,
      final_amount,
      variant:product_variants(size, color, product:products(name, slug))
    `)

  if (error) throw new Error(error.message)
  return data
}
