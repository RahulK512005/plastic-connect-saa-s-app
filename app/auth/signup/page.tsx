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

export default function SignUpPage() {
  const router = useRouter()
  const { signUp } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [role, setRole] = useState<'COLLECTOR' | 'BRAND'>('COLLECTOR')

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    const name = formData.get('name') as string
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const confirmPassword = formData.get('confirmPassword') as string

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      setLoading(false)
      return
    }

    const result = signUp({ name, email, password, role })

    if (!result.success) {
      setError(result.error || 'Signup failed')
      setLoading(false)
      return
    }

    // Auto-login and redirect to dashboard immediately
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
          <p className="text-slate-600">Join the sustainable plastic marketplace</p>
        </div>

        <Card className="p-6 shadow-xl border border-slate-200/60 bg-white">
          <h2 className="text-xl font-semibold text-slate-900 mb-6">Create Account</h2>

          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Role Selection */}
            <div className="mb-6">
              <Label className="block text-sm font-medium text-slate-700 mb-3">I am a</Label>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setRole('COLLECTOR')}
                  className={`flex-1 py-3 px-4 rounded-lg border-2 transition-all ${
                    role === 'COLLECTOR'
                      ? 'border-green-500 bg-green-50 text-green-900 font-medium'
                      : 'border-slate-200 bg-white text-slate-600 hover:border-green-200'
                  }`}
                >
                  Collector
                </button>
                <button
                  type="button"
                  onClick={() => setRole('BRAND')}
                  className={`flex-1 py-3 px-4 rounded-lg border-2 transition-all ${
                    role === 'BRAND'
                      ? 'border-green-500 bg-green-50 text-green-900 font-medium'
                      : 'border-slate-200 bg-white text-slate-600 hover:border-green-200'
                  }`}
                >
                  Brand / Recycler
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name" className="text-slate-700 font-medium">Full Name</Label>
              <Input id="name" name="name" type="text" placeholder="Your full name" required disabled={loading} className="h-10" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-700 font-medium">Email</Label>
              <Input id="email" name="email" type="email" placeholder="you@example.com" required disabled={loading} className="h-10" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-slate-700 font-medium">Password</Label>
              <Input id="password" name="password" type="password" placeholder="Min 6 characters" required disabled={loading} className="h-10" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-slate-700 font-medium">Confirm Password</Label>
              <Input id="confirmPassword" name="confirmPassword" type="password" placeholder="Confirm password" required disabled={loading} className="h-10" />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-10 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-all"
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </Button>
          </form>

          <p className="text-center text-sm text-slate-600 mt-6">
            Already have an account?{' '}
            <Link href="/auth/login" className="text-green-600 hover:text-green-700 font-medium">
              Sign in
            </Link>
          </p>
        </Card>

        <p className="text-center text-xs text-slate-500 mt-8">
          By signing up, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  )
}
