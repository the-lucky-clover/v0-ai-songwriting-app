import type React from "react"
import type { Metadata, Viewport } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Orbitron, Inter, JetBrains_Mono } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })
const _orbitron = Orbitron({ subsets: ["latin"], variable: "--font-orbitron" })
const _inter = Inter({ subsets: ["latin"], variable: "--font-inter" })
const _jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains" })

export const metadata: Metadata = {
  title: "LYRICAL AI - AI-Powered Songwriting Studio",
  description:
    "Where Words Become Anthems. AI-assisted songwriting with real-time syllable counting, rhyme detection, and style emulation. lyrical.top",
  generator: "v0.app",
  keywords: [
    "songwriting",
    "AI",
    "lyrics",
    "music",
    "rhyme",
    "syllable counter",
    "songwriter",
    "lyrical ai",
    "lyrical.top",
  ],
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
  openGraph: {
    title: "LYRICAL AI - AI-Powered Songwriting Studio",
    description:
      "Where Words Become Anthems. AI-assisted songwriting with real-time syllable counting, rhyme detection, and style emulation.",
    url: "https://lyrical.top",
    siteName: "LYRICAL AI",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "LYRICAL AI - AI-Powered Songwriting Studio",
    description:
      "Where Words Become Anthems. AI-assisted songwriting with real-time syllable counting, rhyme detection, and style emulation.",
  },
}

export const viewport: Viewport = {
  themeColor: "#0a0a1e",
  colorScheme: "dark",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className="font-sans antialiased">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  )
}
