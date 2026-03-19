import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import crypto from 'crypto'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Verify authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { 
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature, 
      order_id 
    } = body

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !order_id) {
      return NextResponse.json({ error: 'Missing payment verification data' }, { status: 400 })
    }

    // Verify the Razorpay signature
    const keySecret = process.env.RAZORPAY_KEY_SECRET
    if (!keySecret) {
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 })
    }

    const body_data = razorpay_order_id + '|' + razorpay_payment_id
    const expectedSignature = crypto
      .createHmac('sha256', keySecret)
      .update(body_data)
      .digest('hex')

    if (expectedSignature !== razorpay_signature) {
      console.error('Payment signature verification failed')
      
      // Update order payment status to failed
      await supabase
        .from('orders')
        .update({
          payment_status: 'failed',
        })
        .eq('id', order_id)
        .eq('user_id', user.id)

      return NextResponse.json({ error: 'Payment verification failed' }, { status: 400 })
    }

    // Signature is valid - update order status to paid
    const { error: updateError } = await supabase
      .from('orders')
      .update({
        razorpay_payment_id,
        payment_status: 'paid',
        status: 'paid',
      })
      .eq('id', order_id)
      .eq('user_id', user.id)

    if (updateError) {
      console.error('Error updating order after payment:', updateError)
      return NextResponse.json({ error: 'Failed to update order status' }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true,
      message: 'Payment verified successfully',
      order_id,
    })

  } catch (error: any) {
    console.error('Error verifying payment:', error)
    return NextResponse.json(
      { error: error.message || 'Payment verification failed' },
      { status: 500 }
    )
  }
}
