function siteOrigin(event) {
  const host = event.headers['x-forwarded-host'] || event.headers.host || 'www.caiquenonato.com.br';
  const proto = event.headers['x-forwarded-proto'] || 'https';
  return `${proto}://${host}`;
}

function resourceMetadataUrl(event) {
  return `${siteOrigin(event)}/.well-known/oauth-protected-resource`;
}

function json(statusCode, body, extraHeaders = {}) {
  return {
    statusCode,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      ...extraHeaders,
    },
    body: JSON.stringify(body),
  };
}

function isValidEmail(email) {
  return typeof email === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

exports.handler = async (event) => {
  const protectedResourceHeader = {
    'WWW-Authenticate': `Bearer resource_metadata="${resourceMetadataUrl(event)}"`,
  };

  if (event.httpMethod !== 'POST') {
    return json(405, { error: 'Method not allowed' }, protectedResourceHeader);
  }

  let payload = {};
  try {
    payload = JSON.parse(event.body || '{}');
  } catch {
    return json(400, { error: 'Invalid JSON body' }, protectedResourceHeader);
  }

  const nome = (payload.nome ?? '').toString().trim();
  const email = (payload.email ?? '').toString().trim();
  const assunto = (payload.assunto ?? '').toString().trim();
  const mensagem = (payload.mensagem ?? '').toString().trim();

  if (!nome || !email || !assunto || !mensagem) {
    return json(400, { error: 'Preencha nome, e-mail, assunto e mensagem.' }, protectedResourceHeader);
  }
  if (!isValidEmail(email)) {
    return json(400, { error: 'E-mail inválido.' }, protectedResourceHeader);
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return json(500, { error: 'Config ausente: RESEND_API_KEY' }, protectedResourceHeader);
  }

  const toEmail = process.env.CONTACT_TO_EMAIL || process.env.CONTACT_TO || 'caique2silva@gmail.com';
  const fromEmail = process.env.CONTACT_FROM_EMAIL || process.env.RESEND_FROM || 'Portfolio <onboarding@resend.dev>';

  const subject = `Contato Portfólio: ${assunto}`.slice(0, 200);
  const text =
    `Novo contato via portfólio\n\n` +
    `Nome: ${nome}\n` +
    `Email: ${email}\n` +
    `Assunto: ${assunto}\n\n` +
    `Mensagem:\n${mensagem}\n`;

  try {
    const resp = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: fromEmail,
        to: [toEmail],
        subject,
        text,
        replyTo: email,
      }),
    });

    if (!resp.ok) {
      const details = await resp.text();
      return json(
        502,
        {
          error: 'Falha ao enviar e-mail (provedor).',
          details: details.slice(0, 1500),
        },
        protectedResourceHeader,
      );
    }

    const data = await resp.json().catch(() => ({}));
    return json(200, { ok: true, id: data.id });
  } catch (err) {
    return json(502, { error: 'Falha ao enviar e-mail.', details: String(err) }, protectedResourceHeader);
  }
};
