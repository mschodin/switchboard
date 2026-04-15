'use client'

import { useEffect, useState } from 'react'
import { getUserSubmissions } from '@/actions/requests'
import { SubmissionCard } from './submission-card'
import { SubmissionEmptyState } from './submission-empty-state'
import { Skeleton } from '@/components/ui/skeleton'
import type { EndpointRequest } from '@/types/database'

export function SubmissionsList() {
  const [submissions, setSubmissions] = useState<EndpointRequest[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const data = await getUserSubmissions()
        setSubmissions(data)
      } catch (error) {
        console.error('Failed to fetch submissions:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchSubmissions()
  }, [])

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-32 w-full" />
        ))}
      </div>
    )
  }

  if (submissions.length === 0) {
    return <SubmissionEmptyState />
  }

  return (
    <div className="space-y-4">
      {submissions.map((submission) => (
        <SubmissionCard key={submission.id} submission={submission} />
      ))}
    </div>
  )
}
