// Tools "lecture" : exécutés directement, jamais de validation nécessaire.
// Chaque tool renvoie des données déjà réduites (pas de colonnes internes
// inutiles) pour ne pas gonfler le contexte envoyé à Claude.

const STATUT_PROSPECT_OPTIONS = [
  'à_contacter',
  'contacté',
  'sans_réponse',
  'refus',
  'en_discussion',
  'devis_à_transmettre',
  'devis_transmis',
  'devis_signé',
]

function isInCurrentMonth(dateStr: string | null) {
  if (!dateStr) return false
  const date = new Date(dateStr)
  const now = new Date()
  return date.getFullYear() === now.getFullYear() && date.getMonth() === now.getMonth()
}

export const READ_TOOLS = [
  {
    name: 'lister_entreprises',
    description:
      "Liste les entreprises (prospects et/ou clients) avec filtres optionnels. Utilise ce tool pour toute question sur des listes ou des statistiques d'entreprises.",
    input_schema: {
      type: 'object',
      properties: {
        status: { type: 'string', enum: ['prospect', 'client'], description: 'Filtrer par statut' },
        statut_prospect: { type: 'string', enum: STATUT_PROSPECT_OPTIONS },
        temperature: { type: 'string', enum: ['chaud', 'froid'] },
      },
    },
    async execute(supabase: any, input: any) {
      let query = supabase
        .from('companies')
        .select(
          'id, name, status, statut_prospect, sector, temperature, valeur_estimee, prochaine_action, date_prochaine_action, created_at',
        )
        .order('created_at', { ascending: false })
        .limit(50)
      if (input.status) query = query.eq('status', input.status)
      if (input.statut_prospect) query = query.eq('statut_prospect', input.statut_prospect)
      if (input.temperature) query = query.eq('temperature', input.temperature)
      const { data, error } = await query
      if (error) throw error
      return data
    },
  },
  {
    name: 'obtenir_entreprise',
    description:
      "Récupère le détail complet d'une entreprise : infos générales, dernières notes, contacts, projets liés. Utilise-le avant de résumer l'historique d'une entreprise ou de préparer un brief.",
    input_schema: {
      type: 'object',
      properties: { company_id: { type: 'string', description: 'UUID de l’entreprise' } },
      required: ['company_id'],
    },
    async execute(supabase: any, input: any) {
      const [companyRes, notesRes, contactsRes, projectsRes] = await Promise.all([
        supabase.from('companies').select('*').eq('id', input.company_id).single(),
        supabase
          .from('notes')
          .select('auteur, contenu, type, created_at')
          .eq('company_id', input.company_id)
          .order('created_at', { ascending: false })
          .limit(10),
        supabase
          .from('contacts')
          .select('first_name, last_name, role, email, phone')
          .eq('company_id', input.company_id),
        supabase
          .from('projects')
          .select('id, nom, statut, date_debut, date_livraison_prevue, archived')
          .eq('company_id', input.company_id)
          .order('created_at', { ascending: false }),
      ])
      if (companyRes.error) throw companyRes.error
      return {
        entreprise: companyRes.data,
        notes_recentes: notesRes.data ?? [],
        contacts: contactsRes.data ?? [],
        projets: projectsRes.data ?? [],
      }
    },
  },
  {
    name: 'lister_projets',
    description: 'Liste les projets avec filtres optionnels (statut, entreprise, en retard).',
    input_schema: {
      type: 'object',
      properties: {
        statut: {
          type: 'string',
          enum: ['en_cours_livraison', 'livré_à_facturer', 'facture_transmise', 'payé'],
        },
        company_id: { type: 'string' },
        late_only: { type: 'boolean', description: 'Ne garder que les projets en retard' },
      },
    },
    async execute(supabase: any, input: any) {
      let query = supabase
        .from('projects')
        .select('id, nom, statut, date_debut, date_livraison_prevue, heures_prevues, company:companies(id, name)')
        .eq('archived', false)
        .order('date_livraison_prevue', { ascending: true, nullsFirst: false })
        .limit(50)
      if (input.statut) query = query.eq('statut', input.statut)
      if (input.company_id) query = query.eq('company_id', input.company_id)
      const { data, error } = await query
      if (error) throw error
      if (!input.late_only) return data
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      return (data ?? []).filter(
        (p: any) => p.statut !== 'payé' && p.date_livraison_prevue && new Date(p.date_livraison_prevue) < today,
      )
    },
  },
  {
    name: 'obtenir_projet',
    description:
      "Récupère le détail complet d'un projet : infos, étapes, temps prévu/réalisé, montants facturé/encaissé.",
    input_schema: {
      type: 'object',
      properties: { project_id: { type: 'string' } },
      required: ['project_id'],
    },
    async execute(supabase: any, input: any) {
      const [projectRes, stepsRes] = await Promise.all([
        supabase
          .from('projects')
          .select('*, company:companies(id, name)')
          .eq('id', input.project_id)
          .single(),
        supabase.from('project_steps').select('*').eq('project_id', input.project_id).order('ordre'),
      ])
      if (projectRes.error) throw projectRes.error
      const stepIds = (stepsRes.data ?? []).map((s: any) => s.id)
      let tempsRealise = 0
      if (stepIds.length > 0) {
        const { data: logs } = await supabase
          .from('project_work_logs')
          .select('duree_heures')
          .in('step_id', stepIds)
        tempsRealise = (logs ?? []).reduce((sum: number, l: any) => sum + Number(l.duree_heures ?? 0), 0)
      }
      return {
        projet: projectRes.data,
        etapes: stepsRes.data ?? [],
        temps_realise_heures: tempsRealise,
      }
    },
  },
  {
    name: 'lister_taches',
    description: "Liste les tâches (table tasks), avec filtres optionnels statut/entreprise.",
    input_schema: {
      type: 'object',
      properties: {
        statut: { type: 'string', enum: ['à_faire', 'fait'] },
        company_id: { type: 'string' },
      },
    },
    async execute(supabase: any, input: any) {
      let query = supabase
        .from('tasks')
        .select('id, titre, description, due_date, statut, priorite, company:companies(id, name)')
        .order('due_date', { ascending: true, nullsFirst: false })
        .limit(50)
      if (input.statut) query = query.eq('statut', input.statut)
      if (input.company_id) query = query.eq('company_id', input.company_id)
      const { data, error } = await query
      if (error) throw error
      return data
    },
  },
  {
    name: 'lister_actions_marketing',
    description: 'Liste les actions marketing planifiées, avec filtres optionnels statut/type.',
    input_schema: {
      type: 'object',
      properties: {
        statut: { type: 'string', enum: ['planifié', 'publié', 'annulé'] },
        type: {
          type: 'string',
          enum: ['post_linkedin', 'email', 'contenu_blog', 'campagne_pub', 'autre'],
        },
      },
    },
    async execute(supabase: any, input: any) {
      let query = supabase
        .from('marketing_actions')
        .select('id, titre, type, statut, date_prevue, description, campaign:campaigns(id, nom)')
        .order('date_prevue', { ascending: true })
        .limit(50)
      if (input.statut) query = query.eq('statut', input.statut)
      if (input.type) query = query.eq('type', input.type)
      const { data, error } = await query
      if (error) throw error
      return data
    },
  },
  {
    name: 'lister_campagnes',
    description: 'Liste les campagnes marketing existantes.',
    input_schema: { type: 'object', properties: {} },
    async execute(supabase: any) {
      const { data, error } = await supabase
        .from('campaigns')
        .select('*')
        .order('date_debut', { ascending: false })
        .limit(30)
      if (error) throw error
      return data
    },
  },
  {
    name: 'rechercher_connaissance',
    description: "Recherche dans la base de connaissance (titre et contenu) par mot-clé.",
    input_schema: {
      type: 'object',
      properties: { recherche: { type: 'string' } },
      required: ['recherche'],
    },
    async execute(supabase: any, input: any) {
      const term = String(input.recherche).replace(/[,()]/g, ' ').trim()
      const { data, error } = await supabase
        .from('knowledge_base')
        .select('id, titre, categorie, contenu, tags')
        .or(`titre.ilike.%${term}%,contenu.ilike.%${term}%`)
        .limit(10)
      if (error) throw error
      return data
    },
  },
  {
    name: 'obtenir_stats_pipeline',
    description:
      'Statistiques du pipeline de prospection : répartition par étape, valeur totale (hors refus), taux de conversion du mois en cours.',
    input_schema: { type: 'object', properties: {} },
    async execute(supabase: any) {
      const { data: companies, error } = await supabase
        .from('companies')
        .select('status, statut_prospect, valeur_estimee, created_at')
      if (error) throw error

      const prospects = (companies ?? []).filter((c: any) => c.status === 'prospect')
      const repartition = STATUT_PROSPECT_OPTIONS.map((statut) => ({
        statut,
        count: prospects.filter((c: any) => c.statut_prospect === statut).length,
      }))
      const valeur_pipeline = prospects
        .filter((c: any) => c.statut_prospect !== 'refus')
        .reduce((sum: number, c: any) => sum + Number(c.valeur_estimee ?? 0), 0)

      const createdThisMonth = (companies ?? []).filter((c: any) => isInCurrentMonth(c.created_at))
      const taux_conversion =
        createdThisMonth.length === 0
          ? null
          : (createdThisMonth.filter((c: any) => c.status === 'client').length / createdThisMonth.length) * 100

      return { repartition_par_etape: repartition, valeur_pipeline, taux_conversion_pct: taux_conversion }
    },
  },
]
