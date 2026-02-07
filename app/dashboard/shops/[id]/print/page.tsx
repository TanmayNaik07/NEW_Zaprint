import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import Image from "next/image"
import { MapPin, Phone, Printer, ArrowLeft, Clock } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { OrderForm } from "@/components/order-form"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import type { ShopWithDetails } from "@/lib/types/shop"
import { isShopCurrentlyOpen, formatOperatingHours } from "@/lib/types/shop"

export const dynamic = 'force-dynamic'

interface PageProps {
  params: {
    id: string
  }
}

export default async function ShopPrintPage({ params }: PageProps) {
  const supabase = await createClient()
  
  // Fetch shop details with services
  const { data: shop, error } = await supabase
    .from("shops")
    .select(`
      *,
      services:shop_services(*),
      resources:shop_resources(*),
      printers:shop_printers(*)
    `)
    .eq("id", params.id)
    .single()

  if (error || !shop) {
    if (error) console.error("Error fetching shop:", error)
    notFound()
  }

  const shopWithDetails = shop as ShopWithDetails
  const isOpen = isShopCurrentlyOpen(shopWithDetails)

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Back Button */}
      <Button variant="ghost" asChild className="gap-2">
        <Link href="/dashboard/shops">
          <ArrowLeft className="w-4 h-4" />
          Back to Shops
        </Link>
      </Button>

      {/* Shop Header */}
      <div className="rounded-2xl overflow-hidden border border-white/10 bg-white/5">
        <div className="p-6 md:p-8">
          <div className="flex items-start gap-6 flex-wrap">
            {/* Shop Image */}
            <div className="relative w-24 h-24 rounded-xl overflow-hidden shrink-0">
              {shopWithDetails.image_url ? (
                <Image
                  src={shopWithDetails.image_url}
                  alt={shopWithDetails.shop_name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full bg-primary/10 flex items-center justify-center">
                  <Printer className="w-10 h-10 text-primary/40" />
                </div>
              )}
            </div>

            {/* Shop Info */}
            <div className="flex-1 min-w-[250px]">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">{shopWithDetails.shop_name}</h1>
                  <Badge 
                    variant={isOpen ? "default" : "secondary"} 
                    className={isOpen ? "bg-green-500 hover:bg-green-500" : "bg-red-500 hover:bg-red-500"}
                  >
                    {isOpen ? "Open Now" : "Closed"}
                  </Badge>
                </div>
              </div>

              <div className="mt-4 space-y-2">
                <div className="flex items-start gap-2 text-sm text-muted-foreground">
                  <MapPin className="w-4 h-4 shrink-0 mt-0.5 text-primary" />
                  <span>{shopWithDetails.location}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Phone className="w-4 h-4 shrink-0 text-primary" />
                  <span>{shopWithDetails.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="w-4 h-4 shrink-0 text-primary" />
                  <span>{formatOperatingHours(shopWithDetails.start_time, shopWithDetails.end_time)}</span>
                </div>
              </div>
            </div>

            {/* Services Pricing Card */}
            <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-3 min-w-[200px]">
              <h3 className="font-semibold text-foreground text-sm">Services & Pricing</h3>
              <div className="space-y-2">
                {shopWithDetails.services.length > 0 ? (
                  shopWithDetails.services.map((service) => (
                    <div key={service.id} className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">{service.service_name}</span>
                      <span className="font-semibold">${service.price.toFixed(2)}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">No services available</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Order Form */}
      <div className="rounded-2xl border border-white/10 bg-white/5 p-6 md:p-8">
        <h2 className="text-xl font-semibold mb-6">Upload & Configure Your Print</h2>
        <OrderForm shop={shopWithDetails} />
      </div>
    </div>
  )
}
