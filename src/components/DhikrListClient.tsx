"use client";

import { useEffect, useMemo, useState } from "react";
import { Bed, HandHeart, Landmark, Moon, Sun } from "lucide-react";
import { useLocalStorageState } from "@/lib/useLocalStorageState";

type Props = {
  categorySlug: string;
  title: string;
};

type Dhikr = {
  id: string;
  text: string;
  repeat: number;
};

const EMPTY_ITEMS: Dhikr[] = [];

function CategoryIcon({ slug }: { slug: string }) {
  if (slug === "morning") {
    return <Sun width={26} height={26} strokeWidth={1.6} className="text-[var(--accent)]" aria-hidden="true" />;
  }
  if (slug === "evening") {
    return <Moon width={26} height={26} strokeWidth={1.6} className="text-[var(--accent)]" aria-hidden="true" />;
  }
  if (slug === "sleep") {
    return <Bed width={26} height={26} strokeWidth={1.6} className="text-[var(--accent)]" aria-hidden="true" />;
  }
  if (slug === "after-prayer") {
    return <Landmark width={26} height={26} strokeWidth={1.6} className="text-[var(--accent)]" aria-hidden="true" />;
  }
  if (slug === "ruqyah-brief") {
    return (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M7.5 12.5c0 3 2 5.5 4.5 5.5s4.5-2.5 4.5-5.5V9.2c0-1-.8-1.7-1.7-1.7H9.2c-1 0-1.7.8-1.7 1.7v3.3Z"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
        <path
          d="M9 6.5c.6-1.3 1.8-2 3-2s2.4.7 3 2"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      </svg>
    );
  }
  if (slug === "duas") {
    return <HandHeart width={26} height={26} strokeWidth={1.6} className="text-[var(--accent)]" aria-hidden="true" />;
  }
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 2v20M2 12h20" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function clampCount(value: number, max: number) {
  if (!Number.isFinite(value)) return 0;
  if (value < 0) return 0;
  if (value > max) return max;
  return value;
}

export function DhikrListClient({ categorySlug, title }: Props) {
  const [data, setData] = useState<{ slug: string; items: Dhikr[] } | null>(null);
  const [loadError, setLoadError] = useState<{ slug: string; message: string } | null>(null);
  const [favorites, setFavorites] = useLocalStorageState<string[]>("adhkar:favorites", []);
  const [hideCompleted, setHideCompleted] = useLocalStorageState<boolean>(
    `adhkar:hideCompleted:${categorySlug}`,
    true,
  );
  const [progress, setProgress] = useLocalStorageState<Record<string, number>>(
    `adhkar:progress:${categorySlug}`,
    {},
  );

  useEffect(() => {
    let isActive = true;
    const controller = new AbortController();

    fetch(`/api/adhkar/category/${encodeURIComponent(categorySlug)}`, { signal: controller.signal })
      .then(async (res) => {
        if (!res.ok) {
          const text = await res.text().catch(() => "");
          throw new Error(text || `HTTP_${res.status}`);
        }
        return res.json() as Promise<{ items: Dhikr[] }>;
      })
      .then((data) => {
        if (!isActive) return;
        setLoadError(null);
        setData({ slug: categorySlug, items: Array.isArray(data.items) ? data.items : [] });
      })
      .catch((error: unknown) => {
        if (!isActive) return;
        if (error instanceof DOMException && error.name === "AbortError") return;
        setLoadError({ slug: categorySlug, message: "تعذر تحميل الأذكار. حاول مرة ثانية." });
        setData({ slug: categorySlug, items: [] });
      });

    return () => {
      isActive = false;
      controller.abort();
    };
  }, [categorySlug]);

  const isLoading = data?.slug !== categorySlug && loadError?.slug !== categorySlug;
  const items = data?.slug === categorySlug ? data.items : EMPTY_ITEMS;
  const errorMessage = loadError?.slug === categorySlug ? loadError.message : null;

  const totals = useMemo(() => {
    const total = items.reduce((sum, i) => sum + i.repeat, 0);
    const done = items.reduce((sum, i) => {
      const current = clampCount(progress[i.id] ?? 0, i.repeat);
      return sum + current;
    }, 0);
    return { total, done };
  }, [items, progress]);

  const hiddenCompletedCount = useMemo(() => {
    if (!hideCompleted) return 0;
    return items.reduce((count, i) => {
      const current = clampCount(progress[i.id] ?? 0, i.repeat);
      return current >= i.repeat ? count + 1 : count;
    }, 0);
  }, [hideCompleted, items, progress]);

  function toggleFavorite(id: string) {
    setFavorites((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }

  function increment(id: string, max: number) {
    setProgress((prev) => {
      const current = clampCount(prev[id] ?? 0, max);
      const next = clampCount(current + 1, max);
      return { ...prev, [id]: next };
    });
  }

  function resetOne(id: string) {
    setProgress((prev) => {
      if (prev[id] == null) return prev;
      const next = { ...prev };
      delete next[id];
      return next;
    });
  }

  function resetAll() {
    setProgress({});
  }

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-6">
      <div className="rounded-3xl border border-[color:var(--border)] bg-[color:var(--surface)] p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[color:var(--surface-2)] text-[color:var(--accent)]">
            <CategoryIcon slug={categorySlug} />
          </div>
          <div className="min-w-0">
            <h1 className="truncate text-2xl font-semibold">{title}</h1>
            <div className="mt-1 text-sm text-foreground/70">
              التقدّم: {totals.done} / {totals.total}
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="mt-4 rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface-2)] px-4 py-3 text-sm text-foreground/70">
            جاري تحميل الأذكار…
          </div>
        ) : errorMessage ? (
          <div className="mt-4 rounded-2xl border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm text-red-700 dark:text-red-300">
            {errorMessage}
          </div>
        ) : null}

        <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-[color:var(--surface-2)]">
          <div
            className="h-full rounded-full bg-[color:var(--accent)] transition-[width]"
            style={{
              width: totals.total === 0 ? "0%" : `${Math.round((totals.done / totals.total) * 100)}%`,
            }}
          />
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          {hiddenCompletedCount > 0 ? (
            <button
              type="button"
              onClick={() => setHideCompleted(false)}
              className="rounded-full border border-[color:var(--accent)]/30 bg-[color:var(--surface)] px-4 py-2 text-sm text-foreground/80 hover:bg-[color:var(--surface-2)]"
            >
              يوجد {hiddenCompletedCount} مكتمل مخفي • إظهار
            </button>
          ) : null}
          <button
            type="button"
            onClick={() => setHideCompleted((v) => !v)}
            className="rounded-full border border-[color:var(--border)] bg-[color:var(--surface)] px-4 py-2 text-sm text-foreground/80 hover:bg-[color:var(--surface-2)]"
          >
            {hideCompleted ? "إظهار المكتمل" : "إخفاء المكتمل"}
          </button>
          <button
            type="button"
            onClick={resetAll}
            className="rounded-full border border-[color:var(--border)] bg-[color:var(--surface)] px-4 py-2 text-sm text-foreground/80 hover:bg-[color:var(--surface-2)]"
          >
            تصفير الكل
          </button>
        </div>
      </div>

      {!isLoading && totals.total > 0 ? (
        <div className="fixed bottom-24 left-0 right-0 z-30 px-4 sm:hidden">
          <div className="mx-auto w-full max-w-4xl">
            <div className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)]/95 px-4 py-3 shadow-lg backdrop-blur-md">
              <div className="flex items-center justify-between gap-3">
                <div className="text-sm text-foreground/80">
                  التقدّم: {totals.done}/{totals.total}
                </div>
                {hideCompleted && hiddenCompletedCount > 0 ? (
                  <button
                    type="button"
                    onClick={() => setHideCompleted(false)}
                    className="shrink-0 rounded-full border border-[color:var(--accent)]/30 bg-[color:var(--surface)] px-3 py-1 text-xs text-foreground/80 active:scale-95"
                  >
                    إظهار المكتمل
                  </button>
                ) : null}
              </div>
              <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-[color:var(--surface-2)]">
                <div
                  className="h-full rounded-full bg-[color:var(--accent)] transition-[width]"
                  style={{
                    width: totals.total === 0 ? "0%" : `${Math.round((totals.done / totals.total) * 100)}%`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      ) : null}

      <div className="mt-6 grid gap-3">
        {isLoading ? null : items.map((item) => {
          const current = clampCount(progress[item.id] ?? 0, item.repeat);
          const isDone = current >= item.repeat;
          const isFavorite = favorites.includes(item.id);
          if (hideCompleted && isDone) return null;

          return (
            <section
              key={item.id}
              className="rounded-3xl border border-[color:var(--border)] bg-[color:var(--surface)] p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <p className="whitespace-pre-line text-lg leading-9">{item.text}</p>
                  <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-foreground/70">
                    <span className="rounded-full bg-[color:var(--surface-2)] px-3 py-1">
                      المطلوب: {item.repeat}
                    </span>
                    <span
                      className={[
                        "rounded-full px-3 py-1",
                        isDone
                          ? "bg-emerald-600/10 text-emerald-700"
                          : "bg-[color:var(--surface-2)]",
                      ].join(" ")}
                    >
                      الحالي: {current}
                    </span>
                    {isDone ? (
                      <span className="rounded-full bg-emerald-600/10 px-3 py-1 text-emerald-700">
                        مكتمل
                      </span>
                    ) : null}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => toggleFavorite(item.id)}
                  className="shrink-0 rounded-full border border-[color:var(--border)] bg-[color:var(--surface)] px-4 py-2 text-sm text-foreground/80 hover:bg-[color:var(--surface-2)]"
                >
                  {isFavorite ? "إزالة" : "حفظ"}
                </button>
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => increment(item.id, item.repeat)}
                  disabled={isDone}
                  className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-[color:var(--accent)] text-sm font-medium text-white transition-transform active:scale-95 disabled:opacity-40"
                >
                  +1
                </button>
                <button
                  type="button"
                  onClick={() => resetOne(item.id)}
                  className="rounded-full border border-[color:var(--border)] bg-[color:var(--surface)] px-5 py-2.5 text-sm text-foreground/80 hover:bg-[color:var(--surface-2)]"
                >
                  تصفير
                </button>
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
