import { NextResponse } from "next/server";
import { sendEmail } from "@/lib/email";
import { SITE_URL } from "@/lib/site";

// Nécessite RESEND_API_KEY et CONTACT_TO_EMAIL (+ optionnellement
// CONTACT_FROM_EMAIL) en variables d'environnement — voir .env.example.
// Les mêmes variables que le formulaire de contact (app/api/contact).

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface DiagnosticBody {
  name?: string;
  email?: string;
  phone?: string;
  honeypot?: string;
  levelLabel?: string;
  personalizedPhrase?: string;
  serviceLabel?: string;
  serviceHref?: string;
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

  // L'e-mail admin est la partie critique (c'est le lead) : un échec est
  // remonté à l'utilisateur. L'e-mail visiteur est envoyé en best-effort
  // juste après — le lead est déjà capté côté admin, un souci de
  // délivrabilité sur l'adresse du visiteur ne doit pas faire échouer la
  // confirmation qu'il voit à l'écran.
  try {
    await sendEmail({
      to: toEmail,
      subject: `Nouveau diagnostic — ${name} (${body.levelLabel})`,
      text: [
        `Nom : ${name}`,
        `Email : ${email}`,
        body.phone ? `Téléphone : ${body.phone}` : null,
        `Niveau obtenu : ${body.levelLabel}`,
        "",
        "Réponses au quiz :",
        ...body.answers.map((a) => `- ${a.question} : ${a.answer}`),
      ]
        .filter(Boolean)
        .join("\n"),
    });
  } catch (err) {
    console.error("[diagnostic] notification admin échouée:", err);
    return NextResponse.json(
      { ok: false, error: "send_failed" },
      { status: 502 }
    );
  }

  try {
    await sendEmail({
      to: email,
      subject: "Votre diagnostic d'automatisation — AM Growth Solutions",
      text: [
        `Bonjour ${name},`,
        "",
        `Votre résultat : ${body.levelLabel}`,
        body.personalizedPhrase ?? null,
        body.serviceHref
          ? `Pour en savoir plus : ${SITE_URL}${body.serviceHref}`
          : null,
        "",
        `Prendre rendez-vous : ${SITE_URL}/contact`,
        "",
        "— Antoine Mayer, AM Growth Solutions",
      ]
        .filter(Boolean)
        .join("\n"),
    });
  } catch (err) {
    console.error("[diagnostic] envoi visiteur échoué:", err);
  }

  return NextResponse.json({ ok: true });
}
