"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, Users, CheckCircle, AlertCircle } from "lucide-react"
import { useLiveMetrics } from "@/hooks/use-live-metrics"
import { toast } from "sonner"

const stats = [
  {
    title: "Active Employees",
    value: 342,
    range: 2,
    change: "+12%",
    positive: true,
    icon: Users,
    description: "Field workforce",
  },
  {
    title: "Tasks Completed",
    value: 1248,
    range: 10,
    change: "+8%",
    positive: true,
    icon: CheckCircle,
    description: "This month",
  },
  {
    title: "AI Productivity",
    value: 87,
    range: 0.5,
    change: "+5%",
    positive: true,
    icon: TrendingUp,
    description: "Efficiency score",
    suffix: "%"
  },
  {
    title: "Issues Flagged",
    value: 12,
    range: 1,
    change: "-3%",
    positive: true,
    icon: AlertCircle,
    description: "Critical alerts",
  },
]

function StatCardItem({ stat }: { stat: typeof stats[0] }) {
  const liveValue = useLiveMetrics(stat.value, stat.range)
  const Icon = stat.icon

  const handleClick = () => {
    toast.info(`${stat.title}: Detailed view coming soon`)
  }

  return (
    <Card 
      onClick={handleClick}
      className="group hover:shadow-xl hover:shadow-primary/20 hover:border-primary/50 transition-all duration-300 cursor-pointer bg-card/40 backdrop-blur-sm border-white/5"
    >
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <CardTitle className="text-sm font-medium text-muted-foreground group-hover:text-primary transition-colors">
          {stat.title}
        </CardTitle>
        <div className="p-2.5 rounded-lg bg-primary/10 group-hover:bg-primary/20 border border-primary/20 transition-all">
          <Icon className="w-5 h-5 text-primary" />
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="text-3xl font-bold text-foreground tracking-tight">
          {stat.suffix === "%" ? liveValue + "%" : Math.floor(liveValue).toLocaleString()}
        </div>
        <div className="flex items-center justify-between">
          <p className="text-xs text-muted-foreground">{stat.description}</p>
          <div className="flex items-center gap-1.5">
            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${stat.positive ? "bg-accent/10 text-accent" : "bg-destructive/10 text-destructive"}`}>
              {stat.change}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export function StatsCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat) => (
        <StatCardItem key={stat.title} stat={stat} />
      ))}
    </div>
  )
}
