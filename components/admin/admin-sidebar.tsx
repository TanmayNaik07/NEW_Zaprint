"use client"

import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import {
  LayoutDashboard,
  Store,
  FileText,
  MessageSquareText,
  LogOut,
  Shield,
  ChevronsUpDown,
} from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useState } from "react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"

const sidebarVariants = {
  open: { width: "15rem" },
  closed: { width: "4rem" },
}

const contentVariants = {
  open: { display: "block", opacity: 1 },
  closed: { display: "block", opacity: 1 },
}

const variants = {
  open: {
    x: 0,
    opacity: 1,
    transition: { x: { stiffness: 1000, velocity: -100 } },
  },
  closed: {
    x: -20,
    opacity: 0,
    transition: { x: { stiffness: 100 } },
  },
}

const transitionProps = {
  type: "tween",
  ease: "easeOut",
  duration: 0.2,
}

const staggerVariants = {
  open: {
    transition: { staggerChildren: 0.03, delayChildren: 0.02 },
  },
}

export function AdminSidebar() {
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

  const navItems = [
    { name: "Overview", href: "/admin", icon: LayoutDashboard },
    { name: "Orders", href: "/admin/orders", icon: FileText },
    { name: "Shops", href: "/admin/shops", icon: Store },
    { name: "Feedback", href: "/admin/feedback", icon: MessageSquareText },
  ]

  return (
    <motion.div
      className={cn(
        "sidebar fixed left-0 z-40 h-full shrink-0 border-r bg-[#0a1128]/95 backdrop-blur-xl border-white/10"
      )}
      initial={isCollapsed ? "closed" : "open"}
      animate={isCollapsed ? "closed" : "open"}
      variants={sidebarVariants}
      transition={transitionProps}
      onMouseEnter={() => setIsCollapsed(false)}
      onMouseLeave={() => setIsCollapsed(true)}
    >
      <motion.div
        className="relative z-40 flex text-white/60 h-full shrink-0 flex-col bg-transparent transition-all"
        variants={contentVariants}
      >
        <motion.ul variants={staggerVariants} className="flex h-full flex-col">
          <div className="flex grow flex-col items-center">
            {/* Top Logo / Brand Section */}
            <div className="flex h-[60px] w-full shrink-0 items-center justify-center border-b border-white/10 p-2">
              <div className="flex w-full items-center justify-center">
                <div className="flex items-center gap-2 px-2 w-full">
                  <div className="w-9 h-9 rounded-lg bg-red-500/20 border border-red-500/30 flex items-center justify-center shrink-0">
                    <Shield className="w-5 h-5 text-red-400" />
                  </div>
                  <motion.div
                    variants={variants}
                    className="overflow-hidden whitespace-nowrap"
                  >
                    {!isCollapsed && (
                      <span className="text-white text-lg font-semibold ml-1">
                        Admin
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
                      const isActive =
                        pathname === item.href ||
                        (item.href !== "/admin" &&
                          pathname.startsWith(item.href))
                      return (
                        <Link
                          key={item.name}
                          href={item.href}
                          className={cn(
                            "flex h-10 w-full flex-row items-center rounded-xl px-2 py-2 transition-all hover:bg-white/10 hover:text-white",
                            isActive
                              ? "bg-white/15 text-white"
                              : "text-white/60"
                          )}
                        >
                          <item.icon
                            className={cn(
                              "h-5 w-5 shrink-0",
                              isActive && "text-white"
                            )}
                          />
                          <motion.li
                            variants={variants}
                            className="ml-3 overflow-hidden whitespace-nowrap"
                          >
                            {!isCollapsed && (
                              <p className="text-sm font-medium">
                                {item.name}
                              </p>
                            )}
                          </motion.li>
                        </Link>
                      )
                    })}
                  </div>
                </ScrollArea>
              </div>

              {/* Bottom Section */}
              <div className="flex flex-col p-2 space-y-1 mb-2">
                {/* Back to User Dashboard */}
                <Link
                  href="/dashboard"
                  className="flex h-10 w-full flex-row items-center rounded-xl px-2 py-2 transition-all hover:bg-white/10 hover:text-white text-white/60"
                >
                  <LayoutDashboard className="h-5 w-5 shrink-0" />
                  <motion.li
                    variants={variants}
                    className="ml-3 overflow-hidden whitespace-nowrap"
                  >
                    {!isCollapsed && (
                      <p className="text-sm font-medium">User Dashboard</p>
                    )}
                  </motion.li>
                </Link>

                <Separator className="bg-white/10" />

                {/* Profile Dropdown */}
                <div className="pt-1">
                  <DropdownMenu modal={false}>
                    <DropdownMenuTrigger className="w-full outline-none">
                      <div className="flex h-12 w-full flex-row items-center gap-2 rounded-xl px-2 py-1.5 transition hover:bg-white/10 hover:text-white">
                        <Avatar className="h-8 w-8 border border-white/10">
                          <AvatarFallback className="bg-red-500/20 text-red-300 text-sm font-bold">
                            ZA
                          </AvatarFallback>
                        </Avatar>
                        <motion.li
                          variants={variants}
                          className="flex w-full items-center gap-2 overflow-hidden whitespace-nowrap"
                        >
                          {!isCollapsed && (
                            <>
                              <div className="flex flex-col text-left">
                                <p className="text-sm font-medium text-white">
                                  Admin
                                </p>
                              </div>
                              <ChevronsUpDown className="ml-auto h-4 w-4 text-white/30" />
                            </>
                          )}
                        </motion.li>
                      </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      side="right"
                      sideOffset={10}
                      align="end"
                      className="w-[200px]"
                    >
                      <div className="flex flex-row items-center gap-2 p-2">
                        <Avatar className="size-8">
                          <AvatarFallback className="bg-red-500/10 text-red-600">
                            ZA
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col text-left overflow-hidden">
                          <span className="text-sm font-medium truncate">
                            Zaprint Admin
                          </span>
                          <span className="line-clamp-1 text-xs text-muted-foreground truncate">
                            zaprint.official@gmail.com
                          </span>
                        </div>
                      </div>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild className="cursor-pointer">
                        <Link href="/dashboard">
                          <LayoutDashboard className="h-4 w-4 mr-2" />
                          User Dashboard
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
