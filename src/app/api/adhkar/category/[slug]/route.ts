import { NextResponse } from "next/server";
import { getCategoryBySlug } from "@/lib/adhkar";

export const revalidate = 86400;

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);
  if (!category) {
    return NextResponse.json({ error: "NOT_FOUND" }, { status: 404 });
  }

  return NextResponse.json(
    {
      slug: category.slug,
      title: category.title,
      items: category.items,
    },
    {
      headers: {
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    },
  );
}
