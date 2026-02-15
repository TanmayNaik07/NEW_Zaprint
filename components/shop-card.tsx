"use client"

import { useRouter } from "next/navigation"
import { TrailCard } from "@/components/ui/trail-card"
import type { ShopWithDetails } from "@/lib/types/shop"
import { isShopCurrentlyOpen, formatOperatingHours, getServiceByName } from "@/lib/types/shop"

interface ShopCardProps {
  shop: ShopWithDetails
}

export function ShopCard({ shop }: ShopCardProps) {
  const router = useRouter()
  const isOpen = isShopCurrentlyOpen(shop)
  const bwService = getServiceByName(shop.services, 'B&W Print')

  // Format price display
  const priceDisplay = bwService
    ? `₹${bwService.price.toFixed(2)}`
    : "Varies"

  // Format hours display
  const hoursDisplay = formatOperatingHours(shop.start_time, shop.end_time)

  // Handle navigation
  const handleNavigate = () => {
    router.push(`/dashboard/shops/${shop.id}/print`)
  }

  // Handle directions click (could open map or just go to shop page)
  const handleDirections = (e?: React.MouseEvent) => {
    e?.stopPropagation()
    // Open google maps with query
    window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(shop.location)}`, '_blank')
  }

  return (
    <div onClick={handleNavigate} className="cursor-pointer h-full">
      <TrailCard
        imageUrl={shop.image_url || "https://images.unsplash.com/photo-1562564055-71e051d33c19?q=80&w=2070&auto=format&fit=crop"}
        mapImageUrl="https://www.thiings.co/_next/image?url=https%3A%2F%2Flftz25oez4aqbxpq.public.blob.vercel-storage.com%2Fimage-3JYNLpogg5zknunPABpdOpEjJmZN5R.png&w=320&q=75"
        title={shop.shop_name}
        location={shop.location}
        difficulty={isOpen ? "Open Now" : "Closed"}
        creators={shop.phone}
        distance="1.2km" // Mock distance for now
        elevation={priceDisplay}
        duration={hoursDisplay.split(' - ')[0]} // Show start time or simplified hours
        onDirectionsClick={() => handleDirections()} // This will trigger the map
        className="h-full border-border/50 hover:border-border transition-colors bg-card/50 backdrop-blur-sm"
      />
    </div>
  )
}
