import { NextResponse } from "next/server";
import { getDhikrById } from "@/lib/adhkar";

export const revalidate = 86400;

function parseIds(body: unknown): string[] {
  if (body == null || typeof body !== "object") return [];
  if (!("ids" in body)) return [];
  const ids = (body as Record<string, unknown>).ids;
  if (!Array.isArray(ids)) return [];
  return ids.filter((x): x is string => typeof x === "string");
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as unknown;
  const normalizedIds = parseIds(body).slice(0, 200);

  const entries = normalizedIds.map((id) => getDhikrById(id)).filter((x) => x != null);

  return NextResponse.json(
    { entries },
    {
      headers: {
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    },
  );
}
