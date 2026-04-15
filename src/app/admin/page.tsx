import { AdminStats } from '@/components/admin/admin-stats'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { FileText, Plus } from 'lucide-react'

export default function AdminDashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold mb-2">Dashboard</h2>
        <p className="text-muted-foreground">
          Overview of endpoint registry statistics
        </p>
      </div>

      <AdminStats />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Pending Requests</CardTitle>
            <CardDescription>
              Review and approve user submissions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href="/admin/requests">
                <FileText className="mr-2 h-4 w-4" />
                View Requests
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Create Endpoint</CardTitle>
            <CardDescription>
              Add an endpoint directly to the registry
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href="/admin/endpoints/new">
                <Plus className="mr-2 h-4 w-4" />
                New Endpoint
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
