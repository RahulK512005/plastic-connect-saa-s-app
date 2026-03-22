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
import { signUp } from '@/app/actions/auth'

export default function SignUpPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [role, setRole] = useState<'COLLECTOR' | 'BRAND'>('COLLECTOR')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
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

    const result = await signUp(email, password, name, role)

    if (result.error) {
      setError(result.error)
      setLoading(false)
      return
    }

    // Redirect directly to dashboard after successful signup
    router.push('/dashboard')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="p-2 rounded-lg bg-green-100">
              <Leaf className="w-6 h-6 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900">PlasticConnect</h1>
          </div>
          <p className="text-slate-600">Join the sustainable plastic marketplace</p>
        </div>

        <Card className="p-6 shadow-xl border border-slate-200/60">
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
                  Brand
                </button>
              </div>
            </div>

            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-slate-700 font-medium">
                Full Name
              </Label>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="John Doe"
                required
                disabled={loading}
                className="h-10"
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-700 font-medium">
                Email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                required
                disabled={loading}
                className="h-10"
              />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-slate-700 font-medium">
                Password
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                required
                disabled={loading}
                className="h-10"
              />
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-slate-700 font-medium">
                Confirm Password
              </Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="••••••••"
                required
                disabled={loading}
                className="h-10"
              />
            </div>

            {/* Submit Button */}
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

        {/* Footer */}
        <p className="text-center text-xs text-slate-500 mt-8">
          By signing up, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  )
}
