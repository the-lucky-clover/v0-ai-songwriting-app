"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Sparkles, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { useStore } from "@/lib/store"
import { cn } from "@/lib/utils"

export function AIModal() {
  const {
    isAIModalOpen,
    setIsAIModalOpen,
    aiConfig,
    setAIConfig,
    isGenerating,
    setIsGenerating,
    generationProgress,
    setGenerationProgress,
    createFile,
    updateFile,
    currentFileId,
    files,
  } = useStore()

  const [localConfig, setLocalConfig] = useState(aiConfig)

  const generateStructurePreview = () => {
    const parts: string[] = []
    const { verseCount, chorusCount } = localConfig

    for (let i = 1; i <= verseCount; i++) {
      parts.push(`V${i}`)
      if (i <= chorusCount - 1) {
        parts.push("Hook")
      }
    }

    if (chorusCount > 0) {
      // Last chorus becomes bridge
      parts.push("Bridge")
      parts.push("Hook") // Final hook after bridge
    }

    return parts
  }

  const handleGenerate = async () => {
    if (!localConfig.subjectMatter.trim()) return

    setIsGenerating(true)
    setAIConfig(localConfig)

    // Simulate generation progress
    const stages = [
      { progress: 30, message: "Analyzing musical influence..." },
      { progress: 50, message: "Researching style patterns..." },
      { progress: 80, message: "Crafting verses and hooks..." },
      { progress: 95, message: "Adding finishing touches..." },
      { progress: 100, message: "Complete!" },
    ]

    for (const stage of stages) {
      await new Promise((r) => setTimeout(r, 800))
      setGenerationProgress(stage.progress)
    }

    // Generate mock lyrics
    const lyrics = generateMockLyrics(localConfig)

    // Create or update file
    if (currentFileId) {
      updateFile(currentFileId, {
        content: lyrics,
        title: localConfig.songTitle || "Generated Song",
        musical_influence: localConfig.musicalInfluence,
        subject_matter: localConfig.subjectMatter,
      })
    } else {
      createFile(localConfig.songTitle || "Generated Song", lyrics)
    }

    setIsGenerating(false)
    setGenerationProgress(0)
    setIsAIModalOpen(false)
  }

  const structureParts = generateStructurePreview()

  if (!isAIModalOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
      >
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/70 backdrop-blur-xl"
          onClick={() => !isGenerating && setIsAIModalOpen(false)}
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="glass-panel relative z-10 max-h-[90vh] w-full max-w-2xl overflow-y-auto scrollbar-thin"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/5 px-6 py-4">
            <div className="flex items-center gap-3">
              <Sparkles className="h-6 w-6 text-neon-cyan" />
              <h2 className="text-xl font-semibold text-white">AI Songwriter Studio</h2>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => !isGenerating && setIsAIModalOpen(false)}
              disabled={isGenerating}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Content */}
          <div className="space-y-6 p-6">
            {/* Subject Matter */}
            <div className="space-y-2">
              <Label className="text-white">SUBJECT MATTER *</Label>
              <Input
                placeholder='e.g., "heartbreak in a neon city" or "finding hope after loss"'
                value={localConfig.subjectMatter}
                onChange={(e) => setLocalConfig({ ...localConfig, subjectMatter: e.target.value })}
                className="border-white/10 bg-white/5 text-white placeholder:text-white/30"
              />
            </div>

            {/* Musical Influence */}
            <div className="space-y-2">
              <Label className="text-white">MUSICAL INFLUENCE (optional)</Label>
              <Input
                placeholder='e.g., "The Weeknd", "90s hip-hop", "K-pop", "Blinding Lights"'
                value={localConfig.musicalInfluence}
                onChange={(e) => setLocalConfig({ ...localConfig, musicalInfluence: e.target.value })}
                className="border-white/10 bg-white/5 text-white placeholder:text-white/30"
              />
              <p className="text-xs text-white/40">
                Leave empty for general style, or enter any artist/band/song/album/genre
              </p>
            </div>

            {/* Song Title & Audio Tag */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label className="text-white">SONG TITLE</Label>
                <Input
                  placeholder="Leave empty to auto-generate"
                  value={localConfig.songTitle}
                  onChange={(e) => setLocalConfig({ ...localConfig, songTitle: e.target.value })}
                  className="border-white/10 bg-white/5 text-white placeholder:text-white/30"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-white">AUDIO TAG / GENRE</Label>
                <Input
                  placeholder='e.g., "dark trap", "ethereal pop"'
                  value={localConfig.audioTag}
                  onChange={(e) => setLocalConfig({ ...localConfig, audioTag: e.target.value })}
                  className="border-white/10 bg-white/5 text-white placeholder:text-white/30"
                />
              </div>
            </div>

            <div className="h-px bg-white/10" />

            {/* Structure Controls */}
            <div>
              <h3 className="mb-4 font-semibold text-white">STRUCTURE CONTROLS</h3>

              <div className="grid gap-6 sm:grid-cols-2">
                {/* Verses Slider */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-white/70">Verses</Label>
                    <span className="text-sm text-neon-cyan">{localConfig.verseCount}</span>
                  </div>
                  <Slider
                    value={[localConfig.verseCount]}
                    onValueChange={([v]) => setLocalConfig({ ...localConfig, verseCount: v })}
                    min={0}
                    max={5}
                    step={1}
                    className="[&_[role=slider]]:bg-neon-cyan"
                  />
                </div>

                {/* Bars per Verse Slider */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-white/70">Bars per Verse</Label>
                    <span className="text-sm text-neon-magenta">{localConfig.barsPerVerse}</span>
                  </div>
                  <Slider
                    value={[localConfig.barsPerVerse]}
                    onValueChange={([v]) => setLocalConfig({ ...localConfig, barsPerVerse: v })}
                    min={4}
                    max={32}
                    step={4}
                    className="[&_[role=slider]]:bg-neon-magenta"
                  />
                </div>
              </div>

              {/* Choruses Slider */}
              <div className="mt-6 space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-white/70">Choruses/Hooks (last one = Bridge)</Label>
                  <span className="text-sm text-neon-purple">{localConfig.chorusCount}</span>
                </div>
                <Slider
                  value={[localConfig.chorusCount]}
                  onValueChange={([v]) => setLocalConfig({ ...localConfig, chorusCount: v })}
                  min={0}
                  max={10}
                  step={1}
                  className="[&_[role=slider]]:bg-neon-purple"
                />
                <p className="text-xs text-white/40">
                  {localConfig.chorusCount} ={" "}
                  {localConfig.chorusCount > 1
                    ? `${localConfig.chorusCount - 1} Hook${localConfig.chorusCount > 2 ? "s" : ""} + Bridge`
                    : localConfig.chorusCount === 1
                      ? "Bridge only"
                      : "No hooks"}
                </p>
              </div>
            </div>

            <div className="h-px bg-white/10" />

            {/* Structure Preview */}
            <div className="rounded-xl border border-white/10 bg-white/5 p-4">
              <h4 className="mb-3 text-sm font-medium text-white/70">STRUCTURE PREVIEW:</h4>
              <div className="flex flex-wrap items-center gap-2">
                {structureParts.map((part, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span
                      className={cn(
                        "rounded-full px-3 py-1 text-sm font-medium",
                        part.startsWith("V") && "bg-neon-cyan/20 text-neon-cyan",
                        part === "Hook" && "bg-neon-magenta/20 text-neon-magenta",
                        part === "Bridge" && "bg-neon-purple/20 text-neon-purple",
                      )}
                    >
                      {part}
                    </span>
                    {i < structureParts.length - 1 && <span className="text-white/30">→</span>}
                  </div>
                ))}
              </div>
            </div>

            {/* Generate Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleGenerate}
              disabled={!localConfig.subjectMatter.trim() || isGenerating}
              className={cn(
                "relative w-full overflow-hidden rounded-xl py-4 text-lg font-semibold text-white transition-all",
                !localConfig.subjectMatter.trim() || isGenerating
                  ? "cursor-not-allowed bg-white/10 text-white/50"
                  : "bg-gradient-to-r from-neon-cyan via-neon-purple to-neon-magenta animate-pulse-glow",
              )}
            >
              {isGenerating ? (
                <span>Generating...</span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <Sparkles className="h-5 w-5" />
                  GENERATE LYRICS
                  <Sparkles className="h-5 w-5" />
                </span>
              )}
            </motion.button>

            {/* Progress Bar */}
            {isGenerating && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-2">
                <div className="h-2 overflow-hidden rounded-full bg-white/10">
                  <motion.div
                    className="h-full bg-gradient-to-r from-neon-cyan via-neon-purple to-neon-magenta shimmer"
                    animate={{ width: `${generationProgress}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
                <p className="text-center text-sm text-white/50">
                  {generationProgress}% — {getProgressMessage(generationProgress)}
                </p>
              </motion.div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

function getProgressMessage(progress: number): string {
  if (progress < 30) return "Analyzing musical influence..."
  if (progress < 50) return "Researching style patterns..."
  if (progress < 80) return "Crafting verses and hooks..."
  if (progress < 100) return "Adding finishing touches..."
  return "Complete!"
}

function generateMockLyrics(config: typeof useStore.prototype.aiConfig): string {
  const { subjectMatter, verseCount, barsPerVerse, chorusCount } = config

  let lyrics = `[${config.songTitle || "Untitled Song"}]\n`
  lyrics += `[Audio Tag: ${config.audioTag || "Contemporary Pop"}]\n\n`

  const versePhrases = [
    "In the shadows of the night, I feel your presence fade",
    "Like whispered dreams that float away, memories cascade",
    "Every heartbeat echoes with the words we never said",
    "Dancing with your ghost inside the corners of my head",
    "Neon lights flicker and glow, painting stories untold",
    "In the silence of the dark, these feelings take hold",
    "Running through the city streets where our love once burned",
    "Searching for the pieces of the lessons never learned",
    "Lucky Clover on my mind, blessings in disguise",
    "Fortune favors those who dare to look beyond the lies",
    "Stars align above the skyline, destiny unfolds",
    "Every story worth telling is the one that we both hold",
  ]

  const hookLines = [
    "But you're gone, gone, gone",
    "Like a song, song, song",
    "That I can't get out of my head tonight",
    "No, you're gone, gone, gone",
    "But I'll stay strong, strong, strong",
    "Till the very end",
  ]

  const bridgeLines = [
    "And in this moment, time stands still",
    "The neon lights illuminate what's real",
    "I reach for you through space and time",
    "Knowing that these memories are mine",
    "Lucky Clover showed the way",
    "Through the night into the day",
  ]

  for (let v = 1; v <= verseCount; v++) {
    lyrics += `[Verse ${v}]\n`
    const startIdx = ((v - 1) * 4) % versePhrases.length
    for (let b = 0; b < Math.min(barsPerVerse / 4, 4); b++) {
      const phraseIdx = (startIdx + b) % versePhrases.length
      lyrics += `${versePhrases[phraseIdx]}\n`
    }
    lyrics += `[Instrumental]\n\n`

    if (v <= chorusCount - 1) {
      lyrics += `[Hook]\n`
      lyrics += `${hookLines[0]}\n`
      lyrics += `${hookLines[1]}\n`
      lyrics += `${hookLines[2]}\n`
      lyrics += `[Harmonizing]\n\n`
    }
  }

  if (chorusCount > 0) {
    lyrics += `[Bridge]\n`
    for (const line of bridgeLines) {
      lyrics += `${line}\n`
    }
    lyrics += `[Drop]\n`
    lyrics += `[Instrumental]\n\n`

    lyrics += `[Hook]\n`
    for (const line of hookLines) {
      lyrics += `${line}\n`
    }
    lyrics += `[Harmonizing]\n`
  }

  return lyrics
}
