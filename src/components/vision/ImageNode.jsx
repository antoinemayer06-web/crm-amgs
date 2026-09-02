import { NodeResizer } from '@xyflow/react'
import { useState } from 'react'
import { useDeleteVisionNote, useUpdateVisionNote } from '../../hooks/useVisionNotes'

export default function ImageNode({ id, data }) {
  const [hovered, setHovered] = useState(false)
  const updateNote = useUpdateVisionNote()
  const deleteNote = useDeleteVisionNote()

  function handleResizeEnd(_event, params) {
    updateNote.mutate({ id, values: { largeur: params.width, hauteur: params.height } })
  }

  function handleDelete() {
    deleteNote.mutate({ id, imagePath: data.imagePath })
    data.onDeleted(id)
  }

  return (
    <div className="h-full w-full" onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
      <NodeResizer
        minWidth={120}
        minHeight={120}
        isVisible={hovered}
        onResizeEnd={handleResizeEnd}
        keepAspectRatio
        handleStyle={{ width: 10, height: 10, borderRadius: 4, borderColor: '#a3a3a3' }}
        lineStyle={{ borderWidth: 0 }}
      />
      <div
        className="relative flex h-full w-full flex-col items-center bg-white p-2 pb-4 shadow-lg transition-shadow duration-150"
        style={{ transform: `rotate(${data.rotation ?? 0}deg)` }}
      >
        {hovered && (
          <button
            type="button"
            onClick={handleDelete}
            className="nodrag absolute -right-2 -top-2 z-10 flex h-6 w-6 items-center justify-center rounded-full border border-neutral-300 bg-white text-xs text-neutral-500 shadow-sm hover:bg-red-50 hover:text-red-600"
            title="Supprimer"
          >
            ✕
          </button>
        )}

        {data.imageUrl ? (
          <img
            src={data.imageUrl}
            alt=""
            className="h-full w-full flex-1 select-none object-contain"
            draggable={false}
          />
        ) : (
          <div className="flex h-full w-full flex-1 items-center justify-center bg-neutral-100 text-xs text-neutral-400">
            Chargement…
          </div>
        )}
      </div>
    </div>
  )
}
