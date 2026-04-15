import { RequestQueue } from '@/components/admin/request-queue'

export default function AdminRequestsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-2">Pending Requests</h2>
        <p className="text-muted-foreground">
          Review and moderate user-submitted endpoints
        </p>
      </div>

      <RequestQueue />
    </div>
  )
}
