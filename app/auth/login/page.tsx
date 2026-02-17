'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { AlertCircle, Leaf } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { useAuth } from '@/hooks/use-auth'

export default function LoginPage() {
  const router = useRouter()
  const { signIn } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    const result = signIn(email, password)

    if (!result.success) {
      setError(result.error || 'Login failed')
      setLoading(false)
      return
    }

    router.push('/dashboard')
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="mb-8 text-center">
          <Link href="/" className="inline-flex items-center gap-2 mb-4">
            <div className="p-2 rounded-lg bg-green-100">
              <Leaf className="w-6 h-6 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900">PlasticConnect</h1>
          </Link>
          <p className="text-slate-600">Welcome back</p>
        </div>

        <Card className="p-6 shadow-xl border border-slate-200/60 bg-white">
          <h2 className="text-xl font-semibold text-slate-900 mb-6">Sign In</h2>

          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-700 font-medium">Email</Label>
              <Input id="email" name="email" type="email" placeholder="you@example.com" required disabled={loading} className="h-10" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-slate-700 font-medium">Password</Label>
              <Input id="password" name="password" type="password" placeholder="Your password" required disabled={loading} className="h-10" />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-10 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-all"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          <p className="text-center text-sm text-slate-600 mt-6">
            {"Don't have an account? "}
            <Link href="/auth/signup" className="text-green-600 hover:text-green-700 font-medium">
              Sign up
            </Link>
          </p>
        </Card>

        {/* Demo Credentials */}
        <div className="mt-8 p-4 bg-white rounded-lg border border-slate-200 shadow-sm">
          <p className="text-xs font-medium text-slate-700 mb-3">Demo Credentials:</p>
          <div className="space-y-1.5 text-xs text-slate-600">
            <p><strong className="text-slate-800">Collector:</strong> collector@demo.com</p>
            <p><strong className="text-slate-800">Brand:</strong> brand@demo.com</p>
            <p><strong className="text-slate-800">Password:</strong> demo123456</p>
          </div>
        </div>
      </div>
    </div>
  )
}
