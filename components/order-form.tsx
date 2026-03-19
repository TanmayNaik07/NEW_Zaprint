"use client"

import { useState, useCallback, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Loader2, IndianRupee, Plus, Trash2, Upload, FileText, X, CheckCircle, ShieldCheck, Info } from "lucide-react"
import { toast } from "sonner"
import type { ShopWithDetails } from "@/lib/types/shop"
import { isShopCurrentlyOpen } from "@/lib/types/shop"
import { usePrintStore } from "@/lib/print-store"
import { getPDFPageCount, isPDF } from "@/lib/utils/pdf"
import { motion, AnimatePresence } from "framer-motion"
import { track } from "@vercel/analytics"
import { calculatePlatformFee, type PlatformFeeResult } from "@/lib/platform-fee"

// Load Razorpay Script
function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true)
      return
    }
    const script = document.createElement("script")
    script.src = "https://checkout.razorpay.com/v1/checkout.js"
    script.onload = () => resolve(true)
    script.onerror = () => resolve(false)
    document.body.appendChild(script)
  })
}

export function OrderForm({ shop }: { shop: ShopWithDetails }) {
  const router = useRouter()
  const supabase = createClient()
  const { sections, addSection, removeSection, updateSection, calculateSubtotal, calculateGrandTotal, reset } = usePrintStore()

  const [loading, setLoading] = useState(false)
  const [paymentLoading, setPaymentLoading] = useState(false)
  const [isShopOpen, setIsShopOpen] = useState(false)
  const [createdOrderId, setCreatedOrderId] = useState<string | null>(null)

  // Initialize isShopOpen
  useEffect(() => {
    setIsShopOpen(isShopCurrentlyOpen(shop))

    const shopChannel = supabase
      .channel(`shop-status-${shop.id}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'shops',
          filter: `id=eq.${shop.id}`
        },
        (payload) => {
          const updatedShop = { ...shop, ...payload.new }
          const open = isShopCurrentlyOpen(updatedShop)
          setIsShopOpen(open)
          if (!open) {
            toast.error("Shop is closed. You cannot send files.")
          }
        }
      )
      .subscribe((status, err) => {
        if (err) console.error("Realtime subscription error for shop:", err)
      })

    return () => {
      supabase.removeChannel(shopChannel)
    }
  }, [shop.id, shop, supabase])


  // Get pricing rates from shop services
  const bwService = shop.services.find(s => s.service_name.toLowerCase().includes('black') || s.service_name.toLowerCase().includes('b&w') || s.service_name.toLowerCase().includes('bw'))
  const colorService = shop.services.find(s => s.service_name.toLowerCase().includes('color'))

  const bwRate = bwService?.price || 2
  const colorRate = colorService?.price || 5

  const handleFileSelect = useCallback(async (sectionId: string, file: File | null) => {
    if (!file) {
      updateSection(sectionId, { file: null, fileName: "", fileSize: 0, pageCount: 1 })
      return
    }

    let pageCount = 1
    if (isPDF(file)) {
      pageCount = await getPDFPageCount(file)
    }

    updateSection(sectionId, {
      file,
      fileName: file.name,
      fileSize: file.size,
      pageCount,
    })
  }, [updateSection])

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  // Calculate print total and platform fee
  const printTotal = calculateGrandTotal(bwRate, colorRate)
  const feeResult: PlatformFeeResult = calculatePlatformFee(printTotal)

  // Step 1: Create order + upload files
  const handleCreateOrder = async () => {
    if (!isShopOpen) {
      toast.error("Shop is closed. You cannot send files.")
      return
    }

    // Validation
    const validSections = sections.filter(s => s.file !== null)
    if (validSections.length === 0) {
      toast.error("Please upload at least one file")
      return
    }

    setLoading(true)
    track("order_initiated", {
      shop_id: shop.id,
      shop_name: shop.shop_name,
      file_count: validSections.length,
    })
    try {
      // 1. Get User
      const { data: { user }, error: authError } = await supabase.auth.getUser()
      if (authError || !user) {
        toast.error("You must be logged in to order")
        router.push("/login")
        return
      }

      // 2. Validate all files
      const allowedTypes = ['image/png', 'image/jpeg', 'image/webp', 'application/pdf']
      for (const section of validSections) {
        if (!section.file || !allowedTypes.includes(section.file.type)) {
          toast.error(`Invalid file type for ${section.fileName}. Only PNG, JPG, WEBP, and PDF are allowed.`)
          setLoading(false)
          return
        }
        if (section.file.size > 10 * 1024 * 1024) {
          toast.error(`File ${section.fileName} is too large. Max 10MB.`)
          setLoading(false)
          return
        }
      }

      // 3. Create Order with pending payment status
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          shop_id: shop.id,
          status: 'pending',
          payment_status: 'pending',
          print_amount: printTotal,
          platform_fee: feeResult.platformFeeAmount,
          platform_fee_percentage: feeResult.platformFeePercentage,
          total_amount: feeResult.totalAmount,
        })
        .select()
        .single()

      if (orderError) throw new Error(`Order creation failed: ${orderError.message}`)

      // 4. Upload files and create order items
      for (const section of validSections) {
        if (!section.file) continue

        // Upload file
        const fileExt = section.file.name.split('.').pop()
        const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`
        const filePath = `${user.id}/${fileName}`

        const { error: uploadError } = await supabase.storage
          .from('documents')
          .upload(filePath, section.file)

        if (uploadError) throw new Error(`Upload failed for ${section.fileName}: ${uploadError.message}`)

        const { data: { publicUrl } } = supabase.storage
          .from('documents')
          .getPublicUrl(filePath)

        // Create order item
        const { error: itemError } = await supabase
          .from('order_items')
          .insert({
            order_id: order.id,
            file_url: publicUrl,
            file_name: section.file.name,
            file_type: fileExt,
            color_mode: section.printType,
            copies: section.copies,
            pages_per_sheet: section.pagesPerSheet,
            page_count: section.pageCount,
            is_duplex: section.isDuplex,
          })

        if (itemError) throw new Error(`Item creation failed for ${section.fileName}: ${itemError.message}`)
      }

      setCreatedOrderId(order.id)
      toast.success("Files uploaded! Proceeding to payment...")

      // Automatically trigger payment
      await handlePayment(order.id, user.email || '')

    } catch (error: any) {
      console.error(error)
      toast.error(error.message || "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  // Step 2: Open Razorpay payment
  const handlePayment = async (orderId: string, userEmail: string) => {
    setPaymentLoading(true)

    try {
      // Load Razorpay SDK
      const loaded = await loadRazorpayScript()
      if (!loaded) {
        toast.error("Failed to load payment gateway. Please check your internet connection.")
        setPaymentLoading(false)
        return
      }

      // Create Razorpay order via our API
      const response = await fetch('/api/razorpay/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create payment order')
      }

      // Open Razorpay checkout
      const options: RazorpayOptions = {
        key: data.key,
        amount: data.amount,
        currency: data.currency,
        name: "Zaprint",
        description: `Print Order at ${shop.shop_name}`,
        order_id: data.orderId,
        handler: async (paymentResponse) => {
          // Verify payment on server
          try {
            const verifyRes = await fetch('/api/razorpay/verify-payment', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: paymentResponse.razorpay_order_id,
                razorpay_payment_id: paymentResponse.razorpay_payment_id,
                razorpay_signature: paymentResponse.razorpay_signature,
                order_id: orderId,
              }),
            })

            const verifyData = await verifyRes.json()

            if (verifyData.success) {
              toast.success("Payment successful! Your order is being processed.")
              track("order_paid", {
                order_id: orderId,
                shop_name: shop.shop_name,
                total_amount: feeResult.totalAmount,
              })
              reset()
              router.push('/dashboard/orders')
            } else {
              toast.error("Payment verification failed. Please contact support.")
            }
          } catch {
            toast.error("Payment verification failed. Please contact support.")
          }
          setPaymentLoading(false)
        },
        prefill: {
          email: userEmail,
        },
        theme: {
          color: "#1a1408",
        },
        modal: {
          ondismiss: () => {
            toast.info("Payment was cancelled. You can retry from your orders page.")
            setPaymentLoading(false)
            // Redirect to orders so they can retry payment
            router.push('/dashboard/orders')
          },
          confirm_close: true,
        },
      }

      const rzp = new window.Razorpay!(options)
      rzp.on('payment.failed', (response: any) => {
        toast.error("Payment failed. Please try again.")
        setPaymentLoading(false)
      })
      rzp.open()

    } catch (error: any) {
      console.error('Payment error:', error)
      toast.error(error.message || "Payment initiation failed")
      setPaymentLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Print Sections */}
      <AnimatePresence mode="popLayout">
        {sections.map((section, index) => (
          <motion.div
            key={section.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            <Card className="border-[#1a1408]/10 bg-[#f9f8f4] shadow-[inset_0px_2px_8px_rgba(0,0,0,0.03)] relative rounded-sm">
              <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-dashed border-[#1a1408]/10">
                <CardTitle className="text-lg font-rubik-dirt tracking-widest text-[#1a1408]">Print #{index + 1}</CardTitle>
                {sections.length > 1 && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeSection(section.id)}
                    className="h-8 w-8 text-[#6b5d45] hover:text-red-700 hover:bg-red-100/50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </CardHeader>
              <CardContent className="space-y-6 pt-5">
                {/* File Upload */}
                <div className="space-y-2">
                  <Label className="text-[#1a1408] font-bold uppercase text-xs tracking-wider">Upload Document</Label>
                  {!section.file ? (
                    <div className={`relative border-2 border-dashed border-[#1a1408]/20 bg-[#fdfbf7] rounded-sm p-8 text-center transition-colors ${isShopOpen ? 'hover:border-[#1a1408]/50 hover:bg-[#1a1408]/5 cursor-pointer group' : 'opacity-50 cursor-not-allowed'}`}>
                      <input
                        type="file"
                        accept=".pdf,.png,.jpg,.jpeg,.webp"
                        disabled={!isShopOpen}
                        onChange={(e) => handleFileSelect(section.id, e.target.files?.[0] || null)}
                        className={`absolute inset-0 w-full h-full opacity-0 ${isShopOpen ? 'cursor-pointer' : 'cursor-not-allowed'}`}
                      />
                      <Upload className="w-8 h-8 mx-auto mb-3 text-[#6b5d45] group-hover:text-[#1a1408] transition-colors" />
                      <p className="text-sm text-[#1a1408] font-medium">Click to upload or drag & drop</p>
                      <p className="text-xs text-[#6b5d45] mt-1 font-semibold">PDF, PNG, JPG, WEBP</p>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3 p-4 rounded-sm bg-[#fdfbf7] border border-[#1a1408]/20 shadow-sm relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-1 h-full bg-[#15803d]" />
                      <div className="w-10 h-10 rounded-sm bg-[#1a1408]/5 flex items-center justify-center shrink-0 border border-[#1a1408]/10">
                        <FileText className="w-5 h-5 text-[#1a1408]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-[#1a1408] truncate">{section.fileName}</p>
                        <p className="text-xs text-[#6b5d45] font-medium mt-0.5">
                          {formatFileSize(section.fileSize)} • {section.pageCount} page{section.pageCount !== 1 ? 's' : ''}
                        </p>
                      </div>
                      <CheckCircle className="w-5 h-5 text-[#15803d] shrink-0" />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleFileSelect(section.id, null)}
                        className="h-8 w-8 shrink-0 text-[#6b5d45] hover:text-[#1a1408] hover:bg-[#1a1408]/10"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>

                {/* Print Type */}
                <div className="space-y-2">
                  <Label className="text-[#1a1408] font-bold uppercase text-xs tracking-wider">Print Type</Label>
                  <RadioGroup
                    value={section.printType}
                    onValueChange={(value) => updateSection(section.id, { printType: value as "bw" | "color" })}
                    className="flex gap-6"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="bw" id={`${section.id}-bw`} className="border-[#1a1408] focus:border-[#1a1408] data-[state=checked]:bg-[#1a1408] data-[state=checked]:text-[#fdfbf7]" />
                      <Label htmlFor={`${section.id}-bw`} className="cursor-pointer text-sm font-semibold text-[#3a3120]">
                        Black & White (₹{bwRate}/page)
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="color" id={`${section.id}-color`} className="border-[#2563eb] focus:border-[#2563eb] data-[state=checked]:bg-[#2563eb] data-[state=checked]:text-[#fdfbf7]" />
                      <Label htmlFor={`${section.id}-color`} className="cursor-pointer text-sm font-semibold text-[#1e40af]">
                        Color (₹{colorRate}/page)
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                {/* Configuration Grid */}
                <div className="grid grid-cols-2 gap-6">
                  {/* Copies */}
                  <div className="space-y-2">
                    <Label className="text-[#1a1408] font-bold uppercase text-xs tracking-wider">Copies</Label>
                    <Input
                      type="number"
                      min={1}
                      max={100}
                      value={section.copies}
                      onChange={(e) => updateSection(section.id, { copies: Math.max(1, parseInt(e.target.value) || 1) })}
                      className="bg-[#fdfbf7] border-[#1a1408]/20 text-[#1a1408] font-bold shadow-inner focus-visible:ring-[#1a1408]/30"
                    />
                  </div>

                  {/* Pages per Sheet */}
                  <div className="space-y-2">
                    <Label className="text-[#1a1408] font-bold uppercase text-xs tracking-wider">Pages/Sheet</Label>
                    <select
                      value={section.pagesPerSheet}
                      onChange={(e) => updateSection(section.id, { pagesPerSheet: Number(e.target.value) as 1 | 2 | 4 })}
                      className="w-full h-10 px-3 rounded-sm bg-[#fdfbf7] border border-[#1a1408]/20 text-[#1a1408] font-bold shadow-inner focus:outline-none focus:ring-2 focus:ring-[#1a1408]/30"
                    >
                      <option value={1}>1 Page</option>
                      <option value={2}>2 Pages</option>
                      <option value={4}>4 Pages</option>
                    </select>
                  </div>
                </div>

                {/* Duplex Printing */}
                <div className="flex items-center space-x-3 pt-2">
                  <Checkbox
                    id={`${section.id}-duplex`}
                    checked={section.isDuplex}
                    onCheckedChange={(checked) => updateSection(section.id, { isDuplex: !!checked })}
                    className="border-[#1a1408]/40 data-[state=checked]:bg-[#1a1408] data-[state=checked]:text-[#fdfbf7]"
                  />
                  <Label htmlFor={`${section.id}-duplex`} className="cursor-pointer text-sm font-semibold text-[#1a1408]">
                    Front & Back Side Print (Duplex)
                  </Label>
                </div>

                {/* Subtotal */}
                {section.file && (
                  <div className="pt-4 border-t border-dashed border-[#1a1408]/20 flex justify-between items-center bg-[#fdfbf7] p-3 -mx-2 rounded-sm border">
                    <span className="text-xs font-bold tracking-widest uppercase text-[#6b5d45]">Subtotal</span>
                    <div className="flex items-center gap-1 text-xl font-black text-[#1a1408]">
                      <IndianRupee className="w-5 h-5 text-[#6b5d45]" />
                      {calculateSubtotal(section.id, bwRate, colorRate).toFixed(2)}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Add Another Print Button */}
      <button
        onClick={addSection}
        className="w-full py-6 border-[3px] border-dashed border-[#1a1408]/20 rounded-sm hover:border-[#1a1408]/50 hover:bg-[#1a1408]/5 transition-all flex flex-col items-center justify-center gap-3 group shadow-[inset_0px_0px_10px_rgba(0,0,0,0.02)]"
      >
        <div className="w-12 h-12 rounded-full bg-[#1a1408]/10 group-hover:bg-[#1a1408] flex items-center justify-center transition-colors">
          <Plus className="w-6 h-6 text-[#3a3120] group-hover:text-[#fdfbf7]" />
        </div>
        <span className="text-sm font-bold uppercase tracking-widest text-[#3a3120] group-hover:text-[#1a1408]">Add Another Print Job</span>
      </button>

      {/* Grand Total with Platform Fee (Fixed) */}
      <div className="sticky bottom-4 mx-2 bg-[#fdfbf7] border border-[#1a1408]/20 rounded-sm p-5 shadow-[4px_4px_15px_rgba(0,0,0,0.15)] z-20"
        style={{
          backgroundImage: `url('/images/paper-texture.png')`,
          backgroundSize: 'cover',
          backgroundBlendMode: 'multiply',
        }}>

        {/* Summary Lines */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold tracking-widest uppercase text-[#6b5d45]">
              {sections.filter(s => s.file).length} File(s) • {sections.reduce((sum, s) => sum + (s.file ? s.pageCount * s.copies : 0), 0)} Pages
            </span>
          </div>

          {/* Print Cost */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-[#3a3120]">Print Cost</span>
            <div className="flex items-center gap-1 text-sm font-bold text-[#1a1408]">
              <IndianRupee className="w-3.5 h-3.5 text-[#6b5d45]" />
              {printTotal.toFixed(2)}
            </div>
          </div>

          {/* Platform Fee */}
          {printTotal > 0 && (
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-[#3a3120] flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-[#6b5d45]" />
                Service Fee ({feeResult.platformFeePercentage}%)
              </span>
              <div className="flex items-center gap-1 text-sm font-bold text-[#6b5d45]">
                <IndianRupee className="w-3.5 h-3.5" />
                {feeResult.platformFeeAmount.toFixed(2)}
              </div>
            </div>
          )}

          {/* Divider */}
          <div className="border-t-[2px] border-dashed border-[#1a1408]/30" />

          {/* Grand Total */}
          <div className="flex items-end justify-between">
            <div>
              <p className="text-xs font-black tracking-widest uppercase text-[#3a3120] opacity-80">Total Amount</p>
            </div>
            <div className="flex items-center gap-1 text-3xl font-rubik-dirt text-[#1a1408]">
              <IndianRupee className="w-7 h-7 opacity-80 mb-1" />
              {feeResult.totalAmount.toFixed(2)}
            </div>
          </div>
        </div>

        {/* Secure Payment Badge */}
        {printTotal > 0 && (
          <div className="flex items-center gap-2 mb-3 p-2 bg-[#15803d]/5 border border-[#15803d]/20 rounded-sm">
            <ShieldCheck className="w-4 h-4 text-[#15803d] shrink-0" />
            <p className="text-[11px] font-semibold text-[#15803d]">
              Secure payment powered by Razorpay • 100% Safe & Encrypted
            </p>
          </div>
        )}

        {!isShopOpen && (
          <div className="text-sm font-bold text-red-600 mb-3 text-center bg-red-50 p-2 rounded border border-red-200">
            Shop is closed. You cannot send files.
          </div>
        )}

        <Button
          disabled={loading || paymentLoading || !isShopOpen || sections.filter(s => s.file).length === 0}
          onClick={handleCreateOrder}
          size="lg"
          className="w-full text-sm font-black tracking-widest uppercase h-14 bg-gradient-to-br from-[#1a1408] to-[#3a3120] hover:from-[#3a3120] hover:to-[#5a5140] text-[#fdfbf7] rounded-sm shadow-[2px_2px_0px_rgba(0,0,0,0.3)] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_rgba(0,0,0,0.3)] transition-all"
        >
          {loading || paymentLoading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              {loading ? "Uploading Files..." : "Opening Payment..."}
            </>
          ) : (
            <>
              Pay ₹{feeResult.totalAmount.toFixed(2)} & Place Order
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
