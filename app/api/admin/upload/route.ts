import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifySessionToken, SESSION_COOKIE } from "@/lib/adminAuth";
import { put } from "@vercel/blob";

// Allow up to 8MB uploads
export const maxDuration = 30;

export async function POST(req: NextRequest) {
  // Auth check
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (!token || !(await verifySessionToken(token))) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  // Resolve blob token (Vercel Blob store may inject under a prefixed name)
  const blobToken =
    process.env.BLOB_READ_WRITE_TOKEN ??
    process.env.MASBESAURABLOB_READ_WRITE_TOKEN;

  if (!blobToken) {
    console.error("[upload] BLOB_READ_WRITE_TOKEN not set");
    return NextResponse.json({ error: "Almacenamiento no configurado" }, { status: 500 });
  }

  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  if (!file) {
    return NextResponse.json({ error: "No se recibió ningún archivo" }, { status: 400 });
  }

  if (!file.type.startsWith("image/")) {
    return NextResponse.json({ error: "Solo se aceptan imágenes" }, { status: 400 });
  }

  if (file.size > 5 * 1024 * 1024) {
    return NextResponse.json({ error: "La imagen no puede superar 5MB" }, { status: 400 });
  }

  try {
    const blob = await put(
      `masbesaura/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`,
      file,
      { access: "public", token: blobToken }
    );
    return NextResponse.json({ url: blob.url });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[upload] Blob error:", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
