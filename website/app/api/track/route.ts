import { NextResponse } from "next/server";

// Relaie côté serveur les événements de suivi (page_view, clics
// Calendly/email/LinkedIn/WhatsApp) vers l'Edge Function Supabase
// site-evenement du CRM. La clé CRM_SITE_API_KEY reste uniquement en
// variable d'environnement serveur — jamais exposée au navigateur.
// Répond toujours 200 : un échec de tracking ne doit jamais remonter
// d'erreur visible au visiteur.
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false }, { status: 200 });
  }

  const url = process.env.CRM_SITE_EVENEMENT_URL;
  const apiKey = process.env.CRM_SITE_API_KEY;
  if (!url || !apiKey) {
    console.error("[track] CRM_SITE_EVENEMENT_URL ou CRM_SITE_API_KEY manquante");
    return NextResponse.json({ ok: false, error: "missing_config" }, { status: 200 });
  }

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-api-key": apiKey },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const text = await res.text();
      console.error(`[track] CRM a répondu ${res.status}: ${text}`);
      return NextResponse.json(
        { ok: false, error: `crm_rejected_${res.status}` },
        { status: 200 }
      );
    }
  } catch (err) {
    console.error("[track] échec relais vers le CRM (réseau/DNS):", err);
    return NextResponse.json({ ok: false, error: "network_error" }, { status: 200 });
  }

  return NextResponse.json({ ok: true });
}
