// Dynamic platform fee calculator for Zaprint
// Fee decreases as order total increases to encourage larger orders

export interface PlatformFeeResult {
  printAmount: number
  platformFeePercentage: number
  platformFeeAmount: number
  totalAmount: number
}

/**
 * Calculate the platform fee based on the print amount.
 * Dynamic fee structure:
 *   ₹0 - ₹50:   10%
 *   ₹51 - ₹200:  8%
 *   ₹201 - ₹500:  6%
 *   ₹500+:        5%
 */
export function calculatePlatformFee(printAmount: number): PlatformFeeResult {
  if (printAmount <= 0) {
    return {
      printAmount: 0,
      platformFeePercentage: 0,
      platformFeeAmount: 0,
      totalAmount: 0,
    }
  }

  let feePercentage: number

  if (printAmount <= 50) {
    feePercentage = 10
  } else if (printAmount <= 200) {
    feePercentage = 8
  } else if (printAmount <= 500) {
    feePercentage = 6
  } else {
    feePercentage = 5
  }

  const feeAmount = Math.round((printAmount * feePercentage) / 100 * 100) / 100
  const totalAmount = Math.round((printAmount + feeAmount) * 100) / 100

  return {
    printAmount,
    platformFeePercentage: feePercentage,
    platformFeeAmount: feeAmount,
    totalAmount,
  }
}

/**
 * Format fee for display
 */
export function formatPlatformFeeLabel(percentage: number): string {
  return `Zaprint Service Fee (${percentage}%)`
}

/**
 * Convert amount to paise for Razorpay (Razorpay accepts amounts in smallest currency unit)
 */
export function toPaise(amount: number): number {
  return Math.round(amount * 100)
}

/**
 * Convert paise to rupees
 */
export function toRupees(paise: number): number {
  return paise / 100
}
