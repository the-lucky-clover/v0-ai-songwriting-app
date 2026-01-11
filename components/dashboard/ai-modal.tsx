"use client"

import { useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Sparkles, X, Dna, Search, Brain, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { useStore } from "@/lib/store"
import { cn } from "@/lib/utils"

interface AnalysisData {
  artist: string
  analysis: string
  attributes: {
    emotionalTone: string
    lyricalThemes: string
    writingStyle: string
    rhymePattern: string
    imagery: string
  }
}

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
  } = useStore()

  const [localConfig, setLocalConfig] = useState(aiConfig)
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [error, setError] = useState<string | null>(null)

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
      parts.push("Bridge")
      parts.push("Hook")
    }

    return parts
  }

  // AudioGenetics: Analyze musical influence
  const analyzeInfluence = useCallback(async () => {
    if (!localConfig.musicalInfluence.trim()) return

    setIsAnalyzing(true)
    setError(null)

    try {
      const response = await fetch("/api/audiogenetics/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          artist: localConfig.musicalInfluence,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Analysis failed")
      }

      const data = await response.json()
      setAnalysisData(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to analyze influence")
    } finally {
      setIsAnalyzing(false)
    }
  }, [localConfig.musicalInfluence])

  // AudioGenetics: Generate lyrics with real AI
  const handleGenerate = async () => {
    if (!localConfig.subjectMatter.trim()) return

    setIsGenerating(true)
    setError(null)
    setAIConfig(localConfig)

    const stages = [
      { progress: 15, message: "Initializing AudioGenetics engine..." },
      { progress: 30, message: "Analyzing musical genome..." },
      { progress: 50, message: "Processing lyrical patterns..." },
      { progress: 70, message: "Composing original verses..." },
      { progress: 85, message: "Crafting hooks and bridges..." },
      { progress: 95, message: "Finalizing composition..." },
    ]

    // Animate progress
    const progressInterval = setInterval(() => {
      const currentStage = stages.find((s) => s.progress > generationProgress)
      if (currentStage) {
        setGenerationProgress(currentStage.progress)
      }
    }, 600)

    try {
      const response = await fetch("/api/audiogenetics/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subjectMatter: localConfig.subjectMatter,
          musicalInfluence: localConfig.musicalInfluence,
          mood: localConfig.audioTag,
          verseCount: localConfig.verseCount,
          barsPerVerse: localConfig.barsPerVerse,
          chorusCount: localConfig.chorusCount,
          audioTag: localConfig.audioTag,
          songTitle: localConfig.songTitle,
          analysisData: analysisData?.attributes,
        }),
      })

      clearInterval(progressInterval)

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Generation failed")
      }

      const data = await response.json()
      setGenerationProgress(100)

      // Create or update file with generated lyrics
      if (currentFileId) {
        updateFile(currentFileId, {
          content: data.lyrics,
          title: localConfig.songTitle || "Generated Song",
          musical_influence: localConfig.musicalInfluence,
          subject_matter: localConfig.subjectMatter,
        })
      } else {
        createFile(localConfig.songTitle || "Generated Song", data.lyrics)
      }

      setTimeout(() => {
        setIsGenerating(false)
        setGenerationProgress(0)
        setIsAIModalOpen(false)
      }, 500)
    } catch (err) {
      clearInterval(progressInterval)
      setError(err instanceof Error ? err.message : "Failed to generate lyrics")
      setIsGenerating(false)
      setGenerationProgress(0)
    }
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
              <div className="relative">
                <Dna className="h-6 w-6 text-neon-cyan" />
                <motion.div
                  className="absolute inset-0"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 10, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                >
                  <Sparkles className="h-6 w-6 text-neon-magenta opacity-50" />
                </motion.div>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white">AudioGenetics Studio</h2>
                <p className="text-xs text-white/50">AI-Powered Lyric Composition Engine</p>
              </div>
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
            {/* Error Display */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-400"
              >
                {error}
              </motion.div>
            )}

            {/* Subject Matter */}
            <div className="space-y-2">
              <Label className="text-white">SUBJECT MATTER / MOOD *</Label>
              <Input
                placeholder='e.g., "heartbreak in a neon city" or "finding hope after loss"'
                value={localConfig.subjectMatter}
                onChange={(e) => setLocalConfig({ ...localConfig, subjectMatter: e.target.value })}
                className="border-white/10 bg-white/5 text-white placeholder:text-white/30"
              />
            </div>

            {/* Musical Influence with Analysis */}
            <div className="space-y-2">
              <Label className="text-white">MUSICAL INFLUENCE (optional)</Label>
              <div className="flex gap-2">
                <Input
                  placeholder='e.g., "The Weeknd", "90s hip-hop", "ethereal pop"'
                  value={localConfig.musicalInfluence}
                  onChange={(e) => {
                    setLocalConfig({ ...localConfig, musicalInfluence: e.target.value })
                    setAnalysisData(null)
                  }}
                  className="flex-1 border-white/10 bg-white/5 text-white placeholder:text-white/30"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={analyzeInfluence}
                  disabled={!localConfig.musicalInfluence.trim() || isAnalyzing}
                  className="gap-2 border-neon-cyan/30 bg-neon-cyan/10 text-neon-cyan hover:bg-neon-cyan/20"
                >
                  {isAnalyzing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                  Analyze
                </Button>
              </div>
              <p className="text-xs text-white/40">Click "Analyze" to extract lyrical DNA from your influence</p>
            </div>

            {/* Analysis Results */}
            {analysisData && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="rounded-xl border border-neon-cyan/20 bg-neon-cyan/5 p-4"
              >
                <div className="mb-3 flex items-center gap-2">
                  <Brain className="h-4 w-4 text-neon-cyan" />
                  <span className="text-sm font-medium text-neon-cyan">Musical Genome Extracted</span>
                </div>
                <div className="grid gap-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-white/50">Emotional Tone:</span>
                    <span className="text-white">{analysisData.attributes.emotionalTone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/50">Themes:</span>
                    <span className="text-white">{analysisData.attributes.lyricalThemes}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/50">Style:</span>
                    <span className="text-white">{analysisData.attributes.writingStyle}</span>
                  </div>
                </div>
              </motion.div>
            )}

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
                  : "bg-gradient-to-r from-neon-cyan via-neon-purple to-neon-magenta",
              )}
            >
              {isGenerating ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Generating...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <Dna className="h-5 w-5" />
                  GENERATE WITH AUDIOGENETICS
                  <Dna className="h-5 w-5" />
                </span>
              )}
            </motion.button>

            {/* Progress Bar */}
            {isGenerating && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-2">
                <div className="h-2 overflow-hidden rounded-full bg-white/10">
                  <motion.div
                    className="h-full bg-gradient-to-r from-neon-cyan via-neon-purple to-neon-magenta"
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
  if (progress < 15) return "Initializing AudioGenetics engine..."
  if (progress < 30) return "Analyzing musical genome..."
  if (progress < 50) return "Processing lyrical patterns..."
  if (progress < 70) return "Composing original verses..."
  if (progress < 85) return "Crafting hooks and bridges..."
  if (progress < 100) return "Finalizing composition..."
  return "Complete!"
}
