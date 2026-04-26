"use client";

import Image from "next/image";
import { createContext, useContext, useEffect, useState } from "react";

type Theme = "beige" | "brown";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("brown");
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem("theme") as string | null;
    const nextTheme: Theme =
      saved === "light" || saved === "beige" ? "beige" : saved === "dark" || saved === "brown" ? "brown" : "brown";
    if (nextTheme !== "brown") {
      window.setTimeout(() => setTheme(nextTheme), 0);
    }
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    document.documentElement.classList.toggle("dark", theme === "brown");
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    if (showSplash) {
      document.documentElement.setAttribute("data-splash", "1");
      return;
    }
    document.documentElement.removeAttribute("data-splash");
  }, [showSplash]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => setShowSplash(false), 1500);
    return () => window.clearTimeout(timeoutId);
  }, []);

  const toggleTheme = () => {
    setTheme((t) => (t === "beige" ? "brown" : "beige"));
  };
  const splashLogoSrc = theme === "brown" ? "/صور/لوغوداكن.png" : "/صور/لوغو.png";

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {showSplash ? (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center">
          <Image
            src={splashLogoSrc}
            alt="شعار التطبيق"
            width={320}
            height={320}
            priority
            className="h-auto w-64 max-w-[80vw] sm:w-80 md:w-96 lg:w-[520px]"
            unoptimized
          />
        </div>
      ) : null}
      <div style={{ visibility: showSplash ? "hidden" : "visible" }}>{children}</div>
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
}
