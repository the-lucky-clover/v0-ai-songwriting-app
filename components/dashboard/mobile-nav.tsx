"use client"

import { motion } from "framer-motion"
import { Palette, Settings, Sparkles, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"

const smoothSpring = { type: "spring", stiffness: 80, damping: 20 }

interface MobileNavProps {
  onThemeClick: () => void
}

export function MobileNav({ onThemeClick }: MobileNavProps) {
  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={smoothSpring}
      className="relative"
    >
      <div
        className="relative flex items-center justify-between px-4 py-3"
        style={{
          background: "linear-gradient(180deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.6) 100%)",
          backdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        {/* Logo */}
        <div className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-[#00f0ff]" style={{ filter: "drop-shadow(0 0 8px #00f0ff)" }} />
          <h1 className="text-lg font-bold tracking-[0.15em] text-white" style={{ fontFamily: "Orbitron, sans-serif" }}>
            LYRICAL AI
          </h1>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <motion.div whileTap={{ scale: 0.9 }}>
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 rounded-xl border border-white/10 bg-white/5 text-white/70"
              onClick={onThemeClick}
            >
              <Palette className="h-4 w-4" />
            </Button>
          </motion.div>

          <motion.div whileTap={{ scale: 0.9 }}>
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 rounded-xl border border-white/10 bg-white/5 text-white/70"
            >
              <Settings className="h-4 w-4" />
            </Button>
          </motion.div>

          {/* Credits badge */}
          <div
            className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs"
            style={{
              background: "linear-gradient(135deg, rgba(0,240,255,0.2), rgba(157,78,221,0.2))",
              border: "1px solid rgba(0,240,255,0.3)",
            }}
          >
            <Sparkles className="h-3 w-3 text-[#00f0ff]" />
            <span className="font-semibold text-white">10</span>
          </div>
        </div>
      </div>
    </motion.nav>
  )
}
