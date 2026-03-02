import { NextRequest } from 'next/server'
import { handleList, handleListAdmin } from '@/backend/features/products/endpoints/product.endpoints'

export async function GET(req: NextRequest) {
  const admin = new URL(req.url).searchParams.get('admin') === 'true'
  return admin ? handleListAdmin() : handleList()
}
