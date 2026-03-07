'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Tooltip as InfoTooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { Plus, Trash2, BarChart3, Tag, TrendingUp, CheckCircle, Percent } from 'lucide-react'
import { useDiscounts } from '@/frontend/hooks/useDiscounts'
import type { DiscountCode } from '@/backend/features/discounts/models/discount.model'
import { formatPrice, formatDate } from '@/lib/utils/formatting'

function CreateForm({ onClose, createDiscount }: { onClose: () => void; createDiscount: ReturnType<typeof useDiscounts>['createDiscount'] }) {
  const [code, setCode] = useState('')
  const [pct, setPct] = useState(10)
  const [maxUses, setMaxUses] = useState<number | ''>('')
  const [description, setDescription] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!code.trim()) { setError('El código es obligatorio'); return }
    if (pct < 1 || pct > 100) { setError('El descuento debe ser entre 1% y 100%'); return }
    setSaving(true)
    const res = await createDiscount({
      code: code.trim().toUpperCase(),
      discount_percentage: pct,
      max_uses: maxUses === '' ? null : Number(maxUses),
      description: description.trim() || null,
    })
    setSaving(false)
    if (res.ok) { onClose() } else {
      const data = await res.json().catch(() => ({}))
      setError(data.error ?? 'Error al crear el código')
    }
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="code">Código *</Label>
        <Input
          id="code"
          placeholder="FOGON20"
          value={code}
          onChange={e => setCode(e.target.value.toUpperCase())}
          className="font-mono"
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="pct">Descuento (%) *</Label>
        <Input
          id="pct"
          type="number"
          min={1}
          max={100}
          value={pct}
          onChange={e => setPct(Number(e.target.value))}
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="max">Usos máximos (vacío = ilimitado)</Label>
        <Input
          id="max"
          type="number"
          min={1}
          placeholder="Sin límite"
          value={maxUses}
          onChange={e => setMaxUses(e.target.value === '' ? '' : Number(e.target.value))}
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="desc">Descripción</Label>
        <Input
          id="desc"
          placeholder="Promoción de verano…"
          value={description}
          onChange={e => setDescription(e.target.value)}
        />
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
      <div className="flex gap-2 justify-end pt-2">
        <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
        <Button type="submit" disabled={saving}>{saving ? 'Creando…' : 'Crear código'}</Button>
      </div>
    </form>
  )
}

export function DiscountManager() {
  const { discounts, isLoading, updateDiscount, deleteDiscount, createDiscount } = useDiscounts()
  const [showCreate, setShowCreate] = useState(false)
  const [toDelete, setToDelete] = useState<DiscountCode | null>(null)
  const [deleting, setDeleting] = useState(false)

  const confirmDelete = async () => {
    if (!toDelete) return
    setDeleting(true)
    await deleteDiscount(toDelete.id)
    setDeleting(false)
    setToDelete(null)
  }

  const activeCount = discounts.filter(d => d.active).length
  const totalUses = discounts.reduce((s, d) => s + d.times_used, 0)
  const totalDiscount = discounts.reduce((s, d) => s + (d.total_discount_given ?? 0), 0)

  if (isLoading) {
    return <div className="flex items-center justify-center py-20 text-muted-foreground">Cargando descuentos…</div>
  }

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { label: 'Códigos Activos', value: `${activeCount} / ${discounts.length}`, icon: Tag, tip: 'Códigos habilitados para uso' },
          { label: 'Usos Totales', value: totalUses, icon: CheckCircle, tip: 'Cantidad total de veces que se usaron los códigos' },
          { label: 'Descuentos Dados', value: formatPrice(totalDiscount), icon: Percent, tip: 'Suma total de descuentos aplicados en pedidos' },
        ].map(({ label, value, icon: Icon, tip }) => (
          <InfoTooltip key={label}>
            <TooltipTrigger asChild>
              <Card className="transition-all hover:border-primary/50 cursor-default">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{label}</CardTitle>
                  <Icon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{value}</div>
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
          <div className="flex items-center justify-between gap-3">
            <div>
              <CardTitle>Códigos de Descuento</CardTitle>
              <CardDescription>{discounts.length} código{discounts.length !== 1 ? 's' : ''} registrados</CardDescription>
            </div>
            <Button className="gap-2" onClick={() => setShowCreate(true)}>
              <Plus className="w-4 h-4" /> Nuevo código
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Código</TableHead>
                  <TableHead>Descuento</TableHead>
                  <TableHead>Usos</TableHead>
                  <TableHead>Límite</TableHead>
                  <TableHead>Descuento dado</TableHead>
                  <TableHead>Descripción</TableHead>
                  <TableHead>Creado</TableHead>
                  <TableHead>Activo</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {discounts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center text-muted-foreground py-8">
                      No hay códigos de descuento
                    </TableCell>
                  </TableRow>
                ) : discounts.map(d => (
                  <TableRow key={d.id}>
                    <TableCell className="font-mono font-semibold">{d.code}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="font-mono">{d.discount_percentage}%</Badge>
                    </TableCell>
                    <TableCell>{d.times_used}</TableCell>
                    <TableCell>{d.max_uses ?? '∞'}</TableCell>
                    <TableCell>{d.total_discount_given != null ? formatPrice(d.total_discount_given) : '—'}</TableCell>
                    <TableCell className="text-muted-foreground text-sm max-w-[160px] truncate">{d.description ?? '—'}</TableCell>
                    <TableCell className="text-sm text-muted-foreground whitespace-nowrap">{formatDate(d.created_at)}</TableCell>
                    <TableCell>
                      <Switch
                        checked={d.active}
                        onCheckedChange={v => updateDiscount(d.id, { active: v })}
                      />
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:text-destructive h-8 w-8 p-0"
                        onClick={() => setToDelete(d)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Create modal */}
      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Crear código de descuento</DialogTitle>
            <DialogDescription>El código se activará automáticamente al crearlo</DialogDescription>
          </DialogHeader>
          <CreateForm onClose={() => setShowCreate(false)} createDiscount={createDiscount} />
        </DialogContent>
      </Dialog>

      {/* Delete confirmation */}
      <Dialog open={!!toDelete} onOpenChange={open => !open && setToDelete(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Eliminar código</DialogTitle>
            <DialogDescription>
              ¿Estás seguro que querés eliminar el código <strong className="font-mono">{toDelete?.code}</strong>?
              Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-2 justify-end pt-2">
            <Button variant="outline" onClick={() => setToDelete(null)}>Cancelar</Button>
            <Button variant="destructive" onClick={confirmDelete} disabled={deleting}>
              {deleting ? 'Eliminando…' : 'Eliminar'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
