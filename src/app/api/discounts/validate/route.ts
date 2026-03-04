import { NextRequest } from 'next/server'
import { handleValidate } from '@/backend/features/discounts/endpoints/discount.endpoints'

export async function POST(req: NextRequest) {
  return handleValidate(req)
}
