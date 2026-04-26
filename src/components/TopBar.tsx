"use client";

import Link from "next/link";
import Image from "next/image";
import type { CSSProperties } from "react";
import { useEffect, useState } from "react";
import { Download } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";
import ThemeToggle from "@/components/ThemeToggle";

function GeometricPattern({ className, style }: { className?: string; style?: CSSProperties }) {
  return (
    <svg viewBox="0 0 100 100" fill="none" className={className} style={style}>
      <defs>
        <pattern id="islamic-pattern" x="0" y="0" width="48" height="48" patternUnits="userSpaceOnUse">
          <g className="text-[var(--accent)]" stroke="currentColor" fill="none" strokeLinejoin="round" strokeLinecap="round">
            <path d="M12 0 H36 L48 12 V36 L36 48 H12 L0 36 V12 Z" strokeOpacity="0.10" strokeWidth="1.25" />
            <path d="M24 6 L33 12 L42 24 L33 36 L24 42 L15 36 L6 24 L15 12 Z" strokeOpacity="0.16" strokeWidth="1.25" />
            <path d="M24 10 L31 24 L24 38 L17 24 Z" strokeOpacity="0.20" strokeWidth="1.2" />
          </g>
        </pattern>
      </defs>
      <rect width="100" height="100" fill="url(#islamic-pattern)" />
    </svg>
  );
}

function LogoMark() {
  const { theme } = useTheme();
  const logoSrc = theme === "brown" ? "/صور/لوغوداكن.png" : "/صور/لوغو.png";

  return (
    <Image
      src={logoSrc}
      alt="شعار أذكار"
      width={56}
      height={56}
      className="h-9 w-9 sm:h-12 sm:w-12 object-contain"
      priority
      unoptimized
    />
  );
}

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
};

function InstallAppButton() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isIos] = useState(() => {
    if (typeof window === "undefined") return false;
    return /iPad|iPhone|iPod/.test(window.navigator.userAgent);
  });

  const [isStandalone, setIsStandalone] = useState(() => {
    if (typeof window === "undefined") return false;
    const nav = window.navigator as Navigator & { standalone?: boolean };
    return window.matchMedia?.("(display-mode: standalone)")?.matches === true || nav.standalone === true;
  });

  useEffect(() => {
    const onBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      setDeferredPrompt(event as BeforeInstallPromptEvent);
    };

    const onAppInstalled = () => {
      setDeferredPrompt(null);
      setIsStandalone(true);
    };

    const displayModeMedia = window.matchMedia?.("(display-mode: standalone)");
    const onDisplayModeChange = () => {
      setIsStandalone(displayModeMedia?.matches === true);
    };

    window.addEventListener("beforeinstallprompt", onBeforeInstallPrompt);
    window.addEventListener("appinstalled", onAppInstalled);
    if (displayModeMedia) {
      if (typeof displayModeMedia.addEventListener === "function") {
        displayModeMedia.addEventListener("change", onDisplayModeChange);
      } else {
        displayModeMedia.addListener(onDisplayModeChange);
      }
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstallPrompt);
      window.removeEventListener("appinstalled", onAppInstalled);
      if (displayModeMedia) {
        if (typeof displayModeMedia.removeEventListener === "function") {
          displayModeMedia.removeEventListener("change", onDisplayModeChange);
        } else {
          displayModeMedia.removeListener(onDisplayModeChange);
        }
      }
    };
  }, []);

  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;
    let isActive = true;

    const onControllerChange = () => {
      window.location.reload();
    };

    navigator.serviceWorker.addEventListener("controllerchange", onControllerChange);
    navigator.serviceWorker
      .getRegistration()
      .then((reg) => {
        if (!isActive || !reg) return;

        const applyWaiting = () => {
          if (reg.waiting) {
            reg.waiting.postMessage({ type: "SKIP_WAITING" });
          }
        };

        applyWaiting();
        reg.update().catch(() => null);

        const onUpdateFound = () => {
          const newWorker = reg.installing;
          if (!newWorker) return;
          newWorker.addEventListener("statechange", () => {
            if (newWorker.state === "installed") {
              applyWaiting();
            }
          });
        };

        reg.addEventListener("updatefound", onUpdateFound);

        return () => {
          reg.removeEventListener("updatefound", onUpdateFound);
        };
      })
      .catch(() => null);

    return () => {
      isActive = false;
      navigator.serviceWorker.removeEventListener("controllerchange", onControllerChange);
    };
  }, []);

  const handleInstall = async () => {
    if (isStandalone) return;
    if (deferredPrompt) {
      await deferredPrompt.prompt();
      await deferredPrompt.userChoice.catch(() => null);
      setDeferredPrompt(null);
      return;
    }

    if (isIos) {
      alert("على iPhone/iPad: افتح الموقع من Safari ثم اضغط مشاركة (Share) > إضافة إلى الشاشة الرئيسية.");
      return;
    }

    alert("إذا ما ظهر خيار التثبيت تلقائيًا: افتح قائمة المتصفح (⋮) ثم اختر Install app أو Add to Home screen.");
  };

  if (isStandalone) {
    return (
      <button
        type="button"
        disabled
        className="group relative inline-flex items-center justify-center whitespace-nowrap rounded-full border border-[var(--accent)]/20 bg-gradient-to-r from-[var(--surface)] to-[var(--surface-2)] px-2.5 py-1 text-[11px] text-foreground/60 shadow-sm sm:px-4 sm:py-2 sm:text-sm"
        aria-label="التطبيق مثبت"
      >
        <Download className="mr-1.5 h-3 w-3 text-foreground/50 sm:h-4 sm:w-4" strokeWidth={1.8} aria-hidden="true" />
        <span>مثبت</span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleInstall}
      className="group relative inline-flex items-center justify-center whitespace-nowrap rounded-full border border-[var(--accent)]/30 bg-gradient-to-r from-[var(--surface)] to-[var(--surface-2)] px-2.5 py-1 text-[11px] text-[var(--foreground)] shadow-sm transition-all duration-300 hover:border-[var(--accent)] hover:shadow-md hover:shadow-[var(--accent-glow)] active:scale-95 sm:px-4 sm:py-2 sm:text-sm"
      aria-label="تحميل التطبيق"
    >
      <Download className="mr-1.5 h-3 w-3 text-[var(--accent)] sm:h-4 sm:w-4" strokeWidth={1.8} aria-hidden="true" />
      <span className="text-foreground/90 group-hover:text-[var(--accent)]">
        {deferredPrompt ? "تثبيت" : isIos ? "أضف للشاشة" : "تحميل"}
      </span>
    </button>
  );
}

export function TopBar() {
  return (
    <header className="sticky top-0 z-10 border-b border-[color:var(--border)] bg-[var(--background)]/80 backdrop-blur-xl">
      <div className="relative">
        <div className="absolute inset-0 overflow-hidden">
          <GeometricPattern className="absolute right-0 top-0 h-full w-32 opacity-30" />
          <GeometricPattern className="absolute left-0 top-0 h-full w-32 opacity-30" style={{ transform: "scaleX(-1)" }} />
        </div>
        
        <div className="relative mx-auto flex w-full max-w-4xl items-center justify-between px-3 py-2 sm:px-4 sm:py-3">
          <Link href="/" className="flex items-center gap-2 group">
            <LogoMark />
            <div className="flex flex-col">
              <span className="text-base font-bold tracking-wide text-[var(--foreground)] group-hover:text-[var(--accent)] transition-colors sm:text-lg">
                أذكار
              </span>
              <span className="hidden text-[10px] text-foreground/50 font-normal sm:block">حصن المسلم</span>
            </div>
          </Link>
          
          <div className="flex items-center gap-1">
            <ThemeToggle variant="compact" />
            <InstallAppButton />
          </div>
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--accent)]/20 to-transparent" />
      </div>
    </header>
  );
}
