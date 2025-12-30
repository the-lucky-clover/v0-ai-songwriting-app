"use client"

import { motion, AnimatePresence } from "framer-motion"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useStore } from "@/lib/store"
import { themes } from "@/lib/themes"
import { cn } from "@/lib/utils"

interface ThemeSelectorProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ThemeSelector({ open, onOpenChange }: ThemeSelectorProps) {
  const { theme, setTheme } = useStore()

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/70 backdrop-blur-xl"
            onClick={() => onOpenChange(false)}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="glass-panel relative z-10 w-full max-w-lg"
          >
            <div className="flex items-center justify-between border-b border-white/5 px-6 py-4">
              <h2 className="text-lg font-semibold text-white">Select Theme</h2>
              <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)}>
                <X className="h-5 w-5" />
              </Button>
            </div>

            <div className="grid grid-cols-4 gap-4 p-6">
              {Object.entries(themes).map(([key, t]) => (
                <motion.button
                  key={key}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setTheme(key as any)
                    setTimeout(() => onOpenChange(false), 300)
                  }}
                  className={cn(
                    "flex flex-col items-center gap-2 rounded-xl border p-3 transition-all duration-300",
                    theme === key ? "border-2 shadow-lg" : "border-white/10 hover:border-white/20 hover:bg-white/5",
                  )}
                  style={{
                    borderColor: theme === key ? t.colors.accent.primary : undefined,
                    boxShadow: theme === key ? `0 0 20px ${t.colors.accent.glow}` : undefined,
                  }}
                >
                  <div className="flex h-12 w-full overflow-hidden rounded-lg">
                    {t.preview.map((color, i) => (
                      <motion.div
                        key={i}
                        className="flex-1 transition-all duration-300"
                        style={{ backgroundColor: color }}
                        initial={false}
                        animate={{ opacity: 1 }}
                      />
                    ))}
                  </div>
                  <span
                    className="text-xs transition-colors duration-300"
                    style={{ color: theme === key ? t.colors.text.primary : "rgba(255, 255, 255, 0.7)" }}
                  >
                    {t.name}
                  </span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
