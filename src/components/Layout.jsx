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
      <div className="min-h-svh bg-canvas">
        <header className="border-b border-chrome-dark bg-surface">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-3">
              <span className="chrome-droplet chrome-droplet-circle flex h-8 w-8 items-center justify-center text-xs font-bold text-[#1a1b1d]">
                AM
              </span>
              <h1 className="text-lg font-semibold tracking-tight text-ink">
                AM Growth Solutions
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-ink-secondary">{user.email}</span>
              <button
                type="button"
                onClick={signOut}
                className="rounded-md border border-chrome-dark px-3 py-1.5 text-sm text-ink-secondary hover:bg-surface-hover"
              >
                Déconnexion
              </button>
            </div>
          </div>
          <nav className="flex gap-1 px-6">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `border-b-2 px-3 py-2 text-sm font-medium ${
                    isActive
                      ? 'border-chrome-light text-ink'
                      : 'border-transparent text-ink-secondary hover:text-ink'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </header>

        <main className="p-6">
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
