import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifySessionToken, SESSION_COOKIE } from "@/lib/adminAuth";
import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";

export const maxDuration = 60;

// ─── Called TWICE by @vercel/blob client SDK ────────────────────────────────
// 1. POST {type:"blob.generate-client-token"} → server validates auth, returns token
// 2. POST {type:"blob.upload-completed"}       → server notified, can log/save URL
export async function POST(req: NextRequest) {
  const body = (await req.json()) as HandleUploadBody;

  try {
    const jsonResponse = await handleUpload({
      body,
      request: req,
      onBeforeGenerateToken: async (pathname) => {
        // Auth check — only allow logged-in admins
        const store = await cookies();
        const token = store.get(SESSION_COOKIE)?.value;
        if (!token || !(await verifySessionToken(token))) {
          throw new Error("No autorizado");
        }

        return {
          allowedContentTypes: ["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"],
          maximumSizeInBytes: 10 * 1024 * 1024, // 10 MB
          tokenPayload: JSON.stringify({ pathname }),
        };
      },
      onUploadCompleted: async ({ blob }) => {
        // Upload finished — blob.url is the public URL
        console.log("[upload] completed:", blob.url);
      },
    });

    return NextResponse.json(jsonResponse);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[upload] error:", msg);
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
