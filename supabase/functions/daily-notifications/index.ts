// Fonction planifiée (cron quotidien, le matin) qui vérifie les 5 règles
// d'alerte définies par l'utilisateur et insère une notification par
// condition remplie — jamais de doublon pour une notification du même
// type déjà non lue sur la même entité. Envoie ensuite une vraie
// notification push (Web Push) à chaque abonnement enregistré.
//
// Déployée depuis le Dashboard Supabase (Edge Functions) ou via
// `supabase functions deploy daily-notifications`, puis planifiée en
// cron (voir les instructions fournies avec cette fonction).

import { createClient } from 'npm:@supabase/supabase-js@2.45.4'
import webpush from 'npm:web-push@3.6.7'

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')
const SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
const VAPID_PUBLIC_KEY = Deno.env.get('VAPID_PUBLIC_KEY')
const VAPID_PRIVATE_KEY = Deno.env.get('VAPID_PRIVATE_KEY')
const VAPID_SUBJECT = Deno.env.get('VAPID_SUBJECT') ?? 'mailto:contact.amagency.fr@gmail.com'

const DEFAULT_TYPES_ACTIFS = {
  action_marketing_du_jour: true,
  facture_impayee_7j: true,
  objectif_mi_mois: true,
  projet_demarre_ou_termine_bientot: true,
  prospect_bloque_devis: true,
}

function entityUrl(entiteType, entiteId) {
  if (entiteType === 'project') return `/projects?open=${entiteId}`
  if (entiteType === 'company') return `/companies/${entiteId}`
  if (entiteType === 'marketing_action') return '/marketing'
  return '/dashboard'
}

function daysSince(dateString, now) {
  const then = new Date(dateString).getTime()
  return Math.floor((now.getTime() - then) / (1000 * 60 * 60 * 24))
}

function toIsoDate(date) {
  return date.toISOString().slice(0, 10)
}

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
  const today = toIsoDate(now)
  const isFifteenth = now.getDate() === 15
  const in3Days = toIsoDate(new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000))
  const monthStart = toIsoDate(new Date(now.getFullYear(), now.getMonth(), 1))
  const monthEnd = toIsoDate(new Date(now.getFullYear(), now.getMonth() + 1, 0))

  const summary = { usersProcessed: 0, notificationsCreated: 0, pushSent: 0, pushErrors: 0 }

  // Itère tous les utilisateurs (multi-tenant, même si l'app n'a
  // aujourd'hui qu'un seul propriétaire) via l'API admin.
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
    const typesActifs = { ...DEFAULT_TYPES_ACTIFS, ...(settingsRow?.types_actifs ?? {}) }

    const toInsert = []
    const seenThisRun = new Set()

    async function isDuplicate(type, entiteId) {
      const key = `${type}:${entiteId ?? 'null'}`
      if (seenThisRun.has(key)) return true
      let query = supabase
        .from('notifications')
        .select('id', { count: 'exact', head: true })
        .eq('owner_id', ownerId)
        .eq('type', type)
        .eq('lue', false)
      query = entiteId ? query.eq('entite_id', entiteId) : query.is('entite_id', null)
      const { count, error } = await query
      if (error) throw error
      return (count ?? 0) > 0
    }

    function queue(type, titre, message, entiteType, entiteId) {
      seenThisRun.add(`${type}:${entiteId ?? 'null'}`)
      toInsert.push({
        owner_id: ownerId,
        type,
        titre,
        message,
        entite_type: entiteType,
        entite_id: entiteId,
      })
    }

    // 1) action_marketing_du_jour
    if (typesActifs.action_marketing_du_jour) {
      const { data: actions, error } = await supabase
        .from('marketing_actions')
        .select('id, titre')
        .eq('owner_id', ownerId)
        .eq('date_prevue', today)
        .eq('statut', 'planifié')
      if (error) throw error
      for (const action of actions ?? []) {
        if (await isDuplicate('action_marketing_du_jour', action.id)) continue
        queue(
          'action_marketing_du_jour',
          'Action marketing prévue aujourd\'hui',
          action.titre,
          'marketing_action',
          action.id,
        )
      }
    }

    // 2) facture_impayee_7j
    if (typesActifs.facture_impayee_7j) {
      const { data: projects, error } = await supabase
        .from('projects')
        .select('id, nom, updated_at, company:companies(name)')
        .eq('owner_id', ownerId)
        .eq('statut', 'facture_transmise')
      if (error) throw error
      for (const project of projects ?? []) {
        const days = daysSince(project.updated_at, now)
        if (days < 7) continue
        if (await isDuplicate('facture_impayee_7j', project.id)) continue
        queue(
          'facture_impayee_7j',
          'Facture en attente de paiement',
          `${project.nom} — ${project.company?.name ?? 'client'} : envoyée il y a ${days} jours`,
          'project',
          project.id,
        )
      }
    }

    // 3) objectif_mi_mois (uniquement le 15 du mois)
    if (typesActifs.objectif_mi_mois && isFifteenth) {
      const [{ data: documents, error: documentsError }, { data: goal, error: goalError }] =
        await Promise.all([
          supabase
            .from('documents')
            .select('montant')
            .eq('owner_id', ownerId)
            .eq('type', 'facture')
            .gte('date_document', monthStart)
            .lte('date_document', monthEnd),
          supabase
            .from('finance_goals')
            .select('objectif_resultat_mensuel')
            .eq('owner_id', ownerId)
            .maybeSingle(),
        ])
      if (documentsError) throw documentsError
      if (goalError) throw goalError

      const objectif = goal?.objectif_resultat_mensuel ?? 0
      if (objectif > 0) {
        const caFacture = (documents ?? []).reduce((sum, doc) => sum + Number(doc.montant ?? 0), 0)
        if (caFacture < objectif * 0.5 && !(await isDuplicate('objectif_mi_mois', null))) {
          queue(
            'objectif_mi_mois',
            'Lâche pas, tu vas réussir',
            'Sinon tu peux aussi garder ton CDI et un patron 😉',
            null,
            null,
          )
        }
      }
    }

    // 4) projet_demarre_ou_termine_bientot
    if (typesActifs.projet_demarre_ou_termine_bientot) {
      const { data: projects, error } = await supabase
        .from('projects')
        .select('id, nom, statut, date_debut, date_livraison_prevue, company:companies(name)')
        .eq('owner_id', ownerId)
        .eq('archived', false)
      if (error) throw error

      for (const project of projects ?? []) {
        const startsSoon =
          project.date_debut && project.date_debut >= today && project.date_debut <= in3Days
        const endsSoon =
          project.date_livraison_prevue &&
          project.date_livraison_prevue >= today &&
          project.date_livraison_prevue <= in3Days &&
          project.statut !== 'payé'

        if (startsSoon) {
          if (await isDuplicate('projet_demarre_ou_termine_bientot', project.id)) continue
          queue(
            'projet_demarre_ou_termine_bientot',
            'Projet démarre bientôt',
            `${project.nom} — ${project.company?.name ?? 'client'} : début le ${project.date_debut}`,
            'project',
            project.id,
          )
        } else if (endsSoon) {
          if (await isDuplicate('projet_demarre_ou_termine_bientot', project.id)) continue
          queue(
            'projet_demarre_ou_termine_bientot',
            'Projet se termine bientôt',
            `${project.nom} — ${project.company?.name ?? 'client'} : échéance le ${project.date_livraison_prevue}`,
            'project',
            project.id,
          )
        }
      }
    }

    // 5) prospect_bloque_devis
    if (typesActifs.prospect_bloque_devis) {
      const { data: companies, error } = await supabase
        .from('companies')
        .select('id, name, updated_at')
        .eq('owner_id', ownerId)
        .eq('status', 'prospect')
        .eq('statut_prospect', 'devis_à_transmettre')
      if (error) throw error
      for (const company of companies ?? []) {
        const days = daysSince(company.updated_at, now)
        if (days < 3) continue
        if (await isDuplicate('prospect_bloque_devis', company.id)) continue
        queue(
          'prospect_bloque_devis',
          'Devis à transmettre en attente',
          `${company.name} — en attente depuis ${days} jours`,
          'company',
          company.id,
        )
      }
    }

    if (toInsert.length === 0) continue

    const { data: inserted, error: insertError } = await supabase
      .from('notifications')
      .insert(toInsert)
      .select('titre, message, entite_type, entite_id')
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
        url: entityUrl(notif.entite_type, notif.entite_id),
      })

      for (const sub of subscriptions ?? []) {
        try {
          await webpush.sendNotification(
            {
              endpoint: sub.endpoint,
              keys: { p256dh: sub.p256dh, auth: sub.auth },
            },
            payload,
          )
          summary.pushSent += 1
        } catch (err) {
          summary.pushErrors += 1
          // Abonnement expiré/révoqué : on le supprime pour ne plus retenter.
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
