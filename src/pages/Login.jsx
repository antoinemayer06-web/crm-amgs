import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    setError(null)
    setLoading(true)

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (signInError) {
      setError(signInError.message)
    }
    setLoading(false)
  }

  return (
    <div className="min-h-svh flex items-center justify-center bg-canvas px-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="flex flex-col items-center gap-3 text-center">
          <span className="chrome-droplet chrome-droplet-circle flex h-14 w-14 items-center justify-center text-base font-bold text-[#1a1b1d]">
            AM
          </span>
          <div>
            <h1 className="text-xl font-semibold tracking-tight text-ink">
              AM Growth Solutions
            </h1>
            <p className="text-sm text-ink-secondary">Connexion au CRM</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label htmlFor="email" className="block text-sm font-medium text-ink-secondary">
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-md border border-chrome-dark px-3 py-2 text-sm text-ink focus:border-chrome-mid focus:outline-none focus:ring-1 focus:ring-chrome-mid"
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="password" className="block text-sm font-medium text-ink-secondary">
              Mot de passe
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-md border border-chrome-dark px-3 py-2 text-sm text-ink focus:border-chrome-mid focus:outline-none focus:ring-1 focus:ring-chrome-mid"
            />
          </div>

          {error && (
            <p className="text-sm font-medium text-red-400" role="alert">
              {error}
            </p>
          )}

          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? 'Connexion…' : 'Se connecter'}
          </button>
        </form>
      </div>
    </div>
  )
}
