import { NextRequest } from 'next/server'
import { handleList, handleCreate } from '@/backend/features/discounts/endpoints/discount.endpoints'

export async function GET() { return handleList() }
export async function POST(req: NextRequest) { return handleCreate(req) }
