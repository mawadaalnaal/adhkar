import Link from "next/link";
import { Bed, HandHeart, Landmark, Moon, Sun } from "lucide-react";
import { TopBar } from "@/components/TopBar";
import { dhikrCategories } from "@/lib/adhkar";

function IslamicStarDecor({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M12 4c-2.8 0-5 2.4-5 5.4 0 3.8 2.6 6 5 7.7 2.4-1.7 5-3.9 5-7.7C17 6.4 14.8 4 12 4Z"
        fill="currentColor"
        className="text-[var(--accent)]"
        fillOpacity="0.18"
      />
      <path
        d="M12 4c-2.8 0-5 2.4-5 5.4 0 3.8 2.6 6 5 7.7 2.4-1.7 5-3.9 5-7.7C17 6.4 14.8 4 12 4Z"
        stroke="currentColor"
        strokeWidth="1.5"
        className="text-[var(--accent)]"
      />
      <circle cx="12" cy="9.2" r="1.2" fill="currentColor" className="text-[var(--accent)]" fillOpacity="0.35" />
      <circle cx="12" cy="12.2" r="1" fill="currentColor" className="text-[var(--accent)]" fillOpacity="0.35" />
      <circle cx="12" cy="15" r="0.9" fill="currentColor" className="text-[var(--accent)]" fillOpacity="0.35" />
      <path d="M12 17.2v2.2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" className="text-[var(--accent)]" />
      <circle cx="12" cy="21" r="1" fill="currentColor" className="text-[var(--foreground)]" fillOpacity="0.7" />
    </svg>
  );
}

function GeometricDivider() {
  return (
    <div className="flex items-center justify-center gap-3 py-2">
      <div className="h-px w-12 bg-gradient-to-r from-transparent to-[var(--accent)]/40" />
      <IslamicStarDecor className="w-5 h-5" />
      <div className="h-px w-12 bg-gradient-to-l from-transparent to-[var(--accent)]/40" />
    </div>
  );
}

function CategoryIcon({ slug }: { slug: string }) {
  if (slug === "morning") {
    return <Sun width={28} height={28} strokeWidth={1.6} className="text-[var(--accent)]" aria-hidden="true" />;
  }
  if (slug === "evening") {
    return <Moon width={28} height={28} strokeWidth={1.6} className="text-[var(--accent)]" aria-hidden="true" />;
  }
  if (slug === "sleep") {
    return <Bed width={28} height={28} strokeWidth={1.6} className="text-[var(--accent)]" aria-hidden="true" />;
  }
  if (slug === "after-prayer") {
    return <Landmark width={28} height={28} strokeWidth={1.6} className="text-[var(--accent)]" aria-hidden="true" />;
  }
  if (slug === "ruqyah-brief") {
    return (
      <svg width="28" height="28" viewBox="0 0 40 40" fill="none" className="relative">
        <path
          d="M20 8L28 14V28L20 34L12 28V14L20 8Z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
          className="text-[var(--accent)]"
        />
        <path
          d="M20 8L28 14V28L20 34L12 28V14L20 8Z"
          fill="currentColor"
          className="text-[var(--accent)]"
          fillOpacity="0.2"
        />
        <path d="M20 8V34M12 14L28 28M28 14L12 28" stroke="currentColor" strokeWidth="1" className="text-[var(--accent)]" opacity="0.5" />
        <circle cx="20" cy="21" r="4" fill="currentColor" className="text-[var(--foreground)]" />
      </svg>
    );
  }
  if (slug === "duas") {
    return <HandHeart width={28} height={28} strokeWidth={1.6} className="text-[var(--accent)]" aria-hidden="true" />;
  }
  return (
    <svg width="28" height="28" viewBox="0 0 40 40" fill="none" className="relative">
      <circle cx="20" cy="20" r="12" stroke="currentColor" strokeWidth="1.5" className="text-[var(--accent)]" />
      <circle cx="20" cy="20" r="6" stroke="currentColor" strokeWidth="1" className="text-[var(--accent)]" />
      <circle cx="20" cy="20" r="2" fill="currentColor" className="text-[var(--foreground)]" />
    </svg>
  );
}

function CategoryCard({ slug, title, count }: { slug: string; title: string; count: number }) {
  return (
    <Link
      href={`/c/${slug}`}
      className="group relative overflow-hidden rounded-3xl border border-[color:var(--border)] bg-[color:var(--surface)] p-5 shadow-md transition-all duration-500 hover:-translate-y-1 hover:border-[var(--accent)]/40 hover:shadow-xl hover:shadow-[var(--accent-glow)]"
    >
      <div className="absolute -right-6 -top-6 h-20 w-20 rounded-full bg-[var(--accent)] opacity-5 blur-xl transition duration-500 group-hover:opacity-10 group-hover:scale-150" />
      
      <div className="relative flex items-center gap-4">
        <div className="relative">
          <div className="absolute -inset-1 rounded-2xl bg-[var(--accent)] opacity-20 blur-sm transition duration-500 group-hover:opacity-40" />
          <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl border border-[var(--accent)]/30 bg-gradient-to-br from-[var(--surface-2)] to-[var(--surface)] shadow-inner transition-all duration-300 group-hover:scale-105">
            <CategoryIcon slug={slug} />
          </div>
        </div>
        
        <div className="min-w-0 flex-1">
          <div className="text-base font-bold text-[var(--foreground)] transition-colors group-hover:text-[var(--accent)]">
            {title}
          </div>
          <div className="mt-1 flex items-center gap-2">
            <span className="rounded-full bg-[var(--surface-2)] px-3 py-0.5 text-xs text-foreground/60">
              {count} ذكر
            </span>
          </div>
        </div>
        
        <div className="opacity-0 transition-all duration-300 group-hover:opacity-100">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-[var(--accent)]">
            <path d="M9 6L15 12L9 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" transform="scale(-1, 1)" />
          </svg>
        </div>
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--accent)]/20 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
    </Link>
  );
}

export default function Home() {
  return (
    <div className="flex min-h-full flex-col font-sans">
      <TopBar />
      <main className="mx-auto w-full max-w-4xl px-4 py-8">
        <div className="relative overflow-hidden rounded-3xl border border-[color:var(--border)] bg-[color:var(--surface)] p-6 shadow-lg">
          <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-[var(--accent)] opacity-5 blur-2xl" />
          <div className="absolute -left-4 -bottom-4 h-20 w-20 rounded-full bg-[var(--accent)] opacity-5 blur-2xl" />
          
          <div className="relative text-center">
            <div className="mb-4 flex items-center justify-center gap-2">
              <div className="h-px w-8 bg-gradient-to-r from-transparent to-[var(--accent)]/40" />
              <IslamicStarDecor className="w-4 h-4" />
              <div className="h-px w-8 bg-gradient-to-l from-transparent to-[var(--accent)]/40" />
            </div>
            
            <div className="text-xs font-medium uppercase tracking-wider text-foreground/50">
              بسم الله الرحمن الرحيم
            </div>
            
            <div className="mt-6 rounded-2xl border border-[var(--accent)]/20 bg-gradient-to-br from-[var(--surface-2)] to-transparent p-8 backdrop-blur-sm">
              <p className="text-xl font-bold leading-relaxed text-[var(--foreground)]">
                فَاذْكُرُونِي أَذْكُرْكُمْ وَاشْكُرُوا لِي وَلَا تَكْفُرُونِ
              </p>
              <div className="mt-4 flex items-center justify-center gap-3">
                <div className="h-px w-6 bg-[var(--accent)]/30" />
                <span className="text-xs text-foreground/50">البقرة • 152</span>
                <div className="h-px w-6 bg-[var(--accent)]/30" />
              </div>
            </div>
            
            <div className="mt-4 flex items-center justify-center gap-2">
              <div className="h-px w-12 bg-gradient-to-r from-transparent to-[var(--accent)]/30" />
              <span className="text-xs text-foreground/40">سُبْحَانَ اللَّهِ وَبِحَمْدِهِ • سُبْحَانَ اللَّهِ الْعَظِيمِ</span>
              <div className="h-px w-12 bg-gradient-to-l from-transparent to-[var(--accent)]/30" />
            </div>
          </div>
        </div>

        <GeometricDivider />

        <div className="flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-lg font-bold">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-[var(--accent)]">
              <path
                d="M12 4c-2.8 0-5 2.4-5 5.4 0 3.8 2.6 6 5 7.7 2.4-1.7 5-3.9 5-7.7C17 6.4 14.8 4 12 4Z"
                fill="currentColor"
                fillOpacity="0.18"
              />
              <path
                d="M12 4c-2.8 0-5 2.4-5 5.4 0 3.8 2.6 6 5 7.7 2.4-1.7 5-3.9 5-7.7C17 6.4 14.8 4 12 4Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinejoin="round"
              />
              <circle cx="12" cy="9.2" r="1.2" fill="currentColor" fillOpacity="0.35" />
              <circle cx="12" cy="12.2" r="1" fill="currentColor" fillOpacity="0.35" />
              <circle cx="12" cy="15" r="0.9" fill="currentColor" fillOpacity="0.35" />
              <path d="M12 17.2v2.2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
              <circle cx="12" cy="21" r="1" fill="currentColor" fillOpacity="0.7" className="text-[var(--foreground)]" />
            </svg>
            الأذكار
          </h2>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-2">
          {dhikrCategories.map((c) => (
            <CategoryCard
              key={c.slug}
              slug={c.slug}
              title={c.title}
              count={c.items.length}
            />
          ))}
        </div>

      </main>
    </div>
  );
}
