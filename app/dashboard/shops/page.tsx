
import { createClient } from "@/lib/supabase/server"
import { ShopCard } from "@/components/shop-card"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import type { ShopWithDetails } from "@/lib/types/shop"

export const dynamic = 'force-dynamic'


export default async function ShopsPage() {
  const supabase = await createClient()
  
  // Fetch shops with all related data WITHOUT filters for debugging
  const { data: shops, error } = await supabase
    .from("shops")
    .select(`
      *,
      services:shop_services(*),
      resources:shop_resources(*),
      printers:shop_printers(*)
    `)
    // .eq('is_onboarded', true) // Commented out for debugging
    .order("created_at", { ascending: false })

  const shopList = (shops as ShopWithDetails[]) || []

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* DEBUG SECTION - REMOVE LATER */}
      <div className="p-4 bg-red-900/20 border border-red-500/50 rounded-lg text-xs font-mono">
        <h3 className="text-red-500 font-bold mb-2">DEBUG INFO</h3>
        <p>Error: {error ? JSON.stringify(error) : 'None'}</p>
        <p>Shops Found: {shopList.length}</p>
        <details>
            <summary className="cursor-pointer text-blue-400">View Raw Data</summary>
            <pre className="mt-2 whitespace-pre-wrap text-muted-foreground">
                {JSON.stringify(shopList, null, 2)}
            </pre>
        </details>
      </div>

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
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {shopList.length > 0 ? (
          shopList.map((shop) => (
            <ShopCard key={shop.id} shop={shop} />
          ))
        ) : (
          <div className="col-span-full py-12 text-center text-muted-foreground bg-white/5 rounded-xl border border-white/10">
            <p>No print shops found in database.</p>
          </div>
        )}
      </div>
    </div>
  )
}
