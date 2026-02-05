"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { auth, googleProvider } from "@/lib/firebase"
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth"
import { toast } from "sonner"
import { AppTogoLogo } from "@/components/auth/logo"
import { ShieldCheck, ArrowRight, Lock, Mail } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      await signInWithEmailAndPassword(auth, email, password)
      toast.success("Signed in successfully!")
      router.push("/")
    } catch (error: any) {
      toast.error(error.message || "Failed to sign in. Please check your credentials.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setIsLoading(true)
    try {
      const result = await signInWithPopup(auth, googleProvider)
      if (result.user) {
        toast.success("Signed in with Google successfully!")
        router.push("/")
      }
    } catch (error: any) {
      console.error("Google Sign-In Error:", error)
      // Handle specific error cases
      if (error.code === 'auth/popup-closed-by-user') {
        toast.error("Sign-in cancelled. Please try again.")
      } else if (error.code === 'auth/popup-blocked') {
        toast.error("Pop-up was blocked. Please allow pop-ups and try again.")
      } else if (error.code === 'auth/operation-not-supported-in-this-environment') {
        toast.error("Google Sign-in is not available in this environment.")
      } else {
        toast.error(error.message || "Failed to sign in with Google. Please try again.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#020205] flex items-center justify-center p-6 relative overflow-hidden">
      {/* --- ELITE ATMOSPHERIC BACKGROUND --- */}

      {/* Base Layer: Deep Multi-layered Gradients */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-primary/20 rounded-full blur-[160px] animate-pulse pointer-events-none"></div>
      <div className="absolute bottom-[-15%] right-[-5%] w-[55%] h-[55%] bg-indigo-500/10 rounded-full blur-[140px] animate-pulse-slow pointer-events-none"></div>
      <div className="absolute center inset-0 w-full h-full bg-purple-900/5 blur-[120px] pointer-events-none"></div>

      {/* Artistic Layer: Data Shards (Floating Glassmorphism) */}
      {[
        { top: '15%', left: '10%', size: 'w-24 h-48', rot: 'rotate-[35deg]', delay: '0s' },
        { top: '65%', left: '15%', size: 'w-32 h-16', rot: 'rotate-[-15deg]', delay: '1s' },
        { top: '10%', right: '12%', size: 'w-40 h-20', rot: 'rotate-[12deg]', delay: '2s' },
        { top: '75%', right: '18%', size: 'w-20 h-40', rot: 'rotate-[-25deg]', delay: '3.5s' },
        { top: '40%', right: '5%', size: 'w-12 h-32', rot: 'rotate-[45deg]', delay: '0.5s' },
      ].map((shard, i) => (
        <div
          key={i}
          className={`absolute ${shard.size} ${shard.rot} bg-white/[0.03] backdrop-blur-[8px] border border-white/[0.08] rounded-2xl pointer-events-none animate-float`}
          style={{
            top: shard.top,
            left: shard.left,
            right: shard.right,
            animationDelay: shard.delay,
            boxShadow: '0 8px 32px 0 rgba(0, 128, 128, 0.1)'
          }}
        ></div>
      ))}

      {/* Grid Pattern with Glow Intersection */}
      <div className="absolute inset-0 opacity-[0.05] pointer-events-none transition-opacity"
        style={{
          backgroundImage: 'linear-gradient(var(--primary) 1px, transparent 1px), linear-gradient(90deg, var(--primary) 1px, transparent 1px)',
          backgroundSize: '80px 80px'
        }}></div>

      <div className="w-full max-w-xl relative z-10 flex flex-col gap-8">
        {/* Logo/Header */}
        <AppTogoLogo />

        <div className="grid grid-cols-1 gap-8">
          {/* Main Card */}
          <div className="group relative">
            {/* Card Border Glow */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-accent rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>

            <div className="relative bg-card/40 backdrop-blur-2xl rounded-2xl border border-white/10 p-8 shadow-2xl">
              <div className="mb-8">
                <h1 className="text-2xl font-bold text-foreground mb-1">Secure AI Access</h1>
                <p className="text-muted-foreground text-sm font-sans italic">"The future of workforce optimization starts here."</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Email Terminal</label>
                  <div className="relative group/input">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within/input:text-primary transition-colors" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full pl-11 pr-4 py-3.5 bg-background/50 border border-white/5 rounded-xl text-foreground placeholder-muted-foreground/50 focus:border-primary/50 focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all font-sans"
                      placeholder="admin@apptogo.com"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Secure Key</label>
                  <div className="relative group/input">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within/input:text-primary transition-colors" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="w-full pl-11 pr-4 py-3.5 bg-background/50 border border-white/5 rounded-xl text-foreground placeholder-muted-foreground/50 focus:border-primary/50 focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all font-sans"
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full mt-4 h-14 bg-gradient-to-r from-primary to-primary/80 text-white rounded-xl font-bold hover:shadow-[0_0_20px_rgba(0,128,128,0.4)] disabled:opacity-50 transition-all cursor-pointer flex items-center justify-center gap-2 group/btn"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <>
                      Initialize Connection
                      <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </form>

              <div className="relative my-10">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-white/5"></span>
                </div>
                <div className="relative flex justify-center text-[10px] uppercase tracking-[0.2em]">
                  <span className="bg-[#121225] px-4 text-muted-foreground font-sans py-1 rounded-full border border-white/5">Multi-Channel Auth</span>
                </div>
              </div>

              <button
                onClick={handleGoogleSignIn}
                disabled={isLoading}
                className="w-full h-14 flex items-center justify-center gap-3 px-4 bg-white/5 border border-white/10 rounded-xl text-foreground hover:bg-white/10 transition-all cursor-pointer font-sans font-semibold group/google"
              >
                <div className="bg-white p-1 rounded-full group-hover/google:scale-110 transition-transform">
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.84z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                </div>
                Continue with Neural Identity
              </button>

              <div className="mt-8 pt-8 border-t border-white/5 text-center">
                <p className="text-muted-foreground font-sans text-sm">
                  Awaiting credentials?{" "}
                  <Link href="/signup" className="text-accent hover:text-accent-foreground font-bold underline underline-offset-4 cursor-pointer">
                    Create New Account
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Security badge */}
        <div className="flex items-center justify-center gap-6 opacity-60 hover:opacity-100 transition-opacity duration-500">
          <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold text-muted-foreground font-sans">
            <ShieldCheck className="w-4 h-4 text-primary" />
            SOC2 Certified
          </div>
          <div className="w-1 h-1 bg-white/20 rounded-full"></div>
          <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold text-muted-foreground font-sans">
            <Lock className="w-4 h-4 text-accent" />
            SSL Encrypted
          </div>
        </div>
      </div>

      {/* Visual noise texture overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
    </div>
  )
}
