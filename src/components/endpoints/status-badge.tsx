import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import type { EndpointStatus } from '@/types/database'

interface StatusBadgeProps {
  status: EndpointStatus
  className?: string
}

const statusConfig = {
  active: {
    label: 'Active',
    className: 'bg-green-100 text-green-800 border-green-300',
  },
  inactive: {
    label: 'Inactive',
    className: 'bg-yellow-100 text-yellow-800 border-yellow-300',
  },
  deprecated: {
    label: 'Deprecated',
    className: 'bg-red-100 text-red-800 border-red-300',
  },
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status]

  return (
    <Badge variant="outline" className={cn(config.className, className)}>
      <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-current" />
      {config.label}
    </Badge>
  )
}
