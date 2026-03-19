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
  shop_name: string
  description: string
  location: string
  phone: string
  image_url: string
  status: "open" | "closed" | "error"
  is_onboarded: boolean
  created_at: string
  owner_id: string | null
  services?: { service_name: string; price: number }[]
}

export default function AdminShopsPage() {
  const [shops, setShops] = useState<Shop[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState("")
  const supabase = createClient()

  useEffect(() => {
    fetchShops()

    // Realtime subscription
    const channel = supabase
      .channel('admin-shops-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'shops' },
        (payload) => {
          console.log('Shop change received:', payload)
          if (payload.eventType === 'UPDATE') {
            setShops(prev => prev.map(s => s.id === payload.new.id ? { ...s, ...payload.new } : s))
          } else if (payload.eventType === 'INSERT') {
            setShops(prev => [payload.new as Shop, ...prev])
          } else if (payload.eventType === 'DELETE') {
            setShops(prev => prev.filter(s => s.id !== payload.old.id))
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  async function fetchShops() {
    const { data, error } = await supabase
      .from("shops")
      .select("*, services:shop_services(service_name, price)")
      .order("created_at", { ascending: false })

    if (!error && data) {
      setShops(data as any)
    }
    setIsLoading(false)
  }

  const filtered = shops.filter((s) => {
    if (!search) return true
    const q = search.toLowerCase()
    return (
      (s.shop_name || "").toLowerCase().includes(q) ||
      (s.location || "").toLowerCase().includes(q) ||
      (s.phone || "").includes(q)
    )
  })

  const openCount = shops.filter((s) => s.status === "open").length

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-700">
        <div className="flex flex-col gap-2">
          <div className="inline-flex items-center gap-2 bg-[#0a1128]/5 border border-[#0a1128]/10 text-[#0a1128] px-3 py-1 rounded-full text-[10px] tracking-widest font-bold uppercase w-fit mb-2">
            <span className="w-1.5 h-1.5 bg-[#0a1128] rounded-full animate-pulse" />
            Partner Network
          </div>
          <h1 className="text-4xl font-black text-[#0a1128] tracking-tight uppercase leading-none">
            PRINT <span className="text-[#0a1128]/40">SHOPS</span>
          </h1>
          <p className="text-[#5b637a] font-medium text-lg">Loading shops...</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-[250px] rounded-[2.5rem] bg-white/50 animate-pulse border border-black/5 shadow-sm"
            />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
        <div className="flex flex-col gap-2">
          <div className="inline-flex items-center gap-2 bg-[#0a1128]/5 border border-[#0a1128]/10 text-[#0a1128] px-3 py-1 rounded-full text-[10px] tracking-widest font-bold uppercase w-fit mb-2">
            <span className="w-1.5 h-1.5 bg-[#0a1128] rounded-full" />
            Partner Network
          </div>
          <h1 className="text-4xl font-black text-[#0a1128] tracking-tight uppercase leading-none">
            PRINT <span className="text-[#0a1128]/40">SHOPS</span>
          </h1>
          <p className="text-[#5b637a] font-medium text-lg">
            {shops.length} total shops · <span className="text-emerald-600">{openCount} currently open</span>
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:max-w-md group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#0a1128]/30 group-focus-within:text-[#0a1128] transition-colors" />
          <input
            type="text"
            placeholder="Search by name or address..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/80 backdrop-blur-sm border border-black/5 text-[#0a1128] font-bold placeholder:text-[#0a1128]/20 focus:outline-none focus:border-[#0a1128]/20 focus:bg-white transition-all shadow-sm"
          />
        </div>
      </div>

      {/* Shops Grid */}
      {filtered.length === 0 ? (
        <div className="rounded-[3rem] border-2 border-dashed border-black/5 bg-black/5 p-20 text-center">
          <Store className="h-16 w-16 text-[#0a1128]/10 mx-auto mb-4" />
          <p className="text-[#0a1128] font-black uppercase tracking-tight text-xl">No shops found</p>
          <p className="text-[#5b637a] font-medium mt-1">Try adjusting your search criteria</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((shop) => (
            <div
              key={shop.id}
              className={`rounded-[2.5rem] border border-black/5 p-8 transition-all hover:translate-y-[-4px] hover:shadow-2xl shadow-xl shadow-black/[0.02] bg-white/80 backdrop-blur-sm relative overflow-hidden group`}
            >
              {/* Status Indicator */}
              <div className={`absolute top-0 right-0 px-6 py-2 rounded-bl-3xl font-black uppercase text-[10px] tracking-widest ${
                shop.status === "open" ? "bg-emerald-500/10 text-emerald-600" : "bg-red-500/10 text-red-600"
              }`}>
                {shop.status === "open" ? "Online" : "Offline"}
              </div>

              {/* Shop Header */}
              <div className="flex items-center gap-4 mb-8">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${
                  shop.status === "open" ? "bg-emerald-500/10" : "bg-red-500/10"
                }`}>
                  <Store className={`h-7 w-7 ${
                    shop.status === "open" ? "text-emerald-600" : "text-red-600"
                  }`} />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-[#0a1128] font-black uppercase tracking-tight text-xl leading-tight">
                    {shop.shop_name || "Untitled Shop"}
                  </h3>
                  <p className="text-[#5b637a] text-[10px] font-bold mt-1 uppercase tracking-widest">
                    ID: {shop.id.slice(0, 8)}
                  </p>
                </div>
              </div>

              {/* Shop Details */}
              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-3 p-4 rounded-2xl bg-[#0a1128]/5 border border-[#0a1128]/10">
                    <MapPin className="h-4 w-4 text-[#0a1128] mt-0.5 shrink-0" />
                    <p className="text-[#0a1128] text-sm font-bold leading-tight">
                      {shop.location || "No address provided"}
                    </p>
                  </div>

                  {shop.phone && (
                    <div className="flex items-center gap-3 px-4">
                      <Phone className="h-4 w-4 text-[#0a1128]/40 shrink-0" />
                      <p className="text-[#5b637a] text-sm font-bold">{shop.phone}</p>
                    </div>
                  )}
                </div>

                {/* Pricing Display */}
                <div className="grid grid-cols-2 gap-3 pt-6 border-t border-black/5">
                  {shop.services && shop.services.length > 0 ? (
                    shop.services.slice(0, 4).map((service, idx) => (
                      <div key={idx} className="p-3 rounded-2xl bg-[#0a1128]/5 text-center">
                        <p className="text-[10px] uppercase font-black text-[#0a1128]/40 tracking-widest mb-1 truncate">
                          {service.service_name}
                        </p>
                        <p className="text-[#0a1128] font-black">₹{service.price}</p>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-2 p-3 rounded-2xl bg-[#0a1128]/5 text-center">
                      <p className="text-[10px] uppercase font-black text-[#0a1128]/40 tracking-widest">No pricing set</p>
                    </div>
                  )}
                </div>

                {/* Footer Info */}
                <div className="flex items-center justify-between pt-2">
                  <p className="text-[#5b637a]/40 text-[10px] uppercase font-black tracking-widest">
                    Added {new Date(shop.created_at).toLocaleDateString("en-IN", { month: 'short', year: 'numeric' })}
                  </p>
                  <div className={`w-2 h-2 rounded-full ${shop.status === "open" ? "bg-emerald-500 animate-pulse" : "bg-red-500"}`} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
