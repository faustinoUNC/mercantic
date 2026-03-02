'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Separator } from '@/components/ui/separator'
import { Package, Edit2, Save, X, Tag, Percent, ChevronDown, ChevronUp } from 'lucide-react'
import { useProducts } from '@/frontend/hooks/useProducts'
import type { ProductWithVariants, ProductVariant } from '@/backend/features/products/models/product.model'
import { formatPrice } from '@/lib/utils/formatting'

const COLOR_LABEL: Record<string, string> = { negro: 'Negro', oxido: 'Óxido' }
const COLOR_SWATCH: Record<string, string> = { negro: '#1a1a1a', oxido: '#8B4513' }
const SHAPE_LABEL: Record<string, string> = { round: 'Redondo', square: 'Cuadrado' }

// ─── Variant row ─────────────────────────────────────────────────────────────

function VariantRow({
  variant,
  onSave,
}: {
  variant: ProductVariant
  onSave: (id: string, payload: {
    price: number
    sale_price: number | null
    stock: number
    active: boolean
  }) => Promise<void>
}) {
  const [editing, setEditing] = useState(false)
  const [price, setPrice] = useState(variant.price)
  const [salePrice, setSalePrice] = useState<string>(
    variant.sale_price != null ? String(variant.sale_price) : ''
  )
  const [stock, setStock] = useState(variant.stock)
  const [active, setActive] = useState(variant.active)
  const [saving, setSaving] = useState(false)

  const discountPct = variant.sale_price
    ? Math.round((1 - variant.sale_price / variant.price) * 100)
    : null

  const save = async () => {
    setSaving(true)
    await onSave(variant.id, {
      price,
      sale_price: salePrice.trim() !== '' ? Number(salePrice) : null,
      stock,
      active,
    })
    setSaving(false)
    setEditing(false)
  }

  const cancel = () => {
    setPrice(variant.price)
    setSalePrice(variant.sale_price != null ? String(variant.sale_price) : '')
    setStock(variant.stock)
    setActive(variant.active)
    setEditing(false)
  }

  return (
    <div className="py-3 text-sm">
      {/* Header row */}
      <div className="flex items-center gap-3">
        <span
          className="w-4 h-4 rounded-full flex-shrink-0 border"
          style={{ background: COLOR_SWATCH[variant.color] ?? '#888' }}
        />
        <span className="font-medium w-16">{variant.size}</span>
        <span className="text-muted-foreground w-16">{COLOR_LABEL[variant.color] ?? variant.color}</span>

        {!editing && (
          <>
            <div className="flex items-baseline gap-1.5">
              {discountPct !== null ? (
                <>
                  <span className="font-semibold text-primary">{formatPrice(variant.sale_price!)}</span>
                  <span className="text-xs text-muted-foreground line-through">{formatPrice(variant.price)}</span>
                  <Badge variant="destructive" className="text-[10px] px-1 py-0">-{discountPct}%</Badge>
                </>
              ) : (
                <span className="font-semibold text-primary">{formatPrice(variant.price)}</span>
              )}
            </div>
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

      {/* Edit form */}
      {editing && (
        <div className="mt-3 pl-7 space-y-3">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div>
              <Label className="text-xs mb-1 block">Precio regular ($)</Label>
              <Input
                type="number"
                value={price}
                onChange={e => setPrice(Number(e.target.value))}
                className="h-8 text-sm"
              />
            </div>
            <div>
              <Label className="text-xs mb-1 block flex items-center gap-1">
                <Tag className="w-3 h-3" /> Precio oferta ($)
              </Label>
              <Input
                type="number"
                placeholder="Sin oferta"
                value={salePrice}
                onChange={e => setSalePrice(e.target.value)}
                className="h-8 text-sm"
              />
              {salePrice.trim() !== '' && price > 0 && (
                <p className="text-xs text-emerald-500 mt-1 flex items-center gap-1">
                  <Percent className="w-3 h-3" />
                  {Math.round((1 - Number(salePrice) / price) * 100)}% de descuento
                </p>
              )}
            </div>
            <div>
              <Label className="text-xs mb-1 block">Stock</Label>
              <Input
                type="number"
                value={stock}
                onChange={e => setStock(Number(e.target.value))}
                className="h-8 text-sm"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label className="text-xs">Estado</Label>
              <div className="flex items-center gap-2 mt-1">
                <Switch checked={active} onCheckedChange={setActive} />
                <span className="text-xs text-muted-foreground">{active ? 'Activo' : 'Inactivo'}</span>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button size="sm" onClick={save} disabled={saving} className="h-7 gap-1">
              <Save className="w-3 h-3" /> {saving ? 'Guardando…' : 'Guardar variante'}
            </Button>
            <Button size="sm" variant="ghost" onClick={cancel} className="h-7">
              <X className="w-3 h-3" /> Cancelar
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Product info editor ──────────────────────────────────────────────────────

function ProductInfoEditor({
  product,
  onSave,
  onClose,
}: {
  product: ProductWithVariants
  onSave: (id: string, payload: {
    description: string
    material: string
    includes: string[]
  }) => Promise<void>
  onClose: () => void
}) {
  const [description, setDescription] = useState(product.description ?? '')
  const [material, setMaterial] = useState(product.material ?? '')
  const [includesRaw, setIncludesRaw] = useState((product.includes ?? []).join(', '))
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    setSaving(true)
    const includes = includesRaw
      .split(',')
      .map(s => s.trim())
      .filter(Boolean)
    await onSave(product.id, { description, material, includes })
    setSaving(false)
    onClose()
  }

  return (
    <div className="space-y-4 py-3">
      <div>
        <Label className="text-xs mb-1 block">Descripción del producto</Label>
        <Textarea
          value={description}
          onChange={e => setDescription(e.target.value)}
          rows={3}
          className="text-sm resize-none"
          placeholder="Descripción detallada que se muestra en la página del producto"
        />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <Label className="text-xs mb-1 block">Material</Label>
          <Input
            value={material}
            onChange={e => setMaterial(e.target.value)}
            className="h-8 text-sm"
            placeholder="Ej: Chapa de 3,2 mm de alta resistencia"
          />
        </div>
        <div>
          <Label className="text-xs mb-1 block">Incluye (separado por comas)</Label>
          <Input
            value={includesRaw}
            onChange={e => setIncludesRaw(e.target.value)}
            className="h-8 text-sm"
            placeholder="Ej: Parrilla, Estaca, Tapa"
          />
        </div>
      </div>
      <div className="flex gap-2">
        <Button size="sm" onClick={handleSave} disabled={saving} className="gap-1">
          <Save className="w-3 h-3" /> {saving ? 'Guardando…' : 'Guardar información'}
        </Button>
        <Button size="sm" variant="ghost" onClick={onClose}>
          <X className="w-3 h-3" /> Cancelar
        </Button>
      </div>
    </div>
  )
}

// ─── Product card ─────────────────────────────────────────────────────────────

function ProductCard({
  product,
  onUpdateVariant,
  onUpdateProduct,
  onToggleProduct,
}: {
  product: ProductWithVariants
  onUpdateVariant: (id: string, payload: {
    price: number
    sale_price: number | null
    stock: number
    active: boolean
  }) => Promise<void>
  onUpdateProduct: (id: string, payload: {
    description: string
    material: string
    includes: string[]
  }) => Promise<void>
  onToggleProduct: (id: string, active: boolean) => Promise<void>
}) {
  const [toggling, setToggling] = useState(false)
  const [editingInfo, setEditingInfo] = useState(false)
  const [variantsOpen, setVariantsOpen] = useState(true)

  const activeSales = product.variants.filter(v => v.sale_price != null).length

  const handleToggle = async (checked: boolean) => {
    setToggling(true)
    await onToggleProduct(product.id, checked)
    setToggling(false)
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <CardTitle className="text-xl font-display">{product.name}</CardTitle>
              <Badge variant="outline" className="text-xs">{SHAPE_LABEL[product.shape]}</Badge>
              {activeSales > 0 && (
                <Badge variant="destructive" className="text-xs gap-1">
                  <Tag className="w-3 h-3" /> {activeSales} en oferta
                </Badge>
              )}
            </div>
            <CardDescription className="line-clamp-2">
              {product.description ?? 'Sin descripción'}
            </CardDescription>
            {product.includes?.length > 0 && (
              <p className="text-xs text-muted-foreground mt-1">
                Incluye: {product.includes.join(' · ')}
              </p>
            )}
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            <Button
              size="sm"
              variant="outline"
              className="h-8 gap-1 text-xs"
              onClick={() => setEditingInfo(v => !v)}
            >
              <Edit2 className="w-3 h-3" />
              {editingInfo ? 'Cerrar' : 'Editar info'}
            </Button>
            <div className="flex items-center gap-2">
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
        </div>

        {editingInfo && (
          <>
            <Separator className="mt-3" />
            <ProductInfoEditor
              product={product}
              onSave={onUpdateProduct}
              onClose={() => setEditingInfo(false)}
            />
          </>
        )}
      </CardHeader>

      <CardContent>
        <button
          className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 hover:text-foreground transition-colors"
          onClick={() => setVariantsOpen(v => !v)}
        >
          {variantsOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          Variantes ({product.variants.length})
        </button>

        {variantsOpen && (
          <div className="divide-y">
            {product.variants.map(v => (
              <VariantRow
                key={v.id}
                variant={v}
                onSave={onUpdateVariant}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// ─── Main export ──────────────────────────────────────────────────────────────

export function ProductManager() {
  const { products, isLoading, updateProduct, updateVariant } = useProducts(true)

  const handleUpdateVariant = async (
    id: string,
    payload: { price: number; sale_price: number | null; stock: number; active: boolean }
  ) => {
    await updateVariant(id, payload)
  }

  const handleUpdateProduct = async (
    id: string,
    payload: { description: string; material: string; includes: string[] }
  ) => {
    await updateProduct(id, payload)
  }

  const handleToggleProduct = async (id: string, active: boolean) => {
    await updateProduct(id, { active })
  }

  if (isLoading) {
    return <div className="flex items-center justify-center py-20 text-muted-foreground">Cargando productos…</div>
  }

  const totalOnSale = products.reduce(
    (acc, p) => acc + p.variants.filter(v => v.sale_price != null).length,
    0
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start gap-3">
        <Package className="w-5 h-5 text-muted-foreground mt-0.5" />
        <div>
          <h2 className="text-lg font-semibold">Gestión de Productos</h2>
          <p className="text-sm text-muted-foreground">
            {products.length} modelo{products.length !== 1 ? 's' : ''}
            {totalOnSale > 0 && ` · ${totalOnSale} variante${totalOnSale !== 1 ? 's' : ''} en oferta`}
          </p>
        </div>
      </div>

      {/* Cards */}
      <div className="space-y-4">
        {products.map(p => (
          <ProductCard
            key={p.id}
            product={p}
            onUpdateVariant={handleUpdateVariant}
            onUpdateProduct={handleUpdateProduct}
            onToggleProduct={handleToggleProduct}
          />
        ))}
      </div>
    </div>
  )
}
