import { NodeResizer } from '@xyflow/react'
import { useEffect, useRef, useState } from 'react'
import { useDeleteVisionNote, useUpdateVisionNote } from '../../hooks/useVisionNotes'
import { hexToRgba } from '../../lib/colorUtils'
import { VISION_NOTE_COLORS } from '../../lib/constants'

const DEBOUNCE_MS = 800

export default function PostItNode({ id, data }) {
  const [hovered, setHovered] = useState(false)
  const [showColors, setShowColors] = useState(false)
  const [text, setText] = useState(data.contenu ?? '')
  const [couleur, setCouleur] = useState(data.couleur || VISION_NOTE_COLORS[0])
  const updateNote = useUpdateVisionNote()
  const deleteNote = useDeleteVisionNote()
  const debounceRef = useRef(null)
  const textareaRef = useRef(null)

  useEffect(() => {
    if (data.autoFocus) {
      textareaRef.current?.focus()
    }
  }, [data.autoFocus])

  useEffect(() => () => clearTimeout(debounceRef.current), [])

  function handleTextChange(event) {
    const value = event.target.value
    setText(value)
    clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      updateNote.mutate({ id, values: { contenu: value } })
    }, DEBOUNCE_MS)
  }

  function handleColorChange(color) {
    setCouleur(color)
    setShowColors(false)
    updateNote.mutate({ id, values: { couleur: color } })
  }

  function handleDelete() {
    deleteNote.mutate({ id })
    data.onDeleted(id)
  }

  function handleResizeEnd(_event, params) {
    updateNote.mutate({ id, values: { largeur: params.width, hauteur: params.height } })
  }

  return (
    <div
      className="h-full w-full"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => {
        setHovered(false)
        setShowColors(false)
      }}
    >
      <NodeResizer
        minWidth={140}
        minHeight={120}
        isVisible={hovered}
        onResizeEnd={handleResizeEnd}
        handleStyle={{ width: 10, height: 10, borderRadius: 4, borderColor: '#a3a3a3' }}
        lineStyle={{ borderWidth: 0 }}
      />
      <div
        className="vision-glass-note relative flex h-full w-full flex-col rounded-lg border p-3"
        style={{
          backgroundColor: hexToRgba(couleur, 0.28),
          borderColor: hexToRgba(couleur, 0.6),
          transform: `rotate(${data.rotation ?? 0}deg)`,
        }}
      >
        {hovered && (
          <div className="nodrag absolute -right-2 -top-2 z-10 flex gap-1">
            <button
              type="button"
              onClick={() => setShowColors((prev) => !prev)}
              className="flex h-6 w-6 items-center justify-center rounded-full border border-neutral-300 bg-white text-xs shadow-sm hover:scale-110"
              title="Changer la couleur"
            >
              🎨
            </button>
            <button
              type="button"
              onClick={handleDelete}
              className="flex h-6 w-6 items-center justify-center rounded-full border border-neutral-300 bg-white text-xs text-neutral-500 shadow-sm hover:bg-red-50 hover:text-red-600"
              title="Supprimer"
            >
              ✕
            </button>
          </div>
        )}

        {showColors && (
          <div className="nodrag absolute -top-11 right-0 z-10 flex gap-1 rounded-full border border-neutral-200 bg-white p-1.5 shadow-md">
            {VISION_NOTE_COLORS.map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => handleColorChange(color)}
                className="h-5 w-5 rounded-full border border-black/10 transition-transform duration-100 hover:scale-125"
                style={{ backgroundColor: color }}
                title={color}
              />
            ))}
          </div>
        )}

        <textarea
          ref={textareaRef}
          value={text}
          onChange={handleTextChange}
          placeholder="Écris ton idée…"
          className="font-handwriting nodrag h-full w-full flex-1 resize-none border-none bg-transparent text-xl leading-snug text-white placeholder:text-white/40 focus:outline-none"
        />
      </div>
    </div>
  )
}
