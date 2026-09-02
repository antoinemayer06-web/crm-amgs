// Contexte injecté automatiquement quand le chat est ouvert depuis une
// fiche précise (entreprise ou projet) — récupéré côté serveur avant
// l'appel à Claude, comme demandé, plutôt que de faire confiance au texte
// envoyé par le client.

export async function buildContextBlock(supabase: any, context: { type?: string; id?: string } | null) {
  if (!context?.type || !context?.id) return null

  if (context.type === 'company') {
    const [companyRes, notesRes, projectsRes] = await Promise.all([
      supabase.from('companies').select('*').eq('id', context.id).single(),
      supabase
        .from('notes')
        .select('auteur, contenu, type, created_at')
        .eq('company_id', context.id)
        .order('created_at', { ascending: false })
        .limit(5),
      supabase
        .from('projects')
        .select('id, nom, statut, date_livraison_prevue')
        .eq('company_id', context.id)
        .order('created_at', { ascending: false })
        .limit(5),
    ])
    if (companyRes.error || !companyRes.data) return null
    return (
      `L'utilisateur consulte actuellement la fiche entreprise « ${companyRes.data.name} » ` +
      `(id ${context.id}). Données actuelles :\n` +
      JSON.stringify(
        {
          entreprise: companyRes.data,
          notes_recentes: notesRes.data ?? [],
          projets_recents: projectsRes.data ?? [],
        },
        null,
        2,
      )
    )
  }

  if (context.type === 'project') {
    const { data: project, error } = await supabase
      .from('projects')
      .select('*, company:companies(id, name)')
      .eq('id', context.id)
      .single()
    if (error || !project) return null
    return (
      `L'utilisateur consulte actuellement la fiche projet « ${project.nom} » ` +
      `(id ${context.id}) du client « ${project.company?.name ?? '?'} ». Données actuelles :\n` +
      JSON.stringify(project, null, 2)
    )
  }

  return null
}
