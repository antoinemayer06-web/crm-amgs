import { NextResponse } from "next/server";

// Seul chemin de sortie pour le quiz /diagnostic : appelé une fois, au
// clic sur le bouton final du formulaire (nom/email/téléphone) affiché
// sous le résultat — jamais avant, jamais pendant les questions. Relaie
// vers l'Edge Function Supabase "leads-quiz" du CRM (CRM_LEADS_QUIZ_URL),
// authentifiée par CRM_SITE_API_KEY en header — cette clé ne vit que
// côté serveur, jamais exposée au navigateur. Pas de Resend ici : c'est
// le CRM (leads-quiz) qui envoie l'email admin de son côté.

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface QuizSubmitBody {
  nom?: string;
  email?: string;
  telephone?: string;
  honeypot?: string;
  score?: number;
  reponses?: { question: string; answer: string }[];
}

export async function POST(request: Request) {
  let body: QuizSubmitBody;
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
    return NextResponse.json({ ok: false, error: "invalid_email" }, { status: 400 });
  }

  if (!Array.isArray(body.reponses) || body.reponses.length === 0) {
    return NextResponse.json({ ok: false, error: "missing_fields" }, { status: 400 });
  }

  const url = process.env.CRM_LEADS_QUIZ_URL;
  const apiKey = process.env.CRM_SITE_API_KEY;
  if (!url || !apiKey) {
    console.error("[quiz-submit] CRM_LEADS_QUIZ_URL et/ou CRM_SITE_API_KEY manquantes");
    return NextResponse.json({ ok: false, error: "send_failed" }, { status: 502 });
  }

  // L'Edge Function leads-quiz attend `reponses` comme un objet JSON
  // simple { question: réponse } — elle rejette explicitement un tableau
  // (voir supabase/functions/leads-quiz/index.ts, validatePayload).
  const reponses = Object.fromEntries(
    body.reponses.map((r) => [r.question, r.answer])
  );

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
      },
      body: JSON.stringify({
        nom: body.nom?.trim() || null,
        email,
        telephone: body.telephone?.trim() || null,
        reponses,
        score: typeof body.score === "number" ? body.score : null,
      }),
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`CRM a répondu ${res.status}: ${text}`);
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[quiz-submit] relais CRM échoué:", err);
    return NextResponse.json({ ok: false, error: "send_failed" }, { status: 502 });
  }
}
