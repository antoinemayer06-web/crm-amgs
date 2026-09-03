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
        className="vision-glass-note relative flex h-full w-full flex-col items-center rounded-lg border p-2"
        style={{
          backgroundColor: 'rgba(216, 219, 222, 0.14)',
          borderColor: 'rgba(216, 219, 222, 0.4)',
          transform: `rotate(${data.rotation ?? 0}deg)`,
        }}
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
            loading="lazy"
            decoding="async"
            className="h-full w-full flex-1 select-none rounded-md object-contain"
            draggable={false}
          />
        ) : (
          <div className="flex h-full w-full flex-1 items-center justify-center rounded-md bg-white/5 text-xs text-white/50">
            Chargement…
          </div>
        )}
      </div>
    </div>
  )
}
