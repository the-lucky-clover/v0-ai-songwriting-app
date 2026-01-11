"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { BookOpen, Lightbulb, Plus, Sparkles, Type, Loader2, Wand2, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useStore } from "@/lib/store"
import { findRhymes, findSynonyms, type RhymeResult } from "@/lib/rhymes"
import { useDebounce } from "@/hooks/use-debounce"
import { cn } from "@/lib/utils"
import type React from "react"

const smoothSpring = { type: "spring", stiffness: 80, damping: 20 }
const gentleSpring = { type: "spring", stiffness: 50, damping: 15 }

function BentoPanel({
  children,
  className,
  delay = 0,
  glowColor = "cyan",
}: {
  children: React.ReactNode
  className?: string
  delay?: number
  glowColor?: "cyan" | "magenta" | "purple" | "yellow"
}) {
  const glowColors = {
    cyan: { base: "rgba(0, 240, 255, 0.08)", hover: "rgba(0, 240, 255, 0.15)", border: "rgba(0, 240, 255, 0.2)" },
    magenta: { base: "rgba(255, 0, 255, 0.08)", hover: "rgba(255, 0, 255, 0.15)", border: "rgba(255, 0, 255, 0.2)" },
    purple: { base: "rgba(157, 78, 221, 0.08)", hover: "rgba(157, 78, 221, 0.15)", border: "rgba(157, 78, 221, 0.2)" },
    yellow: { base: "rgba(252, 238, 10, 0.08)", hover: "rgba(252, 238, 10, 0.12)", border: "rgba(252, 238, 10, 0.2)" },
  }

  const colors = glowColors[glowColor]

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ ...gentleSpring, delay }}
      className={cn("group/panel relative overflow-hidden rounded-2xl", className)}
      whileHover={{ scale: 1.01, y: -2 }}
    >
      {/* Multi-layer glassmorphic background */}
      <div
        className="absolute inset-0 transition-all duration-500"
        style={{
          background: `
            linear-gradient(180deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.02) 100%),
            linear-gradient(135deg, ${colors.base} 0%, transparent 50%)
          `,
          backdropFilter: "blur(40px) saturate(180%)",
        }}
      />

      {/* Border with glow */}
      <div
        className="absolute inset-0 rounded-2xl transition-all duration-500 group-hover/panel:opacity-100 opacity-60"
        style={{
          boxShadow: `
            inset 0 0 0 1px rgba(255,255,255,0.08),
            0 8px 32px rgba(0,0,0,0.3),
            0 0 40px ${colors.base}
          `,
        }}
      />

      {/* Hover glow enhancement */}
      <motion.div
        className="absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-500 group-hover/panel:opacity-100"
        style={{
          boxShadow: `0 0 60px ${colors.hover}`,
        }}
      />

      {/* Top highlight line */}
      <div
        className="absolute inset-x-0 top-0 h-px opacity-50"
        style={{
          background: `linear-gradient(90deg, transparent, ${colors.border}, transparent)`,
        }}
      />

      <div className="relative">{children}</div>
    </motion.div>
  )
}

export function RightColumn() {
  return (
    <>
      <AISongwriterButton />
      <BentoPanel delay={0.1} glowColor="magenta" className="flex flex-col">
        <RhymeDictionaryPanel />
      </BentoPanel>
      <BentoPanel delay={0.15} glowColor="yellow" className="flex flex-col">
        <PhraseSuggestionsPanel />
      </BentoPanel>
      <BentoPanel delay={0.2} glowColor="purple" className="flex-1">
        <SynonymsPanel />
      </BentoPanel>
    </>
  )
}

function AISongwriterButton() {
  const { setIsAIModalOpen } = useStore()

  return (
    <motion.button
      initial={{ opacity: 0, y: 30, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={gentleSpring}
      whileHover={{ scale: 1.02, y: -3 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => setIsAIModalOpen(true)}
      className="group relative overflow-hidden rounded-2xl p-6 text-left"
    >
      {/* Background layers */}
      <div
        className="absolute inset-0 transition-all duration-500"
        style={{
          background: `
            linear-gradient(135deg, rgba(0,240,255,0.12) 0%, rgba(157,78,221,0.12) 50%, rgba(255,0,255,0.12) 100%)
          `,
          backdropFilter: "blur(40px)",
        }}
      />

      {/* Animated shimmer */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.08) 50%, transparent 100%)",
          backgroundSize: "200% 100%",
        }}
        animate={{ backgroundPosition: ["200% 0", "-200% 0"] }}
        transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
      />

      {/* Rotating gradient border */}
      <motion.div
        className="absolute -inset-0.5 rounded-2xl opacity-70"
        animate={{
          background: [
            "linear-gradient(0deg, #00f0ff, #9d4edd, #ff00ff, #00f0ff)",
            "linear-gradient(120deg, #ff00ff, #00f0ff, #9d4edd, #ff00ff)",
            "linear-gradient(240deg, #9d4edd, #ff00ff, #00f0ff, #9d4edd)",
            "linear-gradient(360deg, #00f0ff, #9d4edd, #ff00ff, #00f0ff)",
          ],
        }}
        transition={{ duration: 5, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
      />
      <div className="absolute inset-0.5 rounded-[14px] bg-black/85" />

      {/* Content */}
      <div className="relative">
        <div className="mb-4 flex items-center gap-2">
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 10, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
          >
            <Wand2 className="h-6 w-6 text-[#00f0ff]" style={{ filter: "drop-shadow(0 0 12px #00f0ff)" }} />
          </motion.div>
          <motion.div animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 2.5, repeat: Number.POSITIVE_INFINITY }}>
            <Sparkles className="h-5 w-5 text-[#ff00ff]" style={{ filter: "drop-shadow(0 0 12px #ff00ff)" }} />
          </motion.div>
          <motion.div animate={{ y: [0, -4, 0] }} transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}>
            <Zap className="h-6 w-6 text-[#9d4edd]" style={{ filter: "drop-shadow(0 0 12px #9d4edd)" }} />
          </motion.div>
        </div>
        <h3 className="mb-2 text-lg font-bold tracking-wide text-white">AI SONGWRITER</h3>
        <p className="mb-4 text-sm text-white/60">Neural lyric generation with style emulation</p>
        <div className="flex items-center gap-2 text-sm font-medium text-[#00f0ff]">
          Launch Studio
          <motion.span animate={{ x: [0, 8, 0] }} transition={{ duration: 1.2, repeat: Number.POSITIVE_INFINITY }}>
            →
          </motion.span>
        </div>
      </div>
    </motion.button>
  )
}

function RhymeDictionaryPanel() {
  const { currentWord, files, currentFileId, updateFile } = useStore()
  const debouncedWord = useDebounce(currentWord, 300)
  const [rhymes, setRhymes] = useState<{ perfect: RhymeResult[]; near: RhymeResult[] }>({ perfect: [], near: [] })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (debouncedWord && debouncedWord.length >= 2) {
      setLoading(true)
      findRhymes(debouncedWord).then((r) => {
        setRhymes(r)
        setLoading(false)
      })
    } else {
      setRhymes({ perfect: [], near: [] })
    }
  }, [debouncedWord])

  const insertWord = (word: string) => {
    const file = files.find((f) => f.id === currentFileId)
    if (file) {
      updateFile(file.id, { content: file.content + " " + word })
    }
  }

  return (
    <>
      <div className="flex items-center gap-2 border-b border-white/5 px-4 py-3">
        <motion.div
          animate={{ rotateY: [0, 360] }}
          transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY, repeatDelay: 3 }}
        >
          <BookOpen className="h-4 w-4 text-[#ff00ff]" style={{ filter: "drop-shadow(0 0 8px #ff00ff)" }} />
        </motion.div>
        <span className="font-semibold text-white">Rhyme Dictionary</span>
      </div>

      <div className="flex-1 overflow-y-auto p-4 scrollbar-thin">
        {debouncedWord ? (
          <>
            <p className="mb-3 text-sm text-white/50">
              Word: <span className="font-medium text-white">&quot;{debouncedWord}&quot;</span>
            </p>

            {loading ? (
              <div className="flex items-center justify-center py-8">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                >
                  <Loader2 className="h-6 w-6 text-[#00f0ff]" />
                </motion.div>
              </div>
            ) : (
              <>
                {rhymes.perfect.length > 0 && (
                  <div className="mb-4">
                    <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-[#00f0ff]">
                      Perfect Rhymes
                    </h4>
                    <div className="space-y-1.5">
                      {rhymes.perfect.slice(0, 8).map((r, i) => (
                        <RhymeItem key={r.word} rhyme={r} onInsert={insertWord} index={i} />
                      ))}
                    </div>
                  </div>
                )}

                {rhymes.near.length > 0 && (
                  <div>
                    <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-[#ff00ff]">Near Rhymes</h4>
                    <div className="space-y-1.5">
                      {rhymes.near.slice(0, 6).map((r, i) => (
                        <RhymeItem key={r.word} rhyme={r} onInsert={insertWord} index={i} />
                      ))}
                    </div>
                  </div>
                )}

                {rhymes.perfect.length === 0 && rhymes.near.length === 0 && (
                  <p className="py-6 text-center text-sm text-white/40">No rhymes found</p>
                )}
              </>
            )}
          </>
        ) : (
          <p className="py-8 text-center text-sm text-white/40">Start typing to see rhymes</p>
        )}
      </div>
    </>
  )
}

function RhymeItem({
  rhyme,
  onInsert,
  index,
}: { rhyme: RhymeResult; onInsert: (word: string) => void; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -15 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.04, ...smoothSpring }}
      whileHover={{ x: 6, backgroundColor: "rgba(255,255,255,0.05)" }}
      className="group flex items-center justify-between rounded-xl border border-white/5 px-3 py-2.5 transition-all duration-300 hover:border-white/15"
    >
      <div className="flex items-center gap-3">
        <span className="text-white">{rhyme.word}</span>
        <span className="text-xs text-white/35">({rhyme.syllables} syl)</span>
      </div>
      <motion.div whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }}>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 opacity-0 transition-all duration-200 group-hover:opacity-100"
          onClick={() => onInsert(rhyme.word)}
        >
          <Plus className="h-4 w-4 text-[#00f0ff]" />
        </Button>
      </motion.div>
    </motion.div>
  )
}

function PhraseSuggestionsPanel() {
  const { currentWord } = useStore()
  const [suggestions, setSuggestions] = useState<{ phrase: string; syllables: number; mood: string }[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (currentWord && currentWord.length >= 3) {
      setLoading(true)
      const timeout = setTimeout(() => {
        setSuggestions([
          { phrase: `${currentWord} in the midnight hour`, syllables: 7, mood: "melancholic" },
          { phrase: `neon lights and ${currentWord}`, syllables: 5, mood: "atmospheric" },
          { phrase: `dancing with ${currentWord} tonight`, syllables: 6, mood: "energetic" },
        ])
        setLoading(false)
      }, 800)
      return () => clearTimeout(timeout)
    } else {
      setSuggestions([])
    }
  }, [currentWord])

  return (
    <>
      <div className="flex items-center gap-2 border-b border-white/5 px-4 py-3">
        <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}>
          <Lightbulb className="h-4 w-4 text-[#fcee0a]" style={{ filter: "drop-shadow(0 0 8px #fcee0a)" }} />
        </motion.div>
        <span className="font-semibold text-white">Suggestions</span>
      </div>

      <div className="flex-1 overflow-y-auto p-4 scrollbar-thin">
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-4 overflow-hidden rounded-xl border border-white/5 bg-white/5 px-3 py-3"
          >
            <div className="mb-2 flex items-center gap-2">
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-white/10">
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: "linear-gradient(90deg, #00f0ff, #9d4edd, #ff00ff)" }}
                  animate={{ width: ["0%", "67%"] }}
                  transition={{ duration: 1 }}
                />
              </div>
              <span className="text-xs text-white/50">67%</span>
            </div>
            <p className="text-xs text-white/40">Analyzing style...</p>
          </motion.div>
        )}

        <AnimatePresence>
          {suggestions.map((s, i) => (
            <motion.div
              key={s.phrase}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ delay: i * 0.1, ...smoothSpring }}
              whileHover={{ scale: 1.02, x: 4 }}
              className="group mb-2 cursor-pointer rounded-xl border border-white/5 p-3 transition-all duration-300 hover:border-[#fcee0a]/30 hover:bg-[#fcee0a]/5"
            >
              <p className="mb-1.5 text-sm text-white">&quot;{s.phrase}&quot;</p>
              <div className="flex items-center justify-between text-xs">
                <span className="text-white/40">
                  {s.syllables} syllables • {s.mood}
                </span>
                <motion.div whileHover={{ scale: 1.2 }}>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-5 w-5 opacity-0 transition-all duration-200 group-hover:opacity-100"
                  >
                    <Plus className="h-3 w-3 text-[#fcee0a]" />
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {!loading && suggestions.length === 0 && (
          <p className="py-6 text-center text-sm text-white/40">Type to get AI suggestions</p>
        )}
      </div>
    </>
  )
}

function SynonymsPanel() {
  const { currentWord, files, currentFileId, updateFile } = useStore()
  const debouncedWord = useDebounce(currentWord, 300)
  const [synonyms, setSynonyms] = useState<RhymeResult[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (debouncedWord && debouncedWord.length >= 2) {
      setLoading(true)
      findSynonyms(debouncedWord).then((s) => {
        setSynonyms(s)
        setLoading(false)
      })
    } else {
      setSynonyms([])
    }
  }, [debouncedWord])

  const insertWord = (word: string) => {
    const file = files.find((f) => f.id === currentFileId)
    if (file) {
      updateFile(file.id, { content: file.content + " " + word })
    }
  }

  return (
    <>
      <div className="flex items-center gap-2 border-b border-white/5 px-4 py-3">
        <motion.div animate={{ rotateZ: [0, 5, -5, 0] }} transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}>
          <Type className="h-4 w-4 text-[#9d4edd]" style={{ filter: "drop-shadow(0 0 8px #9d4edd)" }} />
        </motion.div>
        <span className="font-semibold text-white">Synonyms</span>
      </div>

      <div className="p-4">
        {loading ? (
          <div className="flex items-center justify-center py-6">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            >
              <Loader2 className="h-5 w-5 text-[#9d4edd]" />
            </motion.div>
          </div>
        ) : synonyms.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {synonyms.slice(0, 12).map((s, i) => (
              <motion.button
                key={s.word}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.04, ...smoothSpring }}
                whileHover={{ scale: 1.1, y: -3 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => insertWord(s.word)}
                className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-white/70 transition-all duration-300 hover:border-[#9d4edd]/50 hover:bg-[#9d4edd]/10 hover:text-white hover:shadow-[0_0_15px_rgba(157,78,221,0.3)]"
              >
                {s.word}
              </motion.button>
            ))}
          </div>
        ) : (
          <p className="py-4 text-center text-sm text-white/40">Select a word to see synonyms</p>
        )}
      </div>
    </>
  )
}
