
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, MapPin } from "lucide-react"
import { toast } from "sonner"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"

interface OnboardingModalProps {
  isOpen: boolean
}

export function OnboardingModal({ isOpen }: OnboardingModalProps) {
  const router = useRouter()
  const supabase = createClient()
  const [isLoading, setIsLoading] = useState(false)

  // We rely on the parent to control visibility mostly, but can have local state for UX 
  // ensuring it stays open until submitted or user has required data
  const [open, setOpen] = useState(isOpen)

  const [formData, setFormData] = useState({
    phone: "",
    flat_no: "",
    area: "",
    town: "",
    city: "",
    state: "",
    pincode: "",
  })

  // Prevent closing
  const handleOpenChange = (newOpen: boolean) => {
    // Determine if we should allow closing. 
    // If we want it mandatory, we force it to remain open if isOpen prop is true.
    // Ideally we just don't let them close it if it's mandatory.
    if (!newOpen && isOpen) {
      return // Do nothing, keep it open
    }
    setOpen(newOpen)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Validate phone number (India format: 10 digits, starts with 6-9)
      const phoneRegex = /^[6-9]\d{9}$/
      if (!phoneRegex.test(formData.phone)) {
        throw new Error("Phone number must be a valid 10-digit Indian number")
      }

      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error("No user found")

      console.log("Updating profile for user:", user.id)

      // Update profile using upsert to handle case where profile row might be missing
      // FIXED: Using 'name' instead of 'full_name' as per user schema
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          email: user.email,
          name: user.user_metadata?.name || '',
          phone_number: formData.phone,
          flat_no: formData.flat_no,
          area: formData.area,
          town: formData.town,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode,
          address: `${formData.flat_no}, ${formData.area}, ${formData.town}, ${formData.city}, ${formData.state} - ${formData.pincode}`
        })

      if (error) throw error

      toast.success("Profile completed successfully!")
      setOpen(false) // Close modal locally
      router.refresh() // Refresh to update server-side check and remove modal from parent
    } catch (err: any) {
      console.error("Onboarding error:", err)
      toast.error(err.message || "Failed to update profile")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent
        className="max-w-2xl bg-white border-black/10"
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      // showCloseButton={false} // Not supported by standard Shadcn component usually, handled by CSS or primitive modification if needed
      >
        <DialogHeader className="text-center sm:text-center">
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 bg-[#0a1128]/10 rounded-xl flex items-center justify-center text-[#0a1128]">
              <MapPin className="w-6 h-6" />
            </div>
          </div>
          <DialogTitle className="text-2xl font-bold text-center text-[#0a1128]">Complete your profile</DialogTitle>
          <DialogDescription className="text-center text-[#5b637a]">
            We need a few more details to deliver your prints.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="phone" className="text-[#0a1128]">Phone Number</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="9876543210"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              required
              className="bg-white/80 border-black/10 text-[#0a1128] placeholder:text-[#5b637a]"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="flat_no" className="text-[#0a1128]">Flat / House No.</Label>
              <Input
                id="flat_no"
                placeholder="Flat 101, Galaxy Apts"
                value={formData.flat_no}
                onChange={(e) => setFormData({ ...formData, flat_no: e.target.value })}
                required
                className="bg-white/80 border-black/10 text-[#0a1128] placeholder:text-[#5b637a]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="area" className="text-[#0a1128]">Area / Sector</Label>
              <Input
                id="area"
                placeholder="HSR Layout"
                value={formData.area}
                onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                required
                className="bg-white/80 border-black/10 text-[#0a1128] placeholder:text-[#5b637a]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="town" className="text-[#0a1128]">Town / Locality</Label>
              <Input
                id="town"
                placeholder="Bandra West"
                value={formData.town}
                onChange={(e) => setFormData({ ...formData, town: e.target.value })}
                required
                className="bg-white/80 border-black/10 text-[#0a1128] placeholder:text-[#5b637a]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="city" className="text-[#0a1128]">City</Label>
              <Input
                id="city"
                placeholder="Mumbai"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                required
                className="bg-white/80 border-black/10 text-[#0a1128] placeholder:text-[#5b637a]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="state" className="text-[#0a1128]">State</Label>
              <Input
                id="state"
                placeholder="Maharashtra"
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                required
                className="bg-white/80 border-black/10 text-[#0a1128] placeholder:text-[#5b637a]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pincode" className="text-[#0a1128]">Pincode</Label>
              <Input
                id="pincode"
                placeholder="400050"
                value={formData.pincode}
                onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                required
                className="bg-white/80 border-black/10 text-[#0a1128] placeholder:text-[#5b637a]"
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full h-11 text-base mt-4"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              "Complete Setup"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
