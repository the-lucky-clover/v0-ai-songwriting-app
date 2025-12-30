"use client"

import type React from "react"

import { useEffect } from "react"
import { useStore } from "@/lib/store"
import { themes } from "@/lib/themes"

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { theme } = useStore()

  useEffect(() => {
    const themeColors = themes[theme].colors
    const root = document.documentElement

    root.style.setProperty("--theme-bg-primary", themeColors.background.primary)
    root.style.setProperty("--theme-bg-secondary", themeColors.background.secondary)
    root.style.setProperty("--theme-bg-tertiary", themeColors.background.tertiary)
    root.style.setProperty("--theme-accent-primary", themeColors.accent.primary)
    root.style.setProperty("--theme-accent-secondary", themeColors.accent.secondary)
    root.style.setProperty("--theme-accent-glow", themeColors.accent.glow)
    root.style.setProperty("--theme-text-primary", themeColors.text.primary)
    root.style.setProperty("--theme-text-secondary", themeColors.text.secondary)
    root.style.setProperty("--theme-text-muted", themeColors.text.muted)
    root.style.setProperty("--theme-border", themeColors.border)
    root.style.setProperty("--theme-glass", themeColors.glass)
  }, [theme])

  return <>{children}</>
}
