'use client'

import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import { TrendingUp, TrendingDown, Zap, AlertCircle } from 'lucide-react'

interface PricingData {
  recommendedPrice: number
  minPrice: number
  maxPrice: number
  confidenceScore: number
  marketTrend: 'UP' | 'DOWN' | 'STABLE'
  reasoning: string
}

interface PricingRecommendationProps {
  materialType: string
  weight: number
  purityScore?: number
  grade: string
  location: string
}

export default function PricingRecommendation({
  materialType,
  weight,
  purityScore,
  grade,
  location,
}: PricingRecommendationProps) {
  const [pricing, setPricing] = useState<PricingData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPricing = async () => {
      try {
        const response = await fetch('/api/pricing/recommend', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            materialType,
            weight,
            purityScore,
            grade,
            location,
          }),
        })

        if (response.ok) {
          const data = await response.json()
          setPricing(data)
        }
      } catch (error) {
        console.error('Error fetching pricing:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchPricing()
  }, [materialType, weight, purityScore, grade, location])

  if (loading) {
    return (
      <Card className="p-4 border border-slate-200">
        <div className="animate-pulse space-y-3">
          <div className="h-4 bg-slate-200 rounded w-2/3" />
          <div className="h-8 bg-slate-200 rounded w-1/2" />
        </div>
      </Card>
    )
  }

  if (!pricing) {
    return null
  }

  const TrendIcon =
    pricing.marketTrend === 'UP'
      ? TrendingUp
      : pricing.marketTrend === 'DOWN'
        ? TrendingDown
        : null

  return (
    <Card className="p-6 border border-slate-200 bg-gradient-to-br from-slate-50 to-white">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">AI Price Recommendation</h3>
            <p className="text-sm text-slate-600 mt-1">Smart pricing powered by market analysis</p>
          </div>
          <div className="flex items-center gap-1 px-3 py-1 bg-green-100 rounded-full">
            <Zap className="w-4 h-4 text-green-600" />
            <span className="text-sm font-semibold text-green-700">{pricing.confidenceScore}%</span>
          </div>
        </div>

        {/* Recommended Price */}
        <div className="bg-white p-4 rounded-lg border border-green-200">
          <p className="text-sm text-slate-600">Recommended Price</p>
          <p className="text-3xl font-bold text-green-600 mt-2">
            ${pricing.recommendedPrice.toFixed(2)}/kg
          </p>
          <p className="text-sm text-slate-600 mt-2">
            Range: ${pricing.minPrice.toFixed(2)} - ${pricing.maxPrice.toFixed(2)}
          </p>
        </div>

        {/* Market Trend */}
        {TrendIcon && (
          <div
            className={`p-4 rounded-lg flex items-center gap-3 ${
              pricing.marketTrend === 'UP'
                ? 'bg-green-50 border border-green-200'
                : pricing.marketTrend === 'DOWN'
                  ? 'bg-red-50 border border-red-200'
                  : 'bg-blue-50 border border-blue-200'
            }`}
          >
            <TrendIcon
              className={`w-5 h-5 ${
                pricing.marketTrend === 'UP'
                  ? 'text-green-600'
                  : pricing.marketTrend === 'DOWN'
                    ? 'text-red-600'
                    : 'text-blue-600'
              }`}
            />
            <div>
              <p className="font-semibold text-sm">Market Trend: {pricing.marketTrend}</p>
              <p className="text-xs text-slate-600">{pricing.reasoning}</p>
            </div>
          </div>
        )}

        {/* Info Box */}
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg flex gap-2">
          <AlertCircle className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-blue-900">
            This recommendation is based on market analysis and historical data. Actual prices may vary based on buyer interest and market conditions.
          </p>
        </div>
      </div>
    </Card>
  )
}
