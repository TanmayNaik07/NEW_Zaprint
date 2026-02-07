import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import Image from "next/image"
import { MapPin, Phone, Printer, ArrowLeft } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { OrderForm } from "@/components/order-form"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export const dynamic = 'force-dynamic'

interface PageProps {
  params: {
    id: string
  }
}

export default async function ShopPrintPage({ params }: PageProps) {
  const supabase = await createClient()
  
  // Fetch shop details
  const { data: shop, error } = await supabase
    .from("shops")
    .select("*")
    .eq("id", params.id)
    .single()

  if (error || !shop) {
    if (error) console.error("Error fetching shop:", error)
    notFound()
  }

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
          <div className="flex items-start gap-6">
            {/* Shop Image */}
            <div className="relative w-24 h-24 rounded-xl overflow-hidden shrink-0">
              {shop.image_url ? (
                <Image
                  src={shop.image_url}
                  alt={shop.name}
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
            <div className="flex-1">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">{shop.name}</h1>
                  <Badge variant={shop.is_open ? "default" : "secondary"} className={shop.is_open ? "bg-green-500 hover:bg-green-500" : "bg-red-500 hover:bg-red-500"}>
                    {shop.is_open ? "Open Now" : "Closed"}
                  </Badge>
                </div>
              </div>

              <div className="mt-4 space-y-2">
                <div className="flex items-start gap-2 text-sm text-muted-foreground">
                  <MapPin className="w-4 h-4 shrink-0 mt-0.5 text-primary" />
                  <span>{shop.address}</span>
                </div>
                {shop.phone && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Phone className="w-4 h-4 shrink-0 text-primary" />
                    <span>{shop.phone}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Pricing Card */}
            <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-3 min-w-[180px]">
              <h3 className="font-semibold text-foreground text-sm">Pricing</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">B&W</span>
                  <span className="font-semibold">${shop.price_bw_per_page}/page</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Color</span>
                  <span className="font-semibold">${shop.price_color_per_page}/page</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Order Form */}
      <div className="rounded-2xl border border-white/10 bg-white/5 p-6 md:p-8">
        <h2 className="text-xl font-semibold mb-6">Upload & Configure Your Print</h2>
        <OrderForm shop={shop} />
      </div>
    </div>
  )
}
