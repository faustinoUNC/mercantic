import * as repo from '../repository/analytics.repository'
import type { GeneralStats, DailySale, ViewMode } from '../models/analytics.model'
import { subDays, subWeeks, subMonths, subYears, startOfDay, endOfDay, format } from 'date-fns'
import { es } from 'date-fns/locale'

export async function getGeneralStats(viewMode: ViewMode = 'days', offset = 0): Promise<GeneralStats> {
  const allOrders = await repo.getOrdersSummary()
  const productOrders = await repo.getOrdersByProduct()
  const provinceOrders = await repo.getOrdersByProvince()

  // Summary
  const paid = allOrders.filter(o => o.payment_status === 'paid')
  const totalRevenue = paid.reduce((sum, o) => sum + (o.final_amount ?? 0), 0)

  const summary = {
    total_orders: allOrders.length,
    paid_orders: paid.length,
    total_revenue: totalRevenue,
    average_order_value: paid.length > 0 ? totalRevenue / paid.length : 0,
    pending_delivery: allOrders.filter(o => o.payment_status === 'paid' && o.delivery_status === 'pending').length,
  }

  // Payment status
  const payment_status = {
    pending: allOrders.filter(o => o.payment_status === 'pending').length,
    paid: allOrders.filter(o => o.payment_status === 'paid').length,
    failed: allOrders.filter(o => o.payment_status === 'failed').length,
    refunded: allOrders.filter(o => o.payment_status === 'refunded').length,
  }

  // Delivery status (solo pedidos pagados)
  const delivery_status = {
    pending: paid.filter(o => o.delivery_status === 'pending').length,
    shipped: paid.filter(o => o.delivery_status === 'shipped').length,
    delivered: paid.filter(o => o.delivery_status === 'delivered').length,
  }

  // Daily sales by view mode
  const daily_sales = await getDailySalesByMode(viewMode, offset)

  // By product
  const productMap = new Map<string, { name: string; slug: string; total: number; paid: number; revenue: number }>()
  for (const order of productOrders as any[]) {
    const product = order.variant?.product
    if (!product) continue
    const key = product.slug
    const existing = productMap.get(key) ?? { name: product.name, slug: product.slug, total: 0, paid: 0, revenue: 0 }
    existing.total++
    if (order.payment_status === 'paid') {
      existing.paid++
      existing.revenue += order.final_amount ?? 0
    }
    productMap.set(key, existing)
  }

  const by_product = Array.from(productMap.values()).map(p => ({
    product_name: p.name,
    slug: p.slug,
    total_orders: p.total,
    paid_orders: p.paid,
    revenue: p.revenue,
  }))

  // By variant
  const variantMap = new Map<string, { size: string; color: string; product_name: string; total: number; paid: number; revenue: number }>()
  for (const order of productOrders as any[]) {
    const variant = order.variant
    if (!variant) continue
    const key = `${variant.size}-${variant.color}-${variant.product?.name}`
    const existing = variantMap.get(key) ?? {
      size: variant.size, color: variant.color,
      product_name: variant.product?.name ?? '', total: 0, paid: 0, revenue: 0
    }
    existing.total++
    if (order.payment_status === 'paid') {
      existing.paid++
      existing.revenue += order.final_amount ?? 0
    }
    variantMap.set(key, existing)
  }

  const by_variant = Array.from(variantMap.values()).map(v => ({
    size: v.size, color: v.color, product_name: v.product_name,
    total_orders: v.total, paid_orders: v.paid, revenue: v.revenue,
  }))

  // By province
  const provinceMap = new Map<string, { total: number; revenue: number }>()
  for (const order of provinceOrders as any[]) {
    const prov = (order.province as string | null)?.trim()
    if (!prov) continue
    const existing = provinceMap.get(prov) ?? { total: 0, revenue: 0 }
    existing.total++
    if (order.payment_status === 'paid') existing.revenue += order.final_amount ?? 0
    provinceMap.set(prov, existing)
  }
  const by_province = Array.from(provinceMap.entries())
    .map(([province, v]) => ({ province, total_orders: v.total, revenue: v.revenue }))
    .sort((a, b) => b.total_orders - a.total_orders)
    .slice(0, 10)

  return { summary, daily_sales, by_product, by_variant, by_province, payment_status, delivery_status }
}

async function getDailySalesByMode(viewMode: ViewMode, offset: number): Promise<DailySale[]> {
  const now = new Date()
  let from: Date, to: Date

  if (viewMode === 'days') {
    to = endOfDay(subDays(now, offset * 7))
    from = startOfDay(subDays(to, 6))
  } else if (viewMode === 'weeks') {
    to = endOfDay(subWeeks(now, offset * 8))
    from = startOfDay(subWeeks(to, 7))
  } else if (viewMode === 'months') {
    to = endOfDay(subMonths(now, offset * 6))
    from = startOfDay(subMonths(to, 5))
  } else {
    to = endOfDay(subYears(now, offset * 3))
    from = startOfDay(subYears(to, 2))
  }

  const orders = await repo.getOrdersByPeriod(from.toISOString(), to.toISOString())
  const paid = orders.filter(o => o.payment_status === 'paid')

  const bucketMap = new Map<string, { count: number; revenue: number }>()

  for (const order of paid) {
    const date = new Date(order.created_at)
    let key: string

    if (viewMode === 'days') key = format(date, 'yyyy-MM-dd')
    else if (viewMode === 'weeks') key = `Sem ${format(date, 'w', { locale: es })}`
    else if (viewMode === 'months') key = format(date, 'MMM yyyy', { locale: es })
    else key = format(date, 'yyyy')

    const existing = bucketMap.get(key) ?? { count: 0, revenue: 0 }
    existing.count++
    existing.revenue += order.final_amount ?? 0
    bucketMap.set(key, existing)
  }

  return Array.from(bucketMap.entries()).map(([date, v]) => ({
    date, count: v.count, revenue: v.revenue,
  }))
}
