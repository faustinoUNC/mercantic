import { NextRequest, NextResponse } from 'next/server'
import * as service from '../services/discount.service'

export async function handleList() {
  try {
    const data = await service.listDiscounts()
    return NextResponse.json(data)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function handleCreate(req: NextRequest) {
  try {
    const body = await req.json()
    const discount = await service.createDiscount(body)
    return NextResponse.json({ discount }, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}

export async function handleUpdate(id: string, req: NextRequest) {
  try {
    const body = await req.json()
    const discount = await service.updateDiscount(id, body)
    return NextResponse.json({ discount })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}

export async function handleDelete(id: string) {
  try {
    await service.deleteDiscount(id)
    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function handleValidate(req: NextRequest) {
  try {
    const { code } = await req.json()
    const result = await service.validateDiscount(code)
    return NextResponse.json(result)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}
