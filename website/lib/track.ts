"use client";

// Suivi anonyme des visites/clics pour le CRM (section "Site internet") :
// relayé côté serveur par app/api/track (voir ce fichier pour la clé
// d'API), jamais appelé directement depuis le navigateur vers Supabase.
// Best-effort uniquement — une erreur ici ne doit jamais impacter le
// visiteur.

const SESSION_KEY = "am-site-session-id";

function getSessionId(): string {
  if (typeof window === "undefined") return "";
  try {
    let id = window.localStorage.getItem(SESSION_KEY);
    if (!id) {
      id = crypto.randomUUID();
      window.localStorage.setItem(SESSION_KEY, id);
    }
    return id;
  } catch {
    return "";
  }
}

export type SiteEventType =
  | "page_view"
  | "clic_calendly"
  | "clic_email"
  | "clic_linkedin"
  | "clic_whatsapp";

export function trackEvent(type: SiteEventType, page?: string) {
  if (typeof window === "undefined") return;
  try {
    const body = JSON.stringify({
      type,
      page: page ?? window.location.pathname,
      session_id: getSessionId(),
    });
    if (navigator.sendBeacon) {
      navigator.sendBeacon("/api/track", new Blob([body], { type: "application/json" }));
    } else {
      fetch("/api/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body,
        keepalive: true,
      }).catch(() => {});
    }
  } catch {
    // Ne jamais bloquer/casser l'expérience visiteur pour du tracking.
  }
}
