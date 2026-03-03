export interface DailySale {
  date: string
  count: number
  revenue: number
}

export interface ProductStats {
  product_name: string
  slug: string
  total_orders: number
  paid_orders: number
  revenue: number
}

export interface VariantStats {
  size: string
  color: string
  product_name: string
  total_orders: number
  paid_orders: number
  revenue: number
}

export interface ProvinceStats {
  province: string
  total_orders: number
  revenue: number
}

export interface GeneralStats {
  summary: {
    total_orders: number
    paid_orders: number
    total_revenue: number
    average_order_value: number
    pending_delivery: number
  }
  daily_sales: DailySale[]
  by_product: ProductStats[]
  by_variant: VariantStats[]
  by_province: ProvinceStats[]
  payment_status: {
    pending: number
    paid: number
    failed: number
    refunded: number
  }
  delivery_status: {
    pending: number
    shipped: number
    delivered: number
  }
}

export type ViewMode = 'days' | 'weeks' | 'months' | 'years'
