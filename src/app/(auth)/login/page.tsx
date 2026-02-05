import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { LoginForm } from '@/components/auth/login-form'
import Link from 'next/link'

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Log In</CardTitle>
          <CardDescription>
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <LoginForm />
          <p className="text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{' '}
            <Link
              href="/register"
              className="font-medium text-[#23C9FF] hover:underline transition-colors duration-200"
            >
              Sign up
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
