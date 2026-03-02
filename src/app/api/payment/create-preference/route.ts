import { NextRequest } from 'next/server'
import { handleCreatePreference } from '@/backend/features/payment/endpoints/payment.endpoints'

export async function POST(req: NextRequest) { return handleCreatePreference(req) }
