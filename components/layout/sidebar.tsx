"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { auth } from "@/lib/firebase"
import { LayoutDashboard, Users, FileText, Settings, BarChart3, LogOut, Bell, Zap, PlayCircle, User, X } from "lucide-react"
import Image from "next/image"

interface SidebarProps {
  currentPage?: string
  isOpen?: boolean
  onClose?: () => void
}

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/" },
  { icon: Zap, label: "AI Insights", href: "/ai-insights" },
  { icon: Users, label: "Field Operations", href: "/field-operations" },
  { icon: BarChart3, label: "Reports & Compliance", href: "/reports" },
  { icon: PlayCircle, label: "Simulations", href: "/simulations" },
  { icon: Bell, label: "Notifications", href: "/notifications" },
  { icon: FileText, label: "Documents", href: "/documents" },
]

export function Sidebar({ currentPage, isOpen = true, onClose }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = async () => {
    try {
      await auth.signOut()
      router.push("/login")
    } catch (error) {
      console.error("Logout failed", error)
    }
  }

  const handleNavClick = () => {
    if (onClose && window.innerWidth < 768) {
      onClose()
    }
  }

  return (
    <aside className={cn(
      "bg-sidebar border-r border-sidebar-border flex flex-col h-screen shrink-0 transition-all duration-300",
      "fixed md:static left-0 top-0 z-40 w-64",
      isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
    )}>
      {/* Close Button for Mobile */}
      <button
        onClick={onClose}
        className="md:hidden absolute top-4 right-4 p-2 hover:bg-sidebar-accent/50 rounded-lg transition-colors z-50"
      >
        <X className="w-6 h-6 text-sidebar-foreground" />
      </button>

      {/* Logo Section - Removed from top */}

      {/* Navigation */}
      <nav className="flex-1 p-3 sm:p-4 space-y-3 overflow-y-auto">
        {/* Logo near menu */}
        <div className="flex items-center gap-2 sm:gap-3 px-2 sm:px-3 py-2 mb-2">
          <div className="relative w-8 h-8 sm:w-10 sm:h-10 transition-transform duration-300 group-hover:scale-110 flex-shrink-0">
            <Image
              src="/logo.svg"
              alt="App-Togo Logo"
              width={48}
              height={48}
              className="object-contain"
              priority
            />
          </div>
          <span className="text-[8px] sm:text-[9px] text-sidebar-foreground/60 font-bold uppercase tracking-widest">AI Center</span>
        </div>

        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href || currentPage?.toLowerCase() === item.label.toLowerCase()
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={handleNavClick}
              className={cn(
                "flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-3 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 whitespace-nowrap",
                isActive
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                  : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-accent",
              )}
            >
              <Icon className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
              <span className="truncate">{item.label}</span>
            </Link>
          )
        })}
      </nav>

      {/* Bottom Section */}
      <div className="p-3 sm:p-4 border-t border-sidebar-border space-y-1">
        <Link
          href="/profile"
          onClick={handleNavClick}
          className={cn(
            "flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-3 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 whitespace-nowrap",
            pathname === "/profile" || currentPage === "profile"
              ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
              : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-accent",
          )}
        >
          <User className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
          <span className="truncate">Profile</span>
        </Link>
        <Link
          href="/settings"
          onClick={handleNavClick}
          className={cn(
            "flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-3 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 whitespace-nowrap",
            pathname === "/settings" || currentPage === "settings"
              ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
              : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-accent",
          )}
        >
          <Settings className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
          <span className="truncate">Settings</span>
        </Link>
        <button
          onClick={() => {
            handleLogout()
            handleNavClick()
          }}
          className="w-full flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-3 rounded-lg text-xs sm:text-sm font-medium text-destructive hover:bg-destructive/10 transition-all duration-200 cursor-pointer"
        >
          <LogOut className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
          <span className="truncate">Logout</span>
        </button>
      </div>
    </aside>
  )
}