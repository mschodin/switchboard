'use client'

import { useEffect, useState } from 'react'
import { getPendingRequests } from '@/actions/requests'
import { RequestCard } from './request-card'
import { Skeleton } from '@/components/ui/skeleton'
import type { EndpointRequest } from '@/types/database'
import { Clock } from 'lucide-react'

export function RequestQueue() {
  const [requests, setRequests] = useState<EndpointRequest[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchRequests = async () => {
    try {
      const data = await getPendingRequests()
      setRequests(data)
    } catch (error) {
      console.error('Failed to fetch pending requests:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchRequests()
  }, [])

  const handleRequestUpdate = () => {
    fetchRequests()
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-40 w-full" />
        ))}
      </div>
    )
  }

  if (requests.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="rounded-full bg-muted p-4 mb-4">
          <Clock className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-medium mb-2">No pending requests</h3>
        <p className="text-sm text-muted-foreground">
          All submissions have been reviewed
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {requests.map((request) => (
        <RequestCard
          key={request.id}
          request={request}
          onApprove={handleRequestUpdate}
          onReject={handleRequestUpdate}
        />
      ))}
    </div>
  )
}
