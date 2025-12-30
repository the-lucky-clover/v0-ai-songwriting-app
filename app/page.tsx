"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { LandingPage } from "@/components/landing-page"
import { Dashboard } from "@/components/dashboard"
import { IntroAnimation } from "@/components/intro-animation"

export default function Home() {
  const [phase, setPhase] = useState<"intro" | "landing" | "dashboard">("intro")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#00f0ff] border-t-transparent" />
      </div>
    )
  }

  return (
    <AnimatePresence mode="wait">
      {phase === "intro" && <IntroAnimation key="intro" onComplete={() => setPhase("landing")} />}

      {phase === "landing" && (
        <motion.div
          key="landing"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
          transition={{ duration: 0.8 }}
        >
          <LandingPage onGetStarted={() => setPhase("dashboard")} />
        </motion.div>
      )}

      {phase === "dashboard" && (
        <motion.div
          key="dashboard"
          initial={{ opacity: 0, scale: 1.1, filter: "blur(20px)" }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <Dashboard />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
