import { Navigate, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import { useAuth } from './lib/AuthContext'
import CompanyDetailPage from './pages/CompanyDetailPage'
import CompaniesListPage from './pages/CompaniesListPage'
import Login from './pages/Login'

function App() {
  const { user, loading } = useAuth()

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
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Navigate to="/companies" replace />} />
        <Route path="companies" element={<CompaniesListPage />} />
        <Route path="companies/:id" element={<CompanyDetailPage />} />
        <Route path="*" element={<Navigate to="/companies" replace />} />
      </Route>
    </Routes>
  )
}

export default App
