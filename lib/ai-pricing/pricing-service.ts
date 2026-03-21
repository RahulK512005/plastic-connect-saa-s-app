import { createClient } from '@/lib/supabase/server'

interface PricingInput {
  materialType: string
  weight: number
  purityScore?: number
  grade: string
  location: string
}

interface PricingRecommendation {
  recommendedPrice: number
  minPrice: number
  maxPrice: number
  confidenceScore: number
  marketTrend: 'UP' | 'DOWN' | 'STABLE'
  reasoning: string
}

// Base prices for different material types (USD per kg)
const basePrices: Record<string, number> = {
  PET: 0.45,
  HDPE: 0.5,
  PVC: 0.35,
  LDPE: 0.4,
  PP: 0.48,
  PS: 0.38,
  OTHER: 0.3,
}

// Grade multipliers
const gradeMultipliers: Record<string, number> = {
  A: 1.3, // Premium - higher purity
  B: 1.0, // Standard
  C: 0.7, // Lower quality
}

// Location demand multipliers
const locationMultipliers: Record<string, number> = {
  'NEW_YORK': 1.15,
  'CALIFORNIA': 1.1,
  'TEXAS': 1.0,
  'FLORIDA': 1.05,
  'ILLINOIS': 1.0,
  DEFAULT: 1.0,
}

export async function getMarketTrend(materialType: string): Promise<'UP' | 'DOWN' | 'STABLE'> {
  try {
    const supabase = await createClient()

    // Get recent price history
    const { data } = await supabase
      .from('price_history')
      .select('price_per_kg, created_at')
      .eq('material_type', materialType)
      .order('created_at', { ascending: false })
      .limit(10)

    if (!data || data.length < 2) {
      return 'STABLE'
    }

    const recentPrice = data[0].price_per_kg
    const oldPrice = data[data.length - 1].price_per_kg

    const percentChange = ((recentPrice - oldPrice) / oldPrice) * 100

    if (percentChange > 3) return 'UP'
    if (percentChange < -3) return 'DOWN'
    return 'STABLE'
  } catch (error) {
    console.error('Error getting market trend:', error)
    return 'STABLE'
  }
}

export async function getAveragePriceForMaterial(materialType: string): Promise<number> {
  try {
    const supabase = await createClient()

    const { data } = await supabase
      .from('price_history')
      .select('price_per_kg')
      .eq('material_type', materialType)
      .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())

    if (!data || data.length === 0) {
      return basePrices[materialType] || basePrices.OTHER
    }

    const average = data.reduce((sum, item) => sum + item.price_per_kg, 0) / data.length
    return average
  } catch (error) {
    console.error('Error getting average price:', error)
    return basePrices[materialType] || basePrices.OTHER
  }
}

export async function getPricingRecommendation(
  input: PricingInput
): Promise<PricingRecommendation> {
  try {
    // Get base price for material type
    const basePrice = basePrices[input.materialType] || basePrices.OTHER

    // Get average market price
    const avgMarketPrice = await getAveragePriceForMaterial(input.materialType)

    // Get market trend
    const marketTrend = await getMarketTrend(input.materialType)

    // Calculate adjustments
    let adjustedPrice = avgMarketPrice || basePrice

    // Grade adjustment
    const gradeMultiplier = gradeMultipliers[input.grade] || gradeMultipliers.B
    adjustedPrice *= gradeMultiplier

    // Purity adjustment (if provided)
    if (input.purityScore) {
      const purityAdjustment = (input.purityScore - 85) * 0.005 // 0.5% per point above 85%
      adjustedPrice *= 1 + purityAdjustment
    }

    // Location adjustment
    const locationKey = input.location.toUpperCase().split(',')[0].trim()
    const locationMultiplier = locationMultipliers[locationKey] || locationMultipliers.DEFAULT
    adjustedPrice *= locationMultiplier

    // Market trend adjustment
    if (marketTrend === 'UP') {
      adjustedPrice *= 1.05 // 5% premium
    } else if (marketTrend === 'DOWN') {
      adjustedPrice *= 0.95 // 5% discount
    }

    // Calculate confidence score based on data availability
    let confidenceScore = 70
    if (input.purityScore) confidenceScore += 10
    if (marketTrend !== 'STABLE') confidenceScore += 10
    if (input.grade === 'A') confidenceScore += 5

    // Calculate price range (±15%)
    const minPrice = adjustedPrice * 0.85
    const maxPrice = adjustedPrice * 1.15

    // Generate reasoning
    const reasoning = generateReasoningText(
      input.materialType,
      input.grade,
      marketTrend,
      locationKey
    )

    return {
      recommendedPrice: Math.round(adjustedPrice * 100) / 100,
      minPrice: Math.round(minPrice * 100) / 100,
      maxPrice: Math.round(maxPrice * 100) / 100,
      confidenceScore: Math.min(confidenceScore, 100),
      marketTrend,
      reasoning,
    }
  } catch (error) {
    console.error('Error calculating pricing recommendation:', error)

    // Return safe defaults on error
    const basePrice = basePrices[input.materialType] || basePrices.OTHER
    const adjustedPrice = basePrice * gradeMultipliers[input.grade]

    return {
      recommendedPrice: adjustedPrice,
      minPrice: adjustedPrice * 0.85,
      maxPrice: adjustedPrice * 1.15,
      confidenceScore: 50,
      marketTrend: 'STABLE',
      reasoning: `Based on historical data for ${input.materialType} (Grade ${input.grade})`,
    }
  }
}

function generateReasoningText(
  materialType: string,
  grade: string,
  trend: string,
  location: string
): string {
  const trendText =
    trend === 'UP'
      ? 'market demand is increasing'
      : trend === 'DOWN'
        ? 'market demand is decreasing'
        : 'market is stable'

  return `Recommended price for ${materialType} Grade ${grade} based on ${trendText}. Location (${location}) and purity adjustments applied.`
}

export async function recordPrice(
  materialType: string,
  pricePerKg: number,
  grade?: string,
  location?: string
): Promise<void> {
  try {
    const supabase = await createClient()

    // Determine market trend based on recent transactions
    const marketTrend = await getMarketTrend(materialType)

    await supabase.from('price_history').insert({
      material_type: materialType,
      price_per_kg: pricePerKg,
      grade,
      location,
      market_trend: marketTrend,
    })
  } catch (error) {
    console.error('Error recording price:', error)
  }
}
