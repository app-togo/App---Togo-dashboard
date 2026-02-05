"use client"

import { Sidebar } from "@/components/layout/sidebar"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PlayCircle, PauseCircle, RotateCcw, Box, FastForward, Users, MapPin, Activity, Cpu, Sparkles } from "lucide-react"
import { useLiveMetrics, useLiveStatus } from "@/hooks/use-live-metrics"
import { toast } from "sonner"
import { useState } from "react"
const simulationParams = [
    { label: "Deployment Scale", value: "Large (24 units)", level: 80, range: 2 },
    { label: "Response Threshold", value: "Strict (< 15m)", level: 92, range: 1 },
    { label: "Predictive Bias", value: "Aggressive", level: 65, range: 5 },
]

export default function SimulationsPage() {
    const status = useLiveStatus()
    const confidence = useLiveMetrics(88, 1)
    const latentTasks = useLiveMetrics(156, 4)
    const [isRunning, setIsRunning] = useState(false)
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)

    // Live parameter levels
    const p1 = useLiveMetrics(80, 2)
    const p2 = useLiveMetrics(92, 1)
    const p3 = useLiveMetrics(65, 3)
    const liveLevels = [p1, p2, p3]

    const handleStartSimulation = () => {
        setIsRunning(!isRunning)
        if (!isRunning) {
            toast.success("Simulation started", { description: "Modeling field strategies..." })
        } else {
            toast.info("Simulation paused")
        }
    }

    const handleSaveScenario = () => {
        toast.success("Scenario saved", { description: "Current simulation parameters saved" })
    }

    const handleConfigure = () => {
        toast.info("Configuration panel: Set deployment scale, response time, and bias levels")
    }

    const handlePause = () => {
        toast.info("Simulation paused")
    }

    const handleReset = () => {
        setIsRunning(false)
        toast.info("Simulation reset to initial state")
    }

    const handleFastForward = () => {
        toast.success("Fast-forward: 10x speed enabled")
    }

    const handleQuickScenario = (scenario: string) => {
        setIsRunning(true)
        toast.success(`Running: ${scenario}`, { description: "Simulation started with preset parameters" })
    }

    return (
        <div className="flex h-screen bg-background font-sans overflow-hidden">
            {/* Mobile overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 md:hidden z-30"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}
            <Sidebar currentPage="simulations" isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
            <div className="flex-1 flex flex-col overflow-hidden">
                <DashboardHeader onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />
                <main className="flex-1 overflow-y-auto p-4 md:p-6 max-w-7xl mx-auto w-full">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                        <div className="space-y-1 flex-1">
                            <div className="flex flex-col md:flex-row md:items-center gap-3">
                                <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground">Operational Simulations</h1>
                                <div className="px-2 py-0.5 bg-accent/10 border border-accent/20 rounded text-[8px] md:text-[9px] font-bold text-accent uppercase tracking-[0.1em] md:tracking-[0.2em] animate-pulse flex items-center gap-1.5 whitespace-nowrap">
                                    <Sparkles className="w-3 h-3" />
                                    Neural Sandbox
                                </div>
                            </div>
                            <p className="text-muted-foreground text-sm">Interactive sandbox for modeling field strategies and AI outcomes</p>
                        </div>
                        <div className="flex gap-2 flex-wrap">
                            <button onClick={handleStartSimulation} className="px-4 md:px-6 py-2 bg-primary text-primary-foreground rounded-lg font-bold text-xs md:text-sm hover:scale-105 transition-all flex items-center gap-2 shadow-lg shadow-primary/20 cursor-pointer whitespace-nowrap">
                                <PlayCircle className="w-4 h-4" />
                                <span className="hidden sm:inline">{isRunning ? "Stop" : "Start"} Simulation</span>
                                <span className="sm:hidden">{isRunning ? "Stop" : "Start"}</span>
                            </button>
                            <button onClick={handleSaveScenario} className="px-3 md:px-4 py-2 bg-white/5 border border-white/10 text-muted-foreground rounded-lg font-bold text-xs hover:bg-white/10 transition-all cursor-pointer">
                                <span className="hidden sm:inline">Save Scenario</span>
                                <span className="sm:hidden">Save</span>
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 mb-8">
                        <Card className="lg:col-span-2 bg-card/40 backdrop-blur-xl border-white/5 relative overflow-hidden group shadow-2xl">
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 pointer-events-none"></div>
                            <CardHeader className="flex flex-row items-center justify-between border-b border-white/5 bg-white/5">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-primary/10 rounded-lg">
                                        <Cpu className="w-5 h-5 text-primary animate-pulse" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-lg">Simulation Environment: Beta-V4</CardTitle>
                                        <CardDescription className="text-[10px] uppercase tracking-wider font-bold text-primary/60">Live predictive visualization active</CardDescription>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Badge className="bg-primary/20 text-primary border-primary/30 font-bold px-2 py-0.5 flex items-center gap-1.5">
                                        <span className="w-1.5 h-1.5 bg-primary rounded-full animate-ping" />
                                        {status}
                                    </Badge>
                                    <div className="flex gap-1">
                                        <button onClick={handlePause} className="p-1.5 hover:bg-white/10 rounded transition-all text-muted-foreground" type="button"><PauseCircle className="w-4 h-4" /></button>
                                        <button onClick={handleReset} className="p-1.5 hover:bg-white/10 rounded transition-all text-muted-foreground" type="button"><RotateCcw className="w-4 h-4" /></button>
                                        <button onClick={handleFastForward} className="p-1.5 hover:bg-white/10 rounded transition-all text-muted-foreground" type="button"><FastForward className="w-4 h-4" /></button>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="p-0 h-[400px] flex items-center justify-center relative bg-[#050510]/50">
                                <div className="absolute inset-0 opacity-[0.05]"
                                    style={{
                                        backgroundImage: 'linear-gradient(var(--primary) 1px, transparent 1px), linear-gradient(90deg, var(--primary) 1px, transparent 1px)',
                                        backgroundSize: '40px 40px'
                                    }}></div>

                                <div className="w-full h-full p-6 flex items-center justify-center relative z-10">
                                    <div className="text-center relative">
                                        <div className="absolute -inset-20 bg-primary/20 blur-[100px] rounded-full animate-pulse-slow"></div>
                                        <Box className="w-16 h-16 text-primary mx-auto mb-4 animate-float" />
                                        <h3 className="text-2xl font-bold mb-2 tracking-tight">Spatial Simulation Active</h3>
                                        <p className="text-muted-foreground text-sm max-w-xs mx-auto">
                                            Modeling response times for 24 teams across Sector 7 under peak demand conditions.
                                        </p>
                                        <div className="mt-8 flex justify-center gap-8">
                                            <div className="text-center">
                                                <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest mb-1">Teams</p>
                                                <p className="text-2xl font-bold">24</p>
                                            </div>
                                            <div className="text-center border-l border-white/10 pl-8">
                                                <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest mb-1">Latent Tasks</p>
                                                <p className="text-2xl font-bold">{Math.floor(latentTasks)}</p>
                                            </div>
                                            <div className="text-center border-l border-white/10 pl-8">
                                                <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest mb-1">Confidence</p>
                                                <p className="text-2xl font-bold text-primary">{Math.floor(confidence)}%</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <div className="space-y-6">
                            <Card className="bg-card/50 backdrop-blur-sm border-sidebar-border">
                                <CardHeader>
                                    <CardTitle className="text-base flex items-center gap-2">
                                        <Activity className="w-4 h-4 text-primary" />
                                        Parameters
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    {simulationParams.map((param) => (
                                        <div key={param.label} className="space-y-2">
                                            <div className="flex justify-between text-xs">
                                                <span className="text-muted-foreground font-medium">{param.label}</span>
                                                <span className="text-foreground font-bold">{param.value}</span>
                                            </div>
                                            <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                                                <div className="h-full bg-primary" style={{ width: `${param.level}%` }}></div>
                                            </div>
                                        </div>
                                    ))}
                                    <button onClick={handleConfigure} className="w-full py-2 border border-primary/30 text-primary text-xs font-bold rounded-md hover:bg-primary/5 transition-all" type="button">
                                        Configure Environment
                                    </button>
                                </CardContent>
                            </Card>

                            <Card className="bg-primary/5 border-primary/20">
                                <CardHeader>
                                    <CardTitle className="text-sm">Quick Scenarios</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <button onClick={() => handleQuickScenario("Rush Hour Peak")} className="w-full p-3 rounded-lg bg-background/50 border border-sidebar-border flex items-center justify-between text-sm hover:border-primary/50 transition-all" type="button">
                                        <div className="flex items-center gap-2">
                                            <MapPin className="w-4 h-4 text-accent" />
                                            <span>Rush Hour Peak</span>
                                        </div>
                                        <Badge variant="outline" className="text-[10px]">High Load</Badge>
                                    </button>
                                    <button onClick={() => handleQuickScenario("Staff Reduction Loop")} className="w-full p-3 rounded-lg bg-background/50 border border-sidebar-border flex items-center justify-between text-sm hover:border-primary/50 transition-all" type="button">
                                        <div className="flex items-center gap-2">
                                            <Users className="w-4 h-4 text-green-500" />
                                            <span>Staff Reduction Loop</span>
                                        </div>
                                        <Badge variant="outline" className="text-[10px]">Critical</Badge>
                                    </button>
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                        <Card className="bg-card/50 backdrop-blur-sm border-sidebar-border">
                            <CardHeader>
                                <CardTitle>AI Outcomes Analysis</CardTitle>
                                <CardDescription>Predicted results based on current simulation</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="p-4 rounded-xl bg-accent/5 border border-accent/20">
                                    <h4 className="text-sm font-bold text-accent mb-2">Resource Efficiency</h4>
                                    <p className="text-sm text-foreground/80">Proposed strategy would reduce workforce waste by 12% in urban sectors but might increase response lag by 3m in rural zones.</p>
                                </div>
                                <div className="p-4 rounded-xl bg-primary/5 border border-primary/20">
                                    <h4 className="text-sm font-bold text-primary mb-2">Compliance Risk</h4>
                                    <p className="text-sm text-foreground/80">No significant compliance violations detected in the simulated pathing. Safety margins remain within +15% of threshold.</p>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-card/50 backdrop-blur-sm border-sidebar-border">
                            <CardHeader>
                                <CardTitle>Comparison History</CardTitle>
                                <CardDescription>Previous simulation runs performance</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {[1, 2, 3].map((i) => (
                                        <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-sidebar-accent/10 border border-sidebar-border/30">
                                            <div className="flex items-center gap-3">
                                                <div className="text-xs font-mono text-muted-foreground text-center w-8">v{4 - i}.0</div>
                                                <div>
                                                    <p className="text-xs font-bold">Standard Deployment {i}</p>
                                                    <p className="text-[10px] text-muted-foreground">Jan {14 + i}, 2026</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-xs font-bold text-primary">82% Efficient</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </main>
            </div>
        </div>
    )
}
