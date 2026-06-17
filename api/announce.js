const { createClient } = require('@supabase/supabase-js');
const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

function supabase() {
  return createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );
}

// ---------------------------------------------------------------------------
// Launch announcement email. Mirrors the look of the confirmation email in
// api/subscribe.js. Tokens are filled per-send below.
//   ${SITE_URL}         e.g. https://formfollowsbrand.pub
//   ${BUY_URL}          where the book is sold
//   ${FORMAT_LINE}      small line under the CTA (price / format)
//   ${UNSUBSCRIBE_URL}  per-recipient unsubscribe link
// ---------------------------------------------------------------------------
function announcementEmail({ SITE_URL, BUY_URL, FORMAT_LINE, UNSUBSCRIBE_URL }) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<meta name="color-scheme" content="dark" />
<meta name="supported-color-schemes" content="dark" />
<title>It's here — Form Follows Brand is live</title>
</head>
<body style="margin:0;padding:0;background-color:#18191B;">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;">The book you signed up for is live. Form Follows Brand is available now.</div>
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#18191B;">
  <tr>
    <td align="center" style="padding:48px 24px 64px;">
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:560px;">

        <tr>
          <td style="padding-bottom:32px;border-bottom:1px solid #2D2F34;">
            <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:10px;font-weight:700;letter-spacing:0.18em;text-transform:uppercase;color:#52565C;">FORM / FOLLOWS / BRAND</p>
          </td>
        </tr>

        <tr>
          <td style="padding:40px 0 32px;">
            <p style="margin:0 0 10px;font-family:Arial,Helvetica,sans-serif;font-size:11px;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;color:#ED406B;">IT'S LIVE — AND YOU'RE FIRST TO KNOW.</p>
            <h1 style="margin:0 0 24px;font-family:Arial,Helvetica,sans-serif;font-size:34px;font-weight:300;line-height:1.12;color:#F4F1EA;letter-spacing:-0.02em;">The book is out<br />today.</h1>
            <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:16px;line-height:1.6;color:#B6BAC0;">You asked us to tell you the moment <em style="color:#E8E5DD;">Form Follows Brand</em> launched. This is that moment.</p>
          </td>
        </tr>

        <tr>
          <td background="${SITE_URL}/assets/email-glow.png" bgcolor="#18191B" align="center" style="background-color:#18191B;background-image:url('${SITE_URL}/assets/email-glow.png');background-repeat:no-repeat;background-position:center center;background-size:100% 100%;padding:48px 0 56px;">
            <a href="${BUY_URL}" style="text-decoration:none;">
              <img src="${SITE_URL}/assets/cover.webp" width="300" alt="Form Follows Brand — book cover" style="display:block;width:62%;max-width:300px;height:auto;margin:0 auto;border:0;outline:0;box-shadow:0 34px 64px -28px rgba(0,0,0,0.85);" />
            </a>
          </td>
        </tr>

        <tr>
          <td style="padding:0 0 36px;">
            <table cellpadding="0" cellspacing="0" border="0" width="100%">
              <tr>
                <td style="background:#ED406B;border-radius:2px;" align="center">
                  <a href="${BUY_URL}" style="display:block;padding:16px 26px;font-family:Arial,Helvetica,sans-serif;font-size:14px;font-weight:700;letter-spacing:0.01em;color:#ffffff;text-decoration:none;">Get your copy &rarr;</a>
                </td>
              </tr>
            </table>
            <p style="margin:14px 0 0;font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:1.5;color:#52565C;text-align:center;">${FORMAT_LINE}</p>
          </td>
        </tr>

        <tr><td style="border-top:1px solid #2D2F34;"></td></tr>

        <tr>
          <td style="padding:32px 0 8px;">
            <p style="margin:0 0 20px;font-family:Arial,Helvetica,sans-serif;font-size:10px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:#8C9097;">What's inside</p>
            <table cellpadding="0" cellspacing="0" border="0" width="100%">
              <tr><td valign="top" style="padding:0 0 16px;">
                <p style="margin:0 0 4px;font-family:Arial,Helvetica,sans-serif;font-size:15px;font-weight:600;color:#F4F1EA;">Why function stopped being the frontier</p>
                <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:1.6;color:#8C9097;">A century after Sullivan, competence is the floor — not the differentiator.</p>
              </td></tr>
              <tr><td valign="top" style="padding:0 0 16px;">
                <p style="margin:0 0 4px;font-family:Arial,Helvetica,sans-serif;font-size:15px;font-weight:600;color:#F4F1EA;">How every product decision moves the brand</p>
                <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:1.6;color:#8C9097;">A shared foundation for design and brand leaders solving the same problem.</p>
              </td></tr>
              <tr><td valign="top" style="padding:0 0 4px;">
                <p style="margin:0 0 4px;font-family:Arial,Helvetica,sans-serif;font-size:15px;font-weight:600;color:#F4F1EA;">Building something worth remembering</p>
                <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:1.6;color:#8C9097;">A working method, not a manifesto — what reinforces the brand and what quietly erodes it.</p>
              </td></tr>
            </table>
          </td>
        </tr>

        <tr><td style="border-top:1px solid #2D2F34;"></td></tr>

        <tr>
          <td style="padding:32px 0 0;">
            <p style="margin:0 0 16px;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.65;color:#B6BAC0;font-style:italic;">"I wrote this for the people who feel the gap between a great product and a great brand — and want to close it. Thank you for being here before the start line. I hope it earns its place on your shelf."</p>
            <p style="margin:0 0 2px;font-family:Arial,Helvetica,sans-serif;font-size:14px;font-weight:600;color:#F4F1EA;">Jayson Simeon</p>
            <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:10px;font-weight:700;letter-spacing:0.10em;text-transform:uppercase;color:#ED406B;">Author, Founder at Adaptitude</p>
          </td>
        </tr>

        <tr>
          <td style="padding:32px 0 0;">
            <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:11px;color:#3A3D42;line-height:1.6;">You're receiving this because you signed up at formfollowsbrand.pub for launch news. This is the launch. To unsubscribe, <a href="${UNSUBSCRIBE_URL}" style="color:#52565C;text-decoration:underline;">click here</a> or reply with "unsubscribe."</p>
          </td>
        </tr>

      </table>
    </td>
  </tr>
</table>
</body>
</html>`;
}

// Resend's batch endpoint accepts up to 100 messages per call.
function chunk(arr, n) {
  const out = [];
  for (let i = 0; i < arr.length; i += n) out.push(arr.slice(i, i + n));
  return out;
}

// ---------------------------------------------------------------------------
// POST /api/announce
//   Header:  x-announce-secret: <ANNOUNCE_SECRET>
//   Body (JSON, all optional):
//     { "test": "you@example.com" }   -> send ONLY to this address, don't mark anyone
//     { "dryRun": true }              -> count recipients, send nothing
//     { "limit": 50 }                 -> cap this run (useful for staged sends)
//
// Sends to every signup whose announced_at IS NULL, then stamps announced_at so
// re-running never double-sends. Safe to call repeatedly until "remaining": 0.
// ---------------------------------------------------------------------------
module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const secret = req.headers['x-announce-secret'];
  if (!process.env.ANNOUNCE_SECRET || secret !== process.env.ANNOUNCE_SECRET) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const body = req.body || {};
  const SITE_URL = process.env.SITE_URL || 'https://formfollowsbrand.pub';
  const FROM = process.env.FROM_EMAIL || 'Form Follows Brand <notify@formfollowsbrand.pub>';
  const BUY_URL = process.env.BUY_URL || SITE_URL;
  const FORMAT_LINE = process.env.ANNOUNCE_FORMAT_LINE || 'Available now &middot; formfollowsbrand.pub';
  const SUBJECT = process.env.ANNOUNCE_SUBJECT || "It's here — Form Follows Brand is live";

  const unsubFor = (email) =>
    `mailto:notify@formfollowsbrand.pub?subject=unsubscribe&body=${encodeURIComponent(email)}`;

  const buildHtml = (email) =>
    announcementEmail({ SITE_URL, BUY_URL, FORMAT_LINE, UNSUBSCRIBE_URL: unsubFor(email) });

  try {
    // --- TEST MODE: single address, no DB writes ---
    if (body.test) {
      await resend.emails.send({
        from: FROM, to: body.test, subject: SUBJECT, html: buildHtml(body.test),
      });
      return res.status(200).json({ status: 'ok', mode: 'test', sentTo: body.test });
    }

    const db = supabase();
    let query = db.from('signups').select('id,email').is('announced_at', null);
    if (body.limit) query = query.limit(body.limit);
    const { data: recipients, error } = await query;
    if (error) throw error;

    if (body.dryRun) {
      return res.status(200).json({ status: 'ok', mode: 'dryRun', recipients: recipients.length });
    }

    let sent = 0;
    for (const group of chunk(recipients, 100)) {
      await resend.batch.send(
        group.map((r) => ({ from: FROM, to: r.email, subject: SUBJECT, html: buildHtml(r.email) }))
      );
      const ids = group.map((r) => r.id);
      await db.from('signups').update({ announced_at: new Date().toISOString() }).in('id', ids);
      sent += group.length;
    }

    // anyone still unannounced (e.g. inserted mid-run, or limited run)
    const { count: remaining } = await db
      .from('signups').select('id', { count: 'exact', head: true }).is('announced_at', null);

    return res.status(200).json({ status: 'ok', mode: 'broadcast', sent, remaining: remaining ?? 0 });
  } catch (err) {
    console.error('[announce]', err?.message ?? err);
    return res.status(500).json({ error: 'Send failed — check logs.' });
  }
};
