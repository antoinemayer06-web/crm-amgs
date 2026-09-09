import { NextResponse } from "next/server";
import { CHECKLIST } from "@/lib/checklist";

// Nécessite RESEND_API_KEY (+ optionnellement CONTACT_TO_EMAIL et
// CONTACT_FROM_EMAIL) en variables d'environnement — voir .env.example.
// Sans clé, la route répond une erreur claire pour le formulaire de
// contact (l'utilisateur est alors renvoyé vers WhatsApp/Calendly), mais
// ne bloque jamais la promesse faite au lead magnet : voir plus bas.

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface ContactBody {
  type: "contact" | "lead-magnet";
  name?: string;
  email?: string;
  phone?: string;
  message?: string;
  honeypot?: string;
}

async function sendEmail(subject: string, text: string) {
  const apiKey = process.env.RESEND_API_KEY;
  const toEmail = process.env.CONTACT_TO_EMAIL;
  if (!apiKey || !toEmail) {
    throw new Error(
      "RESEND_API_KEY et/ou CONTACT_TO_EMAIL manquantes (voir .env.example)"
    );
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
      to: [toEmail],
      subject,
      text,
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Resend a répondu ${res.status}: ${body}`);
  }
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

  if (body.type === "lead-magnet") {
    // La promesse ("laissez votre email, recevez la checklist") est tenue
    // côté client quoi qu'il arrive ici — voir components/LeadMagnet.tsx.
    // On tente juste de prévenir Antoine, sans bloquer sur un échec.
    try {
      await sendEmail(
        `Nouveau téléchargement checklist — ${email}`,
        `${email} vient de télécharger « ${CHECKLIST.title} ».`
      );
    } catch (err) {
      console.error("[contact] notification lead-magnet échouée:", err);
    }
    return NextResponse.json({ ok: true });
  }

  // type === "contact" : ici l'échec doit être visible côté utilisateur,
  // pour qu'il se rabatte sur WhatsApp/Calendly plutôt que de croire que
  // son message est parti.
  const name = body.name?.trim();
  const message = body.message?.trim();
  if (!name || !message) {
    return NextResponse.json(
      { ok: false, error: "missing_fields" },
      { status: 400 }
    );
  }

  try {
    await sendEmail(
      `Nouvelle demande de contact — ${name}`,
      [
        `Nom : ${name}`,
        `Email : ${email}`,
        body.phone ? `Téléphone : ${body.phone}` : null,
        "",
        message,
      ]
        .filter(Boolean)
        .join("\n")
    );
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[contact] envoi du message échoué:", err);
    return NextResponse.json(
      { ok: false, error: "send_failed" },
      { status: 502 }
    );
  }
}
