'use client'

import { useAuth } from './auth-provider'
import { redirect } from 'next/navigation'
import { useEffect } from 'react'

interface AuthGuardProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

export function AuthGuard({ children, fallback }: AuthGuardProps) {
  const { isAuthenticated, isLoading } = useAuth()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      redirect('/login')
    }
  }, [isLoading, isAuthenticated])

  if (isLoading) {
    return fallback ?? <div>Loading...</div>
  }

  if (!isAuthenticated) {
    return null
  }

  return <>{children}</>
}
