import { DndContext, closestCenter } from '@dnd-kit/core'
import {
  SortableContext,
  arrayMove,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useState } from 'react'
import {
  useCreateProjectStep,
  useDeleteProjectStep,
  useReorderProjectSteps,
  useUpdateProjectStep,
} from '../../hooks/useProjects'

function StepRow({ step, actualHours, onToggle, onDateChange, onEstimateChange, onDelete }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: step.id,
  })
  const done = step.statut === 'fait'

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={`group rounded-md px-1 py-1.5 ${
        isDragging ? 'bg-neutral-100 shadow-sm' : 'hover:bg-neutral-50'
      }`}
    >
      <div className="flex items-center gap-2">
        <span
          {...attributes}
          {...listeners}
          className="cursor-grab text-neutral-300 hover:text-neutral-500 active:cursor-grabbing"
        >
          ⠿
        </span>
        <input
          type="checkbox"
          checked={done}
          onChange={() => onToggle(step)}
          className="h-4 w-4 shrink-0 rounded border-neutral-300"
        />
        <span
          className={`flex-1 text-sm ${
            done ? 'text-neutral-400 line-through' : 'text-neutral-800'
          }`}
        >
          {step.titre}
        </span>
        <button
          type="button"
          onClick={() => onDelete(step)}
          className="text-neutral-300 opacity-0 hover:text-red-500 group-hover:opacity-100"
        >
          ✕
        </button>
      </div>
      <div className="ml-12 mt-1 flex items-center gap-2 text-xs text-neutral-400">
        <span>Du</span>
        <input
          type="date"
          value={step.date_debut ?? ''}
          onChange={(event) => onDateChange(step, 'date_debut', event.target.value || null)}
          className="rounded border border-neutral-200 px-1 py-0.5 text-xs text-neutral-500 focus:border-neutral-400 focus:outline-none"
        />
        <span>au</span>
        <input
          type="date"
          value={step.date_fin ?? ''}
          onChange={(event) => onDateChange(step, 'date_fin', event.target.value || null)}
          className="rounded border border-neutral-200 px-1 py-0.5 text-xs text-neutral-500 focus:border-neutral-400 focus:outline-none"
        />
      </div>
      <div className="ml-12 mt-1 flex items-center gap-2 text-xs text-neutral-400">
        <span>Est.</span>
        <input
          type="number"
          step="0.5"
          min="0"
          value={step.duree_estimee_heures ?? ''}
          onChange={(event) =>
            onEstimateChange(step, event.target.value === '' ? null : Number(event.target.value))
          }
          placeholder="h"
          className="w-16 rounded border border-neutral-200 px-1 py-0.5 text-xs text-neutral-500 focus:border-neutral-400 focus:outline-none"
        />
        <span>h · Réel : {actualHours ? `${actualHours} h` : '—'}</span>
      </div>
    </div>
  )
}

export default function ProjectStepsChecklist({ projectId, steps, actualHoursByStep = {} }) {
  const [newTitle, setNewTitle] = useState('')
  const createStep = useCreateProjectStep()
  const updateStep = useUpdateProjectStep()
  const deleteStep = useDeleteProjectStep()
  const reorderSteps = useReorderProjectSteps()

  function handleToggle(step) {
    updateStep.mutate({ id: step.id, values: { statut: step.statut === 'fait' ? 'à_faire' : 'fait' } })
  }

  function handleDateChange(step, field, value) {
    updateStep.mutate({ id: step.id, values: { [field]: value } })
  }

  function handleEstimateChange(step, value) {
    updateStep.mutate({ id: step.id, values: { duree_estimee_heures: value } })
  }

  function handleDelete(step) {
    deleteStep.mutate(step.id)
  }

  function handleDragEnd(event) {
    const { active, over } = event
    if (!over || active.id === over.id) return
    const oldIndex = steps.findIndex((s) => s.id === active.id)
    const newIndex = steps.findIndex((s) => s.id === over.id)
    reorderSteps.mutate(arrayMove(steps, oldIndex, newIndex))
  }

  async function handleAdd(event) {
    event.preventDefault()
    if (!newTitle.trim()) return
    await createStep.mutateAsync({
      project_id: projectId,
      titre: newTitle.trim(),
      statut: 'à_faire',
      ordre: steps.length,
    })
    setNewTitle('')
  }

  return (
    <div className="space-y-1">
      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={steps.map((s) => s.id)} strategy={verticalListSortingStrategy}>
          {steps.map((step) => (
            <StepRow
              key={step.id}
              step={step}
              actualHours={actualHoursByStep[step.id]}
              onToggle={handleToggle}
              onDateChange={handleDateChange}
              onEstimateChange={handleEstimateChange}
              onDelete={handleDelete}
            />
          ))}
        </SortableContext>
      </DndContext>

      {steps.length === 0 && (
        <p className="py-2 text-sm text-neutral-400">Aucune étape pour l'instant.</p>
      )}

      <form onSubmit={handleAdd} className="flex gap-2 pt-2">
        <input
          value={newTitle}
          onChange={(event) => setNewTitle(event.target.value)}
          placeholder="Ajouter une étape…"
          className="flex-1 rounded-md border border-neutral-300 px-3 py-1.5 text-sm focus:border-neutral-500 focus:outline-none focus:ring-1 focus:ring-neutral-500"
        />
        <button
          type="submit"
          disabled={createStep.isPending}
          className="rounded-md border border-neutral-300 px-3 py-1.5 text-sm text-neutral-700 hover:bg-neutral-100 disabled:opacity-50"
        >
          Ajouter
        </button>
      </form>
    </div>
  )
}
