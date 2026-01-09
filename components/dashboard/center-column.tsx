"use client"

import type React from "react"

import { useEffect, useRef, useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Check, Copy, Pencil, Redo, Trash2, Undo, Music2, Mic, BarChart3 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useStore } from "@/lib/store"
import { countLineSyllables, getStats, getCurrentWord } from "@/lib/syllables"
import { cn } from "@/lib/utils"
import { useDebounce } from "@/hooks/use-debounce"
import { BentoPanel } from "./left-column"

export function CenterColumn() {
  const { files, currentFileId, updateFile, createFile, setCurrentWord, saveVersion } = useStore()

  const currentFile = files.find((f) => f.id === currentFileId)
  const [content, setContent] = useState("")
  const [title, setTitle] = useState("")
  const [isEditingTitle, setIsEditingTitle] = useState(false)
  const [history, setHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [copied, setCopied] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const debouncedContent = useDebounce(content, 2000)

  useEffect(() => {
    if (currentFile) {
      setContent(currentFile.content)
      setTitle(currentFile.title)
      setHistory([currentFile.content])
      setHistoryIndex(0)
    } else {
      setContent("")
      setTitle("")
    }
  }, [currentFileId, currentFile])

  useEffect(() => {
    if (currentFile && debouncedContent !== currentFile.content && debouncedContent.trim()) {
      updateFile(currentFile.id, { content: debouncedContent })
      saveVersion("Auto-saved")
    }
  }, [debouncedContent, currentFile, updateFile, saveVersion])

  const handleContentChange = (newContent: string) => {
    setContent(newContent)
    if (historyIndex < history.length - 1) {
      setHistory([...history.slice(0, historyIndex + 1), newContent])
    } else {
      setHistory([...history, newContent])
    }
    setHistoryIndex(history.length)
  }

  const handleUndo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1)
      setContent(history[historyIndex - 1])
    }
  }

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1)
      setContent(history[historyIndex + 1])
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleClear = () => {
    handleContentChange("")
  }

  const handleTitleSubmit = () => {
    if (currentFile && title.trim()) {
      updateFile(currentFile.id, { title: title.trim() })
    }
    setIsEditingTitle(false)
  }

  const handleCursorChange = useCallback(() => {
    if (textareaRef.current) {
      const pos = textareaRef.current.selectionStart
      const word = getCurrentWord(content, pos)
      setCurrentWord(word)
    }
  }, [content, setCurrentWord])

  useEffect(() => {
    if (!currentFileId && files.length === 0) {
      createFile()
    }
  }, [currentFileId, files.length, createFile])

  const lines = content.split("\n")
  const stats = getStats(content)

  return (
    <div className="flex flex-1 flex-col gap-4">
      <BentoPanel delay={0.1} glowColor="cyan" className="flex flex-1 flex-col">
        {/* Toolbar and Editor Area */}
        <div className="flex flex-col flex-1">
          {/* Toolbar */}
          <div className="flex items-center justify-between border-b border-white/5 px-4 py-2">
            <div className="flex items-center gap-3">
              <motion.div whileHover={{ rotate: 360 }} transition={{ duration: 0.5 }}>
                <Music2 className="h-5 w-5 text-[#00f0ff]" style={{ filter: "drop-shadow(0 0 8px #00f0ff)" }} />
              </motion.div>
              {isEditingTitle ? (
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  onBlur={handleTitleSubmit}
                  onKeyDown={(e) => e.key === "Enter" && handleTitleSubmit()}
                  className="h-7 w-48 border-[#00f0ff]/50 bg-transparent text-sm text-white"
                  autoFocus
                />
              ) : (
                <motion.button
                  onClick={() => setIsEditingTitle(true)}
                  className="flex items-center gap-2 text-sm font-medium text-white transition-colors hover:text-[#00f0ff]"
                  whileHover={{ scale: 1.02 }}
                >
                  {title || "Untitled Draft"}
                  <Pencil className="h-3 w-3 opacity-50" />
                </motion.button>
              )}
            </div>

            <div className="flex items-center gap-1">
              <ToolbarButton icon={Undo} onClick={handleUndo} disabled={historyIndex <= 0} tooltip="Undo" />
              <ToolbarButton
                icon={Redo}
                onClick={handleRedo}
                disabled={historyIndex >= history.length - 1}
                tooltip="Redo"
              />
              <div className="mx-2 h-4 w-px bg-white/10" />
              <ToolbarButton icon={copied ? Check : Copy} onClick={handleCopy} tooltip="Copy" active={copied} />
              <ToolbarButton icon={Trash2} onClick={handleClear} tooltip="Clear" variant="destructive" />
              <div className="mx-2 h-4 w-px bg-white/10" />
              <motion.div
                className="flex items-center gap-1 rounded-lg border border-green-500/30 bg-green-500/10 px-2 py-1 text-xs text-green-400"
                animate={{ opacity: [1, 0.7, 1] }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
              >
                <Check className="h-3 w-3" />
                <span>v{Math.max(1, history.length - 1)}</span>
              </motion.div>
            </div>
          </div>

          {/* Editor Area */}
          <div className="relative flex flex-1 overflow-hidden">
            {/* Line Numbers */}
            <div className="w-14 shrink-0 overflow-hidden border-r border-white/5 bg-black/20 py-4 text-right">
              {lines.map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.01 }}
                  className="h-8 pr-3 font-mono text-sm leading-8 text-white/30"
                >
                  {i + 1}
                </motion.div>
              ))}
            </div>

            {/* Text Area */}
            <div className="relative flex-1 overflow-auto scrollbar-thin">
              <textarea
                ref={textareaRef}
                value={content}
                onChange={(e) => handleContentChange(e.target.value)}
                onSelect={handleCursorChange}
                onClick={handleCursorChange}
                onKeyUp={handleCursorChange}
                placeholder="Start writing your lyrics..."
                className="absolute inset-0 h-full w-full resize-none bg-transparent p-4 font-mono text-lg leading-8 text-white placeholder:text-white/30 focus:outline-none"
                style={{
                  caretColor: "#00f0ff",
                  lineHeight: "2rem",
                }}
                spellCheck={false}
              />
            </div>

            {/* Syllable Count */}
            <div className="w-16 shrink-0 overflow-hidden border-l border-white/5 bg-black/20 py-4 text-center">
              <AnimatePresence mode="popLayout">
                {lines.map((line, i) => {
                  const syllables = countLineSyllables(line)
                  const isSection = /^\[.*\]$/.test(line.trim())

                  return (
                    <motion.div
                      key={`${i}-${syllables}`}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className={cn(
                        "h-8 font-mono text-sm leading-8",
                        syllables > 0 ? "text-[#00f0ff]" : "text-white/20",
                      )}
                      style={syllables > 0 ? { textShadow: "0 0 10px rgba(0,240,255,0.5)" } : {}}
                    >
                      {isSection || syllables === 0 ? "-" : syllables}
                    </motion.div>
                  )
                })}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </BentoPanel>
      <BentoPanel delay={0.2} glowColor="magenta" className="overflow-hidden px-6 py-4">
        {/* Stats Bar */}
        <div className="flex items-center justify-center gap-6 text-sm md:gap-10">
          <StatItem label="Syllables" value={stats.syllables} icon={Mic} color="#00f0ff" />
          <StatDivider />
          <StatItem label="Words" value={stats.words} icon={BarChart3} color="#ff00ff" />
          <StatDivider />
          <StatItem label="Lines" value={stats.lines} icon={BarChart3} color="#9d4edd" />
          <StatDivider />
          <StatItem label="Bars" value={stats.bars} icon={Music2} color="#ff6b9d" />
          <StatDivider />
          <StatItem label="Duration" value={stats.duration} icon={BarChart3} color="#fcee0a" />
        </div>
      </BentoPanel>
    </div>
  )
}

function ToolbarButton({
  icon: Icon,
  onClick,
  disabled,
  tooltip,
  variant,
  active,
}: {
  icon: React.ComponentType<{ className?: string }>
  onClick: () => void
  disabled?: boolean
  tooltip: string
  variant?: "destructive"
  active?: boolean
}) {
  return (
    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
      <Button
        variant="ghost"
        size="icon"
        className={cn(
          "h-8 w-8 rounded-lg border border-transparent transition-all",
          variant === "destructive"
            ? "text-white/50 hover:border-red-500/50 hover:bg-red-500/10 hover:text-red-400"
            : active
              ? "border-green-500/50 bg-green-500/10 text-green-400"
              : "text-white/50 hover:border-white/20 hover:bg-white/5 hover:text-white",
        )}
        onClick={onClick}
        disabled={disabled}
        title={tooltip}
      >
        <Icon className="h-4 w-4" />
      </Button>
    </motion.div>
  )
}

function StatItem({
  label,
  value,
  icon: Icon,
  color,
}: {
  label: string
  value: string | number
  icon: React.ComponentType<{ className?: string }>
  color: string
}) {
  return (
    <motion.div className="flex items-center gap-2" whileHover={{ scale: 1.05 }}>
      <Icon className="h-4 w-4" style={{ color, filter: `drop-shadow(0 0 6px ${color})` }} />
      <span className="text-white/50">{label}:</span>
      <motion.span
        key={value}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="font-semibold"
        style={{ color, textShadow: `0 0 10px ${color}` }}
      >
        {value}
      </motion.span>
    </motion.div>
  )
}

function StatDivider() {
  return <div className="hidden h-4 w-px bg-white/10 md:block" />
}
