'use client'

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { AlertCircle, Check, DollarSign } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import PaymentForm from '@/components/payment/payment-form'

export default function CheckoutPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [paymentComplete, setPaymentComplete] = useState(false)
  const [clientSecret, setClientSecret] = useState<string | null>(null)

  const transactionId = searchParams.get('transaction_id')
  const amount = searchParams.get('amount')
  const paymentType = searchParams.get('type') || 'ADVANCE'

  useEffect(() => {
    if (!transactionId || !amount) {
      router.push('/transactions')
      return
    }

    // Initialize payment
    const initializePayment = async () => {
      setLoading(true)
      try {
        const response = await fetch('/api/payments/intent', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            amount: parseFloat(amount),
            transactionId,
            paymentType,
          }),
        })

        if (!response.ok) {
          throw new Error('Failed to initialize payment')
        }

        const data = await response.json()
        setClientSecret(data.clientSecret)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    initializePayment()
  }, [transactionId, amount, paymentType, router])

  if (paymentComplete) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card className="p-12 text-center border border-slate-200">
          <div className="flex justify-center mb-6">
            <div className="p-4 rounded-full bg-green-100">
              <Check className="w-12 h-12 text-green-600" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-4">Payment Successful!</h1>
          <p className="text-slate-600 mb-8">
            Your payment has been processed successfully. Your transaction is now in progress.
          </p>
          <Button
            className="bg-green-600 hover:bg-green-700 text-white"
            onClick={() => router.push('/transactions')}
          >
            View Transactions
          </Button>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Payment Checkout</h1>
        <p className="text-slate-600 mt-2">
          {paymentType === 'ADVANCE' ? '50% Advance Payment' : 'Final Payment'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Payment Form */}
        <div className="lg:col-span-2">
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {clientSecret ? (
            <PaymentForm
              clientSecret={clientSecret}
              transactionId={transactionId!}
              onSuccess={() => setPaymentComplete(true)}
            />
          ) : (
            <Card className="p-8 flex items-center justify-center border border-slate-200">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
            </Card>
          )}
        </div>

        {/* Order Summary */}
        <div>
          <Card className="p-6 border border-slate-200 sticky top-24">
            <h2 className="text-lg font-semibold text-slate-900 mb-6">Order Summary</h2>

            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-slate-600">Amount</span>
                <span className="font-medium text-slate-900">${amount}</span>
              </div>

              {paymentType === 'ADVANCE' && (
                <>
                  <div className="flex justify-between p-3 bg-blue-50 rounded-lg">
                    <span className="text-sm text-blue-900">Advance Payment (50%)</span>
                    <span className="font-semibold text-blue-900">${(parseFloat(amount) * 0.5).toFixed(2)}</span>
                  </div>
                  <p className="text-xs text-slate-500">
                    Final payment of ${(parseFloat(amount) * 0.5).toFixed(2)} will be due upon delivery
                  </p>
                </>
              )}

              <div className="border-t border-slate-200 pt-4">
                <div className="flex justify-between">
                  <span className="font-medium text-slate-900">Total</span>
                  <span className="text-2xl font-bold text-green-600">
                    ${paymentType === 'ADVANCE' ? (parseFloat(amount) * 0.5).toFixed(2) : amount}
                  </span>
                </div>
              </div>

              <div className="space-y-2 pt-4 border-t border-slate-200">
                <div className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-green-600 flex-shrink-0 mt-1" />
                  <span className="text-sm text-slate-700">Secure payment with Stripe</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-green-600 flex-shrink-0 mt-1" />
                  <span className="text-sm text-slate-700">256-bit encryption</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-green-600 flex-shrink-0 mt-1" />
                  <span className="text-sm text-slate-700">Buyer protection included</span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
