import { NextRequest } from 'next/server'
import { handleGeneralStats } from '@/backend/features/analytics/endpoints/analytics.endpoints'

export async function GET(req: NextRequest) { return handleGeneralStats(req) }
