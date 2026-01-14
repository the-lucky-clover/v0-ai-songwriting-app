"use client"

import type React from "react"

import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from "framer-motion"
import { Zap, ArrowRight, Play, Mic2, Brain, Waves, Music, Heart } from "lucide-react"
import { LandingBackground } from "./landing-background"
import { useState, useEffect, useRef } from "react"
import Link from "next/link"

interface LandingPageProps {
  onGetStarted: () => void
}

const features = [
  {
    icon: Brain,
    label: "AI SONGWRITER",
    desc: "Neural lyric generation powered by advanced language models",
    gradient: "from-cyan-500 to-blue-600",
  },
  {
    icon: Waves,
    label: "AUDIOGENETICS",
    desc: "Musical DNA analysis and style extraction",
    gradient: "from-purple-500 to-pink-600",
  },
  {
    icon: Mic2,
    label: "RHYME ENGINE",
    desc: "Perfect rhyme matching with phonetic analysis",
    gradient: "from-pink-500 to-rose-600",
  },
  {
    icon: Music,
    label: "FLOW ANALYSIS",
    desc: "Real-time syllable counting and rhythm patterns",
    gradient: "from-amber-500 to-orange-600",
  },
]

const manifestoWords = ["CREATE", "INNOVATE", "DISRUPT", "INSPIRE", "TRANSFORM", "ELEVATE"]

export function LandingPage({ onGetStarted }: LandingPageProps) {
  const [loaded, setLoaded] = useState(false)
  const [activeFeature, setActiveFeature] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)

  // Mouse tracking for parallax
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const smoothMouseX = useSpring(mouseX, { stiffness: 50, damping: 20 })
  const smoothMouseY = useSpring(mouseY, { stiffness: 50, damping: 20 })

  const parallaxX = useTransform(smoothMouseX, [0, 1], [-20, 20])
  const parallaxY = useTransform(smoothMouseY, [0, 1], [-20, 20])

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 100)
    return () => clearTimeout(timer)
  }, [])

  // Feature rotation
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % features.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    mouseX.set((e.clientX - rect.left) / rect.width)
    mouseY.set((e.clientY - rect.top) / rect.height)
  }

  const currentYear = new Date().getFullYear()

  return (
    <div ref={containerRef} className="relative min-h-screen overflow-hidden bg-black" onMouseMove={handleMouseMove}>
      <LandingBackground />

      {/* Horizontal scrolling manifesto */}
      <div className="pointer-events-none fixed inset-x-0 top-1/2 -translate-y-1/2 overflow-hidden opacity-[0.03]">
        <motion.div
          animate={{ x: [0, -2000] }}
          transition={{ duration: 30, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
          className="flex whitespace-nowrap"
        >
          {[...manifestoWords, ...manifestoWords, ...manifestoWords].map((word, i) => (
            <span
              key={i}
              className="mx-8 text-[20vw] font-black tracking-tighter text-white"
              style={{ fontFamily: "Orbitron, sans-serif" }}
            >
              {word}
            </span>
          ))}
        </motion.div>
      </div>

      {/* Main content */}
      <div className="relative flex min-h-screen flex-col">
        {/* Hero Section - Full viewport */}
        <div className="flex min-h-screen flex-col items-center justify-center px-6 py-20">
          <AnimatePresence>
            {loaded && (
              <>
                {/* Floating orbs */}
                <motion.div style={{ x: parallaxX, y: parallaxY }} className="pointer-events-none absolute">
                  <motion.div
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.3, 0.5, 0.3],
                    }}
                    transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY }}
                    className="absolute -top-32 -left-32 h-[500px] w-[500px] rounded-full blur-[120px]"
                    style={{ background: "radial-gradient(circle, #00f0ff 0%, transparent 70%)" }}
                  />
                  <motion.div
                    animate={{
                      scale: [1.2, 1, 1.2],
                      opacity: [0.4, 0.6, 0.4],
                    }}
                    transition={{ duration: 10, repeat: Number.POSITIVE_INFINITY }}
                    className="absolute -bottom-32 -right-32 h-[600px] w-[600px] rounded-full blur-[140px]"
                    style={{ background: "radial-gradient(circle, #ff00ff 0%, transparent 70%)" }}
                  />
                </motion.div>

                {/* Main Title Block */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 1 }}
                  className="relative z-10 text-center"
                >
                  {/* Eyebrow */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 backdrop-blur-xl"
                  >
                    <span className="relative flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-75" />
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-cyan-500" />
                    </span>
                    <span className="text-sm font-medium text-white/70">NOW IN PUBLIC BETA</span>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 50, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 1, delay: 0.4, type: "spring", stiffness: 80 }}
                    className="relative mb-6"
                  >
                    <motion.h1
                      className="relative text-5xl font-black tracking-tight text-white sm:text-7xl md:text-8xl lg:text-9xl"
                      style={{
                        fontFamily: "Orbitron, system-ui",
                        lineHeight: 1,
                      }}
                    >
                      <motion.span
                        animate={{
                          textShadow: [
                            "0 0 60px rgba(0,240,255,0.5)",
                            "0 0 120px rgba(255,0,255,0.5)",
                            "0 0 60px rgba(0,240,255,0.5)",
                          ],
                        }}
                        transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY }}
                        className="inline"
                      >
                        LYRICAL
                      </motion.span>{" "}
                      <motion.span
                        className="inline bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent"
                        animate={{
                          backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                        }}
                        transition={{ duration: 5, repeat: Number.POSITIVE_INFINITY }}
                        style={{ backgroundSize: "200% 200%" }}
                      >
                        AI
                      </motion.span>
                    </motion.h1>

                    {/* Decorative line */}
                    <motion.div
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ duration: 1, delay: 0.8 }}
                      className="absolute -bottom-4 left-1/2 h-1 w-32 -translate-x-1/2 origin-center rounded-full md:w-48"
                      style={{
                        background: "linear-gradient(90deg, transparent, #00f0ff, #ff00ff, transparent)",
                      }}
                    />
                  </motion.div>

                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 1 }}
                    className="mx-auto mb-12 max-w-2xl text-balance text-lg font-light text-white/60 sm:text-xl md:text-2xl lg:text-3xl"
                  >
                    Where <span className="font-medium text-cyan-400">neural networks</span> meet{" "}
                    <span className="font-medium text-pink-400">lyrical genius</span>
                  </motion.p>

                  {/* CTA Buttons */}
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 1.2 }}
                    className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
                  >
                    {/* Primary CTA */}
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={onGetStarted}
                      className="group relative overflow-hidden rounded-2xl px-8 py-4 text-base font-bold text-white sm:px-10 sm:py-5 sm:text-lg"
                    >
                      {/* Animated gradient background */}
                      <motion.div
                        className="absolute inset-0"
                        animate={{
                          background: [
                            "linear-gradient(135deg, #00f0ff 0%, #9d4edd 50%, #ff00ff 100%)",
                            "linear-gradient(135deg, #ff00ff 0%, #00f0ff 50%, #9d4edd 100%)",
                            "linear-gradient(135deg, #9d4edd 0%, #ff00ff 50%, #00f0ff 100%)",
                            "linear-gradient(135deg, #00f0ff 0%, #9d4edd 50%, #ff00ff 100%)",
                          ],
                        }}
                        transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY }}
                      />
                      {/* Shimmer effect */}
                      <motion.div
                        className="absolute inset-0 opacity-0 group-hover:opacity-100"
                        animate={{
                          background: [
                            "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.3) 50%, transparent 100%)",
                          ],
                          x: ["-100%", "200%"],
                        }}
                        transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, repeatDelay: 0.5 }}
                      />
                      <span className="relative flex items-center gap-3">
                        <Zap className="h-5 w-5" />
                        Start Creating
                        <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                      </span>
                    </motion.button>

                    {/* Secondary CTA */}
                    <motion.button
                      whileHover={{ scale: 1.03, borderColor: "rgba(255,255,255,0.3)" }}
                      whileTap={{ scale: 0.98 }}
                      className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-6 py-4 text-base font-medium text-white backdrop-blur-xl transition-colors sm:px-8 sm:py-5 sm:text-lg"
                    >
                      <Play className="h-5 w-5 text-cyan-400" />
                      Watch Demo
                    </motion.button>
                  </motion.div>
                </motion.div>

                {/* Feature Cards - Bento Grid */}
                <motion.div
                  initial={{ opacity: 0, y: 60 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1, delay: 1.5 }}
                  className="relative z-10 mt-16 w-full max-w-6xl px-4 sm:mt-24"
                >
                  <div className="grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
                    {features.map((feature, i) => (
                      <motion.div
                        key={feature.label}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 1.6 + i * 0.1 }}
                        whileHover={{ y: -8, scale: 1.02 }}
                        onHoverStart={() => setActiveFeature(i)}
                        className={`group relative cursor-pointer overflow-hidden rounded-2xl p-5 transition-all duration-500 sm:rounded-3xl sm:p-6 ${
                          activeFeature === i ? "ring-2 ring-white/20" : ""
                        }`}
                        style={{
                          background: activeFeature === i ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.03)",
                          backdropFilter: "blur(40px)",
                        }}
                      >
                        {/* Gradient overlay on hover */}
                        <div
                          className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 transition-opacity duration-500 group-hover:opacity-10`}
                        />

                        {/* Top glow line */}
                        <motion.div
                          className="absolute inset-x-0 top-0 h-px"
                          style={{
                            background:
                              activeFeature === i
                                ? "linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)"
                                : "linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)",
                          }}
                        />

                        <div className="relative">
                          <div
                            className={`mb-4 inline-flex rounded-xl bg-gradient-to-br ${feature.gradient} p-2.5 sm:rounded-2xl sm:p-3`}
                          >
                            <feature.icon className="h-5 w-5 text-white sm:h-6 sm:w-6" />
                          </div>
                          <h3 className="mb-2 text-xs font-bold tracking-wider text-white sm:text-sm">
                            {feature.label}
                          </h3>
                          <p className="text-pretty text-xs leading-relaxed text-white/50 sm:text-sm">{feature.desc}</p>
                        </div>

                        {/* Active indicator */}
                        {activeFeature === i && (
                          <motion.div
                            layoutId="activeFeature"
                            className="absolute bottom-4 right-4 h-2 w-2 rounded-full bg-cyan-400"
                            style={{ boxShadow: "0 0 20px #00f0ff" }}
                          />
                        )}
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                {/* Stats Section */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 1, delay: 2 }}
                  className="relative z-10 mt-16 flex flex-wrap items-center justify-center gap-8 text-center sm:mt-20 sm:gap-12"
                >
                  {[
                    { value: "10K+", label: "Lyrics Generated" },
                    { value: "500+", label: "Active Writers" },
                    { value: "99%", label: "Satisfaction Rate" },
                  ].map((stat, i) => (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 2.2 + i * 0.1 }}
                    >
                      <div className="text-3xl font-black text-white sm:text-4xl md:text-5xl">{stat.value}</div>
                      <div className="mt-1 text-xs text-nowrap text-white/40 sm:text-sm">{stat.label}</div>
                    </motion.div>
                  ))}
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: loaded ? 1 : 0 }}
          transition={{ duration: 0.8, delay: 2.5 }}
          className="relative mt-auto border-t border-white/5 bg-black/80 backdrop-blur-xl"
        >
          <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-6 md:flex-row">
            {/* Left - Copyright */}
            <p className="text-nowrap text-xs tracking-wider text-white/30">
              COPYRIGHT {currentYear} — ALL RIGHTS RESERVED — LYRICAL AI
            </p>

            {/* Right - Links */}
            <div className="flex flex-wrap items-center justify-center gap-4 text-xs tracking-wider text-white/30 sm:gap-6">
              <Link href="/terms" className="transition-colors hover:text-white/60">
                TERMS
              </Link>
              <Link href="/privacy" className="transition-colors hover:text-white/60">
                PRIVACY
              </Link>
              <Link href="/contact" className="transition-colors hover:text-white/60">
                CONTACT
              </Link>
              <span className="flex items-center gap-1.5 text-nowrap">
                MADE WITH <Heart className="h-3 w-3 text-pink-500" fill="currentColor" /> BY{" "}
                <a
                  href="https://soundcloud.com/lucky-clover"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-cyan-400 transition-colors hover:text-cyan-300"
                >
                  LUCKY CLOVER
                </a>
              </span>
            </div>
          </div>
        </motion.footer>
      </div>
    </div>
  )
}
