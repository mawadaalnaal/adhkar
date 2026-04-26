"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useLocalStorageState } from "@/lib/useLocalStorageState";

type FavoriteEntry = {
  id: string;
  text: string;
  repeat: number;
  category: {
    slug: string;
    title: string;
  };
};

export function FavoritesClient() {
  const [favorites, setFavorites] = useLocalStorageState<string[]>("adhkar:favorites", []);
  const [data, setData] = useState<{ key: string; entries: FavoriteEntry[] } | null>(null);
  const [loadError, setLoadError] = useState<{ key: string; message: string } | null>(null);
  const favoritesKey = favorites.join("|");

  useEffect(() => {
    let isActive = true;
    const controller = new AbortController();

    if (favorites.length === 0) {
      return () => {
        isActive = false;
        controller.abort();
      };
    }

    fetch("/api/adhkar/by-ids", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids: favorites }),
      signal: controller.signal,
    })
      .then(async (res) => {
        if (!res.ok) {
          const text = await res.text().catch(() => "");
          throw new Error(text || `HTTP_${res.status}`);
        }
        return res.json() as Promise<{ entries: FavoriteEntry[] }>;
      })
      .then((data) => {
        if (!isActive) return;
        setLoadError(null);
        setData({ key: favoritesKey, entries: Array.isArray(data.entries) ? data.entries : [] });
      })
      .catch((error: unknown) => {
        if (!isActive) return;
        if (error instanceof DOMException && error.name === "AbortError") return;
        setLoadError({ key: favoritesKey, message: "تعذر تحميل المفضلة. حاول مرة ثانية." });
        setData({ key: favoritesKey, entries: [] });
      });

    return () => {
      isActive = false;
      controller.abort();
    };
  }, [favorites, favoritesKey]);

  function remove(id: string) {
    setFavorites((prev) => prev.filter((x) => x !== id));
  }

  if (favorites.length === 0) {
    return (
      <div className="mx-auto w-full max-w-4xl px-4 py-10">
        <div className="rounded-3xl border border-[color:var(--border)] bg-[color:var(--surface)] p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[color:var(--surface-2)] text-[color:var(--accent)]">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M12 21s-7-4.7-9.3-8.3C1 9.7 2.6 6.9 5.5 6.2c1.8-.4 3.4.3 4.5 1.6 1.1-1.3 2.7-2 4.5-1.6 2.9.7 4.5 3.5 2.8 6.5C19 16.3 12 21 12 21Z"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-semibold">المفضلة</h1>
              <p className="mt-1 text-sm text-foreground/70">ما في عناصر محفوظة لحد الآن.</p>
            </div>
          </div>
        </div>
        <div className="mt-5">
          <Link
            href="/"
            className="inline-flex items-center rounded-full bg-[color:var(--accent)] px-5 py-2.5 text-sm font-medium text-white transition hover:shadow-md"
          >
            رجوع للأقسام
          </Link>
        </div>
      </div>
    );
  }

  const isLoading = data?.key !== favoritesKey && loadError?.key !== favoritesKey;
  const entries = data?.key === favoritesKey ? data.entries : [];
  const errorMessage = loadError?.key === favoritesKey ? loadError.message : null;

  if (isLoading) {
    return (
      <div className="mx-auto w-full max-w-4xl px-4 py-10">
        <div className="rounded-3xl border border-[color:var(--border)] bg-[color:var(--surface)] p-6 shadow-sm">
          <div className="text-sm text-foreground/70">جاري تحميل المفضلة…</div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-6">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold">المفضلة</h1>
        <Link
          href="/"
          className="rounded-full border border-[color:var(--border)] bg-[color:var(--surface)] px-4 py-2 text-sm text-foreground/80 transition hover:bg-[color:var(--surface-2)] hover:shadow-sm"
        >
          الأقسام
        </Link>
      </div>

      {errorMessage ? (
        <div className="mt-4 rounded-2xl border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm text-red-700 dark:text-red-300">
          {errorMessage}
        </div>
      ) : null}

      <div className="mt-6 grid gap-3">
        {entries.map((entry) => (
          <section
            key={entry.id}
            className="rounded-3xl border border-[color:var(--border)] bg-[color:var(--surface)] p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <p className="whitespace-pre-line text-lg leading-9">{entry.text}</p>
                <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-foreground/70">
                  <span className="rounded-full bg-[color:var(--surface-2)] px-3 py-1">
                    التكرار: {entry.repeat}
                  </span>
                  <Link
                    href={`/c/${entry.category.slug}`}
                    className="rounded-full bg-[color:var(--surface-2)] px-3 py-1 transition hover:bg-[color:var(--accent)] hover:text-white"
                  >
                    {entry.category.title}
                  </Link>
                </div>
              </div>

              <button
                type="button"
                onClick={() => remove(entry.id)}
                className="shrink-0 rounded-full border border-[color:var(--border)] bg-[color:var(--surface)] px-4 py-2 text-sm text-foreground/80 transition hover:bg-[color:var(--surface-2)] hover:shadow-sm"
              >
                إزالة
              </button>
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
