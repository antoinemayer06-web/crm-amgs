import { NextResponse } from "next/server";
import { sendEmail } from "@/lib/email";

// Nécessite RESEND_API_KEY et CONTACT_TO_EMAIL en variables
// d'environnement — voir .env.example. Les mêmes variables que le
// formulaire de contact (app/api/contact). Un seul e-mail est envoyé, à
// CONTACT_TO_EMAIL — rien n'est renvoyé automatiquement au visiteur, le
// suivi se fait à la main par Antoine à partir de cet e-mail.

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface DiagnosticBody {
  name?: string;
  email?: string;
  honeypot?: string;
  levelLabel?: string;
  answers?: { question: string; answer: string }[];
}

export async function POST(request: Request) {
  let body: DiagnosticBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

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
  if (!name || !body.levelLabel || !Array.isArray(body.answers)) {
    return NextResponse.json(
      { ok: false, error: "missing_fields" },
      { status: 400 }
    );
  }

  const toEmail = process.env.CONTACT_TO_EMAIL;
  if (!toEmail) {
    console.error("[diagnostic] CONTACT_TO_EMAIL manquante (voir .env.example)");
    return NextResponse.json(
      { ok: false, error: "send_failed" },
      { status: 502 }
    );
  }

  try {
    await sendEmail({
      to: toEmail,
      subject: `Nouveau diagnostic — ${name} (${body.levelLabel})`,
      text: [
        `Nom : ${name}`,
        `Email : ${email}`,
        `Niveau obtenu : ${body.levelLabel}`,
        "",
        "Réponses au quiz :",
        ...body.answers.map((a) => `- ${a.question} : ${a.answer}`),
      ].join("\n"),
    });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[diagnostic] notification admin échouée:", err);
    return NextResponse.json(
      { ok: false, error: "send_failed" },
      { status: 502 }
    );
  }
}
