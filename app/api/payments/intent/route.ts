import { NextRequest, NextResponse } from 'next/server'
import { createPaymentIntent } from '@/lib/stripe/stripe-service'
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
    const { amount, transactionId, paymentType } = body

    if (!amount || !transactionId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Create payment intent
    const { clientSecret, paymentIntentId } = await createPaymentIntent(amount, {
      transactionId,
      paymentType,
      userId: user.id,
    })

    // Create payment record in database
    const { error: dbError } = await supabase
      .from('payments')
      .insert({
        transaction_id: transactionId,
        payer_id: user.id,
        amount,
        payment_type: paymentType,
        status: 'PENDING',
        stripe_payment_intent_id: paymentIntentId,
      })

    if (dbError) {
      console.error('Database error:', dbError)
      return NextResponse.json(
        { error: 'Failed to create payment record' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      clientSecret,
      paymentIntentId,
    })
  } catch (error) {
    console.error('Payment intent error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    )
  }
}
