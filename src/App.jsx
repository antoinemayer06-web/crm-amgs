import { useEffect, useState } from 'react'
import { supabase } from './lib/supabaseClient'

function App() {
  const [status, setStatus] = useState('checking')

  useEffect(() => {
    let cancelled = false

    async function checkConnection() {
      const { error } = await supabase
        .from('pipeline_stages')
        .select('id', { head: true, count: 'exact' })

      if (cancelled) return
      setStatus(error ? `erreur: ${error.message}` : 'connecté')
    }

    checkConnection()
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <div className="min-h-svh flex items-center justify-center bg-neutral-50">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-semibold text-neutral-900">
          AM Growth Solutions — CRM
        </h1>
        <p className="text-neutral-500">Supabase : {status}</p>
      </div>
    </div>
  )
}

export default App
