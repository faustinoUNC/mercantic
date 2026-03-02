import { NextRequest, NextResponse } from 'next/server'
import * as service from '../services/order.service'

export async function handleList() {
  try {
    const orders = await service.listOrders()
    return NextResponse.json({ orders })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function handleGet(id: number) {
  try {
    const order = await service.getOrder(id)
    if (!order) return NextResponse.json({ error: 'Pedido no encontrado' }, { status: 404 })
    return NextResponse.json({ order })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function handleCreate(req: NextRequest) {
  try {
    const body = await req.json()
    const order = await service.createOrder(body)
    return NextResponse.json({ order }, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}

export async function handleUpdate(id: number, req: NextRequest) {
  try {
    const body = await req.json()
    const order = await service.updateOrderStatus(id, body)
    return NextResponse.json({ order })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}
