
"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { ShopCard } from "@/components/shop-card"
import type { ShopWithDetails } from "@/lib/types/shop"
import { isShopCurrentlyOpen } from "@/lib/types/shop"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"

interface ShopsListProps {
  initialShops: ShopWithDetails[]
  userCity: string
  userPincode: string
}

export function ShopsList({ initialShops, userCity, userPincode }: ShopsListProps) {
  const [shops, setShops] = useState<ShopWithDetails[]>(initialShops)
  const [searchQuery, setSearchQuery] = useState("")
  const supabase = createClient()

  useEffect(() => {
    // Subscribe to shops changes (for open/close status, etc.)
    const shopsChannel = supabase
      .channel('shops-realtime')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'shops',
        },
        async (payload) => {
          console.log('Shop update:', payload)
          // Ideally we would just update the specific shop in the list
          // But for simplicity and to ensure we have fresh relations (printers, services),
          // we might want to re-fetch the specific shop or just update fields we know changed.
          // For now, let's just update the fields present in the payload if it's an UPDATE.

          if (payload.eventType === 'UPDATE') {
            setShops(currentShops => currentShops.map(shop => {
              if (shop.id === payload.new.id) {
                return { ...shop, ...payload.new }
              }
              return shop
            }))
          } else if (payload.eventType === 'INSERT') {
            // For inserts, we'd need to fetch relations. 
            // Given the complexity, dragging in a new shop without relations isn't great.
            // We can trigger a re-fetch of all shops or just ignore inserts for now as they are rare.
            // Let's ignore inserts for now to avoid complexity, user can refresh.
          }
        }
      )
      .subscribe()

    // Subscribe to printer changes (for online/offline status)
    const printersChannel = supabase
      .channel('printers-realtime')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'shop_printers',
        },
        async (payload) => {
          console.log('Printer update:', payload)
          if (payload.eventType === 'UPDATE') {
            setShops(currentShops => currentShops.map(shop => {
              // Find if this printer belongs to this shop
              const printerIndex = shop.printers.findIndex(p => p.id === payload.new.id)
              if (printerIndex !== -1) {
                const newPrinters = [...shop.printers]
                newPrinters[printerIndex] = { ...newPrinters[printerIndex], ...payload.new }
                return { ...shop, printers: newPrinters }
              }
              return shop
            }))
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(shopsChannel)
      supabase.removeChannel(printersChannel)
    }
  }, [])


  // Filter shops based on search query
  const filteredShops = shops.filter(shop =>
    shop.shop_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    shop.location?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const nearbyShops: ShopWithDetails[] = []
  const otherShops: ShopWithDetails[] = []

  if (userCity || userPincode) {
    filteredShops.forEach(shop => {
      // Assume shop.city and shop.pincode might exist in future or used from location text for now
      // For now relying on existing logic which seemed to assume properties that might not exist fully on 'shop' type yet
      // but let's stick to the logic provided in original page
      const shopCity = (shop as any).city
      const shopPincode = (shop as any).pincode

      const isNearby =
        (userPincode && shopPincode && shopPincode === userPincode) ||
        (userCity && shopCity && shopCity.toLowerCase() === userCity.toLowerCase())

      if (isNearby) {
        nearbyShops.push(shop)
      } else {
        otherShops.push(shop)
      }
    })
  } else {
    otherShops.push(...filteredShops)
  }

  const sortShops = (a: ShopWithDetails, b: ShopWithDetails) => {
    const aOpen = isShopCurrentlyOpen(a) ? 1 : 0
    const bOpen = isShopCurrentlyOpen(b) ? 1 : 0
    return bOpen - aOpen
  }

  nearbyShops.sort(sortShops)
  otherShops.sort(sortShops)

  return (
    <div className="space-y-10">
      <div className="relative max-w-xl">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6b5d45] w-5 h-5 opacity-70" />
        <Input
          placeholder="Search shops by name or location..."
          className="pl-11 h-12 bg-[#f9f8f4]/80 border-[#1a1408]/20 text-[#1a1408] placeholder:text-[#6b5d45]/70 font-medium rounded-sm shadow-inner focus-visible:ring-[#1a1408]/30"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {nearbyShops.length > 0 && (
        <div className="space-y-6">
          <h2 className="font-rubik-dirt text-[#1a1408] text-2xl md:text-3xl flex items-center gap-3">
            <span className="bg-[#1a1408] text-[#f9f8f4] px-3 py-1 rounded-sm text-xs md:text-sm uppercase tracking-widest font-sans font-bold">Nearby</span>
            Shops Near You
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10 pb-4">
            {nearbyShops.map((shop) => (
              <ShopCard key={shop.id} shop={shop} />
            ))}
          </div>
        </div>
      )}

      <div className="space-y-6">
        {nearbyShops.length > 0 && (
          <div className="mt-12 mb-8">
            <div className="border-t-[2px] border-dashed border-[#1a1408]/30 w-full mb-8" />
            <h2 className="font-rubik-dirt text-[#1a1408] text-2xl md:text-3xl">All Shops</h2>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
          {otherShops.length > 0 ? (
            otherShops.map((shop) => (
              <ShopCard key={shop.id} shop={shop} />
            ))
          ) : (
            nearbyShops.length === 0 && (
              <div className="col-span-full py-16 text-center text-[#6b5d45] bg-[#f9f8f4]/60 rounded-sm border border-[#1a1408]/10 shadow-inner">
                <p className="font-rubik-dirt text-xl">No print shops found.</p>
                <p className="text-sm mt-2 font-medium">Try adjusting your search criteria</p>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  )
}
