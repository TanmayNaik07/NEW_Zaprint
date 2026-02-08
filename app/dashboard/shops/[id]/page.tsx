
import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import Image from "next/image"
import { MapPin, Phone, Clock, Printer } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { OrderForm } from "@/components/order-form"

// Since this page uses params, it is dynamic
export const dynamic = 'force-dynamic'

interface PageProps {
  params: {
    id: string
  }
}

export default async function ShopDetailsPage({ params }: PageProps) {
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
      <div className="rounded-2xl overflow-hidden border border-white/10 bg-white/5 relative">
        {/* Banner/Header */}
        <div className="h-64 md:h-80 relative">
          {shop.image_url ? (
             <Image
             src={shop.image_url}
             alt={shop.name}
             fill
             className="object-cover"
             priority
           />
          ) : (
             <div className="w-full h-full bg-primary/10 flex items-center justify-center">
                 <Printer className="w-20 h-20 text-primary/40" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
          
          <div className="absolute bottom-0 left-0 p-6 md:p-8 space-y-2 w-full">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">{shop.name}</h1>
                 <Badge variant={shop.is_open ? "default" : "secondary"} className={shop.is_open ? "bg-green-500 hover:bg-green-500" : "bg-red-500 hover:bg-red-500"}>
                    {shop.is_open ? "Open Now" : "Closed"}
                  </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Info Content */}
        <div className="p-6 md:p-8 pt-0 grid gap-8 md:grid-cols-3">
          {/* Main Info */}
          <div className="md:col-span-2 space-y-8">
            <section className="space-y-4">
              <h2 className="text-xl font-semibold">About</h2>
              <p className="text-muted-foreground leading-relaxed">
                {shop.description || "No description provided."}
              </p>
            </section>
            
            {/* The Order Form Component will handle state and logic */}
            <section className="space-y-4 pt-4 border-t border-white/10">
               <h2 className="text-xl font-semibold">Upload Documents & Configure</h2>
               <OrderForm shop={shop} />
            </section>
          </div>

          {/* Sidebar Info */}
          <div className="space-y-6">
            <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-4">
                <h3 className="font-semibold text-foreground">Contact & Location</h3>
                <div className="space-y-3 text-sm">
                    <div className="flex items-start gap-3 text-muted-foreground">
                        <MapPin className="w-5 h-5 shrink-0 text-primary" />
                        <span>{shop.address}</span>
                    </div>
                    {shop.phone && (
                        <div className="flex items-center gap-3 text-muted-foreground">
                            <Phone className="w-5 h-5 shrink-0 text-primary" />
                            <span>{shop.phone}</span>
                        </div>
                    )}
                </div>
            </div>

             <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-4">
                <h3 className="font-semibold text-foreground">Pricing</h3>
                <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Black & White</span>
                        <span className="font-semibold">${shop.price_bw_per_page} /page</span>
                    </div>
                     <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Color</span>
                        <span className="font-semibold">${shop.price_color_per_page} /page</span>
                    </div>
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
