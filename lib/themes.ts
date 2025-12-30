export type ThemeName =
  | "minimal"
  | "sakura"
  | "tea-garden"
  | "zen-garden"
  | "tiger-stripes"
  | "psychedelic"
  | "blade-runner"
  | "cyberpunk"

export interface ThemeColors {
  background: {
    primary: string
    secondary: string
    tertiary: string
  }
  accent: {
    primary: string
    secondary: string
    glow: string
  }
  text: {
    primary: string
    secondary: string
    muted: string
  }
  border: string
  glass: string
}

export const themes: Record<ThemeName, { name: string; colors: ThemeColors; preview: string[] }> = {
  minimal: {
    name: "Minimal",
    preview: ["#0a0a1e", "#9d4edd", "#00f0ff"],
    colors: {
      background: {
        primary: "#0a0a1e",
        secondary: "#050510",
        tertiary: "#0a0520",
      },
      accent: {
        primary: "#00f0ff",
        secondary: "#9d4edd",
        glow: "rgba(0, 240, 255, 0.4)",
      },
      text: {
        primary: "#ffffff",
        secondary: "#e0e0e0",
        muted: "#808080",
      },
      border: "rgba(255, 255, 255, 0.08)",
      glass: "rgba(10, 10, 30, 0.85)",
    },
  },
  sakura: {
    name: "Sakura",
    preview: ["#2d1f3d", "#ff6b9d", "#ffb7c5"],
    colors: {
      background: {
        primary: "#2d1f3d",
        secondary: "#1a0f26",
        tertiary: "#3d2550",
      },
      accent: {
        primary: "#ff6b9d",
        secondary: "#ffb7c5",
        glow: "rgba(255, 107, 157, 0.4)",
      },
      text: {
        primary: "#ffe8f0",
        secondary: "#ffd4e5",
        muted: "#d4a5b8",
      },
      border: "rgba(255, 183, 197, 0.15)",
      glass: "rgba(45, 31, 61, 0.85)",
    },
  },
  "tea-garden": {
    name: "Tea Garden",
    preview: ["#0d1f0d", "#2d5a2d", "#4a9f4a"],
    colors: {
      background: {
        primary: "#0d1f0d",
        secondary: "#081208",
        tertiary: "#152d15",
      },
      accent: {
        primary: "#4a9f4a",
        secondary: "#6fcc6f",
        glow: "rgba(74, 159, 74, 0.4)",
      },
      text: {
        primary: "#e8ffe8",
        secondary: "#c5f0c5",
        muted: "#7a9f7a",
      },
      border: "rgba(74, 159, 74, 0.15)",
      glass: "rgba(13, 31, 13, 0.85)",
    },
  },
  "zen-garden": {
    name: "Zen Garden",
    preview: ["#2a2520", "#8b7355", "#c4b79c"],
    colors: {
      background: {
        primary: "#2a2520",
        secondary: "#1a1510",
        tertiary: "#3a3530",
      },
      accent: {
        primary: "#c4b79c",
        secondary: "#d9cdb8",
        glow: "rgba(196, 183, 156, 0.4)",
      },
      text: {
        primary: "#f5f0e8",
        secondary: "#e0d5c5",
        muted: "#9f8f75",
      },
      border: "rgba(196, 183, 156, 0.15)",
      glass: "rgba(42, 37, 32, 0.85)",
    },
  },
  "tiger-stripes": {
    name: "Tiger Stripes",
    preview: ["#1a0a00", "#ff6b00", "#ffa500"],
    colors: {
      background: {
        primary: "#1a0a00",
        secondary: "#0f0500",
        tertiary: "#2a1500",
      },
      accent: {
        primary: "#ff6b00",
        secondary: "#ffa500",
        glow: "rgba(255, 107, 0, 0.4)",
      },
      text: {
        primary: "#fff5e8",
        secondary: "#ffe0c5",
        muted: "#d4a580",
      },
      border: "rgba(255, 165, 0, 0.15)",
      glass: "rgba(26, 10, 0, 0.85)",
    },
  },
  psychedelic: {
    name: "Psychedelic",
    preview: ["#1a001a", "#ff00ff", "#00ffff"],
    colors: {
      background: {
        primary: "#1a001a",
        secondary: "#0f000f",
        tertiary: "#2a002a",
      },
      accent: {
        primary: "#ff00ff",
        secondary: "#00ffff",
        glow: "rgba(255, 0, 255, 0.4)",
      },
      text: {
        primary: "#ffe8ff",
        secondary: "#e8ffff",
        muted: "#d4a5d4",
      },
      border: "rgba(255, 0, 255, 0.15)",
      glass: "rgba(26, 0, 26, 0.85)",
    },
  },
  "blade-runner": {
    name: "Blade Runner",
    preview: ["#0a0f14", "#ff6b35", "#00d4aa"],
    colors: {
      background: {
        primary: "#0a0f14",
        secondary: "#050810",
        tertiary: "#0f1820",
      },
      accent: {
        primary: "#ff6b35",
        secondary: "#00d4aa",
        glow: "rgba(255, 107, 53, 0.4)",
      },
      text: {
        primary: "#e8f5ff",
        secondary: "#c5e8f0",
        muted: "#80a5b8",
      },
      border: "rgba(0, 212, 170, 0.15)",
      glass: "rgba(10, 15, 20, 0.85)",
    },
  },
  cyberpunk: {
    name: "Cyberpunk",
    preview: ["#0a0a00", "#fcee0a", "#ff00ff"],
    colors: {
      background: {
        primary: "#0a0a00",
        secondary: "#050500",
        tertiary: "#151500",
      },
      accent: {
        primary: "#fcee0a",
        secondary: "#ff00ff",
        glow: "rgba(252, 238, 10, 0.4)",
      },
      text: {
        primary: "#ffffe8",
        secondary: "#ffe8ff",
        muted: "#d4d480",
      },
      border: "rgba(252, 238, 10, 0.15)",
      glass: "rgba(10, 10, 0, 0.85)",
    },
  },
}
