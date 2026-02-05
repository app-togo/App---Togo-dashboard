"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"

const recentHires = [
  {
    id: 1,
    name: "Sarah Johnson",
    position: "Field Operations Manager",
    startDate: "Jan 15, 2025",
    avatar: "SJ",
  },
  {
    id: 2,
    name: "Michael Chen",
    position: "Senior Operations",
    startDate: "Jan 10, 2025",
    avatar: "MC",
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    position: "Logistics Coordinator",
    startDate: "Jan 8, 2025",
    avatar: "ER",
  },
]

export function RecentHires() {
  const handleHireClick = (name: string) => {
    toast.info(`Employee: ${name} - Profile view coming soon`)
  }

  return (
    <Card className="hover:border-primary/50 transition-all duration-200">
      <CardHeader>
        <CardTitle className="text-foreground text-xl">Recent Hires</CardTitle>
        <CardDescription>New team members this month</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {recentHires.map((hire) => (
          <div
            key={hire.id}
            onClick={() => handleHireClick(hire.name)}
            className="flex items-center gap-4 pb-4 border-b border-border/50 last:border-0 last:pb-0 hover:bg-card/50 -mx-4 px-4 py-2 rounded transition-colors cursor-pointer"
          >
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary via-primary/80 to-accent flex items-center justify-center text-background text-sm font-bold flex-shrink-0">
              {hire.avatar}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm text-foreground truncate">{hire.name}</p>
              <p className="text-xs text-muted-foreground truncate">{hire.position}</p>
            </div>
            <p className="text-xs text-muted-foreground whitespace-nowrap font-medium">{hire.startDate}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
