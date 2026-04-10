type Complemento = { nombre: string; precio_aplicado: number };

type Props = {
  nombre_cliente: string;
  email_cliente: string;
  telefono_cliente: string;
  habitacion: string;
  fecha_entrada: string;
  fecha_salida: string;
  noches: number;
  complementos: Complemento[];
  precio_total: number;
};

export function renderEmailAdmin(p: Props): string {
  const whatsappNum = (process.env.ADMIN_WHATSAPP_NUMBER ?? "").replace(/\D/g, "");
  const whatsappMsg = encodeURIComponent(
    `Hola ${p.nombre_cliente}, te escribo sobre tu reserva en Mas Besaura del ${p.fecha_entrada} al ${p.fecha_salida}.`
  );
  const whatsappUrl = `https://wa.me/${whatsappNum}?text=${whatsappMsg}`;

  const filaComplementos = p.complementos
    .map(
      (c) => `<tr>
        <td style="padding:6px 0;font-family:Arial,sans-serif;font-size:14px;color:#2C1810;border-bottom:1px solid #F0EAD6;">${c.nombre}</td>
        <td style="padding:6px 0;font-family:Arial,sans-serif;font-size:14px;color:#2C1810;text-align:right;border-bottom:1px solid #F0EAD6;">+${c.precio_aplicado}€</td>
      </tr>`
    )
    .join("");

  return `<!DOCTYPE html>
<html lang="es">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#FAFAF6;font-family:Georgia,serif;">
  <div style="max-width:560px;margin:40px auto;background:white;border-radius:12px;overflow:hidden;border:1px solid #E8DCC8;">

    <div style="background:#2A3F24;padding:32px;text-align:center;">
      <h1 style="color:#F0EAD6;margin:0;font-size:24px;font-weight:normal;letter-spacing:1px;">Mas Besaura</h1>
      <p style="color:#C4A882;margin:8px 0 0;font-size:13px;font-family:Arial,sans-serif;">Nueva reserva confirmada</p>
    </div>

    <div style="padding:32px;">
      <div style="margin-bottom:24px;">
        <div style="font-family:Arial,sans-serif;font-size:11px;color:#4A6741;text-transform:uppercase;letter-spacing:1.5px;margin-bottom:8px;">Cliente</div>
        <div style="font-size:20px;color:#2C1810;font-weight:bold;">${p.nombre_cliente}</div>
        <div style="font-family:Arial,sans-serif;font-size:14px;color:#2C1810;opacity:0.7;margin-top:4px;">${p.email_cliente} · ${p.telefono_cliente}</div>
      </div>

      <div style="margin-bottom:24px;">
        <div style="font-family:Arial,sans-serif;font-size:11px;color:#4A6741;text-transform:uppercase;letter-spacing:1.5px;margin-bottom:8px;">Estancia</div>
        <div style="font-size:16px;color:#2C1810;">${p.habitacion}</div>
        <div style="font-family:Arial,sans-serif;font-size:14px;color:#4A6741;margin-top:4px;">${p.fecha_entrada} → ${p.fecha_salida} · ${p.noches} noche${p.noches > 1 ? "s" : ""}</div>
      </div>

      <div style="margin-bottom:24px;">
        <div style="font-family:Arial,sans-serif;font-size:11px;color:#4A6741;text-transform:uppercase;letter-spacing:1.5px;margin-bottom:8px;">Desglose</div>
        <table style="width:100%;border-collapse:collapse;">
          <tr>
            <td style="padding:6px 0;font-family:Arial,sans-serif;font-size:14px;color:#2C1810;border-bottom:1px solid #F0EAD6;">${p.noches} noche${p.noches > 1 ? "s" : ""}</td>
            <td style="padding:6px 0;font-family:Arial,sans-serif;font-size:14px;color:#2C1810;text-align:right;border-bottom:1px solid #F0EAD6;">${p.noches * 150}€</td>
          </tr>
          ${filaComplementos}
          <tr>
            <td style="padding:12px 0 0;font-family:Arial,sans-serif;font-size:16px;font-weight:bold;color:#2C1810;">Total pagado</td>
            <td style="padding:12px 0 0;font-family:Arial,sans-serif;font-size:16px;font-weight:bold;color:#4A6741;text-align:right;">${p.precio_total}€</td>
          </tr>
        </table>
      </div>

      <div style="text-align:center;margin:28px 0 8px;">
        <a href="${whatsappUrl}" style="display:inline-block;padding:14px 28px;background:#25D366;color:white;text-decoration:none;border-radius:50px;font-family:Arial,sans-serif;font-size:15px;font-weight:bold;">
          💬 Contactar por WhatsApp
        </a>
      </div>
    </div>

    <div style="padding:20px 32px;background:#F0EAD6;text-align:center;font-family:Arial,sans-serif;font-size:12px;color:#2C1810;opacity:0.6;">
      Mas Besaura · info@masbesaura.com · +34 665 822 542
    </div>
  </div>
</body>
</html>`;
}
