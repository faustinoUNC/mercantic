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
  Plus, Star, Sparkles, Trash2, CircleCheck, ImagePlus, Loader2, Trash, Search, ArchiveRestore,
} from 'lucide-react'
import { useProducts } from '@/frontend/hooks/useProducts'
import type {
  ProductWithVariants, ProductVariant,
  ProductSize, ProductColor,
  CreateProductPayload, CreateVariantPayload,
} from '@/backend/features/products/models/product.model'
import { formatPrice } from '@/lib/utils/formatting'

// ─── Constants ────────────────────────────────────────────────────────────────

const COLOR_LABEL: Record<string, string> = { negro: 'Negro', oxido: 'Óxido' }
const COLOR_SWATCH: Record<string, string> = { negro: '#1a1a1a', oxido: '#8B4513' }
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

// ─── ImageUploader ────────────────────────────────────────────────────────────

function ImageUploader({
  productId,
  currentUrls,
  onUpdated,
  onRefresh,
}: {
  productId: string
  currentUrls: string[]
  onUpdated: (urls: string[]) => void
  onRefresh?: () => void
}) {
  const [uploading, setUploading] = useState(false)
  const [deletingIdx, setDeletingIdx] = useState<number | null>(null)
  const [error, setError] = useState('')
  const [savedMsg, setSavedMsg] = useState('')

  function showSaved(msg: string) {
    setSavedMsg(msg)
    setTimeout(() => setSavedMsg(''), 2500)
  }

  async function handleFile(file: File) {
    setError('')
    setUploading(true)
    const form = new FormData()
    form.append('file', file)
    form.append('existing_urls', JSON.stringify(currentUrls))
    const res = await fetch(`/api/products/${productId}/image`, { method: 'POST', body: form })
    const data = await res.json()
    setUploading(false)
    if (!res.ok) { setError(data.error ?? 'Error al subir'); return }
    const newUrls = data.image_urls ?? (data.image_url ? [data.image_url] : [])
    onUpdated(newUrls)
    showSaved('✓ Imagen guardada')
    onRefresh?.()
  }

  async function handleDelete(index: number) {
    setDeletingIdx(index)
    const res = await fetch(`/api/products/${productId}/image`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ index, current_urls: currentUrls }),
    })
    const data = await res.json()
    setDeletingIdx(null)
    onUpdated(data.image_urls ?? [])
    showSaved('✓ Imagen eliminada')
    onRefresh?.()
  }

  return (
    <div className="space-y-3 py-3">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Imágenes del producto ({currentUrls.length} / 5)
        </p>
        {savedMsg && (
          <span className="text-xs text-emerald-500 flex items-center gap-1 font-medium">
            <CircleCheck className="w-3 h-3" /> {savedMsg}
          </span>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {currentUrls.map((url, idx) => (
          <div key={url} className="relative">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={url} alt={`Imagen ${idx + 1}`} className="h-28 w-28 object-cover rounded-lg border" />
            {idx === 0 && (
              <span className="absolute bottom-1 left-1 bg-primary text-primary-foreground text-[10px] px-1 rounded">Principal</span>
            )}
            <button
              onClick={() => handleDelete(idx)}
              disabled={deletingIdx === idx}
              className="absolute top-1 right-1 bg-background/90 hover:bg-destructive hover:text-destructive-foreground border rounded p-1 shadow-sm transition-colors"
              title="Eliminar imagen"
            >
              {deletingIdx === idx ? <Loader2 className="w-3 h-3 animate-spin" /> : <Trash className="w-3 h-3" />}
            </button>
          </div>
        ))}

        {currentUrls.length < 5 && (
          <label className={`flex flex-col items-center justify-center h-28 w-28 rounded-lg border-2 border-dashed cursor-pointer transition-colors ${uploading ? 'opacity-50 pointer-events-none' : 'hover:border-primary hover:bg-muted/40'}`}>
            {uploading
              ? <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
              : <><ImagePlus className="w-6 h-6 text-muted-foreground mb-1" /><span className="text-[10px] text-muted-foreground text-center px-1">Agregar<br/>JPG/PNG/WEBP</span></>
            }
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="sr-only"
              onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); e.target.value = '' }}
            />
          </label>
        )}
      </div>

      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  )
}

// ─── VariantRow ───────────────────────────────────────────────────────────────

function VariantRow({
  variant,
  onSave,
  onDelete,
}: {
  variant: ProductVariant
  onSave: (id: string, payload: { price: number; sale_price: number | null; stock: number; active: boolean }) => Promise<void>
  onDelete: (id: string) => Promise<void>
}) {
  const [editing, setEditing] = useState(false)
  const [price, setPrice] = useState(variant.price)
  const [salePrice, setSalePrice] = useState(variant.sale_price != null ? String(variant.sale_price) : '')
  const [stock, setStock] = useState(variant.stock)
  const [active, setActive] = useState(variant.active)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)

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
            <div className="ml-auto flex gap-1">
              {confirmDelete ? (
                <>
                  <span className="text-xs text-destructive self-center">¿Eliminar?</span>
                  <Button size="sm" variant="destructive" className="h-7 text-xs" disabled={deleting}
                    onClick={async () => { setDeleting(true); await onDelete(variant.id) }}>
                    {deleting ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Sí'}
                  </Button>
                  <Button size="sm" variant="ghost" className="h-7 text-xs" onClick={() => setConfirmDelete(false)}>No</Button>
                </>
              ) : (
                <>
                  <Button size="sm" variant="ghost" className="h-7 gap-1 text-xs" onClick={() => setEditing(true)}>
                    <Edit2 className="w-3 h-3" /> Editar
                  </Button>
                  <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive" onClick={() => setConfirmDelete(true)}>
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </>
              )}
            </div>
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
  onEdit,
}: {
  product: ProductWithVariants
  onSave: (id: string, payload: { description: string; material: string; includes: string[] }) => Promise<void>
  onClose: () => void
  onEdit?: () => void
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
          onChange={e => { setDescription(e.target.value); onEdit?.() }}
          rows={3}
          className="text-sm resize-none"
          placeholder="Descripción que se muestra en la página del producto"
        />
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <Label className="text-xs mb-1 block">Material</Label>
          <Input value={material} onChange={e => { setMaterial(e.target.value); onEdit?.() }} className="h-8 text-sm" placeholder="Ej: Chapa 3,2mm" />
        </div>
        <div>
          <Label className="text-xs mb-1 block">Incluye (separado por comas)</Label>
          <Input value={includesRaw} onChange={e => { setIncludesRaw(e.target.value); onEdit?.() }} className="h-8 text-sm" placeholder="Parrilla, Estaca, Tapa" />
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

// ─── ProductEditModal ─────────────────────────────────────────────────────────

function ProductEditModal({
  product,
  open,
  onClose,
  onUpdateVariant,
  onDeleteVariant,
  onUpdateProduct,
  onToggleActive,
  onToggleFeatured,
  onToggleIsNew,
  onCreateVariant,
  onRefresh,
}: {
  product: ProductWithVariants
  open: boolean
  onClose: () => void
  onUpdateVariant: (id: string, p: { price: number; sale_price: number | null; stock: number; active: boolean }) => Promise<void>
  onDeleteVariant: (id: string) => Promise<void>
  onUpdateProduct: (id: string, p: { description: string; material: string; includes: string[] }) => Promise<void>
  onToggleActive: (id: string, active: boolean) => Promise<void>
  onToggleFeatured: (id: string, featured: boolean) => Promise<void>
  onToggleIsNew: (id: string, is_new: boolean) => Promise<void>
  onCreateVariant: (p: CreateVariantPayload) => Promise<{ ok: boolean }>
  onRefresh?: () => void
}) {
  const [addingVariant, setAddingVariant] = useState(false)
  const [editingInfo, setEditingInfo] = useState(false)
  const [hasUnsavedInfo, setHasUnsavedInfo] = useState(false)
  const [imageUrls, setImageUrls] = useState<string[]>(
    product.image_urls?.length ? product.image_urls : product.image_url ? [product.image_url] : []
  )

  function handleClose() {
    if (hasUnsavedInfo && editingInfo) {
      if (!window.confirm('Tenés cambios en la información sin guardar. ¿Cerrar de todas formas?')) return
    }
    setHasUnsavedInfo(false)
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={v => { if (!v) handleClose() }}>
      <DialogContent
        className="w-full max-w-2xl max-h-[92vh] overflow-y-auto"
        onInteractOutside={e => e.preventDefault()}
        onPointerDownOutside={e => e.preventDefault()}
        onFocusOutside={e => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="w-5 h-5" /> {product.name}
          </DialogTitle>
        </DialogHeader>

        {hasUnsavedInfo && editingInfo && (
          <div className="flex items-center gap-2 px-3 py-2 rounded-md bg-amber-500/10 border border-amber-500/30 text-amber-500 text-xs font-medium">
            <Save className="w-3.5 h-3.5 flex-shrink-0" />
            Cambios sin guardar en la información del producto
          </div>
        )}

        <div className="space-y-5 pt-2">
          {/* Toggles */}
          <div className="flex items-center gap-6 flex-wrap">
            <div className="flex items-center gap-2">
              <Switch
                checked={product.active}
                onCheckedChange={v => onToggleActive(product.id, v)}
              />
              <Label className="text-sm">{product.active ? 'Activo' : 'Inactivo'}</Label>
            </div>
            <button
              onClick={() => onToggleFeatured(product.id, !product.featured)}
              className={`flex items-center gap-1.5 text-sm px-3 py-1.5 rounded border transition-all ${
                product.featured
                  ? 'bg-amber-500/20 border-amber-500/40 text-amber-600'
                  : 'border-input text-muted-foreground hover:bg-muted'
              }`}
            >
              <Star className={`w-3.5 h-3.5 ${product.featured ? 'fill-amber-500' : ''}`} />
              {product.featured ? 'Destacado' : 'Marcar destacado'}
            </button>
            <button
              onClick={() => onToggleIsNew(product.id, !product.is_new)}
              className={`flex items-center gap-1.5 text-sm px-3 py-1.5 rounded border transition-all ${
                product.is_new
                  ? 'bg-sky-500/20 border-sky-500/40 text-sky-600'
                  : 'border-input text-muted-foreground hover:bg-muted'
              }`}
            >
              <Sparkles className={`w-3.5 h-3.5 ${product.is_new ? 'fill-sky-500' : ''}`} />
              {product.is_new ? 'Nuevo lanzamiento' : 'Marcar como nuevo'}
            </button>
          </div>

          <Separator />

          {/* Product info */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Información</Label>
              <Button size="sm" variant="ghost" className="h-7 gap-1 text-xs" onClick={() => setEditingInfo(v => !v)}>
                <Edit2 className="w-3 h-3" /> {editingInfo ? 'Cerrar' : 'Editar'}
              </Button>
            </div>
            {editingInfo
              ? <ProductInfoEditor product={product} onSave={onUpdateProduct} onClose={() => { setEditingInfo(false); setHasUnsavedInfo(false) }} onEdit={() => setHasUnsavedInfo(true)} />
              : (
                <div className="text-sm text-muted-foreground space-y-1">
                  <p>{product.description ?? <span className="italic">Sin descripción</span>}</p>
                  {product.material && <p className="text-xs">Material: {product.material}</p>}
                  {product.includes?.length > 0 && <p className="text-xs">Incluye: {product.includes.join(', ')}</p>}
                </div>
              )
            }
          </div>

          <Separator />

          {/* Images */}
          <ImageUploader productId={product.id} currentUrls={imageUrls} onUpdated={setImageUrls} onRefresh={onRefresh} />

          <Separator />

          {/* Variants */}
          <div>
            <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 block">
              Variantes ({product.variants.length})
            </Label>
            <div className="divide-y">
              {product.variants.map(v => (
                <VariantRow key={v.id} variant={v} onSave={onUpdateVariant} onDelete={onDeleteVariant} />
              ))}
            </div>
            {addingVariant ? (
              <AddVariantForm productId={product.id} onCreate={onCreateVariant} onClose={() => setAddingVariant(false)} />
            ) : (
              <Button size="sm" variant="outline" className="mt-3 h-7 gap-1 text-xs" onClick={() => setAddingVariant(true)}>
                <Plus className="w-3 h-3" /> Agregar variante
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// ─── ProductRow ───────────────────────────────────────────────────────────────

function ProductRow({
  product,
  onUpdateVariant,
  onDeleteVariant,
  onUpdateProduct,
  onToggleActive,
  onToggleFeatured,
  onToggleIsNew,
  onCreateVariant,
  onDeleteProduct,
  onRefresh,
}: {
  product: ProductWithVariants
  onUpdateVariant: (id: string, p: { price: number; sale_price: number | null; stock: number; active: boolean }) => Promise<void>
  onDeleteVariant: (id: string) => Promise<void>
  onUpdateProduct: (id: string, p: { description: string; material: string; includes: string[] }) => Promise<void>
  onToggleActive: (id: string, active: boolean) => Promise<void>
  onToggleFeatured: (id: string, featured: boolean) => Promise<void>
  onToggleIsNew: (id: string, is_new: boolean) => Promise<void>
  onCreateVariant: (p: CreateVariantPayload) => Promise<{ ok: boolean }>
  onDeleteProduct: (id: string) => Promise<void>
  onRefresh?: () => void
}) {
  const [editOpen, setEditOpen] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [togglingActive, setTogglingActive] = useState(false)

  const thumb = product.image_urls?.[0] ?? product.image_url ?? null
  const activeVariants = product.variants.filter(v => v.active)
  const prices = activeVariants.map(v => v.sale_price ?? v.price)
  const priceMin = prices.length ? Math.min(...prices) : null
  const priceMax = prices.length ? Math.max(...prices) : null
  const onSale = product.variants.filter(v => v.sale_price != null).length

  const handleToggleActive = async (v: boolean) => {
    setTogglingActive(true)
    await onToggleActive(product.id, v)
    setTogglingActive(false)
  }

  const handleDelete = async () => {
    setDeleting(true)
    await onDeleteProduct(product.id)
    setDeleting(false)
    setConfirmDelete(false)
  }

  return (
    <>
      <div className={`border-b last:border-b-0 ${product.featured ? 'bg-amber-500/5' : ''}`}>

        {/* ── Mobile card ── */}
        <div className="flex sm:hidden gap-3 p-4">
          <div className="w-16 h-16 flex-shrink-0 rounded-xl border overflow-hidden bg-muted">
            {thumb
              // eslint-disable-next-line @next/next/no-img-element
              ? <img src={thumb} alt={product.name} className="w-full h-full object-cover" />
              : <div className="w-full h-full flex items-center justify-center text-muted-foreground/40"><Package className="w-5 h-5" /></div>
            }
          </div>
          <div className="flex-1 min-w-0 flex flex-col gap-2">
            <div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="font-semibold text-sm">{product.name}</span>
                {product.featured && <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />}
                {product.is_new && <Sparkles className="w-3.5 h-3.5 text-sky-500" />}
                {onSale > 0 && <Badge variant="destructive" className="text-[10px] px-1 py-0">{onSale} oferta</Badge>}
              </div>
              <div className="text-xs text-muted-foreground mt-0.5">
                {product.variants.length} variante{product.variants.length !== 1 ? 's' : ''}
                {priceMin !== null && (
                  <> · {formatPrice(priceMin)}{priceMin !== priceMax && priceMax !== null && ` – ${formatPrice(priceMax)}`}</>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Switch checked={product.active} onCheckedChange={handleToggleActive} disabled={togglingActive} />
              <span className="text-xs text-muted-foreground">{product.active ? 'Activo' : 'Inactivo'}</span>
              <div className="ml-auto flex gap-1">
                <button
                  onClick={() => onToggleFeatured(product.id, !product.featured)}
                  className={`p-2 rounded-lg border transition-all ${product.featured ? 'border-amber-500/40 bg-amber-500/10 text-amber-500' : 'border-transparent text-muted-foreground/30 hover:text-amber-400'}`}
                >
                  <Star className={`w-4 h-4 ${product.featured ? 'fill-amber-500' : ''}`} />
                </button>
                <button
                  onClick={() => onToggleIsNew(product.id, !product.is_new)}
                  className={`p-2 rounded-lg border transition-all ${product.is_new ? 'border-sky-500/40 bg-sky-500/10 text-sky-500' : 'border-transparent text-muted-foreground/30 hover:text-sky-400'}`}
                >
                  <Sparkles className={`w-4 h-4 ${product.is_new ? 'fill-sky-400' : ''}`} />
                </button>
              </div>
            </div>
            <div className="flex gap-2">
              <Button className="flex-1 h-10 gap-1.5 text-sm" onClick={() => setEditOpen(true)}>
                <Edit2 className="w-4 h-4" /> Editar
              </Button>
              {confirmDelete ? (
                <>
                  <span className="text-xs text-destructive self-center whitespace-nowrap">¿Eliminar?</span>
                  <Button variant="destructive" className="h-10 px-3 text-sm" disabled={deleting} onClick={handleDelete}>
                    {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Sí'}
                  </Button>
                  <Button variant="ghost" className="h-10 px-3" onClick={() => setConfirmDelete(false)}>No</Button>
                </>
              ) : (
                <Button variant="ghost" className="h-10 w-10 p-0 text-muted-foreground hover:text-destructive" onClick={() => setConfirmDelete(true)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* ── Desktop row ── */}
        <div className="hidden sm:flex items-center gap-3 px-4 py-3 hover:bg-muted/30 transition-colors">
          <div className="w-10 h-10 flex-shrink-0 rounded-md border overflow-hidden bg-muted">
            {thumb
              // eslint-disable-next-line @next/next/no-img-element
              ? <img src={thumb} alt={product.name} className="w-full h-full object-cover" />
              : <div className="w-full h-full flex items-center justify-center text-muted-foreground/40"><Package className="w-4 h-4" /></div>
            }
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="font-semibold text-sm truncate">{product.name}</span>
              {product.featured && <Star className="w-3 h-3 text-amber-500 fill-amber-500" />}
              {product.is_new && <Sparkles className="w-3 h-3 text-sky-500" />}
              {onSale > 0 && <Badge variant="destructive" className="text-[10px] px-1 py-0">{onSale} oferta</Badge>}
            </div>
            <div className="text-xs text-muted-foreground mt-0.5">
              {product.variants.length} variante{product.variants.length !== 1 ? 's' : ''}
              {priceMin !== null && (
                <> · {formatPrice(priceMin)}{priceMin !== priceMax && priceMax !== null && ` – ${formatPrice(priceMax)}`}</>
              )}
            </div>
          </div>
          <button
            onClick={() => onToggleFeatured(product.id, !product.featured)}
            title={product.featured ? 'Quitar de destacados' : 'Marcar como destacado'}
            className={`flex-shrink-0 rounded p-1 transition-all ${product.featured ? 'text-amber-500' : 'text-muted-foreground/30 hover:text-amber-400'}`}
          >
            <Star className={`w-4 h-4 ${product.featured ? 'fill-amber-500' : ''}`} />
          </button>
          <button
            onClick={() => onToggleIsNew(product.id, !product.is_new)}
            title={product.is_new ? 'Quitar de nuevos lanzamientos' : 'Marcar como nuevo lanzamiento'}
            className={`flex-shrink-0 rounded p-1 transition-all ${product.is_new ? 'text-sky-500' : 'text-muted-foreground/30 hover:text-sky-400'}`}
          >
            <Sparkles className="w-4 h-4" />
          </button>
          <Switch checked={product.active} onCheckedChange={handleToggleActive} disabled={togglingActive} className="flex-shrink-0" />
          <div className="flex items-center gap-1 flex-shrink-0">
            <Button size="sm" variant="outline" className="h-7 gap-1 text-xs" onClick={() => setEditOpen(true)}>
              <Edit2 className="w-3 h-3" /> Editar
            </Button>
            {confirmDelete ? (
              <div className="flex items-center gap-1">
                <span className="text-xs text-destructive whitespace-nowrap">¿Eliminar?</span>
                <Button size="sm" variant="destructive" className="h-7 text-xs" onClick={handleDelete} disabled={deleting}>
                  {deleting ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Sí'}
                </Button>
                <Button size="sm" variant="ghost" className="h-7 text-xs" onClick={() => setConfirmDelete(false)}>No</Button>
              </div>
            ) : (
              <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive" onClick={() => setConfirmDelete(true)}>
                <Trash2 className="w-3.5 h-3.5" />
              </Button>
            )}
          </div>
        </div>
      </div>

      {editOpen && (
        <ProductEditModal
          product={product}
          open={editOpen}
          onClose={() => setEditOpen(false)}
          onUpdateVariant={onUpdateVariant}
          onDeleteVariant={onDeleteVariant}
          onUpdateProduct={onUpdateProduct}
          onToggleActive={onToggleActive}
          onToggleFeatured={onToggleFeatured}
          onToggleIsNew={onToggleIsNew}
          onCreateVariant={onCreateVariant}
          onRefresh={onRefresh}
        />
      )}
    </>
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
  onRefresh,
}: {
  onCreateProduct: (p: CreateProductPayload) => Promise<{ ok: boolean; product?: { id: string } }>
  onCreateVariant: (p: CreateVariantPayload) => Promise<{ ok: boolean }>
  onRefresh?: () => void
}) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [description, setDescription] = useState('')
  const [material, setMaterial] = useState('Chapa 3,2mm')
  const [includesRaw, setIncludesRaw] = useState('Parrilla, Estaca, Tapa')
  const [variants, setVariants] = useState<VariantDraft[]>([
    { size: '1.25m', color: 'negro', price: '', sale_price: '' },
  ])
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [createdProductId, setCreatedProductId] = useState<string | null>(null)
  const [imageUrls, setImageUrls] = useState<string[]>([])

  useEffect(() => {
    setSlug(toSlug(name))
  }, [name])

  const addVariant = () => {
    setVariants(v => [...v, { size: '1.25m', color: 'negro', price: '', sale_price: '' }])
  }
  const removeVariant = (i: number) => setVariants(v => v.filter((_, idx) => idx !== i))
  const updateVariant = (i: number, field: keyof VariantDraft, value: string) => {
    setVariants(v => v.map((row, idx) => idx === i ? { ...row, [field]: value } : row))
  }

  const handleSave = async () => {
    if (!name.trim()) { setError('El nombre del producto es obligatorio'); return }
    setSaving(true)
    setError('')
    const includes = includesRaw.split(',').map(s => s.trim()).filter(Boolean)
    const result = await onCreateProduct({ name: name.trim(), slug: slug.trim(), shape: 'round', description: description.trim() || undefined, material: material.trim() || undefined, includes: includes.length ? includes : undefined })
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
    setCreatedProductId(result.product.id)
  }

  function handleFinish() {
    onRefresh?.()
    setOpen(false)
    setCreatedProductId(null)
    setImageUrls([])
    setName(''); setSlug('')
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
      <DialogContent
        className="w-full max-w-2xl max-h-[92vh] overflow-y-auto"
        onInteractOutside={e => e.preventDefault()}
        onPointerDownOutside={e => e.preventDefault()}
        onFocusOutside={e => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="w-5 h-5" /> {createdProductId ? `${name} — Imágenes` : 'Nuevo Producto'}
          </DialogTitle>
        </DialogHeader>

        {/* Step 2: image upload after product created */}
        {createdProductId ? (
          <div className="space-y-4 pt-2">
            <p className="text-sm text-muted-foreground">
              Producto creado. Ahora podés agregar fotos (opcional).
            </p>
            <ImageUploader productId={createdProductId} currentUrls={imageUrls} onUpdated={setImageUrls} />
            <Button onClick={handleFinish} className="w-full gap-2">
              <CircleCheck className="w-4 h-4" /> Listo
            </Button>
          </div>
        ) : (

        <div className="space-y-5 pt-2">
          {/* Name */}
          <div>
            <Label className="text-xs mb-1 block">Nombre del producto *</Label>
            <Input
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Ej: T-REX"
              className="text-sm"
            />
            {name && <p className="text-xs text-muted-foreground mt-1">/productos/{slug || '…'}</p>}
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
            <Button onClick={handleSave} disabled={saving || !name} className="flex-1 gap-2">
              <Save className="w-4 h-4" /> {saving ? 'Creando producto…' : 'Crear Producto'}
            </Button>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
          </div>
        </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

// ─── Main export ──────────────────────────────────────────────────────────────

export function ProductManager() {
  const { products, deletedProducts, isLoading, refresh, updateProduct, updateVariant, deleteVariant, deleteProduct, restoreProduct, createProduct, createVariant } = useProducts(true)
  const [search, setSearch] = useState('')

  const handleUpdateVariant = async (id: string, payload: { price: number; sale_price: number | null; stock: number; active: boolean }) => {
    await updateVariant(id, payload)
  }

  const handleDeleteVariant = async (id: string) => {
    await deleteVariant(id)
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

  const handleToggleIsNew = async (id: string, is_new: boolean) => {
    await updateProduct(id, { is_new })
  }

  const handleCreateVariant = async (payload: CreateVariantPayload) => {
    return createVariant(payload)
  }

  const handleDeleteProduct = async (id: string) => {
    await deleteProduct(id)
  }

  // Only show skeleton on initial load (products not yet fetched).
  // Subsequent refreshes (after image upload, toggle, etc.) must NOT unmount
  // open dialogs — that would silently close them mid-interaction.
  if (isLoading && products.length === 0) {
    return (
      <div className="space-y-2">
        {[0, 1, 2].map(i => (
          <div key={i} className="h-16 rounded-lg bg-muted/40 animate-pulse" />
        ))}
      </div>
    )
  }

  const filtered = search.trim()
    ? products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.slug.includes(search.toLowerCase()))
    : products

  const totalOnSale = products.reduce((acc, p) => acc + p.variants.filter(v => v.sale_price != null).length, 0)
  const featuredCount = products.filter(p => p.featured).length

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold">Gestión de Productos</h2>
          <p className="text-sm text-muted-foreground">
            {products.length} modelo{products.length !== 1 ? 's' : ''}
            {featuredCount > 0 && ` · ${featuredCount} destacado${featuredCount !== 1 ? 's' : ''}`}
            {totalOnSale > 0 && ` · ${totalOnSale} en oferta`}
          </p>
        </div>
        <NewProductDialog onCreateProduct={createProduct} onCreateVariant={handleCreateVariant} onRefresh={refresh} />
      </div>

      {/* Search + table */}
      <Card>
        {/* Search bar */}
        <div className="px-4 py-3 border-b">
          <div className="relative max-w-xs">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <Input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Buscar por nombre…"
              className="pl-8 h-8 text-sm"
            />
          </div>
        </div>

        {/* Column headers */}
        <div className="hidden sm:flex items-center gap-3 px-4 py-2 bg-muted/30 text-xs font-semibold uppercase tracking-wider text-muted-foreground border-b">
          <div className="w-10 flex-shrink-0" />
          <div className="flex-1">Producto</div>
          <div className="w-16 text-center">Activo</div>
          <div className="w-40 text-right">Acciones</div>
        </div>

        {/* Rows */}
        {filtered.length === 0 ? (
          <CardContent className="flex flex-col items-center justify-center py-16 text-center gap-4">
            <Package className="w-10 h-10 text-muted-foreground/40" />
            <div>
              <p className="font-medium">{search ? 'Sin resultados' : 'No hay productos todavía'}</p>
              <p className="text-sm text-muted-foreground mt-1">
                {search ? 'Probá con otro nombre' : 'Creá el primer producto con el botón de arriba'}
              </p>
            </div>
          </CardContent>
        ) : (
          filtered.map(p => (
            <ProductRow
              key={p.id}
              product={p}
              onUpdateVariant={handleUpdateVariant}
              onDeleteVariant={handleDeleteVariant}
              onUpdateProduct={handleUpdateProduct}
              onToggleActive={handleToggleActive}
              onToggleFeatured={handleToggleFeatured}
              onToggleIsNew={handleToggleIsNew}
              onCreateVariant={handleCreateVariant}
              onDeleteProduct={handleDeleteProduct}
              onRefresh={refresh}
            />
          ))
        )}
      </Card>

      {/* ── Archived products ── */}
      {deletedProducts.length > 0 && (
        <div className="mt-6">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-3">
            Archivados ({deletedProducts.length})
          </p>
          <Card>
            <CardContent className="p-0 divide-y">
              {deletedProducts.map(p => (
                <div key={p.id} className="flex items-center gap-3 px-4 py-3">
                  {/* Thumbnail */}
                  {p.image_urls?.[0] ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={p.image_urls[0]} alt={p.name} className="w-10 h-10 rounded object-cover shrink-0 opacity-50" />
                  ) : (
                    <div className="w-10 h-10 rounded bg-muted shrink-0 opacity-50" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-muted-foreground line-through truncate">{p.name}</p>
                    <p className="text-xs text-muted-foreground/60">
                      Archivado {p.deleted_at ? new Date(p.deleted_at).toLocaleDateString('es-AR') : ''}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="gap-1.5 text-xs h-7 shrink-0"
                    onClick={() => restoreProduct(p.id)}
                  >
                    <ArchiveRestore className="w-3.5 h-3.5" /> Restaurar
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
