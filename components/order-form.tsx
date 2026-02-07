
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { FileUpload } from "@/components/file-upload"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Loader2, DollarSign } from "lucide-react"
import { toast } from "sonner"
import type { ShopWithDetails, ShopService } from "@/lib/types/shop"

export function OrderForm({ shop }: { shop: ShopWithDetails }) {
  const router = useRouter()
  const supabase = createClient()
  
  const [file, setFile] = useState<File | null>(null)
  const [selectedService, setSelectedService] = useState<string>("")
  const [copies, setCopies] = useState(1)
  const [pagesPerSheet, setPagesPerSheet] = useState("1")
  const [loading, setLoading] = useState(false)
  
  // Get selected service details
  const service = shop.services.find(s => s.id === selectedService)
  const pricePerPage = service?.price || 0
  const estimatedTotal = (pricePerPage * copies).toFixed(2)

  const handleOrder = async () => {
    if (!file) {
      toast.error("Please upload a file")
      return
    }

    if (!selectedService) {
      toast.error("Please select a service")
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
          total_amount: parseFloat(estimatedTotal)
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
          color_mode: service?.service_name.toLowerCase().includes('color') ? 'color' : 'bw',
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
            <Label>Service Type</Label>
            <Select value={selectedService} onValueChange={setSelectedService}>
                <SelectTrigger>
                    <SelectValue placeholder="Select a service" />
                </SelectTrigger>
                <SelectContent>
                    {shop.services.length > 0 ? (
                      shop.services.map((svc) => (
                        <SelectItem key={svc.id} value={svc.id}>
                          {svc.service_name} (${svc.price.toFixed(2)}/pg)
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="none" disabled>No services available</SelectItem>
                    )}
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

      <Button disabled={loading || !file || !selectedService} onClick={handleOrder} size="lg" className="w-full text-lg">
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
