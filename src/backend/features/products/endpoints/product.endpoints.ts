import { NextResponse } from 'next/server'
import * as service from '../services/product.service'

export async function handleList() {
  try {
    const products = await service.listProducts()
    return NextResponse.json({ products })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function handleListAdmin() {
  try {
    const products = await service.listProductsAdmin()
    return NextResponse.json({ products })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function handleGetBySlug(slug: string) {
  try {
    const product = await service.getProduct(slug)
    if (!product) return NextResponse.json({ error: 'Producto no encontrado' }, { status: 404 })
    return NextResponse.json({ product })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function handleUpdateProduct(id: string, body: unknown) {
  try {
    const product = await service.updateProduct(id, body as any)
    return NextResponse.json({ product })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function handleUpdateVariant(id: string, body: unknown) {
  try {
    const variant = await service.updateVariant(id, body as any)
    return NextResponse.json({ variant })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
