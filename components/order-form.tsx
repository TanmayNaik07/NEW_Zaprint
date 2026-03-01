"use client"

import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Loader2, IndianRupee, Plus, Trash2, Upload, FileText, X, CheckCircle } from "lucide-react"
import { toast } from "sonner"
import type { ShopWithDetails } from "@/lib/types/shop"
import { usePrintStore } from "@/lib/print-store"
import { getPDFPageCount, isPDF } from "@/lib/utils/pdf"
import { motion, AnimatePresence } from "framer-motion"

export function OrderForm({ shop }: { shop: ShopWithDetails }) {
  const router = useRouter()
  const supabase = createClient()
  const { sections, addSection, removeSection, updateSection, calculateSubtotal, calculateGrandTotal, reset } = usePrintStore()

  const [loading, setLoading] = useState(false)

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

  const handleOrder = async () => {
    // Validation
    const validSections = sections.filter(s => s.file !== null)
    if (validSections.length === 0) {
      toast.error("Please upload at least one file")
      return
    }

    setLoading(true)
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

      // 3. Calculate total
      const totalAmount = calculateGrandTotal(bwRate, colorRate)

      // 4. Create Order
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          shop_id: shop.id,
          status: 'pending',
          total_amount: totalAmount
        })
        .select()
        .single()

      if (orderError) throw new Error(`Order creation failed: ${orderError.message}`)

      // 5. Upload files and create order items
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

      toast.success("Order placed successfully!")
      reset()
      router.push('/dashboard/orders')

    } catch (error: any) {
      console.error(error)
      toast.error(error.message || "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  const grandTotal = calculateGrandTotal(bwRate, colorRate)

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
                    <div className="relative border-2 border-dashed border-[#1a1408]/20 bg-[#fdfbf7] rounded-sm p-8 text-center hover:border-[#1a1408]/50 hover:bg-[#1a1408]/5 transition-colors cursor-pointer group">
                      <input
                        type="file"
                        accept=".pdf,.png,.jpg,.jpeg,.webp"
                        onChange={(e) => handleFileSelect(section.id, e.target.files?.[0] || null)}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
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

      {/* Grand Total (Fixed) */}
      <div className="sticky bottom-4 mx-2 bg-[#fdfbf7] border border-[#1a1408]/20 rounded-sm p-5 shadow-[4px_4px_15px_rgba(0,0,0,0.15)] z-20"
        style={{
          backgroundImage: `url('/images/paper-texture.png')`,
          backgroundSize: 'cover',
          backgroundBlendMode: 'multiply',
        }}>
        <div className="flex items-end justify-between mb-5">
          <div>
            <p className="text-xs font-black tracking-widest uppercase text-[#3a3120] opacity-80 mb-1">Grand Total</p>
            <p className="text-sm font-semibold text-[#6b5d45]">
              {sections.filter(s => s.file).length} File(s) <span className="opacity-50 mx-1">•</span> {sections.reduce((sum, s) => sum + (s.file ? s.pageCount * s.copies : 0), 0)} Pages Total
            </p>
          </div>
          <div className="flex items-center gap-1 text-4xl font-rubik-dirt text-[#1a1408]">
            <IndianRupee className="w-8 h-8 opacity-80 mb-1.5" />
            {grandTotal.toFixed(2)}
          </div>
        </div>
        <Button
          disabled={loading || sections.filter(s => s.file).length === 0}
          onClick={handleOrder}
          size="lg"
          className="w-full text-sm font-black tracking-widest uppercase h-14 bg-gradient-to-br from-[#1a1408] to-[#3a3120] hover:from-[#3a3120] hover:to-[#5a5140] text-[#fdfbf7] rounded-sm shadow-[2px_2px_0px_rgba(0,0,0,0.3)] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_rgba(0,0,0,0.3)] transition-all"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Processing Order...
            </>
          ) : (
            "Complete Order"
          )}
        </Button>
      </div>
    </div>
  )
}
