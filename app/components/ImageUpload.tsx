"use client";
import { useRef, useState } from "react";
import { Upload, Loader2, X } from "lucide-react";

export default function ImageUpload({
  currentUrl,
  onUpload,
  label = "Imagen",
}: {
  currentUrl?: string | null;
  onUpload: (url: string) => void;
  label?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError("");

    try {
      const form = new FormData();
      form.append("file", file);

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: form,
        // No Content-Type header — browser sets it automatically with boundary
      });

      const data = await res.json();

      if (!res.ok || !data.url) {
        throw new Error(data.error ?? "Error al subir la imagen");
      }

      onUpload(data.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <label className="block text-xs font-medium text-[#2C1810]/50 uppercase tracking-wide">
        {label}
      </label>

      {currentUrl && (
        <div className="relative w-24 h-24 rounded-xl overflow-hidden border border-[#E8DCC8]">
          <img src={currentUrl} alt="preview" className="w-full h-full object-cover" />
          <button
            type="button"
            onClick={() => onUpload("")}
            className="absolute top-1 right-1 w-5 h-5 bg-black/60 rounded-full flex items-center justify-center text-white hover:bg-red-600 transition-colors"
          >
            <X size={10} />
          </button>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
        className="hidden"
        onChange={handleFile}
      />

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        className="flex items-center gap-2 px-4 py-2 rounded-xl border border-[#E8DCC8] text-sm text-[#2C1810]/70 hover:bg-[#F0EAD6] transition-colors disabled:opacity-50 w-fit"
      >
        {uploading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
        {uploading ? "Subiendo..." : currentUrl ? "Cambiar imagen" : "Subir imagen"}
      </button>

      {error && <p className="text-red-600 text-xs">{error}</p>}
    </div>
  );
}
