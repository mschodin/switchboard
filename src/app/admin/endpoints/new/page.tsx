import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { EndpointForm } from '@/components/endpoints/endpoint-form'

export default function AdminCreateEndpointPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-2">Create Endpoint</h2>
        <p className="text-muted-foreground">
          Add an endpoint directly to the registry (admin only)
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Endpoint Details</CardTitle>
          <CardDescription>
            This endpoint will be immediately published to the registry
          </CardDescription>
        </CardHeader>
        <CardContent>
          <EndpointForm mode="create" />
        </CardContent>
      </Card>
    </div>
  )
}
