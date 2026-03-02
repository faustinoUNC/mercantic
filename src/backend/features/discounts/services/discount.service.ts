import * as repo from '../repository/discount.repository'
import type { DiscountCode, CreateDiscountPayload, UpdateDiscountPayload, ApplyDiscountResult } from '../models/discount.model'

export async function listDiscounts() {
  const { codes, orders } = await repo.getDiscountStats()

  const enriched = codes.map(code => {
    const codeOrders = orders.filter((o: any) => o.discount_code_id === code.id)
    const successful = codeOrders.filter((o: any) => o.payment_status === 'paid')
    return {
      ...code,
      total_uses: codeOrders.length,
      successful_uses: successful.length,
      total_revenue: successful.reduce((sum: number, o: any) => sum + (o.final_amount ?? 0), 0),
      total_discount_given: successful.reduce((sum: number, o: any) => sum + (o.discount_amount ?? 0), 0),
    }
  })

  const summary = {
    total_codes: codes.length,
    active_codes: codes.filter(c => c.active).length,
    total_discount_given: enriched.reduce((sum, c) => sum + (c.total_discount_given ?? 0), 0),
    total_revenue_with_discounts: enriched.reduce((sum, c) => sum + (c.total_revenue ?? 0), 0),
    total_successful_uses: enriched.reduce((sum, c) => sum + (c.successful_uses ?? 0), 0),
  }

  return { codes: enriched, summary }
}

export async function createDiscount(payload: CreateDiscountPayload): Promise<DiscountCode> {
  const existing = await repo.getDiscountByCode(payload.code)
  if (existing) throw new Error('Ya existe un código con ese nombre')
  return repo.createDiscount(payload)
}

export async function updateDiscount(id: string, payload: UpdateDiscountPayload) {
  return repo.updateDiscount(id, payload)
}

export async function deleteDiscount(id: string) {
  return repo.deleteDiscount(id)
}

export async function validateDiscount(code: string): Promise<ApplyDiscountResult> {
  const discount = await repo.getDiscountByCode(code)
  if (!discount) return { valid: false, error: 'Código inválido' }
  if (!discount.active) return { valid: false, error: 'Código inactivo' }
  if (discount.max_uses && discount.times_used >= discount.max_uses) {
    return { valid: false, error: 'Código agotado' }
  }
  return { valid: true, discount_percentage: discount.discount_percentage, discount_code_id: discount.id }
}
