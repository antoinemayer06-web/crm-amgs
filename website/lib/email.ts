// Envoi d'e-mails transactionnels via Resend — partagé entre le formulaire
// de contact et le diagnostic (app/api/contact, app/api/diagnostic).
// Nécessite RESEND_API_KEY (+ CONTACT_FROM_EMAIL optionnel) en variables
// d'environnement — voir .env.example.
export async function sendEmail({
  to,
  subject,
  text,
}: {
  to: string;
  subject: string;
  text: string;
}) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error("RESEND_API_KEY manquante (voir .env.example)");
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from:
        process.env.CONTACT_FROM_EMAIL ??
        "AM Growth Solutions <onboarding@resend.dev>",
      to: [to],
      subject,
      text,
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Resend a répondu ${res.status}: ${body}`);
  }
}
