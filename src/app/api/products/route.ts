import { NextRequest } from 'next/server'
import {
  handleList, handleListAdmin, handleListDeleted,
  handleCreateProduct, handleCreateVariant,
  handleUpdateProduct, handleUpdateVariant,
  handleDeleteVariant, handleDeleteProduct,
  handleRestoreProduct,
} from '@/backend/features/products/endpoints/product.endpoints'

export async function GET(req: NextRequest) {
  const params = new URL(req.url).searchParams
  if (params.get('deleted') === 'true') return handleListDeleted()
  if (params.get('admin') === 'true') return handleListAdmin()
  return handleList()
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { type, ...payload } = body
  if (type === 'variant') return handleCreateVariant(payload)
  return handleCreateProduct(payload)
}

export async function PATCH(req: NextRequest) {
  const body = await req.json()
  const { type, id, ...payload } = body
  if (type === 'variant') return handleUpdateVariant(id, payload)
  if (type === 'restore') return handleRestoreProduct(id)
  return handleUpdateProduct(id, payload)
}

export async function DELETE(req: NextRequest) {
  const body = await req.json()
  const { type, id } = body
  if (type === 'variant') return handleDeleteVariant(id)
  if (type === 'product') return handleDeleteProduct(id)
  return new Response(JSON.stringify({ error: 'Unsupported type' }), { status: 400 })
}
