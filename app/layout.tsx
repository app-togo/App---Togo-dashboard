import type React from "react"
import type { Metadata } from "next"
import { Play } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const playFont = Play({
  subsets: ["latin"],
  weight: ["400", "700"],
})

export const metadata: Metadata = {
  title: "App-Togo | Enterprise Workforce Platform",
  description: "AI-powered enterprise workforce management platform",
  generator: "v0.app",
  icons: {
    icon: [
      {
        url: "/favicon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`dark ${playFont.className}`}>
      <body className="font-sans antialiased bg-background text-foreground">
        {children}
        <Analytics />
      </body>
    </html>
  )
}
