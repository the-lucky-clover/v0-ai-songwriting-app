"use client"

import type React from "react"
import { useState, useRef } from "react"
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion"
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

export function BentoPanel({
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
  const ref = useRef<HTMLDivElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const rotateX = useTransform(y, [-40, 40], [8, -8])
  const rotateY = useTransform(x, [-40, 40], [-8, 8])

  const glowColors = {
    cyan: "rgba(0, 240, 255, 0.18)",
    magenta: "rgba(255, 0, 255, 0.18)",
    purple: "rgba(157, 78, 221, 0.18)",
    yellow: "rgba(252, 238, 10, 0.18)",
  }

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    const rect = ref.current?.getBoundingClientRect()
    if (!rect) return
    const px = e.clientX - rect.left
    const py = e.clientY - rect.top
    x.set(px - rect.width / 2)
    y.set(py - rect.height / 2)
  }

  function handleMouseLeave() {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay, type: "spring", stiffness: 100, damping: 20 }}
      className={cn(
        "relative overflow-hidden rounded-2xl border border-white/10 will-change-transform",
        className
      )}
      style={{
        background:
          "linear-gradient(180deg, rgba(255,255,255,0.09) 0%, rgba(255,255,255,0.03) 100%)",
        boxShadow: `
          0 8px 32px rgba(0,0,0,0.45),
          0 0 0 2px ${glowColors[glowColor]},
          inset 0 1px 0 rgba(255,255,255,0.10),
          0 0 40px ${glowColors[glowColor]}
        `,
        backdropFilter: "blur(48px) saturate(200%)",
        WebkitBackdropFilter: "blur(48px) saturate(200%)",
        rotateX,
        rotateY,
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Animated gradient border effect */}
      <motion.div
        className="pointer-events-none absolute inset-0 rounded-2xl opacity-60"
        style={{
          background: `linear-gradient(135deg, ${glowColors[glowColor]}, transparent, ${glowColors[glowColor]})`,
          mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          maskComposite: "exclude",
          padding: "1px",
        }}
        animate={{
          backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"],
        }}
        transition={{ duration: 6, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
      />
      {children}
    </motion.div>
  )
}

const collectionIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  "heart-crack": HeartCrack,
  flame: Flame,
  moon: Moon,
  folder: Folder,
}

export function LeftColumn() {
  return (
    <>
      <BentoPanel delay={0.1} glowColor="cyan" className="flex flex-col">
        <FileManagerPanel />
      </BentoPanel>
      <BentoPanel delay={0.2} glowColor="magenta" className="flex flex-col">
        <VersionHistoryPanel />
      </BentoPanel>
      <BentoPanel delay={0.3} glowColor="purple" className="flex-1">
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
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, repeatDelay: 3 }}
          >
            <Folder className="h-4 w-4 text-[#00f0ff]" style={{ filter: "drop-shadow(0 0 6px #00f0ff)" }} />
          </motion.div>
          <span className="font-semibold text-white">Files</span>
        </div>
        <motion.div whileHover={{ scale: 1.1, rotate: 90 }} whileTap={{ scale: 0.9 }}>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 rounded-lg border border-white/10 bg-white/5 text-white/50 hover:border-[#00f0ff]/50 hover:bg-[#00f0ff]/10 hover:text-[#00f0ff]"
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
            className="flex w-full items-center gap-1 rounded-lg px-2 py-1.5 text-sm text-white/70 transition-colors hover:bg-white/5"
            whileTap={{ scale: 0.98 }}
          >
            <motion.div animate={{ rotate: lyricsExpanded ? 0 : -90 }} transition={{ duration: 0.2 }}>
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
                transition={{ duration: 0.2 }}
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
      </div>
    </>
  )
}

function VersionHistoryPanel() {
  return <div>VersionHistoryPanel</div>
}

function QuickActionsPanel() {
  return <div>QuickActionsPanel</div>
}

function FileItem({
  file,
  isActive,
  onClick,
  index,
}: {
  file: any
  isActive: boolean
  onClick: () => void
  index: number
}) {
  const { name, type, createdAt, updatedAt } = file

  return (
    <motion.button
      onClick={onClick}
      className={cn(
        "group flex w-full cursor-pointer items-center rounded-lg p-2 text-sm transition-colors",
        isActive
          ? "bg-white/5 text-white"
          : "text-white/70 hover:bg-white/10 focus:outline-none"
      )}
      layoutId={`file-item-${file.id}`}
      whileTap={{ scale: 0.95 }}
    >
      {/* File icon */}
      <div className="flex-shrink-0">
        {type === "folder" ? (
          <Folder className="h-5 w-5" />
        ) : (
          <File className="h-5 w-5" />
        )}
      </div>
      {/* File details */}
      <div className="flex-1 pl-3">
        <p className="font-medium">{name}</p>
        <p className="text-xs text-white/50">
          {type === "folder"
            ? `${files.filter((f) => f.collectionId === file.id).length} items`
            : `Uploaded ${formatDistanceToNow(new Date(createdAt), { addSuffix: true })}`}
        </p>
      </div>
      {/* Quick actions */}
      <motion.div
        className="flex-shrink-0 opacity-0 transition-opacity group-hover:opacity-100"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 rounded-lg border border-white/10 bg-white/5 p-0 text-white/50 hover:border-[#00f0ff]/50 hover:bg-[#00f0ff]/10 hover:text-[#00f0ff]"
              aria-label="Open actions menu"
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="z-50 w-48 rounded-lg bg-white/5 text-white shadow-lg border border-white/10">
            <DropdownMenuItem className="cursor-pointer" onClick={(e) => e.preventDefault()}>
              <Copy className="mr-3 h-5 w-5" />
              Copy Link
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer" onClick={(e) => e.preventDefault()} disabled>
              <Flame className="mr-3 h-5 w-5" />
              View Analytics
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer text-red-400" onClick={(e) => e.preventDefault()}>
              <Trash2 className="mr-3 h-5 w-5" />
              Delete{" "}
              <span className="text-red-600">(Permanently)</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </motion.div>
    </motion.button>
  )
}
