"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { LayoutDashboard, Printer, HelpCircle, Settings, Menu, Store, FileText, ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

const navItems = [
  { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { name: "Print Shops", href: "/dashboard/shops", icon: Store },
  { name: "My Orders", href: "/dashboard/orders", icon: FileText },
  { name: "How to Use", href: "/dashboard/how-to-use", icon: HelpCircle },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
]

export function DashboardSidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)

  const SidebarContent = ({ mobile = false }: { mobile?: boolean }) => (
    <div className={cn("flex flex-col h-full", mobile ? "p-4" : collapsed ? "p-3" : "p-6")}>
      {/* Logo */}
      <div className={cn("flex items-center gap-2 mb-6 transition-all", collapsed && !mobile && "justify-center")}>
        <div className="w-9 h-9 rounded-lg bg-primary/20 flex items-center justify-center shrink-0">
          <Printer className="w-5 h-5 text-primary" />
        </div>
        {(!collapsed || mobile) && <span className="text-foreground text-xl font-semibold">Zaprint</span>}
      </div>

      {/* Menu Header & Toggle */}
      {!mobile && (
        <div className={cn("flex items-center justify-between mb-4 px-1", collapsed && "justify-center")}>
          {!collapsed && <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Menu</span>}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCollapsed(!collapsed)}
            className="h-6 w-6 text-muted-foreground hover:text-foreground"
          >
            <ChevronLeft className={cn("h-4 w-4 transition-transform", collapsed && "rotate-180")} />
          </Button>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition-all duration-200",
                isActive
                  ? "bg-primary/15 text-primary"
                  : "text-muted-foreground hover:bg-white/5 hover:text-foreground",
                collapsed && !mobile && "justify-center px-2",
              )}
            >
              <item.icon className={cn("w-5 h-5 shrink-0", isActive && "text-primary")} />
              {(!collapsed || mobile) && <span>{item.name}</span>}
            </Link>
          )
        })}
      </nav>
    </div>
  )

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={cn(
          "hidden md:flex flex-col h-screen border-r border-white/10 bg-background/50 backdrop-blur-xl transition-all duration-300",
          collapsed ? "w-[72px]" : "w-[240px]",
        )}
      >
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 h-16 bg-background/80 backdrop-blur-xl border-b border-white/10 flex items-center justify-between px-4">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
            <Printer className="w-5 h-5 text-primary" />
          </div>
          <span className="text-foreground text-lg font-semibold">Zaprint</span>
        </Link>

        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="text-foreground">
              <Menu className="w-6 h-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[280px] p-0 bg-background border-white/10">
            <SidebarContent mobile />
          </SheetContent>
        </Sheet>
      </div>
    </>
  )
}
