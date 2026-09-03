import { useState } from 'react'
import ClientsList from '../components/companies/ClientsList'
import ProspectsList from '../components/companies/ProspectsList'
import PullToRefresh from '../components/ui/PullToRefresh'

const TABS = [
  { key: 'prospects', label: 'Prospects' },
  { key: 'clients', label: 'Clients' },
]

export default function CompaniesListPage() {
  const [activeTab, setActiveTab] = useState('prospects')

  return (
    <PullToRefresh>
      <div className="space-y-6">
        <div className="border-b border-chrome-dark">
          <nav className="flex gap-1">
            {TABS.map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                className={`border-b-2 px-3 py-2 text-sm font-medium ${
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

        {activeTab === 'prospects' && <ProspectsList />}
        {activeTab === 'clients' && <ClientsList />}
      </div>
    </PullToRefresh>
  )
}
