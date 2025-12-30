import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface LyricFile {
  id: string
  title: string
  content: string
  collectionId?: string
  createdAt: Date
  updatedAt: Date
}

export interface Collection {
  id: string
  name: string
  icon: string
}

export interface Version {
  id: string
  lyricId: string
  versionNumber: number
  content: string
  note: string
  createdAt: Date
}

export interface AIConfig {
  subjectMatter: string
  musicalInfluence: string
  influenceType: "artist" | "band" | "song" | "album" | "genre" | "none"
  songTitle: string
  audioTag: string
  verseCount: number
  barsPerVerse: number
  chorusCount: number
}

export type ThemeName =
  | "minimal"
  | "sakura"
  | "tea-garden"
  | "zen-garden"
  | "tiger-stripes"
  | "psychedelic"
  | "blade-runner"
  | "cyberpunk"

interface AppState {
  // Files & Collections
  files: LyricFile[]
  collections: Collection[]
  currentFileId: string | null
  versions: Version[]

  // Editor state
  cursorPosition: number
  currentWord: string

  // AI Config
  aiConfig: AIConfig

  // User preferences
  isAdult: boolean
  theme: ThemeName

  // UI state
  isAIModalOpen: boolean
  isGenerating: boolean
  generationProgress: number
  isSidebarCollapsed: boolean

  // Actions
  setCurrentFile: (id: string | null) => void
  createFile: (title?: string, content?: string) => string
  updateFile: (id: string, updates: Partial<LyricFile>) => void
  deleteFile: (id: string) => void
  duplicateFile: (id: string) => void

  createCollection: (name: string, icon?: string) => void
  deleteCollection: (id: string) => void
  moveFileToCollection: (fileId: string, collectionId: string | undefined) => void

  saveVersion: (note?: string) => void
  restoreVersion: (versionId: string) => void
  clearVersions: () => void

  setCursorPosition: (pos: number) => void
  setCurrentWord: (word: string) => void

  setAIConfig: (config: Partial<AIConfig>) => void
  setIsAIModalOpen: (open: boolean) => void
  setIsGenerating: (generating: boolean) => void
  setGenerationProgress: (progress: number) => void

  setIsAdult: (adult: boolean) => void
  setTheme: (theme: ThemeName) => void
  setSidebarCollapsed: (collapsed: boolean) => void
}

const defaultAIConfig: AIConfig = {
  subjectMatter: "",
  musicalInfluence: "",
  influenceType: "none",
  songTitle: "",
  audioTag: "",
  verseCount: 2,
  barsPerVerse: 16,
  chorusCount: 3,
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      files: [],
      collections: [
        { id: "heartbreak", name: "Heartbreak Songs", icon: "heart-crack" },
        { id: "club", name: "Club Bangers", icon: "flame" },
        { id: "late-night", name: "Late Night Vibes", icon: "moon" },
      ],
      currentFileId: null,
      versions: [],
      cursorPosition: 0,
      currentWord: "",
      aiConfig: defaultAIConfig,
      isAdult: false,
      theme: "minimal",
      isAIModalOpen: false,
      isGenerating: false,
      generationProgress: 0,
      isSidebarCollapsed: false,

      setCurrentFile: (id) => set({ currentFileId: id }),

      createFile: (title = "Untitled Draft", content = "") => {
        const id = crypto.randomUUID()
        const newFile: LyricFile = {
          id,
          title,
          content,
          createdAt: new Date(),
          updatedAt: new Date(),
        }
        set((state) => ({
          files: [...state.files, newFile],
          currentFileId: id,
        }))
        return id
      },

      updateFile: (id, updates) => {
        set((state) => ({
          files: state.files.map((f) => (f.id === id ? { ...f, ...updates, updatedAt: new Date() } : f)),
        }))
      },

      deleteFile: (id) => {
        set((state) => ({
          files: state.files.filter((f) => f.id !== id),
          currentFileId: state.currentFileId === id ? null : state.currentFileId,
          versions: state.versions.filter((v) => v.lyricId !== id),
        }))
      },

      duplicateFile: (id) => {
        const file = get().files.find((f) => f.id === id)
        if (file) {
          get().createFile(`${file.title} (Copy)`, file.content)
        }
      },

      createCollection: (name, icon = "folder") => {
        const id = crypto.randomUUID()
        set((state) => ({
          collections: [...state.collections, { id, name, icon }],
        }))
      },

      deleteCollection: (id) => {
        set((state) => ({
          collections: state.collections.filter((c) => c.id !== id),
          files: state.files.map((f) => (f.collectionId === id ? { ...f, collectionId: undefined } : f)),
        }))
      },

      moveFileToCollection: (fileId, collectionId) => {
        set((state) => ({
          files: state.files.map((f) => (f.id === fileId ? { ...f, collectionId } : f)),
        }))
      },

      saveVersion: (note) => {
        const { currentFileId, files, versions } = get()
        const file = files.find((f) => f.id === currentFileId)
        if (!file) return

        const fileVersions = versions.filter((v) => v.lyricId === currentFileId)
        const nextVersionNumber = fileVersions.length + 1

        const newVersion: Version = {
          id: crypto.randomUUID(),
          lyricId: currentFileId,
          versionNumber: nextVersionNumber,
          content: file.content,
          note: note || `Version ${nextVersionNumber}`,
          createdAt: new Date(),
        }

        set((state) => ({
          versions: [...state.versions, newVersion],
        }))
      },

      restoreVersion: (versionId) => {
        const version = get().versions.find((v) => v.id === versionId)
        if (!version) return

        get().updateFile(version.lyricId, { content: version.content })
      },

      clearVersions: () => {
        const { currentFileId } = get()
        set((state) => ({
          versions: state.versions.filter((v) => v.lyricId !== currentFileId),
        }))
      },

      setCursorPosition: (pos) => set({ cursorPosition: pos }),
      setCurrentWord: (word) => set({ currentWord: word }),

      setAIConfig: (config) =>
        set((state) => ({
          aiConfig: { ...state.aiConfig, ...config },
        })),

      setIsAIModalOpen: (open) => set({ isAIModalOpen: open }),
      setIsGenerating: (generating) => set({ isGenerating: generating }),
      setGenerationProgress: (progress) => set({ generationProgress: progress }),

      setIsAdult: (adult) => set({ isAdult: adult }),
      setTheme: (theme) => set({ theme }),
      setSidebarCollapsed: (collapsed) => set({ isSidebarCollapsed: collapsed }),
    }),
    {
      name: "lyrical-storage",
      partialize: (state) => ({
        files: state.files,
        collections: state.collections,
        versions: state.versions,
        isAdult: state.isAdult,
        theme: state.theme,
      }),
    },
  ),
)
