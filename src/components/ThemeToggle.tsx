"use client";

import { useTheme } from "./ThemeProvider";
import { Moon, Sun } from "lucide-react";

export default function ThemeToggle({ variant = "nav" }: { variant?: "nav" | "compact" }) {
  const { theme, toggleTheme } = useTheme();
  const isBrown = theme === "brown";

  if (variant === "compact") {
    return (
      <button
        type="button"
        onClick={toggleTheme}
        className="group relative inline-flex h-8 w-8 items-center justify-center rounded-full border border-[var(--accent)]/30 bg-gradient-to-r from-[var(--surface)] to-[var(--surface-2)] text-[var(--foreground)] shadow-sm transition-all duration-300 hover:border-[var(--accent)] hover:shadow-md hover:shadow-[var(--accent-glow)] active:scale-95 sm:h-10 sm:w-10"
        aria-label="تبديل الوضع"
      >
        {isBrown ? (
          <Moon width={18} height={18} strokeWidth={1.6} className="text-[var(--accent)] transition-transform duration-300 group-hover:rotate-12" />
        ) : (
          <Sun width={18} height={18} strokeWidth={1.6} className="text-[var(--accent)] transition-transform duration-300 group-hover:rotate-12" />
        )}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="flex flex-col items-center gap-1.5 text-xs text-foreground/80 transition-all duration-300 hover:text-[var(--accent)]"
      aria-label="تبديل المود"
    >
      <div className="relative w-[22px] h-[22px] flex items-center justify-center">
        {isBrown ? (
          <Moon width={22} height={22} strokeWidth={1.6} className="text-[var(--accent)] transition-transform duration-300" />
        ) : (
          <Sun width={22} height={22} strokeWidth={1.6} className="text-[var(--accent)] transition-transform duration-300" />
        )}
      </div>
      <span>{isBrown ? "ليلي" : "نهاري"}</span>
    </button>
  );
}
