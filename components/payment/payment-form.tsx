'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { AlertCircle, Lock } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'

interface PaymentFormProps {
  clientSecret: string
  transactionId: string
  onSuccess: () => void
}

export default function PaymentForm({ clientSecret, transactionId, onSuccess }: PaymentFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    expiryDate: '',
    cvc: '',
    name: '',
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    if (name === 'cardNumber') {
      // Format card number with spaces
      const formatted = value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim()
      setCardDetails({ ...cardDetails, [name]: formatted })
    } else if (name === 'expiryDate') {
      // Format expiry date MM/YY
      const formatted = value
        .replace(/\D/g, '')
        .replace(/(\d{2})(\d)/, '$1/$2')
        .slice(0, 5)
      setCardDetails({ ...cardDetails, [name]: formatted })
    } else if (name === 'cvc') {
      // Only allow 3-4 digits
      setCardDetails({ ...cardDetails, [name]: value.replace(/\D/g, '').slice(0, 4) })
    } else {
      setCardDetails({ ...cardDetails, [name]: value })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/payments/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientSecret,
          transactionId,
          cardDetails,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Payment failed')
      }

      onSuccess()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Payment failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="p-8 border border-slate-200">
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Cardholder Name */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-900">Cardholder Name</label>
          <input
            type="text"
            name="name"
            value={cardDetails.name}
            onChange={handleInputChange}
            placeholder="John Doe"
            required
            disabled={loading}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent disabled:bg-slate-50"
          />
        </div>

        {/* Card Number */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-900">Card Number</label>
          <input
            type="text"
            name="cardNumber"
            value={cardDetails.cardNumber}
            onChange={handleInputChange}
            placeholder="4242 4242 4242 4242"
            maxLength={19}
            required
            disabled={loading}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent disabled:bg-slate-50 font-mono"
          />
          <p className="text-xs text-slate-500">Test: 4242 4242 4242 4242</p>
        </div>

        {/* Expiry & CVC */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-900">Expiry Date</label>
            <input
              type="text"
              name="expiryDate"
              value={cardDetails.expiryDate}
              onChange={handleInputChange}
              placeholder="MM/YY"
              maxLength={5}
              required
              disabled={loading}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent disabled:bg-slate-50"
            />
            <p className="text-xs text-slate-500">Test: 12/25</p>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-900">CVC</label>
            <input
              type="text"
              name="cvc"
              value={cardDetails.cvc}
              onChange={handleInputChange}
              placeholder="123"
              maxLength={4}
              required
              disabled={loading}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent disabled:bg-slate-50"
            />
            <p className="text-xs text-slate-500">Test: 123</p>
          </div>
        </div>

        {/* Security Info */}
        <div className="p-3 bg-blue-50 rounded-lg flex items-start gap-2">
          <Lock className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-blue-900">
            Your payment information is secure and encrypted. PlasticConnect never stores full card details.
          </p>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={loading || !cardDetails.name || !cardDetails.cardNumber || !cardDetails.expiryDate || !cardDetails.cvc}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg h-12 transition-all"
        >
          {loading ? (
            <div className="flex items-center gap-2 justify-center">
              <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
              Processing Payment...
            </div>
          ) : (
            'Complete Payment'
          )}
        </Button>

        <p className="text-center text-xs text-slate-500">
          By completing this payment, you agree to our Terms of Service
        </p>
      </form>
    </Card>
  )
}
