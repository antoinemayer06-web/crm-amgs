import { NextResponse } from "next/server";
import { sendEmail } from "@/lib/email";

// Nécessite RESEND_API_KEY et CONTACT_TO_EMAIL (+ optionnellement
// CONTACT_FROM_EMAIL) en variables d'environnement — voir .env.example.

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface ContactBody {
  name?: string;
  email?: string;
  phone?: string;
  message?: string;
  honeypot?: string;
}

export async function POST(request: Request) {
  let body: ContactBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  // Honeypot : les bots remplissent ce champ caché, les humains non.
  // On répond succès sans rien envoyer, pour ne pas révéler le piège.
  if (body.honeypot) {
    return NextResponse.json({ ok: true });
  }

  const email = body.email?.trim() ?? "";
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json(
      { ok: false, error: "invalid_email" },
      { status: 400 }
    );
  }

  const name = body.name?.trim();
  const message = body.message?.trim();
  if (!name || !message) {
    return NextResponse.json(
      { ok: false, error: "missing_fields" },
      { status: 400 }
    );
  }

  const toEmail = process.env.CONTACT_TO_EMAIL;
  if (!toEmail) {
    console.error("[contact] CONTACT_TO_EMAIL manquante (voir .env.example)");
    return NextResponse.json(
      { ok: false, error: "send_failed" },
      { status: 502 }
    );
  }

  try {
    await sendEmail({
      to: toEmail,
      subject: `Nouvelle demande de contact — ${name}`,
      text: [
        `Nom : ${name}`,
        `Email : ${email}`,
        body.phone ? `Téléphone : ${body.phone}` : null,
        "",
        message,
      ]
        .filter(Boolean)
        .join("\n"),
    });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[contact] envoi du message échoué:", err);
    return NextResponse.json(
      { ok: false, error: "send_failed" },
      { status: 502 }
    );
  }
}
