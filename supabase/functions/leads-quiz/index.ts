// Reçoit les soumissions du quiz de qualification du site marketing et les
// enregistre dans demandes_site, avec une fiabilité maximale : validation
// stricte du payload (toute requête malformée est rejetée ET journalisée,
// jamais silencieusement ignorée), protection anti-doublon (même email +
// mêmes réponses dans les 5 minutes = une seule entrée), et un journal
// d'audit (journal_demandes_site) de CHAQUE tentative reçue — réussie ou
// échouée — pour pouvoir vérifier après coup qu'aucune réponse n'a été
// perdue. Crée aussi une notification CRM, envoie un email à l'adresse
// admin via Resend, ET une notification push immédiate (Web Push) — une
// nouvelle demande est urgente, elle ne doit pas attendre la fonction
// planifiée quotidienne (best-effort dans les deux cas : un échec
// d'email/push ne fait jamais échouer l'enregistrement de la demande).
//
// Authentifiée par clé d'API statique (header x-api-key), comme
// site-evenement — appelée depuis le site externe, sans session Supabase.
//
// Fonction autonome (pas d'import partagé), déployable en un seul
// copier-coller depuis le Dashboard Supabase (Edge Functions).

import { createClient } from 'npm:@supabase/supabase-js@2.45.4'
import webpush from 'npm:web-push@3.6.7'

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')
const SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
const SITE_API_KEY = Deno.env.get('SITE_API_KEY')
const OWNER_ID = Deno.env.get('OWNER_ID')
const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
const RESEND_FROM = Deno.env.get('RESEND_FROM') ?? 'AM Growth Solutions <onboarding@resend.dev>'
const ADMIN_EMAIL = Deno.env.get('ADMIN_EMAIL')
// URL publique du CRM (ex: https://mon-crm.vercel.app), utilisée pour
// construire le lien direct vers la demande dans l'email admin et dans la
// notification push. Si absente, les deux partent quand même sans lien.
const CRM_URL = Deno.env.get('CRM_URL')
// Mêmes clés VAPID que daily-notifications/calendar-alerts — déjà
// configurées si le Web Push fonctionne ailleurs dans le CRM.
const VAPID_PUBLIC_KEY = Deno.env.get('VAPID_PUBLIC_KEY')
const VAPID_PRIVATE_KEY = Deno.env.get('VAPID_PRIVATE_KEY')
const VAPID_SUBJECT = Deno.env.get('VAPID_SUBJECT') ?? 'mailto:contact.amagency.fr@gmail.com'

const DEDUP_WINDOW_MS = 5 * 60 * 1000
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-api-key',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
  })
}

// Sérialisation stable (clés triées) pour comparer deux objets `reponses`
// indépendamment de l'ordre dans lequel les clés ont été envoyées.
function canonicalize(value) {
  if (Array.isArray(value)) return value.map(canonicalize)
  if (value && typeof value === 'object') {
    return Object.keys(value)
      .sort()
      .reduce((acc, key) => {
        acc[key] = canonicalize(value[key])
        return acc
      }, {})
  }
  return value
}

function validatePayload(body) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return 'Corps de requête invalide (objet JSON attendu)'
  }
  const { nom, email, telephone, reponses, score } = body
  if (typeof email !== 'string' || !EMAIL_REGEX.test(email.trim())) {
    return 'email invalide ou manquant'
  }
  if (!reponses || typeof reponses !== 'object' || Array.isArray(reponses)) {
    return 'reponses invalide ou manquant (objet JSON attendu)'
  }
  if (nom !== undefined && nom !== null && typeof nom !== 'string') {
    return 'nom doit être une chaîne de caractères'
  }
  if (telephone !== undefined && telephone !== null && typeof telephone !== 'string') {
    return 'telephone doit être une chaîne de caractères'
  }
  if (score !== undefined && score !== null && typeof score !== 'number') {
    return 'score doit être un nombre'
  }
  return null
}

async function journaliser(supabase, { reussite, raisonErreur, payloadRecu, demandeId }) {
  const { error } = await supabase.from('journal_demandes_site').insert({
    owner_id: OWNER_ID,
    reussite,
    raison_erreur: raisonErreur ?? null,
    payload_recu: payloadRecu ?? null,
    demande_id: demandeId ?? null,
  })
  if (error) console.error('Erreur écriture journal_demandes_site:', error)
}

async function envoyerEmailAdmin(demande) {
  if (!RESEND_API_KEY || !ADMIN_EMAIL) {
    console.warn('RESEND_API_KEY ou ADMIN_EMAIL manquant : email admin non envoyé')
    return
  }
  const lien = CRM_URL ? `${CRM_URL.replace(/\/$/, '')}/site-internet?tab=demandes&open=${demande.id}` : null
  const html = `
    <div style="font-family: -apple-system, Arial, sans-serif; max-width: 480px; margin: 0 auto;">
      <h2 style="margin: 0 0 12px;">Nouvelle demande sur le site 🎯</h2>
      <p style="margin: 0 0 6px;"><strong>Nom :</strong> ${demande.nom || 'Non renseigné'}</p>
      <p style="margin: 0 0 6px;"><strong>Email :</strong> ${demande.email}</p>
      <p style="margin: 0 0 6px;"><strong>Score :</strong> ${demande.score ?? 'N/A'}</p>
      ${lien ? `<p style="margin: 16px 0 0;"><a href="${lien}" style="color:#2a78d6;">Voir la demande dans le CRM →</a></p>` : ''}
    </div>
  `
  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: RESEND_FROM,
        to: ADMIN_EMAIL,
        subject: `Nouvelle demande site — ${demande.nom || demande.email}`,
        html,
      }),
    })
    if (!response.ok) {
      console.error('Erreur Resend:', response.status, await response.text())
    }
  } catch (err) {
    console.error('Erreur envoi email Resend:', err)
  }
}

// Notification push immédiate (contrairement aux autres alertes, générées
// une fois par jour par daily-notifications) : une nouvelle demande arrive
// en direct, elle doit sonner tout de suite sur l'appareil de l'owner.
async function envoyerPushDemande(supabase, demande) {
  if (!VAPID_PUBLIC_KEY || !VAPID_PRIVATE_KEY) {
    console.warn('VAPID_PUBLIC_KEY/VAPID_PRIVATE_KEY manquantes : push non envoyé')
    return
  }
  webpush.setVapidDetails(VAPID_SUBJECT, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY)

  const { data: subscriptions, error } = await supabase
    .from('push_subscriptions')
    .select('id, endpoint, p256dh, auth')
    .eq('owner_id', OWNER_ID)
  if (error) {
    console.error('Erreur lecture push_subscriptions:', error)
    return
  }

  const url = CRM_URL
    ? `${CRM_URL.replace(/\/$/, '')}/site-internet?tab=demandes&open=${demande.id}`
    : `/site-internet?tab=demandes&open=${demande.id}`
  const payload = JSON.stringify({
    titre: 'Nouvelle demande site 🎯',
    message: `${demande.nom || demande.email}${demande.score !== null ? ` — score ${demande.score}` : ''}`,
    url,
  })

  for (const sub of subscriptions ?? []) {
    try {
      await webpush.sendNotification(
        { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
        payload,
      )
    } catch (err) {
      if (err?.statusCode === 404 || err?.statusCode === 410) {
        await supabase.from('push_subscriptions').delete().eq('id', sub.id)
      } else {
        console.error('Erreur envoi push:', err)
      }
    }
  }
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: CORS_HEADERS })
  }
  if (req.method !== 'POST') {
    return json({ success: false, error: 'Méthode non autorisée' }, 405)
  }
  if (!SUPABASE_URL || !SERVICE_ROLE_KEY || !SITE_API_KEY || !OWNER_ID) {
    return json({ success: false, error: 'Fonction mal configurée (variables d\'environnement manquantes)' }, 500)
  }

  if (req.headers.get('x-api-key') !== SITE_API_KEY) {
    return json({ success: false, error: 'Clé API invalide' }, 401)
  }

  const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY)

  let rawBody
  let body
  try {
    rawBody = await req.text()
    body = rawBody ? JSON.parse(rawBody) : null
  } catch {
    await journaliser(supabase, { reussite: false, raisonErreur: 'JSON invalide', payloadRecu: { raw: rawBody } })
    return json({ success: false, error: 'JSON invalide' }, 400)
  }

  const validationError = validatePayload(body)
  if (validationError) {
    console.error('Soumission quiz rejetée:', validationError, body)
    await journaliser(supabase, { reussite: false, raisonErreur: validationError, payloadRecu: body })
    return json({ success: false, error: validationError }, 400)
  }

  const { nom, email, telephone, reponses, score } = body
  const emailNormalise = email.trim().toLowerCase()
  const reponsesCanonique = JSON.stringify(canonicalize(reponses))

  // Anti-doublon : même email + mêmes réponses dans les 5 dernières
  // minutes => on ne recrée pas d'entrée, mais on journalise quand même
  // la tentative (traçabilité complète, cf. section fiabilité de la spec).
  const since = new Date(Date.now() - DEDUP_WINDOW_MS).toISOString()
  const { data: recentes, error: recentesError } = await supabase
    .from('demandes_site')
    .select('id, reponses')
    .eq('owner_id', OWNER_ID)
    .ilike('email', emailNormalise)
    .gte('created_at', since)

  if (recentesError) {
    console.error('Erreur recherche doublons demandes_site:', recentesError)
    await journaliser(supabase, {
      reussite: false,
      raisonErreur: `Erreur serveur (recherche doublons) : ${recentesError.message}`,
      payloadRecu: body,
    })
    return json({ success: false, error: 'Erreur serveur' }, 500)
  }

  const doublon = (recentes ?? []).find(
    (row) => JSON.stringify(canonicalize(row.reponses)) === reponsesCanonique,
  )
  if (doublon) {
    await journaliser(supabase, {
      reussite: true,
      raisonErreur: 'Doublon ignoré (même email + réponses < 5 min)',
      payloadRecu: body,
      demandeId: doublon.id,
    })
    return json({ success: true, duplicate: true, id: doublon.id }, 200)
  }

  const { data: demande, error: insertError } = await supabase
    .from('demandes_site')
    .insert({
      owner_id: OWNER_ID,
      nom: nom?.trim() || null,
      email: emailNormalise,
      telephone: telephone?.trim() || null,
      reponses,
      score: score ?? null,
      statut: 'Nouveau',
    })
    .select()
    .single()

  if (insertError) {
    console.error('Erreur insertion demandes_site:', insertError)
    await journaliser(supabase, {
      reussite: false,
      raisonErreur: `Erreur serveur (insertion) : ${insertError.message}`,
      payloadRecu: body,
    })
    return json({ success: false, error: 'Erreur serveur' }, 500)
  }

  await journaliser(supabase, { reussite: true, payloadRecu: body, demandeId: demande.id })

  const { error: notifError } = await supabase.from('notifications').insert({
    owner_id: OWNER_ID,
    type: 'nouvelle_demande_site',
    titre: 'Nouvelle demande site 🎯',
    message: `${demande.nom || demande.email}${demande.score !== null ? ` — score ${demande.score}` : ''}`,
    entite_type: 'demande_site',
    entite_id: demande.id,
  })
  if (notifError) console.error('Erreur création notification:', notifError)

  await Promise.all([envoyerEmailAdmin(demande), envoyerPushDemande(supabase, demande)])

  return json({ success: true, id: demande.id }, 201)
})
