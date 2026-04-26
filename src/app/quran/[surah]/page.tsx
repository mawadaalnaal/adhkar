"use client";

import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { TopBar } from "@/components/TopBar";

type Ayah = {
  numberInSurah: number;
  text: string;
};

type SurahData = {
  number: number;
  name: string;
  englishName: string;
  numberOfAyahs: number;
  ayahs: Ayah[];
};

type SurahResponse = {
  data: SurahData;
};

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

export default function SurahPage() {
  const params = useParams<{ surah: string }>();
  const router = useRouter();
  const search = useSearchParams();

  const surahNumber = Number(params.surah);
  const pageSize = 10;
  const pageFromQuery = Number(search.get("p") ?? "1");

  const [data, setData] = useState<SurahData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      if (!Number.isFinite(surahNumber) || surahNumber < 1 || surahNumber > 114) {
        setError("رقم السورة غير صحيح.");
        return;
      }

      try {
        setError(null);
        setData(null);
        const res = await fetch(`https://api.alquran.cloud/v1/surah/${surahNumber}/quran-uthmani`);
        if (!res.ok) throw new Error("failed");
        const json = (await res.json()) as SurahResponse;
        if (cancelled) return;
        setData(json.data);
      } catch {
        if (cancelled) return;
        setError("تعذر تحميل السورة من الإنترنت. تأكد من الاتصال وحاول مرة أخرى.");
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [surahNumber]);

  const totalPages = useMemo(() => {
    if (!data) return 1;
    return Math.max(1, Math.ceil(data.ayahs.length / pageSize));
  }, [data]);

  const currentPage = useMemo(() => clamp(Number.isFinite(pageFromQuery) ? pageFromQuery : 1, 1, totalPages), [pageFromQuery, totalPages]);

  const pageAyahs = useMemo(() => {
    if (!data) return [];
    const start = (currentPage - 1) * pageSize;
    return data.ayahs.slice(start, start + pageSize);
  }, [currentPage, data]);

  function goToPage(nextPage: number) {
    const p = clamp(nextPage, 1, totalPages);
    router.replace(`/quran/${surahNumber}?p=${p}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div className="flex min-h-full flex-col font-sans">
      <TopBar />
      <main className="mx-auto w-full max-w-4xl px-4 py-6">
        <div className="flex items-center justify-between gap-3">
          <Link
            href="/quran"
            className="inline-flex items-center rounded-full border border-[color:var(--border)] bg-[color:var(--surface)] px-4 py-2 text-sm text-foreground/80 hover:bg-[color:var(--surface-2)]"
          >
            رجوع للسور
          </Link>

          {data ? (
            <div className="text-sm text-foreground/70">
              صفحة {currentPage} / {totalPages}
            </div>
          ) : null}
        </div>

        {error ? (
          <div className="mt-4 rounded-3xl border border-[color:var(--border)] bg-[color:var(--surface)] p-5 text-sm text-foreground/80">
            {error}
          </div>
        ) : null}

        {!data && !error ? (
          <div className="mt-4 rounded-3xl border border-[color:var(--border)] bg-[color:var(--surface)] p-5 text-sm text-foreground/70">
            جاري تحميل السورة…
          </div>
        ) : null}

        {data ? (
          <>
            <div className="mt-4 rounded-3xl border border-[color:var(--border)] bg-[color:var(--surface)] p-6 shadow-sm">
              <div className="text-center">
                <h1 className="text-2xl font-bold text-[var(--foreground)]">{data.name}</h1>
                <div className="mt-2 text-xs text-foreground/60">
                  {data.numberOfAyahs} آية
                </div>
              </div>

              <div className="mt-6 rounded-3xl border border-[color:var(--border)] bg-[color:var(--card-bg)] p-6">
                <div className="space-y-4 text-[18px] leading-loose text-[var(--foreground)]">
                  {pageAyahs.map((a) => (
                    <div key={a.numberInSurah} className="flex items-start gap-3">
                      <span className="mt-1 inline-flex h-7 min-w-7 items-center justify-center rounded-full border border-[var(--accent)]/30 bg-[color:var(--surface-2)] px-2 text-xs font-bold text-[var(--accent)]">
                        {a.numberInSurah}
                      </span>
                      <p className="flex-1">{a.text}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-5 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage <= 1}
                  className="inline-flex items-center gap-2 rounded-full border border-[color:var(--border)] bg-[color:var(--surface-2)] px-4 py-2 text-sm text-foreground/80 disabled:opacity-50"
                >
                  <ChevronRight width={18} height={18} aria-hidden="true" />
                  السابق
                </button>

                <button
                  type="button"
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage >= totalPages}
                  className="inline-flex items-center gap-2 rounded-full border border-[color:var(--border)] bg-[color:var(--surface-2)] px-4 py-2 text-sm text-foreground/80 disabled:opacity-50"
                >
                  التالي
                  <ChevronLeft width={18} height={18} aria-hidden="true" />
                </button>
              </div>
            </div>
          </>
        ) : null}
      </main>
    </div>
  );
}
