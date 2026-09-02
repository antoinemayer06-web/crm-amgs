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
import { PROJECT_STATUT_LABELS, PROJECT_STATUT_OPTIONS } from '../../lib/constants'
import { getStepsCount } from '../../lib/projectUtils'
import ProjectCard from './ProjectCard'

function DraggableCard({ project, stepsCount, onClick }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: project.id,
    data: { statut: project.statut },
  })

  return (
    <div ref={setNodeRef} className={isDragging ? 'opacity-30' : ''}>
      <ProjectCard
        project={project}
        stepsCount={stepsCount}
        showHealth
        onClick={onClick}
        dragHandleProps={{ ...attributes, ...listeners }}
      />
    </div>
  )
}

function Column({ statut, projects, allSteps, onProjectClick }) {
  const { setNodeRef, isOver } = useDroppable({ id: statut })

  return (
    <div className="flex min-w-0 flex-col">
      <div className="mb-3 flex items-center justify-between px-1">
        <h3 className="text-sm font-medium text-ink-secondary">{PROJECT_STATUT_LABELS[statut]}</h3>
        <span className="rounded-full bg-surface-hover px-2 py-0.5 text-xs font-medium text-ink-secondary">
          {projects.length}
        </span>
      </div>
      <div
        ref={setNodeRef}
        className={`flex min-h-24 flex-1 flex-col gap-2 rounded-xl p-2 transition-colors duration-150 ${
          isOver ? 'bg-surface-hover' : 'bg-surface-hover'
        }`}
      >
        {projects.length === 0 && (
          <p className="px-2 py-6 text-center text-xs text-ink-tertiary">Aucun projet</p>
        )}
        {projects.map((project) => (
          <DraggableCard
            key={project.id}
            project={project}
            stepsCount={getStepsCount(allSteps, project.id)}
            onClick={() => onProjectClick(project)}
          />
        ))}
      </div>
    </div>
  )
}

export default function KanbanView({ projects, allSteps, onProjectClick, onStatusChange }) {
  const [activeProject, setActiveProject] = useState(null)
  // Sans distance d'activation, dnd-kit démarre un drag au moindre pixel
  // de mouvement et avale le clic : la carte ne s'ouvre plus jamais.
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
  )

  function handleDragStart(event) {
    const project = projects.find((p) => p.id === event.active.id)
    setActiveProject(project ?? null)
  }

  function handleDragEnd(event) {
    const { active, over } = event
    setActiveProject(null)
    if (!over) return
    const newStatut = over.id
    const project = projects.find((p) => p.id === active.id)
    if (project && project.statut !== newStatut) {
      onStatusChange(project.id, newStatut)
    }
  }

  return (
    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {PROJECT_STATUT_OPTIONS.map((statut) => (
          <Column
            key={statut}
            statut={statut}
            projects={projects.filter((p) => p.statut === statut)}
            allSteps={allSteps}
            onProjectClick={onProjectClick}
          />
        ))}
      </div>
      <DragOverlay>
        {activeProject && (
          <div className="w-72">
            <ProjectCard
              project={activeProject}
              stepsCount={getStepsCount(allSteps, activeProject.id)}
              showHealth
              isDragging
            />
          </div>
        )}
      </DragOverlay>
    </DndContext>
  )
}
