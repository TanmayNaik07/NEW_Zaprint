// Shop-related TypeScript type definitions

export interface Shop {
  id: string
  owner_id: string
  shop_name: string
  phone: string
  location: string
  description: string | null
  image_url: string | null
  start_time: string // HH:MM:SS format
  end_time: string // HH:MM:SS format
  non_working_days: string[] // e.g., ["Sunday", "Saturday"]
  status: 'open' | 'closed' | 'error'
  is_onboarded: boolean
  is_payment_onboarded: boolean
  razorpay_account_id: string | null
  created_at: string
  updated_at: string
}

export interface ShopService {
  id: string
  shop_id: string
  service_name: string
  price: number
  created_at: string
}

export interface ShopResource {
  id: string
  shop_id: string
  resource_name: string
  created_at: string
}

export interface ShopPrinter {
  id: string
  shop_id: string
  printer_name: string
  printer_type: string
  supported_services: string[]
  supported_sizes: string[]
  status: 'online' | 'offline' | 'error'
  last_heartbeat: string | null
  created_at: string
}

// Extended type with all relations
export interface ShopWithDetails extends Shop {
  services: ShopService[]
  resources: ShopResource[]
  printers: ShopPrinter[]
}

// Helper type for shop card display
export interface ShopCardData {
  id: string
  name: string
  location: string
  description: string | null
  phone: string
  imageUrl: string | null
  status: Shop['status']
  startTime: string
  endTime: string
  nonWorkingDays: string[]
  services: ShopService[]
  onlinePrinters: number
  totalPrinters: number
}

// Utility functions
export function isShopCurrentlyOpen(shop: Shop): boolean {
  if (shop.status !== 'open') return false
  
  const now = new Date()
  const currentDay = now.toLocaleDateString('en-US', { weekday: 'long' })
  
  // Check if today is a non-working day
  if (shop.non_working_days.includes(currentDay)) return false
  
  // Check if current time is within operating hours
  const currentTime = now.toTimeString().slice(0, 5) // HH:MM format
  return currentTime >= shop.start_time.slice(0, 5) && currentTime <= shop.end_time.slice(0, 5)
}

export function getShopDisplayStatus(shop: Shop): {
  label: string
  variant: 'default' | 'secondary' | 'destructive'
} {
  if (shop.status === 'error') {
    return { label: 'Error', variant: 'destructive' }
  }
  
  const isOpen = isShopCurrentlyOpen(shop)
  
  if (isOpen) {
    return { label: 'Open', variant: 'default' }
  } else {
    return { label: 'Closed', variant: 'secondary' }
  }
}

export function formatOperatingHours(startTime: string, endTime: string): string {
  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':')
    const hour = parseInt(hours)
    const ampm = hour >= 12 ? 'PM' : 'AM'
    const displayHour = hour % 12 || 12
    return `${displayHour}:${minutes} ${ampm}`
  }
  
  return `${formatTime(startTime)} - ${formatTime(endTime)}`
}

export function getServiceByName(services: ShopService[], name: string): ShopService | undefined {
  return services.find(s => s.service_name.toLowerCase() === name.toLowerCase())
}
