"use client"

import type React from "react"
import { useEffect, useRef, useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Check, Copy, Pencil, Redo, Trash2, Undo, Music2, Mic, BarChart3, Timer } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useStore } from "@/lib/store"
import { countLineSyllables, getStats, getCurrentWord } from "@/lib/syllables"
import { cn } from "@/lib/utils"
import { useDebounce } from "@/hooks/use-debounce"

const smoothSpring = { type: "spring", stiffness: 80, damping: 20 }

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
    <div className="flex flex-1 flex-col gap-3 md:gap-4">
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={smoothSpring}
        className="group/editor relative flex flex-1 flex-col overflow-hidden rounded-2xl"
      >
        {/* Background */}
        <div
          className="absolute inset-0"
          style={{
            background: `
              linear-gradient(180deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.02) 100%),
              linear-gradient(135deg, rgba(0,240,255,0.05) 0%, transparent 50%)
            `,
            backdropFilter: "blur(40px) saturate(180%)",
          }}
        />

        <div
          className="absolute inset-0 rounded-2xl"
          style={{
            boxShadow: `
              inset 0 0 0 1px rgba(255,255,255,0.08),
              0 8px 40px rgba(0,0,0,0.4),
              0 0 60px rgba(0,240,255,0.08)
            `,
          }}
        />

        <div
          className="absolute inset-x-0 top-0 h-px"
          style={{
            background: "linear-gradient(90deg, transparent, rgba(0,240,255,0.3), transparent)",
          }}
        />

        <div className="relative flex flex-1 flex-col">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/5 px-3 py-2 md:px-4 md:py-3">
            <div className="flex items-center gap-2 md:gap-3">
              <Music2
                className="h-4 w-4 text-[#00f0ff] md:h-5 md:w-5"
                style={{ filter: "drop-shadow(0 0 10px #00f0ff)" }}
              />
              {isEditingTitle ? (
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  onBlur={handleTitleSubmit}
                  onKeyDown={(e) => e.key === "Enter" && handleTitleSubmit()}
                  className="h-7 w-36 border-[#00f0ff]/50 bg-black/30 text-sm text-white focus:border-[#00f0ff] md:h-8 md:w-52"
                  autoFocus
                />
              ) : (
                <button
                  onClick={() => setIsEditingTitle(true)}
                  className="group/title flex items-center gap-2 rounded-lg px-2 py-1 text-sm font-medium text-white transition-all duration-300 hover:bg-white/5"
                >
                  <span className="max-w-[120px] truncate md:max-w-none">{title || "Untitled Draft"}</span>
                  <Pencil className="h-3 w-3 opacity-0 transition-opacity group-hover/title:opacity-50" />
                </button>
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
              <div className="mx-1 hidden h-5 w-px bg-white/10 md:mx-2 md:block" />
              <ToolbarButton icon={copied ? Check : Copy} onClick={handleCopy} tooltip="Copy" active={copied} />
              <ToolbarButton icon={Trash2} onClick={handleClear} tooltip="Clear" variant="destructive" />
              <div className="mx-1 hidden h-5 w-px bg-white/10 md:mx-2 md:block" />

              <motion.div
                className="hidden items-center gap-1.5 rounded-lg border border-green-500/30 bg-green-500/10 px-2 py-1 text-xs text-green-400 md:flex md:px-3 md:py-1.5"
                animate={{
                  boxShadow: [
                    "0 0 10px rgba(34,197,94,0.2)",
                    "0 0 20px rgba(34,197,94,0.3)",
                    "0 0 10px rgba(34,197,94,0.2)",
                  ],
                }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
              >
                <motion.div
                  className="h-1.5 w-1.5 rounded-full bg-green-400"
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
                />
                <span className="font-medium">v{Math.max(1, history.length - 1)}</span>
              </motion.div>
            </div>
          </div>

          {/* Editor Area */}
          <div className="relative flex flex-1 overflow-hidden">
            {/* Line Numbers */}
            <div className="w-10 shrink-0 overflow-hidden border-r border-white/5 bg-black/20 py-3 text-right md:w-14 md:py-4">
              {lines.map((_, i) => (
                <div
                  key={i}
                  className="h-7 pr-2 font-mono text-xs leading-7 text-white/25 md:h-8 md:pr-3 md:text-sm md:leading-8"
                >
                  {i + 1}
                </div>
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
                className="absolute inset-0 h-full w-full resize-none bg-transparent p-3 font-mono text-base leading-7 text-white placeholder:text-white/25 focus:outline-none md:p-4 md:text-lg md:leading-8"
                style={{
                  caretColor: "#00f0ff",
                }}
                spellCheck={false}
              />
            </div>

            {/* Syllable Count Column */}
            <div className="w-12 shrink-0 overflow-hidden border-l border-white/5 bg-black/20 py-3 text-center md:w-16 md:py-4">
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
                      transition={{ duration: 0.2 }}
                      className={cn(
                        "h-7 font-mono text-xs leading-7 transition-all duration-300 md:h-8 md:text-sm md:leading-8",
                        syllables > 0 ? "text-[#00f0ff]" : "text-white/15",
                      )}
                      style={syllables > 0 ? { textShadow: "0 0 12px rgba(0,240,255,0.6)" } : {}}
                    >
                      {isSection || syllables === 0 ? "—" : syllables}
                    </motion.div>
                  )
                })}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, ...smoothSpring }}
        className="relative overflow-hidden rounded-2xl"
      >
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(180deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)",
            backdropFilter: "blur(40px)",
          }}
        />

        <div
          className="absolute inset-0 rounded-2xl"
          style={{
            boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.06), 0 4px 24px rgba(0,0,0,0.25)",
          }}
        />

        <div className="relative flex flex-wrap items-center justify-center gap-3 px-4 py-3 md:gap-6 md:px-6 md:py-4">
          <StatItem label="Syllables" value={stats.syllables} icon={Mic} color="#00f0ff" />
          <StatDivider />
          <StatItem label="Words" value={stats.words} icon={BarChart3} color="#ff00ff" />
          <StatDivider />
          <StatItem label="Lines" value={stats.lines} icon={BarChart3} color="#9d4edd" />
          <StatDivider className="hidden md:block" />
          <StatItem label="Bars" value={stats.bars} icon={Music2} color="#ff6b9d" className="hidden md:flex" />
          <StatDivider className="hidden md:block" />
          <StatItem label="Duration" value={stats.duration} icon={Timer} color="#fcee0a" className="hidden md:flex" />
        </div>
      </motion.div>
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
    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} transition={smoothSpring}>
      <Button
        variant="ghost"
        size="icon"
        className={cn(
          "h-7 w-7 rounded-lg border border-transparent transition-all duration-300 md:h-8 md:w-8",
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
        <Icon className="h-3.5 w-3.5 md:h-4 md:w-4" />
      </Button>
    </motion.div>
  )
}

function StatItem({
  label,
  value,
  icon: Icon,
  color,
  className,
}: {
  label: string
  value: string | number
  icon: React.ComponentType<{ className?: string }>
  color: string
  className?: string
}) {
  return (
    <div className={cn("flex items-center gap-1.5 md:gap-2", className)}>
      <Icon className="h-3.5 w-3.5 md:h-4 md:w-4" style={{ color, filter: `drop-shadow(0 0 8px ${color})` }} />
      <span className="text-xs text-white/50 md:text-sm">{label}:</span>
      <motion.span
        key={String(value)}
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="text-xs font-semibold md:text-sm"
        style={{ color, textShadow: `0 0 12px ${color}` }}
      >
        {value}
      </motion.span>
    </div>
  )
}

function StatDivider({ className }: { className?: string }) {
  return <div className={cn("h-4 w-px bg-white/10 md:h-5", className)} />
}
