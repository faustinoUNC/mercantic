import { NextRequest } from 'next/server'
import { handleGet, handleUpdate } from '@/backend/features/orders/endpoints/order.endpoints'

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return handleGet(parseInt(id))
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return handleUpdate(parseInt(id), req)
}
