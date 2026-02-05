"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { auth } from "@/lib/firebase"
import { createUserWithEmailAndPassword } from "firebase/auth"
import { toast } from "sonner"
import { AppTogoLogo } from "@/components/auth/logo"
import { ShieldCheck, UserPlus, Building2, Mail, Lock, CheckCircle, AlertCircle } from "lucide-react"
import { validatePassword } from "@/lib/passwordValidator"

export default function SignupPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    company: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [passwordValidation, setPasswordValidation] = useState<any>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })

    // Validate password in real-time
    if (name === "password") {
      const validation = validatePassword(value)
      setPasswordValidation(validation)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate password strength
    const passwordValidationResult = validatePassword(formData.password)
    if (!passwordValidationResult.isValid) {
      toast.error("Password does not meet requirements")
      return
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match!")
      return
    }

    setIsLoading(true)
    try {
      await createUserWithEmailAndPassword(auth, formData.email, formData.password)
      toast.success("Account created successfully!")
      router.push("/")
    } catch (error: any) {
      toast.error(error.message || "Failed to create account. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#020205] flex items-center justify-center p-6 relative overflow-hidden font-sans">
      {/* --- ELITE ATMOSPHERIC BACKGROUND --- */}

      {/* Base Layer: Deep Multi-layered Gradients */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-primary/20 rounded-full blur-[160px] animate-pulse pointer-events-none"></div>
      <div className="absolute bottom-[-15%] right-[-5%] w-[55%] h-[55%] bg-indigo-500/10 rounded-full blur-[140px] animate-pulse-slow pointer-events-none"></div>

      {/* Artistic Layer: Data Shards (Floating Glassmorphism) */}
      {[
        { top: '25%', left: '8%', size: 'w-32 h-64', rot: 'rotate-[25deg]', delay: '0.5s' },
        { top: '55%', left: '30%', size: 'w-24 h-12', rot: 'rotate-[-20deg]', delay: '1.5s' },
        { top: '15%', right: '15%', size: 'w-48 h-24', rot: 'rotate-[15deg]', delay: '2.5s' },
        { top: '80%', right: '20%', size: 'w-16 h-32', rot: 'rotate-[-35deg]', delay: '4s' },
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

      {/* SVG Path Tracing (Focal Point) */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.15]" xmlns="http://www.w3.org/2000/svg">
        <path d="M-100,500 C200,600 500,100 800,400 T1200,200" stroke="var(--primary)" strokeWidth="1" fill="none" className="animate-pulse">
          <animate attributeName="stroke-dasharray" from="0,1000" to="1000,0" dur="10s" repeatCount="indefinite" />
        </path>
        <path d="M1200,800 C900,700 600,900 300,600 S0,800 -100,700" stroke="var(--accent)" strokeWidth="1" fill="none" className="animate-pulse">
          <animate attributeName="stroke-dasharray" from="0,1000" to="1000,0" dur="15s" repeatCount="indefinite" />
        </path>
      </svg>

      <div className="w-full max-w-4xl relative z-10 flex flex-col gap-8 md:flex-row items-center">
        {/* Branding Sidebar (Hidden on mobile) */}
        <div className="hidden md:flex flex-col gap-10 flex-1 pr-12">
          <AppTogoLogo className="!items-start" />

          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-foreground leading-tight">
              Begin your <span className="text-primary italic">AI-Accelerated</span> journey.
            </h2>
            <div className="space-y-4">
              {[
                { icon: ShieldCheck, text: "Enterprise-grade Neural Security" },
                { icon: CheckCircle, text: "99.9% Operational Uptime" },
                { icon: Lock, text: "End-to-End Data Encryption" },
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-3 text-muted-foreground font-sans">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <item.icon className="w-4 h-4 text-primary" />
                  </div>
                  <span className="text-sm font-medium">{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Signup Form Card */}
        <div className="w-full max-w-md flex-shrink-0 group relative">
          {/* Card Border Glow */}
          <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-accent rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>

          <div className="relative bg-card/40 backdrop-blur-2xl rounded-2xl border border-white/10 p-8 shadow-2xl">
            {/* Mobile-only logo */}
            <div className="md:hidden mb-8 flex justify-center">
              <AppTogoLogo className="scale-75" />
            </div>

            <div className="mb-6">
              <h1 className="text-2xl font-bold text-foreground mb-1">Join the Future</h1>
              <p className="text-muted-foreground text-sm font-sans">Create your enterprise hub account.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Entity Name</label>
                <div className="relative group/input">
                  <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within/input:text-primary transition-colors" />
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    required
                    className="w-full pl-11 pr-4 py-3.5 bg-background/50 border border-white/5 rounded-xl text-foreground placeholder-muted-foreground/50 focus:border-primary/50 focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all font-sans"
                    placeholder="Your Company"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Work Email</label>
                <div className="relative group/input">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within/input:text-primary transition-colors" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full pl-11 pr-4 py-3.5 bg-background/50 border border-white/5 rounded-xl text-foreground placeholder-muted-foreground/50 focus:border-primary/50 focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all font-sans"
                    placeholder="admin@company.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5 col-span-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Password</label>
                  <div className="relative group/input">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within/input:text-primary transition-colors" />
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      className="w-full pl-11 pr-4 py-3.5 bg-background/50 border border-white/5 rounded-xl text-foreground placeholder-muted-foreground/50 focus:border-primary/50 focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all font-sans"
                      placeholder="••••••••"
                    />
                  </div>
                  {formData.password && passwordValidation && (
                    <div className="mt-3 p-3 bg-background/50 border border-white/5 rounded-lg space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-muted-foreground">Password Strength:</span>
                        <span className={`text-xs font-bold px-2 py-1 rounded ${
                          passwordValidation.strength === "strong" ? "bg-green-500/20 text-green-400" :
                          passwordValidation.strength === "good" ? "bg-blue-500/20 text-blue-400" :
                          passwordValidation.strength === "fair" ? "bg-yellow-500/20 text-yellow-400" :
                          "bg-red-500/20 text-red-400"
                        }`}>
                          {passwordValidation.strength.toUpperCase()}
                        </span>
                      </div>
                      {passwordValidation.errors.length > 0 && (
                        <div className="space-y-1">
                          {passwordValidation.errors.map((error: string, idx: number) => (
                            <div key={idx} className="flex items-start gap-2">
                              <AlertCircle className="w-3 h-3 text-red-400 mt-0.5 flex-shrink-0" />
                              <span className="text-xs text-red-400">{error}</span>
                            </div>
                          ))}
                        </div>
                      )}
                      {passwordValidation.isValid && (
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-3 h-3 text-green-400" />
                          <span className="text-xs text-green-400">Password meets all requirements</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="space-y-1.5 col-span-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Confirm Password</label>
                  <div className="relative group/input">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within/input:text-primary transition-colors" />
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                      className="w-full pl-11 pr-4 py-3.5 bg-background/50 border border-white/5 rounded-xl text-foreground placeholder-muted-foreground/50 focus:border-primary/50 focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all font-sans"
                      placeholder="••••••••"
                    />
                  </div>
                  {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                    <div className="flex items-center gap-2 mt-2 p-2 bg-red-500/10 rounded">
                      <AlertCircle className="w-3 h-3 text-red-400" />
                      <span className="text-xs text-red-400">Passwords do not match</span>
                    </div>
                  )}
                  {formData.confirmPassword && formData.password === formData.confirmPassword && (
                    <div className="flex items-center gap-2 mt-2 p-2 bg-green-500/10 rounded">
                      <CheckCircle className="w-3 h-3 text-green-400" />
                      <span className="text-xs text-green-400">Passwords match</span>
                    </div>
                  )}
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-4 h-14 bg-gradient-to-r from-accent/80 to-accent text-accent-foreground rounded-xl font-bold hover:shadow-[0_0_20px_rgba(57,255,20,0.3)] disabled:opacity-50 transition-all cursor-pointer flex items-center justify-center gap-2 group/btn"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-accent-foreground/30 border-t-accent-foreground rounded-full animate-spin"></div>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4" />
                    Generate Architecture
                  </>
                )}
              </button>
            </form>

            <div className="mt-8 pt-8 border-t border-white/5 text-center">
              <p className="text-muted-foreground font-sans text-sm">
                Already registered?{" "}
                <Link href="/login" className="text-primary hover:text-primary/80 font-bold underline underline-offset-4 cursor-pointer">
                  Initiate Login
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Visual noise texture overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
    </div>
  )
}
