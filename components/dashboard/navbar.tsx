"use client"

import { motion } from "framer-motion"
import { Zap, Menu, Palette, ChevronDown, Settings, Sparkles, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useStore } from "@/lib/store"
import { useState } from "react"
import Link from "next/link"
import styles from "./navbar.module.css"
import { SettingsModal } from "./settings-modal"

interface NavbarProps {
  onThemeClick: () => void
}

export function Navbar({ onThemeClick }: NavbarProps) {
  const { isSidebarCollapsed, setSidebarCollapsed } = useStore()
  const [hovered, setHovered] = useState<string | null>(null)

  // Bento-box grid for navbar items
  return (
    <motion.nav
      initial={{ opacity: 0, y: -40, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: "spring", stiffness: 80, damping: 18 }}
      className="relative mx-4 mt-4"
    >
      <div className={`relative overflow-hidden rounded-2xl border border-white/10 ${styles.containerBackground}`}>
        {/* Animated gradient overlay */}
        <motion.div
          className="absolute inset-0 opacity-40"
          animate={{
            background: [
              "linear-gradient(90deg, transparent, rgba(0,240,255,0.13), transparent)",
              "linear-gradient(90deg, transparent, rgba(255,0,255,0.13), transparent)",
              "linear-gradient(90deg, transparent, rgba(0,240,255,0.13), transparent)",
            ],
          }}
          transition={{ duration: 6, repeat: Number.POSITIVE_INFINITY }}
        />

        {/* Bento grid layout */}
        <div className="relative grid h-24 grid-cols-5 items-center gap-2 px-6">
          {/* Sidebar toggle */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="flex justify-center"
          >
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarCollapsed(!isSidebarCollapsed)}
              className={`lg:hidden ${styles.menuButtonShadow}`}
            >
              <Menu className="h-5 w-5" />
            </Button>
          </motion.div>

          {/* Logo with 3D glassmorphic effect */}
          <motion.div
            className={`flex flex-col items-center gap-1 ${styles.logoWrapper} ${hovered === "logo" ? styles.logoWrapperHovered : ""}`}
            whileHover={{ scale: 1.04 }}
            onHoverStart={() => setHovered("logo")}
            onHoverEnd={() => setHovered(null)}
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.15, type: "spring", stiffness: 120 }}
          >
            <motion.div
              animate={hovered === "logo" ? { rotateY: 360 } : { rotateY: 0 }}
              transition={{ duration: 0.8 }}
              className={styles.logoInner}
            >
              <Zap className={`h-8 w-8 text-[#00f0ff] ${styles.zapIconShadow}`} />
            </motion.div>
            <Link
              href="/"
              className={`text-2xl font-extrabold tracking-[0.15em] text-white ${styles.brandLink} ${hovered === "logo" ? styles.brandLinkHover : ""}`}
            >
              LYRICAL.TOP
            </Link>
          </motion.div>

          {/* Theme button */}
          <motion.div
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.96 }}
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 120 }}
            className="flex justify-center"
          >
            <Button
              variant="ghost"
              size="sm"
              onClick={onThemeClick}
              className={`gap-2 rounded-xl border border-white/10 bg-white/10 text-white/80 shadow-lg transition-all hover:border-[#ff00ff]/60 hover:bg-[#ff00ff]/20 hover:text-white ${styles.themeButtonShadow}`}
            >
              <Palette className="h-4 w-4" />
              <span className="hidden sm:inline">Theme</span>
              <ChevronDown className="h-3 w-3 opacity-50" />
            </Button>
          </motion.div>

          {/* Research button */}
          <motion.div
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.96 }}
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.25, type: "spring", stiffness: 120 }}
            className="flex justify-center"
          >
            <Link href="/research">
              <Button
                variant="ghost"
                size="sm"
                className={`gap-2 rounded-xl border border-white/10 bg-white/10 text-white/80 shadow-lg transition-all hover:border-[#00f0ff]/60 hover:bg-[#00f0ff]/20 hover:text-white ${styles.researchButtonShadow}`}
              >
                <Search className="h-4 w-4" />
                <span className="hidden sm:inline">Research</span>
              </Button>
            </Link>
          </motion.div>

          {/* Settings button */}
          <motion.div
            whileHover={{ scale: 1.08, rotate: 90 }}
            whileTap={{ scale: 0.96 }}
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 120 }}
            className="flex justify-center"
          >
            <SettingsModal />
          </motion.div>

          {/* AI Credits with animated gradient border */}
          <motion.div
            className="relative flex justify-center"
            whileHover={{ scale: 1.04 }}
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.35, type: "spring", stiffness: 120 }}
          >
            <motion.div
              className="absolute -inset-0.5 rounded-full opacity-80"
              animate={{
                background: [
                  "linear-gradient(0deg, #00f0ff, #9d4edd, #ff00ff)",
                  "linear-gradient(120deg, #ff00ff, #00f0ff, #9d4edd)",
                  "linear-gradient(240deg, #9d4edd, #ff00ff, #00f0ff)",
                  "linear-gradient(360deg, #00f0ff, #9d4edd, #ff00f0ff)",
                ],
              }}
              transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            />
            <div className={`relative flex items-center gap-2 rounded-full bg-black/80 px-4 py-2 text-sm shadow-lg ${styles.aiCreditsBackdrop}`}>
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
    </motion.nav>
  )
}
