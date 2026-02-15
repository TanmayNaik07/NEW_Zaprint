
import { createClient } from "@/lib/supabase/server"
import { ShopsList } from "./components/ShopsList"
import type { ShopWithDetails } from "@/lib/types/shop"

export const dynamic = 'force-dynamic'

export default async function ShopsPage() {
  const supabase = await createClient()

  // Get user location
  const { data: { user } } = await supabase.auth.getUser()
  let userCity = ""
  let userPincode = ""

  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('city, pincode')
      .eq('id', user.id)
      .single()
    
    if (profile) {
      userCity = profile.city || ""
      userPincode = profile.pincode || ""
    }
  }
  
  // Fetch shops with all related data
  const { data: shops, error } = await supabase
    .from("shops")
    .select(`
      *,
      services:shop_services(*),
      resources:shop_resources(*),
      printers:shop_printers(*)
    `)
    .eq('is_onboarded', true)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching shops:", error)
  }

  const allShops = (shops as ShopWithDetails[]) || []
  
  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-foreground text-2xl md:text-3xl font-semibold mb-2">Print Shops</h1>
        <p className="text-muted-foreground">Find and select a print shop near you.</p>
        {(userCity) && (
             <p className="text-xs text-primary mt-1">
                Showing results for {userCity} {userPincode ? `(${userPincode})` : ''}
             </p>
        )}
      </div>

      <ShopsList 
        initialShops={allShops} 
        userCity={userCity} 
        userPincode={userPincode} 
      />
    </div>
  )
}

