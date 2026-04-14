"use client";

import { useState, useTransition } from "react";
import { Save, Loader2, CalendarCheck, CalendarX } from "lucide-react";
import { adminUpsertSistemaConfig } from "@/app/actions/admin";

export function GcalCard({
  connected,
  searchMsg,
}: {
  connected: boolean;
  searchMsg?: string;
}) {
  return (
    <div className="bg-white rounded-2xl border border-[#E8DCC8] p-6 flex items-center justify-between gap-4 flex-wrap">
      <div className="flex items-center gap-4">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${connected ? "bg-green-100" : "bg-[#F0EAD6]"}`}>
          {connected
            ? <CalendarCheck size={20} className="text-green-600" />
            : <CalendarX size={20} className="text-[#8B6914]" />}
        </div>
        <div>
          <div className="text-sm font-medium text-[#2C1810]">
            Google Calendar
          </div>
          <div className="text-xs text-[#2C1810]/50 mt-0.5">
            {connected
              ? "Conectado · eventos automáticos en cada reserva"
              : "No conectado · las reservas no crean eventos"}
          </div>
          {searchMsg && (
            <div className="text-xs text-red-600 mt-1 break-all max-w-xs">
              Error: {searchMsg}
            </div>
          )}
        </div>
      </div>
      <a
        href="/api/admin/google-auth"
        className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
          connected
            ? "bg-[#F0EAD6] text-[#2C1810] hover:bg-[#E8DCC8]"
            : "bg-[#4A6741] text-[#F0EAD6] hover:bg-[#3A5432]"
        }`}
      >
        {connected ? "Reconectar" : "Conectar"}
      </a>
    </div>
  );
}

export function PixelCard({ initialValue }: { initialValue: string }) {
  const [value, setValue] = useState(initialValue);
  const [saved, setSaved] = useState(false);
  const [isPending, startTransition] = useTransition();

  function save() {
    startTransition(async () => {
      await adminUpsertSistemaConfig("fb_pixel_id", value.trim());
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    });
  }

  return (
    <div className="bg-white rounded-2xl border border-[#E8DCC8] p-6">
      <div className="text-sm font-medium text-[#2C1810] mb-3">Facebook Pixel ID</div>
      <div className="flex items-center gap-3">
        <input
          type="text"
          value={value}
          onChange={e => setValue(e.target.value)}
          placeholder="Ej: 1234567890123456"
          className="flex-1 px-3 py-2 rounded-xl border border-[#E8DCC8] bg-[#FAFAF6] text-[#2C1810] text-sm focus:outline-none focus:ring-2 focus:ring-[#4A6741]/30"
        />
        <button
          type="button"
          onClick={save}
          disabled={isPending}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#4A6741] text-[#F0EAD6] text-sm font-medium hover:bg-[#3A5432] transition-colors disabled:opacity-50 shrink-0"
        >
          {isPending ? <Loader2 size={13} className="animate-spin" /> : saved ? "✓" : <Save size={13} />}
          {saved ? "Guardado" : "Guardar"}
        </button>
      </div>
    </div>
  );
}
