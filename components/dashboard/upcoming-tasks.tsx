"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2, Clock } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"

const initialTasks = [
  {
    id: 1,
    title: "Q1 Planning Session",
    dueDate: "Today",
    priority: "high",
    completed: false,
  },
  {
    id: 2,
    title: "Budget Review Meeting",
    dueDate: "Tomorrow",
    priority: "high",
    completed: false,
  },
  {
    id: 3,
    title: "Team Standup",
    dueDate: "Jan 18",
    priority: "medium",
    completed: false,
  },
  {
    id: 4,
    title: "Performance Reviews",
    dueDate: "Jan 22",
    priority: "medium",
    completed: false,
  },
]

export function UpcomingTasks() {
  const [tasks, setTasks] = useState(initialTasks)

  const handleTaskComplete = (taskId: number) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    )
    const task = tasks.find((t) => t.id === taskId)
    if (task) {
      toast.success(`Task "${task.title}" ${!task.completed ? "marked complete" : "reopened"}`)
    }
  }

  const handleTaskClick = (title: string) => {
    toast.info(`Task: ${title} - Detailed view coming soon`)
  }

  return (
    <Card className="hover:border-primary/50 transition-all duration-200">
      <CardHeader>
        <CardTitle className="text-foreground text-xl">Upcoming Tasks</CardTitle>
        <CardDescription>Your schedule for this week</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="flex items-start gap-3 pb-3 border-b border-border/50 last:border-0 last:pb-0 hover:bg-card/50 -mx-4 px-4 py-2 rounded transition-colors"
          >
            <button 
              onClick={() => handleTaskComplete(task.id)}
              className="mt-1 p-1.5 hover:bg-primary/20 rounded transition-colors flex-shrink-0"
              title={task.completed ? "Mark incomplete" : "Mark complete"}
            >
              <CheckCircle2 className={`w-5 h-5 transition-colors ${task.completed ? "text-accent fill-accent" : "text-muted-foreground hover:text-accent"}`} />
            </button>
            <div className="flex-1 min-w-0 cursor-pointer" onClick={() => handleTaskClick(task.title)}>
              <p className={`font-medium text-sm ${task.completed ? "text-muted-foreground line-through" : "text-foreground"}`}>
                {task.title}
              </p>
              <div className="flex items-center gap-2 mt-2 flex-wrap">
                <Clock className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
                <p className="text-xs text-muted-foreground">{task.dueDate}</p>
                <span
                  className={`text-xs font-semibold px-2 py-1 rounded ${
                    task.priority === "high" ? "bg-destructive/20 text-destructive" : "bg-muted text-muted-foreground"
                  }`}
                >
                  {task.priority}
                </span>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
