import { useEffect, useState } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import AiChatButton from './ai/AiChatButton'
import AiChatPanel from './ai/AiChatPanel'
import CommandPalette from './CommandPalette'
import Logo from './ui/Logo'
import {
  IconAssistant,
  IconClose,
  IconCompanies,
  IconDashboard,
  IconFinance,
  IconKnowledge,
  IconMarketing,
  IconMenu,
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

function SidebarContent({ collapsed, user, signOut, onNavigate }) {
  return (
    <>
      <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 py-4">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            title={collapsed ? item.label : undefined}
            onClick={onNavigate}
            className={({ isActive }) =>
              `flex items-center gap-2.5 rounded-md border-l-2 px-3 py-2.5 text-sm font-medium transition-colors duration-150 md:py-2 ${
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
    </>
  )
}

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
  const [mobileNavOpen, setMobileNavOpen] = useState(false)

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
      } else if (event.key === 'Escape') {
        setMobileNavOpen(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  useEffect(() => {
    setMobileNavOpen(false)
  }, [location.pathname])

  return (
    <AiChatProvider>
      <div className="flex min-h-svh flex-col bg-canvas">
        {/* Bandeau du haut, pleine largeur : logo/nom à gauche, recherche à droite.
            padding-top en env(safe-area-inset-top) : sur iPhone en PWA installée,
            la barre de statut (horloge, réseau) est superposée au contenu plutôt
            que de le pousser — sans cette marge, le bouton menu/recherche se
            retrouve caché dessous et n'est plus cliquable. */}
        <header
          className="shrink-0 border-b border-chrome-dark bg-surface"
          style={{ paddingTop: 'env(safe-area-inset-top)' }}
        >
          <div className="flex h-14 items-center justify-between gap-3 px-4 md:px-6">
            <div className="flex min-w-0 items-center gap-3">
              <button
                type="button"
                onClick={() => setMobileNavOpen(true)}
                aria-label="Ouvrir le menu"
                className="-ml-2 flex h-11 w-11 shrink-0 items-center justify-center rounded-md text-ink-secondary hover:bg-surface-hover hover:text-ink md:hidden"
              >
                <IconMenu className="h-5 w-5" />
              </button>
              <Logo size={28} className="shrink-0" />
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold tracking-tight text-ink">
                  AM Growth Solutions
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setPaletteOpen(true)}
              aria-label="Rechercher"
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md border border-chrome-dark text-ink-tertiary hover:border-chrome-mid hover:text-ink-secondary md:hidden"
            >
              <IconSearch className="h-4 w-4" />
            </button>

            <button
              type="button"
              onClick={() => setPaletteOpen(true)}
              className="hidden shrink-0 items-center gap-2 rounded-md border border-chrome-dark px-3 py-1.5 text-sm text-ink-tertiary transition-colors duration-150 hover:border-chrome-mid hover:text-ink-secondary md:flex"
            >
              <IconSearch className="h-4 w-4" />
              <span>Rechercher</span>
              <span className="ml-1 rounded border border-chrome-dark px-1.5 py-0.5 text-xs text-ink-tertiary">
                ⌘K
              </span>
            </button>
          </div>
        </header>

        <div className="flex min-h-0 flex-1">
          {/* Sidebar desktop : rail fixe, repliable */}
          <aside
            className={`relative hidden shrink-0 flex-col border-r border-chrome-dark bg-surface transition-[width] duration-200 md:flex ${
              collapsed ? 'w-16' : 'w-60'
            }`}
          >
            <button
              type="button"
              onClick={() => setCollapsed((prev) => !prev)}
              className="absolute -right-3 top-4 z-10 flex h-6 w-6 items-center justify-center rounded-full border border-chrome-dark bg-surface text-xs text-ink-secondary hover:text-ink"
              aria-label={collapsed ? 'Déplier le menu' : 'Replier le menu'}
              title={collapsed ? 'Déplier le menu' : 'Replier le menu'}
            >
              {collapsed ? '›' : '‹'}
            </button>
            <SidebarContent collapsed={collapsed} user={user} signOut={signOut} />
          </aside>

          {/* Menu mobile : tiroir plein écran, ferme au tap en dehors ou à Échap */}
          {mobileNavOpen && (
            <div className="fixed inset-0 z-50 flex md:hidden">
              <div
                className="absolute inset-0 bg-black/60"
                onClick={() => setMobileNavOpen(false)}
                aria-hidden="true"
              />
              <aside className="relative flex h-full w-[82vw] max-w-72 flex-col bg-surface shadow-2xl">
                <div
                  className="flex items-center gap-3 border-b border-chrome-dark px-4 py-4"
                  style={{ paddingTop: 'calc(env(safe-area-inset-top) + 1rem)' }}
                >
                  <Logo size={28} className="shrink-0" />
                  <p className="min-w-0 flex-1 truncate text-sm font-semibold tracking-tight text-ink">
                    AM Growth Solutions
                  </p>
                  <button
                    type="button"
                    onClick={() => setMobileNavOpen(false)}
                    aria-label="Fermer le menu"
                    className="flex h-11 w-11 shrink-0 items-center justify-center text-ink-tertiary hover:text-ink"
                  >
                    <IconClose className="h-5 w-5" />
                  </button>
                </div>
                <SidebarContent
                  collapsed={false}
                  user={user}
                  signOut={signOut}
                  onNavigate={() => setMobileNavOpen(false)}
                />
              </aside>
            </div>
          )}

          <main className="min-w-0 flex-1 overflow-x-hidden overflow-y-auto p-4 md:p-6">
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
