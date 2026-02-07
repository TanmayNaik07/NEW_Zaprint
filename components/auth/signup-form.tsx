"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"

export function SignupForm() {
  const router = useRouter()
  const supabase = createClient()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showVerificationMessage, setShowVerificationMessage] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    address: "",
    phone: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      // Validate name length
      if (formData.name.length < 3) {
        throw new Error("Full name must be at least 3 characters")
      }

      // Validate password length
      if (formData.password.length < 8) {
        throw new Error("Password must be at least 8 characters")
      }

      // Validate phone number (India format: 10 digits, starts with 6-9)
      const phoneRegex = /^[6-9]\d{9}$/
      if (!phoneRegex.test(formData.phone)) {
        throw new Error("Phone number must be a valid 10-digit Indian number")
      }

      // Sign up with Supabase with email verification
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          data: {
            name: formData.name,
            address: formData.address,
            phone_number: formData.phone,
          },
        },
      })

      if (signUpError) throw signUpError

      // Check if email confirmation is required
      if (data?.user && !data.session) {
        // Email confirmation required - show verification message
        toast.success("Please check your email to verify your account")
        setShowVerificationMessage(true)
      } else if (data?.session) {
        // Success! Try to create profile manually just in case trigger is gone
        // This is "best effort" - if it fails (e.g. RLS), the user is still created/logged in
        try {
            await supabase.from('profiles').upsert({
                id: data.user.id,
                email: formData.email,
                full_name: formData.name,
                address: formData.address,
                phone_number: formData.phone,
                updated_at: new Date().toISOString()
            })
        } catch (profileError) {
            console.error("Manual profile creation failed", profileError)
            // Continue anyway, we can fix profile later
        }

        toast.success("Account created successfully!")
        router.push("/dashboard")
        router.refresh()
      }
    } catch (err: any) {
      console.error("Signup error:", err)
      setError(err.message || "Failed to create account")
      toast.error(err.message || "Failed to create account")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      {showVerificationMessage ? (
        <div className="space-y-4">
          <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20">
            <h3 className="text-green-500 font-semibold mb-2">Check your email!</h3>
            <p className="text-muted-foreground text-sm">
              We've sent a verification link to <strong>{formData.email}</strong>
            </p>
            <p className="text-muted-foreground text-sm mt-2">
              Click the link in the email to verify your account, then return here to log in.
            </p>
          </div>
          <Button
            onClick={() => router.push("/login")}
            className="w-full h-11 bg-primary text-primary-foreground hover:bg-primary/90 rounded-full font-medium shadow-lg shadow-primary/25"
          >
            Go to Login
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-foreground text-sm font-medium">
              Full Name
            </Label>
            <Input
              id="name"
              type="text"
              placeholder="John Doe"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              className="h-11 bg-white/5 border-white/10 text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-primary/20"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-foreground text-sm font-medium">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              className="h-11 bg-white/5 border-white/10 text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-primary/20"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-foreground text-sm font-medium">
              Password
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Create a secure password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                className="h-11 bg-white/5 border-white/10 text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-primary/20 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-muted-foreground text-xs">Must be at least 8 characters</p>
          </div>

          <div className="space-y-2">
             <Label htmlFor="address" className="text-foreground text-sm font-medium">
               Address
             </Label>
             <Input
               id="address"
               type="text"
               placeholder="123 Main St, City"
               value={formData.address}
               onChange={(e) => setFormData({ ...formData, address: e.target.value })}
               required
               className="h-11 bg-white/5 border-white/10 text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-primary/20"
             />
           </div>

           <div className="space-y-2">
             <Label htmlFor="phone" className="text-foreground text-sm font-medium">
               Phone Number
             </Label>
             <Input
               id="phone"
               type="tel"
               placeholder="+1 (555) 000-0000"
               value={formData.phone}
               onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
               required
               className="h-11 bg-white/5 border-white/10 text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-primary/20"
             />
           </div>

          {error && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20">
              <p className="text-red-500 text-sm">{error}</p>
            </div>
          )}

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full h-11 bg-primary text-primary-foreground hover:bg-primary/90 rounded-full font-medium shadow-lg shadow-primary/25"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Creating account...
              </>
            ) : (
              "Create Account"
            )}
          </Button>

          <p className="text-muted-foreground text-xs text-center">
            By signing up, you agree to our{" "}
            <a href="#" className="text-primary hover:underline">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="text-primary hover:underline">
              Privacy Policy
            </a>
          </p>
        </form>
      )}
    </>
  )
}
