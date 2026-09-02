import { useEffect, useState } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import AiChatButton from './ai/AiChatButton'
import AiChatPanel from './ai/AiChatPanel'
import CommandPalette from './CommandPalette'
import Logo from './ui/Logo'
import {
  IconAssistant,
  IconCompanies,
  IconDashboard,
  IconFinance,
  IconKnowledge,
  IconMarketing,
  IconPipeline,
  IconProjects,
  IconSearch,
  IconSettings,
  IconVision,
} from './ui/icons'
import { useAuth } from '../lib/AuthContext'
import { AiChatProvider } from '../lib/AiChatContext'

const navItems = [
  { to: '/dashboard', label: 'Dashboard', Icon: IconDashboard },
  { to: '/finance', label: 'Finance', Icon: IconFinance },
  { to: '/companies', label: 'Entreprises', Icon: IconCompanies },
  { to: '/pipeline', label: 'Pipeline', Icon: IconPipeline },
  { to: '/projects', label: 'Projets', Icon: IconProjects },
  { to: '/marketing', label: 'Marketing', Icon: IconMarketing },
  { to: '/knowledge', label: 'Base de connaissance', Icon: IconKnowledge },
  { to: '/assistant', label: 'Assistant IA', Icon: IconAssistant },
  { to: '/vision', label: 'Vision', Icon: IconVision },
  { to: '/settings', label: 'Paramètres', Icon: IconSettings },
]

const COLLAPSE_KEY = 'sidebar-collapsed'

export default function Layout() {
  const { user, signOut } = useAuth()
  const location = useLocation()
  const hideFloatingChat = location.pathname === '/assistant' || location.pathname === '/vision'
  const [collapsed, setCollapsed] = useState(() => {
    try {
      return localStorage.getItem(COLLAPSE_KEY) === 'true'
    } catch {
      return false
    }
  })
  const [paletteOpen, setPaletteOpen] = useState(false)

  useEffect(() => {
    try {
      localStorage.setItem(COLLAPSE_KEY, String(collapsed))
    } catch {
      // stockage indisponible (navigation privée…) : pas bloquant
    }
  }, [collapsed])

  useEffect(() => {
    function handleKeyDown(event) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        setPaletteOpen((prev) => !prev)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <AiChatProvider>
      <div className="flex min-h-svh bg-canvas">
        <aside
          className={`relative flex shrink-0 flex-col border-r border-chrome-dark bg-surface transition-[width] duration-200 ${
            collapsed ? 'w-16' : 'w-60'
          }`}
        >
          <button
            type="button"
            onClick={() => setCollapsed((prev) => !prev)}
            className="absolute -right-3 top-6 z-10 flex h-6 w-6 items-center justify-center rounded-full border border-chrome-dark bg-surface text-xs text-ink-secondary hover:text-ink"
            aria-label={collapsed ? 'Déplier le menu' : 'Replier le menu'}
            title={collapsed ? 'Déplier le menu' : 'Replier le menu'}
          >
            {collapsed ? '›' : '‹'}
          </button>

          <div
            className={`flex items-center gap-3 border-b border-chrome-dark px-5 py-5 ${collapsed ? 'justify-center px-3' : ''}`}
          >
            <Logo size={36} className="shrink-0 drop-shadow-[0_2px_6px_rgba(0,0,0,0.5)]" />
            {!collapsed && (
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold tracking-tight text-ink">
                  AM Growth Solutions
                </p>
                <p className="truncate text-xs text-ink-tertiary">CRM</p>
              </div>
            )}
          </div>

          <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 py-4">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                title={collapsed ? item.label : undefined}
                className={({ isActive }) =>
                  `flex items-center gap-2.5 rounded-md border-l-2 px-3 py-2 text-sm font-medium transition-colors duration-150 ${
                    collapsed ? 'justify-center px-0' : ''
                  } ${
                    isActive
                      ? 'border-chrome-light bg-surface-hover text-ink'
                      : 'border-transparent text-ink-secondary hover:bg-surface-hover hover:text-ink'
                  }`
                }
              >
                <item.Icon className="h-[18px] w-[18px] shrink-0" />
                {!collapsed && <span className="truncate">{item.label}</span>}
              </NavLink>
            ))}
          </nav>

          <div className={`border-t border-chrome-dark px-4 py-4 ${collapsed ? 'px-2' : ''}`}>
            {!collapsed && <p className="truncate text-xs text-ink-secondary">{user.email}</p>}
            <button
              type="button"
              onClick={signOut}
              title="Déconnexion"
              className={`btn-secondary w-full text-xs ${collapsed ? 'px-0' : 'mt-2'}`}
            >
              {collapsed ? '⏻' : 'Déconnexion'}
            </button>
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <div className="flex items-center justify-end border-b border-chrome-dark px-6 py-3">
            <button
              type="button"
              onClick={() => setPaletteOpen(true)}
              className="flex items-center gap-2 rounded-md border border-chrome-dark px-3 py-1.5 text-sm text-ink-tertiary transition-colors duration-150 hover:border-chrome-mid hover:text-ink-secondary"
            >
              <IconSearch className="h-4 w-4" />
              <span>Rechercher</span>
              <span className="ml-1 rounded border border-chrome-dark px-1.5 py-0.5 text-xs text-ink-tertiary">
                ⌘K
              </span>
            </button>
          </div>
          <main className="flex-1 p-6">
            <Outlet />
          </main>
        </div>

        {!hideFloatingChat && (
          <>
            <AiChatButton />
            <AiChatPanel />
          </>
        )}

        <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} />
      </div>
    </AiChatProvider>
  )
}
