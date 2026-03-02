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
  Search, Package, TrendingUp, Clock, CheckCircle, XCircle,
  User, Phone, Mail, MapPin, FileText, ShoppingBag, Copy, Check,
} from 'lucide-react'
import type { OrderComplete } from '@/backend/features/orders/models/order.model'
import { useOrders } from '@/frontend/hooks/useOrders'
import { formatPrice, formatDate } from '@/lib/utils/formatting'

function PaymentBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline'; icon: typeof CheckCircle }> = {
    paid:      { label: 'Pagado',      variant: 'default',     icon: CheckCircle },
    pending:   { label: 'Pendiente',   variant: 'secondary',   icon: Clock       },
    failed:    { label: 'Fallido',     variant: 'destructive', icon: XCircle     },
    refunded:  { label: 'Reembolsado', variant: 'outline',     icon: XCircle     },
  }
  const { label, variant, icon: Icon } = map[status] ?? map.pending
  return (
    <Badge variant={variant} className="gap-1">
      <Icon className="w-3 h-3" /> {label}
    </Badge>
  )
}

function DeliveryBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    pending:   'Pendiente',
    shipped:   'Enviado',
    delivered: 'Entregado',
  }
  return <Badge variant="outline">{map[status] ?? status}</Badge>
}

export function OrdersTable() {
  const { orders, isLoading, lastUpdated, updateOrder } = useOrders()
  const [search, setSearch] = useState('')
  const [paymentFilter, setPaymentFilter] = useState('all')
  const [deliveryFilter, setDeliveryFilter] = useState('all')
  const [page, setPage] = useState(1)
  const [selected, setSelected] = useState<OrderComplete | null>(null)
  const [copiedField, setCopiedField] = useState<string | null>(null)
  const PER_PAGE = 10

  // reset page on filter change
  useEffect(() => { setPage(1) }, [search, paymentFilter, deliveryFilter])

  const filtered = orders.filter(o => {
    if (paymentFilter !== 'all' && o.payment_status !== paymentFilter) return false
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

  const paidOrders = orders.filter(o => o.payment_status === 'paid')
  const totalRevenue = paidOrders.reduce((s, o) => s + o.final_amount, 0)
  const pendingDelivery = orders.filter(o => o.payment_status === 'paid' && o.delivery_status === 'pending').length

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
      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: 'Total Pedidos', value: orders.length, sub: 'registrados', icon: ShoppingBag, tip: 'Cantidad total de pedidos en el sistema' },
          { label: 'Pedidos Pagados', value: paidOrders.length, sub: `${orders.length > 0 ? Math.round(paidOrders.length / orders.length * 100) : 0}% del total`, icon: CheckCircle, tip: 'Pedidos con pago aprobado' },
          { label: 'Ingresos Totales', value: formatPrice(totalRevenue), sub: 'pagos aprobados', icon: TrendingUp, tip: 'Suma del monto final de pedidos pagados' },
          { label: 'Por Despachar', value: pendingDelivery, sub: 'envíos pendientes', icon: Clock, tip: 'Pedidos pagados sin enviar todavía' },
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
              <div className="relative">
                <Input
                  placeholder="Buscar por ID o nombre…"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="w-64 pr-8"
                />
                <Search className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              </div>
            </div>
            <div className="flex gap-3 flex-wrap">
              <div className="flex flex-col gap-1">
                <label className="text-xs text-muted-foreground pl-1">Estado de pago</label>
                <Select value={paymentFilter} onValueChange={setPaymentFilter}>
                  <SelectTrigger className="w-[160px]"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="paid">Pagado</SelectItem>
                    <SelectItem value="pending">Pendiente</SelectItem>
                    <SelectItem value="failed">Fallido</SelectItem>
                    <SelectItem value="refunded">Reembolsado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
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

        <CardContent>
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Producto</TableHead>
                  <TableHead>Monto</TableHead>
                  <TableHead>Pago</TableHead>
                  <TableHead>Envío</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginated.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
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
                    <TableCell className="font-semibold">{formatPrice(order.final_amount)}</TableCell>
                    <TableCell><PaymentBadge status={order.payment_status} /></TableCell>
                    <TableCell>
                      <Select
                        value={order.delivery_status}
                        onValueChange={v => updateOrder(order.id, { delivery_status: v as any })}
                        disabled={order.payment_status !== 'paid'}
                      >
                        <SelectTrigger className="w-[130px]"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pendiente</SelectItem>
                          <SelectItem value="shipped">Enviado</SelectItem>
                          <SelectItem value="delivered">Entregado</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm" onClick={() => setSelected(order)}>
                        Ver detalle
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filtered.length > PER_PAGE && (
            <div className="flex items-center justify-between pt-4">
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
                {selected.shipping_address && (
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
                  <h3 className="font-semibold text-sm">Actualizar estado</h3>
                  <div className="flex gap-3 flex-wrap">
                    <div className="flex flex-col gap-1">
                      <label className="text-xs text-muted-foreground">Pago</label>
                      <Select
                        value={selected.payment_status}
                        onValueChange={async v => {
                          await updateOrder(selected.id, { payment_status: v as any })
                          setSelected(prev => prev ? { ...prev, payment_status: v as any } : null)
                        }}
                      >
                        <SelectTrigger className="w-[140px]"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pendiente</SelectItem>
                          <SelectItem value="paid">Pagado</SelectItem>
                          <SelectItem value="failed">Fallido</SelectItem>
                          <SelectItem value="refunded">Reembolsado</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-xs text-muted-foreground">Envío</label>
                      <Select
                        value={selected.delivery_status}
                        onValueChange={async v => {
                          await updateOrder(selected.id, { delivery_status: v as any })
                          setSelected(prev => prev ? { ...prev, delivery_status: v as any } : null)
                        }}
                        disabled={selected.payment_status !== 'paid'}
                      >
                        <SelectTrigger className="w-[140px]"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pendiente</SelectItem>
                          <SelectItem value="shipped">Enviado</SelectItem>
                          <SelectItem value="delivered">Entregado</SelectItem>
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
