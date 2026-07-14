const CONTACT_TO_EMAIL = process.env.CONTACT_TO_EMAIL || 'fadeta287@gmail.com';
const CONTACT_FROM_EMAIL = process.env.CONTACT_FROM_EMAIL || 'Gandiva Labs <onboarding@resend.dev>';
const RESEND_ENDPOINT = 'https://api.resend.com/emails';

const ALLOWED_SERVICES = new Set([
  'Company profile',
  'Landing page',
  'Toko online',
  'Website custom',
  'Redesign website',
  'Belum yakin'
]);

const ALLOWED_TIMELINES = new Set([
  'Kurang dari 1 bulan',
  '1-2 bulan',
  '2-3 bulan',
  'Lebih dari 3 bulan',
  'Belum ditentukan',
  ''
]);

function json(res, status, payload) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.end(JSON.stringify(payload));
}

function normalize(value, maxLength = 300) {
  return typeof value === 'string' ? value.trim().slice(0, maxLength) : '';
}

function escapeHtml(value) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function parseBody(body) {
  if (typeof body === 'string') return JSON.parse(body);
  if (body && typeof body === 'object') return body;
  return {};
}

function isAllowedOrigin(req) {
  const origin = req.headers?.origin;
  if (!origin) return true;

  const configuredOrigins = (process.env.ALLOWED_ORIGIN || '')
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean);

  if (configuredOrigins.length) return configuredOrigins.includes(origin);

  try {
    return new URL(origin).host === req.headers.host;
  } catch {
    return false;
  }
}

function validate(data) {
  const errors = {};
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (data.name.length < 2) errors.name = 'Nama tidak valid.';
  if (!emailPattern.test(data.email)) errors.email = 'Email tidak valid.';
  if (data.whatsapp && data.whatsapp.replace(/\D/g, '').length < 8) errors.whatsapp = 'Nomor WhatsApp tidak valid.';
  if (!ALLOWED_SERVICES.has(data.service)) errors.service = 'Jenis kebutuhan tidak valid.';
  if (!ALLOWED_TIMELINES.has(data.timeline)) errors.timeline = 'Target waktu tidak valid.';
  if (data.variant === 'full' && !data.timeline) errors.timeline = 'Target waktu diperlukan.';
  if (data.summary.length < 20) errors.summary = 'Ringkasan kebutuhan terlalu pendek.';
  if (!data.consent) errors.consent = 'Persetujuan diperlukan.';
  if (!/^[a-zA-Z0-9-]{8,80}$/.test(data.submissionId)) errors.submissionId = 'ID pengiriman tidak valid.';

  return errors;
}

function emailMarkup(data) {
  const rows = [
    ['Nama', data.name],
    ['Bisnis', data.company || 'Tidak dicantumkan'],
    ['Email', data.email],
    ['WhatsApp', data.whatsapp || 'Tidak dicantumkan'],
    ['Kebutuhan', data.service],
    ['Timeline', data.timeline || 'Tidak dicantumkan'],
    ['Sumber form', data.source]
  ];

  const tableRows = rows.map(([label, value]) => `
    <tr>
      <td style="padding:10px 12px;border-bottom:1px solid #e6ded3;color:#81796f;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;vertical-align:top">${escapeHtml(label)}</td>
      <td style="padding:10px 12px;border-bottom:1px solid #e6ded3;color:#171511;font-size:14px;vertical-align:top">${escapeHtml(value)}</td>
    </tr>`).join('');

  return `<!doctype html>
  <html lang="id">
    <body style="margin:0;background:#f5f0e7;font-family:Arial,sans-serif;color:#171511">
      <div style="max-width:680px;margin:0 auto;padding:32px 18px">
        <div style="padding:28px;border:1px solid #d4cabd;border-radius:20px;background:#fbf9f5">
          <p style="margin:0;color:#c85f32;font-size:11px;font-weight:700;letter-spacing:.16em;text-transform:uppercase">Lead baru &mdash; Gandiva Labs</p>
          <h1 style="margin:10px 0 8px;font-size:26px;line-height:1.2">${escapeHtml(data.name)} mengirim brief ${escapeHtml(data.service)}</h1>
          <p style="margin:0 0 22px;color:#625d55;font-size:14px;line-height:1.6">Balas email ini untuk langsung menghubungi calon klien.</p>
          <table role="presentation" style="width:100%;border-collapse:collapse;border:1px solid #e6ded3;border-radius:12px;overflow:hidden">${tableRows}</table>
          <div style="margin-top:22px;padding:18px;border-radius:12px;background:#f5f0e7">
            <p style="margin:0 0 7px;color:#81796f;font-size:11px;font-weight:700;letter-spacing:.1em;text-transform:uppercase">Tujuan dan kebutuhan</p>
            <p style="margin:0;white-space:pre-wrap;color:#171511;font-size:14px;line-height:1.65">${escapeHtml(data.summary)}</p>
          </div>
        </div>
      </div>
    </body>
  </html>`;
}

function emailText(data) {
  return [
    'LEAD BARU - GANDIVA LABS',
    '',
    `Nama: ${data.name}`,
    `Bisnis: ${data.company || 'Tidak dicantumkan'}`,
    `Email: ${data.email}`,
    `WhatsApp: ${data.whatsapp || 'Tidak dicantumkan'}`,
    `Kebutuhan: ${data.service}`,
    `Timeline: ${data.timeline || 'Tidak dicantumkan'}`,
    `Sumber form: ${data.source}`,
    '',
    'Tujuan dan kebutuhan:',
    data.summary
  ].join('\n');
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return json(res, 405, { message: 'Metode tidak diizinkan.' });
  }

  if (!isAllowedOrigin(req)) return json(res, 403, { message: 'Permintaan tidak diizinkan.' });
  if (Number(req.headers?.['content-length'] || 0) > 25_000) {
    return json(res, 413, { message: 'Data form terlalu besar.' });
  }

  let body;
  try {
    body = parseBody(req.body);
  } catch {
    return json(res, 400, { message: 'Data form tidak dapat dibaca.' });
  }

  // Honeypot: return success so automated submitters do not learn how filtering works.
  if (normalize(body.website, 120)) return json(res, 200, { ok: true });

  const data = {
    name: normalize(body.name, 120),
    company: normalize(body.company, 160),
    email: normalize(body.email, 200).toLowerCase(),
    whatsapp: normalize(body.whatsapp, 60),
    service: normalize(body.service, 80),
    timeline: normalize(body.timeline, 80),
    summary: normalize(body.summary, 2000),
    source: normalize(body.source, 80) || 'unknown',
    variant: normalize(body.variant, 20) === 'full' ? 'full' : 'compact',
    consent: body.consent === true,
    submissionId: normalize(body.submissionId, 80)
  };

  const validationErrors = validate(data);
  if (Object.keys(validationErrors).length) {
    return json(res, 422, { message: 'Periksa kembali informasi yang dimasukkan.', errors: validationErrors });
  }

  if (!process.env.RESEND_API_KEY) {
    return json(res, 503, { message: 'Pengiriman email belum dikonfigurasi. Silakan hubungi kami melalui WhatsApp.' });
  }

  const emailPayload = {
    from: CONTACT_FROM_EMAIL,
    to: [CONTACT_TO_EMAIL],
    reply_to: data.email,
    subject: `Brief baru: ${data.service} - ${data.company || data.name}`,
    html: emailMarkup(data),
    text: emailText(data)
  };

  try {
    const resendResponse = await fetch(RESEND_ENDPOINT, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
        'Idempotency-Key': `lead/${data.submissionId}`,
        'User-Agent': 'gandiva-labs-contact/1.0'
      },
      body: JSON.stringify(emailPayload)
    });

    if (!resendResponse.ok) {
      const providerMessage = await resendResponse.text();
      console.error('Contact email provider error', resendResponse.status, providerMessage.slice(0, 300));
      return json(res, 502, { message: 'Email belum berhasil dikirim. Silakan coba kembali atau gunakan WhatsApp.' });
    }

    const result = await resendResponse.json();
    return json(res, 200, { ok: true, id: result.id });
  } catch (error) {
    console.error('Contact email request failed', error instanceof Error ? error.message : 'Unknown error');
    return json(res, 502, { message: 'Layanan email sedang tidak tersedia. Silakan coba kembali atau gunakan WhatsApp.' });
  }
}
