"use client"

import { Bell, LogOut, Shield, LayoutDashboard } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { AdminMobileNav } from "./admin-mobile-nav"
import Link from "next/link"

export function AdminTopBar() {
  const router = useRouter()
  const supabase = createClient()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    toast.success("Logged out successfully")
    router.push("/")
    router.refresh()
  }

  return (
    <header className="flex items-center justify-between px-4 md:px-6 py-4 bg-white/60 backdrop-blur-lg border-b border-black/5 sticky top-0 z-30 zaprint-theme">
      <div className="flex items-center gap-2 md:gap-4">
        <AdminMobileNav />
        <h1 className="text-lg md:text-xl font-bold text-[#0a1128] uppercase tracking-tighter truncate max-w-[150px] sm:max-w-none">
          Admin <span className="hidden sm:inline">Panel</span>
        </h1>
        <Badge variant="secondary" className="hidden sm:flex bg-[#0a1128]/5 text-[#0a1128] border-[#0a1128]/10 gap-1.5 px-3">
          <span className="w-1.5 h-1.5 rounded-full bg-[#0a1128] animate-pulse" />
          System Active
        </Badge>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="text-[#5b637a] hover:text-[#0a1128] hover:bg-black/5 relative hidden sm:flex">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-10 w-10 md:h-12 md:w-12 rounded-full ml-2 hover:bg-black/5 p-0">
              <Avatar className="h-10 w-10 md:h-12 md:w-12 border border-black/10">
                <AvatarFallback className="bg-[#0a1128]/10 text-[#0a1128] font-bold">ZA</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-64 bg-white border-black/10 rounded-2xl shadow-xl p-2" align="end">
            <div className="flex items-center gap-4 p-3">
              <Avatar className="h-10 w-10 border border-black/5">
                <AvatarFallback className="bg-[#0a1128]/10 text-[#0a1128] font-bold">ZA</AvatarFallback>
              </Avatar>
              <div className="flex flex-col min-w-0">
                <p className="text-sm font-bold text-[#0a1128] truncate">Admin</p>
                <p className="text-xs text-[#5b637a] truncate">zaprint.official@gmail.com</p>
              </div>
            </div>
            <DropdownMenuSeparator className="bg-black/5" />
            <DropdownMenuItem asChild className="cursor-pointer rounded-xl focus:bg-[#0a1128]/5">
              <Link href="/dashboard" className="flex items-center w-full">
                <LayoutDashboard className="mr-2 h-4 w-4 text-[#0a1128]" />
                <span>User Dashboard</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-black/5" />
            <DropdownMenuItem className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-500/10 rounded-xl" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Sign Out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
