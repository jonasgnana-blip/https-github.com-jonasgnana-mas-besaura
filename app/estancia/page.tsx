import type { Metadata } from "next";
import NavBar from "@/app/components/NavBar";
import { prisma } from "@/lib/prisma";
import { Phone, MapPin } from "lucide-react";
import EstanciaContent from "./EstanciaContent";

export const revalidate = 0;

export const metadata: Metadata = {
  title: "Información de la Estancia",
  description:
    "Todo lo que necesitas saber para tu estancia en Mas Besaura: llegada, parking, normas, sugerencias y condiciones. Vidrà, Girona.",
  alternates: { canonical: "https://masbesaura.com/estancia" },
  openGraph: {
    title: "Estancia — Mas Besaura, Vidrà",
    description:
      "Información práctica para tu visita: cómo llegar, parking, normas de la casa y sugerencias de actividades en el entorno.",
    url: "https://masbesaura.com/estancia",
    images: [
      { url: "https://masbesaura.com/images/hero1.jpg", width: 1200, height: 630, alt: "Estancia Mas Besaura" },
    ],
  },
};

export default async function EstanciaPage() {
  const configs = await prisma.sistemaConfig.findMany({
    where: { clave: { in: ["estancia_texto_es", "estancia_texto_ca"] } },
  });
  const cfg = Object.fromEntries(configs.map((c) => [c.clave, c.valor]));

  const textoEs = cfg["estancia_texto_es"] ?? DEFAULT_TEXTO_ES;
  const textoCa = cfg["estancia_texto_ca"] ?? DEFAULT_TEXTO_CA;

  return (
    <div className="min-h-screen bg-[#FAFAF6]">
      <NavBar />

      {/* ─── HERO ─── */}
      <section className="relative h-[40vh] flex items-end overflow-hidden pt-16">
        <div className="absolute inset-0">
          <img
            src="/images/hero1.jpg"
            alt="Estancia en Mas Besaura"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#2C1810]/80 via-[#2C1810]/20 to-transparent" />
        </div>
        <div className="relative z-10 px-6 pb-12 max-w-6xl mx-auto w-full">
          <p className="text-[#C4A882] text-sm tracking-[0.2em] uppercase font-medium mb-2">
            Información práctica
          </p>
          <h1
            className="text-5xl md:text-6xl text-[#F0EAD6]"
            style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
          >
            Tu Estancia
          </h1>
        </div>
      </section>

      {/* ─── CONTENT ─── */}
      <EstanciaContent textoEs={textoEs} textoCa={textoCa} />

      {/* ─── FOOTER ─── */}
      <footer className="py-16 px-6 bg-[#2C1810]">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-10">
            <span
              className="text-2xl text-[#F0EAD6]"
              style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
            >
              Mas Besaura
            </span>
            <div className="flex items-center gap-4 flex-wrap justify-center">
              <a
                href="https://maps.app.goo.gl/R5jGm9yANyER96e68"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-5 py-2.5 bg-[#C4A882] text-[#2C1810] rounded-full text-sm font-semibold hover:bg-[#F0EAD6] transition-colors"
              >
                <MapPin size={16} />
                Cómo llegar
              </a>
              <a
                href="https://wa.me/34665822542"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="w-10 h-10 rounded-full border border-[#F0EAD6]/20 flex items-center justify-center text-[#E8DCC8]/70 hover:text-[#F0EAD6] hover:border-[#F0EAD6]/50 transition-colors"
              >
                <Phone size={18} />
              </a>
            </div>
          </div>
          <div className="pt-8 border-t border-[#F0EAD6]/10 text-center text-xs text-[#E8DCC8]/40">
            © {new Date().getFullYear()} Mas Besaura · Vidrà, Girona. Todos los derechos reservados.
          </div>
        </div>
      </footer>
    </div>
  );
}

// ── Default content (shown until admin edits it) ──────────────────────────────

const DEFAULT_TEXTO_ES = `**Llegada y salida**
Entrada a partir de las 16:00h. Salida antes de las 12:00h. Si necesitas otro horario, consúltanos con antelación.

**Parking**
Dispones de parking gratuito dentro de la finca. Acceso por el camino de tierra a la derecha de la entrada principal.

**Cómo llegar**
Desde Vic: dirección Sant Hipòlit de Voltregà → Torelló → Sant Pere de Torelló → Vidrà. La finca está señalizada en el desvío de La Vila de Buscarons. Coordenadas GPS: 42.1167, 2.2833.

**Normas de la casa**
Somos una casa de descanso y transformación. Pedimos silencio a partir de las 23:00h, respeto a los espacios comunes y especial cuidado con el entorno natural. No se permite fumar en el interior.

**Animales**
Se pueden traer animales de compañía previa consulta. Deben permanecer controlados y no acceder a los dormitorios.

**Mascotas y naturaleza**
La finca está rodeada de hayedos con fauna silvestre. Pedimos máximo respeto con el entorno: no dejar residuos, no hacer fuego fuera de las zonas habilitadas.

**Sugerencias de actividades cercanas**
- Ruta por el hayedo de Bellmunt (30 min a pie)
- Cascada del Molí Fondo (45 min a pie)
- Piscinas naturales del río Ges (15 min en coche)
- Ermita de Sant Miquel de la Roqueta (20 min a pie)
- Mercado de Sant Hilari Sacalm (sabados)

**Voluntariado**
¿Te interesa colaborar con la casa a cambio de alojamiento? Pregúntanos por nuestra opción de voluntariado.

**Contacto**
Para cualquier duda o necesidad: WhatsApp +34 665 822 542`;

const DEFAULT_TEXTO_CA = `**Arribada i sortida**
Entrada a partir de les 16:00h. Sortida abans de les 12:00h. Si necessites un altre horari, consulta'ns amb antelació.

**Aparcament**
Disposes d'aparcament gratuït dins de la finca. Accés pel camí de terra a la dreta de l'entrada principal.

**Com arribar**
Des de Vic: direcció Sant Hipòlit de Voltregà → Torelló → Sant Pere de Torelló → Vidrà. La finca està senyalitzada al desviament de La Vila de Buscarons. Coordenades GPS: 42.1167, 2.2833.

**Normes de la casa**
Som una casa de descans i transformació. Demanem silenci a partir de les 23:00h, respecte als espais comuns i especial cura amb l'entorn natural. No es permet fumar a l'interior.

**Animals**
Es poden portar animals de companyia amb consulta prèvia. Han de romandre controlats i no accedir als dormitoris.

**Suggeriments d'activitats properes**
- Ruta pel faig de Bellmunt (30 min a peu)
- Cascada del Molí Fondo (45 min a peu)
- Piscines naturals del riu Ges (15 min en cotxe)
- Ermita de Sant Miquel de la Roqueta (20 min a peu)
- Mercat de Sant Hilari Sacalm (dissabtes)

**Voluntariat**
T'interessa col·laborar amb la casa a canvi d'allotjament? Pregunta'ns per la nostra opció de voluntariat.

**Contacte**
Per a qualsevol dubte o necessitat: WhatsApp +34 665 822 542`;
