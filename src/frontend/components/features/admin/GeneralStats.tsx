'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tooltip as InfoTooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { TrendingUp, Package, Clock, CheckCircle, ChevronLeft, ChevronRight } from 'lucide-react'
import {
  Chart as ChartJS,
  CategoryScale, LinearScale, BarElement, ArcElement,
  Title, Tooltip, Legend,
} from 'chart.js'
import { Bar, Doughnut } from 'react-chartjs-2'
import { useAnalytics } from '@/frontend/hooks/useAnalytics'
import type { ViewMode } from '@/backend/features/analytics/models/analytics.model'
import { formatPrice } from '@/lib/utils/formatting'

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend)

const VIEW_LABELS: Record<ViewMode, string> = {
  days: 'Días',
  weeks: 'Semanas',
  months: 'Meses',
  years: 'Años',
}

const CHART_COLORS = {
  primary: 'rgba(196, 98, 45, 0.8)',
  primaryBorder: '#c4622d',
  secondary: 'rgba(212, 165, 90, 0.8)',
  secondaryBorder: '#d4a55a',
}

export function GeneralStats() {
  const [viewMode, setViewMode] = useState<ViewMode>('days')
  const [offset, setOffset] = useState(0)
  const { stats, isLoading, refresh } = useAnalytics(viewMode, offset)

  const handleViewChange = (mode: ViewMode) => {
    setViewMode(mode)
    setOffset(0)
  }

  if (isLoading || !stats) {
    return <div className="flex items-center justify-center py-20 text-muted-foreground">Cargando estadísticas…</div>
  }

  const { summary, daily_sales, by_product, payment_status, delivery_status } = stats

  // Bar chart: sales over time
  const barData = {
    labels: daily_sales.map(d => d.date),
    datasets: [
      {
        label: 'Pedidos',
        data: daily_sales.map(d => d.count),
        backgroundColor: CHART_COLORS.primary,
        borderColor: CHART_COLORS.primaryBorder,
        borderWidth: 1,
        borderRadius: 4,
        yAxisID: 'y',
      },
      {
        label: 'Ingresos',
        data: daily_sales.map(d => d.revenue),
        backgroundColor: CHART_COLORS.secondary,
        borderColor: CHART_COLORS.secondaryBorder,
        borderWidth: 1,
        borderRadius: 4,
        yAxisID: 'y1',
      },
    ],
  }
  const barOptions = {
    responsive: true,
    interaction: { mode: 'index' as const, intersect: false },
    plugins: { legend: { position: 'top' as const } },
    scales: {
      y: { type: 'linear' as const, position: 'left' as const, title: { display: true, text: 'Pedidos' } },
      y1: {
        type: 'linear' as const, position: 'right' as const,
        grid: { drawOnChartArea: false },
        title: { display: true, text: 'Ingresos (ARS)' },
        ticks: { callback: (v: string | number) => `$${(Number(v) / 1000).toFixed(0)}k` },
      },
    },
  }

  // Doughnut: payment status
  const paymentDoughnut = {
    labels: ['Pagados', 'Pendientes', 'Fallidos', 'Reembolsados'],
    datasets: [{
      data: [payment_status.paid, payment_status.pending, payment_status.failed, payment_status.refunded],
      backgroundColor: ['#c4622d', '#d4a55a', '#ef4444', '#6b7280'],
      borderWidth: 0,
    }],
  }

  // Doughnut: delivery status
  const deliveryDoughnut = {
    labels: ['Pendientes', 'Enviados', 'Entregados'],
    datasets: [{
      data: [delivery_status.pending, delivery_status.shipped, delivery_status.delivered],
      backgroundColor: ['#e8783a', '#d4a55a', '#c4622d'],
      borderWidth: 0,
    }],
  }

  const doughnutOptions = {
    responsive: true,
    plugins: { legend: { position: 'bottom' as const } },
    cutout: '65%',
  }

  return (
    <div className="space-y-6">
      {/* Summary cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: 'Total Pedidos',  value: summary.total_orders,   sub: `${summary.paid_orders} pagados`, icon: Package,      tip: 'Total de pedidos registrados en el período' },
          { label: 'Ingresos',       value: formatPrice(summary.total_revenue), sub: 'pagos aprobados', icon: TrendingUp, tip: 'Suma de montos finales de pedidos pagados' },
          { label: 'Ticket Promedio',value: formatPrice(summary.average_order_value), sub: 'por pedido pagado', icon: CheckCircle, tip: 'Monto final promedio de pedidos pagados' },
          { label: 'Por Despachar',  value: summary.pending_delivery, sub: 'envíos pendientes', icon: Clock, tip: 'Pedidos pagados sin enviar' },
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

      {/* Bar chart with controls */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <CardTitle className="text-base">Pedidos e Ingresos</CardTitle>
            <div className="flex items-center gap-2">
              {/* View mode selector */}
              <div className="flex rounded-md border overflow-hidden">
                {(Object.keys(VIEW_LABELS) as ViewMode[]).map(mode => (
                  <button
                    key={mode}
                    onClick={() => handleViewChange(mode)}
                    className={`px-3 py-1.5 text-xs font-medium transition-colors ${
                      viewMode === mode
                        ? 'bg-primary text-primary-foreground'
                        : 'hover:bg-muted text-muted-foreground'
                    }`}
                  >
                    {VIEW_LABELS[mode]}
                  </button>
                ))}
              </div>
              {/* Pagination */}
              <div className="flex items-center gap-1">
                <Button variant="outline" size="sm" className="h-8 w-8 p-0" onClick={() => setOffset(o => o + 1)}>
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <span className="text-xs text-muted-foreground px-1">
                  {offset === 0 ? 'Actual' : `−${offset}`}
                </span>
                <Button variant="outline" size="sm" className="h-8 w-8 p-0" onClick={() => setOffset(o => Math.max(0, o - 1))} disabled={offset === 0}>
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-72">
            <Bar data={barData} options={{ ...barOptions, maintainAspectRatio: false }} />
          </div>
        </CardContent>
      </Card>

      {/* Doughnuts + by_product */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Payment status */}
        <Card>
          <CardHeader><CardTitle className="text-base">Estado de Pagos</CardTitle></CardHeader>
          <CardContent>
            <div className="h-52">
              <Doughnut data={paymentDoughnut} options={{ ...doughnutOptions, maintainAspectRatio: false }} />
            </div>
          </CardContent>
        </Card>

        {/* Delivery status */}
        <Card>
          <CardHeader><CardTitle className="text-base">Estado de Envíos</CardTitle></CardHeader>
          <CardContent>
            <div className="h-52">
              <Doughnut data={deliveryDoughnut} options={{ ...doughnutOptions, maintainAspectRatio: false }} />
            </div>
          </CardContent>
        </Card>

        {/* By product */}
        <Card>
          <CardHeader><CardTitle className="text-base">Por Modelo</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-3">
              {by_product.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-6">Sin datos</p>
              ) : by_product.map(p => (
                <div key={p.slug}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium">{p.product_name}</span>
                    <span className="text-muted-foreground">{p.total_orders} pedidos</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all"
                      style={{ width: `${by_product.length > 0 ? Math.round(p.total_orders / Math.max(...by_product.map(x => x.total_orders)) * 100) : 0}%` }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{formatPrice(p.revenue)}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
