'use client'

import { AuthGuard } from '@/components/auth/auth-guard'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { EndpointForm } from '@/components/endpoints/endpoint-form'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function SubmitPage() {
  return (
    <AuthGuard>
      <div className="min-h-screen bg-muted/50">
        <div className="container max-w-3xl py-8 px-4">
          <Button asChild variant="ghost" className="mb-6">
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Registry
            </Link>
          </Button>

          <Card>
            <CardHeader>
              <CardTitle>Submit New Endpoint</CardTitle>
              <CardDescription>
                Submit an API endpoint for review by administrators
              </CardDescription>
            </CardHeader>
            <CardContent>
              <EndpointForm mode="submit" />
            </CardContent>
          </Card>
        </div>
      </div>
    </AuthGuard>
  )
}
