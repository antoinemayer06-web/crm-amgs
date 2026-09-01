import { useAuth } from './lib/AuthContext'
import Login from './pages/Login'

function App() {
  const { user, loading, signOut } = useAuth()

  if (loading) {
    return (
      <div className="min-h-svh flex items-center justify-center bg-neutral-50">
        <p className="text-neutral-500">Chargement…</p>
      </div>
    )
  }

  if (!user) {
    return <Login />
  }

  return (
    <div className="min-h-svh bg-neutral-50">
      <header className="flex items-center justify-between border-b border-neutral-200 bg-white px-6 py-4">
        <h1 className="text-lg font-semibold text-neutral-900">
          AM Growth Solutions — CRM
        </h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-neutral-500">{user.email}</span>
          <button
            type="button"
            onClick={signOut}
            className="rounded-md border border-neutral-300 px-3 py-1.5 text-sm text-neutral-700 hover:bg-neutral-100"
          >
            Déconnexion
          </button>
        </div>
      </header>

      <main className="p-6">
        <p className="text-neutral-500">
          Connecté. Les pages du CRM arriveront ici prochainement.
        </p>
      </main>
    </div>
  )
}

export default App
