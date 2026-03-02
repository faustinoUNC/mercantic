import { NextRequest, NextResponse } from 'next/server'
import { getGeneralStats } from '../services/analytics.service'
import type { ViewMode } from '../models/analytics.model'

export async function handleGeneralStats(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const viewMode = (searchParams.get('viewMode') ?? 'days') as ViewMode
    const offset = parseInt(searchParams.get('offset') ?? '0', 10)
    const stats = await getGeneralStats(viewMode, offset)
    return NextResponse.json(stats)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
