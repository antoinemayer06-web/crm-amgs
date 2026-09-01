import { useProjectsByCompany } from '../../hooks/useProjects'
import Badge from '../ui/Badge'

const STATUT_TONES = {
  en_attente: 'neutral',
  en_cours: 'blue',
  en_test: 'amber',
  livré: 'green',
  en_pause: 'red',
}

const formatDate = (value) => (value ? new Date(value).toLocaleDateString('fr-FR') : '—')

export default function ProjectsTab({ companyId }) {
  const { data: projects, isLoading, isError, error } = useProjectsByCompany(companyId)

  return (
    <div className="overflow-hidden rounded-lg border border-neutral-200 bg-white">
      {isLoading && <p className="p-6 text-sm text-neutral-500">Chargement…</p>}
      {isError && <p className="p-6 text-sm text-red-600">Erreur : {error.message}</p>}
      {!isLoading && !isError && projects.length === 0 && (
        <p className="p-6 text-sm text-neutral-500">
          Aucun projet lié à cette entreprise pour l'instant.
        </p>
      )}
      {!isLoading && !isError && projects.length > 0 && (
        <table className="w-full text-left text-sm">
          <thead className="border-b border-neutral-200 text-xs uppercase text-neutral-500">
            <tr>
              <th className="px-4 py-3 font-medium">Nom</th>
              <th className="px-4 py-3 font-medium">Statut</th>
              <th className="px-4 py-3 font-medium">Début</th>
              <th className="px-4 py-3 font-medium">Livraison prévue</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {projects.map((project) => (
              <tr key={project.id}>
                <td className="px-4 py-3 font-medium text-neutral-900">{project.nom}</td>
                <td className="px-4 py-3">
                  <Badge tone={STATUT_TONES[project.statut]}>{project.statut}</Badge>
                </td>
                <td className="px-4 py-3 text-neutral-600">{formatDate(project.date_debut)}</td>
                <td className="px-4 py-3 text-neutral-600">
                  {formatDate(project.date_livraison_prevue)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
