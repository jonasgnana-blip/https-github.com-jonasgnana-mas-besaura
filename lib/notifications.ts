/**
 * lib/notifications.ts
 * Envío de emails de notificación via Resend REST API (sin SDK).
 * Si RESEND_API_KEY no está configurada, se omite sin lanzar error.
 */

const RESEND_API_URL = "https://api.resend.com/emails";
const FROM_RESERVAS = "Mas Besaura <reservas@masbesaura.com>";
const EMAIL_ADMIN = "masbesaura@gmail.com";
const TELEFONO_CONTACTO = "+34 972 000 000"; // actualizar con el real

// ── Tipos ──────────────────────────────────────────────────────────────────────

export interface ComplementoData {
  nombre: string;
  precio_aplicado: number;
}

export interface ReservaConfirmadaData {
  nombre_cliente: string;
  email_cliente: string;
  telefono_cliente?: string | null;
  habitacion: string;
  fecha_entrada: string;
  fecha_salida: string;
  noches: number;
  precio_total: number;
  complementos?: ComplementoData[];
}

export interface ReservaActividadData {
  nombre_cliente: string;
  email_cliente: string;
  telefono_cliente?: string | null;
  actividad: string;
  fecha: string;
  personas: number;
  precio_total: number;
}

// ── Helper interno ─────────────────────────────────────────────────────────────

async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn("[notifications] RESEND_API_KEY no definida — email omitido");
    return;
  }

  const res = await fetch(RESEND_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ from: FROM_RESERVAS, to, subject, html }),
  });

  if (!res.ok) {
    const body = await res.text();
    console.error("[notifications] Error Resend:", res.status, body);
  }
}

// ── HTML Helpers ───────────────────────────────────────────────────────────────

function wrapHTML(content: string): string {
  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Mas Besaura</title>
</head>
<body style="margin:0;padding:0;background-color:#F5EFE0;font-family:Georgia,serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#F5EFE0;padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background-color:#FFFFFF;border-radius:12px;overflow:hidden;box-shadow:0 2px 12px rgba(44,24,16,0.10);">
          <!-- Header -->
          <tr>
            <td style="background-color:#2C1810;padding:32px 40px;text-align:center;">
              <p style="margin:0;font-size:11px;letter-spacing:4px;text-transform:uppercase;color:#F0EAD6;opacity:0.7;">Vidrà · Girona</p>
              <h1 style="margin:8px 0 0;font-size:28px;font-weight:normal;color:#F0EAD6;letter-spacing:1px;">Mas Besaura</h1>
            </td>
          </tr>
          <!-- Content -->
          <tr>
            <td style="padding:40px;">
              ${content}
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="background-color:#F0EAD6;padding:24px 40px;text-align:center;border-top:1px solid #E8DCC8;">
              <p style="margin:0;font-size:12px;color:#2C1810;opacity:0.6;">
                Mas Besaura · Vidrà, Girona<br />
                <a href="https://masbesaura.com" style="color:#4A6741;text-decoration:none;">masbesaura.com</a>
                &nbsp;·&nbsp;
                <a href="mailto:masbesaura@gmail.com" style="color:#4A6741;text-decoration:none;">masbesaura@gmail.com</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function row(label: string, value: string | number): string {
  return `
  <tr>
    <td style="padding:10px 0;border-bottom:1px solid #F0EAD6;font-size:13px;color:#2C1810;opacity:0.6;width:140px;vertical-align:top;">${label}</td>
    <td style="padding:10px 0;border-bottom:1px solid #F0EAD6;font-size:13px;color:#2C1810;font-weight:bold;vertical-align:top;">${value}</td>
  </tr>`;
}

// ── Email cliente — reserva alojamiento ───────────────────────────────────────

function htmlClienteReservaConfirmada(data: ReservaConfirmadaData): string {
  const complementosRows =
    data.complementos && data.complementos.length > 0
      ? data.complementos
          .map((c) => row(c.nombre, `${c.precio_aplicado.toFixed(2)} €`))
          .join("")
      : "";

  const content = `
    <p style="margin:0 0 8px;font-size:13px;letter-spacing:2px;text-transform:uppercase;color:#4A6741;">Confirmación de reserva</p>
    <h2 style="margin:0 0 24px;font-size:22px;font-weight:normal;color:#2C1810;">
      Hola, ${data.nombre_cliente} 🌿
    </h2>
    <p style="margin:0 0 28px;font-size:15px;line-height:1.7;color:#2C1810;">
      Tu reserva en <strong>Mas Besaura</strong> está confirmada. Estamos encantados de recibirte en nuestra masía en el Collsacabra.
    </p>

    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
      ${row("Habitación", data.habitacion)}
      ${row("Entrada", data.fecha_entrada)}
      ${row("Salida", data.fecha_salida)}
      ${row("Noches", String(data.noches))}
      ${complementosRows}
      <tr>
        <td style="padding:14px 0 0;font-size:15px;color:#2C1810;font-weight:bold;">Total</td>
        <td style="padding:14px 0 0;font-size:18px;color:#4A6741;font-weight:bold;">${data.precio_total.toFixed(2)} €</td>
      </tr>
    </table>

    <div style="background-color:#F0EAD6;border-radius:10px;padding:20px 24px;margin-bottom:28px;">
      <p style="margin:0;font-size:14px;line-height:1.7;color:#2C1810;">
        <strong>Nos vemos pronto en Mas Besaura · Vidrà, Girona</strong><br />
        Si tienes cualquier pregunta antes de tu llegada, no dudes en contactarnos.
      </p>
    </div>

    <p style="margin:0;font-size:14px;line-height:1.8;color:#2C1810;">
      Con cariño,<br />
      <strong>Jonàs — Mas Besaura</strong><br />
      <a href="tel:${TELEFONO_CONTACTO.replace(/\s/g, "")}" style="color:#4A6741;text-decoration:none;">${TELEFONO_CONTACTO}</a>
    </p>
  `;

  return wrapHTML(content);
}

// ── Email gestor — reserva alojamiento ────────────────────────────────────────

function htmlAdminReservaConfirmada(data: ReservaConfirmadaData): string {
  const complementosRows =
    data.complementos && data.complementos.length > 0
      ? data.complementos
          .map((c) => row(c.nombre, `${c.precio_aplicado.toFixed(2)} €`))
          .join("")
      : "";

  const content = `
    <p style="margin:0 0 24px;font-size:22px;font-weight:normal;color:#2C1810;">
      Nueva reserva de <strong>${data.nombre_cliente}</strong>
    </p>
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:20px;">
      ${row("Nombre", data.nombre_cliente)}
      ${row("Email", `<a href="mailto:${data.email_cliente}" style="color:#4A6741;">${data.email_cliente}</a>`)}
      ${row("Teléfono", data.telefono_cliente ?? "—")}
      ${row("Habitación", data.habitacion)}
      ${row("Entrada", data.fecha_entrada)}
      ${row("Salida", data.fecha_salida)}
      ${row("Noches", String(data.noches))}
      ${complementosRows}
      <tr>
        <td style="padding:14px 0 0;font-size:15px;color:#2C1810;font-weight:bold;">Total</td>
        <td style="padding:14px 0 0;font-size:18px;color:#4A6741;font-weight:bold;">${data.precio_total.toFixed(2)} €</td>
      </tr>
    </table>
  `;

  return wrapHTML(content);
}

// ── Email cliente — actividad ─────────────────────────────────────────────────

function htmlClienteReservaActividad(data: ReservaActividadData): string {
  const content = `
    <p style="margin:0 0 8px;font-size:13px;letter-spacing:2px;text-transform:uppercase;color:#4A6741;">Confirmación de actividad</p>
    <h2 style="margin:0 0 24px;font-size:22px;font-weight:normal;color:#2C1810;">
      Hola, ${data.nombre_cliente} 🌿
    </h2>
    <p style="margin:0 0 28px;font-size:15px;line-height:1.7;color:#2C1810;">
      Tu reserva para <strong>${data.actividad}</strong> en Mas Besaura ha sido confirmada.
    </p>

    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
      ${row("Actividad", data.actividad)}
      ${row("Fecha", data.fecha)}
      ${row("Personas", String(data.personas))}
      <tr>
        <td style="padding:14px 0 0;font-size:15px;color:#2C1810;font-weight:bold;">Total</td>
        <td style="padding:14px 0 0;font-size:18px;color:#4A6741;font-weight:bold;">${data.precio_total.toFixed(2)} €</td>
      </tr>
    </table>

    <div style="background-color:#F0EAD6;border-radius:10px;padding:20px 24px;margin-bottom:28px;">
      <p style="margin:0;font-size:14px;line-height:1.7;color:#2C1810;">
        <strong>Nos vemos pronto en Mas Besaura · Vidrà, Girona</strong><br />
        Cualquier duda, escríbenos o llámanos sin problema.
      </p>
    </div>

    <p style="margin:0;font-size:14px;line-height:1.8;color:#2C1810;">
      Con cariño,<br />
      <strong>Jonàs — Mas Besaura</strong><br />
      <a href="tel:${TELEFONO_CONTACTO.replace(/\s/g, "")}" style="color:#4A6741;text-decoration:none;">${TELEFONO_CONTACTO}</a>
    </p>
  `;

  return wrapHTML(content);
}

// ── Email gestor — actividad ──────────────────────────────────────────────────

function htmlAdminReservaActividad(data: ReservaActividadData): string {
  const content = `
    <p style="margin:0 0 24px;font-size:22px;font-weight:normal;color:#2C1810;">
      Nueva reserva de actividad — <strong>${data.nombre_cliente}</strong>
    </p>
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:20px;">
      ${row("Nombre", data.nombre_cliente)}
      ${row("Email", `<a href="mailto:${data.email_cliente}" style="color:#4A6741;">${data.email_cliente}</a>`)}
      ${row("Teléfono", data.telefono_cliente ?? "—")}
      ${row("Actividad", data.actividad)}
      ${row("Fecha", data.fecha)}
      ${row("Personas", String(data.personas))}
      <tr>
        <td style="padding:14px 0 0;font-size:15px;color:#2C1810;font-weight:bold;">Total</td>
        <td style="padding:14px 0 0;font-size:18px;color:#4A6741;font-weight:bold;">${data.precio_total.toFixed(2)} €</td>
      </tr>
    </table>
  `;

  return wrapHTML(content);
}

// ── Exports públicos ───────────────────────────────────────────────────────────

/**
 * Envía confirmación de reserva de alojamiento al cliente y al gestor.
 * No lanza error si la API key no está configurada o si Resend falla.
 */
export async function sendReservaConfirmada(
  data: ReservaConfirmadaData
): Promise<void> {
  try {
    await Promise.all([
      sendEmail({
        to: data.email_cliente,
        subject: "Confirmación de reserva — Mas Besaura",
        html: htmlClienteReservaConfirmada(data),
      }),
      sendEmail({
        to: EMAIL_ADMIN,
        subject: `Nueva reserva — ${data.nombre_cliente}`,
        html: htmlAdminReservaConfirmada(data),
      }),
    ]);
  } catch (err) {
    console.error("[notifications] sendReservaConfirmada error:", err);
  }
}

/**
 * Envía confirmación de reserva de actividad al cliente y al gestor.
 * No lanza error si la API key no está configurada o si Resend falla.
 */
export async function sendReservaActividad(
  data: ReservaActividadData
): Promise<void> {
  try {
    await Promise.all([
      sendEmail({
        to: data.email_cliente,
        subject: "Confirmación de reserva — Mas Besaura",
        html: htmlClienteReservaActividad(data),
      }),
      sendEmail({
        to: EMAIL_ADMIN,
        subject: `Nueva reserva — ${data.nombre_cliente}`,
        html: htmlAdminReservaActividad(data),
      }),
    ]);
  } catch (err) {
    console.error("[notifications] sendReservaActividad error:", err);
  }
}
