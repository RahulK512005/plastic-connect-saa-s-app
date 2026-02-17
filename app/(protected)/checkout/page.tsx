'use client'

import { useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Check, Shield, CreditCard } from 'lucide-react'
import { formatINR } from '@/lib/mock-db'

export default function CheckoutPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [processing, setProcessing] = useState(false)
  const [paymentComplete, setPaymentComplete] = useState(false)

  const amount = parseFloat(searchParams.get('amount') || '0')
  const paymentType = searchParams.get('type') || 'ADVANCE'

  const handlePay = () => {
    setProcessing(true)
    setTimeout(() => {
      setProcessing(false)
      setPaymentComplete(true)
    }, 2000)
  }

  if (paymentComplete) {
    return (
      <div className="max-w-lg mx-auto">
        <Card className="p-12 text-center border border-slate-200 bg-white">
          <div className="flex justify-center mb-6">
            <div className="p-4 rounded-full bg-green-100">
              <Check className="w-12 h-12 text-green-600" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-4">Payment Successful!</h1>
          <p className="text-slate-600 mb-8">
            Your payment of {formatINR(amount)} has been processed successfully.
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
    <div className="max-w-lg mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Payment Checkout</h1>
        <p className="text-slate-600 mt-2">
          {paymentType === 'ADVANCE' ? '50% Advance Payment' : 'Final Payment'}
        </p>
      </div>

      <Card className="p-6 border border-slate-200 bg-white">
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <span className="text-slate-600">Amount</span>
            <span className="text-2xl font-bold text-green-600">{formatINR(amount)}</span>
          </div>

          <div className="space-y-2 pt-4 border-t border-slate-100">
            {['Secure payment processing', '256-bit encryption', 'Buyer protection included'].map((item) => (
              <div key={item} className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-green-600 flex-shrink-0" />
                <span className="text-sm text-slate-700">{item}</span>
              </div>
            ))}
          </div>

          <Button
            onClick={handlePay}
            disabled={processing}
            className="w-full h-11 bg-green-600 hover:bg-green-700 text-white font-medium"
          >
            {processing ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                Processing...
              </>
            ) : (
              <>
                <CreditCard className="w-4 h-4 mr-2" />
                Pay {formatINR(amount)}
              </>
            )}
          </Button>
        </div>
      </Card>
    </div>
  )
}
