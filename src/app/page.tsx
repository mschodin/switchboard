'use client'

import { useEffect, useState } from 'react'
import { LeftSidebar } from '@/components/layout/left-sidebar'
import { RightSidebar } from '@/components/layout/right-sidebar'
import { MainHeader } from '@/components/layout/main-header'
import { EndpointGrid } from '@/components/endpoints/endpoint-grid'
import { EndpointFilters } from '@/components/endpoints/endpoint-filters'
import { EndpointCount } from '@/components/endpoints/endpoint-count'
import { getEndpoints } from '@/actions/endpoints'
import { useFilters } from '@/hooks/use-filters'
import type { Endpoint } from '@/types/database'

export default function HomePage() {
  const { tags, search } = useFilters()
  const [endpoints, setEndpoints] = useState<Endpoint[]>([])
  const [allEndpoints, setAllEndpoints] = useState<Endpoint[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchEndpoints = async () => {
      setIsLoading(true)
      try {
        const data = await getEndpoints({
          tags: tags.length > 0 ? tags : undefined,
          search: search || undefined,
        })
        setEndpoints(data)

        if (tags.length === 0 && !search) {
          setAllEndpoints(data)
        }
      } catch (error) {
        console.error('Failed to fetch endpoints:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchEndpoints()
  }, [tags, search])

  return (
    <div className="flex h-screen overflow-hidden">
      <LeftSidebar />

      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <MainHeader />

        <div className="flex-1 overflow-y-auto">
          <div className="container py-6 px-4 space-y-4">
            <EndpointFilters />
            <EndpointCount
              showing={endpoints.length}
              total={allEndpoints.length || endpoints.length}
            />
            <EndpointGrid endpoints={endpoints} isLoading={isLoading} />
          </div>
        </div>
      </main>

      <RightSidebar />
    </div>
  )
}
