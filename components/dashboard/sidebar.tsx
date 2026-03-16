"use client"

import { cn } from "@/lib/utils"
import { ScrollArea } from "@/components/ui/scroll-area"
import { motion, Variants } from "framer-motion"
import {
  LayoutDashboard,
  Store,
  FileText,
  HelpCircle,
  Settings,
  LogOut,
  Printer,
  ChevronsUpDown,
  UserCircle,
  MessageSquareText,
} from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Separator } from "@/components/ui/separator"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"

const sidebarVariants: Variants = {
  open: {
    width: "15rem",
  },
  closed: {
    width: "4.5rem",
  },
}

const textVariants: Variants = {
  open: {
    opacity: 1,
    x: 0,
    display: "block",
    transition: { duration: 0.15, ease: "easeOut" },
  },
  closed: {
    opacity: 0,
    x: -10,
    transition: { duration: 0.1, ease: "easeIn" },
    transitionEnd: { display: "none" },
  },
}


const transitionProps = {
  type: "tween",
  ease: "linear",
  duration: 0.1,
} as const

export function DashboardSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(true)
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
    <motion.div
      className={cn(
        "sidebar fixed left-0 z-40 h-full shrink-0 border-r bg-white/80 backdrop-blur-xl border-black/5 hidden md:flex flex-col shadow-sm",
      )}
      initial={isCollapsed ? "closed" : "open"}
      animate={isCollapsed ? "closed" : "open"}
      variants={sidebarVariants}
      transition={transitionProps}
      onMouseEnter={() => setIsCollapsed(false)}
      onMouseLeave={() => setIsCollapsed(true)}
    >
      {/* Top Logo / Brand Section */}
      <div className="flex h-16 w-full shrink-0 items-center border-b border-black/5 px-4 overflow-hidden">
        <div className="flex items-center gap-3 w-full">
          <div className="w-10 h-10 rounded-xl bg-[#0a1128] flex items-center justify-center shrink-0 shadow-lg shadow-[#0a1128]/20">
            <Printer className="w-5 h-5 text-white" />
          </div>
          <motion.span
            variants={textVariants}
            className="text-[#0a1128] text-xl font-bold tracking-tight"
          >
            Zaprint
          </motion.span>
        </div>
      </div>

      {/* Navigation Links */}
      <ScrollArea className="flex-1 w-full mt-4">
        <div className="flex flex-col gap-1.5 px-3">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href))
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex h-11 w-full items-center rounded-xl transition-all duration-200 group relative",
                  isActive
                    ? "bg-[#0a1128] text-white shadow-md shadow-[#0a1128]/10"
                    : "text-[#5b637a] hover:bg-[#0a1128]/5 hover:text-[#0a1128]"
                )}
              >
                <div className={cn(
                  "flex items-center justify-center shrink-0 w-11 h-11 transition-all",
                  isCollapsed && "w-full"
                )}>
                  <item.icon className={cn("h-5 w-5", isActive ? "text-white" : "text-inherit")} />
                </div>
                <motion.span
                  variants={textVariants}
                  className="text-sm font-bold tracking-tight whitespace-nowrap overflow-hidden"
                >
                  {item.name}
                </motion.span>
              </Link>
            )
          })}
        </div>
      </ScrollArea>

      {/* Bottom Section: Settings & Profile */}
      <div className="flex flex-col p-3 space-y-2 mb-2 bg-white/40 border-t border-black/5">
        <Link
          href="/dashboard/settings"
          className={cn(
            "flex h-11 w-full items-center rounded-xl transition-all duration-200 group relative",
            pathname === "/dashboard/settings"
              ? "bg-[#0a1128] text-white shadow-md shadow-[#0a1128]/10"
              : "text-[#5b637a] hover:bg-[#0a1128]/5 hover:text-[#0a1128]"
          )}
        >
          <div className={cn(
            "flex items-center justify-center shrink-0 w-11 h-11",
            isCollapsed && "w-full"
          )}>
            <Settings className="h-5 w-5" />
          </div>
          <motion.span
            variants={textVariants}
            className="text-sm font-bold tracking-tight whitespace-nowrap overflow-hidden"
          >
            Settings
          </motion.span>
        </Link>

        <Separator className="bg-black/5" />

        {/* Profile Dropdown */}
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <button className="w-full relative outline-none">
              <div className={cn(
                "flex h-12 w-full items-center rounded-xl transition-all duration-200 hover:bg-black/5 group",
                !isCollapsed && "px-1"
              )}>
                <div className={cn(
                  "flex items-center justify-center shrink-0 w-11 h-11 transition-all",
                  isCollapsed && "w-full"
                )}>
                  <Avatar className="h-9 w-9 border-2 border-white shadow-sm transition-transform group-hover:scale-105">
                    <AvatarFallback className="bg-[#0a1128] text-white text-xs font-bold">{userInitials}</AvatarFallback>
                  </Avatar>
                </div>

                <motion.div
                  variants={textVariants}
                  className="flex flex-1 items-center justify-between ml-3 overflow-hidden"
                >
                  <div className="flex flex-col text-left min-w-0">
                    <p className="text-sm font-bold text-[#0a1128] truncate">
                      {user?.name || "User"}
                    </p>
                    <p className="text-[10px] text-[#5b637a] font-medium truncate">
                      {user?.email}
                    </p>
                  </div>
                </motion.div>
              </div>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="right" sideOffset={15} align="end" className="w-64 p-2 bg-white border-black/10 rounded-2xl shadow-xl zaprint-theme">
            <div className="flex items-center gap-3 p-3">
              <Avatar className="h-10 w-10 border border-black/5">
                <AvatarFallback className="bg-[#0a1128] text-white font-bold">{userInitials}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col min-w-0">
                <span className="text-sm font-bold text-[#0a1128] truncate">{user?.name}</span>
                <span className="text-[11px] text-[#5b637a] truncate font-medium">{user?.email}</span>
              </div>
            </div>
            <DropdownMenuSeparator className="bg-black/5" />
            <DropdownMenuItem asChild className="cursor-pointer rounded-xl focus:bg-[#0a1128]/5 py-2.5">
              <Link href="/dashboard/settings" className="flex items-center w-full">
                <UserCircle className="mr-3 h-5 w-5 text-[#0a1128]" />
                <span className="font-bold text-sm">Profile Details</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-black/5" />
            <DropdownMenuItem
              onClick={handleLogout}
              className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50 rounded-xl py-2.5"
            >
              <LogOut className="mr-3 h-5 w-5" />
              <span className="font-bold text-sm">Sign Out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </motion.div>
  )
}
