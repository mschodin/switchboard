'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { TagList } from '@/components/tags/tag-list'
import { useAuth } from '@/components/auth/auth-provider'
import Link from 'next/link'
import { Plus } from 'lucide-react'

interface LeftSidebarProps {
  className?: string
}

export function LeftSidebar({ className }: LeftSidebarProps) {
  const { isAuthenticated } = useAuth()

  return (
    <aside
      className={cn(
        'hidden md:flex md:w-sidebar-left md:flex-shrink-0 flex-col border-r border-black/[0.08] bg-white',
        className
      )}
    >
      <div className="flex-1 overflow-y-auto p-6">
        <div className="mb-8">
          <Link href="/" className="block">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-[#2F33F5] to-[#5192F4] bg-clip-text text-transparent">Switchboard</h1>
            <p className="text-sm text-muted-foreground mt-1">
              API Endpoint Registry
            </p>
          </Link>
        </div>

        <div className="mb-6">
          <h2 className="text-xs font-semibold uppercase tracking-wider mb-3 text-muted-foreground">
            Filter by Category
          </h2>
          <TagList />
        </div>
      </div>

      <div className="p-6 border-t border-black/[0.08]">
        {isAuthenticated ? (
          <Button asChild className="w-full">
            <Link href="/submit">
              <Plus className="mr-2 h-4 w-4" />
              Submit Endpoint
            </Link>
          </Button>
        ) : (
          <div className="space-y-2">
            <Button asChild className="w-full" variant="outline">
              <Link href="/login">Log In</Link>
            </Button>
            <Button asChild className="w-full">
              <Link href="/register">Sign Up</Link>
            </Button>
          </div>
        )}
      </div>
    </aside>
  )
}
