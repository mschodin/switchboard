import { EndpointCard } from './endpoint-card'
import { EndpointCardSkeleton } from './endpoint-card-skeleton'
import type { Endpoint } from '@/types/database'

interface EndpointGridProps {
  endpoints: Endpoint[]
  isLoading?: boolean
  onEndpointClick?: (endpoint: Endpoint) => void
}

export function EndpointGrid({
  endpoints,
  isLoading = false,
  onEndpointClick,
}: EndpointGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 9 }).map((_, i) => (
          <EndpointCardSkeleton key={i} />
        ))}
      </div>
    )
  }

  if (endpoints.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <p className="text-lg font-medium text-muted-foreground mb-2">
          No endpoints found
        </p>
        <p className="text-sm text-muted-foreground">
          Try adjusting your search or filters
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {endpoints.map((endpoint) => (
        <EndpointCard
          key={endpoint.id}
          endpoint={endpoint}
          onClick={() => onEndpointClick?.(endpoint)}
        />
      ))}
    </div>
  )
}
