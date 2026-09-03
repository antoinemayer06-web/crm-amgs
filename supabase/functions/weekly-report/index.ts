// Fonction planifiée (cron chaque lundi matin) qui génère et envoie par
// email un récapitulatif de la semaine passée + priorités de la semaine
// à venir, via l'API Resend. Fonction autonome (pas d'import partagé)
// pour rester déployable en un seul copier-coller, comme les autres
// fonctions de ce projet.
//
// Rendu 100% <table> (pas de <div>, pas de flexbox) : Gmail (surtout
// l'appli mobile) a un support CSS très limité — background-color sur
// <body>/<div> et display:flex sont ignorés ou mal gérés selon les
// versions. Les tables avec bgcolor + style sont le seul format fiable
// tous clients confondus (Gmail web/app, Outlook, Apple Mail).

import { createClient } from 'npm:@supabase/supabase-js@2.45.4'

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')
const SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
const RESEND_FROM = Deno.env.get('RESEND_FROM') ?? 'AM Growth Solutions <onboarding@resend.dev>'
// Destinataire fixe optionnel : si présent, le rapport part toujours vers
// cette adresse plutôt que l'email du compte Supabase Auth de l'owner.
const REPORT_TO_EMAIL = Deno.env.get('REPORT_TO_EMAIL')

const BG = '#0a0a0b'
const CARD_BG = '#141416'
const BORDER = '#3a3c40'
const TEXT_PRIMARY = '#f2f2f3'
const TEXT_SECONDARY = '#8a8d91'
const TEXT_LABEL = '#8e9196'
const TEXT_MUTED = '#5a5d61'
const ROW_BORDER = '#26262a'

// Logo "AM" (même SVG que src/components/ui/Logo.jsx), encodé en data URI
// pour le pied de mail — plus fiable que du SVG inline dans les clients mail.
const LOGO_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="32" height="32">
  <defs>
    <linearGradient id="logo-triangle" x1="15%" y1="0%" x2="85%" y2="100%">
      <stop offset="0%" stop-color="#8b6bf0" />
      <stop offset="45%" stop-color="#6d3fd6" />
      <stop offset="100%" stop-color="#3f1f8f" />
    </linearGradient>
    <linearGradient id="logo-chevrons" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#f2effc" />
      <stop offset="100%" stop-color="#c9c0e8" />
    </linearGradient>
  </defs>
  <path d="M50 4 L96 94 L4 94 Z" fill="url(#logo-triangle)" />
  <path d="M17 94 L34 58 L50 80 L66 58 L83 94 Z" fill="url(#logo-chevrons)" />
  <g>
    <path d="M50 28 L37 45 L50 45 Z" fill="#8f86b8" />
    <path d="M50 28 L63 45 L50 45 Z" fill="#ffffff" />
    <path d="M37 45 L50 62 L50 45 Z" fill="#ffffff" />
    <path d="M63 45 L50 62 L50 45 Z" fill="#8f86b8" />
  </g>
</svg>`
const LOGO_DATA_URI = `data:image/svg+xml;base64,${btoa(LOGO_SVG)}`

const formatEUR = (value) => `${Number(value ?? 0).toLocaleString('fr-FR')} €`
const formatDate = (value) =>
  new Date(value).toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' })
const toIsoDate = (date) => date.toISOString().slice(0, 10)

function renderEmail({ periodLabel, kpis, prospects, projectsDelivered, projectsUpcoming, marketing, notifCount, upcoming }) {
  // Une "card" = une table pleine largeur avec bgcolor, jamais un <div>.
  const card = (innerHtml) =>
    `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" bgcolor="${CARD_BG}" style="background-color:${CARD_BG};border:1px solid ${BORDER};border-radius:12px;margin-bottom:16px;">
      <tr><td bgcolor="${CARD_BG}" style="background-color:${CARD_BG};padding:20px;">${innerHtml}</td></tr>
    </table>`

  const sectionTitle = (title) =>
    `<p style="margin:0 0 10px;font-size:13px;font-weight:600;color:${TEXT_LABEL};text-transform:uppercase;letter-spacing:0.04em;">${title}</p>`

  const emptyRow = (text) => `<p style="margin:0;font-size:14px;color:${TEXT_MUTED};">${text}</p>`

  // Ligne label/valeur en table (pas display:flex, non supporté par
  // l'appli Gmail mobile).
  const row = (label, value) =>
    `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" bgcolor="${CARD_BG}" style="background-color:${CARD_BG};border-bottom:1px solid ${ROW_BORDER};">
      <tr>
        <td bgcolor="${CARD_BG}" style="background-color:${CARD_BG};padding:6px 0;font-size:14px;color:${TEXT_SECONDARY};">${label}</td>
        <td align="right" bgcolor="${CARD_BG}" style="background-color:${CARD_BG};padding:6px 0;font-size:14px;color:${TEXT_PRIMARY};font-weight:500;">${value}</td>
      </tr>
    </table>`

  const kpiBlock = (label, value, sublabel) =>
    `<td width="50%" valign="top" bgcolor="${CARD_BG}" style="background-color:${CARD_BG};border:1px solid ${BORDER};border-radius:12px;padding:16px;">
      <p style="margin:0;font-size:12px;color:${TEXT_LABEL};">${label}</p>
      <p style="margin:6px 0 0;font-size:28px;font-weight:700;color:${TEXT_PRIMARY};">${value}</p>
      <p style="margin:4px 0 0;font-size:11px;color:${TEXT_MUTED};">${sublabel}</p>
    </td>`

  const body = `
    <p style="margin:0 0 4px;font-size:20px;font-weight:700;color:${TEXT_PRIMARY};">AM Growth Solutions</p>
    <p style="margin:0 0 24px;font-size:13px;color:${TEXT_SECONDARY};">Rapport hebdomadaire — ${periodLabel}</p>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" bgcolor="${BG}" style="background-color:${BG};margin-bottom:16px;">
      <tr>
        ${kpiBlock('CA facturé (semaine)', formatEUR(kpis.caFacture), 'Documents + factures récurrentes facturées')}
        <td width="12" bgcolor="${BG}" style="background-color:${BG};"></td>
        ${kpiBlock('CA encaissé (semaine)', formatEUR(kpis.caEncaisse), 'Encaissements + factures récurrentes payées')}
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
        `<p style="margin:14px 0 8px;font-size:12px;font-weight:600;color:${TEXT_LABEL};">Échéances proches</p>` +
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
        `<p style="margin:0;font-size:14px;color:${TEXT_PRIMARY};">${notifCount} notification${notifCount > 1 ? 's' : ''} reçue${notifCount > 1 ? 's' : ''} cette semaine</p>`,
    )}

    ${card(
      sectionTitle('Cette semaine — 7 prochains jours') +
        (upcoming.length
          ? upcoming.map((item) => row(item.title, formatDate(item.date))).join('')
          : emptyRow('Rien de prévu pour l\'instant.')),
    )}

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" bgcolor="${BG}" style="background-color:${BG};">
      <tr>
        <td align="center" bgcolor="${BG}" style="background-color:${BG};padding-top:28px;">
          <img src="${LOGO_DATA_URI}" width="32" height="32" alt="AM Growth Solutions" style="display:block;" />
        </td>
      </tr>
      <tr>
        <td align="center" bgcolor="${BG}" style="background-color:${BG};padding-top:8px;font-size:11px;color:${TEXT_MUTED};">
          Rapport automatique — désactivable dans Paramètres de l'application.
        </td>
      </tr>
    </table>
  `

  return `<!doctype html>
<html style="background-color:${BG};">
  <head>
    <meta name="color-scheme" content="light dark" />
    <meta name="supported-color-schemes" content="light dark" />
  </head>
  <body bgcolor="${BG}" style="margin:0;padding:0;background-color:${BG};font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" bgcolor="${BG}" style="background-color:${BG};">
      <tr>
        <td align="center" bgcolor="${BG}" style="background-color:${BG};padding:32px 20px;">
          <table role="presentation" width="560" cellpadding="0" cellspacing="0" bgcolor="${BG}" style="background-color:${BG};max-width:560px;width:100%;">
            <tr><td bgcolor="${BG}" style="background-color:${BG};">${body}</td></tr>
          </table>
        </td>
      </tr>
    </table>
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
      { data: recurringInvoicesFactured },
      { data: recurringInvoicesPaid },
      { data: cashCollections },
      { data: prospects },
      { data: allProjects },
      { data: marketingPublished },
      { data: marketingUpcoming },
      { data: stepsUpcoming },
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
        .eq('facturee', true)
        .gte('date_facturation', toIsoDate(weekAgo))
        .lte('date_facturation', toIsoDate(now)),
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
      // Actions marketing planifiées dans les 7 prochains jours (pour la
      // section "Cette semaine", même logique que la page Calendrier).
      supabase
        .from('marketing_actions')
        .select('titre, date_prevue')
        .eq('owner_id', ownerId)
        .neq('statut', 'annulé')
        .gte('date_prevue', toIsoDate(now))
        .lte('date_prevue', toIsoDate(weekAhead)),
      // Étapes de projet prévues dans les 7 prochains jours, même logique
      // que la page Calendrier (project_steps, projets non archivés).
      supabase
        .from('project_steps')
        .select('titre, date_debut, date_fin, project:projects!inner(nom, archived)')
        .eq('owner_id', ownerId)
        .eq('project.archived', false)
        .or(
          `and(date_fin.gte.${toIsoDate(now)},date_fin.lte.${toIsoDate(weekAhead)}),and(date_debut.gte.${toIsoDate(now)},date_debut.lte.${toIsoDate(weekAhead)})`,
        ),
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
      (recurringInvoicesFactured ?? []).reduce((sum, r) => sum + Number(r.montant ?? 0), 0)
    const caEncaisse =
      (cashCollections ?? []).reduce((sum, c) => sum + Number(c.montant ?? 0), 0) +
      (recurringInvoicesPaid ?? []).reduce((sum, r) => sum + Number(r.montant ?? 0), 0)

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
      ...(marketingUpcoming ?? []).map((m) => ({ title: `Marketing — ${m.titre}`, date: m.date_prevue })),
      ...(stepsUpcoming ?? []).map((s) => ({
        title: s.project?.nom ? `${s.titre} — ${s.project.nom}` : s.titre,
        date: s.date_fin || s.date_debut,
      })),
    ].sort((a, b) => new Date(a.date) - new Date(b.date))

    const html = renderEmail({
      periodLabel,
      kpis: { caFacture, caEncaisse },
      prospects: prospects ?? [],
      projectsDelivered,
      projectsUpcoming,
      marketing: marketingPublished ?? [],
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
        const errorBody = await response.text()
        console.error(`Resend error for ${REPORT_TO_EMAIL || user.email}: ${response.status} ${errorBody}`)
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
