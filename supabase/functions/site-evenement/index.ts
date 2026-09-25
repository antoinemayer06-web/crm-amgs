// Reçoit les événements de suivi du site marketing (vue de page, clics sur
// les boutons Calendly/email/LinkedIn/WhatsApp) et les enregistre dans
// evenements_site. Appelée depuis le site externe (hors de ce repo), donc
// authentifiée par une clé d'API statique (header x-api-key) plutôt que
// par un utilisateur Supabase — pas de session, donc pas d'owner_id
// disponible autrement qu'en variable d'environnement fixe.
//
// Fonction autonome (pas d'import partagé), déployable en un seul
// copier-coller depuis le Dashboard Supabase (Edge Functions).

import { createClient } from 'npm:@supabase/supabase-js@2.45.4'

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')
const SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
const SITE_API_KEY = Deno.env.get('SITE_API_KEY')
const OWNER_ID = Deno.env.get('OWNER_ID')

const TYPES_VALIDES = ['page_view', 'clic_calendly', 'clic_email', 'clic_linkedin', 'clic_whatsapp']

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

  let body
  try {
    body = await req.json()
  } catch {
    return json({ success: false, error: 'JSON invalide' }, 400)
  }

  const { type, page, session_id: sessionId } = body ?? {}

  if (typeof type !== 'string' || !TYPES_VALIDES.includes(type)) {
    return json(
      { success: false, error: `type invalide (attendu : ${TYPES_VALIDES.join(', ')})` },
      400,
    )
  }
  if (page !== undefined && page !== null && typeof page !== 'string') {
    return json({ success: false, error: 'page doit être une chaîne de caractères' }, 400)
  }
  if (sessionId !== undefined && sessionId !== null && typeof sessionId !== 'string') {
    return json({ success: false, error: 'session_id doit être une chaîne de caractères' }, 400)
  }

  const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY)

  const { data, error } = await supabase
    .from('evenements_site')
    .insert({
      owner_id: OWNER_ID,
      type,
      page: page || null,
      session_id: sessionId || null,
    })
    .select('id')
    .single()

  if (error) {
    console.error('Erreur insertion evenements_site:', error)
    return json({ success: false, error: 'Erreur serveur' }, 500)
  }

  return json({ success: true, id: data.id }, 201)
})
