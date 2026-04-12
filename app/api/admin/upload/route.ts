import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifySessionToken, SESSION_COOKIE } from "@/lib/adminAuth";
import { put } from "@vercel/blob";

export const runtime = "nodejs";
export const maxDuration = 60;

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"];
const MAX_BYTES = 10 * 1024 * 1024; // 10 MB

export async function POST(req: NextRequest) {
  // ── Auth ────────────────────────────────────────────────────────────────────
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (!token || !(await verifySessionToken(token))) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  // ── Parse multipart form ────────────────────────────────────────────────────
  let file: File | null = null;
  try {
    const form = await req.formData();
    file = form.get("file") as File | null;
  } catch {
    return NextResponse.json({ error: "FormData inválido" }, { status: 400 });
  }

  if (!file || file.size === 0) {
    return NextResponse.json({ error: "No se recibió ningún archivo" }, { status: 400 });
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json(
      { error: "Tipo de archivo no permitido. Solo JPG, PNG, WebP, GIF, AVIF" },
      { status: 400 }
    );
  }

  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "Archivo demasiado grande (máx 10 MB)" }, { status: 400 });
  }

  // ── Upload to Vercel Blob ───────────────────────────────────────────────────
  try {
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
    const pathname = `masbesaura/${Date.now()}-${safeName}`;

    const blob = await put(pathname, file, {
      access: "public",
      contentType: file.type,
    });

    return NextResponse.json({ url: blob.url });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[upload] error:", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
