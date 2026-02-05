'use client'

import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { UserMenu } from '@/components/auth/user-menu'
import { useFilters } from '@/hooks/use-filters'
import { useDebounce } from '@/hooks/use-debounce'
import { useEffect, useState } from 'react'

export function MainHeader() {
  const { search, setSearch } = useFilters()
  const [localSearch, setLocalSearch] = useState(search)
  const debouncedSearch = useDebounce(localSearch, 300)

  useEffect(() => {
    setSearch(debouncedSearch)
  }, [debouncedSearch, setSearch])

  useEffect(() => {
    setLocalSearch(search)
  }, [search])

  return (
    <header className="border-b border-black/[0.08] bg-white">
      <div className="container flex h-16 items-center gap-4 px-4">
        <div className="flex-1">
          <h1 className="text-2xl font-semibold">Endpoint Registry</h1>
          <p className="text-sm text-muted-foreground">
            Browse and discover API endpoints
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search endpoints..."
              className="pl-9"
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
            />
          </div>

          <UserMenu />
        </div>
      </div>
    </header>
  )
}
