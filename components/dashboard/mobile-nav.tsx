"use client"

import { useEffect, useState } from "react"
import { Menu, Printer, LayoutDashboard, Store, FileText, HelpCircle, Settings, LogOut, MessageSquareText, UserCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

export function DashboardMobileNav() {
  const [open, setOpen] = useState(false)
  const [user, setUser] = useState<{ name: string; email: string } | null>(null)
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    async function getUser() {
      const { data: { user: authUser } } = await supabase.auth.getUser()
      if (authUser) {
        setUser({
          name: authUser.user_metadata?.name || authUser.email?.split("@")[0] || "User",
          email: authUser.email || "",
        })
      }
    }
    getUser()
  }, [supabase.auth])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    toast.success("Logged out successfully")
    router.push("/")
    router.refresh()
  }

  const navItems = [
    { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { name: "Print Shops", href: "/dashboard/shops", icon: Store },
    { name: "My Orders", href: "/dashboard/orders", icon: FileText },
    { name: "Feedback", href: "/dashboard/feedback", icon: MessageSquareText },
    { name: "How to Use", href: "/dashboard/how-to-use", icon: HelpCircle },
  ]

  const userInitials = user?.name
    ? user.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)
    : "U"

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden text-[#0a1128]">
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0 w-[280px] border-r-0 bg-[#f7f6f4]">
        {/* Paper texture background overlay */}
        <div
          className="absolute inset-0 z-0 pointer-events-none opacity-[0.15]"
          style={{
            backgroundImage: "url('/images/paper-texture.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            mixBlendMode: "multiply",
          }}
        />
        
        <div className="relative z-10 flex flex-col h-full">
          <SheetHeader className="p-6 border-b border-black/5 bg-white/50 backdrop-blur-md">
            <SheetTitle className="text-left">
              <Link href="/" className="flex items-center gap-3" onClick={() => setOpen(false)}>
                <div className="w-10 h-10 rounded-xl bg-[#0a1128] flex items-center justify-center shrink-0 p-2 shadow-sm">
                  <img src="/Zaprint_Logo.png" alt="Zaprint Logo" className="w-full h-full object-contain" />
                </div>
                <span className="text-xl font-bold text-[#0a1128]">Zaprint</span>
              </Link>
            </SheetTitle>
          </SheetHeader>

          <ScrollArea className="flex-1 px-4 py-6">
            <div className="space-y-2">
              {navItems.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-2xl transition-all",
                      isActive
                        ? "bg-[#0a1128] text-white shadow-lg shadow-[#0a1128]/20"
                        : "text-[#5b637a] hover:bg-black/5 hover:text-[#0a1128]"
                    )}
                  >
                    <item.icon className={cn("h-5 w-5", isActive ? "text-white" : "text-current")} />
                    <span className="font-semibold">{item.name}</span>
                  </Link>
                )
              })}
            </div>
          </ScrollArea>

          <div className="p-4 bg-white/50 backdrop-blur-md border-t border-black/5 space-y-2">
            <Link
              href="/dashboard/settings"
              onClick={() => setOpen(false)}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-2xl transition-all",
                pathname === "/dashboard/settings"
                  ? "bg-[#0a1128] text-white shadow-lg shadow-[#0a1128]/20"
                  : "text-[#5b637a] hover:bg-black/5 hover:text-[#0a1128]"
              )}
            >
              <Settings className="h-5 w-5" />
              <span className="font-semibold">Settings</span>
            </Link>
            
            <Separator className="my-2 bg-black/5" />
            
            <div className="flex items-center gap-3 px-2 py-2 mb-2">
              <Avatar className="h-10 w-10 border border-black/5">
                <AvatarFallback className="bg-[#0a1128] text-white font-bold">{userInitials}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col min-w-0">
                <span className="text-sm font-bold text-[#0a1128] truncate">{user?.name || "Loading..."}</span>
                <span className="text-xs text-[#5b637a] truncate">{user?.email}</span>
              </div>
            </div>

            <Button
              variant="ghost"
              className="w-full justify-start gap-3 px-4 py-6 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-2xl"
              onClick={() => {
                handleLogout()
                setOpen(false)
              }}
            >
              <LogOut className="h-5 w-5" />
              <span className="font-semibold">Sign Out</span>
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
