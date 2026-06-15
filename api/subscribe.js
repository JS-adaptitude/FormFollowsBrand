const { createClient } = require('@supabase/supabase-js');
const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

function supabase() {
  return createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );
}

function confirmationEmail() {
  const siteUrl = process.env.SITE_URL || 'https://formfollowsbrand.pub';
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>You're on the list — Form Follows Brand</title>
</head>
<body style="margin:0;padding:0;background-color:#18191B;">
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#18191B;">
  <tr>
    <td align="center" style="padding:48px 24px 64px;">
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:560px;">

        <!-- Wordmark -->
        <tr>
          <td style="padding-bottom:32px;border-bottom:1px solid #2D2F34;">
            <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:10px;font-weight:700;letter-spacing:0.18em;text-transform:uppercase;color:#52565C;">FORM / FOLLOWS / BRAND</p>
          </td>
        </tr>

        <!-- Hero block -->
        <tr>
          <td style="padding:40px 0 32px;">
            <p style="margin:0 0 6px;font-family:Arial,Helvetica,sans-serif;font-size:11px;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;color:#ED406B;">YOU'RE ON THE LIST.</p>
            <h1 style="margin:0 0 24px;font-family:Arial,Helvetica,sans-serif;font-size:32px;font-weight:300;line-height:1.15;color:#F4F1EA;letter-spacing:-0.02em;">We'll let you know the<br />moment it launches.</h1>
            <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.65;color:#8C9097;">One email, when the book is live. Nothing before that.</p>
          </td>
        </tr>

        <!-- Divider -->
        <tr><td style="border-top:1px solid #2D2F34;"></td></tr>

        <!-- Book intro -->
        <tr>
          <td style="padding:32px 0;">
            <p style="margin:0 0 16px;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.65;color:#B6BAC0;">For more than a century, "form follows function" shaped how we build and design. But function is no longer the frontier — advanced manufacturing and shared supply chains have made competence the floor, not the ceiling.</p>
            <p style="margin:0 0 28px;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.65;color:#B6BAC0;"><em>Form Follows Brand</em> is the shared foundation for design and brand leaders who are ready to build something worth remembering — where every product decision reinforces the brand or quietly erodes it.</p>
            <table cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td style="background:#ED406B;border-radius:2px;">
                  <a href="${siteUrl}" style="display:inline-block;padding:13px 26px;font-family:Arial,Helvetica,sans-serif;font-size:13px;font-weight:700;letter-spacing:0.01em;color:#ffffff;text-decoration:none;">Visit the landing page &rarr;</a>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Divider -->
        <tr><td style="border-top:1px solid #2D2F34;"></td></tr>

        <!-- Author -->
        <tr>
          <td style="padding:28px 0 0;">
            <p style="margin:0 0 2px;font-family:Arial,Helvetica,sans-serif;font-size:14px;font-weight:600;color:#F4F1EA;">Jayson Simeon</p>
            <p style="margin:0 0 20px;font-family:Arial,Helvetica,sans-serif;font-size:10px;font-weight:700;letter-spacing:0.10em;text-transform:uppercase;color:#ED406B;">Founder, Adaptitude</p>
            <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:11px;color:#3A3D42;line-height:1.6;">You're receiving this because you signed up at formfollowsbrand.pub. One email at launch — no spam. To unsubscribe, reply with "unsubscribe."</p>
          </td>
        </tr>

      </table>
    </td>
  </tr>
</table>
</body>
</html>`;
}

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const raw = req.body?.email ?? '';
  const email = String(raw).trim().toLowerCase();

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'Please enter a valid email address.' });
  }

  try {
    const db = supabase();

    const { error: insertError } = await db
      .from('signups')
      .insert({ email, source: 'ffb-landing' });

    // 23505 = unique_violation (duplicate email) — treat as success
    if (insertError && insertError.code !== '23505') {
      throw insertError;
    }

    const isNew = !insertError;
    if (isNew) {
      await resend.emails.send({
        from: process.env.FROM_EMAIL || 'Form Follows Brand <notify@formfollowsbrand.pub>',
        to: email,
        subject: "You're on the list — Form Follows Brand",
        html: confirmationEmail(),
      });
    }

    return res.status(200).json({ status: 'ok' });
  } catch (err) {
    console.error('[subscribe]', err?.message ?? err);
    return res.status(500).json({ error: 'Something went wrong — please try again.' });
  }
};
