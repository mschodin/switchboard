'use client'

import { useAuth } from './auth-provider'
import { redirect } from 'next/navigation'
import { useEffect } from 'react'

interface AdminGuardProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

export function AdminGuard({ children, fallback }: AdminGuardProps) {
  const { isAdmin, isLoading, isAuthenticated } = useAuth()

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        redirect('/login')
      } else if (!isAdmin) {
        redirect('/')
      }
    }
  }, [isLoading, isAuthenticated, isAdmin])

  if (isLoading) {
    return fallback ?? <div>Loading...</div>
  }

  if (!isAdmin) {
    return null
  }

  return <>{children}</>
}
