import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import SiteOverviewTab from '../components/site-internet/SiteOverviewTab'
import SiteDemandesTab from '../components/site-internet/SiteDemandesTab'
import { useMarkNotificationRead, useNotifications } from '../hooks/useNotifications'

const TABS = [
  { key: 'vue-densemble', label: "Vue d'ensemble" },
  { key: 'demandes', label: 'Demandes' },
]

export default function SiteInternetPage() {
  const [searchParams] = useSearchParams()
  const [activeTab, setActiveTab] = useState('vue-densemble')
  const { data: notifications } = useNotifications()
  const markRead = useMarkNotificationRead()

  useEffect(() => {
    const tab = searchParams.get('tab')
    if (tab === 'demandes') setActiveTab('demandes')
  }, [searchParams])

  // Le badge de la nav se réinitialise dès la consultation de la section :
  // on marque comme lues toutes les notifications "nouvelle demande site"
  // encore non lues à l'ouverture de la page.
  useEffect(() => {
    const unread = (notifications ?? []).filter((n) => n.type === 'nouvelle_demande_site' && !n.lue)
    unread.forEach((n) => markRead.mutate(n.id))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [notifications])

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold tracking-tight text-ink">Site internet</h2>

      <div className="border-b border-chrome-dark">
        <nav className="flex w-max min-w-full gap-1">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={`shrink-0 border-b-2 px-3 py-2 text-sm font-medium ${
                activeTab === tab.key
                  ? 'border-chrome-light text-ink'
                  : 'border-transparent text-ink-secondary hover:text-ink'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {activeTab === 'vue-densemble' && <SiteOverviewTab />}
      {activeTab === 'demandes' && <SiteDemandesTab openLeadId={searchParams.get('open')} />}
    </div>
  )
}
