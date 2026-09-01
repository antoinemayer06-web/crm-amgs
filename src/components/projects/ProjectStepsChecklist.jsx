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

const NEXT_STATUS = { à_faire: 'en_cours', en_cours: 'fait', fait: 'à_faire' }

function StepStatusIcon({ statut }) {
  if (statut === 'fait') {
    return (
      <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-neutral-900 text-[10px] text-white">
        ✓
      </span>
    )
  }
  if (statut === 'en_cours') {
    return (
      <span className="relative flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 border-blue-500">
        <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
      </span>
    )
  }
  return <span className="h-4 w-4 shrink-0 rounded-full border-2 border-neutral-300" />
}

function StepRow({ step, onToggle, onDelete }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: step.id,
  })

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={`group flex items-center gap-2 rounded-md px-1 py-1.5 ${
        isDragging ? 'bg-neutral-100 shadow-sm' : 'hover:bg-neutral-50'
      }`}
    >
      <span
        {...attributes}
        {...listeners}
        className="cursor-grab text-neutral-300 hover:text-neutral-500 active:cursor-grabbing"
      >
        ⠿
      </span>
      <button type="button" onClick={() => onToggle(step)}>
        <StepStatusIcon statut={step.statut} />
      </button>
      <span
        className={`flex-1 text-sm ${
          step.statut === 'fait' ? 'text-neutral-400 line-through' : 'text-neutral-800'
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
  )
}

export default function ProjectStepsChecklist({ projectId, steps }) {
  const [newTitle, setNewTitle] = useState('')
  const createStep = useCreateProjectStep()
  const updateStep = useUpdateProjectStep()
  const deleteStep = useDeleteProjectStep()
  const reorderSteps = useReorderProjectSteps()

  function handleToggle(step) {
    updateStep.mutate({ id: step.id, values: { statut: NEXT_STATUS[step.statut] } })
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
            <StepRow key={step.id} step={step} onToggle={handleToggle} onDelete={handleDelete} />
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
