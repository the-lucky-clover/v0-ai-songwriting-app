"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Navbar } from "./dashboard/navbar"
import { LeftColumn } from "./dashboard/left-column"
import { CenterColumn } from "./dashboard/center-column"
import { RightColumn } from "./dashboard/right-column"
import { AIModal } from "./dashboard/ai-modal"
import { ThemeSelector } from "./dashboard/theme-selector"
import { useStore } from "@/lib/store"
import { useState, useEffect, useRef } from "react"

const fluidSpring = { type: "spring", stiffness: 60, damping: 18, mass: 1 }
const gentleSpring = { type: "spring", stiffness: 40, damping: 15, mass: 0.8 }

export function Dashboard() {
  const { isSidebarCollapsed } = useStore()
  const [themeOpen, setThemeOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect()
        setMousePos({
          x: ((e.clientX - rect.left) / rect.width) * 100,
          y: ((e.clientY - rect.top) / rect.height) * 100,
        })
      }
    }
    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  return (
    <div ref={containerRef} className="relative min-h-screen overflow-hidden bg-black">
      <div className="fixed inset-0">
        {/* Base gradient */}
        <div
          className="absolute inset-0 transition-all duration-1000"
          style={{
            background: `
              radial-gradient(ellipse 800px 600px at ${mousePos.x}% ${mousePos.y}%, rgba(0,240,255,0.08) 0%, transparent 50%),
              radial-gradient(ellipse at 20% 20%, rgba(0,240,255,0.12) 0%, transparent 40%),
              radial-gradient(ellipse at 80% 80%, rgba(157,78,221,0.12) 0%, transparent 40%),
              radial-gradient(ellipse at 50% 50%, rgba(255,0,255,0.06) 0%, transparent 60%),
              linear-gradient(180deg, var(--theme-bg-primary) 0%, var(--theme-bg-secondary) 50%, var(--theme-bg-tertiary) 100%)
            `,
          }}
        />

        <motion.div
          className="pointer-events-none absolute h-[600px] w-[600px] rounded-full opacity-20"
          style={{
            background: "radial-gradient(circle, var(--theme-accent-primary), transparent 70%)",
            filter: "blur(80px)",
          }}
          animate={{
            x: ["-10%", "10%", "-10%"],
            y: ["-10%", "20%", "-10%"],
          }}
          transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
        />
        <motion.div
          className="pointer-events-none absolute right-0 h-[500px] w-[500px] rounded-full opacity-15"
          style={{
            background: "radial-gradient(circle, var(--theme-accent-secondary), transparent 70%)",
            filter: "blur(60px)",
          }}
          animate={{
            x: ["10%", "-10%", "10%"],
            y: ["10%", "-20%", "10%"],
          }}
          transition={{ duration: 25, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
        />

        {/* Grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.15) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.15) 1px, transparent 1px)
            `,
            backgroundSize: "60px 60px",
          }}
        />

        {/* Noise texture */}
        <div
          className="absolute inset-0 opacity-[0.012]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          }}
        />

        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.4) 100%)",
          }}
        />
      </div>

      {/* Content */}
      <AnimatePresence>
        {mounted && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="relative flex h-screen flex-col"
          >
            <motion.div
              initial={{ y: -100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ ...fluidSpring, delay: 0.1 }}
            >
              <Navbar onThemeClick={() => setThemeOpen(true)} />
            </motion.div>

            <div className="flex flex-1 gap-4 overflow-hidden p-4">
              {/* Left Column */}
              <motion.div
                initial={{ x: -80, opacity: 0, scale: 0.95 }}
                animate={{ x: 0, opacity: 1, scale: 1 }}
                transition={{ ...gentleSpring, delay: 0.2 }}
                className={`${isSidebarCollapsed ? "hidden" : "flex"} w-[280px] shrink-0 flex-col gap-4 lg:flex`}
              >
                <LeftColumn />
              </motion.div>

              {/* Center Column */}
              <motion.div
                initial={{ y: 40, opacity: 0, scale: 0.98 }}
                animate={{ y: 0, opacity: 1, scale: 1 }}
                transition={{ ...gentleSpring, delay: 0.3 }}
                className="flex min-w-0 flex-1 flex-col"
              >
                <CenterColumn />
              </motion.div>

              {/* Right Column */}
              <motion.div
                initial={{ x: 80, opacity: 0, scale: 0.95 }}
                animate={{ x: 0, opacity: 1, scale: 1 }}
                transition={{ ...gentleSpring, delay: 0.4 }}
                className="hidden w-[320px] shrink-0 flex-col gap-4 xl:flex"
              >
                <RightColumn />
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AIModal />
      <ThemeSelector open={themeOpen} onOpenChange={setThemeOpen} />
    </div>
  )
}
