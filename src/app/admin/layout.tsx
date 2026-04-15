'use client'

import { AdminGuard } from '@/components/auth/admin-guard'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Home, FileText, Plus } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  const navItems = [
    {
      href: '/admin',
      label: 'Dashboard',
      icon: Home,
    },
    {
      href: '/admin/requests',
      label: 'Pending Requests',
      icon: FileText,
    },
    {
      href: '/admin/endpoints/new',
      label: 'Create Endpoint',
      icon: Plus,
    },
  ]

  return (
    <AdminGuard>
      <div className="min-h-screen bg-muted/50">
        <div className="border-b bg-background">
          <div className="container flex h-16 items-center gap-4 px-4">
            <Button asChild variant="ghost" size="sm">
              <Link href="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Exit Admin
              </Link>
            </Button>
            <h1 className="text-xl font-bold">Admin Panel</h1>
          </div>
        </div>

        <div className="container py-8 px-4">
          <div className="flex gap-8">
            <aside className="w-64 shrink-0">
              <nav className="space-y-1">
                {navItems.map((item) => (
                  <Link key={item.href} href={item.href}>
                    <Button
                      variant="ghost"
                      className={cn(
                        'w-full justify-start',
                        pathname === item.href && 'bg-muted'
                      )}
                    >
                      <item.icon className="mr-2 h-4 w-4" />
                      {item.label}
                    </Button>
                  </Link>
                ))}
              </nav>
            </aside>

            <main className="flex-1">{children}</main>
          </div>
        </div>
      </div>
    </AdminGuard>
  )
}
