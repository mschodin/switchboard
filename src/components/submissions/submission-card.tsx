import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { TagBadge } from '@/components/tags/tag-badge'
import { formatDateTime } from '@/lib/utils'
import type { EndpointRequest } from '@/types/database'
import { Clock, CheckCircle, XCircle } from 'lucide-react'

interface SubmissionCardProps {
  submission: EndpointRequest
}

const statusConfig = {
  pending: {
    icon: Clock,
    label: 'Pending Review',
    className: 'bg-yellow-100 text-yellow-800 border-yellow-300',
  },
  approved: {
    icon: CheckCircle,
    label: 'Approved',
    className: 'bg-green-100 text-green-800 border-green-300',
  },
  rejected: {
    icon: XCircle,
    label: 'Rejected',
    className: 'bg-red-100 text-red-800 border-red-300',
  },
}

export function SubmissionCard({ submission }: SubmissionCardProps) {
  const config = statusConfig[submission.request_status]
  const Icon = config.icon

  const tags =
    submission.endpoint_request_tags?.map((et: any) => et.tag).filter(Boolean) ?? []

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <p className="text-sm font-medium text-muted-foreground">
              {submission.company}
            </p>
            <h3 className="text-lg font-medium">{submission.title}</h3>
          </div>
          <Badge variant="outline" className={config.className}>
            <Icon className="mr-1 h-3 w-3" />
            {config.label}
          </Badge>
        </div>

        {submission.description && (
          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
            {submission.description}
          </p>
        )}

        <div className="flex flex-wrap gap-1.5 mb-3">
          {tags.map((tag) => (
            <TagBadge key={tag.id} tag={tag} />
          ))}
        </div>

        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Submitted {formatDateTime(submission.created_at)}</span>
          <span className="font-mono">{submission.protocol}</span>
        </div>

        {submission.reviewed_at && (
          <p className="text-xs text-muted-foreground mt-2">
            Reviewed {formatDateTime(submission.reviewed_at)}
          </p>
        )}
      </CardContent>
    </Card>
  )
}
