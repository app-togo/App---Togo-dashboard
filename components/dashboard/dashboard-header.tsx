"use client"

import { Search, Bell, ChevronDown, Menu, User, Settings, LogOut } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useState, useEffect, useRef } from "react"
import { toast } from "sonner"

const mockData = {
  employees: [
    { id: 1, name: "John Smith", role: "Manager" },
    { id: 2, name: "Sarah Johnson", role: "Developer" },
    { id: 3, name: "Michael Chen", role: "Designer" },
    { id: 4, name: "Emily Rodriguez", role: "Sales" },
  ],
  teams: [
    { id: 1, name: "Operations", members: 12 },
    { id: 2, name: "Development", members: 8 },
    { id: 3, name: "Support", members: 5 },
  ],
  tasks: [
    { id: 1, name: "Q1 Planning", status: "In Progress" },
    { id: 2, name: "Safety Audit", status: "Pending" },
    { id: 3, name: "System Upgrade", status: "Completed" },
  ]
}

interface User {
  id: string
  name: string
  email: string
  role: string
  avatar?: string
}

interface DashboardHeaderProps {
  onMenuClick?: () => void
  user?: User
}

export function DashboardHeader({ onMenuClick, user }: DashboardHeaderProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [showResults, setShowResults] = useState(false)
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const [notifications, setNotifications] = useState(3)
  
  const searchRef = useRef<HTMLFormElement>(null)
  const profileRef = useRef<HTMLDivElement>(null)

  // Default user if none provided
  const currentUser: User = user || {
    id: "1",
    name: "John Doe",
    email: "john.doe@company.com",
    role: "Administrator"
  }

  // Get user initials
  const getInitials = (name: string) => {
    const names = name.split(" ")
    if (names.length >= 2) {
      return `${names[0][0]}${names[1][0]}`.toUpperCase()
    }
    return name.substring(0, 2).toUpperCase()
  }

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false)
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase()
    setSearchQuery(query)
    
    if (query.trim().length > 0) {
      // Search across employees, teams, and tasks
      const results = [
        ...mockData.employees.filter(e => e.name.toLowerCase().includes(query)).map(e => ({ ...e, type: "Employee" })),
        ...mockData.teams.filter(t => t.name.toLowerCase().includes(query)).map(t => ({ ...t, type: "Team" })),
        ...mockData.tasks.filter(t => t.name.toLowerCase().includes(query)).map(t => ({ ...t, type: "Task" }))
      ]
      setSearchResults(results)
      setShowResults(true)
    } else {
      setSearchResults([])
      setShowResults(false)
    }
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim() && searchResults.length > 0) {
      toast.success(`Showing ${searchResults.length} result${searchResults.length !== 1 ? 's' : ''}`)
    } else if (searchQuery.trim()) {
      toast.warning(`No results found for "${searchQuery}"`)
    }
  }

  const handleResultClick = (result: any) => {
    toast.success(`Selected: ${result.name}`)
    setSearchQuery("")
    setShowResults(false)
  }

  const handleNotificationClick = () => {
    setNotifications(0)
    toast.info("Viewing notifications")
  }

  const handleLogout = () => {
    toast.success("Logged out successfully")
    // Add your logout logic here
  }

  return (
    <header className="bg-card border-b border-border h-14 sm:h-16 flex items-center justify-between px-3 sm:px-4 md:px-6 sticky top-0 z-50">
      <div className="flex items-center gap-2 sm:gap-4 flex-1 min-w-0">
        {/* Mobile Menu Button */}
        <button
          onClick={onMenuClick}
          className="md:hidden p-1.5 sm:p-2 hover:bg-primary/10 rounded-lg transition-colors flex-shrink-0"
          aria-label="Toggle menu"
        >
          <Menu className="w-4 h-4 sm:w-5 sm:h-5 text-foreground" />
        </button>

        {/* Logo - Visible only on mobile */}
        <div className="md:hidden flex items-center gap-1.5 flex-shrink-0">
          <Image
            src="/logo.svg"
            alt="App-Togo Logo"
            width={32}
            height={32}
            className="object-contain w-6 h-6"
            priority
          />
          <span className="text-[8px] font-bold uppercase tracking-widest text-foreground/80">AI</span>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearchSubmit} className="relative max-w-md flex-1 md:flex-none hidden sm:flex" ref={searchRef}>
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 sm:w-5 h-4 sm:h-5 text-muted-foreground pointer-events-none" />
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={handleSearch}
            onFocus={() => searchQuery && setShowResults(true)}
            className="w-full bg-input border border-border rounded-lg pl-10 pr-4 py-2 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
            aria-label="Search"
          />
          
          {/* Search Results Dropdown */}
          {showResults && searchResults.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-lg shadow-lg max-h-64 overflow-y-auto z-50">
              {searchResults.map((result, idx) => (
                <button
                  key={idx}
                  onClick={() => handleResultClick(result)}
                  type="button"
                  className="w-full text-left px-3 sm:px-4 py-2 text-xs sm:text-sm hover:bg-primary/10 transition-colors border-b border-border/50 last:border-b-0"
                >
                  <p className="font-medium text-foreground">{result.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {result.type}
                    {result.role && ` • ${result.role}`}
                    {result.members && ` • ${result.members} members`}
                    {result.status && ` • ${result.status}`}
                  </p>
                </button>
              ))}
            </div>
          )}
        </form>
      </div>

      <div className="flex items-center gap-1 sm:gap-2 md:gap-4 ml-1 sm:ml-2 md:ml-6">
        {/* Notification Bell */}
        <button
          onClick={handleNotificationClick}
          className="relative p-1.5 sm:p-2 text-muted-foreground hover:text-accent transition-colors cursor-pointer rounded-lg hover:bg-muted flex-shrink-0"
          aria-label="Notifications"
        >
          <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
          {notifications > 0 && (
            <>
              <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full animate-pulse"></span>
              <span className="absolute -top-1 -right-1 bg-destructive text-background text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {notifications}
              </span>
            </>
          )}
        </button>

        {/* User Profile Dropdown */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg hover:bg-muted transition-colors cursor-pointer"
            aria-label="User menu"
          >
            {/* User Avatar */}
            {currentUser.avatar ? (
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover flex-shrink-0"
              />
            ) : (
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-background text-xs sm:text-sm font-bold flex-shrink-0">
                {getInitials(currentUser.name)}
              </div>
            )}
            
            {/* User Name - Hidden on mobile */}
            <div className="hidden md:flex flex-col items-start">
              <span className="text-xs sm:text-sm font-medium text-foreground leading-tight">
                {currentUser.name}
              </span>
              <span className="text-[10px] sm:text-xs text-muted-foreground leading-tight">
                {currentUser.role}
              </span>
            </div>
            
            <ChevronDown className={`w-3 h-3 sm:w-4 sm:h-4 text-muted-foreground transition-transform flex-shrink-0 ${showProfileMenu ? 'rotate-180' : ''}`} />
          </button>

          {/* Profile Dropdown Menu */}
          {showProfileMenu && (
            <div className="absolute right-0 top-full mt-2 w-64 bg-card border border-border rounded-lg shadow-lg py-2 z-50">
              {/* User Info Section */}
              <div className="px-4 py-3 border-b border-border">
                <p className="text-sm font-medium text-foreground">{currentUser.name}</p>
                <p className="text-xs text-muted-foreground">{currentUser.email}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  <span className="inline-block px-2 py-0.5 bg-primary/10 text-primary rounded text-xs font-medium">
                    {currentUser.role}
                  </span>
                </p>
              </div>

              {/* Menu Items */}
              <div className="py-1">
                <Link
                  href="/profile"
                  className="flex items-center gap-3 px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors"
                  onClick={() => setShowProfileMenu(false)}
                >
                  <User className="w-4 h-4" />
                  View Profile
                </Link>
                <Link
                  href="/settings"
                  className="flex items-center gap-3 px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors"
                  onClick={() => setShowProfileMenu(false)}
                >
                  <Settings className="w-4 h-4" />
                  Settings
                </Link>
              </div>

              {/* Logout */}
             
            </div>
          )}
        </div>
      </div>
    </header>
  )
}