export interface PaymentPreference {
  id: string
  init_point: string
  sandbox_init_point: string
}

export interface CreatePreferencePayload {
  order_id: number
  variant_id: string
  quantity: number
  unit_price: number
  customer_name: string
  customer_email: string
}

export interface MPWebhookPayload {
  type: string
  data: { id: string }
  action?: string
}

export interface PaymentResult {
  success: boolean
  preference_id?: string
  init_point?: string
  error?: string
}
