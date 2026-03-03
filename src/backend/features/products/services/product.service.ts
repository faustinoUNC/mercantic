import * as repo from '../repository/product.repository'
import type {
  ProductWithVariants,
  CreateProductPayload, CreateVariantPayload,
  UpdateVariantPayload, UpdateProductPayload,
} from '../models/product.model'

export async function listProducts(): Promise<ProductWithVariants[]> {
  return repo.getAllProducts()
}

export async function listProductsAdmin(): Promise<ProductWithVariants[]> {
  return repo.getAllProductsAdmin()
}

export async function getProduct(slug: string): Promise<ProductWithVariants | null> {
  return repo.getProductBySlug(slug)
}

export async function createProduct(payload: CreateProductPayload) {
  return repo.createProduct(payload)
}

export async function createVariant(payload: CreateVariantPayload) {
  return repo.createVariant(payload)
}

export async function updateProduct(id: string, payload: UpdateProductPayload) {
  return repo.updateProduct(id, payload)
}

export async function updateVariant(id: string, payload: UpdateVariantPayload) {
  return repo.updateVariant(id, payload)
}

export async function deleteVariant(id: string) {
  return repo.deleteVariant(id)
}
