'use client'

import { useState, useTransition } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { TagBadge } from '@/components/tags/tag-badge'
import { formatDateTime } from '@/lib/utils'
import { approveRequest, rejectRequest } from '@/actions/requests'
import { useToast } from '@/hooks/use-toast'
import type { EndpointRequest } from '@/types/database'
import { Check, X, Eye, Loader2 } from 'lucide-react'

interface RequestCardProps {
  request: EndpointRequest
  onApprove?: () => void
  onReject?: () => void
  onViewDetails?: () => void
}

export function RequestCard({
  request,
  onApprove,
  onReject,
  onViewDetails,
}: RequestCardProps) {
  const [isPending, startTransition] = useTransition()
  const { toast } = useToast()

  const tags =
    request.endpoint_request_tags?.map((et: any) => et.tag).filter(Boolean) ?? []

  const handleApprove = () => {
    startTransition(async () => {
      const result = await approveRequest(request.id)
      if (result.success) {
        toast({
          title: 'Request approved',
          description: 'The endpoint has been added to the registry',
        })
        onApprove?.()
      } else {
        toast({
          title: 'Error',
          description: result.error?.root?.[0] ?? 'Failed to approve request',
          variant: 'destructive',
        })
      }
    })
  }

  const handleReject = () => {
    startTransition(async () => {
      const result = await rejectRequest(request.id)
      if (result.success) {
        toast({
          title: 'Request rejected',
          description: 'The submitter has been notified',
        })
        onReject?.()
      } else {
        toast({
          title: 'Error',
          description: result.error?.root?.[0] ?? 'Failed to reject request',
          variant: 'destructive',
        })
      }
    })
  }

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <p className="text-sm font-medium text-muted-foreground">
              {request.company}
            </p>
            <h3 className="text-lg font-medium">{request.title}</h3>
          </div>
        </div>

        {request.description && (
          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
            {request.description}
          </p>
        )}

        <div className="flex flex-wrap gap-1.5 mb-3">
          {tags.map((tag) => (
            <TagBadge key={tag.id} tag={tag} />
          ))}
        </div>

        <div className="flex items-center justify-between mb-3 text-xs text-muted-foreground">
          <span>Submitted {formatDateTime(request.created_at)}</span>
          <span className="font-mono">
            {request.protocol} • {request.address}
          </span>
        </div>

        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={onViewDetails}
            disabled={isPending}
          >
            <Eye className="mr-2 h-4 w-4" />
            View Details
          </Button>
          <Button
            size="sm"
            variant="default"
            onClick={handleApprove}
            disabled={isPending}
            className="bg-green-600 hover:bg-green-700"
          >
            {isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Check className="mr-2 h-4 w-4" />
            )}
            Approve
          </Button>
          <Button
            size="sm"
            variant="destructive"
            onClick={handleReject}
            disabled={isPending}
          >
            {isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <X className="mr-2 h-4 w-4" />
            )}
            Reject
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
