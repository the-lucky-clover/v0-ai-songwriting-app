"use client"

import { motion } from "framer-motion"
import { Menu, Palette, Settings, Sparkles, Zap, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useStore } from "@/lib/store"
import { useState } from "react"

interface NavbarProps {
  onThemeClick: () => void
}

export function Navbar({ onThemeClick }: NavbarProps) {
  const { isSidebarCollapsed, setSidebarCollapsed } = useStore()
  const [hovered, setHovered] = useState<string | null>(null)

  return (
    <motion.nav initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="relative mx-4 mt-4">
      <div
        className="relative overflow-hidden rounded-2xl border border-white/10"
        style={{
          background: "linear-gradient(180deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 100%)",
          boxShadow: `
            0 8px 32px rgba(0,0,0,0.4),
            inset 0 1px 0 rgba(255,255,255,0.1),
            inset 0 -1px 0 rgba(0,0,0,0.2),
            0 0 0 1px rgba(255,255,255,0.05)
          `,
          backdropFilter: "blur(40px) saturate(180%)",
        }}
      >
        {/* Animated gradient overlay */}
        <motion.div
          className="absolute inset-0 opacity-30"
          animate={{
            background: [
              "linear-gradient(90deg, transparent, rgba(0,240,255,0.1), transparent)",
              "linear-gradient(90deg, transparent, rgba(255,0,255,0.1), transparent)",
              "linear-gradient(90deg, transparent, rgba(0,240,255,0.1), transparent)",
            ],
          }}
          transition={{ duration: 5, repeat: Number.POSITIVE_INFINITY }}
        />

        <div className="relative flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setSidebarCollapsed(!isSidebarCollapsed)}
            >
              <Menu className="h-5 w-5" />
            </Button>

            {/* Logo with glow effect */}
            <motion.div
              className="flex items-center gap-2"
              whileHover={{ scale: 1.02 }}
              onHoverStart={() => setHovered("logo")}
              onHoverEnd={() => setHovered(null)}
            >
              <motion.div animate={hovered === "logo" ? { rotate: 360 } : {}} transition={{ duration: 0.6 }}>
                <Zap className="h-6 w-6 text-[#00f0ff]" style={{ filter: "drop-shadow(0 0 10px #00f0ff)" }} />
              </motion.div>
              <h1
                className="text-xl font-bold tracking-[0.15em] text-white"
                style={{
                  fontFamily: "Orbitron, sans-serif",
                  textShadow: hovered === "logo" ? "0 0 20px rgba(0,240,255,0.5)" : "none",
                  transition: "text-shadow 0.3s",
                }}
              >
                LYRICAL.TOP
              </h1>
            </motion.div>
          </div>

          <div className="flex items-center gap-2">
            {/* Theme button with hover glow */}
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="ghost"
                size="sm"
                className="gap-2 rounded-xl border border-white/10 bg-white/5 text-white/70 transition-all hover:border-[#ff00ff]/50 hover:bg-[#ff00ff]/10 hover:text-white"
                onClick={onThemeClick}
              >
                <Palette className="h-4 w-4" />
                <span className="hidden sm:inline">Theme</span>
                <ChevronDown className="h-3 w-3 opacity-50" />
              </Button>
            </motion.div>

            {/* Settings button */}
            <motion.div whileHover={{ scale: 1.05, rotate: 90 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-xl border border-white/10 bg-white/5 text-white/70 hover:border-white/20 hover:bg-white/10 hover:text-white"
              >
                <Settings className="h-5 w-5" />
              </Button>
            </motion.div>

            {/* AI Credits with animated gradient border */}
            <motion.div className="relative ml-2 overflow-hidden rounded-full" whileHover={{ scale: 1.02 }}>
              <motion.div
                className="absolute -inset-0.5 rounded-full opacity-75"
                animate={{
                  background: [
                    "linear-gradient(0deg, #00f0ff, #9d4edd, #ff00ff)",
                    "linear-gradient(120deg, #ff00ff, #00f0ff, #9d4edd)",
                    "linear-gradient(240deg, #9d4edd, #ff00ff, #00f0ff)",
                    "linear-gradient(360deg, #00f0ff, #9d4edd, #ff00ff)",
                  ],
                }}
                transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
              />
              <div className="relative flex items-center gap-2 rounded-full bg-black/80 px-4 py-2 text-sm">
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                >
                  <Sparkles className="h-4 w-4 text-[#00f0ff]" />
                </motion.div>
                <span className="font-medium text-white">10</span>
                <span className="text-white/50">gens</span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.nav>
  )
}
