'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Flame, Check, ChevronRight, ShoppingBag, User, CreditCard, CheckCircle, Minus, Plus, Trash2, Tag, AlertCircle } from 'lucide-react'
import { useCart } from '@/frontend/context/CartContext'

const COLOR_LABELS: Record<string, string> = { negro: 'Negro', oxido: 'Óxido' }

type Step = 1 | 2 | 3 | 4
type PaymentMethod = 'transferencia' | 'mercadopago' | 'modo'

const INSTALLMENTS = [
  { value: 1, label: '1 cuota', note: 'Sin interés' },
  { value: 3, label: '3 cuotas', note: 'Sin interés si tu banco aplica' },
  { value: 6, label: '6 cuotas', note: 'Financiación bancaria' },
  { value: 12, label: '12 cuotas', note: 'Financiación bancaria' },
]

function stepLabel(s: Step) {
  return [null, 'Carrito', 'Tus Datos', 'Pago', 'Confirmación'][s]
}

function ProgressBar({ step }: { step: Step }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 0, marginBottom: '2.5rem' }}>
      {([1, 2, 3, 4] as Step[]).map((s, i) => (
        <div key={s} style={{ display: 'flex', alignItems: 'center', flex: s < 4 ? 1 : undefined }}>
          <div className="ck-progress-circle" style={{
            width: '32px', height: '32px', borderRadius: '50%', flexShrink: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: s < step ? '#c4622d' : s === step ? 'linear-gradient(135deg, #c4622d, #e8783a)' : 'rgba(45, 26, 14, 0.6)',
            border: s <= step ? '2px solid #c4622d' : '2px solid rgba(92, 53, 32, 0.4)',
            color: s <= step ? '#f5e6d3' : '#5c3520',
            fontSize: '0.8rem', fontWeight: 700,
            boxShadow: s === step ? '0 0 16px rgba(196, 98, 45, 0.4)' : 'none',
            transition: 'all 0.3s',
          }}>
            {s < step ? <Check size={14} /> : s}
          </div>
          {s < 4 && (
            <div style={{
              flex: 1, height: '2px',
              background: s < step ? 'linear-gradient(90deg, #c4622d, #e8783a)' : 'rgba(92, 53, 32, 0.3)',
              transition: 'background 0.3s',
            }} />
          )}
        </div>
      ))}
    </div>
  )
}

// ── Step 1: Cart Review ──────────────────────────────────────────────────────
interface AppliedDiscount { code: string; percentage: number; codeId: string }

function StepCart({ onNext, appliedDiscount, onDiscountApply }: {
  onNext: () => void
  appliedDiscount: AppliedDiscount | null
  onDiscountApply: (d: AppliedDiscount | null) => void
}) {
  const { items, subtotal, removeItem, updateQuantity } = useCart()
  const [discountCode, setDiscountCode] = useState(appliedDiscount?.code ?? '')
  const [discountError, setDiscountError] = useState('')
  const [applyingCode, setApplyingCode] = useState(false)

  const finalTotal = appliedDiscount ? Math.round(subtotal * (1 - appliedDiscount.percentage / 100)) : subtotal

  async function handleApplyCode() {
    if (!discountCode.trim()) return
    setApplyingCode(true)
    setDiscountError('')
    try {
      const res = await fetch('/api/discounts/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: discountCode.trim() }),
      })
      const data = await res.json()
      if (!res.ok || !data.valid) {
        setDiscountError(data.error ?? 'Código no válido o expirado')
        onDiscountApply(null)
      } else {
        onDiscountApply({ code: discountCode.trim(), percentage: data.discount_percentage, codeId: data.discount_code_id })
      }
    } catch {
      setDiscountError('Error al validar el código')
    } finally {
      setApplyingCode(false)
    }
  }

  if (items.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem 0' }}>
        <ShoppingBag size={48} style={{ color: '#3d2415', margin: '0 auto 1rem' }} />
        <p style={{ color: '#7a5c44', marginBottom: '1.5rem' }}>Tu carrito está vacío.</p>
        <Link href="/productos" style={{ color: '#e8783a', textDecoration: 'none', fontWeight: 600 }}>
          Ver modelos →
        </Link>
      </div>
    )
  }

  return (
    <div>
      <h2 style={{ color: '#f5e6d3', fontFamily: 'var(--font-playfair), Georgia, serif', fontSize: '1.5rem', fontWeight: 800, marginBottom: '1.5rem' }}>
        Tu Pedido
      </h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
        {items.map(item => {
          const displayPrice = item.salePrice ?? item.price
          return (
            <div key={item.variantId} style={{
              background: 'rgba(45, 26, 14, 0.5)',
              border: '1px solid rgba(92, 53, 32, 0.35)',
              borderRadius: '10px', padding: '1rem',
              display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap',
            }}>
              <div style={{
                width: '48px', height: '48px', flexShrink: 0,
                borderRadius: '8px',
                background: 'linear-gradient(145deg, #3d2415, #1a0f07)',
                border: '1px solid rgba(196, 98, 45, 0.3)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <div style={{ width: '22px', height: '22px', borderRadius: '4px', background: 'radial-gradient(circle, rgba(245,158,11,0.4), rgba(196,98,45,0.2), transparent)', border: '1px solid rgba(196, 98, 45, 0.3)' }} />
              </div>

              <div style={{ flex: 1, minWidth: '140px' }}>
                <div style={{ color: '#f5e6d3', fontWeight: 700, fontSize: '0.95rem' }}>{item.productName}</div>
                <div style={{ color: '#7a5c44', fontSize: '0.78rem' }}>{item.size} · {COLOR_LABELS[item.color] ?? item.color}</div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <button onClick={() => updateQuantity(item.variantId, item.quantity - 1)} style={{ width: '26px', height: '26px', borderRadius: '5px', background: 'rgba(92,53,32,0.3)', border: '1px solid rgba(92,53,32,0.4)', cursor: 'pointer', color: '#c4a882', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Minus size={12} />
                </button>
                <span style={{ color: '#f5e6d3', fontWeight: 600, minWidth: '20px', textAlign: 'center', fontSize: '0.9rem' }}>{item.quantity}</span>
                <button onClick={() => updateQuantity(item.variantId, item.quantity + 1)} style={{ width: '26px', height: '26px', borderRadius: '5px', background: 'rgba(92,53,32,0.3)', border: '1px solid rgba(92,53,32,0.4)', cursor: 'pointer', color: '#c4a882', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Plus size={12} />
                </button>
              </div>

              <div style={{ color: '#e8783a', fontWeight: 700, fontSize: '0.95rem', minWidth: '90px', textAlign: 'right' }}>
                ${(displayPrice * item.quantity).toLocaleString('es-AR')}
              </div>

              <button onClick={() => removeItem(item.variantId)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#5c3520' }} onMouseEnter={e => e.currentTarget.style.color = '#ef4444'} onMouseLeave={e => e.currentTarget.style.color = '#5c3520'}>
                <Trash2 size={15} />
              </button>
            </div>
          )
        })}
      </div>

      {/* Discount code */}
      <div style={{ marginBottom: '1.5rem' }}>
        <label style={{ display: 'block', color: '#7a5c44', fontSize: '0.7rem', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '0.5rem', fontWeight: 600 }}>
          Código de descuento
        </label>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Tag size={14} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#5c3520' }} />
            <input
              type="text"
              value={discountCode}
              onChange={e => { setDiscountCode(e.target.value.toUpperCase()); setDiscountError('') }}
              placeholder="MERCANTIC2024"
              style={{
                width: '100%', padding: '0.7rem 0.75rem 0.7rem 2.25rem',
                background: 'rgba(45,26,14,0.5)',
                border: discountError ? '1px solid rgba(239,68,68,0.5)' : '1px solid rgba(92,53,32,0.4)',
                borderRadius: '6px', color: '#f5e6d3', fontSize: '0.85rem',
                outline: 'none', boxSizing: 'border-box',
              }}
            />
          </div>
          <button
            onClick={handleApplyCode}
            disabled={applyingCode || !discountCode.trim()}
            style={{
              padding: '0.7rem 1.25rem', background: 'rgba(92,53,32,0.3)',
              border: '1px solid rgba(92,53,32,0.4)', borderRadius: '6px',
              color: '#c4a882', fontSize: '0.82rem', cursor: applyingCode ? 'not-allowed' : 'pointer', fontWeight: 600, whiteSpace: 'nowrap',
              opacity: applyingCode || !discountCode.trim() ? 0.6 : 1,
            }}
          >
            {applyingCode ? '...' : 'Aplicar'}
          </button>
        </div>
        {discountError && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '0.4rem', color: '#ef4444', fontSize: '0.78rem' }}>
            <AlertCircle size={12} /> {discountError}
          </div>
        )}
        {appliedDiscount && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '0.4rem', color: '#22c55e', fontSize: '0.78rem' }}>
            <Check size={12} /> Descuento del {appliedDiscount.percentage}% aplicado
            <button onClick={() => { onDiscountApply(null); setDiscountCode('') }} style={{ marginLeft: '4px', background: 'none', border: 'none', color: '#5c3520', cursor: 'pointer', fontSize: '0.75rem', textDecoration: 'underline' }}>Quitar</button>
          </div>
        )}
      </div>

      {/* Subtotal */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(196,98,45,0.08), rgba(212,165,90,0.04))',
        border: '1px solid rgba(196,98,45,0.2)', borderRadius: '8px', padding: '1.25rem',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        marginBottom: '1.5rem',
      }}>
        <div>
          <div style={{ color: '#7a5c44', fontSize: '0.7rem', letterSpacing: '0.15em', textTransform: 'uppercase' }}>Total</div>
          {appliedDiscount && (
            <div style={{ color: '#5c3520', fontSize: '0.85rem', textDecoration: 'line-through', fontFamily: 'var(--font-playfair), Georgia, serif' }}>
              ${subtotal.toLocaleString('es-AR')}
            </div>
          )}
          <div style={{ fontFamily: 'var(--font-playfair), Georgia, serif', fontSize: '1.75rem', fontWeight: 800, background: 'linear-gradient(135deg, #e8783a, #d4a55a)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
            ${finalTotal.toLocaleString('es-AR')} ARS
          </div>
        </div>
        <div style={{ color: '#5c3520', fontSize: '0.75rem', textAlign: 'right' }}>
          Envío a coordinar<br />
          <span style={{ color: '#3d2415' }}>Todo el país</span>
        </div>
      </div>

      <button onClick={onNext} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', background: 'linear-gradient(135deg, #c4622d, #e8783a)', color: '#f5e6d3', padding: '1rem', borderRadius: '8px', border: 'none', fontWeight: 700, fontSize: '0.9rem', letterSpacing: '0.08em', textTransform: 'uppercase', cursor: 'pointer', boxShadow: '0 0 30px rgba(196,98,45,0.3)' }}>
        Continuar <ChevronRight size={16} />
      </button>
    </div>
  )
}

// ── Step 2: Customer Data ────────────────────────────────────────────────────
interface CustomerData {
  name: string; email: string; phone: string
  address: string; city: string; province: string; postalCode: string
  notes: string
}

function StepCustomer({ data, onChange, onNext, onBack }: {
  data: CustomerData
  onChange: (d: CustomerData) => void
  onNext: () => void
  onBack: () => void
}) {
  const [errors, setErrors] = useState<Record<string, string>>({})

  function validate() {
    const e: Record<string, string> = {}
    if (!data.name.trim()) e.name = 'Requerido'
    if (!data.email.trim()) e.email = 'Requerido'
    if (!data.phone.trim()) e.phone = 'Requerido'
    if (!data.address.trim()) e.address = 'Requerido'
    if (!data.province.trim()) e.province = 'Requerido'
    if (!data.city.trim()) e.city = 'Requerido'
    if (!data.postalCode.trim()) e.postalCode = 'Requerido'
    return e
  }

  function handleNext() {
    const e = validate()
    if (Object.keys(e).length) { setErrors(e); return }
    onNext()
  }

  function field(label: string, key: keyof CustomerData, placeholder: string, required = false) {
    return (
      <div>
        <label style={{ display: 'block', color: '#7a5c44', fontSize: '0.7rem', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '0.4rem', fontWeight: 600 }}>
          {label}{required && <span style={{ color: '#c4622d' }}> *</span>}
        </label>
        <input
          type="text"
          value={data[key]}
          onChange={e => { onChange({ ...data, [key]: e.target.value }); setErrors(prev => ({ ...prev, [key]: '' })) }}
          placeholder={placeholder}
          style={{
            width: '100%', padding: '0.7rem 0.85rem', boxSizing: 'border-box',
            background: 'rgba(45,26,14,0.5)',
            border: errors[key] ? '1px solid rgba(239,68,68,0.5)' : '1px solid rgba(92,53,32,0.4)',
            borderRadius: '6px', color: '#f5e6d3', fontSize: '0.88rem', outline: 'none',
          }}
        />
        {errors[key] && <div style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '3px' }}>{errors[key]}</div>}
      </div>
    )
  }

  return (
    <div>
      <h2 style={{ color: '#f5e6d3', fontFamily: 'var(--font-playfair), Georgia, serif', fontSize: '1.5rem', fontWeight: 800, marginBottom: '1.5rem' }}>
        Tus Datos
      </h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
        {field('Nombre completo', 'name', 'Juan García', true)}
        {field('Email', 'email', 'juan@email.com', true)}
        {field('Teléfono / WhatsApp', 'phone', '+54 9 351 000 0000', true)}
      </div>

      <div style={{ height: '1px', background: 'rgba(92,53,32,0.3)', margin: '1.5rem 0' }} />

      <div style={{ color: '#7a5c44', fontSize: '0.7rem', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '1rem', fontWeight: 600 }}>
        Dirección de Envío
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
        {field('Dirección', 'address', 'Av. Corrientes 1234, Piso 2', true)}
        <div className="ck-city-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
          <div>
            <label style={{ display: 'block', color: '#7a5c44', fontSize: '0.7rem', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '0.4rem', fontWeight: 600 }}>
              Provincia<span style={{ color: '#c4622d' }}> *</span>
            </label>
            <select
              value={data.province}
              onChange={e => { onChange({ ...data, province: e.target.value }); setErrors(prev => ({ ...prev, province: '' })) }}
              style={{
                width: '100%', padding: '0.7rem 0.85rem', boxSizing: 'border-box',
                background: 'rgba(45,26,14,0.5)',
                border: errors.province ? '1px solid rgba(239,68,68,0.5)' : '1px solid rgba(92,53,32,0.4)',
                borderRadius: '6px', color: data.province ? '#f5e6d3' : '#5c3520',
                fontSize: '0.88rem', outline: 'none', cursor: 'pointer',
                appearance: 'none', WebkitAppearance: 'none',
              }}
            >
              <option value="" disabled style={{ background: '#1a0f07', color: '#5c3520' }}>Seleccioná</option>
              {[
                'Buenos Aires','Ciudad Autónoma de Buenos Aires','Catamarca','Chaco','Chubut',
                'Córdoba','Corrientes','Entre Ríos','Formosa','Jujuy','La Pampa','La Rioja',
                'Mendoza','Misiones','Neuquén','Río Negro','Salta','San Juan','San Luis',
                'Santa Cruz','Santa Fe','Santiago del Estero','Tierra del Fuego','Tucumán',
              ].map(p => (
                <option key={p} value={p} style={{ background: '#1a0f07', color: '#f5e6d3' }}>{p}</option>
              ))}
            </select>
            {errors.province && <div style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '3px' }}>{errors.province}</div>}
          </div>
          <div>{field('Ciudad', 'city', 'Córdoba', true)}</div>
        </div>
        {field('Código postal', 'postalCode', '5000', true)}
        <div>
          <label style={{ display: 'block', color: '#7a5c44', fontSize: '0.7rem', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '0.4rem', fontWeight: 600 }}>
            Comentarios del envío <span style={{ color: '#3d2415' }}>(opcional)</span>
          </label>
          <textarea
            value={data.notes}
            onChange={e => onChange({ ...data, notes: e.target.value })}
            placeholder="Instrucciones especiales, horario de entrega, entre calles, etc."
            rows={2}
            style={{
              width: '100%', padding: '0.7rem 0.85rem', boxSizing: 'border-box',
              background: 'rgba(45,26,14,0.5)',
              border: '1px solid rgba(92,53,32,0.4)',
              borderRadius: '6px', color: '#f5e6d3', fontSize: '0.88rem',
              outline: 'none', resize: 'vertical', fontFamily: 'inherit', lineHeight: 1.5,
            }}
          />
        </div>
      </div>

      <div style={{ display: 'flex', gap: '0.75rem' }}>
        <button onClick={onBack} style={{ flex: 1, padding: '0.9rem', background: 'transparent', border: '1px solid rgba(92,53,32,0.4)', borderRadius: '8px', color: '#7a5c44', fontSize: '0.85rem', cursor: 'pointer', fontWeight: 600 }}>
          Volver
        </button>
        <button onClick={handleNext} style={{ flex: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', background: 'linear-gradient(135deg, #c4622d, #e8783a)', color: '#f5e6d3', padding: '0.9rem', borderRadius: '8px', border: 'none', fontWeight: 700, fontSize: '0.9rem', letterSpacing: '0.08em', textTransform: 'uppercase', cursor: 'pointer' }}>
          Continuar <ChevronRight size={16} />
        </button>
      </div>
    </div>
  )
}

// ── Step 3: Payment ──────────────────────────────────────────────────────────
function MockQR({ size = 120 }: { size?: number }) {
  const cells = 9
  const cell = size / cells
  const pattern = [
    [1,1,1,1,1,1,1,0,1],
    [1,0,0,0,0,0,1,0,0],
    [1,0,1,1,1,0,1,0,1],
    [1,0,1,1,1,0,1,0,0],
    [1,0,1,1,1,0,1,0,1],
    [1,0,0,0,0,0,1,0,0],
    [1,1,1,1,1,1,1,0,1],
    [0,0,1,0,1,0,0,0,0],
    [1,0,1,0,0,1,1,0,1],
  ]
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ borderRadius: '8px', background: '#f5e6d3', padding: '8px', boxSizing: 'content-box' }}>
      {pattern.map((row, r) =>
        row.map((v, c) => v ? (
          <rect key={`${r}-${c}`} x={c * cell} y={r * cell} width={cell - 1} height={cell - 1} fill="#1a0f07" rx={1} />
        ) : null)
      )}
    </svg>
  )
}

function StepPayment({ subtotal, onConfirm, onBack, loading }: {
  subtotal: number
  onConfirm: (method: PaymentMethod) => void
  onBack: () => void
  loading: boolean
}) {
  const [method, setMethod] = useState<PaymentMethod>('transferencia')
  const [installments, setInstallments] = useState(1)
  const [cardNumber, setCardNumber] = useState('')
  const [cardExpiry, setCardExpiry] = useState('')
  const [cardCvv, setCardCvv] = useState('')
  const [cardName, setCardName] = useState('')

  const installmentAmount = subtotal / installments

  const tabStyle = (active: boolean) => ({
    flex: 1, padding: '0.85rem 0.5rem', textAlign: 'center' as const,
    background: active ? 'rgba(196,98,45,0.15)' : 'transparent',
    border: '1px solid ' + (active ? 'rgba(196,98,45,0.5)' : 'rgba(92,53,32,0.3)'),
    borderRadius: '8px', cursor: 'pointer', transition: 'all 0.2s',
    color: active ? '#f5e6d3' : '#5c3520',
  })

  return (
    <div>
      <h2 style={{ color: '#f5e6d3', fontFamily: 'var(--font-playfair), Georgia, serif', fontSize: '1.5rem', fontWeight: 800, marginBottom: '1.5rem' }}>
        Método de Pago
      </h2>

      {/* Method tabs */}
      <div className="ck-method-tabs" style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
        {([
          { key: 'transferencia', label: 'Transferencia', sub: 'CVU/CBU' },
          { key: 'mercadopago', label: 'MercadoPago', sub: 'Tarjeta/Cuotas' },
          { key: 'modo', label: 'MODO', sub: 'QR Interop.' },
        ] as { key: PaymentMethod; label: string; sub: string }[]).map(m => (
          <button key={m.key} onClick={() => setMethod(m.key)} style={tabStyle(method === m.key)}>
            <div className="ck-tab-label" style={{ fontWeight: 700, fontSize: '0.8rem' }}>{m.label}</div>
            <div className="ck-tab-sub" style={{ fontSize: '0.65rem', opacity: 0.7, marginTop: '2px' }}>{m.sub}</div>
          </button>
        ))}
      </div>

      {/* Transferencia */}
      {method === 'transferencia' && (
        <div style={{ background: 'rgba(45,26,14,0.5)', border: '1px solid rgba(92,53,32,0.35)', borderRadius: '10px', padding: '1.25rem', marginBottom: '1.5rem' }}>
          <div style={{ color: '#7a5c44', fontSize: '0.7rem', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '1rem', fontWeight: 600 }}>
            Datos bancarios
          </div>
          {[
            { label: 'CBU', value: '0720310088000079002791' },
            { label: 'Alias', value: 'MERCANTIC.FOGONERO' },
            { label: 'Banco', value: 'Galicia' },
            { label: 'Titular', value: 'El Mercantic Fogoneros' },
            { label: 'CUIL', value: '20-12345678-9' },
          ].map(row => (
            <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '0.5rem', padding: '0.6rem 0', borderBottom: '1px solid rgba(92,53,32,0.2)' }}>
              <span style={{ color: '#5c3520', fontSize: '0.82rem', flexShrink: 0 }}>{row.label}</span>
              <span className="ck-bank-value" style={{ color: '#c4a882', fontWeight: 600, fontSize: '0.85rem', fontFamily: 'monospace', wordBreak: 'break-all', textAlign: 'right' }}>{row.value}</span>
            </div>
          ))}
          <div style={{ marginTop: '1rem', padding: '0.85rem', background: 'rgba(196,98,45,0.08)', borderRadius: '6px', border: '1px solid rgba(196,98,45,0.15)' }}>
            <div style={{ color: '#e8783a', fontWeight: 700, fontSize: '1rem' }}>
              Monto: ${subtotal.toLocaleString('es-AR')} ARS
            </div>
            <div style={{ color: '#5c3520', fontSize: '0.78rem', marginTop: '4px' }}>
              Enviá el comprobante por WhatsApp para confirmar tu pedido.
            </div>
          </div>
        </div>
      )}

      {/* MercadoPago */}
      {method === 'mercadopago' && (
        <div style={{ background: 'rgba(45,26,14,0.5)', border: '1px solid rgba(92,53,32,0.35)', borderRadius: '10px', padding: '1.25rem', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <div style={{ color: '#7a5c44', fontSize: '0.7rem', letterSpacing: '0.15em', textTransform: 'uppercase', fontWeight: 600 }}>
              Cuotas
            </div>
            <div style={{ color: '#5c3520', fontSize: '0.7rem', background: 'rgba(196,98,45,0.1)', border: '1px solid rgba(196,98,45,0.2)', padding: '2px 8px', borderRadius: '4px' }}>
              ⚡ Configura MP_ACCESS_TOKEN para activar
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '1.25rem' }}>
            {INSTALLMENTS.map(inst => (
              <button
                key={inst.value}
                onClick={() => setInstallments(inst.value)}
                style={{
                  padding: '0.75rem', borderRadius: '8px', cursor: 'pointer', textAlign: 'left',
                  background: installments === inst.value ? 'rgba(196,98,45,0.15)' : 'rgba(45,26,14,0.4)',
                  border: '1px solid ' + (installments === inst.value ? 'rgba(196,98,45,0.5)' : 'rgba(92,53,32,0.3)'),
                  transition: 'all 0.2s',
                }}
              >
                <div style={{ color: installments === inst.value ? '#f5e6d3' : '#c4a882', fontWeight: 700, fontSize: '0.88rem' }}>
                  {inst.label}
                </div>
                <div style={{ color: installments === inst.value ? '#e8783a' : '#5c3520', fontSize: '0.8rem', marginTop: '2px' }}>
                  ${Math.ceil(installmentAmount).toLocaleString('es-AR')}/mes
                </div>
                <div style={{ color: '#3d2415', fontSize: '0.68rem', marginTop: '2px' }}>{inst.note}</div>
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div>
              <label style={{ display: 'block', color: '#7a5c44', fontSize: '0.68rem', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.35rem', fontWeight: 600 }}>
                Número de tarjeta
              </label>
              <input
                type="text"
                value={cardNumber}
                onChange={e => setCardNumber(e.target.value.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim())}
                placeholder="0000 0000 0000 0000"
                style={{ width: '100%', padding: '0.7rem 0.85rem', boxSizing: 'border-box', background: 'rgba(45,26,14,0.5)', border: '1px solid rgba(92,53,32,0.4)', borderRadius: '6px', color: '#f5e6d3', fontSize: '0.88rem', outline: 'none', fontFamily: 'monospace', letterSpacing: '0.1em' }}
              />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div>
                <label style={{ display: 'block', color: '#7a5c44', fontSize: '0.68rem', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.35rem', fontWeight: 600 }}>Vencimiento</label>
                <input
                  type="text"
                  value={cardExpiry}
                  onChange={e => {
                    const v = e.target.value.replace(/\D/g, '').slice(0, 4)
                    setCardExpiry(v.length > 2 ? v.slice(0, 2) + '/' + v.slice(2) : v)
                  }}
                  placeholder="MM/AA"
                  style={{ width: '100%', padding: '0.7rem 0.85rem', boxSizing: 'border-box', background: 'rgba(45,26,14,0.5)', border: '1px solid rgba(92,53,32,0.4)', borderRadius: '6px', color: '#f5e6d3', fontSize: '0.88rem', outline: 'none', fontFamily: 'monospace' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', color: '#7a5c44', fontSize: '0.68rem', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.35rem', fontWeight: 600 }}>CVV</label>
                <input
                  type="text"
                  value={cardCvv}
                  onChange={e => setCardCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
                  placeholder="000"
                  style={{ width: '100%', padding: '0.7rem 0.85rem', boxSizing: 'border-box', background: 'rgba(45,26,14,0.5)', border: '1px solid rgba(92,53,32,0.4)', borderRadius: '6px', color: '#f5e6d3', fontSize: '0.88rem', outline: 'none', fontFamily: 'monospace' }}
                />
              </div>
            </div>
            <div>
              <label style={{ display: 'block', color: '#7a5c44', fontSize: '0.68rem', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.35rem', fontWeight: 600 }}>Nombre en la tarjeta</label>
              <input
                type="text"
                value={cardName}
                onChange={e => setCardName(e.target.value)}
                placeholder="JUAN GARCIA"
                style={{ width: '100%', padding: '0.7rem 0.85rem', boxSizing: 'border-box', background: 'rgba(45,26,14,0.5)', border: '1px solid rgba(92,53,32,0.4)', borderRadius: '6px', color: '#f5e6d3', fontSize: '0.88rem', outline: 'none' }}
              />
            </div>
          </div>
        </div>
      )}

      {/* MODO */}
      {method === 'modo' && (
        <div style={{ background: 'rgba(45,26,14,0.5)', border: '1px solid rgba(92,53,32,0.35)', borderRadius: '10px', padding: '1.25rem', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
            <div style={{ color: '#7a5c44', fontSize: '0.7rem', letterSpacing: '0.15em', textTransform: 'uppercase', fontWeight: 600 }}>
              MODO · QR Interoperativo
            </div>
            <span style={{ background: 'rgba(196,98,45,0.15)', border: '1px solid rgba(196,98,45,0.3)', color: '#c4a882', fontSize: '0.65rem', padding: '1px 8px', borderRadius: '100px', fontWeight: 600 }}>
              Todos los bancos
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', padding: '1rem 0' }}>
            <MockQR size={120} />
            <div style={{ textAlign: 'center' }}>
              <div style={{ color: '#e8783a', fontWeight: 700, fontSize: '1.1rem' }}>
                ${subtotal.toLocaleString('es-AR')} ARS
              </div>
              <div style={{ color: '#5c3520', fontSize: '0.78rem', marginTop: '4px' }}>
                Abrí tu homebanking o billetera y escaneá el QR
              </div>
            </div>
          </div>

          <div style={{ color: '#3d2415', fontSize: '0.75rem', textAlign: 'center', padding: '0.75rem', background: 'rgba(196,98,45,0.06)', borderRadius: '6px', border: '1px solid rgba(196,98,45,0.12)' }}>
            QR de ejemplo · En producción se genera dinámicamente
          </div>
        </div>
      )}

      <div style={{ display: 'flex', gap: '0.75rem' }}>
        <button onClick={onBack} style={{ flex: 1, padding: '0.9rem', background: 'transparent', border: '1px solid rgba(92,53,32,0.4)', borderRadius: '8px', color: '#7a5c44', fontSize: '0.85rem', cursor: 'pointer', fontWeight: 600 }}>
          Volver
        </button>
        <button
          onClick={() => onConfirm(method)}
          disabled={loading}
          style={{ flex: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', background: loading ? 'rgba(92,53,32,0.4)' : 'linear-gradient(135deg, #c4622d, #e8783a)', color: '#f5e6d3', padding: '0.9rem', borderRadius: '8px', border: 'none', fontWeight: 700, fontSize: '0.9rem', letterSpacing: '0.08em', textTransform: 'uppercase', cursor: loading ? 'not-allowed' : 'pointer', boxShadow: loading ? 'none' : '0 0 24px rgba(196,98,45,0.3)', transition: 'all 0.3s' }}
        >
          {loading ? (
            <><span style={{ display: 'inline-block', width: '14px', height: '14px', border: '2px solid rgba(245,230,211,0.3)', borderTopColor: '#f5e6d3', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} /> Procesando...</>
          ) : (
            <>Pagar ${subtotal.toLocaleString('es-AR')} <ChevronRight size={16} /></>
          )}
        </button>
      </div>
    </div>
  )
}

// ── Step 4: Confirmation ─────────────────────────────────────────────────────
function StepConfirmation({ orderId, paymentMethod, subtotal }: { orderId: number; paymentMethod: PaymentMethod; subtotal: number }) {
  return (
    <div style={{ textAlign: 'center', padding: '1rem 0' }}>
      <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: 'linear-gradient(135deg, rgba(196,98,45,0.2), rgba(232,120,58,0.1))', border: '2px solid rgba(196,98,45,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', boxShadow: '0 0 40px rgba(196,98,45,0.2)' }}>
        <CheckCircle size={36} style={{ color: '#e8783a' }} />
      </div>

      <h2 style={{ color: '#f5e6d3', fontFamily: 'var(--font-playfair), Georgia, serif', fontSize: '1.75rem', fontWeight: 900, marginBottom: '0.5rem' }}>
        ¡Pedido Recibido!
      </h2>
      <p style={{ color: '#7a5c44', marginBottom: '1.5rem' }}>
        Número de pedido: <span style={{ color: '#e8783a', fontWeight: 700 }}>#{orderId}</span>
      </p>

      <div style={{ background: 'rgba(45,26,14,0.5)', border: '1px solid rgba(92,53,32,0.35)', borderRadius: '10px', padding: '1.25rem', marginBottom: '1.5rem', textAlign: 'left' }}>
        <div style={{ color: '#7a5c44', fontSize: '0.7rem', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '0.75rem', fontWeight: 600 }}>
          Próximos pasos
        </div>
        {paymentMethod === 'transferencia' && (
          <div style={{ color: '#c4a882', fontSize: '0.88rem', lineHeight: 1.7 }}>
            1. Realizá la transferencia de <strong style={{ color: '#e8783a' }}>${subtotal.toLocaleString('es-AR')} ARS</strong><br />
            2. Enviá el comprobante por WhatsApp<br />
            3. Confirmamos tu pedido en 24-48 hs hábiles<br />
            4. Te avisamos cuando esté listo para enviar
          </div>
        )}
        {paymentMethod === 'mercadopago' && (
          <div style={{ color: '#c4a882', fontSize: '0.88rem', lineHeight: 1.7 }}>
            Pago procesado (modo demo).<br />
            Te contactaremos para coordinar el envío.
          </div>
        )}
        {paymentMethod === 'modo' && (
          <div style={{ color: '#c4a882', fontSize: '0.88rem', lineHeight: 1.7 }}>
            Confirmamos el pago cuando acreditamos.<br />
            Te contactaremos para coordinar el envío.
          </div>
        )}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <Link href="/" style={{ display: 'block', textAlign: 'center', color: '#5c3520', textDecoration: 'none', fontSize: '0.85rem', padding: '0.85rem', border: '1px solid rgba(92,53,32,0.3)', borderRadius: '8px' }}>
          Volver al inicio
        </Link>
      </div>
    </div>
  )
}

// ── Main Page ────────────────────────────────────────────────────────────────
export default function CheckoutPage() {
  const router = useRouter()
  const { items, subtotal, clearCart } = useCart()
  const [step, setStep] = useState<Step>(1)
  const [loading, setLoading] = useState(false)
  const [orderId, setOrderId] = useState<number | null>(null)
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('transferencia')
  const [appliedDiscount, setAppliedDiscount] = useState<AppliedDiscount | null>(null)
  const [customer, setCustomer] = useState<CustomerData>({
    name: '', email: '', phone: '',
    address: '', city: '', province: '', postalCode: '',
    notes: '',
  })

  const finalTotal = appliedDiscount ? Math.round(subtotal * (1 - appliedDiscount.percentage / 100)) : subtotal

  // Redirect if empty cart and not on confirmation
  useEffect(() => {
    if (items.length === 0 && step !== 4) {
      // Let StepCart handle the empty state
    }
  }, [items, step])

  async function handleConfirmPayment(method: PaymentMethod) {
    setPaymentMethod(method)
    setLoading(true)

    // Simulate processing delay for MercadoPago
    if (method === 'mercadopago') {
      await new Promise(r => setTimeout(r, 2000))
    }

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer: {
            name: customer.name || 'Cliente',
            email: customer.email || undefined,
            phone: customer.phone || undefined,
          },
          items: items.map(i => ({ variant_id: i.variantId, quantity: i.quantity })),
          payment_method: method === 'mercadopago' ? 'tarjeta' : method,
          discount_code: appliedDiscount?.code || undefined,
          shipping_address: customer.address || undefined,
          city: customer.city || undefined,
          province: customer.province || undefined,
          postal_code: customer.postalCode || undefined,
          notes: customer.notes || undefined,
        }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Error al crear la orden')

      setOrderId(data.order.id)
      clearCart()
      setStep(4)
    } catch (err) {
      console.error(err)
      alert('Hubo un error al procesar tu pedido. Intentá de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ background: '#0f0702', minHeight: '100vh' }}>
      {/* Minimal header */}
      <header style={{ borderBottom: '1px solid rgba(92,53,32,0.25)', padding: '1.1rem 1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
          <div style={{ width: '26px', height: '26px', background: 'radial-gradient(circle at 50% 70%, #e8783a, #c4622d, #3d2415)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 10px rgba(232,120,58,0.4)' }}>
            <Flame size={13} color="#f5e6d3" fill="#f5e6d3" />
          </div>
          <span style={{ fontFamily: 'var(--font-playfair), Georgia, serif', color: '#f5e6d3', fontWeight: 700, fontSize: '1rem' }}>
            El Mercantic
          </span>
        </Link>
        <span style={{ color: '#3d2415', fontSize: '0.9rem' }}>·</span>
        <span style={{ color: '#5c3520', fontSize: '0.85rem' }}>Checkout</span>
      </header>

      <div style={{ maxWidth: '640px', margin: '0 auto', padding: '2.5rem 1.25rem 4rem' }}>
        {/* Step labels */}
        {step < 4 && (
          <div style={{ marginBottom: '0.5rem', display: 'flex', justifyContent: 'space-between' }}>
            {([1, 2, 3] as Step[]).map(s => (
              <span key={s} style={{ fontSize: '0.68rem', color: s === step ? '#c4622d' : '#3d2415', fontWeight: s === step ? 700 : 400, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                {stepLabel(s)}
              </span>
            ))}
          </div>
        )}

        <ProgressBar step={step} />

        {step === 1 && (
          <StepCart
            onNext={() => setStep(2)}
            appliedDiscount={appliedDiscount}
            onDiscountApply={setAppliedDiscount}
          />
        )}
        {step === 2 && (
          <StepCustomer
            data={customer}
            onChange={setCustomer}
            onNext={() => setStep(3)}
            onBack={() => setStep(1)}
          />
        )}
        {step === 3 && (
          <StepPayment
            subtotal={finalTotal}
            onConfirm={handleConfirmPayment}
            onBack={() => setStep(2)}
            loading={loading}
          />
        )}
        {step === 4 && orderId && (
          <StepConfirmation orderId={orderId} paymentMethod={paymentMethod} subtotal={finalTotal} />
        )}
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        input:focus { border-color: rgba(196, 98, 45, 0.6) !important; }

        /* ── Mobile checkout ───────────────────────────────── */
        @media (max-width: 480px) {
          /* Payment method tabs: wrap text, smaller font */
          .ck-method-tabs { gap: 0.3rem !important; }
          .ck-method-tabs button {
            padding: 0.65rem 0.25rem !important;
          }
          .ck-method-tabs button .ck-tab-label { font-size: 0.7rem !important; }
          .ck-method-tabs button .ck-tab-sub   { font-size: 0.58rem !important; }

          /* Progress bar: smaller circles on very narrow screens */
          .ck-progress-circle {
            width: 26px !important;
            height: 26px !important;
            font-size: 0.72rem !important;
          }
          /* CBU / bank data value: break long strings */
          .ck-bank-value {
            word-break: break-all !important;
            letter-spacing: 0 !important;
            font-size: 0.78rem !important;
            text-align: right;
            max-width: 55%;
          }
          /* City/Province grid: stack on very small screens */
          .ck-city-grid {
            grid-template-columns: 1fr !important;
          }
        }
        @media (max-width: 360px) {
          .ck-method-tabs button .ck-tab-label { font-size: 0.62rem !important; }
        }
      `}</style>
    </div>
  )
}
