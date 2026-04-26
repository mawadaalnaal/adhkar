"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { BookOpen, FileText, Search } from "lucide-react";
import { TopBar } from "@/components/TopBar";

type Surah = {
  number: number;
  name: string;
  englishName: string;
  numberOfAyahs: number;
  revelationType: "Meccan" | "Medinan";
};

type SurahListResponse = {
  data: Surah[];
};

function revelationLabel(type: Surah["revelationType"]) {
  return type === "Meccan" ? "مكية" : "مدنية";
}

export default function QuranIndexPage() {
  const [surahs, setSurahs] = useState<Surah[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const res = await fetch("https://api.alquran.cloud/v1/surah");
        if (!res.ok) throw new Error("failed");
        const json = (await res.json()) as SurahListResponse;
        if (cancelled) return;
        setSurahs(json.data);
      } catch {
        if (cancelled) return;
        setError("تعذر تحميل السور من الإنترنت. تأكد من الاتصال وحاول مرة أخرى.");
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = useMemo(() => {
    if (!surahs) return null;
    const q = query.trim();
    if (!q) return surahs;
    const normalized = q.replace(/\s+/g, " ");
    return surahs.filter((s) => {
      return (
        String(s.number).includes(normalized) ||
        s.name.includes(normalized) ||
        s.englishName.toLowerCase().includes(normalized.toLowerCase())
      );
    });
  }, [query, surahs]);

  return (
    <div className="flex min-h-full flex-col font-sans">
      <TopBar />
      <main className="mx-auto w-full max-w-4xl px-4 py-6">
        <div className="rounded-3xl border border-[color:var(--border)] bg-[color:var(--surface)] p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[color:var(--surface-2)] text-[color:var(--accent)]">
              <BookOpen width={26} height={26} strokeWidth={1.6} aria-hidden="true" />
            </div>
            <div className="min-w-0">
              <h1 className="text-2xl font-semibold">القرآن الكريم</h1>
              <p className="mt-1 text-sm text-foreground/70">اختر السورة لعرض الآيات داخل التطبيق.</p>
            </div>
          </div>

          <div className="mt-4">
            <div className="flex flex-wrap items-center gap-2">
              <Link
                href="/quran/pages/1"
                className="inline-flex items-center gap-2 rounded-full border border-[var(--accent)]/30 bg-gradient-to-r from-[var(--surface)] to-[var(--surface-2)] px-4 py-2 text-sm text-[var(--foreground)] shadow-sm transition-all duration-300 hover:border-[var(--accent)] hover:shadow-md hover:shadow-[var(--accent-glow)] active:scale-95"
              >
                <FileText width={16} height={16} strokeWidth={1.8} className="text-[var(--accent)]" aria-hidden="true" />
                <span>عرض المصحف (صفحات)</span>
              </Link>
            </div>

            <div className="relative">
              <Search
                width={18}
                height={18}
                aria-hidden="true"
                className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-foreground/50"
              />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="ابحث برقم السورة أو اسمها…"
                className="w-full rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface-2)] px-12 py-3 text-sm text-[var(--foreground)] placeholder:text-foreground/50 focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/30"
              />
            </div>
          </div>
        </div>

        {error ? (
          <div className="mt-4 rounded-3xl border border-[color:var(--border)] bg-[color:var(--surface)] p-5 text-sm text-foreground/80">
            {error}
          </div>
        ) : null}

        {!surahs ? (
          <div className="mt-4 rounded-3xl border border-[color:var(--border)] bg-[color:var(--surface)] p-5 text-sm text-foreground/70">
            جاري تحميل السور…
          </div>
        ) : (
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {(filtered ?? surahs).map((s) => (
              <Link
                key={s.number}
                href={`/quran/${s.number}`}
                className="group relative overflow-hidden rounded-3xl border border-[color:var(--border)] bg-[color:var(--surface)] p-5 shadow-md transition-all duration-500 hover:-translate-y-1 hover:border-[var(--accent)]/40 hover:shadow-xl hover:shadow-[var(--accent-glow)]"
              >
                <div className="absolute -right-6 -top-6 h-20 w-20 rounded-full bg-[var(--accent)] opacity-5 blur-xl transition duration-500 group-hover:opacity-10 group-hover:scale-150" />
                <div className="relative flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[var(--accent)]/20 bg-[color:var(--surface-2)] text-[var(--accent)]">
                    <span className="text-base font-bold">{s.number}</span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-base font-bold text-[var(--foreground)] transition-colors group-hover:text-[var(--accent)]">
                      {s.name}
                    </div>
                    <div className="mt-1 flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-[var(--surface-2)] px-3 py-0.5 text-xs text-foreground/60">
                        {s.numberOfAyahs} آية
                      </span>
                      <span className="rounded-full bg-[var(--surface-2)] px-3 py-0.5 text-xs text-foreground/60">
                        {revelationLabel(s.revelationType)}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--accent)]/20 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
