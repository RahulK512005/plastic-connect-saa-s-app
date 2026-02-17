'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { CheckCircle2 } from 'lucide-react'

export default function SignUpSuccessPage() {
  const router = useRouter()

  useEffect(() => {
    // Auto-redirect to dashboard after 2 seconds
    const timer = setTimeout(() => {
      router.push('/dashboard')
    }, 2000)

    return () => clearTimeout(timer)
  }, [router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="p-8 shadow-xl border border-slate-200/60 text-center">
          {/* Success Icon */}
          <div className="flex justify-center mb-6">
            <div className="p-4 rounded-full bg-green-100">
              <CheckCircle2 className="w-12 h-12 text-green-600" />
            </div>
          </div>

          <h1 className="text-2xl font-bold text-slate-900 mb-3">Welcome to PlasticConnect!</h1>

          <p className="text-slate-600 mb-6">
            Your account has been successfully created. You're now ready to access the marketplace.
          </p>

          <div className="p-4 bg-green-50 rounded-lg border border-green-200 mb-6">
            <p className="text-sm text-green-900">
              Redirecting you to your dashboard...
            </p>
          </div>

          <p className="text-center text-xs text-slate-500">
            If you're not redirected automatically, please wait or refresh the page.
          </p>
        </Card>
      </div>
    </div>
  )
}
