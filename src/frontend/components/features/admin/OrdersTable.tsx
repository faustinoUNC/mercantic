'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tooltip as InfoTooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import {
  Search, Package, TrendingUp, Clock, Bell, Plus,
  User, Phone, Mail, MapPin, FileText, ShoppingBag, Copy, Check, Truck, PackageCheck,
} from 'lucide-react'
import type { OrderComplete } from '@/backend/features/orders/models/order.model'
import { useOrders } from '@/frontend/hooks/useOrders'
import { useProducts } from '@/frontend/hooks/useProducts'
import { formatPrice, formatDate } from '@/lib/utils/formatting'

const PROVINCES = [
  'Buenos Aires','Ciudad Autónoma de Buenos Aires','Catamarca','Chaco','Chubut',
  'Córdoba','Corrientes','Entre Ríos','Formosa','Jujuy','La Pampa','La Rioja',
  'Mendoza','Misiones','Neuquén','Río Negro','Salta','San Juan','San Luis',
  'Santa Cruz','Santa Fe','Santiago del Estero','Tierra del Fuego','Tucumán',
]

const DELIVERY_CONFIG: Record<string, { label: string; icon: React.ElementType; trigger: string; dot: string }> = {
  pending:   { label: 'Pendiente',  icon: Clock,         trigger: 'border-amber-300 bg-amber-50 text-amber-900 hover:bg-amber-100', dot: 'bg-amber-400' },
  shipped:   { label: 'Enviado',    icon: Truck,         trigger: 'border-blue-300 bg-blue-50 text-blue-900 hover:bg-blue-100',   dot: 'bg-blue-500'  },
  delivered: { label: 'Entregado',  icon: PackageCheck,  trigger: 'border-green-300 bg-green-50 text-green-900 hover:bg-green-100', dot: 'bg-green-500' },
}

function DeliveryBadge({ status }: { status: string }) {
  const cfg = DELIVERY_CONFIG[status]
  if (!cfg) return <Badge variant="outline">{status}</Badge>
  const Icon = cfg.icon
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${cfg.trigger}`}>
      <Icon className="w-3 h-3" />{cfg.label}
    </span>
  )
}

// ── Manual Order Dialog helpers (defined at module level to avoid remount on each render) ──

function FLabel({ label, error, required, children }: { label: string; error?: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <label className="text-xs text-muted-foreground font-medium">
        {label}{required && <span className="text-destructive ml-0.5">*</span>}
      </label>
      {children}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  )
}

function Sec({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-3">
      <h4 className="text-sm font-semibold border-b pb-2">{title}</h4>
      {children}
    </div>
  )
}

// ── Manual Order Dialog ───────────────────────────────────────────────────────

function ManualOrderDialog({ open, onClose, onCreated }: {
  open: boolean
  onClose: () => void
  onCreated: () => void
}) {
  const { products, isLoading: productsLoading } = useProducts()
  const [submitting, setSubmitting] = useState(false)
  const [globalError, setGlobalError] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [form, setForm] = useState({
    productId: '', variantId: '', quantity: 1,
    name: '', email: '', phone: '',
    paymentMethod: 'transferencia',
    address: '', province: '', city: '', postalCode: '', notes: '',
    discountCode: '',
  })

  const selectedProduct = products.find(p => p.id === form.productId)
  const activeVariants = selectedProduct?.variants.filter(v => v.active) ?? []

  function set(key: string, value: string | number) {
    setForm(prev => ({ ...prev, [key]: value }))
    setErrors(prev => ({ ...prev, [key]: '' }))
    setGlobalError('')
  }

  function validate() {
    const e: Record<string, string> = {}
    if (!form.variantId) e.variantId = 'Seleccioná un modelo y variante'
    if (form.quantity < 1) e.quantity = 'Mínimo 1'
    if (!form.name.trim()) e.name = 'Requerido'
    if (!form.email.trim()) e.email = 'Requerido'
    if (!form.phone.trim()) e.phone = 'Requerido'
    return e
  }

  async function handleSubmit() {
    const e = validate()
    if (Object.keys(e).length) { setErrors(e); return }
    setSubmitting(true)
    setGlobalError('')
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer: { name: form.name, email: form.email, phone: form.phone },
          items: [{ variant_id: form.variantId, quantity: form.quantity }],
          payment_method: form.paymentMethod,
          discount_code: form.discountCode || undefined,
          shipping_address: form.address || undefined,
          province: form.province || undefined,
          city: form.city || undefined,
          postal_code: form.postalCode || undefined,
          notes: form.notes || undefined,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Error al crear el pedido')
      onCreated()
      onClose()
      setForm({ productId: '', variantId: '', quantity: 1, name: '', email: '', phone: '', paymentMethod: 'transferencia', address: '', province: '', city: '', postalCode: '', notes: '', discountCode: '' })
      setErrors({})
    } catch (err: any) {
      setGlobalError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={o => !o && onClose()}>
      <DialogContent className="max-w-lg p-0">
        <div className="px-6 pt-6 pb-4 border-b">
          <DialogHeader>
            <DialogTitle>Nuevo pedido manual</DialogTitle>
            <DialogDescription>Ingresá los datos del pedido recibido por otro canal (WhatsApp, teléfono, etc.)</DialogDescription>
          </DialogHeader>
        </div>

        <ScrollArea className="max-h-[68vh]">
          <div className="space-y-6 px-6 py-6">

            {/* Producto */}
            <Sec title="Producto">
              <FLabel label="Modelo" error={errors.variantId} required>
                <Select value={form.productId} onValueChange={v => { set('productId', v); set('variantId', '') }}>
                  <SelectTrigger>
                    <SelectValue placeholder={productsLoading ? 'Cargando...' : 'Seleccioná un modelo'} />
                  </SelectTrigger>
                  <SelectContent>
                    {products.filter(p => !p.deleted_at).map(p => (
                      <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {form.productId && (
                  <Select value={form.variantId} onValueChange={v => set('variantId', v)}>
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Seleccioná talle y color" />
                    </SelectTrigger>
                    <SelectContent>
                      {activeVariants.length === 0
                        ? <SelectItem value="__none" disabled>Sin variantes activas</SelectItem>
                        : activeVariants.map(v => (
                          <SelectItem key={v.id} value={v.id}>
                            {v.size} · {v.color} — {formatPrice(v.sale_price ?? v.price)}
                          </SelectItem>
                        ))
                      }
                    </SelectContent>
                  </Select>
                )}
              </FLabel>
              <FLabel label="Cantidad" error={errors.quantity} required>
                <div className="flex items-center gap-3">
                  <Button type="button" variant="outline" size="sm" className="h-8 w-8 p-0"
                    onClick={() => set('quantity', Math.max(1, form.quantity - 1))}>−</Button>
                  <span className="w-8 text-center font-semibold text-sm">{form.quantity}</span>
                  <Button type="button" variant="outline" size="sm" className="h-8 w-8 p-0"
                    onClick={() => set('quantity', form.quantity + 1)}>+</Button>
                </div>
              </FLabel>
            </Sec>

            {/* Cliente */}
            <Sec title="Cliente">
              <FLabel label="Nombre completo" error={errors.name} required>
                <Input value={form.name} onChange={e => set('name', e.target.value)} placeholder="Juan García" />
              </FLabel>
              <FLabel label="Email" error={errors.email} required>
                <Input type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="juan@email.com" />
              </FLabel>
              <FLabel label="Teléfono / WhatsApp" error={errors.phone} required>
                <Input value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="+54 9 351 000 0000" />
              </FLabel>
            </Sec>

            {/* Envío */}
            <Sec title="Envío (opcional)">
              <div className="grid grid-cols-2 gap-3">
                <FLabel label="Provincia">
                  <select
                    value={form.province}
                    onChange={e => set('province', e.target.value)}
                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
                  >
                    <option value="">Seleccioná</option>
                    {PROVINCES.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </FLabel>
                <FLabel label="Ciudad">
                  <Input value={form.city} onChange={e => set('city', e.target.value)} placeholder="Córdoba" />
                </FLabel>
              </div>
              <FLabel label="Dirección">
                <Input value={form.address} onChange={e => set('address', e.target.value)} placeholder="Av. Corrientes 1234, Piso 2" />
              </FLabel>
              <FLabel label="Código postal">
                <Input value={form.postalCode} onChange={e => set('postalCode', e.target.value)} placeholder="5000" />
              </FLabel>
              <FLabel label="Comentarios del envío">
                <textarea
                  value={form.notes}
                  onChange={e => set('notes', e.target.value)}
                  placeholder="Instrucciones especiales, horario, entre calles, etc."
                  rows={2}
                  className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring resize-none"
                />
              </FLabel>
            </Sec>

            {/* Pago */}
            <Sec title="Pago">
              <FLabel label="Método de pago" required>
                <Select value={form.paymentMethod} onValueChange={v => set('paymentMethod', v)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="transferencia">Transferencia (CBU/CVU)</SelectItem>
                    <SelectItem value="mercadopago">MercadoPago</SelectItem>
                    <SelectItem value="modo">MODO</SelectItem>
                    <SelectItem value="efectivo">Efectivo</SelectItem>
                  </SelectContent>
                </Select>
              </FLabel>
              <FLabel label="Código de descuento (opcional)">
                <Input value={form.discountCode} onChange={e => set('discountCode', e.target.value.toUpperCase())} placeholder="MERCANTIC2024" />
              </FLabel>
            </Sec>

            {globalError && (
              <p className="text-sm text-destructive bg-destructive/10 rounded-md px-3 py-2">{globalError}</p>
            )}
          </div>
        </ScrollArea>

        <div className="px-6 py-4 flex gap-3 border-t">
          <Button variant="outline" onClick={onClose} className="flex-1" disabled={submitting}>Cancelar</Button>
          <Button onClick={handleSubmit} disabled={submitting} className="flex-[2]">
            {submitting ? 'Guardando...' : 'Crear pedido'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// ── Orders Table ──────────────────────────────────────────────────────────────

interface OrdersTableProps {
  onNewOrdersCount?: (n: number) => void
}

export function OrdersTable({ onNewOrdersCount }: OrdersTableProps = {}) {
  const { orders, isLoading, lastUpdated, newOrdersCount, clearNewOrders, refresh, updateOrder } = useOrders()

  useEffect(() => {
    onNewOrdersCount?.(newOrdersCount)
  }, [newOrdersCount, onNewOrdersCount])
  const [search, setSearch] = useState('')
  const [deliveryFilter, setDeliveryFilter] = useState('all')
  const [page, setPage] = useState(1)
  const [selected, setSelected] = useState<OrderComplete | null>(null)
  const [copiedField, setCopiedField] = useState<string | null>(null)
  const [showManualOrder, setShowManualOrder] = useState(false)
  const PER_PAGE = 10

  // reset page on filter change
  useEffect(() => { setPage(1) }, [search, deliveryFilter])

  const filtered = orders.filter(o => {
    if (deliveryFilter !== 'all' && o.delivery_status !== deliveryFilter) return false
    if (search.trim()) {
      const q = search.toLowerCase()
      const matchesId = String(o.id).includes(q)
      const matchesName = o.customer?.name?.toLowerCase().includes(q)
      if (!matchesId && !matchesName) return false
    }
    return true
  })

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE))
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE)

  const totalRevenue = orders.reduce((s, o) => s + o.final_amount, 0)
  const pendingDelivery = orders.filter(o => o.delivery_status === 'pending').length

  const copy = async (text: string, key: string) => {
    await navigator.clipboard.writeText(text)
    setCopiedField(key)
    setTimeout(() => setCopiedField(null), 2000)
  }

  const getTimeAgo = (date: Date) => {
    const s = Math.floor((Date.now() - date.getTime()) / 1000)
    if (s < 60) return 'hace un momento'
    const m = Math.floor(s / 60)
    if (m < 60) return `hace ${m} min`
    return `hace ${Math.floor(m / 60)}h`
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20 text-muted-foreground">
        Cargando pedidos…
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* New orders notification */}
      {newOrdersCount > 0 && (
        <div className="flex items-center justify-between gap-3 px-4 py-3 bg-amber-50 border border-amber-300 rounded-lg">
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-3 w-3 flex-shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500" />
            </span>
            <Bell className="w-4 h-4 text-amber-700" />
            <span className="text-amber-900 text-sm font-semibold">
              {newOrdersCount} pedido{newOrdersCount > 1 ? 's' : ''} nuevo{newOrdersCount > 1 ? 's' : ''}
            </span>
          </div>
          <Button size="sm" variant="outline" onClick={clearNewOrders} className="h-7 text-xs border-amber-300 text-amber-800 hover:bg-amber-100">
            Marcar como visto
          </Button>
        </div>
      )}

      {/* Stats */}
      <div className="grid gap-3 grid-cols-2 sm:grid-cols-3">
        {[
          { label: 'Total Pedidos',   value: orders.length,             sub: 'registrados',    icon: ShoppingBag, tip: 'Cantidad total de pedidos en el sistema' },
          { label: 'Ingresos Totales', value: formatPrice(totalRevenue), sub: 'total acumulado', icon: TrendingUp,  tip: 'Suma del monto final de todos los pedidos' },
          { label: 'Por Despachar',   value: pendingDelivery,            sub: 'envíos pendientes', icon: Clock,    tip: 'Pedidos que aún no fueron enviados' },
        ].map(({ label, value, sub, icon: Icon, tip }) => (
          <InfoTooltip key={label}>
            <TooltipTrigger asChild>
              <Card className="transition-all hover:border-primary/50 cursor-default">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{label}</CardTitle>
                  <Icon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{value}</div>
                  <p className="text-xs text-muted-foreground">{sub}</p>
                </CardContent>
              </Card>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="max-w-xs"><p>{tip}</p></TooltipContent>
          </InfoTooltip>
        ))}
      </div>

      {/* Table */}
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <CardTitle>Pedidos</CardTitle>
                <CardDescription>
                  {filtered.length} resultado{filtered.length !== 1 ? 's' : ''}
                  {lastUpdated && <span className="ml-2 text-muted-foreground/60">· {getTimeAgo(lastUpdated)}</span>}
                </CardDescription>
              </div>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
                <div className="relative flex-1 sm:flex-none">
                  <Input
                    placeholder="Buscar por ID o nombre…"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="w-full sm:w-52 pr-8"
                  />
                  <Search className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                </div>
                <Button size="sm" onClick={() => setShowManualOrder(true)} className="gap-1.5 whitespace-nowrap w-full sm:w-auto justify-center">
                  <Plus className="w-4 h-4" /> Nuevo pedido
                </Button>
              </div>
            </div>
            <div className="flex gap-3 flex-wrap">
              <div className="flex flex-col gap-1">
                <label className="text-xs text-muted-foreground pl-1">Estado de envío</label>
                <Select value={deliveryFilter} onValueChange={setDeliveryFilter}>
                  <SelectTrigger className="w-[160px]"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="pending">Pendiente</SelectItem>
                    <SelectItem value="shipped">Enviado</SelectItem>
                    <SelectItem value="delivered">Entregado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0 sm:p-6">
          {/* ── Mobile cards ── */}
          <div className="sm:hidden divide-y border-t">
            {paginated.length === 0 ? (
              <div className="py-12 text-center text-muted-foreground text-sm">
                {search ? 'No se encontraron pedidos con esa búsqueda' : 'No hay pedidos que mostrar'}
              </div>
            ) : paginated.map(order => (
              <div key={order.id} className="p-4 space-y-3 bg-background active:bg-muted/30 transition-colors">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-xs text-muted-foreground">#{order.id}</span>
                      <span className="text-xs text-muted-foreground">{formatDate(order.created_at)}</span>
                    </div>
                    <div className="font-semibold text-sm">{order.customer?.name ?? '—'}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">{order.customer?.phone ?? order.customer?.email ?? ''}</div>
                    {order.variant && (
                      <div className="text-xs text-muted-foreground mt-1">
                        {order.variant.product?.name} · {order.variant.size} {order.variant.color}
                      </div>
                    )}
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="font-bold text-base">{formatPrice(order.final_amount)}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Select
                    value={order.delivery_status}
                    onValueChange={v => updateOrder(order.id, { delivery_status: v as any })}
                  >
                    <SelectTrigger className={`flex-1 h-10 font-medium text-xs ${DELIVERY_CONFIG[order.delivery_status]?.trigger ?? ''}`}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(DELIVERY_CONFIG).map(([val, cfg]) => (
                        <SelectItem key={val} value={val}>
                          <span className="flex items-center gap-2">
                            <span className={`w-2 h-2 rounded-full flex-shrink-0 ${cfg.dot}`} />
                            {cfg.label}
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button variant="outline" className="h-10 px-5 shrink-0 text-sm" onClick={() => setSelected(order)}>
                    Ver
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* ── Desktop table ── */}
          <div className="hidden sm:block rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">ID</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Producto</TableHead>
                  <TableHead>Monto</TableHead>
                  <TableHead>Envío</TableHead>
                  <TableHead className="w-[80px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginated.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                      {search ? 'No se encontraron pedidos con esa búsqueda' : 'No hay pedidos que mostrar'}
                    </TableCell>
                  </TableRow>
                ) : paginated.map(order => (
                  <TableRow key={order.id}>
                    <TableCell className="font-mono text-xs">#{order.id}</TableCell>
                    <TableCell className="text-sm whitespace-nowrap">{formatDate(order.created_at)}</TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div className="font-medium">{order.customer?.name ?? '—'}</div>
                        <div className="text-muted-foreground text-xs">{order.customer?.phone ?? order.customer?.email ?? '—'}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {order.variant ? (
                        <div className="text-sm">
                          <div className="font-medium">{order.variant.product?.name ?? '—'}</div>
                          <div className="text-muted-foreground text-xs">{order.variant.size} · {order.variant.color}</div>
                        </div>
                      ) : '—'}
                    </TableCell>
                    <TableCell className="font-semibold whitespace-nowrap">{formatPrice(order.final_amount)}</TableCell>
                    <TableCell>
                      <Select
                        value={order.delivery_status}
                        onValueChange={v => updateOrder(order.id, { delivery_status: v as any })}
                      >
                        <SelectTrigger className={`w-[130px] font-medium text-xs ${DELIVERY_CONFIG[order.delivery_status]?.trigger ?? ''}`}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(DELIVERY_CONFIG).map(([val, cfg]) => (
                            <SelectItem key={val} value={val}>
                              <span className="flex items-center gap-2">
                                <span className={`w-2 h-2 rounded-full flex-shrink-0 ${cfg.dot}`} />
                                {cfg.label}
                              </span>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm" className="text-xs px-2" onClick={() => setSelected(order)}>
                        Ver
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filtered.length > PER_PAGE && (
            <div className="flex items-center justify-between pt-4 px-4 sm:px-0 pb-4 sm:pb-0">
              <p className="text-sm text-muted-foreground">
                {(page - 1) * PER_PAGE + 1}–{Math.min(page * PER_PAGE, filtered.length)} de {filtered.length}
              </p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => setPage(p => p - 1)} disabled={page === 1}>Anterior</Button>
                <span className="text-sm font-medium px-3 self-center">Pág. {page}/{totalPages}</span>
                <Button variant="outline" size="sm" onClick={() => setPage(p => p + 1)} disabled={page === totalPages}>Siguiente</Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Manual order dialog */}
      <ManualOrderDialog
        open={showManualOrder}
        onClose={() => setShowManualOrder(false)}
        onCreated={() => refresh(true)}
      />

      {/* Detail modal */}
      <Dialog open={!!selected} onOpenChange={open => !open && setSelected(null)}>
        <DialogContent className="max-w-2xl p-0">
          <div className="px-6 pt-6 pb-4 border-b">
            <DialogHeader>
              <DialogTitle>Pedido #{selected?.id}</DialogTitle>
              <DialogDescription>Información completa del pedido</DialogDescription>
            </DialogHeader>
          </div>
          {selected && (
            <ScrollArea className="max-h-[70vh]">
              <div className="space-y-6 px-6 py-6">
                {/* Order info */}
                <section className="space-y-3">
                  <h3 className="font-semibold text-sm flex items-center gap-2"><ShoppingBag className="w-4 h-4" />Pedido</h3>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div><p className="text-muted-foreground">ID</p><p className="font-mono">#{selected.id}</p></div>
                    <div><p className="text-muted-foreground">Creado</p><p>{formatDate(selected.created_at)}</p></div>
                    {selected.paid_at && <div><p className="text-muted-foreground">Pagado</p><p>{formatDate(selected.paid_at)}</p></div>}
                    {selected.shipped_at && <div><p className="text-muted-foreground">Enviado</p><p>{formatDate(selected.shipped_at)}</p></div>}
                    {selected.mp_payment_id && <div className="col-span-2"><p className="text-muted-foreground">MP Payment ID</p><p className="font-mono text-xs break-all">{selected.mp_payment_id}</p></div>}
                  </div>
                </section>

                {/* Product */}
                {selected.variant && (
                  <section className="space-y-3">
                    <h3 className="font-semibold text-sm flex items-center gap-2"><Package className="w-4 h-4" />Producto</h3>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div><p className="text-muted-foreground">Modelo</p><p className="font-medium">{selected.variant.product?.name}</p></div>
                      <div><p className="text-muted-foreground">Variante</p><p>{selected.variant.size} · {selected.variant.color}</p></div>
                      <div><p className="text-muted-foreground">Cantidad</p><p>{selected.quantity}</p></div>
                      <div><p className="text-muted-foreground">Precio unitario</p><p>{formatPrice(selected.unit_price)}</p></div>
                    </div>
                  </section>
                )}

                {/* Amounts */}
                <section className="space-y-3">
                  <h3 className="font-semibold text-sm">Montos</h3>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div><p className="text-muted-foreground">Precio base</p><p>{formatPrice(selected.unit_price * selected.quantity)}</p></div>
                    {selected.discount_amount > 0 && (
                      <>
                        <div><p className="text-muted-foreground">Descuento</p><p className="text-green-600">-{formatPrice(selected.discount_amount)}</p></div>
                        {selected.discount_code && <div><p className="text-muted-foreground">Código</p><p className="font-mono font-semibold text-primary">{selected.discount_code.code}</p></div>}
                      </>
                    )}
                    <div><p className="text-muted-foreground">Total final</p><p className="text-lg font-bold">{formatPrice(selected.final_amount)}</p></div>
                    <div><p className="text-muted-foreground">Método de pago</p><p className="capitalize">{selected.payment_method ?? '—'}</p></div>
                  </div>
                </section>

                {/* Customer */}
                {selected.customer && (
                  <section className="space-y-3">
                    <h3 className="font-semibold text-sm flex items-center gap-2"><User className="w-4 h-4" />Cliente</h3>
                    <div className="space-y-2 text-sm">
                      {[
                        { icon: User,  label: 'Nombre',   value: selected.customer.name,  key: `name-${selected.id}` },
                        { icon: Mail,  label: 'Email',    value: selected.customer.email,  key: `email-${selected.id}` },
                        { icon: Phone, label: 'Teléfono', value: selected.customer.phone,  key: `phone-${selected.id}` },
                      ].map(({ icon: Icon, label, value, key }) => value && (
                        <div key={key} className="flex items-center gap-2">
                          <Icon className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                          <span className="text-muted-foreground w-20">{label}</span>
                          <span className="flex-1">{value}</span>
                          <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => copy(value, key)}>
                            {copiedField === key ? <Check className="w-3 h-3 text-green-600" /> : <Copy className="w-3 h-3" />}
                          </Button>
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {/* Address */}
                {(selected.shipping_address || selected.city || selected.province) && (
                  <section className="space-y-3">
                    <h3 className="font-semibold text-sm flex items-center gap-2"><MapPin className="w-4 h-4" />Dirección de envío</h3>
                    <div className="flex items-start gap-2 text-sm">
                      <div className="flex-1">
                        <p className="font-medium">{selected.shipping_address}</p>
                        <p className="text-muted-foreground text-xs mt-1">
                          {[selected.city, selected.province].filter(Boolean).join(', ')}
                          {selected.postal_code && ` — CP ${selected.postal_code}`}
                        </p>
                      </div>
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0 flex-shrink-0"
                        onClick={() => copy([selected.shipping_address, selected.city, selected.province, selected.postal_code && `CP ${selected.postal_code}`].filter(Boolean).join(', '), `addr-${selected.id}`)}>
                        {copiedField === `addr-${selected.id}` ? <Check className="w-3 h-3 text-green-600" /> : <Copy className="w-3 h-3" />}
                      </Button>
                    </div>
                  </section>
                )}

                {/* Notes */}
                {selected.notes && (
                  <section className="space-y-2">
                    <h3 className="font-semibold text-sm flex items-center gap-2"><FileText className="w-4 h-4" />Notas</h3>
                    <p className="text-sm bg-muted p-3 rounded-md">{selected.notes}</p>
                  </section>
                )}

                {/* Status update */}
                <section className="space-y-3 border-t pt-4">
                  <h3 className="font-semibold text-sm">Actualizar estado de envío</h3>
                  <div className="flex gap-3 flex-wrap">
                    <div className="flex flex-col gap-1">
                      <label className="text-xs text-muted-foreground">Envío</label>
                      <Select
                        value={selected.delivery_status}
                        onValueChange={async v => {
                          await updateOrder(selected.id, { delivery_status: v as any })
                          setSelected(prev => prev ? { ...prev, delivery_status: v as any } : null)
                        }}
                      >
                        <SelectTrigger className={`w-[140px] font-medium text-xs ${DELIVERY_CONFIG[selected.delivery_status]?.trigger ?? ''}`}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(DELIVERY_CONFIG).map(([val, cfg]) => (
                            <SelectItem key={val} value={val}>
                              <span className="flex items-center gap-2">
                                <span className={`w-2 h-2 rounded-full flex-shrink-0 ${cfg.dot}`} />
                                {cfg.label}
                              </span>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </section>
              </div>
            </ScrollArea>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
