
"use client"

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, Phone, Clock, ArrowRight } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

interface ShopCardProps {
  id: string
  name: string
  description: string
  address: string
  phone: string | null
  imageUrl: string | null
  isOpen: boolean
  priceBw: number
  priceColor: number
}

export function ShopCard({
  id,
  name,
  description,
  address,
  phone,
  imageUrl,
  isOpen,
  priceBw,
  priceColor,
}: ShopCardProps) {
  return (
    <Card className="overflow-hidden border-white/10 bg-white/5 hover:bg-white/10 transition-all duration-300 group">
      <div className="relative h-48 w-full">
        {imageUrl ? (
            <Image
            src={imageUrl}
            alt={name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
        ) : (
             <div className="w-full h-full bg-primary/10 flex items-center justify-center">
                 <StoreIcon className="w-12 h-12 text-primary/40" />
            </div>
        )}
        <div className="absolute top-2 right-2">
          <Badge variant={isOpen ? "default" : "secondary"} className={isOpen ? "bg-green-500/80 hover:bg-green-500" : "bg-red-500/80 hover:bg-red-500"}>
            {isOpen ? "Open" : "Closed"}
          </Badge>
        </div>
      </div>
      
      <CardHeader className="p-4 pb-2">
        <h3 className="text-xl font-semibold text-foreground line-clamp-1">{name}</h3>
        <p className="text-sm text-muted-foreground line-clamp-2 min-h-[40px]">{description || "No description available."}</p>
      </CardHeader>
      
      <CardContent className="p-4 pt-0 space-y-3">
        <div className="flex items-start gap-2 text-sm text-muted-foreground">
          <MapPin className="w-4 h-4 shrink-0 mt-0.5 text-primary" />
          <span className="line-clamp-2">{address}</span>
        </div>
        {phone && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Phone className="w-4 h-4 shrink-0 text-primary" />
            <span>{phone}</span>
          </div>
        )}
        
        <div className="flex items-center justify-between pt-2 border-t border-white/10">
          <div className="text-sm">
            <span className="text-muted-foreground">B&W: </span>
            <span className="font-semibold text-foreground">${priceBw}</span>
          </div>
          <div className="text-sm">
            <span className="text-muted-foreground">Color: </span>
            <span className="font-semibold text-foreground">${priceColor}</span>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="p-4 pt-0">
        <Button asChild className="w-full gap-2 group-hover:bg-primary group-hover:text-primary-foreground">
          <Link href={`/dashboard/shops/${id}/print`}>
            Order Prints <ArrowRight className="w-4 h-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}

function StoreIcon({ className }: { className?: string }) {
    return (
        <svg
            className={className}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7" />
            <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
            <path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4" />
            <path d="M2 7h20" />
            <path d="M22 7v3a2 2 0 0 1-2 2v0a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 16 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 12 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 8 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 4 12v0a2 2 0 0 1-2-2V7" />
        </svg>
    )
}
