"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Navbar } from "./dashboard/navbar"
import { LeftColumn } from "./dashboard/left-column"
import { CenterColumn } from "./dashboard/center-column"
import { RightColumn } from "./dashboard/right-column"
import { AIModal } from "./dashboard/ai-modal"
import { ThemeSelector } from "./dashboard/theme-selector"
import { useStore } from "@/lib/store"
import { useState, useEffect } from "react"

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
}

const columnVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15,
    },
  },
}

export function Dashboard() {
  const { isSidebarCollapsed } = useStore()
  const [themeOpen, setThemeOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div className="relative min-h-screen overflow-hidden bg-black">
      {/* Animated gradient background */}
      <div className="fixed inset-0">
        <motion.div
          animate={{
            background: [
              "radial-gradient(ellipse at 20% 20%, rgba(0,240,255,0.15) 0%, transparent 50%), radial-gradient(ellipse at 80% 80%, rgba(157,78,221,0.15) 0%, transparent 50%), radial-gradient(ellipse at 50% 50%, rgba(255,0,255,0.1) 0%, transparent 70%), linear-gradient(to bottom right, var(--theme-bg-primary), var(--theme-bg-secondary), var(--theme-bg-tertiary))",
              "radial-gradient(ellipse at 80% 20%, rgba(255,0,255,0.15) 0%, transparent 50%), radial-gradient(ellipse at 20% 80%, rgba(0,240,255,0.15) 0%, transparent 50%), radial-gradient(ellipse at 50% 50%, rgba(157,78,221,0.1) 0%, transparent 70%), linear-gradient(to bottom right, var(--theme-bg-primary), var(--theme-bg-secondary), var(--theme-bg-tertiary))",
            ],
          }}
          transition={{ duration: 10, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" }}
          className="absolute inset-0 transition-all duration-[600ms]"
          style={{
            background: `linear-gradient(to bottom right, var(--theme-bg-primary), var(--theme-bg-secondary), var(--theme-bg-tertiary))`,
          }}
        />

        {/* Grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: "50px 50px",
          }}
        />

        {/* Noise texture */}
        <div
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          }}
        />
      </div>

      {/* Content */}
      <AnimatePresence>
        {mounted && (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="relative flex h-screen flex-col"
          >
            {/* Navbar with fly-in */}
            <motion.div
              initial={{ y: -80, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ type: "spring", stiffness: 100, damping: 20 }}
            >
              <Navbar onThemeClick={() => setThemeOpen(true)} />
            </motion.div>

            {/* Three column layout */}
            <motion.div variants={containerVariants} className="flex flex-1 gap-4 overflow-hidden p-4">
              {/* Left Column - Slide in from left */}
              <motion.div
                variants={columnVariants}
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ type: "spring", stiffness: 80, damping: 20, delay: 0.1 }}
                className={`${isSidebarCollapsed ? "hidden" : "flex"} w-[280px] shrink-0 flex-col gap-4 lg:flex`}
              >
                <LeftColumn />
              </motion.div>

              {/* Center Column - Scale up from center */}
              <motion.div
                variants={columnVariants}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 80, damping: 20, delay: 0.2 }}
                className="flex min-w-0 flex-1 flex-col"
              >
                <CenterColumn />
              </motion.div>

              {/* Right Column - Slide in from right */}
              <motion.div
                variants={columnVariants}
                initial={{ x: 100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ type: "spring", stiffness: 80, damping: 20, delay: 0.3 }}
                className="hidden w-[320px] shrink-0 flex-col gap-4 xl:flex"
              >
                <RightColumn />
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AIModal />
      <ThemeSelector open={themeOpen} onOpenChange={setThemeOpen} />
    </div>
  )
}
