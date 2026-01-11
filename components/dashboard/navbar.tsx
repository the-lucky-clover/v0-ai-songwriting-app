"use client"

import { motion } from "framer-motion"
import { Menu, Palette, Settings, Sparkles, Zap, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useStore } from "@/lib/store"
import { useState } from "react"

const smoothSpring = { type: "spring", stiffness: 80, damping: 20 }

interface NavbarProps {
  onThemeClick: () => void
}

export function Navbar({ onThemeClick }: NavbarProps) {
  const { isSidebarCollapsed, setSidebarCollapsed } = useStore()
  const [hovered, setHovered] = useState<string | null>(null)

  return (
    <motion.nav
      initial={{ opacity: 0, y: -30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={smoothSpring}
      className="relative mx-4 mt-4"
    >
      <div className="group relative overflow-hidden rounded-2xl">
        {/* Background */}
        <div
          className="absolute inset-0 transition-all duration-500"
          style={{
            background: `
              linear-gradient(180deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.03) 100%)
            `,
            backdropFilter: "blur(40px) saturate(180%)",
          }}
        />

        {/* Border */}
        <div
          className="absolute inset-0 rounded-2xl"
          style={{
            boxShadow: `
              inset 0 0 0 1px rgba(255,255,255,0.08),
              0 8px 32px rgba(0,0,0,0.4)
            `,
          }}
        />

        {/* Animated subtle glow */}
        <motion.div
          className="pointer-events-none absolute inset-0 opacity-40"
          animate={{
            background: [
              "linear-gradient(90deg, transparent 0%, rgba(0,240,255,0.08) 50%, transparent 100%)",
              "linear-gradient(90deg, transparent 0%, rgba(255,0,255,0.08) 50%, transparent 100%)",
              "linear-gradient(90deg, transparent 0%, rgba(0,240,255,0.08) 50%, transparent 100%)",
            ],
          }}
          transition={{ duration: 6, repeat: Number.POSITIVE_INFINITY }}
        />

        {/* Top highlight */}
        <div
          className="absolute inset-x-0 top-0 h-px"
          style={{
            background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)",
          }}
        />

        <div className="relative flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden text-white/70 hover:text-white hover:bg-white/10"
                onClick={() => setSidebarCollapsed(!isSidebarCollapsed)}
              >
                <Menu className="h-5 w-5" />
              </Button>
            </motion.div>

            <motion.div
              className="flex items-center gap-2"
              whileHover={{ scale: 1.02 }}
              onHoverStart={() => setHovered("logo")}
              onHoverEnd={() => setHovered(null)}
            >
              <motion.div
                animate={hovered === "logo" ? { rotate: 360 } : { rotate: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              >
                <Zap
                  className="h-6 w-6 text-[#00f0ff]"
                  style={{
                    filter: hovered === "logo" ? "drop-shadow(0 0 15px #00f0ff)" : "drop-shadow(0 0 8px #00f0ff)",
                  }}
                />
              </motion.div>
              <h1
                className="text-xl font-bold tracking-[0.2em] text-white transition-all duration-300"
                style={{
                  fontFamily: "Orbitron, sans-serif",
                  textShadow: hovered === "logo" ? "0 0 25px rgba(0,240,255,0.6)" : "0 0 10px rgba(0,240,255,0.2)",
                }}
              >
                LYRICAL AI
              </h1>
            </motion.div>
          </div>

          <div className="flex items-center gap-2">
            {/* Theme button */}
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} transition={smoothSpring}>
              <Button
                variant="ghost"
                size="sm"
                className="gap-2 rounded-xl border border-white/10 bg-white/5 text-white/70 transition-all duration-300 hover:border-[#ff00ff]/50 hover:bg-[#ff00ff]/10 hover:text-white hover:shadow-[0_0_20px_rgba(255,0,255,0.2)]"
                onClick={onThemeClick}
              >
                <Palette className="h-4 w-4" />
                <span className="hidden sm:inline">Theme</span>
                <ChevronDown className="h-3 w-3 opacity-50" />
              </Button>
            </motion.div>

            {/* Settings button */}
            <motion.div whileHover={{ scale: 1.05, rotate: 45 }} whileTap={{ scale: 0.95 }} transition={smoothSpring}>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-xl border border-white/10 bg-white/5 text-white/70 transition-all duration-300 hover:border-white/20 hover:bg-white/10 hover:text-white"
              >
                <Settings className="h-5 w-5" />
              </Button>
            </motion.div>

            <motion.div
              className="relative ml-2 overflow-hidden rounded-full"
              whileHover={{ scale: 1.03 }}
              transition={smoothSpring}
            >
              {/* Animated gradient border */}
              <motion.div
                className="absolute -inset-0.5 rounded-full opacity-80"
                animate={{
                  background: [
                    "linear-gradient(0deg, #00f0ff, #9d4edd, #ff00ff)",
                    "linear-gradient(120deg, #ff00ff, #00f0ff, #9d4edd)",
                    "linear-gradient(240deg, #9d4edd, #ff00ff, #00f0ff)",
                    "linear-gradient(360deg, #00f0ff, #9d4edd, #ff00ff)",
                  ],
                }}
                transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
              />
              <div className="relative flex items-center gap-2 rounded-full bg-black/90 px-4 py-2 text-sm">
                {/* Static sparkle - no rotation */}
                <Sparkles className="h-4 w-4 text-[#00f0ff]" style={{ filter: "drop-shadow(0 0 6px #00f0ff)" }} />
                <span className="font-semibold text-white">10</span>
                <span className="text-white/50">gens</span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.nav>
  )
}
