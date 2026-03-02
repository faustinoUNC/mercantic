'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Package, Edit2, Save, X } from 'lucide-react'
import { useProducts } from '@/frontend/hooks/useProducts'
import type { ProductWithVariants, ProductVariant } from '@/backend/features/products/models/product.model'
import { formatPrice } from '@/lib/utils/formatting'

const COLOR_LABEL: Record<string, string> = { negro: 'Negro', oxido: 'Óxido' }
const COLOR_SWATCH: Record<string, string> = { negro: '#1a1a1a', oxido: '#8B4513' }
const SHAPE_LABEL: Record<string, string> = { round: 'Redondo', square: 'Cuadrado' }

function VariantRow({ variant, onSave }: { variant: ProductVariant; onSave: (id: string, price: number, stock: number, active: boolean) => Promise<void> }) {
  const [editing, setEditing] = useState(false)
  const [price, setPrice] = useState(variant.price)
  const [stock, setStock] = useState(variant.stock)
  const [active, setActive] = useState(variant.active)
  const [saving, setSaving] = useState(false)

  const save = async () => {
    setSaving(true)
    await onSave(variant.id, price, stock, active)
    setSaving(false)
    setEditing(false)
  }

  const cancel = () => {
    setPrice(variant.price)
    setStock(variant.stock)
    setActive(variant.active)
    setEditing(false)
  }

  return (
    <div className="flex items-center gap-3 py-2.5 text-sm">
      {/* Color swatch */}
      <span
        className="w-5 h-5 rounded-full flex-shrink-0 border"
        style={{ background: COLOR_SWATCH[variant.color] ?? '#888' }}
        title={COLOR_LABEL[variant.color] ?? variant.color}
      />
      <span className="w-24 font-medium">{variant.size}</span>
      <span className="w-20 text-muted-foreground">{COLOR_LABEL[variant.color] ?? variant.color}</span>

      {editing ? (
        <>
          <div className="flex items-center gap-1">
            <span className="text-muted-foreground text-xs">$</span>
            <Input
              type="number"
              value={price}
              onChange={e => setPrice(Number(e.target.value))}
              className="w-32 h-7 text-xs"
            />
          </div>
          <div className="flex items-center gap-1">
            <span className="text-muted-foreground text-xs">Stock:</span>
            <Input
              type="number"
              value={stock}
              onChange={e => setStock(Number(e.target.value))}
              className="w-20 h-7 text-xs"
            />
          </div>
          <div className="flex items-center gap-2">
            <Switch checked={active} onCheckedChange={setActive} />
            <span className="text-xs text-muted-foreground">{active ? 'Activo' : 'Inactivo'}</span>
          </div>
          <div className="ml-auto flex gap-1">
            <Button size="sm" variant="default" className="h-7 gap-1" onClick={save} disabled={saving}>
              <Save className="w-3 h-3" /> {saving ? 'Guardando…' : 'Guardar'}
            </Button>
            <Button size="sm" variant="ghost" className="h-7" onClick={cancel}>
              <X className="w-3 h-3" />
            </Button>
          </div>
        </>
      ) : (
        <>
          <span className="font-semibold text-primary">{formatPrice(variant.price)}</span>
          <span className="text-muted-foreground text-xs">Stock: {variant.stock}</span>
          <Badge variant={variant.active ? 'default' : 'secondary'} className="text-xs">
            {variant.active ? 'Activo' : 'Inactivo'}
          </Badge>
          <Button size="sm" variant="ghost" className="ml-auto h-7 gap-1" onClick={() => setEditing(true)}>
            <Edit2 className="w-3 h-3" /> Editar
          </Button>
        </>
      )}
    </div>
  )
}

function ProductCard({ product, onUpdateVariant, onToggleProduct }: {
  product: ProductWithVariants
  onUpdateVariant: (id: string, price: number, stock: number, active: boolean) => Promise<void>
  onToggleProduct: (id: string, active: boolean) => Promise<void>
}) {
  const [toggling, setToggling] = useState(false)

  const handleToggle = async (checked: boolean) => {
    setToggling(true)
    await onToggleProduct(product.id, checked)
    setToggling(false)
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <CardTitle className="text-xl font-display">{product.name}</CardTitle>
              <Badge variant="outline" className="text-xs">{SHAPE_LABEL[product.shape]}</Badge>
            </div>
            <CardDescription>{product.description ?? 'Sin descripción'}</CardDescription>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <Label htmlFor={`product-${product.id}`} className="text-sm text-muted-foreground">
              {product.active ? 'Activo' : 'Inactivo'}
            </Label>
            <Switch
              id={`product-${product.id}`}
              checked={product.active}
              onCheckedChange={handleToggle}
              disabled={toggling}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
          Variantes ({product.variants.length})
        </div>
        <div className="divide-y">
          {product.variants.map(v => (
            <VariantRow
              key={v.id}
              variant={v}
              onSave={onUpdateVariant}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export function ProductManager() {
  const { products, isLoading, updateProduct, updateVariant } = useProducts(true)

  const handleUpdateVariant = async (id: string, price: number, stock: number, active: boolean) => {
    await updateVariant(id, { price, stock, active })
  }

  const handleToggleProduct = async (id: string, active: boolean) => {
    await updateProduct(id, { active })
  }

  if (isLoading) {
    return <div className="flex items-center justify-center py-20 text-muted-foreground">Cargando productos…</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Package className="w-5 h-5 text-muted-foreground" />
        <div>
          <h2 className="text-lg font-semibold">Gestión de Productos</h2>
          <p className="text-sm text-muted-foreground">{products.length} modelo{products.length !== 1 ? 's' : ''} · editar precios, stock y disponibilidad</p>
        </div>
      </div>
      <div className="space-y-4">
        {products.map(p => (
          <ProductCard
            key={p.id}
            product={p}
            onUpdateVariant={handleUpdateVariant}
            onToggleProduct={handleToggleProduct}
          />
        ))}
      </div>
    </div>
  )
}
