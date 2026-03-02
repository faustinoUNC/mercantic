import { NextRequest } from 'next/server'
import { handleUpdate, handleDelete } from '@/backend/features/discounts/endpoints/discount.endpoints'

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return handleUpdate(id, req)
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return handleDelete(id)
}
