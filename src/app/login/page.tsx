'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Flame, Loader2, Lock } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    const supabase = createClient()
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password })

    if (authError) {
      setError('Credenciales incorrectas. Verificá tu email y contraseña.')
      setIsLoading(false)
      return
    }

    router.push('/admin')
    router.refresh()
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0f0702',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem',
    }}>
      <div style={{ width: '100%', maxWidth: '400px' }}>
        {/* Brand header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            width: 56, height: 56,
            background: 'radial-gradient(circle at 50% 70%, #e8783a, #c4622d, #3d2415)',
            borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 30px rgba(232, 120, 58, 0.4)',
            margin: '0 auto 1rem',
          }}>
            <Flame size={24} color="#f5e6d3" fill="#f5e6d3" />
          </div>
          <h1 style={{
            fontFamily: 'var(--font-playfair), Georgia, serif',
            fontSize: '1.5rem', fontWeight: 700,
            color: '#f5e6d3',
            marginBottom: '0.25rem',
          }}>
            El Mercantic
          </h1>
          <p style={{ color: '#5c3520', fontSize: '0.85rem' }}>Panel Administrativo</p>
        </div>

        <Card style={{
          background: '#1a0f07',
          border: '1px solid rgba(92, 53, 32, 0.5)',
        }}>
          <CardHeader>
            <CardTitle style={{ color: '#f5e6d3', fontSize: '1.1rem' }}>Iniciar sesión</CardTitle>
            <CardDescription style={{ color: '#5c3520' }}>
              Ingresá tus credenciales de acceso
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium" style={{ color: '#c4a882' }}>
                  Email
                </label>
                <Input
                  type="email"
                  placeholder="admin@elmercantic.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                  autoComplete="email"
                  style={{
                    background: 'rgba(45, 26, 14, 0.8)',
                    border: '1px solid rgba(92, 53, 32, 0.5)',
                    color: '#f5e6d3',
                  }}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium" style={{ color: '#c4a882' }}>
                  Contraseña
                </label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                  autoComplete="current-password"
                  style={{
                    background: 'rgba(45, 26, 14, 0.8)',
                    border: '1px solid rgba(92, 53, 32, 0.5)',
                    color: '#f5e6d3',
                  }}
                />
              </div>

              {error && (
                <div style={{
                  background: 'rgba(239, 68, 68, 0.08)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  borderRadius: '6px',
                  padding: '0.75rem',
                  fontSize: '0.875rem',
                  color: '#ef4444',
                }}>
                  {error}
                </div>
              )}

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full gap-2"
                style={{
                  background: 'linear-gradient(135deg, #c4622d, #e8783a)',
                  color: '#f5e6d3',
                  border: 'none',
                  fontWeight: 700,
                  letterSpacing: '0.05em',
                }}
              >
                {isLoading ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Ingresando…</>
                ) : (
                  <><Lock className="w-4 h-4" /> Ingresar</>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
