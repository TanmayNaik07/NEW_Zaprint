import { NextRequest, NextResponse } from 'next/server'
import { getRazorpayInstance } from '@/lib/razorpay'
import { createClient } from '@/lib/supabase/server'
import { calculatePlatformFee, toPaise } from '@/lib/platform-fee'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Verify authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { orderId } = body

    if (!orderId) {
      return NextResponse.json({ error: 'Order ID is required' }, { status: 400 })
    }

    // Fetch the order and verify ownership
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .eq('user_id', user.id)
      .single()

    if (orderError || !order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    // Don't create a new Razorpay order if already paid
    if (order.payment_status === 'paid') {
      return NextResponse.json({ error: 'Order already paid' }, { status: 400 })
    }

    // If a Razorpay order already exists and is not expired, return it
    if (order.razorpay_order_id) {
      try {
        const razorpay = getRazorpayInstance()
        const existingOrder = await razorpay.orders.fetch(order.razorpay_order_id)
        if (existingOrder.status === 'created') {
          return NextResponse.json({
            orderId: existingOrder.id,
            amount: existingOrder.amount,
            currency: existingOrder.currency,
            key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
          })
        }
      } catch {
        // If fetching existing order fails, create a new one
      }
    }

    // Calculate amounts
    const printAmount = order.print_amount || order.total_amount
    const feeResult = calculatePlatformFee(printAmount)
    const totalAmountPaise = toPaise(feeResult.totalAmount)

    // Create Razorpay order
    const razorpay = getRazorpayInstance()
    const razorpayOrder = await razorpay.orders.create({
      amount: totalAmountPaise,
      currency: 'INR',
      receipt: `order_${orderId.slice(0, 8)}`,
      notes: {
        order_id: orderId,
        user_id: user.id,
        print_amount: printAmount.toString(),
        platform_fee: feeResult.platformFeeAmount.toString(),
        platform_fee_percentage: feeResult.platformFeePercentage.toString(),
      },
    })

    // Update order with Razorpay order ID and fee details
    await supabase
      .from('orders')
      .update({
        razorpay_order_id: razorpayOrder.id,
        print_amount: printAmount,
        platform_fee: feeResult.platformFeeAmount,
        platform_fee_percentage: feeResult.platformFeePercentage,
        total_amount: feeResult.totalAmount,
        payment_status: 'pending',
      })
      .eq('id', orderId)

    return NextResponse.json({
      orderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
    })

  } catch (error: any) {
    console.error('Error creating Razorpay order:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create payment order' },
      { status: 500 }
    )
  }
}
