"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { toast } from "sonner"

const performanceData = [
  { name: "Sales", performance: 88 },
  { name: "Engineering", performance: 92 },
  { name: "Logistics", performance: 85 },
  { name: "Support", performance: 90 },
  { name: "Quality", performance: 87 },
  { name: "Operations", performance: 89 },
]

export function TeamPerformance() {
  const handleChartClick = () => {
    toast.info("Performance metrics dashboard - Detailed view coming soon")
  }

  return (
    <Card onClick={handleChartClick} className="hover:border-primary/50 transition-all duration-200 cursor-pointer">
      <CardHeader>
        <CardTitle className="text-foreground text-xl">Team Performance</CardTitle>
        <CardDescription>Department efficiency metrics (last 30 days)</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="w-full h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={performanceData} margin={{ top: 10, right: 30, left: 0, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" opacity={0.5} />
              <XAxis dataKey="name" stroke="var(--color-muted-foreground)" style={{ fontSize: "12px" }} />
              <YAxis stroke="var(--color-muted-foreground)" style={{ fontSize: "12px" }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--color-card)",
                  border: "1px solid var(--color-primary)",
                  borderRadius: "8px",
                  boxShadow: "0 4px 12px rgba(0, 128, 128, 0.2)",
                }}
                cursor={{ fill: "rgba(57, 255, 20, 0.1)" }}
                formatter={(value) => [`${value}%`, "Performance"]}
              />
              <Bar dataKey="performance" fill="var(--color-primary)" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
