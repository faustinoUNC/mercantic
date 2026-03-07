'use client'
import { useEffect } from 'react'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const prev = document.body.style.overscrollBehavior
    document.body.style.overscrollBehavior = 'none'
    document.documentElement.style.overscrollBehavior = 'none'
    return () => {
      document.body.style.overscrollBehavior = prev
      document.documentElement.style.overscrollBehavior = ''
    }
  }, [])

  return <>{children}</>
}
