import { Resend } from "resend";

const FROM = "AVIRA <noreply@avira.in>";
const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://avira.in";

function getResend() {
  return new Resend(process.env.RESEND_API_KEY ?? "re_placeholder");
}

function baseLayout(content: string) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>AVIRA</title>
</head>
<body style="margin:0;padding:0;background:#FBF7F2;font-family:Georgia,serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#FBF7F2;">
  <tr><td align="center" style="padding:40px 20px;">
    <table width="560" cellpadding="0" cellspacing="0" style="background:#fff;max-width:560px;width:100%;">
      <!-- Header -->
      <tr>
        <td style="background:#54283C;padding:28px 40px;text-align:center;">
          <p style="margin:0;font-family:Georgia,serif;font-size:22px;letter-spacing:6px;color:#FBF7F2;">AVIRA</p>
          <p style="margin:6px 0 0;font-size:11px;color:#DEB896;letter-spacing:2px;">LITTLE THINGS. BEAUTIFUL YOU.</p>
        </td>
      </tr>
      <!-- Content -->
      <tr><td style="padding:40px;">${content}</td></tr>
      <!-- Footer -->
      <tr>
        <td style="padding:24px 40px;border-top:1px solid #F0DDD5;text-align:center;">
          <p style="margin:0;font-size:11px;color:#9B8F89;">
            © ${new Date().getFullYear()} AVIRA · All rights reserved<br/>
            <a href="${APP_URL}/unsubscribe" style="color:#54283C;">Unsubscribe</a>
          </p>
        </td>
      </tr>
    </table>
  </td></tr>
</table>
</body>
</html>`;
}

function btn(text: string, url: string) {
  return `<a href="${url}" style="display:inline-block;background:#54283C;color:#FBF7F2;padding:14px 32px;font-size:12px;letter-spacing:2px;text-decoration:none;text-transform:uppercase;">${text}</a>`;
}

export async function sendWelcomeEmail(to: string, name: string) {
  const html = baseLayout(`
    <h2 style="margin:0 0 12px;font-size:26px;color:#2C2521;">Welcome to AVIRA, ${name || "beautiful"}.</h2>
    <p style="color:#9B8F89;font-size:15px;line-height:1.7;margin:0 0 24px;">
      We're so glad you're here. AVIRA was made for moments — for the little things that make every day more beautiful.
    </p>
    <p style="color:#9B8F89;font-size:15px;line-height:1.7;margin:0 0 32px;">
      As a welcome gift, your first order gets <strong style="color:#54283C;">10% off</strong> — automatically applied at checkout.
    </p>
    <div style="text-align:center;">${btn("Start Shopping", APP_URL)}</div>
  `);

  await getResend().emails.send({ from: FROM, to, subject: "Welcome to AVIRA ✨", html });
}

export async function sendOrderConfirmationEmail(to: string, order: {
  orderNumber: string;
  firstName: string;
  items: { title: string; qty: number; price: number }[];
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
}) {
  const itemRows = order.items.map((item) =>
    `<tr>
      <td style="padding:8px 0;font-size:14px;color:#2C2521;">${item.title}</td>
      <td style="padding:8px 0;font-size:14px;color:#9B8F89;text-align:right;">×${item.qty}</td>
      <td style="padding:8px 0;font-size:14px;color:#2C2521;text-align:right;">₹${item.price.toFixed(2)}</td>
    </tr>`
  ).join("");

  const html = baseLayout(`
    <h2 style="margin:0 0 8px;font-size:22px;color:#2C2521;">Order Confirmed</h2>
    <p style="color:#9B8F89;font-size:13px;margin:0 0 24px;">Order #${order.orderNumber}</p>
    <p style="color:#4A3F3B;font-size:15px;line-height:1.7;margin:0 0 24px;">
      Hi ${order.firstName}, your order is confirmed and we're getting it ready for you. ✨
    </p>
    <table width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid #F0DDD5;border-bottom:1px solid #F0DDD5;margin-bottom:24px;">
      <tbody>${itemRows}</tbody>
    </table>
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
      <tr><td style="font-size:13px;color:#9B8F89;">Subtotal</td><td style="font-size:13px;color:#9B8F89;text-align:right;">₹${order.subtotal.toFixed(2)}</td></tr>
      ${order.discount > 0 ? `<tr><td style="font-size:13px;color:#54283C;">Discount</td><td style="font-size:13px;color:#54283C;text-align:right;">−₹${order.discount.toFixed(2)}</td></tr>` : ""}
      <tr><td style="font-size:13px;color:#9B8F89;">Shipping</td><td style="font-size:13px;color:#9B8F89;text-align:right;">${order.shipping === 0 ? "Free" : `₹${order.shipping.toFixed(2)}`}</td></tr>
      <tr><td style="padding-top:8px;font-size:15px;font-weight:bold;color:#2C2521;">Total</td><td style="padding-top:8px;font-size:15px;font-weight:bold;color:#2C2521;text-align:right;">₹${order.total.toFixed(2)}</td></tr>
    </table>
    <div style="text-align:center;">${btn("Track Your Order", `${APP_URL}/track-order`)}</div>
  `);

  await getResend().emails.send({ from: FROM, to, subject: `Order Confirmed — #${order.orderNumber} | AVIRA`, html });
}

export async function sendShippedEmail(to: string, data: {
  firstName: string;
  orderNumber: string;
  carrier: string;
  trackingNumber: string;
  trackingUrl?: string;
}) {
  const html = baseLayout(`
    <h2 style="margin:0 0 12px;font-size:22px;color:#2C2521;">Your order is on its way! 🚚</h2>
    <p style="color:#4A3F3B;font-size:15px;line-height:1.7;margin:0 0 16px;">
      Hi ${data.firstName}, your order #${data.orderNumber} has been shipped and is heading to you.
    </p>
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#FBF7F2;padding:16px;margin-bottom:32px;">
      <tr>
        <td style="font-size:13px;color:#9B8F89;padding:4px 0;">Carrier</td>
        <td style="font-size:13px;color:#2C2521;text-align:right;padding:4px 0;">${data.carrier}</td>
      </tr>
      <tr>
        <td style="font-size:13px;color:#9B8F89;padding:4px 0;">Tracking No.</td>
        <td style="font-size:13px;color:#54283C;text-align:right;padding:4px 0;">${data.trackingNumber}</td>
      </tr>
    </table>
    <div style="text-align:center;">
      ${data.trackingUrl ? btn("Track Shipment", data.trackingUrl) : btn("Track Your Order", `${APP_URL}/track-order`)}
    </div>
  `);

  await getResend().emails.send({ from: FROM, to, subject: `Your AVIRA order is shipped — #${data.orderNumber}`, html });
}

export async function sendAbandonedCartEmail(to: string, data: {
  firstName: string;
  items: { title: string; imageUrl?: string; price: number }[];
  couponCode?: string;
}) {
  const html = baseLayout(`
    <h2 style="margin:0 0 12px;font-size:22px;color:#2C2521;">You left something beautiful behind</h2>
    <p style="color:#4A3F3B;font-size:15px;line-height:1.7;margin:0 0 24px;">
      Hi ${data.firstName}, your cart is waiting. These pieces are still available — for now.
    </p>
    <div style="margin-bottom:24px;">
      ${data.items.slice(0, 3).map((item) => `
        <div style="display:flex;align-items:center;gap:12px;margin-bottom:12px;border-bottom:1px solid #F0DDD5;padding-bottom:12px;">
          <p style="margin:0;font-size:14px;color:#2C2521;">${item.title} — ₹${item.price.toFixed(2)}</p>
        </div>
      `).join("")}
    </div>
    ${data.couponCode ? `<p style="font-size:14px;color:#54283C;margin-bottom:24px;">Use code <strong>${data.couponCode}</strong> for an extra 10% off today.</p>` : ""}
    <div style="text-align:center;">${btn("Complete Your Order", `${APP_URL}/checkout`)}</div>
  `);

  await getResend().emails.send({ from: FROM, to, subject: "Your cart misses you — AVIRA", html });
}
