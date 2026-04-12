"use client";

import { useState, useTransition } from "react";
import {
  adminUpdateHabitacion,
  adminUpdateComplemento,
  adminUpsertSistemaConfig,
} from "@/app/actions/admin";
import { Save, Loader2, CalendarCheck, CalendarX, ChevronDown, ChevronUp } from "lucide-react";
import ImageUpload from "@/app/components/ImageUpload";

// ── Types ─────────────────────────────────────────────────────────────────────

type Habitacion = {
  id: string;
  nombre: string;
  descripcion: string;
  precio_noche: number;
  capacidad: number;
  precio_desayuno: number | null;
  precio_media_pension: number | null;
  imagenes: string[];
};

type Complemento = {
  id: string;
  nombre: string;
  descripcion: string;
  precio: number;
  tipo_cobro: "PAGO_UNICO" | "POR_NOCHE";
  activo: boolean;
};

type EspaciosCfg = {
  salonImg: string; habsImg: string; salaImg: string;
  salonNombre: string; habsNombre: string; salaNombre: string;
};
type CabanyaCfg = { foto1: string; foto2: string };
type SliderCfg  = { foto1: string; foto2: string; foto3: string; foto4: string; foto5: string };

// ── Reusable sub-components ───────────────────────────────────────────────────

function Section({
  title, subtitle, children, defaultOpen = true,
}: {
  title: string; subtitle?: string; children: React.ReactNode; defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <section className="mb-6">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between mb-0 group"
      >
        <div className="text-left">
          <h2 className="text-xl text-[#2C1810]" style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}>
            {title}
          </h2>
          {subtitle && <p className="text-sm text-[#2C1810]/50 mt-0.5">{subtitle}</p>}
        </div>
        <span className="text-[#2C1810]/40 group-hover:text-[#2C1810]/70 transition-colors">
          {open ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </span>
      </button>
      {open && <div className="mt-4">{children}</div>}
      {!open && <div className="mt-4 border-b border-[#E8DCC8]" />}
    </section>
  );
}

function SaveBtn({
  onClick, saving, saved, label = "Guardar",
}: {
  onClick: () => void; saving: boolean; saved: boolean; label?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={saving}
      className="flex items-center gap-2 px-5 py-2 rounded-full bg-[#4A6741] text-[#F0EAD6] text-sm font-medium hover:bg-[#3A5432] transition-colors disabled:opacity-50"
    >
      {saving ? <Loader2 size={14} className="animate-spin" /> : saved ? "✓ Guardado" : <><Save size={14} />{label}</>}
    </button>
  );
}

function ImgRow({
  label, url, onUrl, onUpload,
}: {
  label: string; url: string; onUrl: (v: string) => void; onUpload: (v: string) => void;
}) {
  return (
    <div className="flex items-start gap-4 pb-5 border-b border-[#E8DCC8] last:border-0 last:pb-0">
      <div className="flex-1 space-y-2">
        <ImageUpload currentUrl={url || null} onUpload={onUpload} label={label} />
        <input
          type="text" value={url} onChange={e => onUrl(e.target.value)}
          placeholder="/images/foto.jpg o URL blob"
          className="w-full px-3 py-2 rounded-xl border border-[#E8DCC8] bg-[#FAFAF6] text-[#2C1810] text-xs focus:outline-none focus:ring-2 focus:ring-[#4A6741]/30"
        />
      </div>
      {url && (
        <img src={url} alt={label} className="w-20 h-20 object-cover rounded-xl border border-[#E8DCC8] shrink-0" />
      )}
    </div>
  );
}

function FieldRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-medium text-[#2C1810]/50 uppercase tracking-wide mb-1.5">
        {label}
      </label>
      {children}
    </div>
  );
}

const INPUT = "w-full px-3 py-2.5 rounded-xl border border-[#E8DCC8] bg-[#FAFAF6] text-[#2C1810] text-sm focus:outline-none focus:ring-2 focus:ring-[#4A6741]/30";

// ── Main component ────────────────────────────────────────────────────────────

export default function ConfigClient({
  habitaciones: initialHabs,
  complementos: initialComps,
  gcalConnected,
  gcalStatus,
  fbPixelIdInicial,
  espaciosInicial,
  cabanyaInicial,
  sliderInicial,
}: {
  habitaciones: Habitacion[];
  complementos: Complemento[];
  gcalConnected: boolean;
  gcalStatus?: string;
  fbPixelIdInicial?: string;
  espaciosInicial: EspaciosCfg;
  cabanyaInicial: CabanyaCfg;
  sliderInicial: SliderCfg;
}) {
  const [isPending, startTransition] = useTransition();

  // ── State ──────────────────────────────────────────────────────────────────
  const [habs, setHabs]     = useState(initialHabs);
  const [comps, setComps]   = useState(initialComps);
  const [espacios, setEspacios] = useState<EspaciosCfg>(espaciosInicial);
  const [cabanya, setCabanya]   = useState<CabanyaCfg>(cabanyaInicial);
  const [slider,  setSlider]    = useState<SliderCfg>(sliderInicial);
  const [pixelId, setPixelId]   = useState(fbPixelIdInicial ?? "");

  // ── Save flags ─────────────────────────────────────────────────────────────
  const [savedHab,      setSavedHab]      = useState<string | null>(null);
  const [savedComp,     setSavedComp]     = useState<string | null>(null);
  const [savedEspacios, setSavedEspacios] = useState(false);
  const [savedCabanya,  setSavedCabanya]  = useState(false);
  const [savedSlider,   setSavedSlider]   = useState(false);
  const [savedPixel,    setSavedPixel]    = useState(false);

  // ── Save helpers ───────────────────────────────────────────────────────────

  function flag(set: (v: boolean) => void) {
    set(true);
    setTimeout(() => set(false), 2500);
  }

  function saveHab(id: string) {
    const h = habs.find(x => x.id === id)!;
    startTransition(async () => {
      await adminUpdateHabitacion(id, {
        nombre: h.nombre, descripcion: h.descripcion,
        precio_noche: h.precio_noche, capacidad: h.capacidad,
        precio_desayuno: h.precio_desayuno ?? undefined,
        precio_media_pension: h.precio_media_pension ?? undefined,
        imagenes: h.imagenes,
      });
      setSavedHab(id);
      setTimeout(() => setSavedHab(null), 2500);
    });
  }

  function saveComp(id: string) {
    const c = comps.find(x => x.id === id)!;
    startTransition(async () => {
      await adminUpdateComplemento(id, { nombre: c.nombre, descripcion: c.descripcion, precio: c.precio, activo: c.activo });
      setSavedComp(id);
      setTimeout(() => setSavedComp(null), 2500);
    });
  }

  function saveEspacios() {
    startTransition(async () => {
      await Promise.all([
        adminUpsertSistemaConfig("espacio_salon_img",    espacios.salonImg),
        adminUpsertSistemaConfig("espacio_habs_img",     espacios.habsImg),
        adminUpsertSistemaConfig("espacio_sala_img",     espacios.salaImg),
        adminUpsertSistemaConfig("espacio_salon_nombre", espacios.salonNombre),
        adminUpsertSistemaConfig("espacio_habs_nombre",  espacios.habsNombre),
        adminUpsertSistemaConfig("espacio_sala_nombre",  espacios.salaNombre),
      ]);
      flag(setSavedEspacios);
    });
  }

  function saveCabanya() {
    startTransition(async () => {
      await Promise.all([
        adminUpsertSistemaConfig("cabanya_foto_1", cabanya.foto1),
        adminUpsertSistemaConfig("cabanya_foto_2", cabanya.foto2),
      ]);
      flag(setSavedCabanya);
    });
  }

  function saveSlider() {
    startTransition(async () => {
      await Promise.all([
        adminUpsertSistemaConfig("slider_foto_1", slider.foto1),
        adminUpsertSistemaConfig("slider_foto_2", slider.foto2),
        adminUpsertSistemaConfig("slider_foto_3", slider.foto3),
        adminUpsertSistemaConfig("slider_foto_4", slider.foto4),
        adminUpsertSistemaConfig("slider_foto_5", slider.foto5),
      ]);
      flag(setSavedSlider);
    });
  }

  function savePixel() {
    startTransition(async () => {
      await adminUpsertSistemaConfig("fb_pixel_id", pixelId.trim());
      flag(setSavedPixel);
    });
  }

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="p-8 max-w-3xl">
      <div className="mb-10">
        <h1 className="text-3xl text-[#2C1810]" style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}>
          Configuración
        </h1>
        <p className="text-sm text-[#2C1810]/50 mt-1">Gestiona imágenes, precios y textos del sitio.</p>
      </div>

      {/* ── 1. HABITACIONES ── */}
      <Section title="Habitaciones" subtitle="Imágenes, precios y descripciones de las 3 habitaciones.">
        <div className="space-y-4">
          {habs.map(h => (
            <div key={h.id} className="bg-white rounded-2xl border border-[#E8DCC8] p-6">
              <h3 className="text-base font-medium text-[#2C1810] mb-4">{h.nombre}</h3>

              <div className="grid sm:grid-cols-2 gap-4 mb-4">
                <FieldRow label="Nombre">
                  <input type="text" value={h.nombre} className={INPUT}
                    onChange={e => setHabs(prev => prev.map(x => x.id === h.id ? { ...x, nombre: e.target.value } : x))} />
                </FieldRow>
                <FieldRow label="Capacidad">
                  <input type="number" min={1} value={h.capacidad} className={INPUT}
                    onChange={e => setHabs(prev => prev.map(x => x.id === h.id ? { ...x, capacidad: Number(e.target.value) } : x))} />
                </FieldRow>
                <FieldRow label="Precio/noche (€)">
                  <input type="number" min={0} value={h.precio_noche} className={INPUT}
                    onChange={e => setHabs(prev => prev.map(x => x.id === h.id ? { ...x, precio_noche: Number(e.target.value) } : x))} />
                </FieldRow>
                <FieldRow label="Con desayuno (€/noche)">
                  <input type="number" min={0} value={h.precio_desayuno ?? ""} placeholder="—" className={INPUT}
                    onChange={e => setHabs(prev => prev.map(x => x.id === h.id ? { ...x, precio_desayuno: e.target.value === "" ? null : Number(e.target.value) } : x))} />
                </FieldRow>
                <FieldRow label="Media pensión (€/noche)">
                  <input type="number" min={0} value={h.precio_media_pension ?? ""} placeholder="—" className={INPUT}
                    onChange={e => setHabs(prev => prev.map(x => x.id === h.id ? { ...x, precio_media_pension: e.target.value === "" ? null : Number(e.target.value) } : x))} />
                </FieldRow>
              </div>

              <FieldRow label="Descripción">
                <textarea rows={2} value={h.descripcion} className={INPUT + " resize-none"}
                  onChange={e => setHabs(prev => prev.map(x => x.id === h.id ? { ...x, descripcion: e.target.value } : x))} />
              </FieldRow>

              {/* Imágenes */}
              <div className="mt-4">
                <label className="block text-xs font-medium text-[#2C1810]/50 uppercase tracking-wide mb-2">Imágenes</label>
                <div className="space-y-3">
                  {h.imagenes.map((url, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-3 rounded-xl border border-[#E8DCC8] bg-[#FAFAF6]">
                      <ImageUpload currentUrl={url || null} label={`Imagen ${idx + 1}`}
                        onUpload={newUrl => setHabs(prev => prev.map(x => {
                          if (x.id !== h.id) return x;
                          const imgs = [...x.imagenes]; imgs[idx] = newUrl; return { ...x, imagenes: imgs };
                        }))} />
                      <div className="flex-1">
                        <input type="text" value={url} placeholder="/images/foto.jpg"
                          className="w-full px-3 py-2 rounded-xl border border-[#E8DCC8] bg-white text-[#2C1810] text-xs focus:outline-none focus:ring-2 focus:ring-[#4A6741]/30"
                          onChange={e => setHabs(prev => prev.map(x => {
                            if (x.id !== h.id) return x;
                            const imgs = [...x.imagenes]; imgs[idx] = e.target.value; return { ...x, imagenes: imgs };
                          }))} />
                      </div>
                      <button type="button" title="Eliminar"
                        onClick={() => setHabs(prev => prev.map(x => x.id !== h.id ? x : { ...x, imagenes: x.imagenes.filter((_, i) => i !== idx) }))}
                        className="mt-5 w-7 h-7 rounded-full flex items-center justify-center bg-red-50 text-red-500 hover:bg-red-100 shrink-0 text-sm font-bold">×</button>
                    </div>
                  ))}
                  <div className="p-3 rounded-xl border border-dashed border-[#E8DCC8] bg-[#FAFAF6]">
                    <ImageUpload currentUrl={null} label="+ Añadir imagen"
                      onUpload={newUrl => { if (newUrl) setHabs(prev => prev.map(x => x.id === h.id ? { ...x, imagenes: [...x.imagenes, newUrl] } : x)); }} />
                  </div>
                </div>
              </div>

              <div className="mt-5">
                <SaveBtn onClick={() => saveHab(h.id)} saving={isPending && savedHab === h.id} saved={savedHab === h.id} />
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* ── 2. ESPACIOS PARA EL ENCUENTRO ── */}
      <Section title="Espacios para el encuentro" subtitle="Nombre e imagen de los 3 espacios comunes en La Casa.">
        <div className="bg-white rounded-2xl border border-[#E8DCC8] p-6 space-y-8">
          {([
            { label: "Espacio 1", imgKey: "salonImg" as keyof EspaciosCfg, nomKey: "salonNombre" as keyof EspaciosCfg, placeholder: "Sala Comedor" },
            { label: "Espacio 2", imgKey: "habsImg"  as keyof EspaciosCfg, nomKey: "habsNombre"  as keyof EspaciosCfg, placeholder: "Cocina Recibidor" },
            { label: "Espacio 3", imgKey: "salaImg"  as keyof EspaciosCfg, nomKey: "salaNombre"  as keyof EspaciosCfg, placeholder: "Sala Interior" },
          ]).map(({ label, imgKey, nomKey, placeholder }) => (
            <div key={imgKey} className="pb-6 border-b border-[#E8DCC8] last:border-0 last:pb-0">
              <p className="text-xs font-semibold text-[#4A6741] uppercase tracking-widest mb-3">{label}</p>
              <div className="grid sm:grid-cols-2 gap-4 mb-3">
                <FieldRow label="Nombre visible en la web">
                  <input type="text" value={espacios[nomKey] as string} placeholder={placeholder} className={INPUT}
                    onChange={e => setEspacios(prev => ({ ...prev, [nomKey]: e.target.value }))} />
                </FieldRow>
              </div>
              <ImgRow
                label="Foto del espacio"
                url={espacios[imgKey] as string}
                onUrl={v => setEspacios(prev => ({ ...prev, [imgKey]: v }))}
                onUpload={v => setEspacios(prev => ({ ...prev, [imgKey]: v }))}
              />
            </div>
          ))}
          <SaveBtn onClick={saveEspacios} saving={isPending} saved={savedEspacios} label="Guardar espacios" />
        </div>
      </Section>

      {/* ── 3. LA CABANYA ── */}
      <Section title="La Cabanya" subtitle="Las 2 fotos del slider de reserva en la página La Casa.">
        <div className="bg-white rounded-2xl border border-[#E8DCC8] p-6 space-y-6">
          {([
            { label: "Foto 1", key: "foto1" as keyof CabanyaCfg },
            { label: "Foto 2", key: "foto2" as keyof CabanyaCfg },
          ]).map(({ label, key }) => (
            <ImgRow key={key} label={label}
              url={cabanya[key]}
              onUrl={v => setCabanya(prev => ({ ...prev, [key]: v }))}
              onUpload={v => setCabanya(prev => ({ ...prev, [key]: v }))}
            />
          ))}
          <SaveBtn onClick={saveCabanya} saving={isPending} saved={savedCabanya} label="Guardar fotos Cabanya" />
        </div>
      </Section>

      {/* ── 4. SLIDER LA CASA ── */}
      <Section title="Slider La Casa" subtitle="Hasta 5 fotos extra en el slider del hero. Las fotos de habitaciones y espacios se añaden automáticamente.">
        <div className="bg-white rounded-2xl border border-[#E8DCC8] p-6 space-y-6">
          {(["foto1","foto2","foto3","foto4","foto5"] as (keyof SliderCfg)[]).map((key, i) => (
            <ImgRow key={key} label={`Foto ${i + 1}`}
              url={slider[key]}
              onUrl={v => setSlider(prev => ({ ...prev, [key]: v }))}
              onUpload={v => setSlider(prev => ({ ...prev, [key]: v }))}
            />
          ))}
          <SaveBtn onClick={saveSlider} saving={isPending} saved={savedSlider} label="Guardar slider" />
        </div>
      </Section>

      {/* ── 5. COMPLEMENTOS ── */}
      <Section title="Complementos" subtitle="Servicios adicionales con precio." defaultOpen={false}>
        <div className="space-y-4">
          {comps.map(c => (
            <div key={c.id} className="bg-white rounded-2xl border border-[#E8DCC8] p-6">
              <div className="grid sm:grid-cols-3 gap-4 mb-4">
                <FieldRow label="Nombre">
                  <input type="text" value={c.nombre} className={INPUT}
                    onChange={e => setComps(prev => prev.map(x => x.id === c.id ? { ...x, nombre: e.target.value } : x))} />
                </FieldRow>
                <FieldRow label={`Precio (€) · ${c.tipo_cobro === "POR_NOCHE" ? "por noche" : "único"}`}>
                  <input type="number" min={0} value={c.precio} className={INPUT}
                    onChange={e => setComps(prev => prev.map(x => x.id === c.id ? { ...x, precio: Number(e.target.value) } : x))} />
                </FieldRow>
                <div className="flex items-end pb-2.5">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={c.activo} className="w-4 h-4 accent-[#4A6741]"
                      onChange={e => setComps(prev => prev.map(x => x.id === c.id ? { ...x, activo: e.target.checked } : x))} />
                    <span className="text-sm text-[#2C1810]/70">Activo</span>
                  </label>
                </div>
              </div>
              <FieldRow label="Descripción">
                <input type="text" value={c.descripcion} className={INPUT}
                  onChange={e => setComps(prev => prev.map(x => x.id === c.id ? { ...x, descripcion: e.target.value } : x))} />
              </FieldRow>
              <div className="mt-4">
                <SaveBtn onClick={() => saveComp(c.id)} saving={isPending && savedComp === c.id} saved={savedComp === c.id} />
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* ── 6. GOOGLE CALENDAR ── */}
      <Section title="Google Calendar" defaultOpen={false}>
        <div className="bg-white rounded-2xl border border-[#E8DCC8] p-6 flex items-center justify-between gap-6 flex-wrap">
          <div className="flex items-center gap-4">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${gcalConnected ? "bg-green-100" : "bg-[#F0EAD6]"}`}>
              {gcalConnected
                ? <CalendarCheck size={20} className="text-green-600" />
                : <CalendarX size={20} className="text-[#8B6914]" />}
            </div>
            <div>
              <div className="text-sm font-medium text-[#2C1810]">
                {gcalConnected ? "Conectado a Google Calendar" : "No conectado"}
              </div>
              <div className="text-xs text-[#2C1810]/50 mt-0.5">
                {gcalConnected
                  ? "Las reservas confirmadas se crean automáticamente en masbesaura@gmail.com"
                  : "Conecta para crear eventos automáticos en cada reserva confirmada"}
              </div>
            </div>
          </div>
          {gcalStatus === "error" && (
            <div className="text-xs text-red-600 bg-red-50 px-3 py-2 rounded-lg">Error al conectar. Inténtalo de nuevo.</div>
          )}
          {gcalStatus === "ok" && !gcalConnected && (
            <div className="text-xs text-green-700 bg-green-50 px-3 py-2 rounded-lg">¡Conectado correctamente!</div>
          )}
          <a href="/api/admin/google-auth"
            className={`shrink-0 px-5 py-2 rounded-full text-sm font-medium transition-colors ${gcalConnected ? "bg-[#F0EAD6] text-[#2C1810] hover:bg-[#E8DCC8]" : "bg-[#4A6741] text-[#F0EAD6] hover:bg-[#3A5432]"}`}>
            {gcalConnected ? "Reconectar" : "Conectar con Google"}
          </a>
        </div>
      </Section>

      {/* ── 7. FACEBOOK PIXEL ── */}
      <Section title="Facebook Pixel" defaultOpen={false}>
        <div className="bg-white rounded-2xl border border-[#E8DCC8] p-6">
          <FieldRow label="Pixel ID">
            <input type="text" value={pixelId} onChange={e => setPixelId(e.target.value)}
              placeholder="Ej: 1234567890123456"
              className={INPUT + " max-w-sm"} />
          </FieldRow>
          <p className="text-xs text-[#2C1810]/40 my-3 max-w-lg">
            También añade <code className="bg-[#F0EAD6] px-1 py-0.5 rounded text-[#2C1810]/70">NEXT_PUBLIC_FB_PIXEL_ID</code> en las variables de entorno de Vercel.
          </p>
          <SaveBtn onClick={savePixel} saving={isPending} saved={savedPixel} label="Guardar Pixel ID" />
        </div>
      </Section>
    </div>
  );
}
