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
  const { id } = await params
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
    .eq("id", id)
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
      <Button variant="ghost" asChild className="gap-2 text-[#6b5d45] hover:text-[#1a1408] hover:bg-[#1a1408]/5 font-semibold font-sans mb-4">
        <Link href="/dashboard/shops">
          <ArrowLeft className="w-4 h-4" />
          Back to Shops
        </Link>
      </Button>

      {/* Shop Header */}
      <div className="rounded-sm overflow-hidden border border-[#1a1408]/10 bg-[#fdfbf7] shadow-[2px_2px_10px_rgba(0,0,0,0.05)]">
        <div className="p-6 md:p-8">
          <div className="flex items-start gap-6 flex-wrap">
            {/* Shop Image */}
            <div className="relative w-24 h-24 rounded-sm overflow-hidden shrink-0 border border-[#1a1408]/10 bg-[#eeeae0] shadow-[inset_0px_2px_5px_rgba(0,0,0,0.05)]">
              {shopWithDetails.image_url ? (
                <Image
                  src={shopWithDetails.image_url}
                  alt={shopWithDetails.shop_name}
                  fill
                  className="object-cover grayscale-[20%] sepia-[15%]"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Printer className="w-10 h-10 text-[#6b5d45]/50" />
                </div>
              )}
            </div>

            {/* Shop Info */}
            <div className="flex-1 min-w-[250px]">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <h1 className="text-3xl md:text-4xl font-rubik-dirt text-[#1a1408] tracking-tight mb-2">{shopWithDetails.shop_name}</h1>
                  <span className={`px-2 py-0.5 text-xs font-bold uppercase tracking-widest rounded-sm inline-block ${isOpen ? 'text-[#15803d] bg-[#dcfce7] border border-[#166534]/30 shadow-[1px_1px_0px_#166534]' : 'text-[#b91c1c] bg-[#fee2e2] border border-[#991b1b]/30 shadow-[1px_1px_0px_#991b1b]'}`}>
                    {isOpen ? "Open Now" : "Closed"}
                  </span>
                </div>
              </div>

              <div className="mt-4 space-y-2">
                <div className="flex items-start gap-2 text-sm text-[#6b5d45] font-medium font-sans">
                  <MapPin className="w-4 h-4 shrink-0 mt-0.5 opacity-80" />
                  <span>{shopWithDetails.location}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-[#6b5d45] font-medium font-sans">
                  <Phone className="w-4 h-4 shrink-0 opacity-80" />
                  <span>{shopWithDetails.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-[#6b5d45] font-medium font-sans">
                  <Clock className="w-4 h-4 shrink-0 opacity-80" />
                  <span>{formatOperatingHours(shopWithDetails.start_time, shopWithDetails.end_time)}</span>
                </div>
              </div>
            </div>

            {/* Services Pricing Card */}
            <div className="p-5 rounded-sm bg-[#f9f8f4] border border-[#1a1408]/10 shadow-[inset_0px_2px_8px_rgba(0,0,0,0.03)] space-y-4 min-w-[220px]">
              <h3 className="font-bold text-[#1a1408] uppercase tracking-wider text-xs border-b border-dashed border-[#1a1408]/20 pb-2">Services & Pricing</h3>
              <div className="space-y-3">
                {shopWithDetails.services.length > 0 ? (
                  shopWithDetails.services.map((service) => (
                    <div key={service.id} className="flex items-center justify-between text-sm font-sans">
                      <span className="text-[#6b5d45] font-medium">{service.service_name}</span>
                      <span className="font-bold text-[#1a1408]">₹{service.price.toFixed(2)}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-[#6b5d45] italic">No services available</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Order Form */}
      <div className="rounded-sm border border-[#1a1408]/10 bg-[#fdfbf7] p-6 md:p-8 shadow-[2px_2px_10px_rgba(0,0,0,0.03)]">
        <h2 className="text-2xl font-rubik-dirt text-[#1a1408] mb-6 border-b border-dashed border-[#1a1408]/20 pb-3">Upload & Configure Your Print</h2>
        <OrderForm shop={shopWithDetails} />
      </div>
    </div>
  )
}
