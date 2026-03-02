export interface DiscountCode {
  id: string
  code: string
  discount_percentage: number
  active: boolean
  max_uses: number | null
  times_used: number
  description: string | null
  created_at: string
  // Stats joined
  total_uses?: number
  successful_uses?: number
  total_revenue?: number
  total_discount_given?: number
}

export interface DiscountSummary {
  total_codes: number
  active_codes: number
  total_discount_given: number
  total_revenue_with_discounts: number
  total_successful_uses: number
}

export interface CreateDiscountPayload {
  code: string
  discount_percentage: number
  max_uses?: number | null
  description?: string | null
  active?: boolean
}

export interface UpdateDiscountPayload {
  active?: boolean
  max_uses?: number | null
  description?: string | null
}

export interface ApplyDiscountResult {
  valid: boolean
  discount_percentage?: number
  discount_code_id?: string
  error?: string
}
