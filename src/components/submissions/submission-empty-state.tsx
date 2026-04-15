import { Button } from '@/components/ui/button'
import { FileText, Plus } from 'lucide-react'
import Link from 'next/link'

export function SubmissionEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="rounded-full bg-muted p-4 mb-4">
        <FileText className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-medium mb-2">No submissions yet</h3>
      <p className="text-sm text-muted-foreground mb-6 max-w-sm">
        You haven&apos;t submitted any endpoints for review. Start by adding your first
        API endpoint.
      </p>
      <Button asChild>
        <Link href="/submit">
          <Plus className="mr-2 h-4 w-4" />
          Submit Endpoint
        </Link>
      </Button>
    </div>
  )
}
