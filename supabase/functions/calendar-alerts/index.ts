// Fonction planifiée à exécuter fréquemment (toutes les 15 minutes,
// voir le cron dédié — indépendant du cron quotidien daily-notifications
// car un rappel "15 minutes avant" ne peut pas attendre un cron une
// fois par jour). Vérifie les calendar_events dont l'heure de rappel
// (date_debut - alerte_avant_minutes) est atteinte, insère une
// notification (jamais de doublon) et envoie une vraie notification
// push à chaque abonnement enregistré.
//
// Fonction volontairement autonome (pas d'import partagé avec
// daily-notifications) pour rester déployable en un seul copier-coller
// dans le Dashboard Supabase, comme les autres fonctions de ce projet.

import { createClient } from 'npm:@supabase/supabase-js@2.45.4'
import webpush from 'npm:web-push@3.6.7'

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')
const SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
const VAPID_PUBLIC_KEY = Deno.env.get('VAPID_PUBLIC_KEY')
const VAPID_PRIVATE_KEY = Deno.env.get('VAPID_PRIVATE_KEY')
const VAPID_SUBJECT = Deno.env.get('VAPID_SUBJECT') ?? 'mailto:contact.amagency.fr@gmail.com'

Deno.serve(async (_req) => {
  if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
    return new Response(JSON.stringify({ error: 'Missing Supabase service role env vars' }), {
      status: 500,
    })
  }

  const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY)

  if (VAPID_PUBLIC_KEY && VAPID_PRIVATE_KEY) {
    webpush.setVapidDetails(VAPID_SUBJECT, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY)
  }

  const now = new Date()
  const summary = { usersProcessed: 0, notificationsCreated: 0, pushSent: 0, pushErrors: 0 }

  let page = 1
  const users = []
  for (;;) {
    const { data, error } = await supabase.auth.admin.listUsers({ page, perPage: 200 })
    if (error) throw error
    users.push(...data.users)
    if (data.users.length < 200) break
    page += 1
  }

  for (const user of users) {
    const ownerId = user.id
    summary.usersProcessed += 1

    const { data: settingsRow } = await supabase
      .from('notification_settings')
      .select('types_actifs')
      .eq('owner_id', ownerId)
      .maybeSingle()
    const evenementCalendrierActif = settingsRow?.types_actifs?.evenement_calendrier ?? true
    if (!evenementCalendrierActif) continue

    const { data: events, error } = await supabase
      .from('calendar_events')
      .select('id, titre, date_debut, alerte_avant_minutes')
      .eq('owner_id', ownerId)
      .not('alerte_avant_minutes', 'is', null)
      .gt('date_debut', now.toISOString())
    if (error) throw error

    const dueEvents = (events ?? []).filter((event) => {
      const alertTime = new Date(event.date_debut).getTime() - event.alerte_avant_minutes * 60_000
      return alertTime <= now.getTime()
    })
    if (dueEvents.length === 0) continue

    const toInsert = []
    for (const event of dueEvents) {
      const { count, error: dupError } = await supabase
        .from('notifications')
        .select('id', { count: 'exact', head: true })
        .eq('owner_id', ownerId)
        .eq('type', 'evenement_calendrier')
        .eq('entite_id', event.id)
        .eq('lue', false)
      if (dupError) throw dupError
      if ((count ?? 0) > 0) continue

      const heure = new Date(event.date_debut).toLocaleString('fr-FR', {
        dateStyle: 'short',
        timeStyle: 'short',
      })
      toInsert.push({
        owner_id: ownerId,
        type: 'evenement_calendrier',
        titre: 'Événement à venir 🔔',
        message: `${event.titre} — ${heure}`,
        entite_type: 'calendar_event',
        entite_id: event.id,
      })
    }
    if (toInsert.length === 0) continue

    const { data: inserted, error: insertError } = await supabase
      .from('notifications')
      .insert(toInsert)
      .select('titre, message, entite_id')
    if (insertError) throw insertError
    summary.notificationsCreated += inserted?.length ?? 0

    if (!VAPID_PUBLIC_KEY || !VAPID_PRIVATE_KEY || !inserted?.length) continue

    const { data: subscriptions, error: subsError } = await supabase
      .from('push_subscriptions')
      .select('id, endpoint, p256dh, auth')
      .eq('owner_id', ownerId)
    if (subsError) throw subsError

    for (const notif of inserted) {
      const payload = JSON.stringify({
        titre: notif.titre,
        message: notif.message,
        url: `/calendar?open=${notif.entite_id}`,
      })

      for (const sub of subscriptions ?? []) {
        try {
          await webpush.sendNotification(
            { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
            payload,
          )
          summary.pushSent += 1
        } catch (err) {
          summary.pushErrors += 1
          if (err?.statusCode === 404 || err?.statusCode === 410) {
            await supabase.from('push_subscriptions').delete().eq('id', sub.id)
          }
        }
      }
    }
  }

  return new Response(JSON.stringify(summary), {
    headers: { 'Content-Type': 'application/json' },
  })
})
