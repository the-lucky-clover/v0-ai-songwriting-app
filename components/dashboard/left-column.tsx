"use client"

import type React from "react"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  ChevronDown,
  ChevronRight,
  File,
  Flame,
  Folder,
  HeartCrack,
  Moon,
  MoreHorizontal,
  Plus,
  Trash2,
  Copy,
  FolderInput,
  FileDown,
  FilePlus,
  Sparkles,
  Clock,
  Layers,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useStore } from "@/lib/store"
import { cn } from "@/lib/utils"
import { formatDistanceToNow } from "date-fns"

const smoothSpring = { type: "spring", stiffness: 80, damping: 20 }
const gentleSpring = { type: "spring", stiffness: 50, damping: 15 }

const collectionIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  "heart-crack": HeartCrack,
  flame: Flame,
  moon: Moon,
  folder: Folder,
}

function BentoPanel({
  children,
  className,
  delay = 0,
  glowColor = "cyan",
}: {
  children: React.ReactNode
  className?: string
  delay?: number
  glowColor?: "cyan" | "magenta" | "purple"
}) {
  const glowColors = {
    cyan: { base: "rgba(0, 240, 255, 0.08)", hover: "rgba(0, 240, 255, 0.15)", border: "rgba(0, 240, 255, 0.2)" },
    magenta: { base: "rgba(255, 0, 255, 0.08)", hover: "rgba(255, 0, 255, 0.15)", border: "rgba(255, 0, 255, 0.2)" },
    purple: { base: "rgba(157, 78, 221, 0.08)", hover: "rgba(157, 78, 221, 0.15)", border: "rgba(157, 78, 221, 0.2)" },
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

export function LeftColumn() {
  return (
    <>
      <BentoPanel delay={0.1} glowColor="cyan" className="flex flex-col">
        <FileManagerPanel />
      </BentoPanel>
      <BentoPanel delay={0.15} glowColor="magenta" className="flex flex-col">
        <VersionHistoryPanel />
      </BentoPanel>
      <BentoPanel delay={0.2} glowColor="purple" className="flex-1">
        <QuickActionsPanel />
      </BentoPanel>
    </>
  )
}

function FileManagerPanel() {
  const { files, collections, currentFileId, setCurrentFile, createFile } = useStore()
  const [lyricsExpanded, setLyricsExpanded] = useState(true)
  const [collectionsExpanded, setCollectionsExpanded] = useState(true)
  const [expandedCollections, setExpandedCollections] = useState<Set<string>>(new Set())

  const unorganizedFiles = files.filter((f) => !f.collectionId)

  const toggleCollection = (id: string) => {
    setExpandedCollections((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  return (
    <>
      <div className="flex items-center justify-between border-b border-white/5 px-4 py-3">
        <div className="flex items-center gap-2">
          <motion.div
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY, repeatDelay: 5 }}
          >
            <Folder className="h-4 w-4 text-[#00f0ff]" style={{ filter: "drop-shadow(0 0 8px #00f0ff)" }} />
          </motion.div>
          <span className="font-semibold text-white">Files</span>
        </div>
        <motion.div whileHover={{ scale: 1.1, rotate: 90 }} whileTap={{ scale: 0.9 }} transition={smoothSpring}>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 rounded-lg border border-white/10 bg-white/5 text-white/50 transition-all duration-300 hover:border-[#00f0ff]/50 hover:bg-[#00f0ff]/10 hover:text-[#00f0ff] hover:shadow-[0_0_20px_rgba(0,240,255,0.3)]"
            onClick={() => createFile()}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </motion.div>
      </div>

      <div className="flex-1 overflow-y-auto p-2 scrollbar-thin">
        {/* My Lyrics Section */}
        <div className="mb-2">
          <motion.button
            onClick={() => setLyricsExpanded(!lyricsExpanded)}
            className="flex w-full items-center gap-1 rounded-lg px-2 py-1.5 text-sm text-white/70 transition-all duration-300 hover:bg-white/5"
            whileTap={{ scale: 0.98 }}
          >
            <motion.div animate={{ rotate: lyricsExpanded ? 0 : -90 }} transition={{ duration: 0.3, ease: "easeOut" }}>
              <ChevronDown className="h-4 w-4" />
            </motion.div>
            <Layers className="mr-1 h-4 w-4" />
            MY LYRICS
            <span className="ml-auto text-xs text-white/30">({unorganizedFiles.length})</span>
          </motion.button>
          <AnimatePresence>
            {lyricsExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="overflow-hidden"
              >
                {unorganizedFiles.length === 0 ? (
                  <p className="py-2 pl-8 text-xs text-white/40">No lyrics yet</p>
                ) : (
                  unorganizedFiles.map((file, i) => (
                    <FileItem
                      key={file.id}
                      file={file}
                      isActive={file.id === currentFileId}
                      onClick={() => setCurrentFile(file.id)}
                      index={i}
                    />
                  ))
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Collections Section */}
        <div>
          <motion.button
            onClick={() => setCollectionsExpanded(!collectionsExpanded)}
            className="flex w-full items-center gap-1 rounded-lg px-2 py-1.5 text-sm text-white/70 transition-all duration-300 hover:bg-white/5"
            whileTap={{ scale: 0.98 }}
          >
            <motion.div
              animate={{ rotate: collectionsExpanded ? 0 : -90 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              <ChevronDown className="h-4 w-4" />
            </motion.div>
            <Folder className="mr-1 h-4 w-4" />
            COLLECTIONS
          </motion.button>
          <AnimatePresence>
            {collectionsExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="overflow-hidden"
              >
                {collections.map((collection) => {
                  const Icon = collectionIcons[collection.icon] || Folder
                  const collectionFiles = files.filter((f) => f.collectionId === collection.id)
                  const isExpanded = expandedCollections.has(collection.id)

                  return (
                    <div key={collection.id}>
                      <button
                        onClick={() => toggleCollection(collection.id)}
                        className="flex w-full items-center gap-1 rounded-lg px-2 py-1.5 pl-6 text-sm text-white/60 transition-all duration-300 hover:bg-white/5"
                      >
                        {isExpanded ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
                        <Icon className="mr-1 h-4 w-4" />
                        <span className="flex-1 truncate text-left">{collection.name}</span>
                        <span className="text-xs text-white/40">({collectionFiles.length})</span>
                      </button>
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3, ease: "easeOut" }}
                            className="overflow-hidden pl-4"
                          >
                            {collectionFiles.map((file, i) => (
                              <FileItem
                                key={file.id}
                                file={file}
                                isActive={file.id === currentFileId}
                                onClick={() => setCurrentFile(file.id)}
                                index={i}
                              />
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )
                })}
                <motion.button
                  className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 pl-6 text-sm text-[#00f0ff]/70 transition-all duration-300 hover:bg-[#00f0ff]/5 hover:text-[#00f0ff]"
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Plus className="h-3 w-3" />
                  Create Collection
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </>
  )
}

function FileItem({
  file,
  isActive,
  onClick,
  index,
}: {
  file: { id: string; title: string; updatedAt?: Date }
  isActive: boolean
  onClick: () => void
  index: number
}) {
  const { deleteFile, duplicateFile, collections, moveFileToCollection } = useStore()

  return (
    <motion.div
      initial={{ opacity: 0, x: -15 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.04, ...smoothSpring }}
      whileHover={{ x: 6, backgroundColor: "rgba(255,255,255,0.05)" }}
      className={cn(
        "group relative flex cursor-pointer items-center gap-2 rounded-xl px-2 py-2 pl-8 text-sm transition-all duration-300",
        isActive ? "bg-[#00f0ff]/10 text-white" : "text-white/60 hover:text-white",
      )}
      onClick={onClick}
    >
      {/* Active indicator */}
      {isActive && (
        <motion.div
          layoutId="activeFile"
          className="absolute left-0 top-1/2 h-8 w-1 -translate-y-1/2 rounded-r-full bg-[#00f0ff]"
          style={{ boxShadow: "0 0 12px #00f0ff" }}
          transition={smoothSpring}
        />
      )}

      <File className="h-4 w-4 shrink-0" />
      <span className="flex-1 truncate">{file.title}</span>

      {/* Uploaded time */}
      {file.updatedAt && (
        <span className="text-xs text-white/30 opacity-0 transition-opacity group-hover:opacity-100">
          {formatDistanceToNow(new Date(file.updatedAt), { addSuffix: true })}
        </span>
      )}

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 opacity-0 transition-all duration-200 group-hover:opacity-100"
            onClick={(e) => e.stopPropagation()}
          >
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="border-white/10 bg-black/95 backdrop-blur-xl">
          <DropdownMenuItem onClick={() => duplicateFile(file.id)} className="gap-2">
            <Copy className="h-4 w-4" />
            Duplicate
          </DropdownMenuItem>
          <DropdownMenuSeparator className="bg-white/10" />
          {collections.map((c) => (
            <DropdownMenuItem key={c.id} onClick={() => moveFileToCollection(file.id, c.id)} className="gap-2">
              <FolderInput className="h-4 w-4" />
              Move to {c.name}
            </DropdownMenuItem>
          ))}
          <DropdownMenuSeparator className="bg-white/10" />
          <DropdownMenuItem className="gap-2 text-red-400 focus:text-red-400" onClick={() => deleteFile(file.id)}>
            <Trash2 className="h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </motion.div>
  )
}

function VersionHistoryPanel() {
  const { versions, currentFileId, restoreVersion, clearVersions } = useStore()
  const fileVersions = versions
    .filter((v) => v.lyricId === currentFileId)
    .sort((a, b) => b.versionNumber - a.versionNumber)

  return (
    <>
      <div className="flex items-center justify-between border-b border-white/5 px-4 py-3">
        <div className="flex items-center gap-2">
          <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}>
            <Clock className="h-4 w-4 text-[#ff00ff]" style={{ filter: "drop-shadow(0 0 8px #ff00ff)" }} />
          </motion.div>
          <span className="font-semibold text-white">Version History</span>
        </div>
        {fileVersions.length > 0 && (
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 text-xs text-white/50 transition-colors duration-300 hover:text-red-400"
              onClick={clearVersions}
            >
              Clear
            </Button>
          </motion.div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-3 scrollbar-thin">
        {fileVersions.length === 0 ? (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="py-6 text-center text-sm text-white/40"
          >
            No versions saved yet
          </motion.p>
        ) : (
          <div className="space-y-2">
            {fileVersions.slice(0, 5).map((version, i) => (
              <motion.div
                key={version.id}
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06, ...smoothSpring }}
                whileHover={{ scale: 1.02, x: 4 }}
                className={cn(
                  "group cursor-pointer rounded-xl border p-3 transition-all duration-300",
                  i === 0
                    ? "border-[#00f0ff]/30 bg-[#00f0ff]/5"
                    : "border-white/5 hover:border-white/15 hover:bg-white/5",
                )}
                onClick={() => i !== 0 && restoreVersion(version.id)}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium text-white">
                    v{version.versionNumber} {i === 0 && <span className="text-[#00f0ff]">• Current</span>}
                  </span>
                  <span className="text-xs text-white/40">
                    {formatDistanceToNow(new Date(version.createdAt), { addSuffix: true })}
                  </span>
                </div>
                {i === 0 && (
                  <div className="mt-2 flex items-center gap-1.5 text-xs text-green-400">
                    <motion.span
                      className="h-1.5 w-1.5 rounded-full bg-green-400"
                      animate={{ opacity: [1, 0.4, 1] }}
                      transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                    />
                    Auto-saved
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </>
  )
}

function QuickActionsPanel() {
  const { createFile, currentFileId, duplicateFile, deleteFile, files } = useStore()
  const currentFile = files.find((f) => f.id === currentFileId)

  const exportTxt = () => {
    if (!currentFile) return
    const blob = new Blob([currentFile.content], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${currentFile.title}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <>
      <div className="flex items-center gap-2 border-b border-white/5 px-4 py-3">
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, repeatDelay: 4 }}
        >
          <Sparkles className="h-4 w-4 text-[#9d4edd]" style={{ filter: "drop-shadow(0 0 8px #9d4edd)" }} />
        </motion.div>
        <span className="font-semibold text-white">Quick Actions</span>
      </div>

      <div className="flex flex-col gap-2 p-3">
        <ActionButton icon={FilePlus} label="New Lyric" onClick={() => createFile()} color="cyan" index={0} />
        <ActionButton
          icon={Copy}
          label="Duplicate"
          onClick={() => currentFileId && duplicateFile(currentFileId)}
          disabled={!currentFileId}
          color="magenta"
          index={1}
        />
        <ActionButton
          icon={FileDown}
          label="Export .txt"
          onClick={exportTxt}
          disabled={!currentFileId}
          color="purple"
          index={2}
        />
        <ActionButton
          icon={Trash2}
          label="Delete"
          variant="destructive"
          onClick={() => currentFileId && deleteFile(currentFileId)}
          disabled={!currentFileId}
          index={3}
        />
      </div>
    </>
  )
}

function ActionButton({
  icon: Icon,
  label,
  onClick,
  variant,
  disabled,
  color = "white",
  index = 0,
}: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  onClick: () => void
  variant?: "destructive"
  disabled?: boolean
  color?: "cyan" | "magenta" | "purple" | "white"
  index?: number
}) {
  const colorMap = {
    cyan: {
      border: "border-[#00f0ff]/20",
      hover: "hover:border-[#00f0ff]/50 hover:bg-[#00f0ff]/10 hover:shadow-[0_0_20px_rgba(0,240,255,0.2)]",
      text: "text-[#00f0ff]/80",
      hoverText: "hover:text-[#00f0ff]",
      icon: "#00f0ff",
    },
    magenta: {
      border: "border-[#ff00ff]/20",
      hover: "hover:border-[#ff00ff]/50 hover:bg-[#ff00ff]/10 hover:shadow-[0_0_20px_rgba(255,0,255,0.2)]",
      text: "text-[#ff00ff]/80",
      hoverText: "hover:text-[#ff00ff]",
      icon: "#ff00ff",
    },
    purple: {
      border: "border-[#9d4edd]/20",
      hover: "hover:border-[#9d4edd]/50 hover:bg-[#9d4edd]/10 hover:shadow-[0_0_20px_rgba(157,78,221,0.2)]",
      text: "text-[#9d4edd]/80",
      hoverText: "hover:text-[#9d4edd]",
      icon: "#9d4edd",
    },
    white: {
      border: "border-white/10",
      hover: "hover:border-white/25 hover:bg-white/5",
      text: "text-white/60",
      hoverText: "hover:text-white",
      icon: "#ffffff",
    },
  }

  const colors =
    variant === "destructive"
      ? {
          border: "border-red-500/20",
          hover: "hover:border-red-500/50 hover:bg-red-500/10 hover:shadow-[0_0_20px_rgba(239,68,68,0.2)]",
          text: "text-red-400/70",
          hoverText: "hover:text-red-400",
          icon: "#ef4444",
        }
      : colorMap[color]

  return (
    <motion.button
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05, ...smoothSpring }}
      whileHover={{ x: 6, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "group flex items-center gap-3 rounded-xl border px-4 py-3 text-sm transition-all duration-300",
        colors.border,
        colors.hover,
        colors.text,
        colors.hoverText,
        disabled && "cursor-not-allowed opacity-40",
      )}
    >
      <Icon
        className="h-4 w-4 transition-all duration-300 group-hover:scale-110"
        style={{ filter: disabled ? "none" : `drop-shadow(0 0 4px ${colors.icon})` }}
      />
      {label}
    </motion.button>
  )
}
