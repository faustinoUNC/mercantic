import { NextRequest } from 'next/server'
import {
  handleList, handleListAdmin,
  handleCreateProduct, handleCreateVariant,
  handleUpdateProduct, handleUpdateVariant,
} from '@/backend/features/products/endpoints/product.endpoints'

export async function GET(req: NextRequest) {
  const admin = new URL(req.url).searchParams.get('admin') === 'true'
  return admin ? handleListAdmin() : handleList()
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
  return handleUpdateProduct(id, payload)
}
