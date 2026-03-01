"use client"

import { useRouter } from "next/navigation"
import type { ShopWithDetails } from "@/lib/types/shop"
import { isShopCurrentlyOpen, formatOperatingHours, getServiceByName } from "@/lib/types/shop"
import { motion } from "framer-motion"
import { useMemo } from "react"

interface ShopCardProps {
  shop: ShopWithDetails
}

export function ShopCard({ shop }: ShopCardProps) {
  const router = useRouter()
  const isOpen = isShopCurrentlyOpen(shop)
  const bwService = getServiceByName(shop.services, 'B&W Print')

  // Generate a consistent random rotation for this card
  const rotation = useMemo(() => {
    // Generate an integer between -3 and 3 degrees
    const deg = Math.floor(Math.random() * 7) - 3
    return `${deg}deg`
  }, [shop.id])

  // Format price display
  const priceDisplay = bwService
    ? `₹${bwService.price.toFixed(2)}`
    : "Varies"

  // Handle navigation
  const handleNavigate = () => {
    router.push(`/dashboard/shops/${shop.id}/print`)
  }

  // Handle directions click
  const handleDirections = (e?: React.MouseEvent) => {
    e?.stopPropagation()
    // Open google maps with query
    window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(shop.location)}`, '_blank')
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, rotate: 0 }}
      animate={{ opacity: 1, y: 0, rotate: rotation }}
      transition={{ duration: 0.5, type: "spring", stiffness: 120 }}
      className="group cursor-pointer h-full relative"
      onClick={handleNavigate}
    >
      {/* Polaroid Card Wrapper */}
      <div
        className="relative bg-[#fdfbf7] p-[6%] pb-[14%] rounded-sm shadow-[4px_4px_15px_rgba(0,0,0,0.15)] transition-all duration-300 group-hover:shadow-[8px_8px_30px_rgba(0,0,0,0.25)] group-hover:scale-[1.03] group-hover:-translate-y-2 h-[100%] flex flex-col min-h-[380px]"
        style={{
          backgroundImage: `url('/images/paper-texture.png')`,
          backgroundSize: 'cover',
          backgroundBlendMode: 'multiply',
        }}
      >
        {/* Red Push Pin */}
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20 transition-transform duration-300 group-hover:-translate-y-1">
          {/* Shadow of the pin */}
          <div className="absolute top-4 left-3 w-4 h-4 bg-black/30 rounded-full blur-[3px]" />

          {/* Pin Top */}
          <div className="relative w-8 h-8 rounded-full bg-gradient-to-br from-[#ef4444] via-[#dc2626] to-[#991b1b] border border-[#7f1d1d] shadow-sm flex items-center justify-center">
            {/* Highlight */}
            <div className="absolute top-[4px] left-[6px] w-[8px] h-[5px] rounded-full bg-white opacity-40 rotate-12" />
            <div className="absolute top-[3px] left-[5px] w-[3px] h-[3px] rounded-full bg-white opacity-70" />

            {/* Pin Needle Base Ring */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full border border-black/20" />
          </div>

          {/* Pin Needle */}
          <div className="absolute top-[28px] left-1/2 w-[3px] h-[16px] -translate-x-1/2 bg-gradient-to-r from-zinc-300 via-zinc-100 to-zinc-400 border border-zinc-500 rounded-b-full shadow-[-1px_2px_1px_rgba(0,0,0,0.2)] -z-10 origin-top rotate-[-10deg]" />
        </div>

        {/* Polaroid Image Container */}
        <div className="relative aspect-square w-full bg-[#eeeae0] mb-6 overflow-hidden border border-black/10 shadow-[inset_0px_2px_8px_rgba(0,0,0,0.05)]">
          <img
            src={shop.image_url || "https://images.unsplash.com/photo-1562564055-71e051d33c19?q=80&w=2070&auto=format&fit=crop"}
            alt={shop.shop_name}
            className="w-full h-full object-cover grayscale-[20%] sepia-[15%] group-hover:grayscale-0 group-hover:sepia-0 transition-all duration-500 scale-105 group-hover:scale-100"
          />
          {/* Subtle vintage vignette overlay */}
          <div className="absolute inset-0 bg-[radial-gradient(circle,transparent_55%,rgba(58,49,32,0.3)_150%)] pointer-events-none mix-blend-multiply" />
        </div>

        {/* Text Content */}
        <div className="relative z-10 flex flex-col flex-grow items-center text-center pb-2">
          <h3 className="font-rubik-dirt text-[#1a1408] text-2xl md:text-3xl tracking-wide uppercase mb-2">
            {shop.shop_name}
          </h3>
          <p className="text-[#6b5d45] text-xs font-semibold tracking-widest uppercase mb-4 opacity-90 mx-auto max-w-[95%] line-clamp-2 leading-relaxed">
            {shop.location}
          </p>

          <div className="mt-auto w-full flex flex-col items-center">
            {/* Dashed line separator */}
            <div className="border-t-[2px] border-dashed border-[#1a1408]/30 w-[80%] mb-4" />

            <div className="flex items-center justify-center gap-6 w-full">
              <div className="flex flex-col items-center">
                <span className="text-[10px] text-[#6b5d45] font-bold uppercase tracking-widest mb-1">Starting At</span>
                <span className="font-rubik-dirt text-[#1a1408] text-2xl leading-none">
                  {priceDisplay}
                </span>
              </div>

              <div className="h-8 w-px bg-[#1a1408]/20" />

              <div className="flex flex-col items-center">
                <span className="text-[10px] text-[#6b5d45] font-bold uppercase tracking-widest mb-1">Status</span>
                <span className={`px-3 py-1 text-[11px] font-black uppercase tracking-widest rounded-sm ${isOpen ? 'text-[#15803d] bg-[#dcfce7] border border-[#166534]/30 shadow-[1px_1px_0px_#166534]' : 'text-[#b91c1c] bg-[#fee2e2] border border-[#991b1b]/30 shadow-[1px_1px_0px_#991b1b]'}`}>
                  {isOpen ? "Open" : "Closed"}
                </span>
              </div>
            </div>

            <div className="mt-5 w-full">
              <button
                onClick={handleDirections}
                className="group/btn relative inline-flex items-center justify-center w-full bg-transparent overflow-hidden"
              >
                <span className="text-xs font-black uppercase tracking-[0.2em] text-[#3a3120] border-b-2 border-[#3a3120]/30 pb-0.5 group-hover/btn:border-[#3a3120] transition-colors">
                  Get Directions
                </span>
              </button>
            </div>
          </div>
        </div>

      </div>
    </motion.div>
  )
}
