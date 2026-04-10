type Complemento = { nombre: string; precio_aplicado: number };

type Props = {
  nombre_cliente: string;
  habitacion: string;
  fecha_entrada: string;
  fecha_salida: string;
  noches: number;
  complementos: Complemento[];
  precio_total: number;
};

export function renderEmailCliente(p: Props): string {
  const primerNombre = p.nombre_cliente.split(" ")[0];

  const filaComplementos = p.complementos
    .map(
      (c) => `<tr>
        <td style="padding:6px 0;font-family:Arial,sans-serif;font-size:14px;color:#2C1810;border-bottom:1px solid #E8DCC8;">${c.nombre}</td>
        <td style="padding:6px 0;font-family:Arial,sans-serif;font-size:14px;color:#2C1810;text-align:right;border-bottom:1px solid #E8DCC8;">+${c.precio_aplicado}€</td>
      </tr>`
    )
    .join("");

  return `<!DOCTYPE html>
<html lang="es">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#FAFAF6;font-family:Georgia,serif;">
  <div style="max-width:560px;margin:40px auto;background:white;border-radius:12px;overflow:hidden;border:1px solid #E8DCC8;">

    <div style="background:linear-gradient(160deg,#2A3F24 0%,#4A6741 100%);padding:48px 32px;text-align:center;">
      <h1 style="color:#F0EAD6;margin:0 0 8px;font-size:32px;font-weight:normal;">Mas Besaura</h1>
      <p style="color:#C4A882;margin:0;font-size:13px;font-family:Arial,sans-serif;letter-spacing:2px;text-transform:uppercase;">Tu reserva está confirmada</p>
    </div>

    <div style="padding:32px 32px 0;">
      <p style="font-size:20px;color:#2C1810;margin:0;">Hola, ${primerNombre} 👋</p>
    </div>

    <div style="padding:20px 32px 32px;">
      <p style="font-family:Arial,sans-serif;font-size:15px;color:#2C1810;line-height:1.7;margin-top:12px;">
        ¡Estamos encantados de recibirte! Tu reserva en <strong>Mas Besaura</strong> ha quedado confirmada. Aquí tienes todos los detalles.
      </p>

      <div style="background:#F0EAD6;border-radius:10px;padding:20px;margin:20px 0;">
        <div style="font-family:Arial,sans-serif;font-size:11px;color:#4A6741;text-transform:uppercase;letter-spacing:1.5px;margin-bottom:8px;">Tu estancia</div>
        <div style="font-size:16px;color:#2C1810;font-weight:bold;">${p.habitacion}</div>
        <div style="font-family:Arial,sans-serif;font-size:13px;color:#2C1810;opacity:0.6;margin-top:4px;">${p.fecha_entrada} → ${p.fecha_salida} · ${p.noches} noche${p.noches > 1 ? "s" : ""}</div>
      </div>

      <div style="font-family:Arial,sans-serif;font-size:11px;color:#4A6741;text-transform:uppercase;letter-spacing:1.5px;margin-bottom:8px;">Resumen del pago</div>
      <table style="width:100%;border-collapse:collapse;">
        <tr>
          <td style="padding:6px 0;font-family:Arial,sans-serif;font-size:14px;color:#2C1810;border-bottom:1px solid #E8DCC8;">${p.noches} noche${p.noches > 1 ? "s" : ""} × 150€</td>
          <td style="padding:6px 0;font-family:Arial,sans-serif;font-size:14px;color:#2C1810;text-align:right;border-bottom:1px solid #E8DCC8;">${p.noches * 150}€</td>
        </tr>
        ${filaComplementos}
        <tr>
          <td style="padding:12px 0 0;font-family:Arial,sans-serif;font-size:16px;font-weight:bold;color:#2C1810;">Total pagado</td>
          <td style="padding:12px 0 0;font-family:Arial,sans-serif;font-size:16px;font-weight:bold;color:#4A6741;text-align:right;">${p.precio_total}€</td>
        </tr>
      </table>

      <div style="background:#2A3F24;border-radius:10px;padding:20px;margin:24px 0;">
        <h3 style="margin:0 0 12px;font-size:15px;color:#C4A882;font-family:Arial,sans-serif;font-weight:bold;text-transform:uppercase;letter-spacing:1px;">🗺️ Cómo llegar</h3>
        <p style="font-family:Arial,sans-serif;font-size:13px;line-height:1.7;margin:0;color:#F0EAD6;opacity:0.85;">
          Te enviaremos las indicaciones exactas por WhatsApp unos días antes de tu llegada.
          El check-in es a partir de las <strong>16:00 h</strong> y el check-out antes de las <strong>11:00 h</strong>.
        </p>
      </div>

      <p style="font-family:Arial,sans-serif;font-size:14px;color:#2C1810;line-height:1.7;">
        Si tienes cualquier pregunta escríbenos a
        <a href="mailto:info@masbesaura.com" style="color:#4A6741;">info@masbesaura.com</a>
        o llámanos al <a href="tel:+34665822542" style="color:#4A6741;">+34 665 822 542</a>.
      </p>

      <p style="font-size:18px;color:#2C1810;text-align:center;margin-top:28px;">¡Hasta pronto! 🌿</p>
    </div>

    <div style="padding:24px 32px;background:#F0EAD6;text-align:center;font-family:Arial,sans-serif;font-size:12px;color:#2C1810;">
      <strong>Mas Besaura</strong><br>
      <a href="mailto:info@masbesaura.com" style="color:#4A6741;">info@masbesaura.com</a> · +34 665 822 542<br>
      Cataluña, España
    </div>
  </div>
</body>
</html>`;
}
