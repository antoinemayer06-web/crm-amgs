import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { supabase } from '../lib/supabaseClient'
import {
  IconAssistant,
  IconCompanies,
  IconDashboard,
  IconFinance,
  IconKnowledge,
  IconMarketing,
  IconPerson,
  IconPipeline,
  IconProjects,
  IconSearch,
  IconSettings,
  IconVision,
} from './ui/icons'

const NAV_COMMANDS = [
  { id: 'nav-dashboard', label: 'Dashboard', to: '/dashboard', Icon: IconDashboard, group: 'Pages' },
  { id: 'nav-finance', label: 'Finance', to: '/finance', Icon: IconFinance, group: 'Pages' },
  { id: 'nav-companies', label: 'Entreprises', to: '/companies', Icon: IconCompanies, group: 'Pages' },
  { id: 'nav-pipeline', label: 'Pipeline', to: '/pipeline', Icon: IconPipeline, group: 'Pages' },
  { id: 'nav-projects', label: 'Projets', to: '/projects', Icon: IconProjects, group: 'Pages' },
  { id: 'nav-marketing', label: 'Marketing', to: '/marketing', Icon: IconMarketing, group: 'Pages' },
  { id: 'nav-knowledge', label: 'Base de connaissance', to: '/knowledge', Icon: IconKnowledge, group: 'Pages' },
  { id: 'nav-assistant', label: 'Assistant IA', to: '/assistant', Icon: IconAssistant, group: 'Pages' },
  { id: 'nav-vision', label: 'Vision', to: '/vision', Icon: IconVision, group: 'Pages' },
  { id: 'nav-settings', label: 'Paramètres', to: '/settings', Icon: IconSettings, group: 'Pages' },
]

const CREATE_COMMANDS = [
  { id: 'create-prospect', label: 'Nouveau prospect', to: '/companies?create=prospect', Icon: IconPerson, group: 'Créer' },
  { id: 'create-project', label: 'Nouveau projet', to: '/projects?create=1', Icon: IconProjects, group: 'Créer' },
]

function useSearchData(enabled) {
  return useQuery({
    queryKey: ['command-palette-search'],
    queryFn: async () => {
      const [companiesRes, projectsRes] = await Promise.all([
        supabase.from('companies').select('id, name, status').order('name').limit(300),
        supabase.from('projects').select('id, nom, company:companies(id, name)').order('nom').limit(300),
      ])
      if (companiesRes.error) throw companiesRes.error
      if (projectsRes.error) throw projectsRes.error
      return { companies: companiesRes.data, projects: projectsRes.data }
    },
    enabled,
    staleTime: 60_000,
  })
}

export default function CommandPalette({ open, onClose }) {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef(null)
  const { data } = useSearchData(open)

  useEffect(() => {
    if (open) {
      setQuery('')
      setSelectedIndex(0)
      requestAnimationFrame(() => inputRef.current?.focus())
    }
  }, [open])

  const items = useMemo(() => {
    const companyItems = (data?.companies ?? []).map((company) => ({
      id: `company-${company.id}`,
      label: company.name,
      sub: company.status === 'client' ? 'Client' : 'Prospect',
      to: `/companies/${company.id}`,
      Icon: IconCompanies,
      group: 'Entreprises',
    }))
    const projectItems = (data?.projects ?? []).map((project) => ({
      id: `project-${project.id}`,
      label: project.nom,
      sub: project.company?.name,
      to: `/projects?open=${project.id}`,
      Icon: IconProjects,
      group: 'Projets',
    }))
    return [...NAV_COMMANDS, ...CREATE_COMMANDS, ...companyItems, ...projectItems]
  }, [data])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return items.filter((item) => item.group === 'Pages' || item.group === 'Créer')
    return items.filter(
      (item) =>
        item.label.toLowerCase().includes(q) || (item.sub && item.sub.toLowerCase().includes(q)),
    )
  }, [items, query])

  function activate(item) {
    if (!item) return
    navigate(item.to)
    onClose()
  }

  function handleKeyDown(event) {
    if (event.key === 'Escape') {
      event.preventDefault()
      onClose()
    } else if (event.key === 'ArrowDown') {
      event.preventDefault()
      setSelectedIndex((prev) => Math.min(prev + 1, filtered.length - 1))
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      setSelectedIndex((prev) => Math.max(prev - 1, 0))
    } else if (event.key === 'Enter') {
      event.preventDefault()
      activate(filtered[selectedIndex])
    }
  }

  if (!open) return null

  let lastGroup = null

  return (
    <div className="fixed inset-0 z-[60] flex items-start justify-center bg-black/50 pt-[12vh]" onClick={onClose}>
      <div
        className="w-full max-w-lg overflow-hidden rounded-lg border border-chrome-dark bg-surface shadow-2xl"
        onClick={(event) => event.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        <div className="flex items-center gap-2 border-b border-chrome-dark px-4 py-3">
          <IconSearch className="h-4 w-4 shrink-0 text-ink-tertiary" />
          <input
            ref={inputRef}
            value={query}
            onChange={(event) => {
              setQuery(event.target.value)
              setSelectedIndex(0)
            }}
            placeholder="Rechercher une entreprise, un projet, une page…"
            className="w-full bg-transparent text-sm text-ink placeholder-ink-tertiary focus:outline-none"
          />
        </div>

        <div className="max-h-96 overflow-y-auto p-2">
          {filtered.length === 0 && (
            <p className="px-3 py-6 text-center text-sm text-ink-tertiary">Aucun résultat.</p>
          )}
          {filtered.map((item, index) => {
            const showGroup = item.group !== lastGroup
            lastGroup = item.group
            return (
              <div key={item.id}>
                {showGroup && (
                  <p className="px-3 pb-1 pt-2 text-xs font-medium text-ink-tertiary first:pt-1">
                    {item.group}
                  </p>
                )}
                <button
                  type="button"
                  onClick={() => activate(item)}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={`flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm transition-colors duration-100 ${
                    index === selectedIndex ? 'bg-surface-hover text-ink' : 'text-ink-secondary'
                  }`}
                >
                  <item.Icon className="h-4 w-4 shrink-0 text-ink-tertiary" />
                  <span className="min-w-0 flex-1 truncate">{item.label}</span>
                  {item.sub && <span className="shrink-0 text-xs text-ink-tertiary">{item.sub}</span>}
                </button>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
