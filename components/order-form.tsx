
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
import { Loader2, DollarSign, IndianRupee } from "lucide-react"
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


      // 2. Validate File
      const allowedTypes = ['image/png', 'image/jpeg', 'image/webp', 'application/pdf']
      if (!allowedTypes.includes(file.type)) {
        toast.error("Invalid file type. Only PNG, JPG, JPEG, WEBP, and PDF are allowed.")
        setLoading(false)
        return
      }

      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        toast.error("File size too large. Max 10MB.")
        setLoading(false)
        return
      }

      // 3. Upload File
      const fileExt = file.name.split('.').pop()
      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`
      const filePath = `${user.id}/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('documents')
        .upload(filePath, file)

      if (uploadError) throw new Error(`Upload failed: ${uploadError.message}`)

      const { data: { publicUrl } } = supabase.storage
        .from('documents')
        .getPublicUrl(filePath)

      // 4. Create Order
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

      // 5. Create Order Item
      const { error: itemError } = await supabase
        .from('order_items')
        .insert({
          order_id: order.id,
          file_url: publicUrl,
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
      <Card className="border-dashed bg-white/5 border-white/10">
        <CardContent className="pt-6">
            <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="file">File (PDF, PNG, JPG, WEBP)</Label>
                <Input 
                    id="file" 
                    type="file" 
                    accept=".pdf,.png,.jpg,.jpeg,.webp"
                    onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) setFile(file)
                    }}
                    className="cursor-pointer file:text-foreground"
                />
            </div>
            {file && <p className="text-sm text-muted-foreground mt-2">Selected: {file.name}</p>}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-2">
            <Label>Service Type</Label>
            <Select value={selectedService} onValueChange={setSelectedService}>
                <SelectTrigger className="bg-white/5 border-white/10">
                    <SelectValue placeholder="Select a service" />
                </SelectTrigger>
                <SelectContent>
                    {shop.services.length > 0 ? (
                      shop.services.map((svc) => (
                        <SelectItem key={svc.id} value={svc.id}>
                          {svc.service_name} (₹{svc.price.toFixed(2)}/pg)
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
                className="bg-white/5 border-white/10"
            />
        </div>

        <div className="space-y-2">
            <Label>Pages per Sheet</Label>
            <Select value={pagesPerSheet} onValueChange={setPagesPerSheet}>
                <SelectTrigger className="bg-white/5 border-white/10">
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
            <p className="text-xs text-muted-foreground text-emerald-400">
                {service ? `${service.service_name} (₹${pricePerPage}/pg)` : 'Select a service'}
            </p>
        </div>
        <div className="flex items-center gap-1 text-2xl font-bold text-primary">
            <IndianRupee className="w-5 h-5" />
            {estimatedTotal}
        </div>
      </div>

      <Button disabled={loading || !file || !selectedService} onClick={handleOrder} size="lg" className="w-full text-lg font-semibold">
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
