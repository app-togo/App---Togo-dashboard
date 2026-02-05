"use client"

import { Sidebar } from "@/components/layout/sidebar"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Zap, TrendingUp, Target, BrainCircuit, Navigation, Activity, ArrowRight, Radio, Cpu } from "lucide-react"
import { useLiveMetrics, useLiveStatus } from "@/hooks/use-live-metrics"
import { useState } from "react"

const insights = [
  {
    title: "Predictive Efficiency",
    value: 18.4,
    range: 0.2,
    suffix: "%",
    description: "Predicted increase in operational efficiency over the next 30 days.",
    icon: BrainCircuit,
    trend: "up",
    color: "text-primary",
  },
  {
    title: "Resource Optimization",
    value: 92,
    range: 0.5,
    suffix: "%",
    description: "AI-driven allocation of field teams reached peak optimization.",
    icon: Target,
    trend: "up",
    color: "text-accent",
  },
  {
    title: "Cost Reduction",
    value: 12400,
    range: 50,
    prefix: "$",
    description: "Estimated monthly savings from AI-identified route optimizations.",
    icon: Zap,
    trend: "down",
    color: "text-yellow-500",
  },
  {
    title: "Demand Forecast",
    value: "High",
    description: "Anticipated 25% surge in service requests in the Northern Region.",
    icon: TrendingUp,
    trend: "up",
    color: "text-green-500",
  },
]

const optimizedRoutes = [
  { from: "Main Hub", to: "Sector 7", time: "12m", efficiency: "+22%", optimized: true },
  { from: "Central Depot", to: "Industrial Park", time: "18m", efficiency: "+15%", optimized: true },
  { from: "West Station", to: "Residential Block B", time: "9m", efficiency: "+30%", optimized: true },
]

function InsightCardItem({ insight }: { insight: typeof insights[0] }) {
  // Demand Forecast is a string, handle separately
  const isNumeric = typeof insight.value === "number"
  const liveValue = isNumeric ? useLiveMetrics(insight.value as number, insight.range || 0) : insight.value

  return (
    <Card className="bg-card/40 backdrop-blur-xl border-white/5 hover:border-primary/50 transition-all group overflow-hidden relative">
      <div className="absolute top-0 right-0 p-2 opacity-[0.05] group-hover:opacity-[0.2] transition-opacity">
        <insight.icon className="w-12 h-12" />
      </div>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground group-hover:text-primary transition-colors">
          {insight.title}
        </CardTitle>
        <div className={`p-1.5 rounded-lg bg-white/5 ${insight.color} transition-colors`}>
          <insight.icon className="h-4 w-4" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold tracking-tight">
          {insight.prefix}{isNumeric ? (liveValue as number).toLocaleString(undefined, { minimumFractionDigits: typeof insight.value === 'number' && insight.value < 100 ? 1 : 0 }) : liveValue}{insight.suffix}
        </div>
        <p className="text-[10px] leading-tight text-muted-foreground mt-2 line-clamp-2">
          {insight.description}
        </p>
      </CardContent>
    </Card>
  )
}

export default function AIInsightsPage() {
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
      <Sidebar currentPage="ai insights" isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-8">
            <div className="space-y-1 flex-1">
              <div className="flex flex-col md:flex-row md:items-center gap-3">
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground">AI Intelligence & Optimization</h1>
                <div className="px-2 py-0.5 bg-accent/10 border border-accent/20 rounded text-[9px] font-bold text-accent uppercase tracking-[0.2em] animate-pulse">
                  Neural Feedback: Moderated
                </div>
              </div>
              <p className="text-muted-foreground text-sm">Deep learning metrics and predictive operational patterns</p>
            </div>

            <div className="flex items-center gap-2 px-3 py-2 bg-primary/10 border border-primary/20 rounded-lg text-[9px] md:text-[10px]">
              <span className="flex h-2 w-2 rounded-full bg-primary animate-ping" />
              <span className="font-bold text-primary uppercase tracking-widest whitespace-nowrap">Active: {status}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
            {insights.map((insight) => (
              <InsightCardItem key={insight.title} insight={insight} />
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 mb-8">
            <Card className="lg:col-span-2 bg-card/50 backdrop-blur-sm border-sidebar-border">
              <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <CardTitle className="text-lg sm:text-xl">AI-Powered Route Optimization</CardTitle>
                  <CardDescription className="text-xs sm:text-sm">Real-time pathfinding for maximum efficiency</CardDescription>
                </div>
                <Navigation className="h-5 w-5 text-primary flex-shrink-0" />
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {optimizedRoutes.map((route, i) => (
                    <div key={i} className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 sm:p-4 rounded-xl bg-sidebar-accent/30 border border-sidebar-border/50 group hover:border-primary/30 transition-all gap-3 sm:gap-0">
                      <div className="flex items-center gap-2 sm:gap-4 min-w-0">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary flex-shrink-0">
                          <Navigation className="w-4 h-4" />
                        </div>
                        <div className="flex items-center gap-1 sm:gap-2 min-w-0">
                          <span className="font-medium text-xs sm:text-sm truncate">{route.from}</span>
                          <ArrowRight className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                          <span className="font-medium text-xs sm:text-sm truncate">{route.to}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between sm:gap-4 sm:justify-end">
                        <div className="text-right">
                          <p className="text-xs font-semibold text-foreground">{route.time}</p>
                          <p className="text-[10px] text-green-500 font-bold">{route.efficiency}</p>
                        </div>
                        <Badge className="bg-green-500/20 text-green-500 border-green-500/20 ml-2 sm:ml-0 flex-shrink-0">Optimized</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card/50 backdrop-blur-sm border-sidebar-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-4 w-4 text-accent" />
                  Performance Predictions
                </CardTitle>
                <CardDescription>Next 24h operational forecast</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-muted-foreground">Team Response Speed</span>
                    <span className="text-accent font-bold">98% Faster</span>
                  </div>
                  <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-accent w-[98%]"></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-muted-foreground">Task Completion Probability</span>
                    <span className="text-primary font-bold">94%</span>
                  </div>
                  <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-primary w-[94%]"></div>
                  </div>
                </div>
                <div className="p-4 rounded-lg bg-accent/5 border border-accent/20 mt-4">
                  <h4 className="text-xs font-bold text-accent uppercase tracking-wider mb-2">Recommendation</h4>
                  <p className="text-sm text-foreground/80 leading-relaxed">
                    Shift 15% of resources from North to South Sector between 14:00 and 17:00 to handle predicted surge in logistics.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <Card className="bg-card/50 backdrop-blur-sm border-sidebar-border">
              <CardHeader>
                <CardTitle>Intelligence Report</CardTitle>
                <CardDescription>Automated analysis of current workforce trends</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                  <h4 className="font-semibold text-primary mb-1">Peak Performance Detected</h4>
                  <p className="text-sm text-foreground/80">AI models confirm that shifting Team Beta to the Central Hub resulted in a 14% faster response time.</p>
                </div>
                <div className="p-4 rounded-lg bg-accent/5 border border-accent/20">
                  <h4 className="font-semibold text-accent mb-1">Strategic Recommendation</h4>
                  <p className="text-sm text-foreground/80">Based on weather patterns and historical data, suggest pre-deploying 2 units to Region 4 tomorrow.</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card/50 backdrop-blur-sm border-sidebar-border">
              <CardHeader>
                <CardTitle>Model Accuracy</CardTitle>
                <CardDescription>Real-time tracking of AI prediction reliability</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center p-8">
                  <div className="relative w-32 h-32">
                    <svg className="w-full h-full" viewBox="0 0 36 36">
                      <path
                        className="stroke-muted-foreground/20"
                        strokeDasharray="100, 100"
                        strokeWidth="3"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                      <path
                        className="stroke-primary"
                        strokeDasharray="98, 100"
                        strokeWidth="3"
                        strokeLinecap="round"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center flex-col">
                      <span className="text-2xl font-bold">98%</span>
                      <span className="text-[10px] text-muted-foreground">Confidence</span>
                    </div>
                  </div>
                </div>
                <p className="text-center text-sm text-muted-foreground">Our predictive models are currently operating at near-perfect precision for supply chain forecasting.</p>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
