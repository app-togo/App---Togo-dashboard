"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Activity, MessageSquare, FileCheck, UserPlus } from "lucide-react"
import { toast } from "sonner"

const activities = [
  {
    id: 1,
    icon: UserPlus,
    title: "New team member onboarded",
    description: "Sarah Johnson joined the Field Operations team",
    timestamp: "2 hours ago",
    color: "bg-primary/15 text-primary",
  },
  {
    id: 2,
    icon: FileCheck,
    title: "Project milestone achieved",
    description: "Q1 Revenue Target completed ahead of schedule",
    timestamp: "4 hours ago",
    color: "bg-accent/15 text-accent",
  },
  {
    id: 3,
    icon: MessageSquare,
    title: "New feedback submitted",
    description: "12 performance reviews completed",
    timestamp: "6 hours ago",
    color: "bg-primary/15 text-primary",
  },
  {
    id: 4,
    icon: Activity,
    title: "Team activity update",
    description: "Engineering team reached 95% task completion",
    timestamp: "8 hours ago",
    color: "bg-accent/15 text-accent",
  },
]

export function TeamActivity() {
  const handleActivityClick = (title: string) => {
    toast.info(`Activity: ${title} - Detailed view coming soon`)
  }

  return (
    <Card className="hover:border-primary/50 transition-all duration-200">
      <CardHeader>
        <CardTitle className="text-foreground text-xl">Team Activity</CardTitle>
        <CardDescription>Real-time updates from your workforce</CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        {activities.map((activity) => {
          const Icon = activity.icon
          return (
            <div
              key={activity.id}
              onClick={() => handleActivityClick(activity.title)}
              className="flex gap-4 pb-5 border-b border-border/50 last:border-0 last:pb-0 hover:bg-card/50 -mx-4 px-4 py-2 rounded transition-colors cursor-pointer"
            >
              <div className={`p-3 rounded-lg h-fit flex-shrink-0 ${activity.color}`}>
                <Icon className="w-5 h-5" />
              </div>
              <div className="flex-1 space-y-1 min-w-0">
                <p className="font-medium text-sm text-foreground">{activity.title}</p>
                <p className="text-sm text-muted-foreground line-clamp-1">{activity.description}</p>
                <p className="text-xs text-muted-foreground">{activity.timestamp}</p>
              </div>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
