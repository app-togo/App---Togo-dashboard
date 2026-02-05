"use client"

import { Sidebar } from "@/components/layout/sidebar"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { useState } from "react"
import { Key, Copy, RefreshCw, Trash2, Eye, EyeOff, CheckCircle2, Settings as SettingsIcon, ShieldCheck } from "lucide-react"
import { toast } from "sonner"
import { useLiveStatus } from "@/hooks/use-live-metrics"

export default function SettingsPage() {
  const status = useLiveStatus()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [settings, setSettings] = useState({
    aiAutomation: true,
    notificationEmails: true,
    dataRetention: "90",
    twoFactor: false,
    performanceAlerts: true,
    complianceMode: true,
  })

  // Mock API Keys
  const [apiKeys, setApiKeys] = useState([
    { id: "1", name: "Production Key", key: "at_live_a7b2...9f31", created: "2024-01-10", visible: false },
    { id: "2", name: "Testing Sandbox", key: "at_test_k9l3...0p22", created: "2024-01-12", visible: false },
  ])

  const toggleSetting = (key: keyof typeof settings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }))
  }

  const generateKey = () => {
    const newId = (apiKeys.length + 1).toString()
    const newKey = {
      id: newId,
      name: `New Key ${newId}`,
      key: `at_${Math.random() > 0.5 ? "live" : "test"}_${Math.random().toString(36).substring(2, 15)}`,
      created: new Date().toISOString().split("T")[0],
      visible: false
    }
    setApiKeys([...apiKeys, newKey])
    toast.success("New API key generated successfully")
  }

  const deleteKey = (id: string) => {
    setApiKeys(apiKeys.filter(k => k.id !== id))
    toast.error("API key revoked", {
      description: "The selected developer key has been invalidated."
    })
  }

  const toggleVisibility = (id: string) => {
    setApiKeys(apiKeys.map(k => k.id === id ? { ...k, visible: !k.visible } : k))
  }

  const copyToClipboard = (key: string) => {
    navigator.clipboard.writeText(key)
    toast.success("Copied to clipboard", {
      icon: <CheckCircle2 className="w-4 h-4 text-primary" />
    })
  }

  return (
    <div className="flex h-screen bg-background font-sans overflow-hidden">
      <Sidebar 
        currentPage="settings" 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
      />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader onMenuClick={() => setSidebarOpen(true)} />
        
        <main className="flex-1 overflow-y-auto overflow-x-hidden">
          <div className="p-4 sm:p-5 md:p-6 lg:p-8 max-w-7xl mx-auto w-full">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row items-start justify-between mb-6 sm:mb-8 gap-4">
              <div className="space-y-1 sm:space-y-2">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3">
                  <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-3xl font-bold text-foreground font-display">
                    System Configuration
                  </h1>
                  <div className="px-2 py-0.5 sm:py-1 bg-accent/10 border border-accent/20 rounded text-[9px] sm:text-[10px] font-bold text-accent uppercase tracking-[0.2em] animate-pulse flex items-center gap-1.5">
                    <ShieldCheck className="w-3 h-3" />
                    <span className="hidden xs:inline">Moderated Environment:</span>
                    <span className="xs:hidden">Env:</span> {status}
                  </div>
                </div>
                <p className="text-muted-foreground text-xs sm:text-sm uppercase tracking-widest font-medium opacity-70">
                  Core System Parameters
                </p>
              </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid gap-6 sm:gap-8 lg:grid-cols-3">
              {/* Left Column - Main Settings */}
              <div className="lg:col-span-2 space-y-6 sm:space-y-8">
                {/* AI Intelligence Settings */}
                <Card className="bg-card/40 backdrop-blur-xl border-white/5 shadow-xl overflow-hidden">
                  <CardHeader className="border-b border-white/5 bg-white/5">
                    <CardTitle className="flex items-center gap-2 text-base sm:text-lg md:text-xl">
                      <SettingsIcon className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                      AI Intelligence Settings
                    </CardTitle>
                    <CardDescription className="text-xs sm:text-sm">
                      Configure core autonomous behaviors
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-4 sm:p-5 md:p-6 space-y-4 sm:space-y-6">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl bg-white/5 border border-white/5">
                      <div className="space-y-0.5 flex-1">
                        <p className="text-sm sm:text-base font-bold text-foreground">
                          Autonomous Task Allocation
                        </p>
                        <p className="text-xs sm:text-sm text-muted-foreground">
                          Allow AI to dynamically assign tasks to teams
                        </p>
                      </div>
                      <button
                        onClick={() => toggleSetting("aiAutomation")}
                        className={`w-12 h-6 sm:w-14 sm:h-7 rounded-full transition-all relative flex-shrink-0 ${settings.aiAutomation ? "bg-primary" : "bg-muted"}`}
                      >
                        <div className={`absolute top-1 w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-white transition-all ${settings.aiAutomation ? "right-1" : "left-1"}`} />
                      </button>
                    </div>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl bg-white/5 border border-white/5">
                      <div className="space-y-0.5 flex-1">
                        <p className="text-sm sm:text-base font-bold text-foreground">
                          Compliance Guardrails
                        </p>
                        <p className="text-xs sm:text-sm text-muted-foreground">
                          Force-check all AI decisions for safety compliance
                        </p>
                      </div>
                      <button
                        onClick={() => toggleSetting("complianceMode")}
                        className={`w-12 h-6 sm:w-14 sm:h-7 rounded-full transition-all relative flex-shrink-0 ${settings.complianceMode ? "bg-primary" : "bg-muted"}`}
                      >
                        <div className={`absolute top-1 w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-white transition-all ${settings.complianceMode ? "right-1" : "left-1"}`} />
                      </button>
                    </div>
                  </CardContent>
                </Card>

                {/* API & Developer Keys */}
                <Card className="bg-card/40 backdrop-blur-xl border-white/5 shadow-xl overflow-hidden">
                  <CardHeader className="border-b border-white/5 bg-white/5">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
                      <div className="flex-1">
                        <CardTitle className="flex items-center gap-2 text-base sm:text-lg md:text-xl">
                          <Key className="w-4 h-4 sm:w-5 sm:h-5 text-accent" />
                          API & Developer Keys
                        </CardTitle>
                        <CardDescription className="text-xs sm:text-sm mt-1">
                          Manage keys for external integrations
                        </CardDescription>
                      </div>
                      <button
                        onClick={generateKey}
                        className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-primary/10 border border-primary/20 text-primary hover:bg-primary hover:text-white transition-all rounded-lg font-bold text-xs sm:text-sm whitespace-nowrap"
                      >
                        <RefreshCw className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                        <span className="hidden xs:inline">New Secret Key</span>
                        <span className="xs:hidden">New Key</span>
                      </button>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 sm:p-5 md:p-6 space-y-3 sm:space-y-4">
                    {apiKeys.map((apiKey) => (
                      <div key={apiKey.id} className="p-3 sm:p-4 rounded-xl bg-white/5 border border-white/5 group">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                          <div className="space-y-1 flex-1 min-w-0">
                            <p className="text-sm sm:text-base font-bold text-foreground truncate">
                              {apiKey.name}
                            </p>
                            <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                              <code className="text-[10px] sm:text-xs font-mono text-muted-foreground bg-black/40 px-2 py-1 rounded border border-white/5 break-all">
                                {apiKey.visible ? apiKey.key : apiKey.key.replace(/(?<=at_[a-z]+_).*/, '••••••••••••')}
                              </code>
                              <button
                                onClick={() => toggleVisibility(apiKey.id)}
                                className="text-muted-foreground hover:text-foreground transition-colors flex-shrink-0"
                              >
                                {apiKey.visible ? <EyeOff className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> : <Eye className="w-3 h-3 sm:w-3.5 sm:h-3.5" />}
                              </button>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => copyToClipboard(apiKey.key)}
                              className="p-2 hover:bg-white/10 rounded-lg text-primary transition-all"
                              aria-label="Copy key"
                            >
                              <Copy className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                            </button>
                            <button
                              onClick={() => deleteKey(apiKey.id)}
                              className="p-2 hover:bg-white/10 rounded-lg text-destructive transition-all"
                              aria-label="Delete key"
                            >
                              <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                    <p className="text-[9px] sm:text-[10px] text-muted-foreground italic mt-3 sm:mt-4">
                      Your secret keys are encrypted at rest. Do not share them in public repositories.
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Right Column - Security & Health */}
              <div className="space-y-6 sm:space-y-8">
                {/* Security Policy */}
                <Card className="bg-card/40 backdrop-blur-xl border-white/5 shadow-xl">
                  <CardHeader className="p-4 sm:p-5 md:p-6">
                    <CardTitle className="text-sm sm:text-base">Security Policy</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 sm:p-5 md:p-6 pt-0 space-y-4 sm:space-y-6">
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-xs sm:text-sm font-medium text-muted-foreground uppercase tracking-widest">
                        Two-Factor Auth
                      </span>
                      <button
                        onClick={() => toggleSetting("twoFactor")}
                        className={`w-10 h-5 sm:w-11 sm:h-6 rounded-full transition-all relative flex-shrink-0 ${settings.twoFactor ? "bg-accent" : "bg-muted"}`}
                      >
                        <div className={`absolute top-0.5 sm:top-1 w-4 h-4 sm:w-4 sm:h-4 rounded-full bg-white transition-all ${settings.twoFactor ? "right-0.5 sm:right-1" : "left-0.5 sm:left-1"}`} />
                      </button>
                    </div>
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-xs sm:text-sm font-medium text-muted-foreground uppercase tracking-widest">
                        Performance Alerts
                      </span>
                      <button
                        onClick={() => toggleSetting("performanceAlerts")}
                        className={`w-10 h-5 sm:w-11 sm:h-6 rounded-full transition-all relative flex-shrink-0 ${settings.performanceAlerts ? "bg-accent" : "bg-muted"}`}
                      >
                        <div className={`absolute top-0.5 sm:top-1 w-4 h-4 sm:w-4 sm:h-4 rounded-full bg-white transition-all ${settings.performanceAlerts ? "right-0.5 sm:right-1" : "left-0.5 sm:left-1"}`} />
                      </button>
                    </div>
                  </CardContent>
                </Card>

                {/* System Health */}
                <Card className="bg-primary/5 border-primary/20">
                  <CardHeader className="p-4 sm:p-5 md:p-6">
                    <CardTitle className="text-xs sm:text-sm font-bold uppercase tracking-widest text-primary">
                      System Health
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 sm:p-5 md:p-6 pt-0 space-y-3 sm:space-y-4">
                    <div className="space-y-1 sm:space-y-2">
                      <div className="flex justify-between text-[10px] sm:text-xs font-bold uppercase tracking-wider mb-1">
                        <span>Neural Load</span>
                        <span className="text-primary">42%</span>
                      </div>
                      <div className="h-1 sm:h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-primary w-[42%] transition-all duration-300"></div>
                      </div>
                    </div>
                    <button className="w-full py-2 sm:py-2.5 bg-white/5 border border-white/10 text-foreground text-[10px] sm:text-xs font-bold uppercase tracking-widest rounded hover:bg-white/10 transition-all">
                      Run Diagnostics
                    </button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

function Card({ children, className }: { children: React.ReactNode, className?: string }) {
  return <div className={`rounded-xl sm:rounded-2xl border ${className}`}>{children}</div>
}

function CardHeader({ children, className }: { children: React.ReactNode, className?: string }) {
  return <div className={`p-4 sm:p-5 md:p-6 ${className}`}>{children}</div>
}

function CardTitle({ children, className }: { children: React.ReactNode, className?: string }) {
  return <h2 className={`text-lg sm:text-xl font-bold ${className}`}>{children}</h2>
}

function CardDescription({ children, className }: { children: React.ReactNode, className?: string }) {
  return <p className={`text-xs sm:text-sm text-muted-foreground mt-1 ${className}`}>{children}</p>
}

function CardContent({ children, className }: { children: React.ReactNode, className?: string }) {
  return <div className={className}>{children}</div>
}