import "server-only";
import { Resend } from "resend";
import { isResendConfigured } from "./supabase/config";
import { formatPrice, site } from "./site";
import type { NewContact, NewOrder } from "./data";

function getResend(): Resend | null {
  if (!isResendConfigured()) return null;
  return new Resend(process.env.RESEND_API_KEY);
}

/**
 * Inbox that receives reservation + contact notifications. Separate from
 * ADMIN_EMAIL (the dashboard login) so the two can be moved independently.
 */
function adminEmail(): string {
  return (
    process.env.NOTIFICATION_EMAIL ||
    process.env.ADMIN_EMAIL ||
    site.email
  );
}

function fromEmail(): string {
  return (
    process.env.RESEND_FROM_EMAIL || `${site.shortName} <onboarding@resend.dev>`
  );
}

const wrap = (title: string, body: string) => `
  <div style="font-family:Georgia,serif;background:#eff8f2;padding:32px 16px;">
    <div style="max-width:560px;margin:0 auto;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #cddbd0;">
      <div style="background:#0f3423;color:#fff;padding:22px 28px;">
        <h1 style="margin:0;font-size:19px;letter-spacing:0.01em;">${site.shortName}</h1>
        <p style="margin:4px 0 0;font-size:12px;color:#e0a92f;letter-spacing:0.08em;text-transform:uppercase;">Primate Nursery</p>
      </div>
      <div style="padding:28px;color:#1b2420;font-size:15px;line-height:1.6;">
        <h2 style="margin-top:0;font-size:18px;">${title}</h2>
        ${body}
      </div>
      <div style="padding:16px 28px;background:#eef4ee;color:#55685e;font-size:12px;">
        Sent automatically by the ${site.name} website.
      </div>
    </div>
  </div>`;

const row = (label: string, value: string) =>
  `<tr>
    <td style="padding:6px 12px 6px 0;color:#55685e;white-space:nowrap;vertical-align:top;">${label}</td>
    <td style="padding:6px 0;">${value}</td>
  </tr>`;

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

/** Emails the admin about a new reservation. Silently skips if Resend isn't configured. */
export async function sendOrderNotification(order: NewOrder): Promise<void> {
  const resend = getResend();
  if (!resend) {
    console.log("[preview] Resend not configured; reservation email skipped.");
    return;
  }
  const total = order.items.reduce((sum, item) => sum + item.price, 0);
  const itemsHtml = order.items
    .map(
      (item) =>
        `<li>${escapeHtml(item.monkey_name)} (${escapeHtml(
          item.monkey_species
        )}) &middot; <strong>${formatPrice(item.price)}</strong></li>`
    )
    .join("");
  const fulfilmentLabel =
    order.fulfilment === "delivery" ? "Delivery to their address" : "Pickup in person";

  const html = wrap(
    "New reservation request",
    `<table style="border-collapse:collapse;">
      ${row("Family", escapeHtml(order.customer_name))}
      ${row("Email", escapeHtml(order.email))}
      ${row("Phone", escapeHtml(order.phone) || "-")}
      ${row("Location", escapeHtml([order.city, order.state].filter(Boolean).join(", ")) || "-")}
      ${row("Prefers", fulfilmentLabel)}
    </table>
    <p style="margin:16px 0 4px;color:#55685e;">Monkeys requested</p>
    <ul style="margin:0 0 16px;padding-left:20px;">${itemsHtml}</ul>
    <p style="margin:0 0 16px;"><strong>Total: ${formatPrice(total)}</strong></p>
    ${
      order.message
        ? `<p style="margin:0 0 4px;color:#55685e;">Message from the family</p>
           <p style="margin:0;background:#eef4ee;border-radius:8px;padding:12px;">${escapeHtml(order.message)}</p>`
        : ""
    }
    <p style="margin-top:20px;">Reply at
      <a href="mailto:${escapeHtml(order.email)}" style="color:#16492f;font-weight:bold;">${escapeHtml(order.email)}</a>
      to confirm the ${formatPrice(site.appointmentDeposit)} deposit and arrange the appointment.</p>`
  );

  const { error } = await resend.emails.send({
    from: fromEmail(),
    to: adminEmail(),
    replyTo: order.email,
    subject: `New reservation from ${order.customer_name} (${formatPrice(total)})`,
    html,
  });
  if (error) throw new Error(`Failed to send reservation email: ${error.message}`);

  // Best-effort confirmation to the family. The admin has already been
  // notified above, so a failure here must not fail the reservation.
  try {
    await resend.emails.send({
      from: fromEmail(),
      to: order.email,
      replyTo: adminEmail(),
      subject: `We received your reservation - ${site.shortName}`,
      html: wrap(
        "Thank you for your reservation request",
        `<p>Hi ${escapeHtml(order.customer_name)},</p>
         <p>We have your request and we will reply within 24 hours to talk
         through the next steps, answer your questions, and confirm whether
         you'd like delivery or a pickup appointment.</p>
         <ul style="padding-left:20px;">${itemsHtml}</ul>
         <p><strong>A note on appointments:</strong> pickup and visit
         appointments are secured with a fully refundable
         ${formatPrice(site.appointmentDeposit)} deposit, which is applied to
         your balance if you go ahead.</p>
         <p>Questions in the meantime? Reply to this email, or call us at
         ${site.phone}.</p>
         <p>Warmly,<br/>The ${site.shortName} family</p>`
      ),
    });
  } catch (err) {
    console.error("Reservation confirmation email failed:", err);
  }
}

/** Emails the admin about a new contact-form message. */
export async function sendContactNotification(
  contact: NewContact
): Promise<void> {
  const resend = getResend();
  if (!resend) {
    console.log("[preview] Resend not configured; contact email skipped.");
    return;
  }
  const html = wrap(
    "New message from the contact form",
    `<table style="border-collapse:collapse;">
      ${row("Name", escapeHtml(contact.name))}
      ${row("Email", escapeHtml(contact.email))}
      ${row("Phone", escapeHtml(contact.phone) || "-")}
      ${row("Subject", escapeHtml(contact.subject) || "-")}
    </table>
    <p style="margin:16px 0 4px;color:#55685e;">Message</p>
    <p style="margin:0;background:#eef4ee;border-radius:8px;padding:12px;">${escapeHtml(contact.message)}</p>`
  );

  const { error } = await resend.emails.send({
    from: fromEmail(),
    to: adminEmail(),
    replyTo: contact.email,
    subject: `Contact form: ${contact.subject || contact.name}`,
    html,
  });
  if (error) throw new Error(`Failed to send contact email: ${error.message}`);

  // Best-effort confirmation to the sender, so they know it arrived.
  try {
    await resend.emails.send({
      from: fromEmail(),
      to: contact.email,
      replyTo: adminEmail(),
      subject: `We got your message - ${site.shortName}`,
      html: wrap(
        "Thanks for getting in touch",
        `<p>Hi ${escapeHtml(contact.name.split(" ")[0] || contact.name)},</p>
         <p>Your message reached us and one of us will read it personally. We
         reply within 24 hours, and usually much sooner. Our hours are
         ${site.hours}.</p>
         ${
           contact.subject
             ? `<p style="margin:16px 0 4px;color:#55685e;">You wrote about</p>
                <p style="margin:0 0 16px;font-weight:bold;">${escapeHtml(contact.subject)}</p>`
             : ""
         }
         <p style="margin:0 0 4px;color:#55685e;">Your message</p>
         <p style="margin:0;background:#eef4ee;border-radius:8px;padding:12px;">${escapeHtml(contact.message)}</p>
         <p style="margin-top:20px;">If you need us sooner, call ${site.phone}.
         There is no need to send your message again.</p>
         <p>Warmly,<br/>The ${site.shortName} family</p>`
      ),
    });
  } catch (err) {
    console.error("Contact confirmation email failed:", err);
  }
}
