"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Sparkles, Zap, Music, Brain, Mic2, ChevronRight, Stars, Heart } from "lucide-react"
import { LandingBackground } from "./landing-background"
import { useState, useEffect } from "react"
import Link from "next/link"

interface LandingPageProps {
  onGetStarted: () => void
}

const features = [
  { icon: Brain, label: "AI Songwriter", desc: "Neural lyric generation" },
  { icon: Music, label: "Syllable Counter", desc: "Real-time analysis" },
  { icon: Mic2, label: "Rhyme Engine", desc: "Perfect matches" },
  { icon: Stars, label: "Flow Analysis", desc: "Rhythm patterns" },
]

const floatingWords = ["RHYTHM", "FLOW", "BARS", "MELODY", "VERSE", "HOOK", "BRIDGE", "CHORUS"]

export function LandingPage({ onGetStarted }: LandingPageProps) {
  const [loaded, setLoaded] = useState(false)
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null)

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 100)
    return () => clearTimeout(timer)
  }, [])

  const currentYear = new Date().getFullYear()

  return (
    <div className="relative min-h-screen overflow-hidden bg-black">
      <LandingBackground />

      {/* Floating words */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        {floatingWords.map((word, i) => (
          <motion.div
            key={word}
            initial={{ opacity: 0, x: -100 }}
            animate={{
              opacity: [0, 0.1, 0.1, 0],
              x: ["0vw", "120vw"],
            }}
            transition={{
              duration: 20 + i * 3,
              repeat: Number.POSITIVE_INFINITY,
              delay: i * 2.5,
              ease: "linear",
            }}
            className="absolute whitespace-nowrap font-mono text-6xl font-bold tracking-[0.3em] text-white/5 md:text-8xl"
            style={{
              top: `${10 + i * 12}%`,
            }}
          >
            {word}
          </motion.div>
        ))}
      </div>

      {/* Main content */}
      <div className="relative flex min-h-screen flex-col items-center justify-center px-4 py-20 pb-32">
        <AnimatePresence>
          {loaded && (
            <>
              {/* Glowing orb behind title */}
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
              >
                <div
                  className="h-[600px] w-[600px] rounded-full opacity-30 blur-[100px]"
                  style={{
                    background: "radial-gradient(circle, #00f0ff 0%, #9d4edd 40%, #ff00ff 70%, transparent 100%)",
                  }}
                />
              </motion.div>

              {/* Logo / Title */}
              <motion.div
                initial={{ opacity: 0, y: 50, scale: 0.8, rotateX: -30 }}
                animate={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
                transition={{ duration: 1.2, delay: 0.3, type: "spring", stiffness: 100 }}
                className="relative mb-4 text-center"
                style={{ perspective: 1000 }}
              >
                <motion.div
                  animate={{
                    textShadow: [
                      "0 0 40px rgba(0,240,255,0.8), 0 0 80px rgba(157,78,221,0.6), 0 0 120px rgba(255,0,255,0.4)",
                      "0 0 60px rgba(255,0,255,0.8), 0 0 100px rgba(0,240,255,0.6), 0 0 140px rgba(157,78,221,0.4)",
                      "0 0 40px rgba(0,240,255,0.8), 0 0 80px rgba(157,78,221,0.6), 0 0 120px rgba(255,0,255,0.4)",
                    ],
                  }}
                  transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
                >
                  <h1
                    className="text-6xl font-black tracking-[0.15em] text-white md:text-8xl lg:text-9xl"
                    style={{ fontFamily: "Orbitron, system-ui, sans-serif" }}
                  >
                    LYRICAL AI
                  </h1>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, scaleX: 0 }}
                  animate={{ opacity: 1, scaleX: 1 }}
                  transition={{ duration: 0.8, delay: 0.8 }}
                  className="mx-auto mt-2 h-1 w-full max-w-md rounded-full"
                  style={{
                    background: "linear-gradient(90deg, transparent, #00f0ff, #9d4edd, #ff00ff, transparent)",
                  }}
                />
                {/* Bottom text */}
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 2.5 }}
                  className="mt-8 flex items-center gap-2 text-sm text-white/40"
                >
                  <Sparkles className="h-4 w-4" />
                  No account required • lyrical.top • Powered by AI
                </motion.p>
              </motion.div>

              {/* Tagline */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.2 }}
                className="mb-12 max-w-xl text-center text-xl font-light text-white/80 md:text-2xl"
                style={{
                  textShadow: "0 0 30px rgba(0,240,255,0.3)",
                }}
              >
                Where <span className="font-semibold text-[#00f0ff]">neural networks</span> meet{" "}
                <span className="font-semibold text-[#ff00ff]">lyrical genius</span>
              </motion.p>

              {/* Feature cards - Bento grid */}
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.5 }}
                className="mb-12 grid max-w-3xl grid-cols-2 gap-4 px-4 md:grid-cols-4"
              >
                {features.map((feature, i) => (
                  <motion.div
                    key={feature.label}
                    initial={{ opacity: 0, scale: 0.8, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 1.6 + i * 0.1 }}
                    whileHover={{ scale: 1.05, y: -5 }}
                    onHoverStart={() => setHoveredFeature(i)}
                    onHoverEnd={() => setHoveredFeature(null)}
                    className="group relative cursor-pointer overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl transition-all duration-300"
                    style={{
                      boxShadow:
                        hoveredFeature === i
                          ? "0 0 40px rgba(0,240,255,0.3), inset 0 1px 0 rgba(255,255,255,0.1)"
                          : "inset 0 1px 0 rgba(255,255,255,0.05)",
                    }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-[#00f0ff]/10 via-transparent to-[#ff00ff]/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                    <feature.icon className="relative mb-2 h-8 w-8 text-[#00f0ff] transition-transform duration-300 group-hover:scale-110" />
                    <h3 className="relative text-sm font-semibold text-white">{feature.label}</h3>
                    <p className="relative text-xs text-white/50">{feature.desc}</p>
                  </motion.div>
                ))}
              </motion.div>

              {/* CTA Button */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 2, type: "spring", stiffness: 200 }}
                className="relative"
              >
                <motion.div
                  className="absolute -inset-1 rounded-full opacity-75 blur-lg"
                  animate={{
                    background: [
                      "linear-gradient(90deg, #00f0ff, #9d4edd, #ff00ff)",
                      "linear-gradient(90deg, #ff00ff, #00f0ff, #9d4edd)",
                      "linear-gradient(90deg, #9d4edd, #ff00ff, #00f0ff)",
                      "linear-gradient(90deg, #00f0ff, #9d4edd, #ff00ff)",
                    ],
                  }}
                  transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onGetStarted}
                  className="relative flex items-center gap-3 rounded-full bg-black px-10 py-5 text-lg font-bold text-white transition-all"
                  style={{
                    border: "2px solid rgba(255,255,255,0.2)",
                  }}
                >
                  <Zap className="h-5 w-5 text-[#00f0ff]" />
                  <span>Start Creating</span>
                  <ChevronRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </motion.button>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>

      <motion.footer
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: loaded ? 1 : 0, y: loaded ? 0 : 20 }}
        transition={{ duration: 0.8, delay: 2.5 }}
        className="absolute bottom-0 left-0 right-0 border-t border-white/5 bg-black/50 backdrop-blur-sm"
      >
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-4 md:flex-row">
          {/* Left side - Copyright */}
          <p className="text-sm text-white/40">COPYRIGHT {currentYear} - ALL RIGHTS RESERVED - LYRICAL AI</p>

          {/* Right side - Links */}
          <div className="flex items-center gap-6 text-sm text-white/40">
            <Link href="/terms" className="transition-colors hover:text-white/70">
              TERMS
            </Link>
            <Link href="/privacy" className="transition-colors hover:text-white/70">
              PRIVACY
            </Link>
            <Link href="/contact" className="transition-colors hover:text-white/70">
              CONTACT
            </Link>
            <span className="flex items-center gap-1">
              MADE WITH <Heart className="h-3 w-3 text-[#ff00ff]" fill="#ff00ff" /> BY{" "}
              <a
                href="https://soundcloud.com/lucky-clover"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#00f0ff] transition-colors hover:text-[#ff00ff]"
              >
                LUCKY CLOVER
              </a>
            </span>
          </div>
        </div>
      </motion.footer>
    </div>
  )
}
