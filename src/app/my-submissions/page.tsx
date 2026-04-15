'use client'

import { AuthGuard } from '@/components/auth/auth-guard'
import { SubmissionsList } from '@/components/submissions/submissions-list'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Plus } from 'lucide-react'
import Link from 'next/link'

export default function MySubmissionsPage() {
  return (
    <AuthGuard>
      <div className="min-h-screen bg-muted/50">
        <div className="container max-w-4xl py-8 px-4">
          <div className="flex items-center justify-between mb-6">
            <Button asChild variant="ghost">
              <Link href="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Registry
              </Link>
            </Button>
            <Button asChild>
              <Link href="/submit">
                <Plus className="mr-2 h-4 w-4" />
                New Submission
              </Link>
            </Button>
          </div>

          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-2">My Submissions</h1>
            <p className="text-muted-foreground">
              Track the status of your endpoint submissions
            </p>
          </div>

          <SubmissionsList />
        </div>
      </div>
    </AuthGuard>
  )
}
