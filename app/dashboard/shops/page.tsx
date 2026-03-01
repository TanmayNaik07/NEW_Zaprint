"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { ShopsList } from "./components/ShopsList"
import type { ShopWithDetails } from "@/lib/types/shop"

export default function ShopsPage() {
  const [shops, setShops] = useState<ShopWithDetails[]>([])
  const [userCity, setUserCity] = useState("")
  const [userPincode, setUserPincode] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    async function fetchData() {
      const { data: { user } } = await supabase.auth.getUser()

      // Fetch user profile and shops in parallel
      const [profileRes, shopsRes] = await Promise.all([
        user
          ? supabase.from('profiles').select('city, pincode').eq('id', user.id).single()
          : Promise.resolve({ data: null }),
        supabase
          .from("shops")
          .select(`*, services:shop_services(*), resources:shop_resources(*), printers:shop_printers(*)`)
          .eq('is_onboarded', true)
          .order("created_at", { ascending: false }),
      ])

      if (profileRes.data) {
        setUserCity(profileRes.data.city || "")
        setUserPincode(profileRes.data.pincode || "")
      }

      setShops((shopsRes.data as ShopWithDetails[]) || [])
      setIsLoading(false)
    }

    fetchData()
  }, [])

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="relative">
        <h1 className="font-rubik-dirt text-[#1a1408] text-3xl md:text-4xl lg:text-5xl tracking-tight leading-tight">
          Print Shops
        </h1>
        <p className="text-[#6b5d45] text-sm md:text-base mt-2 tracking-wide">
          Find and select a print shop near you.
        </p>
        {userCity && (
          <p className="text-[#6b5d45] text-xs font-semibold uppercase tracking-widest mt-1">
            Showing results for {userCity} {userPincode ? `(${userPincode})` : ''}
          </p>
        )}
        {/* Dashed separator line */}
        <div className="mt-6 border-t-[3px] border-dashed border-[#1a1408]/70 w-full" />
      </div>

      {isLoading ? (
        <div className="space-y-8 animate-pulse">
          <div className="h-10 w-full bg-black/5 rounded-lg" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="rounded-2xl border border-black/5 bg-white/50 overflow-hidden">
                <div className="h-40 bg-black/5" />
                <div className="p-4 space-y-3">
                  <div className="h-5 w-32 bg-black/5 rounded" />
                  <div className="h-4 w-48 bg-black/5 rounded" />
                  <div className="flex gap-2">
                    <div className="h-6 w-16 bg-black/5 rounded-full" />
                    <div className="h-6 w-16 bg-black/5 rounded-full" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <ShopsList
          initialShops={shops}
          userCity={userCity}
          userPincode={userPincode}
        />
      )}
    </div>
  )
}
