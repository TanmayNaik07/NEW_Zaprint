
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { FileUpload } from "@/components/file-upload"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Loader2, DollarSign } from "lucide-react"
import { toast } from "sonner"

interface Shop {
  id: string
  name: string
  price_bw_per_page: number
  price_color_per_page: number
}

export function OrderForm({ shop }: { shop: Shop }) {
  const router = useRouter()
  const supabase = createClient()
  
  const [file, setFile] = useState<File | null>(null)
  const [colorMode, setColorMode] = useState<"bw" | "color">("bw")
  const [copies, setCopies] = useState(1)
  const [pagesPerSheet, setPagesPerSheet] = useState("1")
  const [loading, setLoading] = useState(false)
  
  // Calculate estimated price (simplified: assumes 1 page per file for now if we can't parse PDF)
  // Ideally we use pdf.js to count pages, but for MVP we might just trust user or set default ? 
  // For now, let's just multiply by copies. 
  // To make it realistic, we'll assume the file is 1 page long per MB/10? No that's bad.
  // We will assume 1 page for estimation and show "Estimated (1 page)".
  
  const pricePerPage = colorMode === "bw" ? shop.price_bw_per_page : shop.price_color_per_page
  const estimatedTotal = (pricePerPage * copies).toFixed(2)

  const handleOrder = async () => {
    if (!file) {
      toast.error("Please upload a file")
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

      // 2. Upload File
      const fileExt = file.name.split('.').pop()
      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`
      const filePath = `${user.id}/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('documents')
        .upload(filePath, file)

      if (uploadError) throw new Error(`Upload failed: ${uploadError.message}`)

      const fileUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/documents/${filePath}`

      // 3. Create Order
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          shop_id: shop.id,
          status: 'pending',
          total_amount: parseFloat(estimatedTotal) // This should be calculated backend ideally, but MVP.
        })
        .select()
        .single()

      if (orderError) throw new Error(`Order creation failed: ${orderError.message}`)

      // 4. Create Order Item
      const { error: itemError } = await supabase
        .from('order_items')
        .insert({
          order_id: order.id,
          file_url: fileUrl,
          file_name: file.name,
          file_type: fileExt,
          color_mode: colorMode,
          copies: copies,
          pages_per_sheet: parseInt(pagesPerSheet)
        })

      if (itemError) throw new Error(`Item creation failed: ${itemError.message}`)

      toast.success("Order placed successfully!")
      router.push('/dashboard/orders')
      
    } catch (error: any) {
      console.error(error)
      toast.error(error.message || "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card className="border-dashed">
        <CardContent className="pt-6">
            <FileUpload onFileSelect={setFile} />
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-2">
            <Label>Color Mode</Label>
            <Select value={colorMode} onValueChange={(v: any) => setColorMode(v)}>
                <SelectTrigger>
                    <SelectValue />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="bw">Black & White (${shop.price_bw_per_page}/pg)</SelectItem>
                    <SelectItem value="color">Color (${shop.price_color_per_page}/pg)</SelectItem>
                </SelectContent>
            </Select>
        </div>

        <div className="space-y-2">
            <Label>Copies</Label>
            <Input 
                type="number" 
                min={1} 
                max={100} 
                value={copies} 
                onChange={(e) => setCopies(parseInt(e.target.value) || 1)} 
            />
        </div>

        <div className="space-y-2">
            <Label>Pages per Sheet</Label>
            <Select value={pagesPerSheet} onValueChange={setPagesPerSheet}>
                <SelectTrigger>
                    <SelectValue />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="1">1 Page</SelectItem>
                    <SelectItem value="2">2 Pages</SelectItem>
                    <SelectItem value="4">4 Pages</SelectItem>
                </SelectContent>
            </Select>
        </div>
      </div>

      <div className="bg-white/5 rounded-xl p-4 border border-white/10 flex items-center justify-between">
        <div>
            <p className="text-sm text-muted-foreground">Estimated Total</p>
            <p className="text-xs text-muted-foreground">(Based on 1 page per file)</p>
        </div>
        <div className="flex items-center gap-1 text-2xl font-bold text-primary">
            <DollarSign className="w-5 h-5" />
            {estimatedTotal}
        </div>
      </div>

      <Button disabled={loading || !file} onClick={handleOrder} size="lg" className="w-full text-lg">
        {loading ? (
            <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Processing...
            </>
        ) : (
            "Place Order"
        )}
      </Button>
    </div>
  )
}
