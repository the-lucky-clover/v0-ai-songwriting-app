"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useState, useEffect } from "react"

interface IntroAnimationProps {
  onComplete: () => void
}

export function IntroAnimation({ onComplete }: IntroAnimationProps) {
  const [phase, setPhase] = useState(0)

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 500),
      setTimeout(() => setPhase(2), 1500),
      setTimeout(() => setPhase(3), 2500),
      setTimeout(() => onComplete(), 3500),
    ]
    return () => timers.forEach(clearTimeout)
  }, [onComplete])

  return (
    <AnimatePresence>
      {phase < 3 && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black"
        >
          {/* Scanning lines */}
          <div className="absolute inset-0 overflow-hidden opacity-20">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ x: "-100%" }}
                animate={{ x: "200%" }}
                transition={{
                  duration: 1,
                  delay: i * 0.1,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "linear",
                }}
                className="absolute h-px w-full bg-gradient-to-r from-transparent via-[#00f0ff] to-transparent"
                style={{ top: `${i * 5}%` }}
              />
            ))}
          </div>

          {/* Logo animation */}
          <div className="relative">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.8, type: "spring" }}
              className="relative"
            >
              {phase >= 1 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center"
                >
                  <motion.h1
                    animate={{
                      textShadow: [
                        "0 0 20px #00f0ff, 0 0 40px #00f0ff",
                        "0 0 40px #ff00ff, 0 0 80px #ff00ff",
                        "0 0 20px #00f0ff, 0 0 40px #00f0ff",
                      ],
                    }}
                    transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY }}
                    className="text-5xl font-black tracking-[0.2em] text-white md:text-7xl"
                    style={{ fontFamily: "Orbitron, system-ui" }}
                  >
                    LYRICAL
                  </motion.h1>
                </motion.div>
              )}

              {phase >= 2 && (
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 0.5 }}
                  className="mx-auto mt-4 h-0.5 overflow-hidden rounded-full"
                  style={{
                    background: "linear-gradient(90deg, #00f0ff, #9d4edd, #ff00ff)",
                  }}
                />
              )}
            </motion.div>

            {/* Orbiting elements */}
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0 }}
                animate={{
                  scale: 1,
                  rotate: 360,
                }}
                transition={{
                  scale: { duration: 0.3, delay: i * 0.1 },
                  rotate: { duration: 3 + i * 0.5, repeat: Number.POSITIVE_INFINITY, ease: "linear" },
                }}
                className="absolute left-1/2 top-1/2"
                style={{
                  transformOrigin: "0 0",
                }}
              >
                <div
                  className="h-2 w-2 rounded-full"
                  style={{
                    background: `hsl(${i * 45}, 100%, 60%)`,
                    boxShadow: `0 0 20px hsl(${i * 45}, 100%, 60%)`,
                    transform: `translate(${80 + i * 10}px, 0)`,
                  }}
                />
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
