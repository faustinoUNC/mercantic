'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Separator } from '@/components/ui/separator'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from '@/components/ui/dialog'
import {
  Package, Edit2, Save, X, Tag, Percent, ChevronDown, ChevronUp,
  Plus, Star, Trash2, CircleCheck,
} from 'lucide-react'
import { useProducts } from '@/frontend/hooks/useProducts'
import type {
  ProductWithVariants, ProductVariant,
  ProductShape, ProductSize, ProductColor,
  CreateProductPayload, CreateVariantPayload,
} from '@/backend/features/products/models/product.model'
import { formatPrice } from '@/lib/utils/formatting'

// ─── Constants ────────────────────────────────────────────────────────────────

const COLOR_LABEL: Record<string, string> = { negro: 'Negro', oxido: 'Óxido' }
const COLOR_SWATCH: Record<string, string> = { negro: '#1a1a1a', oxido: '#8B4513' }
const SHAPE_LABEL: Record<string, string> = { round: 'Redondo', square: 'Cuadrado' }
const SIZES: ProductSize[] = ['1.25m', '1.50m']
const COLORS: ProductColor[] = ['negro', 'oxido']

function toSlug(s: string) {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
}

// ─── VariantRow ───────────────────────────────────────────────────────────────

function VariantRow({
  variant,
  onSave,
}: {
  variant: ProductVariant
  onSave: (id: string, payload: { price: number; sale_price: number | null; stock: number; active: boolean }) => Promise<void>
}) {
  const [editing, setEditing] = useState(false)
  const [price, setPrice] = useState(variant.price)
  const [salePrice, setSalePrice] = useState(variant.sale_price != null ? String(variant.sale_price) : '')
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
      <div className="flex items-center gap-2 flex-wrap">
        <span className="w-4 h-4 rounded-full flex-shrink-0 border" style={{ background: COLOR_SWATCH[variant.color] ?? '#888' }} />
        <span className="font-medium w-14 flex-shrink-0">{variant.size}</span>
        <span className="text-muted-foreground w-12 flex-shrink-0">{COLOR_LABEL[variant.color] ?? variant.color}</span>

        {!editing && (
          <>
            <div className="flex items-baseline gap-1.5 flex-wrap">
              {discountPct !== null ? (
                <>
                  <span className="font-semibold text-primary">{formatPrice(variant.sale_price!)}</span>
                  <span className="text-xs text-muted-foreground line-through">{formatPrice(variant.price)}</span>
                  <Badge variant="destructive" className="text-[10px] px-1 py-0">-{discountPct}%</Badge>
                </>
              ) : (
                <span className="font-semibold">{formatPrice(variant.price)}</span>
              )}
            </div>
            <span className="text-muted-foreground text-xs">Stock: {variant.stock}</span>
            <Badge variant={variant.active ? 'default' : 'secondary'} className="text-xs">
              {variant.active ? 'Activo' : 'Inactivo'}
            </Badge>
            <Button size="sm" variant="ghost" className="ml-auto h-7 gap-1 text-xs" onClick={() => setEditing(true)}>
              <Edit2 className="w-3 h-3" /> Editar
            </Button>
          </>
        )}
      </div>

      {editing && (
        <div className="mt-3 pl-7 space-y-3">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div>
              <Label className="text-xs mb-1 block">Precio regular ($)</Label>
              <Input type="number" value={price} onChange={e => setPrice(Number(e.target.value))} className="h-8 text-sm" />
            </div>
            <div>
              <Label className="text-xs mb-1 flex items-center gap-1 mb-1">
                <Tag className="w-3 h-3" /> Oferta ($)
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
                  {Math.round((1 - Number(salePrice) / price) * 100)}% descuento
                </p>
              )}
            </div>
            <div>
              <Label className="text-xs mb-1 block">Stock</Label>
              <Input type="number" value={stock} onChange={e => setStock(Number(e.target.value))} className="h-8 text-sm" />
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
              <Save className="w-3 h-3" /> {saving ? 'Guardando…' : 'Guardar'}
            </Button>
            <Button size="sm" variant="ghost" onClick={cancel} className="h-7 gap-1">
              <X className="w-3 h-3" /> Cancelar
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── AddVariantForm ───────────────────────────────────────────────────────────

function AddVariantForm({
  productId,
  onCreate,
  onClose,
}: {
  productId: string
  onCreate: (payload: CreateVariantPayload) => Promise<{ ok: boolean }>
  onClose: () => void
}) {
  const [size, setSize] = useState<ProductSize>('1.25m')
  const [color, setColor] = useState<ProductColor>('negro')
  const [price, setPrice] = useState('')
  const [salePrice, setSalePrice] = useState('')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const save = async () => {
    if (!price) return
    setSaving(true)
    await onCreate({
      product_id: productId,
      size,
      color,
      price: Number(price),
      sale_price: salePrice ? Number(salePrice) : null,
    })
    setSaving(false)
    setSaved(true)
    setTimeout(onClose, 600)
  }

  if (saved) {
    return (
      <div className="flex items-center gap-2 py-3 text-sm text-emerald-500">
        <CircleCheck className="w-4 h-4" /> Variante agregada
      </div>
    )
  }

  return (
    <div className="py-3 space-y-3 border-t border-dashed mt-2">
      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Nueva variante</p>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {/* Size */}
        <div>
          <Label className="text-xs mb-1 block">Tamaño</Label>
          <div className="flex gap-1">
            {SIZES.map(s => (
              <button
                key={s}
                onClick={() => setSize(s)}
                className={`flex-1 h-8 text-xs rounded border transition-colors ${size === s ? 'bg-primary text-primary-foreground border-primary' : 'border-input bg-background hover:bg-muted'}`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
        {/* Color */}
        <div>
          <Label className="text-xs mb-1 block">Color</Label>
          <div className="flex gap-2 mt-1">
            {COLORS.map(c => (
              <button
                key={c}
                onClick={() => setColor(c)}
                title={COLOR_LABEL[c]}
                className={`w-8 h-8 rounded-full border-2 transition-all ${color === c ? 'border-primary scale-110' : 'border-transparent'}`}
                style={{ background: COLOR_SWATCH[c] }}
              />
            ))}
          </div>
        </div>
        {/* Price */}
        <div>
          <Label className="text-xs mb-1 block">Precio ($)</Label>
          <Input type="number" placeholder="0" value={price} onChange={e => setPrice(e.target.value)} className="h-8 text-sm" />
        </div>
        {/* Sale price */}
        <div>
          <Label className="text-xs mb-1 flex items-center gap-1">
            <Tag className="w-3 h-3" /> Oferta ($)
          </Label>
          <Input type="number" placeholder="Sin oferta" value={salePrice} onChange={e => setSalePrice(e.target.value)} className="h-8 text-sm" />
        </div>
      </div>
      <div className="flex gap-2">
        <Button size="sm" onClick={save} disabled={saving || !price} className="h-7 gap-1">
          <Plus className="w-3 h-3" /> {saving ? 'Guardando…' : 'Agregar variante'}
        </Button>
        <Button size="sm" variant="ghost" onClick={onClose} className="h-7 gap-1">
          <X className="w-3 h-3" /> Cancelar
        </Button>
      </div>
    </div>
  )
}

// ─── ProductInfoEditor ────────────────────────────────────────────────────────

function ProductInfoEditor({
  product,
  onSave,
  onClose,
}: {
  product: ProductWithVariants
  onSave: (id: string, payload: { description: string; material: string; includes: string[] }) => Promise<void>
  onClose: () => void
}) {
  const [description, setDescription] = useState(product.description ?? '')
  const [material, setMaterial] = useState(product.material ?? '')
  const [includesRaw, setIncludesRaw] = useState((product.includes ?? []).join(', '))
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    setSaving(true)
    const includes = includesRaw.split(',').map(s => s.trim()).filter(Boolean)
    await onSave(product.id, { description, material, includes })
    setSaving(false)
    onClose()
  }

  return (
    <div className="space-y-4 py-3">
      <div>
        <Label className="text-xs mb-1 block">Descripción</Label>
        <Textarea
          value={description}
          onChange={e => setDescription(e.target.value)}
          rows={3}
          className="text-sm resize-none"
          placeholder="Descripción que se muestra en la página del producto"
        />
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <Label className="text-xs mb-1 block">Material</Label>
          <Input value={material} onChange={e => setMaterial(e.target.value)} className="h-8 text-sm" placeholder="Ej: Chapa 3,2mm" />
        </div>
        <div>
          <Label className="text-xs mb-1 block">Incluye (separado por comas)</Label>
          <Input value={includesRaw} onChange={e => setIncludesRaw(e.target.value)} className="h-8 text-sm" placeholder="Parrilla, Estaca, Tapa" />
        </div>
      </div>
      <div className="flex gap-2">
        <Button size="sm" onClick={handleSave} disabled={saving} className="gap-1">
          <Save className="w-3 h-3" /> {saving ? 'Guardando…' : 'Guardar'}
        </Button>
        <Button size="sm" variant="ghost" onClick={onClose} className="gap-1">
          <X className="w-3 h-3" /> Cancelar
        </Button>
      </div>
    </div>
  )
}

// ─── ProductCard ──────────────────────────────────────────────────────────────

function ProductCard({
  product,
  onUpdateVariant,
  onUpdateProduct,
  onToggleActive,
  onToggleFeatured,
  onCreateVariant,
}: {
  product: ProductWithVariants
  onUpdateVariant: (id: string, p: { price: number; sale_price: number | null; stock: number; active: boolean }) => Promise<void>
  onUpdateProduct: (id: string, p: { description: string; material: string; includes: string[] }) => Promise<void>
  onToggleActive: (id: string, active: boolean) => Promise<void>
  onToggleFeatured: (id: string, featured: boolean) => Promise<void>
  onCreateVariant: (p: CreateVariantPayload) => Promise<{ ok: boolean }>
}) {
  const [togglingActive, setTogglingActive] = useState(false)
  const [togglingFeatured, setTogglingFeatured] = useState(false)
  const [editingInfo, setEditingInfo] = useState(false)
  const [addingVariant, setAddingVariant] = useState(false)
  const [variantsOpen, setVariantsOpen] = useState(true)

  const activeSales = product.variants.filter(v => v.sale_price != null).length

  const handleToggleActive = async (v: boolean) => {
    setTogglingActive(true)
    await onToggleActive(product.id, v)
    setTogglingActive(false)
  }

  const handleToggleFeatured = async () => {
    setTogglingFeatured(true)
    await onToggleFeatured(product.id, !product.featured)
    setTogglingFeatured(false)
  }

  return (
    <Card className={product.featured ? 'border-amber-500/50 bg-amber-500/5' : ''}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <CardTitle className="text-lg">{product.name}</CardTitle>
              <Badge variant="outline" className="text-xs">{SHAPE_LABEL[product.shape]}</Badge>
              {product.featured && (
                <Badge className="text-xs gap-1 bg-amber-500/20 text-amber-600 border-amber-500/30">
                  <Star className="w-3 h-3 fill-amber-500" /> Destacado
                </Badge>
              )}
              {activeSales > 0 && (
                <Badge variant="destructive" className="text-xs gap-1">
                  <Tag className="w-3 h-3" /> {activeSales} en oferta
                </Badge>
              )}
            </div>
            <CardDescription className="line-clamp-2 text-xs">
              {product.description ?? 'Sin descripción — haz clic en Editar para agregar'}
            </CardDescription>
          </div>

          {/* Controls */}
          <div className="flex flex-col items-end gap-2 flex-shrink-0">
            {/* Featured + Active on same row for desktop */}
            <div className="flex items-center gap-3 flex-wrap justify-end">
              <button
                onClick={handleToggleFeatured}
                disabled={togglingFeatured}
                title={product.featured ? 'Quitar de destacados' : 'Marcar como destacado'}
                className={`flex items-center gap-1 text-xs px-2 py-1 rounded border transition-all ${
                  product.featured
                    ? 'bg-amber-500/20 border-amber-500/40 text-amber-600 hover:bg-amber-500/30'
                    : 'border-input text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
              >
                <Star className={`w-3.5 h-3.5 ${product.featured ? 'fill-amber-500' : ''}`} />
                <span className="hidden sm:inline">{product.featured ? 'Destacado' : 'Destacar'}</span>
              </button>
              <div className="flex items-center gap-2">
                <Label className="text-xs text-muted-foreground whitespace-nowrap">
                  {product.active ? 'Activo' : 'Inactivo'}
                </Label>
                <Switch
                  checked={product.active}
                  onCheckedChange={handleToggleActive}
                  disabled={togglingActive}
                />
              </div>
            </div>
            <Button
              size="sm"
              variant="outline"
              className="h-7 gap-1 text-xs"
              onClick={() => setEditingInfo(v => !v)}
            >
              <Edit2 className="w-3 h-3" />
              {editingInfo ? 'Cerrar' : 'Editar info'}
            </Button>
          </div>
        </div>

        {editingInfo && (
          <>
            <Separator className="mt-2" />
            <ProductInfoEditor product={product} onSave={onUpdateProduct} onClose={() => setEditingInfo(false)} />
          </>
        )}
      </CardHeader>

      <CardContent className="pt-0">
        <button
          className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 hover:text-foreground transition-colors w-full"
          onClick={() => setVariantsOpen(v => !v)}
        >
          {variantsOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          Variantes ({product.variants.length})
        </button>

        {variantsOpen && (
          <>
            <div className="divide-y">
              {product.variants.map(v => (
                <VariantRow key={v.id} variant={v} onSave={onUpdateVariant} />
              ))}
            </div>

            {addingVariant ? (
              <AddVariantForm
                productId={product.id}
                onCreate={onCreateVariant}
                onClose={() => setAddingVariant(false)}
              />
            ) : (
              <Button
                size="sm"
                variant="outline"
                className="mt-3 h-7 gap-1 text-xs"
                onClick={() => setAddingVariant(true)}
              >
                <Plus className="w-3 h-3" /> Agregar variante
              </Button>
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
}

// ─── NewProductDialog ─────────────────────────────────────────────────────────

interface VariantDraft {
  size: ProductSize
  color: ProductColor
  price: string
  sale_price: string
}

function NewProductDialog({
  onCreateProduct,
  onCreateVariant,
}: {
  onCreateProduct: (p: CreateProductPayload) => Promise<{ ok: boolean; product?: { id: string } }>
  onCreateVariant: (p: CreateVariantPayload) => Promise<{ ok: boolean }>
}) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [slugEdited, setSlugEdited] = useState(false)
  const [shape, setShape] = useState<ProductShape>('round')
  const [description, setDescription] = useState('')
  const [material, setMaterial] = useState('Chapa 3,2mm')
  const [includesRaw, setIncludesRaw] = useState('Parrilla, Estaca, Tapa')
  const [variants, setVariants] = useState<VariantDraft[]>([
    { size: '1.25m', color: 'negro', price: '', sale_price: '' },
  ])
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!slugEdited) setSlug(toSlug(name))
  }, [name, slugEdited])

  const addVariant = () => {
    setVariants(v => [...v, { size: '1.25m', color: 'negro', price: '', sale_price: '' }])
  }
  const removeVariant = (i: number) => setVariants(v => v.filter((_, idx) => idx !== i))
  const updateVariant = (i: number, field: keyof VariantDraft, value: string) => {
    setVariants(v => v.map((row, idx) => idx === i ? { ...row, [field]: value } : row))
  }

  const handleSave = async () => {
    if (!name.trim() || !slug.trim()) { setError('El nombre y el slug son obligatorios'); return }
    setSaving(true)
    setError('')
    const includes = includesRaw.split(',').map(s => s.trim()).filter(Boolean)
    const result = await onCreateProduct({ name: name.trim(), slug: slug.trim(), shape, description: description.trim() || undefined, material: material.trim() || undefined, includes: includes.length ? includes : undefined })
    if (!result.ok || !result.product) {
      setError('Error al crear el producto. ¿El slug ya existe?')
      setSaving(false)
      return
    }
    for (const v of variants) {
      if (v.price) {
        await onCreateVariant({
          product_id: result.product.id,
          size: v.size,
          color: v.color,
          price: Number(v.price),
          sale_price: v.sale_price ? Number(v.sale_price) : null,
        })
      }
    }
    setSaving(false)
    setOpen(false)
    // Reset
    setName(''); setSlug(''); setSlugEdited(false); setShape('round')
    setDescription(''); setMaterial('Chapa 3,2mm'); setIncludesRaw('Parrilla, Estaca, Tapa')
    setVariants([{ size: '1.25m', color: 'negro', price: '', sale_price: '' }])
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="w-4 h-4" /> Nuevo Producto
        </Button>
      </DialogTrigger>
      <DialogContent className="w-full max-w-2xl max-h-[92vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="w-5 h-5" /> Nuevo Producto
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5 pt-2">
          {/* Name + Slug */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <Label className="text-xs mb-1 block">Nombre del producto *</Label>
              <Input
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Ej: T-REX"
                className="text-sm"
              />
            </div>
            <div>
              <Label className="text-xs mb-1 block">Slug (URL) *</Label>
              <Input
                value={slug}
                onChange={e => { setSlug(e.target.value); setSlugEdited(true) }}
                placeholder="t-rex"
                className="text-sm font-mono"
              />
              <p className="text-xs text-muted-foreground mt-1">/productos/{slug || '…'}</p>
            </div>
          </div>

          {/* Shape */}
          <div>
            <Label className="text-xs mb-2 block">Forma</Label>
            <div className="flex gap-3">
              {(['round', 'square'] as ProductShape[]).map(s => (
                <button
                  key={s}
                  onClick={() => setShape(s)}
                  className={`flex-1 py-3 rounded-lg border text-sm font-medium transition-all ${
                    shape === s ? 'bg-primary text-primary-foreground border-primary' : 'border-input hover:bg-muted'
                  }`}
                >
                  {SHAPE_LABEL[s]}
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <Label className="text-xs mb-1 block">Descripción</Label>
            <Textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              rows={2}
              className="text-sm resize-none"
              placeholder="Descripción que se muestra en la página del producto"
            />
          </div>

          {/* Material + Includes */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <Label className="text-xs mb-1 block">Material</Label>
              <Input value={material} onChange={e => setMaterial(e.target.value)} className="text-sm h-9" placeholder="Chapa 3,2mm" />
            </div>
            <div>
              <Label className="text-xs mb-1 block">Incluye (separado por comas)</Label>
              <Input value={includesRaw} onChange={e => setIncludesRaw(e.target.value)} className="text-sm h-9" placeholder="Parrilla, Estaca, Tapa" />
            </div>
          </div>

          <Separator />

          {/* Variants */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <Label className="text-sm font-semibold">Variantes iniciales</Label>
              <Button size="sm" variant="outline" className="h-7 gap-1 text-xs" onClick={addVariant}>
                <Plus className="w-3 h-3" /> Agregar fila
              </Button>
            </div>

            <div className="space-y-3">
              {variants.map((v, i) => (
                <div key={i} className="grid grid-cols-2 gap-2 sm:grid-cols-5 items-end bg-muted/40 p-3 rounded-lg">
                  {/* Size */}
                  <div>
                    <Label className="text-xs mb-1 block">Tamaño</Label>
                    <div className="flex gap-1">
                      {SIZES.map(s => (
                        <button
                          key={s}
                          onClick={() => updateVariant(i, 'size', s)}
                          className={`flex-1 h-8 text-xs rounded border transition-colors ${v.size === s ? 'bg-primary text-primary-foreground border-primary' : 'border-input bg-background hover:bg-muted'}`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                  {/* Color */}
                  <div>
                    <Label className="text-xs mb-1 block">Color</Label>
                    <div className="flex gap-2 mt-1">
                      {COLORS.map(c => (
                        <button
                          key={c}
                          onClick={() => updateVariant(i, 'color', c)}
                          title={COLOR_LABEL[c]}
                          className={`w-8 h-8 rounded-full border-2 transition-all ${v.color === c ? 'border-primary scale-110' : 'border-transparent opacity-70'}`}
                          style={{ background: COLOR_SWATCH[c] }}
                        />
                      ))}
                    </div>
                  </div>
                  {/* Price */}
                  <div>
                    <Label className="text-xs mb-1 block">Precio ($) *</Label>
                    <Input
                      type="number"
                      placeholder="0"
                      value={v.price}
                      onChange={e => updateVariant(i, 'price', e.target.value)}
                      className="h-8 text-sm"
                    />
                  </div>
                  {/* Sale price */}
                  <div>
                    <Label className="text-xs mb-1 flex items-center gap-1">
                      <Tag className="w-3 h-3" /> Oferta ($)
                    </Label>
                    <Input
                      type="number"
                      placeholder="Opcional"
                      value={v.sale_price}
                      onChange={e => updateVariant(i, 'sale_price', e.target.value)}
                      className="h-8 text-sm"
                    />
                  </div>
                  {/* Remove */}
                  <div className="flex items-end justify-end sm:justify-center">
                    {variants.length > 1 && (
                      <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive" onClick={() => removeVariant(i)}>
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Las filas sin precio serán ignoradas. Podés agregar más variantes después.
            </p>
          </div>

          {error && (
            <p className="text-sm text-destructive bg-destructive/10 px-3 py-2 rounded">{error}</p>
          )}

          <div className="flex gap-3 pt-1">
            <Button onClick={handleSave} disabled={saving || !name || !slug} className="flex-1 gap-2">
              <Save className="w-4 h-4" /> {saving ? 'Creando producto…' : 'Crear Producto'}
            </Button>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// ─── Main export ──────────────────────────────────────────────────────────────

export function ProductManager() {
  const { products, isLoading, updateProduct, updateVariant, createProduct, createVariant } = useProducts(true)

  const handleUpdateVariant = async (id: string, payload: { price: number; sale_price: number | null; stock: number; active: boolean }) => {
    await updateVariant(id, payload)
  }

  const handleUpdateProduct = async (id: string, payload: { description: string; material: string; includes: string[] }) => {
    await updateProduct(id, payload)
  }

  const handleToggleActive = async (id: string, active: boolean) => {
    await updateProduct(id, { active })
  }

  const handleToggleFeatured = async (id: string, featured: boolean) => {
    await updateProduct(id, { featured })
  }

  const handleCreateVariant = async (payload: CreateVariantPayload) => {
    return createVariant(payload)
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[0, 1].map(i => (
          <div key={i} className="h-40 rounded-lg bg-muted/40 animate-pulse" />
        ))}
      </div>
    )
  }

  const totalOnSale = products.reduce((acc, p) => acc + p.variants.filter(v => v.sale_price != null).length, 0)
  const featuredCount = products.filter(p => p.featured).length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <Package className="w-5 h-5 text-muted-foreground mt-0.5" />
          <div>
            <h2 className="text-lg font-semibold">Gestión de Productos</h2>
            <p className="text-sm text-muted-foreground">
              {products.length} modelo{products.length !== 1 ? 's' : ''}
              {featuredCount > 0 && ` · ${featuredCount} destacado${featuredCount !== 1 ? 's' : ''}`}
              {totalOnSale > 0 && ` · ${totalOnSale} en oferta`}
            </p>
          </div>
        </div>
        <NewProductDialog onCreateProduct={createProduct} onCreateVariant={handleCreateVariant} />
      </div>

      {/* Product cards */}
      {products.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-center gap-4">
            <Package className="w-12 h-12 text-muted-foreground/40" />
            <div>
              <p className="font-medium">No hay productos todavía</p>
              <p className="text-sm text-muted-foreground mt-1">Creá el primer producto con el botón de arriba</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {products.map(p => (
            <ProductCard
              key={p.id}
              product={p}
              onUpdateVariant={handleUpdateVariant}
              onUpdateProduct={handleUpdateProduct}
              onToggleActive={handleToggleActive}
              onToggleFeatured={handleToggleFeatured}
              onCreateVariant={handleCreateVariant}
            />
          ))}
        </div>
      )}
    </div>
  )
}
