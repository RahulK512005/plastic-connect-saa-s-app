import { NextRequest, NextResponse } from 'next/server'
import { getPaymentIntent, confirmPaymentIntent } from '@/lib/stripe/stripe-service'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { clientSecret, transactionId } = body

    if (!clientSecret || !transactionId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Extract payment intent ID from client secret
    const paymentIntentId = clientSecret.split('_secret_')[0]

    // Get payment intent from Stripe
    const paymentIntent = await getPaymentIntent(paymentIntentId)

    if (paymentIntent.status !== 'succeeded') {
      return NextResponse.json(
        { error: 'Payment not completed' },
        { status: 400 }
      )
    }

    // Update payment status in database
    const { error: updateError } = await supabase
      .from('payments')
      .update({
        status: 'SUCCESS',
      })
      .eq('stripe_payment_intent_id', paymentIntentId)

    if (updateError) {
      console.error('Database update error:', updateError)
      return NextResponse.json(
        { error: 'Failed to update payment status' },
        { status: 500 }
      )
    }

    // Update transaction status
    const { error: txError } = await supabase
      .from('transactions')
      .update({
        status: 'IN_PROGRESS',
      })
      .eq('id', transactionId)

    if (txError) {
      console.error('Transaction update error:', txError)
    }

    // Create logistics record for the shipment
    const { error: logisticsError } = await supabase
      .from('logistics')
      .insert({
        transaction_id: transactionId,
        status: 'PICKUP_SCHEDULED',
      })

    if (logisticsError) {
      console.error('Logistics creation error:', logisticsError)
    }

    return NextResponse.json({
      success: true,
      message: 'Payment confirmed successfully',
      transactionId,
    })
  } catch (error) {
    console.error('Payment confirmation error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    )
  }
}
