"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import {
  Store,
  Search,
  MapPin,
  Phone,
  IndianRupee,
  CircleDot,
} from "lucide-react"

interface Shop {
  id: string
  name: string
  description: string
  address: string
  phone: string
  image_url: string
  is_open: boolean
  price_bw_per_page: number
  price_color_per_page: number
  created_at: string
  owner_id: string | null
}

export default function AdminShopsPage() {
  const [shops, setShops] = useState<Shop[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState("")
  const supabase = createClient()

  useEffect(() => {
    async function fetchShops() {
      const { data, error } = await supabase
        .from("shops")
        .select("*")
        .order("created_at", { ascending: false })

      if (!error && data) {
        setShops(data)
      }
      setIsLoading(false)
    }
    fetchShops()
  }, [])

  const filtered = shops.filter((s) => {
    if (!search) return true
    const q = search.toLowerCase()
    return (
      s.name.toLowerCase().includes(q) ||
      s.address.toLowerCase().includes(q) ||
      (s.phone || "").includes(q)
    )
  })

  const openCount = shops.filter((s) => s.is_open).length

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-white">All Shops</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-[200px] rounded-2xl bg-white/5 animate-pulse border border-white/5"
            />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">All Shops</h1>
        <p className="text-white/40 mt-2">
          {shops.length} total shops · {openCount} currently open
        </p>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
        <input
          type="text"
          placeholder="Search shops..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-white/20 transition text-sm"
        />
      </div>

      {/* Shops Grid */}
      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-12 text-center">
          <Store className="h-12 w-12 text-white/20 mx-auto mb-4" />
          <p className="text-white/40">No shops found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((shop) => (
            <div
              key={shop.id}
              className={`rounded-2xl border p-6 transition-all hover:scale-[1.01] ${
                shop.is_open
                  ? "border-green-500/20 bg-white/5"
                  : "border-red-500/20 bg-white/[0.02]"
              }`}
            >
              {/* Shop Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      shop.is_open
                        ? "bg-green-500/10"
                        : "bg-red-500/10"
                    }`}
                  >
                    <Store
                      className={`h-5 w-5 ${
                        shop.is_open ? "text-green-400" : "text-red-400"
                      }`}
                    />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold">{shop.name}</h3>
                    <div className="flex items-center gap-1.5">
                      <CircleDot
                        className={`h-3 w-3 ${
                          shop.is_open ? "text-green-400" : "text-red-400"
                        }`}
                      />
                      <span
                        className={`text-xs ${
                          shop.is_open ? "text-green-400" : "text-red-400"
                        }`}
                      >
                        {shop.is_open ? "Open" : "Closed"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Shop Details */}
              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-white/30 mt-0.5 shrink-0" />
                  <p className="text-white/60 text-sm">{shop.address}</p>
                </div>

                {shop.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-white/30 shrink-0" />
                    <p className="text-white/60 text-sm">{shop.phone}</p>
                  </div>
                )}

                {/* Pricing */}
                <div className="flex items-center gap-4 pt-2 border-t border-white/5">
                  <div className="flex items-center gap-1.5">
                    <IndianRupee className="h-3.5 w-3.5 text-white/30" />
                    <span className="text-white/50 text-xs">B&W:</span>
                    <span className="text-white text-sm font-medium">
                      ₹{shop.price_bw_per_page}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <IndianRupee className="h-3.5 w-3.5 text-white/30" />
                    <span className="text-white/50 text-xs">Color:</span>
                    <span className="text-white text-sm font-medium">
                      ₹{shop.price_color_per_page}
                    </span>
                  </div>
                </div>

                {/* Created Date */}
                <p className="text-white/20 text-xs">
                  Added{" "}
                  {new Date(shop.created_at).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
