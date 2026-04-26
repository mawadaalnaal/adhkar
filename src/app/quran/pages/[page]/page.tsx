import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { TopBar } from "@/components/TopBar";

type Verse = {
  id: number;
  verse_number: number;
  verse_key: string;
  text_uthmani: string;
  page_number: number;
  juz_number: number;
};

type ByPageResponse = {
  verses: Verse[];
};

type Props = {
  params: Promise<{ page: string }>;
};

function parsePage(raw: string) {
  const n = Number(raw);
  if (!Number.isFinite(n)) return null;
  const i = Math.trunc(n);
  if (i < 1 || i > 604) return null;
  return i;
}

export default async function QuranMushafPage({ params }: Props) {
  const { page } = await params;
  const pageNumber = parsePage(page);
  if (!pageNumber) notFound();

  const res = await fetch(
    `https://api.quran.com/api/v4/verses/by_page/${pageNumber}?language=ar&words=false&fields=text_uthmani,page_number,juz_number,verse_key,verse_number`,
    { next: { revalidate: 60 * 60 * 24 } },
  );

  if (!res.ok) {
    return (
      <div className="flex min-h-full flex-col font-sans">
        <TopBar />
        <main className="mx-auto w-full max-w-4xl px-4 py-6">
          <div className="rounded-3xl border border-[color:var(--border)] bg-[color:var(--surface)] p-5 text-sm text-foreground/80">
            تعذر تحميل الصفحة من الإنترنت. تأكد من الاتصال وحاول مرة أخرى.
          </div>
        </main>
      </div>
    );
  }

  const json = (await res.json()) as ByPageResponse;
  const verses = json.verses ?? [];
  if (verses.length === 0) notFound();

  const juz = verses[0]?.juz_number;
  const prevPage = pageNumber > 1 ? pageNumber - 1 : null;
  const nextPage = pageNumber < 604 ? pageNumber + 1 : null;

  return (
    <div className="flex min-h-full flex-col font-sans">
      <TopBar />
      <main className="mx-auto w-full max-w-4xl px-4 py-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Link
            href="/quran"
            className="inline-flex items-center rounded-full border border-[color:var(--border)] bg-[color:var(--surface)] px-4 py-2 text-sm text-foreground/80 hover:bg-[color:var(--surface-2)]"
          >
            رجوع للقرآن
          </Link>

          <div className="text-sm text-foreground/70">
            صفحة {pageNumber} {juz ? `• الجزء ${juz}` : ""}
          </div>
        </div>

        <div className="mt-4 rounded-3xl border border-[color:var(--border)] bg-[color:var(--surface)] p-6 shadow-sm">
          <div className="rounded-3xl border border-[color:var(--border)] bg-[color:var(--card-bg)] p-6">
            <div className="text-[20px] leading-loose text-[var(--foreground)]">
              {verses.map((v) => (
                <span key={v.id} className="inline">
                  {v.text_uthmani}{" "}
                  <span className="inline-flex h-7 min-w-7 items-center justify-center rounded-full border border-[var(--accent)]/30 bg-[color:var(--surface-2)] px-2 text-xs font-bold text-[var(--accent)] align-middle">
                    {v.verse_number}
                  </span>{" "}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-5 flex items-center justify-between gap-3">
            {prevPage ? (
              <Link
                href={`/quran/pages/${prevPage}`}
                className="inline-flex items-center gap-2 rounded-full border border-[color:var(--border)] bg-[color:var(--surface-2)] px-4 py-2 text-sm text-foreground/80"
              >
                <ChevronRight width={18} height={18} aria-hidden="true" />
                السابق
              </Link>
            ) : (
              <span className="inline-flex items-center gap-2 rounded-full border border-[color:var(--border)] bg-[color:var(--surface-2)] px-4 py-2 text-sm text-foreground/50">
                <ChevronRight width={18} height={18} aria-hidden="true" />
                السابق
              </span>
            )}

            {nextPage ? (
              <Link
                href={`/quran/pages/${nextPage}`}
                className="inline-flex items-center gap-2 rounded-full border border-[color:var(--border)] bg-[color:var(--surface-2)] px-4 py-2 text-sm text-foreground/80"
              >
                التالي
                <ChevronLeft width={18} height={18} aria-hidden="true" />
              </Link>
            ) : (
              <span className="inline-flex items-center gap-2 rounded-full border border-[color:var(--border)] bg-[color:var(--surface-2)] px-4 py-2 text-sm text-foreground/50">
                التالي
                <ChevronLeft width={18} height={18} aria-hidden="true" />
              </span>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

