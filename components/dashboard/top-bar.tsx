"use client"

import { Bell, Settings, LogOut, User as UserIcon, Settings as SettingsIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

import { DashboardMobileNav } from "./mobile-nav"

export function DashboardTopBar() {
  const router = useRouter()
  const supabase = createClient()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    toast.success("Logged out successfully")
    router.push("/")
    router.refresh()
  }

  return (
    <header className="flex items-center justify-between px-4 md:px-6 py-4 bg-white/60 backdrop-blur-lg border-b border-black/5 sticky top-0 z-30">
      <div className="flex items-center gap-2 md:gap-4">
        <DashboardMobileNav />
        <h1 className="text-lg md:text-xl font-semibold text-[#0a1128] truncate max-w-[150px] sm:max-w-none">
          Dashboard
        </h1>
        <Badge variant="secondary" className="hidden sm:flex bg-emerald-500/15 text-emerald-600 hover:bg-emerald-500/25 border-0 gap-1.5 px-3">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          Online
        </Badge>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="text-[#5b637a] hover:text-[#0a1128] hover:bg-black/5 relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-blue-500 rounded-full border-2 border-white" />
        </Button>

        <Button variant="ghost" size="icon" className="text-[#5b637a] hover:text-[#0a1128] hover:bg-black/5">
          <Settings className="w-5 h-5" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-10 w-10 rounded-full ml-2 hover:bg-black/5">
              <Avatar className="h-10 w-10 border border-black/5">
                <AvatarImage src="/placeholder-user.jpg" alt="User" />
                <AvatarFallback className="bg-[#0a1128]/10 text-[#0a1128] font-medium">S</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-64 bg-white border-black/10" align="end" forceMount>
            <div className="flex items-center gap-4 p-4">
              <Avatar className="h-10 w-10 border border-black/5">
                <AvatarImage src="/placeholder-user.jpg" alt="User" />
                <AvatarFallback className="bg-[#0a1128]/10 text-[#0a1128] font-medium">S</AvatarFallback>
              </Avatar>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none text-[#0a1128]">User</p>
                <p className="text-xs leading-none text-[#5b637a]">soham@gmail.com</p>
              </div>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem className="cursor-pointer">
                <UserIcon className="mr-2 h-4 w-4" />
                <span>Profile Settings</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                <SettingsIcon className="mr-2 h-4 w-4" />
                <span>Preferences</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-500/10" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Sign Out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
