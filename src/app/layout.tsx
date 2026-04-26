import type { Metadata } from "next";
import Link from "next/link";
import { BookmarkCheck, BookOpen, House } from "lucide-react";
import { Amiri_Quran } from "next/font/google";
import { ThemeProvider } from "@/components/ThemeProvider";
import "./globals.css";

const amiri = Amiri_Quran({
  weight: ["400"],
  subsets: ["arabic"],
  variable: "--font-amiri",
});

export const metadata: Metadata = {
  title: "حصن المسلم - أذكار",
  description: "تطبيق أذكار المسلم من الكتاب والسنة",
  manifest: "/manifest.webmanifest",
  icons: {
    icon: "/favicon.svg",
  },
};

function IslamicCornerDecoration({ position }: { position: string }) {
  const rotation = position === "top-left" ? "0deg" 
    : position === "top-right" ? "90deg" 
    : position === "bottom-right" ? "180deg" 
    : "270deg";
  
  return (
    <div 
      className="pointer-events-none fixed z-50 opacity-20 hidden dark:block"
      style={{
        [position === "top-left" || position === "bottom-left" ? "left" : "right"]: "0",
        [position === "top-left" || position === "top-right" ? "top" : "bottom"]: "0",
        width: "100px",
        height: "100px",
        transform: `rotate(${rotation})`,
      }}
    >
      <svg viewBox="0 0 100 100" fill="none" className="w-full h-full">
        <path 
          d="M0 0 L0 50 Q0 70 20 70 L50 70" 
          stroke="currentColor" 
          strokeWidth="1.5" 
          className="text-[var(--accent)]"
        />
        <path 
          d="M0 0 L0 35 Q0 55 20 55 L35 55" 
          stroke="currentColor" 
          strokeWidth="1" 
          className="text-[var(--accent)]"
        />
        <circle cx="6" cy="6" r="2.5" fill="currentColor" className="text-[var(--accent)]" />
        <circle cx="12" cy="12" r="1.5" fill="currentColor" className="text-[var(--accent)]" />
      </svg>
    </div>
  );
}

function MosqueSilhouette({ className }: { className?: string }) {
  return (
    <svg 
      viewBox="0 0 200 50" 
      fill="none" 
      className={`${className} opacity-5`}
    >
      <path d="M100 5 L100 45 M85 45 L115 45" stroke="currentColor" strokeWidth="0.8" className="text-[var(--accent)]" />
      <path d="M80 45 Q100 28 120 45" stroke="currentColor" strokeWidth="0.8" fill="none" className="text-[var(--accent)]" />
      <circle cx="100" cy="20" r="6" stroke="currentColor" strokeWidth="0.6" fill="none" className="text-[var(--accent)]" />
      <path d="M50 45 Q58 38 66 45" stroke="currentColor" strokeWidth="0.4" fill="none" className="text-[var(--accent)]" />
      <path d="M134 45 Q142 38 150 45" stroke="currentColor" strokeWidth="0.4" fill="none" className="text-[var(--accent)]" />
    </svg>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ar"
      dir="rtl"
      suppressHydrationWarning
      className={`${amiri.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col pb-28 relative">
        <ThemeProvider>
          <IslamicCornerDecoration position="top-left" />
          <IslamicCornerDecoration position="top-right" />
          
          <div className="fixed bottom-0 left-0 right-0 pointer-events-none opacity-10 hidden dark:block">
            <MosqueSilhouette className="w-full h-12" />
          </div>
          
          {children}
          
          <div className="pointer-events-none fixed bottom-0 left-0 right-0 z-20">
            <div className="pointer-events-auto mx-auto w-full max-w-4xl px-4 pb-4">
              <nav className="relative">
                <div className="absolute inset-0 -top-3 h-3 bg-gradient-to-b from-transparent to-[var(--background)] opacity-80" />
                <div className="rounded-3xl border border-[color:var(--border)] bg-[color:var(--surface)]/95 px-4 py-3 shadow-lg backdrop-blur-md">
                  <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-16 h-1 rounded-full bg-[var(--accent)] opacity-30" />
                  <div className="flex items-center justify-around">
                    <Link
                      href="/"
                      className="flex flex-col items-center gap-1.5 text-xs text-foreground/80 transition-all duration-300 hover:text-[var(--accent)]"
                    >
                      <House width={22} height={22} strokeWidth={1.6} aria-hidden="true" />
                      <span>الأذكار</span>
                    </Link>
                    
                    <Link
                      href="/quran"
                      className="flex flex-col items-center gap-1.5 text-xs text-foreground/80 transition-all duration-300 hover:text-[var(--accent)]"
                    >
                      <BookOpen width={22} height={22} strokeWidth={1.6} aria-hidden="true" />
                      <span>القرآن</span>
                    </Link>
                    
                    <Link
                      href="/favorites"
                      className="flex flex-col items-center gap-1.5 text-xs text-foreground/80 transition-all duration-300 hover:text-[var(--accent)]"
                    >
                      <BookmarkCheck width={22} height={22} strokeWidth={1.6} aria-hidden="true" />
                      <span>المفضلة</span>
                    </Link>
                  </div>
                </div>
              </nav>
            </div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
