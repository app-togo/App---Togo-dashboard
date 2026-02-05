"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { onAuthStateChanged } from "firebase/auth"
import { auth } from "@/lib/firebase"
import { Sidebar } from "@/components/layout/sidebar"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { StatsCards } from "@/components/dashboard/stats-cards"
import { TeamActivity } from "@/components/dashboard/team-activity"
import { TeamPerformance } from "@/components/dashboard/team-performance"
import { RecentHires } from "@/components/dashboard/recent-hires"
import { UpcomingTasks } from "@/components/dashboard/upcoming-tasks"
import { useLiveStatus } from "@/hooks/use-live-metrics"
import { Activity, Radio } from "lucide-react"

export default function DashboardPage() {
  const status = useLiveStatus()
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAuthenticated(true)
        setIsLoading(false)
      } else {
        router.push("/login")
      }
    })

    return () => unsubscribe()
  }, [router])

  // Close sidebar on route change or escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsSidebarOpen(false)
      }
    }
    window.addEventListener("keydown", handleEscape)
    return () => window.removeEventListener("keydown", handleEscape)
  }, [])

  if (isLoading || !isAuthenticated) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
          <p className="text-muted-foreground text-sm">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Mobile overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 md:hidden z-30"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
      <Sidebar currentPage="dashboard" isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />
        <main className="flex-1 overflow-y-auto">
          <div className="p-4 md:p-8 space-y-8">
            {/* Dashboard Title Section */}
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
              <div className="space-y-2 flex-1">
                <div className="flex flex-col md:flex-row md:items-center gap-3">
                  <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground tracking-tight">AI Command Center</h1>
                  <div className="flex items-center gap-1.5 px-3 py-1 bg-primary/10 border border-primary/20 rounded-full text-[9px] md:text-[10px] font-bold text-primary uppercase tracking-widest animate-pulse">
                    <Radio className="w-3 h-3" />
                    Live Data Stream
                  </div>
                </div>
                <p className="text-muted-foreground text-sm flex flex-wrap items-center gap-2">
                  Welcome back, John.
                  <span className="w-1 h-1 bg-muted-foreground rounded-full hidden sm:inline-block"></span>
                  <span className="flex items-center gap-1.5 text-accent font-medium">
                    <Activity className="w-3.5 h-3.5" />
                    System State: {status}
                  </span>
                </p>
              </div>

              <div className="flex items-center gap-4 bg-card/40 backdrop-blur-md border border-white/5 rounded-xl px-4 md:px-6 py-3 whitespace-nowrap">
                <div className="text-right hidden sm:block">
                  <p className="text-[9px] uppercase tracking-wider text-muted-foreground font-bold">Moderation Level</p>
                  <p className="text-xs md:text-sm font-bold text-foreground">Fully Autonomous</p>
                </div>
                <div className="h-8 w-[1px] bg-white/10 hidden sm:block"></div>
                <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center border border-accent/20">
                  <Activity className="w-6 h-6 text-accent animate-pulse" />
                </div>
              </div>
            </div>

            {/* Stats Cards Section */}
            <section aria-label="Key Metrics">
              <StatsCards />
            </section>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column - Wide Sections */}
              <div className="lg:col-span-2 space-y-8">
                <section aria-label="Team Activity">
                  <TeamActivity />
                </section>
                <section aria-label="Performance Metrics">
                  <TeamPerformance />
                </section>
              </div>

              {/* Right Column - Sidebar Sections */}
              <div className="space-y-8">
                <section aria-label="Recent Hires">
                  <RecentHires />
                </section>
                <section aria-label="Upcoming Tasks">
                  <UpcomingTasks />
                </section>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
