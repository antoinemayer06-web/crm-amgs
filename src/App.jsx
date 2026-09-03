import { Navigate, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import { useAuth } from './lib/AuthContext'
import AiAssistantPage from './pages/AiAssistantPage'
import CalendarPage from './pages/CalendarPage'
import CompanyDetailPage from './pages/CompanyDetailPage'
import CompaniesListPage from './pages/CompaniesListPage'
import DashboardPage from './pages/DashboardPage'
import FinancePage from './pages/FinancePage'
import KnowledgeBasePage from './pages/KnowledgeBasePage'
import KnowledgeDetailPage from './pages/KnowledgeDetailPage'
import Login from './pages/Login'
import MarketingPage from './pages/MarketingPage'
import PipelinePage from './pages/PipelinePage'
import ProjectsPage from './pages/ProjectsPage'
import SettingsPage from './pages/SettingsPage'
import VisionPage from './pages/VisionPage'

function App() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-svh flex items-center justify-center bg-canvas">
        <p className="text-ink-secondary">Chargement…</p>
      </div>
    )
  }

  if (!user) {
    return <Login />
  }

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="finance" element={<FinancePage />} />
        <Route path="companies" element={<CompaniesListPage />} />
        <Route path="companies/:id" element={<CompanyDetailPage />} />
        <Route path="pipeline" element={<PipelinePage />} />
        <Route path="projects" element={<ProjectsPage />} />
        <Route path="marketing" element={<MarketingPage />} />
        <Route path="calendar" element={<CalendarPage />} />
        <Route path="knowledge" element={<KnowledgeBasePage />} />
        <Route path="knowledge/:id" element={<KnowledgeDetailPage />} />
        <Route path="assistant" element={<AiAssistantPage />} />
        <Route path="vision" element={<VisionPage />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Route>
    </Routes>
  )
}

export default App
