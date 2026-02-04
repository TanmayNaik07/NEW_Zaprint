
import { createClient } from "@/lib/supabase/server"
import { ShopCard } from "@/components/shop-card"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

export const dynamic = 'force-dynamic'

export default async function ShopsPage() {
  const supabase = await createClient()
  const { data: shops, error } = await supabase
    .from("shops")
    .select("*")
    .order("is_open", { ascending: false })

  if (error) {
    console.error("Error fetching shops:", error)
  }

  const shopList = shops || []

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-foreground text-2xl md:text-3xl font-semibold mb-2">Print Shops</h1>
        <p className="text-muted-foreground">Find and select a print shop near you.</p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <Input 
          placeholder="Search shops by name or location..." 
          className="pl-9 bg-white/5 border-white/10 text-foreground placeholder:text-muted-foreground"
        />
        {/* Note: Client-side search implementation would require this to be a client component or use URL search params. 
            For now, just the UI is present. Implementing full search would involve a client component wrapper. */}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {shopList.length > 0 ? (
          shopList.map((shop: any) => (
            <ShopCard
              key={shop.id}
              id={shop.id}
              name={shop.name}
              description={shop.description}
              address={shop.address}
              phone={shop.phone}
              imageUrl={shop.image_url}
              isOpen={shop.is_open}
              priceBw={shop.price_bw_per_page}
              priceColor={shop.price_color_per_page}
            />
          ))
        ) : (
          <div className="col-span-full py-12 text-center text-muted-foreground bg-white/5 rounded-xl border border-white/10">
            <p>No print shops found. Check back later!</p>
          </div>
        )}
      </div>
    </div>
  )
}
