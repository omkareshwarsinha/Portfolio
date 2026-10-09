import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { ThemeCustomization } from "../types";

export type Theme = "dark" | "light";

export const THEME_PRESETS: Record<string, ThemeCustomization> = {
  "google-flow": {
    preset: "google-flow",
    primaryColor: "#00F0FF",
    secondaryColor: "#8B5CF6",
    accentGlow: "#38BDF8",
    bgDark: "#050811",
    bgLight: "#F8FAFC",
    cardBg: "rgba(12, 17, 28, 0.85)",
    glowIntensity: "vibrant",
    flowSpeed: "normal",
    enableFlowShaders: true,
  },
  "deepmind-sapphire": {
    preset: "deepmind-sapphire",
    primaryColor: "#38BDF8",
    secondaryColor: "#6366F1",
    accentGlow: "#0284C7",
    bgDark: "#060B19",
    bgLight: "#F0F4F8",
    cardBg: "rgba(10, 18, 36, 0.85)",
    glowIntensity: "vibrant",
    flowSpeed: "normal",
    enableFlowShaders: true,
  },
  "cyber-emerald": {
    preset: "cyber-emerald",
    primaryColor: "#10B981",
    secondaryColor: "#06B6D4",
    accentGlow: "#34D399",
    bgDark: "#030806",
    bgLight: "#F2F9F5",
    cardBg: "rgba(6, 20, 15, 0.85)",
    glowIntensity: "intense",
    flowSpeed: "normal",
    enableFlowShaders: true,
  },
  "nebula-sunset": {
    preset: "nebula-sunset",
    primaryColor: "#F43F5E",
    secondaryColor: "#F59E0B",
    accentGlow: "#FB7185",
    bgDark: "#0D0714",
    bgLight: "#FFF5F5",
    cardBg: "rgba(22, 12, 28, 0.85)",
    glowIntensity: "vibrant",
    flowSpeed: "normal",
    enableFlowShaders: true,
  },
  "amethyst-void": {
    preset: "amethyst-void",
    primaryColor: "#C084FC",
    secondaryColor: "#E879F9",
    accentGlow: "#A855F7",
    bgDark: "#0A0612",
    bgLight: "#FAF5FF",
    cardBg: "rgba(18, 10, 30, 0.85)",
    glowIntensity: "vibrant",
    flowSpeed: "normal",
    enableFlowShaders: true,
  },
  "titanium-platinum": {
    preset: "titanium-platinum",
    primaryColor: "#E2E8F0",
    secondaryColor: "#38BDF8",
    accentGlow: "#FFFFFF",
    bgDark: "#090D14",
    bgLight: "#F8FAFC",
    cardBg: "rgba(15, 23, 42, 0.85)",
    glowIntensity: "subtle",
    flowSpeed: "slow",
    enableFlowShaders: true,
  },
};

const DEFAULT_CUSTOMIZATION: ThemeCustomization = THEME_PRESETS["google-flow"];

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
  customization: ThemeCustomization;
  updateCustomization: (updates: Partial<ThemeCustomization>) => void;
  setPreset: (presetKey: string) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: "dark",
  toggleTheme: () => {},
  setTheme: () => {},
  customization: DEFAULT_CUSTOMIZATION,
  updateCustomization: () => {},
  setPreset: () => {},
});

export const ThemeProvider: React.FC<{
  children: React.ReactNode;
  initialCustomization?: ThemeCustomization;
}> = ({ children, initialCustomization }) => {
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window !== "undefined") {
      const userSelected = localStorage.getItem("om_theme_user_selected");
      if (userSelected === "true") {
        const saved = localStorage.getItem("om_theme") as Theme | null;
        if (saved === "light" || saved === "dark") {
          return saved;
        }
      }
      return "dark"; // Default to dark mode
    }
    return "dark";
  });

  const [customization, setCustomization] = useState<ThemeCustomization>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("om_theme_customization");
        if (saved) {
          const parsed = JSON.parse(saved);
          return { ...DEFAULT_CUSTOMIZATION, ...parsed };
        }
      } catch {}
    }
    return initialCustomization || DEFAULT_CUSTOMIZATION;
  });

  // Apply CSS Variables directly onto document root
  const applyCSSVariables = useCallback((config: ThemeCustomization, currentTheme: Theme) => {
    if (typeof document === "undefined") return;
    const root = document.documentElement;

    const primary = config.primaryColor || "#00F0FF";
    const secondary = config.secondaryColor || "#8B5CF6";
    const glow = config.accentGlow || primary;
    const bgDark = config.bgDark || "#050811";
    const bgLight = config.bgLight || "#F8FAFC";
    const cardBg = config.cardBg || (currentTheme === "dark" ? "rgba(12, 17, 28, 0.85)" : "rgba(255, 255, 255, 0.9)");

    root.style.setProperty("--theme-primary", primary);
    root.style.setProperty("--theme-secondary", secondary);
    root.style.setProperty("--theme-glow", glow);
    root.style.setProperty("--theme-bg", currentTheme === "dark" ? bgDark : bgLight);
    root.style.setProperty("--theme-card", cardBg);
    root.style.setProperty(
      "--theme-gradient",
      `linear-gradient(135deg, ${primary} 0%, ${secondary} 100%)`
    );
    root.style.setProperty(
      "--theme-glow-shadow",
      `0 0 40px -10px ${primary}40, 0 0 20px -5px ${secondary}30`
    );
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
      root.classList.remove("light");
    } else {
      root.classList.remove("dark");
      root.classList.add("light");
    }
    localStorage.setItem("om_theme", theme);
    applyCSSVariables(customization, theme);
  }, [theme, customization, applyCSSVariables]);

  const toggleTheme = () => {
    setThemeState((prev) => {
      const next = prev === "dark" ? "light" : "dark";
      localStorage.setItem("om_theme", next);
      localStorage.setItem("om_theme_user_selected", "true");
      return next;
    });
  };

  const setTheme = (t: Theme) => {
    setThemeState(t);
    localStorage.setItem("om_theme", t);
    localStorage.setItem("om_theme_user_selected", "true");
  };

  const updateCustomization = (updates: Partial<ThemeCustomization>) => {
    setCustomization((prev) => {
      const next = { ...prev, ...updates };
      try {
        localStorage.setItem("om_theme_customization", JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  const setPreset = (presetKey: string) => {
    const preset = THEME_PRESETS[presetKey];
    if (preset) {
      setCustomization(preset);
      try {
        localStorage.setItem("om_theme_customization", JSON.stringify(preset));
      } catch {}
    }
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        toggleTheme,
        setTheme,
        customization,
        updateCustomization,
        setPreset,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
