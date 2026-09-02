import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import { useState } from 'react'
import { STATUT_PROSPECT_OPTIONS, formatEnumLabel } from '../../lib/constants'
import ProspectCard from './ProspectCard'

function DraggableCard({ company, onClick }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: company.id,
    data: { statut_prospect: company.statut_prospect },
  })

  return (
    <div ref={setNodeRef} className={isDragging ? 'opacity-30' : ''}>
      <ProspectCard
        company={company}
        onClick={onClick}
        dimmed={company.statut_prospect === 'refus'}
        dragHandleProps={{ ...attributes, ...listeners }}
      />
    </div>
  )
}

function Column({ statut, companies, onCompanyClick }) {
  const { setNodeRef, isOver } = useDroppable({ id: statut })

  return (
    <div className="flex min-w-64 flex-1 flex-col">
      <div className="mb-3 flex items-center justify-between px-1">
        <h3 className="text-sm font-medium text-ink-secondary">{formatEnumLabel(statut)}</h3>
        <span className="rounded-full bg-surface-hover px-2 py-0.5 text-xs font-medium text-ink-secondary">
          {companies.length}
        </span>
      </div>
      <div
        ref={setNodeRef}
        className={`flex min-h-24 flex-1 flex-col gap-2 rounded-xl border p-2 transition-colors duration-150 ${
          isOver ? 'border-chrome-mid bg-canvas' : 'border-chrome-dark/40 bg-canvas'
        }`}
      >
        {companies.length === 0 && (
          <p className="px-2 py-6 text-center text-xs text-ink-tertiary">Aucun prospect</p>
        )}
        {companies.map((company) => (
          <DraggableCard key={company.id} company={company} onClick={() => onCompanyClick(company)} />
        ))}
      </div>
    </div>
  )
}

export default function PipelineKanban({ companies, onCompanyClick, onStatusChange }) {
  const [activeCompany, setActiveCompany] = useState(null)
  // Sans distance d'activation, dnd-kit démarre un drag au moindre pixel
  // de mouvement et avale le clic : la carte ne s'ouvre plus jamais.
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
  )

  function handleDragStart(event) {
    const company = companies.find((c) => c.id === event.active.id)
    setActiveCompany(company ?? null)
  }

  function handleDragEnd(event) {
    const { active, over } = event
    setActiveCompany(null)
    if (!over) return
    const newStatut = over.id
    const company = companies.find((c) => c.id === active.id)
    if (company && company.statut_prospect !== newStatut) {
      onStatusChange(company, newStatut)
    }
  }

  return (
    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="flex gap-4 overflow-x-auto pb-2">
        {STATUT_PROSPECT_OPTIONS.map((statut) => (
          <Column
            key={statut}
            statut={statut}
            companies={companies.filter((c) => c.statut_prospect === statut)}
            onCompanyClick={onCompanyClick}
          />
        ))}
      </div>
      <DragOverlay>
        {activeCompany && (
          <div className="w-64">
            <ProspectCard company={activeCompany} isDragging />
          </div>
        )}
      </DragOverlay>
    </DndContext>
  )
}
