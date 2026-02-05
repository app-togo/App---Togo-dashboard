"use client"

import { Sidebar } from "@/components/layout/sidebar"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, MapPin, CheckCircle2, Clock, MoreVertical, Radio, User, Activity, Satellite, TrendingUp, Navigation, Download, AlertCircle } from "lucide-react"
import { useLiveMetrics, useLiveStatus } from "@/hooks/use-live-metrics"
import { toast } from "sonner"
import { useState, useEffect, useRef } from "react"

// ============================================================================
// LOCATION TRACKING SERVICE - INTEGRATED
// ============================================================================

interface EmployeeLocation {
    id: string
    name: string
    latitude: number
    longitude: number
    location: string
    activity: string
    timestamp: Date
    accuracy: number
    speed?: number
    heading?: number
}

interface TrackingConfig {
    apiKey: string
    updateInterval: number
    enableHighAccuracy: boolean
}

class LocationTrackingService {
    private config: TrackingConfig
    private watchIds: Map<string, number> = new Map()
    private employeeLocations: Map<string, EmployeeLocation> = new Map()
    private subscribers: Set<(locations: EmployeeLocation[]) => void> = new Set()

    constructor(config: TrackingConfig) {
        this.config = config
    }

    async startTracking(employeeId: string, employeeName: string): Promise<void> {
        if (!navigator.geolocation) {
            throw new Error('Geolocation is not supported by this browser')
        }

        const watchId = navigator.geolocation.watchPosition(
            async (position) => {
                const location = await this.processLocation(employeeId, employeeName, position)
                this.employeeLocations.set(employeeId, location)
                this.notifySubscribers()
            },
            (error) => {
                console.error(`Error tracking ${employeeName}:`, error)
            },
            {
                enableHighAccuracy: this.config.enableHighAccuracy,
                timeout: 10000,
                maximumAge: 0,
            }
        )

        this.watchIds.set(employeeId, watchId)
    }

    stopTracking(employeeId: string): void {
        const watchId = this.watchIds.get(employeeId)
        if (watchId !== undefined) {
            navigator.geolocation.clearWatch(watchId)
            this.watchIds.delete(employeeId)
            this.employeeLocations.delete(employeeId)
            this.notifySubscribers()
        }
    }

    private async processLocation(
        employeeId: string,
        employeeName: string,
        position: GeolocationPosition
    ): Promise<EmployeeLocation> {
        const { latitude, longitude, accuracy, speed, heading } = position.coords

        const locationName = await this.reverseGeocode(latitude, longitude)

        let activity = 'Stationary'
        if (speed !== null) {
            if (speed > 5) activity = 'Traveling'
            else if (speed > 1) activity = 'Walking'
        }

        return {
            id: employeeId,
            name: employeeName,
            latitude,
            longitude,
            location: locationName,
            activity,
            timestamp: new Date(),
            accuracy,
            speed: speed ?? undefined,
            heading: heading ?? undefined,
        }
    }

    private async reverseGeocode(lat: number, lng: number): Promise<string> {
        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
                {
                    headers: {
                        'User-Agent': 'FieldOperationsApp/1.0',
                    },
                }
            )

            if (!response.ok) {
                throw new Error('Geocoding failed')
            }

            const data = await response.json()
            const address = data.address
            const parts = []

            if (address.road) parts.push(address.road)
            if (address.suburb || address.neighbourhood) parts.push(address.suburb || address.neighbourhood)
            if (address.city || address.town) parts.push(address.city || address.town)

            return parts.length > 0 ? parts.slice(0, 2).join(', ') : 'Unknown Location'
        } catch (error) {
            console.error('Reverse geocoding error:', error)
            return `${lat.toFixed(4)}, ${lng.toFixed(4)}`
        }
    }

    async getCurrentLocation(employeeId: string, employeeName: string): Promise<EmployeeLocation> {
        return new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const location = await this.processLocation(employeeId, employeeName, position)
                    this.employeeLocations.set(employeeId, location)
                    this.notifySubscribers()
                    resolve(location)
                },
                (error) => reject(error),
                {
                    enableHighAccuracy: this.config.enableHighAccuracy,
                    timeout: 10000,
                    maximumAge: 0,
                }
            )
        })
    }

    subscribe(callback: (locations: EmployeeLocation[]) => void): () => void {
        this.subscribers.add(callback)
        return () => this.subscribers.delete(callback)
    }

    private notifySubscribers(): void {
        const locations = Array.from(this.employeeLocations.values())
        this.subscribers.forEach((callback) => callback(locations))
    }

    getAllLocations(): EmployeeLocation[] {
        return Array.from(this.employeeLocations.values())
    }

    getEmployeeLocation(employeeId: string): EmployeeLocation | undefined {
        return this.employeeLocations.get(employeeId)
    }

    calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
        const R = 6371
        const dLat = this.toRad(lat2 - lat1)
        const dLon = this.toRad(lon2 - lon1)
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(this.toRad(lat1)) *
            Math.cos(this.toRad(lat2)) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2)
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
        return R * c
    }

    private toRad(degrees: number): number {
        return degrees * (Math.PI / 180)
    }

    exportData(): string {
        const locations = this.getAllLocations()
        const csv = [
            'Employee ID,Name,Latitude,Longitude,Location,Activity,Timestamp,Accuracy,Speed,Heading',
            ...locations.map(
                (loc) =>
                    `${loc.id},${loc.name},${loc.latitude},${loc.longitude},"${loc.location}",${loc.activity},${loc.timestamp.toISOString()},${loc.accuracy},${loc.speed ?? ''},${loc.heading ?? ''}`
            ),
        ].join('\n')
        return csv
    }
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const teams = [
    {
        name: "Team Alpha",
        location: "Downtown Sector A",
        status: "Active",
        tasks: 12,
        completion: "85%",
        leader: "Sarah Johnson",
        color: "bg-green-500/10 text-green-500 border-green-500/20",
    },
    {
        name: "Team Bravo",
        location: "Industrial Park",
        status: "In Transit",
        tasks: 8,
        completion: "42%",
        leader: "Michael Chen",
        color: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    },
    {
        name: "Team Charlie",
        location: "East Ridge",
        status: "On Break",
        tasks: 15,
        completion: "92%",
        leader: "Emily Rodriguez",
        color: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
    },
    {
        name: "Team Delta",
        location: "Harbor District",
        status: "Delayed",
        tasks: 5,
        completion: "20%",
        leader: "David Wilson",
        color: "bg-red-500/10 text-red-500 border-red-500/20",
    },
]

const demoEmployees = [
    { id: "EMP-084", name: "Robert Fox" },
    { id: "EMP-102", name: "Jane Cooper" },
    { id: "EMP-042", name: "Guy Hawkins" },
]

export default function FieldOperationsPage() {
    const status = useLiveStatus()
    const activeTasks = useLiveMetrics(142, 5)
    const responseSecs = useLiveMetrics(24, 2)
    const efficiency = useLiveMetrics(94.2, 0.3)
    
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)
    const [liveTracking, setLiveTracking] = useState<EmployeeLocation[]>([])
    const [isTrackingActive, setIsTrackingActive] = useState(false)
    const [trackingError, setTrackingError] = useState<string | null>(null)
    const trackingServiceRef = useRef<LocationTrackingService | null>(null)

    // Initialize tracking service
    useEffect(() => {
        try {
            // Get API key from environment or use provided key
            const apiKey = process.env.NEXT_PUBLIC_GEOLOCATION_API_KEY || "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"
            
            trackingServiceRef.current = new LocationTrackingService({
                apiKey,
                updateInterval: 5000,
                enableHighAccuracy: true,
            })
        } catch (error) {
            console.error("Failed to initialize tracking:", error)
            setTrackingError("Failed to initialize tracking service")
        }
    }, [])

    // Subscribe to location updates
    useEffect(() => {
        if (!isTrackingActive || !trackingServiceRef.current) return

        const unsubscribe = trackingServiceRef.current.subscribe((locations) => {
            setLiveTracking(locations)
        })

        return () => unsubscribe()
    }, [isTrackingActive])

    const handleStartTracking = async () => {
        if (!trackingServiceRef.current) {
            toast.error("Tracking service not initialized")
            return
        }

        try {
            toast.loading("Requesting location permissions...")

            for (const employee of demoEmployees) {
                await trackingServiceRef.current.startTracking(employee.id, employee.name)
            }

            setIsTrackingActive(true)
            setTrackingError(null)
            toast.success("Location tracking activated", {
                description: `Tracking ${demoEmployees.length} employees in real-time`,
            })
        } catch (error) {
            console.error("Error starting tracking:", error)
            const errorMessage = error instanceof Error ? error.message : "Unknown error"
            setTrackingError(errorMessage)
            toast.error("Failed to start tracking", {
                description: errorMessage,
            })
        }
    }

    const handleStopTracking = () => {
        if (!trackingServiceRef.current) return

        try {
            demoEmployees.forEach((employee) => {
                trackingServiceRef.current?.stopTracking(employee.id)
            })

            setIsTrackingActive(false)
            setLiveTracking([])
            toast.info("Location tracking stopped")
        } catch (error) {
            console.error("Error stopping tracking:", error)
            toast.error("Failed to stop tracking")
        }
    }

    const handleGetCurrentLocation = async (employeeId: string, employeeName: string) => {
        if (!trackingServiceRef.current) return

        try {
            toast.loading(`Getting current location for ${employeeName}...`)

            const location = await trackingServiceRef.current.getCurrentLocation(employeeId, employeeName)

            toast.success(`Location found for ${employeeName}`, {
                description: `${location.location} (±${Math.round(location.accuracy)}m accuracy)`,
            })
        } catch (error) {
            console.error("Error getting location:", error)
            toast.error(`Failed to get location for ${employeeName}`)
        }
    }

    const handleMapClick = () => {
        if (liveTracking.length > 0) {
            const coords = liveTracking.map(l => `${l.name}: ${l.latitude.toFixed(6)}, ${l.longitude.toFixed(6)}`).join('\n')
            toast.info(`Interactive map: Showing ${liveTracking.length} tracked employees`, {
                description: coords,
            })
        } else {
            toast.info("Interactive map: No active tracking", {
                description: "Start tracking to see employee locations",
            })
        }
    }

    const handleExportTelemetry = () => {
        if (!trackingServiceRef.current) return

        try {
            const csv = trackingServiceRef.current.exportData()

            const blob = new Blob([csv], { type: 'text/csv' })
            const url = window.URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = `field_telemetry_${new Date().toISOString().split('T')[0]}.csv`
            a.click()
            window.URL.revokeObjectURL(url)

            toast.success("Telemetry exported", {
                description: `File: field_telemetry_${new Date().toISOString().split('T')[0]}.csv`,
            })
        } catch (error) {
            console.error("Error exporting telemetry:", error)
            toast.error("Failed to export telemetry")
        }
    }

    const handleMoreOptions = (teamName: string) => {
        toast.info(`Options for ${teamName}: Assign task, View history, Contact leader`)
    }

    const getTimeAgo = (timestamp: Date): string => {
        const seconds = Math.floor((new Date().getTime() - timestamp.getTime()) / 1000)

        if (seconds < 10) return "Now"
        if (seconds < 60) return `${seconds}s ago`
        if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
        return `${Math.floor(seconds / 3600)}h ago`
    }

    const handleViewAllCoordinates = () => {
        if (liveTracking.length > 0) {
            const coords = liveTracking.map(l => 
                `${l.name} (${l.id}):\n` +
                `  Location: ${l.location}\n` +
                `  Coordinates: ${l.latitude.toFixed(6)}, ${l.longitude.toFixed(6)}\n` +
                `  Accuracy: ±${Math.round(l.accuracy)}m\n` +
                `  Activity: ${l.activity}\n` +
                `  Speed: ${l.speed ? (l.speed * 3.6).toFixed(1) + ' km/h' : 'N/A'}`
            ).join('\n\n')
            
            toast.info("All Employee Coordinates", {
                description: coords,
                duration: 10000,
            })
        } else {
            toast.info("No tracked locations available")
        }
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
            <Sidebar currentPage="field operations" isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
            <div className="flex-1 flex flex-col overflow-hidden">
                <DashboardHeader onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />
                <main className="flex-1 overflow-y-auto p-4 md:p-6 max-w-7xl mx-auto w-full">
                    {/* Header Section */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                        <div className="space-y-1 flex-1">
                            <div className="flex flex-col md:flex-row md:items-center gap-3">
                                <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground">Field Operations & Tracking</h1>
                                <div className={`px-2 py-0.5 ${isTrackingActive ? 'bg-primary/10 border-primary/20 text-primary' : 'bg-muted border-muted-foreground/20 text-muted-foreground'} border rounded text-[8px] md:text-[9px] font-bold uppercase tracking-[0.1em] md:tracking-[0.2em] ${isTrackingActive ? 'animate-pulse' : ''} flex items-center gap-1.5 whitespace-nowrap`}>
                                    <Satellite className="w-3 h-3" />
                                    Live Telemetry: {isTrackingActive ? 'Active' : 'Standby'}
                                </div>
                            </div>
                            <p className="text-muted-foreground text-sm">Real-time GPS tracking and management of operational teams</p>
                        </div>
                        <div className="flex gap-2 flex-wrap">
                            <button
                                onClick={handleMapClick}
                                className="px-3 md:px-4 py-2 bg-primary/10 border border-primary/30 text-primary rounded-lg font-bold text-xs hover:bg-primary hover:text-white transition-all flex items-center gap-2 group"
                                type="button"
                            >
                                <MapPin className="w-3.5 h-3.5 group-hover:animate-bounce" />
                                <span className="hidden sm:inline">Interactive Map</span>
                                <span className="sm:hidden">Map</span>
                            </button>
                            <button
                                onClick={handleExportTelemetry}
                                className="px-3 md:px-4 py-2 bg-white/5 border border-white/10 text-muted-foreground rounded-lg font-bold text-xs hover:bg-white/10 transition-all flex items-center gap-2"
                                type="button"
                            >
                                <Download className="w-3.5 h-3.5" />
                                <span className="hidden sm:inline">Export Telemetry</span>
                                <span className="sm:hidden">Export</span>
                            </button>
                        </div>
                    </div>

                    {/* Error Message */}
                    {trackingError && (
                        <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg flex items-center gap-3">
                            <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0" />
                            <p className="text-sm text-destructive">{trackingError}</p>
                        </div>
                    )}

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
                        <Card className="bg-card/40 backdrop-blur-xl border-white/5 hover:border-sidebar-border/50 transition-all">
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Total Active Teams</CardTitle>
                                <Users className="h-4 w-4 text-primary" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold tracking-tight">24</div>
                                <p className="text-[10px] text-muted-foreground mt-1 flex items-center gap-1">
                                    <Activity className="w-3 h-3 text-accent" />
                                    Synced across 4 main sectors
                                </p>
                            </CardContent>
                        </Card>
                        <Card className="bg-card/40 backdrop-blur-xl border-white/5 hover:border-sidebar-border/50 transition-all">
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Active Tasks</CardTitle>
                                <CheckCircle2 className="h-4 w-4 text-accent" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold tracking-tight">{Math.floor(activeTasks)}</div>
                                <p className="text-[10px] text-muted-foreground mt-1">Status: {status}</p>
                            </CardContent>
                        </Card>
                        <Card className="bg-card/40 backdrop-blur-xl border-white/5 hover:border-sidebar-border/50 transition-all">
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Avg. Response Time</CardTitle>
                                <Clock className="h-4 w-4 text-yellow-500" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold tracking-tight">18m {Math.floor(responseSecs)}s</div>
                                <p className="text-[10px] text-muted-foreground mt-1 flex items-center gap-1">
                                    <TrendingUp className="w-3 h-3 text-accent" />
                                    Optimizing via AI Route Engine
                                </p>
                            </CardContent>
                        </Card>
                        <Card className="bg-card/40 backdrop-blur-xl border-white/5 hover:border-sidebar-border/50 transition-all">
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Tracked Employees</CardTitle>
                                <Navigation className={`h-4 w-4 ${isTrackingActive ? 'text-primary animate-pulse' : 'text-muted-foreground'}`} />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold tracking-tight">{liveTracking.length}</div>
                                <p className="text-[10px] text-muted-foreground mt-1 italic">
                                    {isTrackingActive ? 'Real-time GPS monitoring' : 'Tracking inactive'}
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Main Content Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 mb-8">
                        {/* Teams Table */}
                        <div className="lg:col-span-2">
                            <div className="bg-card/50 backdrop-blur-sm border border-sidebar-border rounded-xl overflow-hidden h-full">
                                <div className="p-6 border-b border-sidebar-border flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                    <h3 className="text-base sm:text-lg font-semibold">Active Teams Status</h3>
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                            <div className="w-2 h-2 rounded-full bg-green-500"></div> Active
                                        </div>
                                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                            <div className="w-2 h-2 rounded-full bg-blue-500"></div> In Transit
                                        </div>
                                    </div>
                                </div>
                                <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-white/5">
                                    <table className="w-full min-w-max">
                                        <thead>
                                            <tr className="text-left text-[10px] sm:text-xs font-medium text-muted-foreground border-b border-sidebar-border whitespace-nowrap sm:whitespace-normal">
                                                <th className="px-3 sm:px-6 py-4">TEAM</th>
                                                <th className="px-3 sm:px-6 py-4 hidden sm:table-cell">LOCATION</th>
                                                <th className="px-3 sm:px-6 py-4">STATUS</th>
                                                <th className="px-3 sm:px-6 py-4 hidden md:table-cell">TASKS</th>
                                                <th className="px-3 sm:px-6 py-4">COMPLETION</th>
                                                <th className="px-3 sm:px-6 py-4"></th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-sidebar-border">
                                            {teams.map((team) => (
                                                <tr key={team.name} className="hover:bg-sidebar-accent/20 transition-colors group">
                                                    <td className="px-3 sm:px-6 py-4 text-xs sm:text-sm font-medium">{team.name}</td>
                                                    <td className="px-3 sm:px-6 py-4 text-xs sm:text-sm text-muted-foreground font-mono hidden sm:table-cell">{team.location}</td>
                                                    <td className="px-3 sm:px-6 py-4">
                                                        <Badge variant="outline" className={`${team.color} font-medium text-[9px] sm:text-xs px-2 py-1`}>
                                                            {team.status}
                                                        </Badge>
                                                    </td>
                                                    <td className="px-3 sm:px-6 py-4 text-xs sm:text-sm font-semibold hidden md:table-cell">{team.tasks}</td>
                                                    <td className="px-3 sm:px-6 py-4">
                                                        <div className="flex items-center gap-1 sm:gap-2">
                                                            <div className="flex-1 h-1.5 w-12 sm:w-24 bg-muted rounded-full overflow-hidden">
                                                                <div
                                                                    className="h-full bg-primary"
                                                                    style={{ width: team.completion }}
                                                                ></div>
                                                            </div>
                                                            <span className="text-[9px] sm:text-xs font-medium whitespace-nowrap">{team.completion}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-3 sm:px-6 py-4 text-right">
                                                        <button onClick={() => handleMoreOptions(team.name)} className="p-1 hover:bg-muted rounded transition-colors text-muted-foreground" type="button">
                                                            <MoreVertical className="w-4 h-4" />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>

                        {/* Live Tracking Card */}
                        <Card className="bg-card/50 backdrop-blur-sm border-sidebar-border">
                            <CardHeader className="flex flex-row items-center justify-between">
                                <div>
                                    <CardTitle className="text-base">Real-time Employee Tracking</CardTitle>
                                    <CardDescription>Live GPS coordinates & activity</CardDescription>
                                </div>
                                <Radio className={`h-4 w-4 ${isTrackingActive ? 'text-primary animate-pulse' : 'text-muted-foreground'}`} />
                            </CardHeader>
                            <CardContent className="p-0">
                                {!isTrackingActive && liveTracking.length === 0 ? (
                                    <div className="p-8 text-center">
                                        <Navigation className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
                                        <p className="text-sm text-muted-foreground mb-4">
                                            No active tracking sessions
                                        </p>
                                        <button
                                            onClick={handleStartTracking}
                                            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-bold text-xs hover:bg-primary/90 transition-all"
                                            type="button"
                                        >
                                            Start Live Tracking
                                        </button>
                                    </div>
                                ) : (
                                    <>
                                        <div className="divide-y divide-sidebar-border max-h-96 overflow-y-auto">
                                            {liveTracking.length > 0 ? (
                                                liveTracking.map((emp) => (
                                                    <div key={emp.id} className="p-4 flex items-center justify-between hover:bg-sidebar-accent/30 transition-colors">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center relative">
                                                                <User className="w-4 h-4 text-muted-foreground" />
                                                                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-card animate-pulse"></div>
                                                            </div>
                                                            <div>
                                                                <p className="text-sm font-medium">{emp.name}</p>
                                                                <p className="text-[10px] text-muted-foreground">{emp.id} • {emp.location}</p>
                                                                <p className="text-[9px] text-muted-foreground/70 font-mono">
                                                                    {emp.latitude.toFixed(6)}, {emp.longitude.toFixed(6)} (±{Math.round(emp.accuracy)}m)
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <div className="text-right">
                                                            <p className="text-[10px] font-semibold text-primary">{emp.activity}</p>
                                                            <p className="text-[10px] text-muted-foreground">{getTimeAgo(emp.timestamp)}</p>
                                                            {emp.speed !== undefined && emp.speed > 0 && (
                                                                <p className="text-[9px] text-muted-foreground/70">{(emp.speed * 3.6).toFixed(1)} km/h</p>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="p-8 text-center">
                                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                                                    <p className="text-sm text-muted-foreground">
                                                        Waiting for GPS signal...
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                        <div className="p-4 bg-sidebar-accent/20 space-y-2">
                                            <button
                                                onClick={handleViewAllCoordinates}
                                                className="w-full py-2 text-xs font-semibold text-primary hover:bg-primary/10 rounded transition-all"
                                                type="button"
                                            >
                                                View All Coordinates
                                            </button>
                                            {isTrackingActive && (
                                                <button
                                                    onClick={handleStopTracking}
                                                    className="w-full py-2 text-xs font-semibold text-destructive hover:bg-destructive/10 rounded transition-all"
                                                    type="button"
                                                >
                                                    Stop Tracking
                                                </button>
                                            )}
                                        </div>
                                    </>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </main>
            </div>
        </div>
    )
}