/**
 * MercadoPago Service — Scaffold
 *
 * Estructura lista para conectar con la SDK de MercadoPago.
 * Requiere configurar MP_ACCESS_TOKEN y MP_PUBLIC_KEY en .env.local
 */
import type { CreatePreferencePayload, PaymentResult } from '../models/payment.model'

export async function createPaymentPreference(
  payload: CreatePreferencePayload
): Promise<PaymentResult> {
  const accessToken = process.env.MP_ACCESS_TOKEN
  if (!accessToken) {
    // En modo demo devolvemos un resultado simulado
    return {
      success: true,
      preference_id: `DEMO-PREF-${payload.order_id}`,
      init_point: `https://mercadopago.com.ar/checkout/v1/redirect?pref_id=DEMO-PREF-${payload.order_id}`,
    }
  }

  try {
    const { MercadoPagoConfig, Preference } = await import('mercadopago')
    const client = new MercadoPagoConfig({ accessToken })
    const preference = new Preference(client)

    const response = await preference.create({
      body: {
        items: [
          {
            id: payload.variant_id,
            title: `Fogonero El Mercantic - Pedido #${payload.order_id}`,
            quantity: payload.quantity,
            unit_price: payload.unit_price,
            currency_id: 'ARS',
          },
        ],
        payer: {
          name: payload.customer_name,
          email: payload.customer_email || 'cliente@mercantic.com',
        },
        back_urls: {
          success: `${process.env.NEXT_PUBLIC_SITE_URL}/checkout/success`,
          failure: `${process.env.NEXT_PUBLIC_SITE_URL}/checkout/failure`,
          pending: `${process.env.NEXT_PUBLIC_SITE_URL}/checkout/pending`,
        },
        auto_return: 'approved',
        notification_url: `${process.env.NEXT_PUBLIC_SITE_URL}/api/payment/webhook`,
        external_reference: String(payload.order_id),
        payment_methods: {
          excluded_payment_types: [],
          installments: 12,
        },
      },
    })

    return {
      success: true,
      preference_id: response.id!,
      init_point: response.init_point!,
    }
  } catch (error: any) {
    console.error('[payment] Error creating preference:', error)
    return { success: false, error: error.message }
  }
}

export async function processWebhookNotification(type: string, dataId: string) {
  if (type !== 'payment') return { processed: false }

  const accessToken = process.env.MP_ACCESS_TOKEN
  if (!accessToken) return { processed: false, reason: 'No MP_ACCESS_TOKEN configured' }

  try {
    const { MercadoPagoConfig, Payment } = await import('mercadopago')
    const client = new MercadoPagoConfig({ accessToken })
    const payment = new Payment(client)
    const paymentData = await payment.get({ id: dataId })

    return {
      processed: true,
      status: paymentData.status,
      external_reference: paymentData.external_reference,
      payment_id: String(paymentData.id),
    }
  } catch (error: any) {
    console.error('[payment] Webhook error:', error)
    return { processed: false, error: error.message }
  }
}
