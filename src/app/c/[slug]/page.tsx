import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DhikrListClient } from "@/components/DhikrListClient";
import { TopBar } from "@/components/TopBar";
import { dhikrCategories, getCategoryBySlug } from "@/lib/adhkar";

type Props = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return dhikrCategories.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);
  if (!category) return { title: "الأذكار" };
  return { title: category.title };
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);
  if (!category) notFound();

  return (
    <div className="flex min-h-full flex-col font-sans">
      <TopBar />
      <div className="mx-auto w-full max-w-4xl px-4 pt-5">
        <Link
          href="/"
          className="inline-flex items-center rounded-full border border-[color:var(--border)] bg-[color:var(--surface)] px-4 py-2 text-sm text-foreground/80 hover:bg-[color:var(--surface-2)]"
        >
          رجوع للأقسام
        </Link>
      </div>
      <DhikrListClient
        categorySlug={category.slug}
        title={category.title}
      />
    </div>
  );
}
