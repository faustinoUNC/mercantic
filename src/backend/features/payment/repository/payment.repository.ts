import { createClient } from '@/lib/supabase/server'

export async function savePaymentIds(
  orderId: number,
  mpPaymentId: string,
  mpPreferenceId: string
) {
  const supabase = await createClient()
  const { error } = await supabase
    .from('orders')
    .update({ mp_payment_id: mpPaymentId, mp_preference_id: mpPreferenceId })
    .eq('id', orderId)

  if (error) throw new Error(error.message)
}

export async function markOrderAsPaid(orderId: number, mpPaymentId: string) {
  const supabase = await createClient()
  const { error } = await supabase
    .from('orders')
    .update({
      payment_status: 'paid',
      mp_payment_id: mpPaymentId,
      paid_at: new Date().toISOString(),
    })
    .eq('id', orderId)

  if (error) throw new Error(error.message)
}

export async function getOrderByMpPreferenceId(preferenceId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('mp_preference_id', preferenceId)
    .single()

  if (error) return null
  return data
}
