"use client"

import { Sidebar } from "@/components/layout/sidebar"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { Radio, Sparkles, Bell, ShieldAlert, Activity, Cpu } from "lucide-react"
import { useLiveStatus } from "@/hooks/use-live-metrics"
import { toast } from "sonner"
import { useState } from "react"
interface Notification {
  id: string
  type: "alert" | "warning" | "info"
  title: string
  message: string
  timestamp: string
  icon: string
}

const notifications: Notification[] = [
  {
    id: "1",
    type: "alert",
    title: "Critical: Field Team Delay",
    message: "Team Alpha experiencing unexpected delays. ETA +45 minutes.",
    timestamp: "5 minutes ago",
    icon: "⚠️",
  },
  {
    id: "2",
    type: "alert",
    title: "AI Prediction: Supply Chain Issue",
    message: "Predictive analysis suggests potential supply shortage next week.",
    timestamp: "15 minutes ago",
    icon: "🤖",
  },
  {
    id: "3",
    type: "warning",
    title: "Performance Alert",
    message: "Task completion rate dropped 12% in Region 2.",
    timestamp: "1 hour ago",
    icon: "📊",
  },
  {
    id: "4",
    type: "info",
    title: "Compliance Update",
    message: "New compliance requirements effective tomorrow.",
    timestamp: "2 hours ago",
    icon: "📋",
  },
  {
    id: "5",
    type: "alert",
    title: "New Intelligence Note",
    message: "Region 3 optimization complete. Ready for review.",
    timestamp: "3 hours ago",
    icon: "💡",
  },
]

export default function NotificationsPage() {
  const status = useLiveStatus()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  return (
    <div className="flex h-screen bg-background font-sans overflow-hidden">
      {/* Mobile overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 md:hidden z-30"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
      <Sidebar currentPage="notifications" isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
              <div className="space-y-1 flex-1">
                <div className="flex flex-col md:flex-row md:items-center gap-3">
                  <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground tracking-tight">Intelligence & Alerts</h1>
                  <div className="px-2 py-0.5 bg-primary/10 border border-primary/20 rounded text-[8px] md:text-[9px] font-bold text-primary uppercase tracking-[0.1em] md:tracking-[0.2em] animate-pulse flex items-center gap-1.5 whitespace-nowrap">
                    <Radio className="w-3 h-3" />
                    <span className="hidden sm:inline">Moderated AI Feed: {status}</span>
                    <span className="sm:hidden">Feed: {status}</span>
                  </div>
                </div>
                <p className="text-muted-foreground text-sm uppercase tracking-widest font-medium opacity-70">Neural Operation Logs</p>
              </div>

              <div className="flex items-center gap-2 bg-card/40 backdrop-blur-md border border-white/5 rounded-lg px-3 py-1.5 whitespace-nowrap">
                <Activity className="w-3 h-3 text-accent animate-pulse" />
                <span className="text-[9px] md:text-[10px] font-bold text-foreground">Sensors: SYNCED</span>
              </div>
            </div>

            <div className="space-y-4">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className="flex items-start gap-5 p-5 rounded-2xl bg-card/40 backdrop-blur-xl border border-white/5 hover:border-primary/30 transition-all group relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:opacity-[0.1] transition-opacity">
                    <Bell className="w-12 h-12" />
                  </div>

                  <div className={`p-3 rounded-xl bg-white/5 text-2xl flex items-center justify-center border border-white/5 shadow-inner`}>
                    {notification.icon}
                  </div>

                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-foreground group-hover:text-primary transition-colors text-base tracking-tight">
                        {notification.title}
                      </h3>
                      <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest bg-white/5 px-2 py-1 rounded">
                        {notification.timestamp}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed max-w-2xl">
                      {notification.message}
                    </p>

                    <div className="pt-2 flex items-center gap-4">
                      <button onClick={() => toast.success(`Acknowledged: ${notification.title}`)} className="text-[10px] font-bold text-primary uppercase tracking-wider hover:underline decoration-2 underline-offset-4" type="button">
                        Acknowledge
                      </button>
                      <button onClick={() => toast.info(`View log: ${notification.title}`)} className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider hover:text-foreground transition-colors" type="button">
                        View Log
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
