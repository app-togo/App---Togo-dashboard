"use client"

import { Sidebar } from "@/components/layout/sidebar"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { auth } from "@/lib/firebase"
import { onAuthStateChanged, User, updateProfile } from "firebase/auth"
import { toast } from "sonner"

export default function ProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [displayName, setDisplayName] = useState("")
  const [isSaving, setIsSaving] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser)
        setDisplayName(currentUser.displayName || currentUser.email?.split("@")[0] || "")
      } else {
        router.push("/login")
      }
      setIsLoading(false)
    })

    return () => unsubscribe()
  }, [router])

  const handleSaveProfile = async () => {
    if (!user) return
    
    if (!displayName.trim()) {
      toast.error("Display name cannot be empty")
      return
    }

    setIsSaving(true)
    try {
      await updateProfile(user, {
        displayName: displayName.trim()
      })
      
      // Refresh user data
      setUser({...user, displayName: displayName.trim()})
      setIsEditing(false)
      toast.success("Profile updated successfully!")
    } catch (error: any) {
      console.error("Error updating profile:", error)
      toast.error("Failed to update profile: " + error.message)
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
          <p className="text-muted-foreground text-sm">Loading profile...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  // Extract initials from email
  const getInitials = (email: string) => {
    const name = email.split("@")[0]
    return name
      .split(/[._-]/)
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  // Get initials from email
  const initials = getInitials(user.email || "user")

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Mobile overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 md:hidden z-30"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
      <Sidebar currentPage="profile" isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />
        <main className="flex-1 overflow-y-auto p-4 md:p-8 max-w-2xl">
          <h1 className="text-3xl font-bold text-foreground mb-8">User Profile</h1>

          {/* Profile Header */}
          <div className="bg-card rounded-lg p-8 border border-border mb-6">
            <div className="flex items-center gap-6 mb-6">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <span className="text-2xl font-bold text-background">{initials}</span>
              </div>
              <div>
                {isEditing ? (
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      placeholder="Enter display name"
                      className="px-3 py-2 bg-input border border-border rounded-lg text-foreground text-2xl font-bold focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  </div>
                ) : (
                  <h2 className="text-2xl font-bold text-foreground">{user?.displayName || user?.email?.split("@")[0] || "User"}</h2>
                )}
                <p className="text-accent font-semibold">Authenticated User</p>
                <p className="text-muted-foreground text-sm mt-1">{user.email}</p>
              </div>
            </div>

            <div className="border-t border-border pt-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-muted-foreground text-sm mb-1">Account Status</p>
                  <p className="text-foreground font-semibold">
                    {user.emailVerified ? "✓ Verified" : "Pending Verification"}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground text-sm mb-1">Account Type</p>
                  <p className="text-accent font-semibold">
                    {user.providerData[0]?.providerId === "google.com" ? "Google OAuth" : "Email/Password"}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground text-sm mb-1">User ID</p>
                  <p className="text-foreground font-semibold text-xs break-all">{user.uid.slice(0, 12)}...</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-sm mb-1">Member Since</p>
                  <p className="text-foreground font-semibold">
                    {user.metadata?.creationTime
                      ? new Date(user.metadata.creationTime).toLocaleDateString()
                      : "N/A"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Account Information */}
          <div className="bg-card rounded-lg p-8 border border-border mb-6">
            <h3 className="text-xl font-bold text-foreground mb-6">Account Information</h3>
            <div className="space-y-4">
              <div>
                <p className="text-muted-foreground text-sm mb-2">Email Address</p>
                <p className="text-foreground font-medium">{user.email}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-sm mb-2">Phone Number</p>
                <p className="text-foreground font-medium">{user.phoneNumber || "Not set"}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-sm mb-2">Last Sign-in</p>
                <p className="text-foreground font-medium">
                  {user.metadata?.lastSignInTime
                    ? new Date(user.metadata.lastSignInTime).toLocaleString()
                    : "N/A"}
                </p>
              </div>
            </div>
          </div>

          {/* Authentication Methods */}
          <div className="bg-card rounded-lg p-8 border border-border mb-6">
            <h3 className="text-xl font-bold text-foreground mb-4">Authentication Methods</h3>
            <div className="space-y-3">
              {user.providerData && user.providerData.length > 0 ? (
                user.providerData.map((provider) => (
                  <div key={provider.uid} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div>
                      <p className="text-foreground font-medium">
                        {provider.providerId === "google.com"
                          ? "Google"
                          : provider.providerId === "password"
                          ? "Email/Password"
                          : provider.providerId}
                      </p>
                      <p className="text-muted-foreground text-xs">{provider.email}</p>
                    </div>
                    <span className="w-2 h-2 rounded-full bg-accent"></span>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground">No authentication methods found</p>
              )}
            </div>
          </div>

          {/* Edit Button */}
          <div className="space-y-3">
            {isEditing ? (
              <>
                <button
                  onClick={handleSaveProfile}
                  disabled={isSaving}
                  className="w-full px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSaving ? "Saving..." : "Save Changes"}
                </button>
                <button
                  onClick={() => {
                    setIsEditing(false)
                    setDisplayName(user?.displayName || user?.email?.split("@")[0] || "")
                  }}
                  disabled={isSaving}
                  className="w-full px-6 py-3 bg-muted text-muted-foreground rounded-lg font-semibold hover:bg-muted/80 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="w-full px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-all cursor-pointer"
              >
                Edit Profile
              </button>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
