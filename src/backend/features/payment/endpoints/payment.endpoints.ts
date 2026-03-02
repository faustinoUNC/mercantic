import { NextRequest, NextResponse } from 'next/server'
import { createPaymentPreference, processWebhookNotification } from '../services/payment.service'
import { markOrderAsPaid } from '../repository/payment.repository'

export async function handleCreatePreference(req: NextRequest) {
  try {
    const body = await req.json()
    const result = await createPaymentPreference(body)
    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 })
    }
    return NextResponse.json(result)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function handleWebhook(req: NextRequest) {
  try {
    const body = await req.json()
    const { type, data } = body

    const result = await processWebhookNotification(type, data?.id)

    if (result.processed && result.status === 'approved' && result.external_reference) {
      await markOrderAsPaid(parseInt(result.external_reference), result.payment_id!)
    }

    return NextResponse.json({ received: true })
  } catch (error: any) {
    console.error('[webhook] Error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
