export type PaymentMethod = 'transferencia' | 'tarjeta' | 'efectivo'
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded'
export type DeliveryStatus = 'pending' | 'shipped' | 'delivered'

export interface Customer {
  id: string
  name: string
  email: string | null
  phone: string | null
  dni: string | null
  notes: string | null
  created_at: string
}

export interface OrderComplete {
  id: number
  customer_id: string | null
  variant_id: string | null
  quantity: number
  unit_price: number
  discount_code_id: string | null
  discount_amount: number
  final_amount: number
  payment_method: PaymentMethod | null
  payment_status: PaymentStatus
  delivery_status: DeliveryStatus
  notes: string | null
  mp_payment_id: string | null
  mp_preference_id: string | null
  shipping_address: string | null
  city: string | null
  province: string | null
  postal_code: string | null
  created_at: string
  paid_at: string | null
  shipped_at: string | null
  // Joined
  customer?: Customer | null
  variant?: {
    id: string
    size: string
    color: string
    product?: { name: string; slug: string }
  } | null
  discount_code?: { code: string } | null
}

export interface CreateOrderPayload {
  customer: {
    name: string
    email?: string
    phone?: string
    dni?: string
  }
  variant_id: string
  quantity?: number
  payment_method: PaymentMethod
  discount_code?: string
  notes?: string
  shipping_address?: string
  city?: string
  province?: string
  postal_code?: string
}

export interface UpdateOrderPayload {
  delivery_status?: DeliveryStatus
  payment_status?: PaymentStatus
  notes?: string
}
