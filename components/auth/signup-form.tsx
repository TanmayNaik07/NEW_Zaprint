"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"

export function SignupForm() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Mock registration - redirect to dashboard
    setTimeout(() => {
      setIsLoading(false)
      router.push("/dashboard")
    }, 1000)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="fullName" className="text-foreground text-sm font-medium">
          Full Name
        </Label>
        <Input
          id="fullName"
          type="text"
          placeholder="John Doe"
          value={formData.fullName}
          onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
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
  )
}
