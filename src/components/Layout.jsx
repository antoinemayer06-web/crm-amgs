import { NavLink, Outlet, useLocation } from 'react-router-dom'
import AiChatButton from './ai/AiChatButton'
import AiChatPanel from './ai/AiChatPanel'
import { useAuth } from '../lib/AuthContext'
import { AiChatProvider } from '../lib/AiChatContext'

const navItems = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/finance', label: 'Finance' },
  { to: '/companies', label: 'Entreprises' },
  { to: '/pipeline', label: 'Pipeline' },
  { to: '/projects', label: 'Projets' },
  { to: '/marketing', label: 'Marketing' },
  { to: '/knowledge', label: 'Base de connaissance' },
  { to: '/assistant', label: 'Assistant IA' },
  { to: '/vision', label: 'Vision' },
]

export default function Layout() {
  const { user, signOut } = useAuth()
  const location = useLocation()
  const hideFloatingChat = location.pathname === '/assistant' || location.pathname === '/vision'

  return (
    <AiChatProvider>
      <div className="flex min-h-svh bg-canvas">
        <aside className="flex w-60 shrink-0 flex-col border-r border-chrome-dark bg-surface">
          <div className="flex items-center gap-3 border-b border-chrome-dark px-5 py-5">
            <span className="chrome-droplet chrome-droplet-circle flex h-9 w-9 shrink-0 items-center justify-center text-xs font-bold text-[#1a1b1d]">
              AM
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold tracking-tight text-ink">
                AM Growth Solutions
              </p>
              <p className="truncate text-xs text-ink-tertiary">CRM</p>
            </div>
          </div>

          <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 py-4">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `block rounded-md border-l-2 px-3 py-2 text-sm font-medium transition-colors duration-150 ${
                    isActive
                      ? 'border-chrome-light bg-surface-hover text-ink'
                      : 'border-transparent text-ink-secondary hover:bg-surface-hover hover:text-ink'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="border-t border-chrome-dark px-4 py-4">
            <p className="truncate text-xs text-ink-secondary">{user.email}</p>
            <button type="button" onClick={signOut} className="btn-secondary mt-2 w-full text-xs">
              Déconnexion
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
