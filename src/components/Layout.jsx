import { useEffect, useState } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import AiChatButton from './ai/AiChatButton'
import AiChatPanel from './ai/AiChatPanel'
import Logo from './ui/Logo'
import { useAuth } from '../lib/AuthContext'
import { AiChatProvider } from '../lib/AiChatContext'

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: '📊' },
  { to: '/finance', label: 'Finance', icon: '💶' },
  { to: '/companies', label: 'Entreprises', icon: '🏢' },
  { to: '/pipeline', label: 'Pipeline', icon: '🔄' },
  { to: '/projects', label: 'Projets', icon: '📁' },
  { to: '/marketing', label: 'Marketing', icon: '📣' },
  { to: '/knowledge', label: 'Base de connaissance', icon: '📚' },
  { to: '/assistant', label: 'Assistant IA', icon: '🤖' },
  { to: '/vision', label: 'Vision', icon: '🎨' },
  { to: '/settings', label: 'Paramètres', icon: '⚙️' },
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

  useEffect(() => {
    try {
      localStorage.setItem(COLLAPSE_KEY, String(collapsed))
    } catch {
      // stockage indisponible (navigation privée…) : pas bloquant
    }
  }, [collapsed])

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
                <span aria-hidden="true">{item.icon}</span>
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

        <main className="min-w-0 flex-1 p-6">
          <Outlet />
        </main>

        {!hideFloatingChat && (
          <>
            <AiChatButton />
            <AiChatPanel />
          </>
        )}
      </div>
    </AiChatProvider>
  )
}
