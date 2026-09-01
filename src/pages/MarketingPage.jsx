import { useState } from 'react'
import ActionPanel from '../components/marketing/ActionPanel'
import ActionForm from '../components/marketing/ActionForm'
import CalendarView from '../components/marketing/CalendarView'
import CampaignForm from '../components/marketing/CampaignForm'
import CampaignPanel from '../components/marketing/CampaignPanel'
import CampaignsListSection from '../components/marketing/CampaignsListSection'
import ListView from '../components/marketing/ListView'
import MarketingFilters from '../components/marketing/MarketingFilters'
import { useCampaigns, useCreateCampaign } from '../hooks/useCampaigns'
import { useCreateMarketingAction, useMarketingActions } from '../hooks/useMarketingActions'
import Modal from '../components/ui/Modal'

const VIEWS = [
  { key: 'calendar', label: 'Calendrier' },
  { key: 'list', label: 'Liste' },
  { key: 'campaigns', label: 'Campagnes' },
]

const emptyFilters = { type: '', statut: '', campaignId: '' }

function startOfMonth(date) {
  return new Date(date.getFullYear(), date.getMonth(), 1)
}

export default function MarketingPage() {
  const [view, setView] = useState('calendar')
  const [currentMonth, setCurrentMonth] = useState(() => startOfMonth(new Date()))
  const [filters, setFilters] = useState(emptyFilters)

  const [selectedActionId, setSelectedActionId] = useState(null)
  const [selectedCampaignId, setSelectedCampaignId] = useState(null)
  const [quickCreateDate, setQuickCreateDate] = useState(null)
  const [creatingAction, setCreatingAction] = useState(false)
  const [creatingCampaign, setCreatingCampaign] = useState(false)

  const { data: allActions, isLoading: loadingCalendar, isError: errorCalendar } =
    useMarketingActions({})
  const { data: filteredActions, isLoading: loadingList, isError: errorList } =
    useMarketingActions(filters)
  const { data: campaigns } = useCampaigns()
  const createAction = useCreateMarketingAction()
  const createCampaign = useCreateCampaign()

  const isLoading = view === 'calendar' ? loadingCalendar : loadingList
  const isError = view === 'calendar' ? errorCalendar : errorList

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-neutral-900">Marketing</h2>
        <button
          type="button"
          onClick={() => setCreatingAction(true)}
          className="rounded-md bg-neutral-900 px-3 py-2 text-sm font-medium text-white hover:bg-neutral-800"
        >
          Nouvelle action
        </button>
      </div>

      <div className="flex items-center justify-between gap-4">
        {view === 'list' ? (
          <MarketingFilters filters={filters} onChange={setFilters} campaigns={campaigns} />
        ) : (
          <div />
        )}

        <div className="flex shrink-0 rounded-lg border border-neutral-200 bg-white p-1">
          {VIEWS.map((v) => (
            <button
              key={v.key}
              type="button"
              onClick={() => setView(v.key)}
              className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors duration-150 ${
                view === v.key
                  ? 'bg-neutral-900 text-white'
                  : 'text-neutral-500 hover:text-neutral-900'
              }`}
            >
              {v.label}
            </button>
          ))}
        </div>
      </div>

      {view !== 'campaigns' && isLoading && <p className="text-sm text-neutral-500">Chargement…</p>}
      {view !== 'campaigns' && isError && (
        <p className="text-sm text-red-600">Erreur lors du chargement des actions.</p>
      )}

      <div className="animate-[fadein_150ms_ease-out]" key={view}>
        {view === 'calendar' && !isLoading && !isError && (
          <CalendarView
            currentMonth={currentMonth}
            actions={allActions ?? []}
            onPrevMonth={() =>
              setCurrentMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1))
            }
            onNextMonth={() =>
              setCurrentMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1))
            }
            onToday={() => setCurrentMonth(startOfMonth(new Date()))}
            onDayClick={(date) => setQuickCreateDate(date)}
            onActionClick={(action) => setSelectedActionId(action.id)}
          />
        )}

        {view === 'list' && !isLoading && !isError && (
          <ListView
            actions={filteredActions ?? []}
            onActionClick={(action) => setSelectedActionId(action.id)}
          />
        )}

        {view === 'campaigns' && (
          <CampaignsListSection
            campaigns={campaigns ?? []}
            onCampaignClick={(campaign) => setSelectedCampaignId(campaign.id)}
            onCreate={() => setCreatingCampaign(true)}
          />
        )}
      </div>

      {selectedActionId && (
        <ActionPanel
          actionId={selectedActionId}
          onClose={() => setSelectedActionId(null)}
          onDeleted={() => setSelectedActionId(null)}
        />
      )}

      {selectedCampaignId && (
        <CampaignPanel
          campaignId={selectedCampaignId}
          onClose={() => setSelectedCampaignId(null)}
          onDeleted={() => setSelectedCampaignId(null)}
          onActionClick={(actionId) => setSelectedActionId(actionId)}
        />
      )}

      {(creatingAction || quickCreateDate) && (
        <Modal
          title="Nouvelle action"
          onClose={() => {
            setCreatingAction(false)
            setQuickCreateDate(null)
          }}
        >
          <ActionForm
            defaultDate={quickCreateDate}
            campaigns={campaigns}
            submitting={createAction.isPending}
            onCancel={() => {
              setCreatingAction(false)
              setQuickCreateDate(null)
            }}
            onSubmit={async (values) => {
              await createAction.mutateAsync(values)
              setCreatingAction(false)
              setQuickCreateDate(null)
            }}
          />
        </Modal>
      )}

      {creatingCampaign && (
        <Modal title="Nouvelle campagne" onClose={() => setCreatingCampaign(false)}>
          <CampaignForm
            submitting={createCampaign.isPending}
            onCancel={() => setCreatingCampaign(false)}
            onSubmit={async (values) => {
              const campaign = await createCampaign.mutateAsync(values)
              setCreatingCampaign(false)
              setSelectedCampaignId(campaign.id)
            }}
          />
        </Modal>
      )}
    </div>
  )
}
