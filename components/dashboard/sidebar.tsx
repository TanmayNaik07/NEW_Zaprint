"use client"

import { cn } from "@/lib/utils"
// Ensure these imports point to your actual UI components
import { ScrollArea } from "@/components/ui/scroll-area"
import { motion } from "framer-motion"

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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useState } from "react"
import { Button } from "@/components/ui/button"
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

const sidebarVariants = {
  open: {
    width: "15rem",
  },
  closed: {
    width: "4rem", // Adjusted for better visual balance with icons
  },
}

const contentVariants = {
  open: { display: "block", opacity: 1 },
  closed: { display: "block", opacity: 1 },
}

const variants = {
  open: {
    x: 0,
    opacity: 1,
    transition: {
      x: { stiffness: 1000, velocity: -100 },
    },
  },
  closed: {
    x: -20,
    opacity: 0,
    transition: {
      x: { stiffness: 100 },
    },
  },
}

const transitionProps = {
  type: "tween",
  ease: "easeOut",
  duration: 0.2,
  // Remove stagger here to make the container smooth
} as const

const staggerVariants = {
  open: {
    transition: { staggerChildren: 0.03, delayChildren: 0.02 },
  },
}

export function DashboardSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(true)
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    toast.success("Logged out successfully")
    router.push("/")
    router.refresh()
  }

  // Zaprint Navigation Items
  const navItems = [
    { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { name: "Print Shops", href: "/dashboard/shops", icon: Store },
    { name: "My Orders", href: "/dashboard/orders", icon: FileText },
    { name: "Feedback", href: "/dashboard/feedback", icon: MessageSquareText },
    { name: "How to Use", href: "/dashboard/how-to-use", icon: HelpCircle },
    // Settings logic is usually separate but I'll add it here for consistency if needed
    // { name: "Settings", href: "/dashboard/settings", icon: Settings },
  ]

  return (
    <motion.div
      className={cn(
        "sidebar fixed left-0 z-40 h-full shrink-0 border-r bg-white/80 backdrop-blur-xl border-black/5",
      )}
      initial={isCollapsed ? "closed" : "open"}
      animate={isCollapsed ? "closed" : "open"}
      variants={sidebarVariants}
      transition={transitionProps}
      onMouseEnter={() => setIsCollapsed(false)}
      onMouseLeave={() => setIsCollapsed(true)}
    >
      <motion.div
        className={`relative z-40 flex text-[#5b637a] h-full shrink-0 flex-col bg-transparent transition-all`}
        variants={contentVariants}
      >
        <motion.ul variants={staggerVariants} className="flex h-full flex-col">
          <div className="flex grow flex-col items-center">

            {/* Top Logo / Brand Section */}
            <div className="flex h-[60px] w-full shrink-0 items-center justify-center border-b border-black/5 p-2">
              <div className="flex w-full items-center justify-center">
                <div className="flex items-center gap-2 px-2 w-full">
                  <div className="w-9 h-9 rounded-lg bg-[#0a1128] flex items-center justify-center shrink-0">
                    <Printer className="w-5 h-5 text-white" />
                  </div>
                  <motion.div variants={variants} className="overflow-hidden whitespace-nowrap">
                    {!isCollapsed && (
                      <span className="text-[#0a1128] text-lg font-semibold ml-1">
                        Zaprint
                      </span>
                    )}
                  </motion.div>
                </div>
              </div>
            </div>

            {/* Navigation Links */}
            <div className="flex h-full w-full flex-col">
              <div className="flex grow flex-col gap-4 pt-4">
                <ScrollArea className="h-full w-full px-2">
                  <div className={cn("flex w-full flex-col gap-1")}>
                    {navItems.map((item) => {
                      const isActive = pathname === item.href
                      return (
                        <Link
                          key={item.name}
                          href={item.href}
                          className={cn(
                            "flex h-10 w-full flex-row items-center rounded-xl px-2 py-2 transition-all hover:bg-black/5 hover:text-[#0a1128]",
                            isActive
                              ? "bg-[#0a1128]/10 text-[#0a1128] hover:bg-[#0a1128]/15"
                              : "text-[#5b637a]",
                          )}
                        >
                          <item.icon className={cn("h-5 w-5 shrink-0", isActive && "text-[#0a1128]")} />
                          <motion.li variants={variants} className="ml-3 overflow-hidden whitespace-nowrap">
                            {!isCollapsed && (
                              <p className="text-sm font-medium">{item.name}</p>
                            )}
                          </motion.li>
                        </Link>
                      )
                    })}
                  </div>
                </ScrollArea>
              </div>

              {/* Bottom Section: Settings & Profile */}
              <div className="flex flex-col p-2 space-y-1 mb-2">

                {/* Independent Settings Link */}
                <Link
                  href="/dashboard/settings"
                  className={cn(
                    "flex h-10 w-full flex-row items-center rounded-xl px-2 py-2 transition-all hover:bg-black/5 hover:text-[#0a1128]",
                    pathname === "/dashboard/settings" ? "bg-[#0a1128]/10 text-[#0a1128]" : "text-[#5b637a]"
                  )}
                >
                  <Settings className="h-5 w-5 shrink-0" />
                  <motion.li variants={variants} className="ml-3 overflow-hidden whitespace-nowrap">
                    {!isCollapsed && (
                      <p className="text-sm font-medium">Settings</p>
                    )}
                  </motion.li>
                </Link>

                <Separator className="bg-black/5" />

                {/* Profile Dropdown */}
                <div className="pt-1">
                  <DropdownMenu modal={false}>
                    <DropdownMenuTrigger className="w-full outline-none">
                      <div className="flex h-12 w-full flex-row items-center gap-2 rounded-xl px-2 py-1.5 transition hover:bg-black/5 hover:text-[#0a1128]">
                        <Avatar className="h-8 w-8 border border-black/5">
                          <AvatarImage src="/placeholder-user.jpg" />
                          <AvatarFallback className="bg-[#0a1128]/10 text-[#0a1128]">TM</AvatarFallback>
                        </Avatar>
                        <motion.li
                          variants={variants}
                          className="flex w-full items-center gap-2 overflow-hidden whitespace-nowrap"
                        >
                          {!isCollapsed && (
                            <>
                              <div className="flex flex-col text-left">
                                <p className="text-sm font-medium truncate">Test Member</p>
                              </div>
                              <ChevronsUpDown className="ml-auto h-4 w-4 text-muted-foreground/50" />
                            </>
                          )}
                        </motion.li>
                      </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent side="right" sideOffset={10} align="end" className="w-[200px]">
                      <div className="flex flex-row items-center gap-2 p-2">
                        <Avatar className="size-8">
                          <AvatarFallback className="bg-[#0a1128]/10 text-[#0a1128]">TM</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col text-left overflow-hidden">
                          <span className="text-sm font-medium truncate">
                            Test Member
                          </span>
                          <span className="line-clamp-1 text-xs text-muted-foreground truncate">
                            member@zaprint.com
                          </span>
                        </div>
                      </div>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        asChild
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <Link href="/dashboard/settings">
                          <UserCircle className="h-4 w-4" /> Profile
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={handleLogout}
                        className="flex items-center gap-2 text-destructive focus:text-destructive cursor-pointer"
                      >
                        <LogOut className="h-4 w-4" /> Sign out
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>
          </div>
        </motion.ul>
      </motion.div>
    </motion.div>
  )
}
