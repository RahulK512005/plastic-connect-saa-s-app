import { NextRequest, NextResponse } from 'next/server'
import { getPricingRecommendation } from '@/lib/ai-pricing/pricing-service'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      materialType,
      weight,
      purityScore,
      grade,
      location,
    } = body

    if (!materialType || !grade || !location) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const recommendation = await getPricingRecommendation({
      materialType,
      weight,
      purityScore,
      grade,
      location,
    })

    return NextResponse.json(recommendation)
  } catch (error) {
    console.error('Pricing recommendation error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    )
  }
}
