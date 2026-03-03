'use client'

import { useState, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tooltip as InfoTooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { TrendingUp, Package, Clock, CheckCircle, ChevronLeft, ChevronRight, RefreshCw, DatabaseZap } from 'lucide-react'
import {
  Chart as ChartJS,
  CategoryScale, LinearScale, BarElement, LineElement, PointElement,
  ArcElement, Title, Tooltip, Legend, Filler,
} from 'chart.js'
import { Bar, Doughnut } from 'react-chartjs-2'
import { useAnalytics } from '@/frontend/hooks/useAnalytics'
import type { ViewMode } from '@/backend/features/analytics/models/analytics.model'
import { formatPrice } from '@/lib/utils/formatting'

ChartJS.register(
  CategoryScale, LinearScale, BarElement, LineElement, PointElement,
  ArcElement, Title, Tooltip, Legend, Filler,
)

// ─── Constants ────────────────────────────────────────────────────────────────

const VIEW_LABELS: Record<ViewMode, string> = {
  days: 'Días',
  weeks: 'Semanas',
  months: 'Meses',
  years: 'Años',
}

const BRAND = {
  orange: '#c4622d',
  fire:   '#e8783a',
  gold:   '#d4a55a',
  muted:  '#7a5c44',
  danger: '#ef4444',
  gray:   '#6b7280',
}

// ─── KPI Card ─────────────────────────────────────────────────────────────────

function KpiCard({
  label, value, sub, icon: Icon, tip, highlight,
}: {
  label: string
  value: string | number
  sub: string
  icon: React.ElementType
  tip: string
  highlight?: boolean
}) {
  return (
    <InfoTooltip>
      <TooltipTrigger asChild>
        <Card className={`transition-all cursor-default hover:shadow-md ${highlight ? 'border-primary/40 bg-primary/5' : 'hover:border-primary/30'}`}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{label}</CardTitle>
            <Icon className={`h-4 w-4 ${highlight ? 'text-primary' : 'text-muted-foreground'}`} />
          </CardHeader>
          <CardContent className="pt-0">
            <div className={`text-2xl font-bold ${highlight ? 'text-primary' : ''}`}>{value}</div>
            <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>
          </CardContent>
        </Card>
      </TooltipTrigger>
      <TooltipContent side="bottom" className="max-w-xs"><p>{tip}</p></TooltipContent>
    </InfoTooltip>
  )
}

// ─── Main export ──────────────────────────────────────────────────────────────

export function GeneralStats() {
  const [viewMode, setViewMode] = useState<ViewMode>('days')
  const [offset, setOffset] = useState(0)
  const [seeding, setSeeding] = useState(false)
  const [seedMsg, setSeedMsg] = useState('')
  const { stats, isLoading, isRefreshing, refresh } = useAnalytics(viewMode, offset)

  const handleViewChange = (mode: ViewMode) => {
    setViewMode(mode)
    setOffset(0)
  }

  const handleSeed = async () => {
    setSeeding(true)
    setSeedMsg('')
    try {
      const res = await fetch('/api/admin/seed', { method: 'POST' })
      const data = await res.json()
      if (res.ok) {
        setSeedMsg(`✓ ${data.count} pedidos de prueba creados`)
        refresh()
      } else {
        setSeedMsg(`Error: ${data.error}`)
      }
    } catch {
      setSeedMsg('Error de conexión')
    } finally {
      setSeeding(false)
    }
  }

  // Show skeleton only on first load, not on subsequent refreshes
  if (isLoading && !stats) {
    return (
      <div className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[0, 1, 2, 3].map(i => <div key={i} className="h-28 rounded-lg bg-muted/40 animate-pulse" />)}
        </div>
        <div className="h-72 rounded-lg bg-muted/40 animate-pulse" />
        <div className="grid gap-4 lg:grid-cols-3">
          {[0, 1, 2].map(i => <div key={i} className="h-52 rounded-lg bg-muted/40 animate-pulse" />)}
        </div>
      </div>
    )
  }

  const { summary, daily_sales, by_product, payment_status, delivery_status, by_province } = stats!

  // ── Bar chart ──────────────────────────────────────────────────────────────
  const barData = {
    labels: daily_sales.map(d => d.date),
    datasets: [
      {
        label: 'Pedidos',
        data: daily_sales.map(d => d.count),
        backgroundColor: BRAND.orange + 'cc',
        borderColor: BRAND.orange,
        borderWidth: 2,
        borderRadius: 6,
        borderSkipped: false,
        yAxisID: 'y',
      },
      {
        label: 'Ingresos',
        data: daily_sales.map(d => d.revenue),
        backgroundColor: BRAND.gold + '99',
        borderColor: BRAND.gold,
        borderWidth: 2,
        borderRadius: 6,
        borderSkipped: false,
        yAxisID: 'y1',
      },
    ],
  }

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: 'index' as const, intersect: false },
    plugins: {
      legend: {
        position: 'top' as const,
        labels: { usePointStyle: true, pointStyle: 'circle', padding: 16, font: { size: 12 } },
      },
      tooltip: {
        callbacks: {
          label: (ctx: any) => {
            if (ctx.dataset.yAxisID === 'y1') return ` Ingresos: ${formatPrice(ctx.raw)}`
            return ` Pedidos: ${ctx.raw}`
          },
        },
      },
    },
    scales: {
      x: { grid: { display: false }, ticks: { font: { size: 11 }, maxRotation: 45 } },
      y: {
        type: 'linear' as const, position: 'left' as const, beginAtZero: true,
        grid: { color: 'rgba(128,128,128,0.1)' },
        ticks: { precision: 0, font: { size: 11 } },
      },
      y1: {
        type: 'linear' as const, position: 'right' as const, beginAtZero: true,
        grid: { drawOnChartArea: false },
        ticks: {
          font: { size: 11 },
          callback: (v: string | number) => {
            const n = Number(v)
            if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`
            if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}k`
            return `$${n}`
          },
        },
      },
    },
  }

  // ── Province bar chart ─────────────────────────────────────────────────────
  const provinceBarData = {
    labels: by_province.map(p => p.province),
    datasets: [{
      label: 'Pedidos',
      data: by_province.map(p => p.total_orders),
      backgroundColor: by_province.map((_, i) =>
        [BRAND.orange, BRAND.gold, BRAND.fire, BRAND.muted, BRAND.gray][i % 5] + 'cc'
      ),
      borderWidth: 0,
      borderRadius: 5,
    }],
  }

  const provinceBarOptions = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: 'y' as const,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx: any) => ` ${ctx.raw} pedido${ctx.raw !== 1 ? 's' : ''}`,
        },
      },
    },
    scales: {
      x: { beginAtZero: true, ticks: { precision: 0, font: { size: 11 } }, grid: { color: 'rgba(128,128,128,0.1)' } },
      y: { ticks: { font: { size: 11 } }, grid: { display: false } },
    },
  }

  // ── Doughnuts ──────────────────────────────────────────────────────────────
  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: { usePointStyle: true, pointStyle: 'circle', padding: 12, font: { size: 11 } },
      },
    },
    cutout: '68%',
  }

  const paymentData = {
    labels: ['Pagados', 'Pendientes', 'Fallidos', 'Reembolsados'],
    datasets: [{
      data: [payment_status.paid, payment_status.pending, payment_status.failed, payment_status.refunded],
      backgroundColor: [BRAND.orange, BRAND.gold, BRAND.danger, BRAND.gray],
      borderWidth: 0,
      hoverOffset: 6,
    }],
  }

  const deliveryData = {
    labels: ['Pendientes', 'Enviados', 'Entregados'],
    datasets: [{
      data: [delivery_status.pending, delivery_status.shipped, delivery_status.delivered],
      backgroundColor: [BRAND.gold, BRAND.fire, BRAND.orange],
      borderWidth: 0,
      hoverOffset: 6,
    }],
  }

  const maxOrders = Math.max(...by_product.map(p => p.total_orders), 1)

  return (
    <div className="space-y-6">
      {/* KPI cards */}
      <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
        <KpiCard label="Total Pedidos" value={summary.total_orders} sub={`${summary.paid_orders} pagados`} icon={Package} tip="Total de pedidos registrados" />
        <KpiCard label="Ingresos" value={formatPrice(summary.total_revenue)} sub="pagos aprobados" icon={TrendingUp} tip="Suma de montos finales de pedidos pagados" highlight />
        <KpiCard label="Ticket Promedio" value={formatPrice(summary.average_order_value)} sub="por pedido pagado" icon={CheckCircle} tip="Monto final promedio de pedidos pagados" />
        <KpiCard label="Por Despachar" value={summary.pending_delivery} sub="envíos pendientes" icon={Clock} tip="Pedidos pagados que aún no fueron enviados" />
      </div>

      {/* Bar chart */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <CardTitle className="text-base">Pedidos e Ingresos</CardTitle>
            <div className="flex items-center gap-2 flex-wrap">
              {/* View mode — no page reload, just state update */}
              <div className="flex rounded-md border overflow-hidden text-xs">
                {(Object.keys(VIEW_LABELS) as ViewMode[]).map(mode => (
                  <button
                    key={mode}
                    onClick={() => handleViewChange(mode)}
                    className={`px-3 py-1.5 font-medium transition-colors ${
                      viewMode === mode
                        ? 'bg-primary text-primary-foreground'
                        : 'hover:bg-muted text-muted-foreground'
                    }`}
                  >
                    {VIEW_LABELS[mode]}
                  </button>
                ))}
              </div>
              {/* Offset navigation */}
              <div className="flex items-center gap-1">
                <Button variant="outline" size="sm" className="h-7 w-7 p-0" onClick={() => setOffset(o => o + 1)}>
                  <ChevronLeft className="w-3.5 h-3.5" />
                </Button>
                <span className="text-xs text-muted-foreground w-14 text-center">
                  {offset === 0 ? 'Actual' : `−${offset} ${VIEW_LABELS[viewMode].toLowerCase()}`}
                </span>
                <Button variant="outline" size="sm" className="h-7 w-7 p-0" onClick={() => setOffset(o => Math.max(0, o - 1))} disabled={offset === 0}>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Button>
              </div>
              <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => refresh()} title="Actualizar">
                <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Overlay while refreshing so chart doesn't unmount */}
          <div className="relative">
            {isRefreshing && (
              <div className="absolute inset-0 bg-background/50 z-10 flex items-center justify-center rounded-lg">
                <RefreshCw className="w-5 h-5 animate-spin text-muted-foreground" />
              </div>
            )}
            {daily_sales.length === 0 ? (
              <div className="h-64 flex items-center justify-center text-muted-foreground text-sm">
                Sin datos en este período
              </div>
            ) : (
              <div className="h-64 sm:h-72">
                <Bar data={barData} options={barOptions} />
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Doughnuts + by_product */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Payment status */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Estado de Pagos</CardTitle>
          </CardHeader>
          <CardContent>
            {payment_status.paid + payment_status.pending + payment_status.failed + payment_status.refunded === 0 ? (
              <div className="h-44 flex items-center justify-center text-sm text-muted-foreground">Sin datos</div>
            ) : (
              <div className="h-44"><Doughnut data={paymentData} options={doughnutOptions} /></div>
            )}
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-3 text-xs">
              {[
                { label: 'Pagados', value: payment_status.paid, color: BRAND.orange },
                { label: 'Pendientes', value: payment_status.pending, color: BRAND.gold },
                { label: 'Fallidos', value: payment_status.failed, color: BRAND.danger },
                { label: 'Reembolsados', value: payment_status.refunded, color: BRAND.gray },
              ].map(({ label, value, color }) => (
                <div key={label} className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-muted-foreground">
                    <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: color }} />{label}
                  </span>
                  <span className="font-medium tabular-nums">{value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Delivery status */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Estado de Envíos</CardTitle>
          </CardHeader>
          <CardContent>
            {delivery_status.pending + delivery_status.shipped + delivery_status.delivered === 0 ? (
              <div className="h-44 flex items-center justify-center text-sm text-muted-foreground">Sin datos</div>
            ) : (
              <div className="h-44"><Doughnut data={deliveryData} options={doughnutOptions} /></div>
            )}
            <div className="space-y-1 mt-3 text-xs">
              {[
                { label: 'Pendientes', value: delivery_status.pending, color: BRAND.gold },
                { label: 'Enviados', value: delivery_status.shipped, color: BRAND.fire },
                { label: 'Entregados', value: delivery_status.delivered, color: BRAND.orange },
              ].map(({ label, value, color }) => (
                <div key={label} className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-muted-foreground">
                    <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: color }} />{label}
                  </span>
                  <span className="font-medium tabular-nums">{value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* By product */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Por Modelo</CardTitle>
          </CardHeader>
          <CardContent>
            {by_product.length === 0 ? (
              <div className="h-44 flex items-center justify-center text-sm text-muted-foreground">Sin datos</div>
            ) : (
              <div className="space-y-4 pt-2">
                {by_product.map((p, idx) => {
                  const pct = Math.round(p.total_orders / maxOrders * 100)
                  const color = [BRAND.orange, BRAND.gold, BRAND.fire][idx % 3]
                  return (
                    <div key={p.slug}>
                      <div className="flex justify-between items-baseline mb-1.5">
                        <span className="text-sm font-semibold">{p.product_name}</span>
                        <span className="text-xs text-muted-foreground">{p.total_orders} pedido{p.total_orders !== 1 ? 's' : ''}</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, background: color }} />
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">{formatPrice(p.revenue)}</p>
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Province chart */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Pedidos por Provincia</CardTitle>
        </CardHeader>
        <CardContent>
          {by_province.length === 0 ? (
            <div className="h-40 flex items-center justify-center text-sm text-muted-foreground">Sin datos de provincia</div>
          ) : (
            <div style={{ height: `${Math.max(160, by_province.length * 36)}px` }}>
              <Bar data={provinceBarData} options={provinceBarOptions} />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Seed test data */}
      <Card className="border-dashed">
        <CardContent className="flex flex-col sm:flex-row items-start sm:items-center gap-3 py-4">
          <div className="flex-1">
            <p className="text-sm font-medium">Datos de prueba</p>
            <p className="text-xs text-muted-foreground">Genera 40 pedidos ficticios para ver los gráficos con datos reales.</p>
            {seedMsg && <p className={`text-xs mt-1 ${seedMsg.startsWith('✓') ? 'text-green-600' : 'text-destructive'}`}>{seedMsg}</p>}
          </div>
          <Button
            variant="outline"
            size="sm"
            className="gap-2 shrink-0"
            onClick={handleSeed}
            disabled={seeding}
          >
            <DatabaseZap className="w-4 h-4" />
            {seeding ? 'Generando…' : 'Cargar datos de prueba'}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
