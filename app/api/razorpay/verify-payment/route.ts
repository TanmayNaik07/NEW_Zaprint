import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import crypto from 'crypto'
import {
  applyIPRateLimit,
  applyUserRateLimit,
  PAYMENT_LIMIT,
} from '@/lib/security/rate-limit'
import {
  safeParseJSON,
  validateBody,
  validateUUID,
  validateString,
  isValidRazorpayOrderId,
  isValidRazorpayPaymentId,
  isValidRazorpaySignature,
  validationErrorResponse,
} from '@/lib/security/validation'

export async function POST(request: NextRequest) {
  try {
    // SECURITY: Rate limit payment verification by IP
    const ipLimited = applyIPRateLimit(request, PAYMENT_LIMIT)
    if (ipLimited) return ipLimited

    const supabase = await createClient()
    
    // Verify authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // SECURITY: Rate limit per user
    const userLimited = applyUserRateLimit(user.id, PAYMENT_LIMIT)
    if (userLimited) return userLimited

    // SECURITY: Safe JSON parsing
    const parseResult = await safeParseJSON(request)
    if (!parseResult.success) {
      return validationErrorResponse(parseResult.error)
    }

    // SECURITY: Schema-based validation with Razorpay-specific format checks
    const validationResult = validateBody(parseResult.data, {
      razorpay_order_id: (v) => {
        const str = validateString(v, "Razorpay Order ID", { minLength: 10, maxLength: 40 })
        if (!str.success) return str
        if (!isValidRazorpayOrderId(str.data)) {
          return { success: false as const, error: "Invalid Razorpay order ID format" }
        }
        return str
      },
      razorpay_payment_id: (v) => {
        const str = validateString(v, "Razorpay Payment ID", { minLength: 10, maxLength: 40 })
        if (!str.success) return str
        if (!isValidRazorpayPaymentId(str.data)) {
          return { success: false as const, error: "Invalid Razorpay payment ID format" }
        }
        return str
      },
      razorpay_signature: (v) => {
        const str = validateString(v, "Razorpay Signature", { minLength: 64, maxLength: 64 })
        if (!str.success) return str
        if (!isValidRazorpaySignature(str.data)) {
          return { success: false as const, error: "Invalid Razorpay signature format" }
        }
        return str
      },
      order_id: (v) => validateUUID(v, "Order ID"),
    })

    if (!validationResult.success) {
      return validationErrorResponse(validationResult.error)
    }

    const { 
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature, 
      order_id 
    } = validationResult.data

    // Verify the Razorpay signature
    const keySecret = process.env.RAZORPAY_KEY_SECRET
    if (!keySecret) {
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 })
    }

    // SECURITY: Use timing-safe comparison to prevent timing attacks
    const body_data = razorpay_order_id + '|' + razorpay_payment_id
    const expectedSignature = crypto
      .createHmac('sha256', keySecret)
      .update(body_data)
      .digest('hex')

    const sigBuffer = new Uint8Array(Buffer.from(razorpay_signature, 'hex'))
    const expectedBuffer = new Uint8Array(Buffer.from(expectedSignature, 'hex'))
    
    if (sigBuffer.length !== expectedBuffer.length || !crypto.timingSafeEqual(sigBuffer, expectedBuffer)) {
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
    const { data: updatedOrder, error: updateError } = await supabase
      .from('orders')
      .update({
        razorpay_payment_id,
        payment_status: 'paid',
        status: 'paid',
      })
      .eq('id', order_id)
      .eq('user_id', user.id)
      .select('shop_id, total_amount, print_amount, platform_fee, platform_fee_percentage')
      .single()

    if (updateError) {
      console.error('Error updating order after payment:', updateError)
      return NextResponse.json({ error: 'Failed to update order status' }, { status: 500 })
    }

    // Record platform fee in ledger so shop owes us
    if (updatedOrder && updatedOrder.platform_fee > 0) {
      const { error: ledgerError } = await supabase
        .from('platform_fee_ledger')
        .insert({
          shop_id: updatedOrder.shop_id,
          order_id: order_id,
          fee_amount: updatedOrder.platform_fee,
          fee_percentage: updatedOrder.platform_fee_percentage,
          order_total: updatedOrder.total_amount,
          print_amount: updatedOrder.print_amount,
          status: 'unpaid',
        })

      if (ledgerError) {
        // Log but don't fail the payment — fee can be reconciled later
        console.error('Error recording platform fee in ledger:', ledgerError)
      }
    }

    return NextResponse.json({ 
      success: true,
      message: 'Payment verified successfully',
      order_id,
    })

  } catch (error: any) {
    console.error('Error verifying payment:', error)
    // SECURITY: Don't expose internal error details
    return NextResponse.json(
      { error: 'Payment verification failed' },
      { status: 500 }
    )
  }
}
