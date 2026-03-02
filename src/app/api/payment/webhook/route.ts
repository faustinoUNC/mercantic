import { NextRequest } from 'next/server'
import { handleWebhook } from '@/backend/features/payment/endpoints/payment.endpoints'

export async function POST(req: NextRequest) { return handleWebhook(req) }
