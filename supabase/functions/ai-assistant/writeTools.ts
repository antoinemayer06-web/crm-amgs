// Tools "écriture" : ne s'exécutent JAMAIS directement. `describe()` produit
// le résumé lisible affiché dans la carte de validation, `execute()` n'est
// appelé qu'après validation explicite de l'utilisateur (voir index.ts).

async function companyName(supabase: any, companyId: string) {
  const { data } = await supabase.from('companies').select('name').eq('id', companyId).single()
  return data?.name ?? companyId
}

async function projectName(supabase: any, projectId: string) {
  const { data } = await supabase.from('projects').select('nom').eq('id', projectId).single()
  return data?.nom ?? projectId
}

const PROJECT_STATUT_LABELS: Record<string, string> = {
  en_cours_livraison: 'En cours',
  livré_à_facturer: 'Livré / à facturer',
  facture_transmise: 'Facture transmise',
  payé: 'Payé',
}

export const WRITE_TOOLS = [
  {
    name: 'creer_entreprise',
    description:
      "Propose la création d'une nouvelle entreprise (prospect ou client). Nécessite toujours une validation de l'utilisateur avant création réelle.",
    input_schema: {
      type: 'object',
      properties: {
        nom: { type: 'string' },
        status: { type: 'string', enum: ['prospect', 'client'] },
        secteur: { type: 'string' },
        source: {
          type: 'string',
          enum: ['linkedin', 'email', 'bouche_à_oreille', 'campagne_publicitaire', 'appel'],
        },
        contact: { type: 'string', description: 'Téléphone, email…' },
        statut_prospect: {
          type: 'string',
          enum: [
            'à_contacter',
            'contacté',
            'sans_réponse',
            'refus',
            'en_discussion',
            'devis_à_transmettre',
            'devis_transmis',
            'devis_signé',
          ],
          description: 'Uniquement si status = prospect',
        },
      },
      required: ['nom', 'status'],
    },
    async describe(_supabase: any, input: any) {
      return `Créer l'entreprise « ${input.nom} » (${input.status === 'client' ? 'client' : 'prospect'})`
    },
    async execute(supabase: any, input: any) {
      const isProspect = input.status === 'prospect'
      const { data, error } = await supabase
        .from('companies')
        .insert({
          name: input.nom,
          status: input.status,
          sector: input.secteur || null,
          source: input.source || null,
          contact: input.contact || null,
          statut_prospect: isProspect ? input.statut_prospect || 'à_contacter' : null,
        })
        .select('id')
        .single()
      if (error) throw error
      return { table: 'companies', id: data.id }
    },
  },
  {
    name: 'mettre_a_jour_statut_prospect',
    description:
      "Propose de changer l'étape de prospection d'une entreprise. Si le nouveau statut est devis_signé, l'entreprise est automatiquement convertie en client (règle déjà en place dans le CRM).",
    input_schema: {
      type: 'object',
      properties: {
        company_id: { type: 'string' },
        nouveau_statut: {
          type: 'string',
          enum: [
            'à_contacter',
            'contacté',
            'sans_réponse',
            'refus',
            'en_discussion',
            'devis_à_transmettre',
            'devis_transmis',
            'devis_signé',
          ],
        },
      },
      required: ['company_id', 'nouveau_statut'],
    },
    async describe(supabase: any, input: any) {
      const name = await companyName(supabase, input.company_id)
      const suffix =
        input.nouveau_statut === 'devis_signé' ? ' (conversion automatique en client)' : ''
      return `Passer « ${name} » au statut « ${input.nouveau_statut} »${suffix}`
    },
    async execute(supabase: any, input: any) {
      const values =
        input.nouveau_statut === 'devis_signé'
          ? {
              status: 'client',
              statut_prospect: null,
              temperature: 'chaud',
              valeur_estimee: null,
              prochaine_action: null,
              date_prochaine_action: null,
            }
          : { statut_prospect: input.nouveau_statut }
      const { error } = await supabase.from('companies').update(values).eq('id', input.company_id)
      if (error) throw error
      return { table: 'companies', id: input.company_id }
    },
  },
  {
    name: 'ajouter_note',
    description: "Propose d'ajouter une note à une entreprise.",
    input_schema: {
      type: 'object',
      properties: {
        company_id: { type: 'string' },
        contenu: { type: 'string' },
      },
      required: ['company_id', 'contenu'],
    },
    async describe(supabase: any, input: any) {
      const name = await companyName(supabase, input.company_id)
      return `Ajouter une note à « ${name} »`
    },
    async execute(supabase: any, input: any) {
      const { error } = await supabase.from('notes').insert({
        company_id: input.company_id,
        auteur: 'Assistant IA',
        contenu: input.contenu,
        type: 'générale',
      })
      if (error) throw error
      return { table: 'companies', id: input.company_id }
    },
  },
  {
    name: 'creer_projet',
    description: "Propose la création d'un nouveau projet pour un client.",
    input_schema: {
      type: 'object',
      properties: {
        company_id: { type: 'string' },
        nom: { type: 'string' },
        description: { type: 'string' },
        date_debut: { type: 'string', description: 'Format YYYY-MM-DD' },
        date_echeance: { type: 'string', description: 'Format YYYY-MM-DD' },
        heures_prevues: { type: 'number' },
      },
      required: ['company_id', 'nom'],
    },
    async describe(supabase: any, input: any) {
      const name = await companyName(supabase, input.company_id)
      return `Créer le projet « ${input.nom} » pour « ${name} »`
    },
    async execute(supabase: any, input: any) {
      const { data, error } = await supabase
        .from('projects')
        .insert({
          company_id: input.company_id,
          nom: input.nom,
          description: input.description || null,
          date_debut: input.date_debut || null,
          date_livraison_prevue: input.date_echeance || null,
          heures_prevues: input.heures_prevues ?? null,
        })
        .select('id')
        .single()
      if (error) throw error
      return { table: 'projects', id: data.id }
    },
  },
  {
    name: 'mettre_a_jour_statut_projet',
    description: "Propose de changer le statut d'un projet.",
    input_schema: {
      type: 'object',
      properties: {
        project_id: { type: 'string' },
        nouveau_statut: {
          type: 'string',
          enum: ['en_cours_livraison', 'livré_à_facturer', 'facture_transmise', 'payé'],
        },
      },
      required: ['project_id', 'nouveau_statut'],
    },
    async describe(supabase: any, input: any) {
      const name = await projectName(supabase, input.project_id)
      const label = PROJECT_STATUT_LABELS[input.nouveau_statut] ?? input.nouveau_statut
      return `Passer le projet « ${name} » au statut « ${label} »`
    },
    async execute(supabase: any, input: any) {
      const { error } = await supabase
        .from('projects')
        .update({ statut: input.nouveau_statut })
        .eq('id', input.project_id)
      if (error) throw error
      return { table: 'projects', id: input.project_id }
    },
  },
  {
    name: 'creer_tache_projet',
    description: "Propose d'ajouter une étape (tâche) à un projet.",
    input_schema: {
      type: 'object',
      properties: {
        project_id: { type: 'string' },
        titre: { type: 'string' },
      },
      required: ['project_id', 'titre'],
    },
    async describe(supabase: any, input: any) {
      const name = await projectName(supabase, input.project_id)
      return `Ajouter l'étape « ${input.titre} » au projet « ${name} »`
    },
    async execute(supabase: any, input: any) {
      const { data: existing } = await supabase
        .from('project_steps')
        .select('ordre')
        .eq('project_id', input.project_id)
        .order('ordre', { ascending: false })
        .limit(1)
      const ordre = existing && existing.length > 0 ? existing[0].ordre + 1 : 0
      const { data, error } = await supabase
        .from('project_steps')
        .insert({ project_id: input.project_id, titre: input.titre, statut: 'à_faire', ordre })
        .select('id')
        .single()
      if (error) throw error
      return { table: 'projects', id: input.project_id, step_id: data.id }
    },
  },
  {
    name: 'planifier_action_marketing',
    description: "Propose de planifier une nouvelle action marketing.",
    input_schema: {
      type: 'object',
      properties: {
        titre: { type: 'string' },
        type: {
          type: 'string',
          enum: ['post_linkedin', 'email', 'contenu_blog', 'campagne_pub', 'autre'],
        },
        date_prevue: { type: 'string', description: 'Format YYYY-MM-DD' },
        description: { type: 'string' },
        campaign_id: { type: 'string', description: 'Optionnel, UUID de la campagne liée' },
      },
      required: ['titre', 'type'],
    },
    async describe(_supabase: any, input: any) {
      return `Planifier l'action marketing « ${input.titre} »`
    },
    async execute(supabase: any, input: any) {
      const { data, error } = await supabase
        .from('marketing_actions')
        .insert({
          titre: input.titre,
          type: input.type,
          date_prevue: input.date_prevue || null,
          description: input.description || null,
          campaign_id: input.campaign_id || null,
          statut: 'planifié',
        })
        .select('id')
        .single()
      if (error) throw error
      return { table: 'marketing_actions', id: data.id }
    },
  },
  {
    name: 'creer_campagne',
    description: "Propose la création d'une nouvelle campagne marketing.",
    input_schema: {
      type: 'object',
      properties: {
        nom: { type: 'string' },
        objectif: { type: 'string' },
        date_debut: { type: 'string', description: 'Format YYYY-MM-DD' },
        date_fin: { type: 'string', description: 'Format YYYY-MM-DD' },
        budget: { type: 'number' },
      },
      required: ['nom'],
    },
    async describe(_supabase: any, input: any) {
      return `Créer la campagne « ${input.nom} »`
    },
    async execute(supabase: any, input: any) {
      const { data, error } = await supabase
        .from('campaigns')
        .insert({
          nom: input.nom,
          objectif: input.objectif || null,
          date_debut: input.date_debut || null,
          date_fin: input.date_fin || null,
          budget: input.budget ?? null,
          statut: 'en_préparation',
        })
        .select('id')
        .single()
      if (error) throw error
      return { table: 'campaigns', id: data.id }
    },
  },
  {
    name: 'creer_tache',
    description: "Propose la création d'une tâche transverse (pas liée à un projet précis).",
    input_schema: {
      type: 'object',
      properties: {
        titre: { type: 'string' },
        description: { type: 'string' },
        due_date: { type: 'string', description: 'Format YYYY-MM-DD' },
        priorite: { type: 'string', enum: ['haute', 'moyenne', 'basse'] },
        company_id: { type: 'string', description: 'Optionnel' },
      },
      required: ['titre'],
    },
    async describe(_supabase: any, input: any) {
      return `Créer la tâche « ${input.titre} »`
    },
    async execute(supabase: any, input: any) {
      const { data, error } = await supabase
        .from('tasks')
        .insert({
          titre: input.titre,
          description: input.description || null,
          due_date: input.due_date || null,
          priorite: input.priorite || 'moyenne',
          company_id: input.company_id || null,
          statut: 'à_faire',
        })
        .select('id')
        .single()
      if (error) throw error
      return { table: 'tasks', id: data.id }
    },
  },
  {
    name: 'creer_fiche_connaissance',
    description: "Propose la création d'une fiche dans la base de connaissance.",
    input_schema: {
      type: 'object',
      properties: {
        titre: { type: 'string' },
        categorie: {
          type: 'string',
          enum: ['script_appel', 'template_proposition', 'sop', 'autre'],
        },
        contenu: { type: 'string', description: 'Markdown' },
        tags: { type: 'array', items: { type: 'string' } },
      },
      required: ['titre', 'categorie'],
    },
    async describe(_supabase: any, input: any) {
      return `Créer la fiche de connaissance « ${input.titre} »`
    },
    async execute(supabase: any, input: any) {
      const { data, error } = await supabase
        .from('knowledge_base')
        .insert({
          titre: input.titre,
          categorie: input.categorie,
          contenu: input.contenu || null,
          tags: input.tags ?? [],
        })
        .select('id')
        .single()
      if (error) throw error
      return { table: 'knowledge_base', id: data.id }
    },
  },
]
