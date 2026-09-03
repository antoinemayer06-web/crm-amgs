// Fonction planifiée (cron chaque lundi matin) qui génère et envoie par
// email un récapitulatif de la semaine passée + priorités de la semaine
// à venir, via l'API Resend. Fonction autonome (pas d'import partagé)
// pour rester déployable en un seul copier-coller, comme les autres
// fonctions de ce projet.

import { createClient } from 'npm:@supabase/supabase-js@2.45.4'

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')
const SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
const RESEND_FROM = Deno.env.get('RESEND_FROM') ?? 'AM Growth Solutions <onboarding@resend.dev>'
// Destinataire fixe optionnel : si présent, le rapport part toujours vers
// cette adresse plutôt que l'email du compte Supabase Auth de l'owner.
const REPORT_TO_EMAIL = Deno.env.get('REPORT_TO_EMAIL')

const formatEUR = (value) => `${Number(value ?? 0).toLocaleString('fr-FR')} €`
const formatDate = (value) =>
  new Date(value).toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' })
const toIsoDate = (date) => date.toISOString().slice(0, 10)

function renderEmail({ periodLabel, kpis, prospects, projectsDelivered, projectsUpcoming, marketing, notifCount, upcoming }) {
  const card = (content) =>
    `<div style="background:#141416;border:1px solid #3a3c40;border-radius:12px;padding:20px;margin-bottom:16px;">${content}</div>`

  const sectionTitle = (title) =>
    `<p style="margin:0 0 10px;font-size:13px;font-weight:600;color:#8e9196;text-transform:uppercase;letter-spacing:0.04em;">${title}</p>`

  const emptyRow = (text) => `<p style="margin:0;font-size:14px;color:#5a5d61;">${text}</p>`

  const row = (label, value) =>
    `<div style="display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid #26262a;font-size:14px;">
      <span style="color:#8a8d91;">${label}</span>
      <span style="color:#f2f2f3;font-weight:500;">${value}</span>
    </div>`

  const kpiBlock = (label, value, sublabel) =>
    `<td style="width:50%;padding:16px;background:#141416;border:1px solid #3a3c40;border-radius:12px;">
      <p style="margin:0;font-size:12px;color:#8e9196;">${label}</p>
      <p style="margin:6px 0 0;font-size:28px;font-weight:700;color:#f2f2f3;">${value}</p>
      <p style="margin:4px 0 0;font-size:11px;color:#5a5d61;">${sublabel}</p>
    </td>`

  return `<!doctype html>
<html>
  <body style="margin:0;padding:0;background:#0a0a0b;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
    <div style="max-width:560px;margin:0 auto;padding:32px 20px;">
      <p style="margin:0 0 4px;font-size:20px;font-weight:700;color:#f2f2f3;">AM Growth Solutions</p>
      <p style="margin:0 0 24px;font-size:13px;color:#8a8d91;">Rapport hebdomadaire — ${periodLabel}</p>

      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:16px;">
        <tr>
          ${kpiBlock('CA facturé (semaine)', formatEUR(kpis.caFacture), 'Documents + factures récurrentes payées')}
          <td style="width:12px;"></td>
          ${kpiBlock('CA encaissé (semaine)', formatEUR(kpis.caEncaisse), 'Encaissements réels enregistrés')}
        </tr>
      </table>

      ${card(
        sectionTitle('Prospects convertis') +
          (prospects.length
            ? prospects.map((c) => row(c.name, 'Devis signé')).join('')
            : emptyRow('Aucune conversion cette semaine.')),
      )}

      ${card(
        sectionTitle('Projets livrés cette semaine') +
          (projectsDelivered.length
            ? projectsDelivered.map((p) => row(p.nom, p.company?.name ?? '')).join('')
            : emptyRow('Aucun projet livré cette semaine.')) +
          `<p style="margin:14px 0 8px;font-size:12px;font-weight:600;color:#8e9196;">Échéances proches</p>` +
          (projectsUpcoming.length
            ? projectsUpcoming.map((p) => row(p.nom, formatDate(p.date_livraison_prevue))).join('')
            : emptyRow('Aucune échéance dans les 7 prochains jours.')),
      )}

      ${card(
        sectionTitle('Actions marketing publiées') +
          (marketing.length
            ? marketing.map((m) => row(m.titre, formatDate(m.date_prevue))).join('')
            : emptyRow('Aucune action publiée cette semaine.')),
      )}

      ${card(
        sectionTitle('Notifications') +
          `<p style="margin:0;font-size:14px;color:#f2f2f3;">${notifCount} notification${notifCount > 1 ? 's' : ''} reçue${notifCount > 1 ? 's' : ''} cette semaine</p>`,
      )}

      ${card(
        sectionTitle('Cette semaine — 7 prochains jours') +
          (upcoming.length
            ? upcoming.map((item) => row(item.title, formatDate(item.date))).join('')
            : emptyRow('Rien de prévu pour l\'instant.')),
      )}

      <p style="margin:24px 0 0;font-size:11px;color:#5a5d61;text-align:center;">
        Rapport automatique — désactivable dans Paramètres de l'application.
      </p>
    </div>
  </body>
</html>`
}

Deno.serve(async (_req) => {
  if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
    return new Response(JSON.stringify({ error: 'Missing Supabase service role env vars' }), { status: 500 })
  }
  if (!RESEND_API_KEY) {
    return new Response(JSON.stringify({ error: 'Missing RESEND_API_KEY secret' }), { status: 500 })
  }

  const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY)

  const now = new Date()
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
  const weekAhead = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
  const periodLabel = `${formatDate(weekAgo)} – ${formatDate(now)}`

  const summary = { usersProcessed: 0, emailsSent: 0, emailErrors: 0 }

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
    if (!user.email) continue

    const { data: settingsRow } = await supabase
      .from('notification_settings')
      .select('rapport_hebdomadaire_actif')
      .eq('owner_id', ownerId)
      .maybeSingle()
    if (settingsRow?.rapport_hebdomadaire_actif === false) continue

    const [
      { data: documents },
      { data: recurringInvoices },
      { data: cashCollections },
      { data: prospects },
      { data: allProjects },
      { data: marketing },
      { count: notifCount },
      { data: calendarEvents },
    ] = await Promise.all([
      supabase
        .from('documents')
        .select('montant')
        .eq('owner_id', ownerId)
        .eq('type', 'facture')
        .gte('date_document', toIsoDate(weekAgo))
        .lte('date_document', toIsoDate(now)),
      supabase
        .from('recurring_invoices')
        .select('montant')
        .eq('owner_id', ownerId)
        .eq('payee', true)
        .gte('date_paiement', toIsoDate(weekAgo))
        .lte('date_paiement', toIsoDate(now)),
      supabase
        .from('cash_collections')
        .select('montant')
        .eq('owner_id', ownerId)
        .gte('date_encaissement', toIsoDate(weekAgo))
        .lte('date_encaissement', toIsoDate(now)),
      supabase
        .from('companies')
        .select('name, updated_at')
        .eq('owner_id', ownerId)
        .eq('statut_prospect', 'devis_signé')
        .gte('updated_at', weekAgo.toISOString()),
      supabase
        .from('projects')
        .select('nom, statut, updated_at, date_livraison_prevue, archived, company:companies(name)')
        .eq('owner_id', ownerId)
        .eq('archived', false),
      supabase
        .from('marketing_actions')
        .select('titre, date_prevue')
        .eq('owner_id', ownerId)
        .eq('statut', 'publié')
        .gte('date_prevue', toIsoDate(weekAgo))
        .lte('date_prevue', toIsoDate(now)),
      supabase
        .from('notifications')
        .select('id', { count: 'exact', head: true })
        .eq('owner_id', ownerId)
        .gte('created_at', weekAgo.toISOString()),
      supabase
        .from('calendar_events')
        .select('titre, date_debut')
        .eq('owner_id', ownerId)
        .gte('date_debut', now.toISOString())
        .lte('date_debut', weekAhead.toISOString()),
    ])

    const caFacture =
      (documents ?? []).reduce((sum, d) => sum + Number(d.montant ?? 0), 0) +
      (recurringInvoices ?? []).reduce((sum, r) => sum + Number(r.montant ?? 0), 0)
    const caEncaisse = (cashCollections ?? []).reduce((sum, c) => sum + Number(c.montant ?? 0), 0)

    const projectsDelivered = (allProjects ?? []).filter(
      (p) =>
        (p.statut === 'livré_à_facturer' || p.statut === 'payé') &&
        new Date(p.updated_at) >= weekAgo,
    )
    const projectsUpcoming = (allProjects ?? []).filter(
      (p) =>
        p.date_livraison_prevue &&
        new Date(p.date_livraison_prevue) >= now &&
        new Date(p.date_livraison_prevue) <= weekAhead &&
        p.statut !== 'payé',
    )

    const upcoming = [
      ...(calendarEvents ?? []).map((e) => ({ title: e.titre, date: e.date_debut })),
      ...projectsUpcoming.map((p) => ({ title: `Échéance — ${p.nom}`, date: p.date_livraison_prevue })),
    ].sort((a, b) => new Date(a.date) - new Date(b.date))

    const html = renderEmail({
      periodLabel,
      kpis: { caFacture, caEncaisse },
      prospects: prospects ?? [],
      projectsDelivered,
      projectsUpcoming,
      marketing: marketing ?? [],
      notifCount: notifCount ?? 0,
      upcoming,
    })

    try {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: RESEND_FROM,
          to: [REPORT_TO_EMAIL || user.email],
          subject: `Rapport hebdomadaire — ${periodLabel}`,
          html,
        }),
      })
      if (!response.ok) {
        summary.emailErrors += 1
      } else {
        summary.emailsSent += 1
      }
    } catch {
      summary.emailErrors += 1
    }
  }

  return new Response(JSON.stringify(summary), { headers: { 'Content-Type': 'application/json' } })
})
