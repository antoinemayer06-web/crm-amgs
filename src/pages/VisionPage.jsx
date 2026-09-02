import {
  Background,
  BackgroundVariant,
  Controls,
  Panel,
  ReactFlow,
  ReactFlowProvider,
  useNodesState,
  useReactFlow,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { useEffect, useRef, useState } from 'react'
import ImageNode from '../components/vision/ImageNode'
import PostItNode from '../components/vision/PostItNode'
import { useAuth } from '../lib/AuthContext'
import { VISION_NOTE_COLORS } from '../lib/constants'
import { supabase } from '../lib/supabaseClient'
import {
  useCreateVisionNote,
  useUpdateVisionNote,
  useUploadVisionImage,
  useVisionNotes,
} from '../hooks/useVisionNotes'

const NODE_TYPES = { postIt: PostItNode, image: ImageNode }
const IMAGE_SIGNED_URL_TTL = 60 * 60
const IMAGE_MAX_DIMENSION = 320

function randomRotation() {
  return Math.random() * 6 - 3
}

function randomColor() {
  return VISION_NOTE_COLORS[Math.floor(Math.random() * VISION_NOTE_COLORS.length)]
}

// Dimensions initiales du noeud image : on garde le ratio naturel de
// l'image (bornée à IMAGE_MAX_DIMENSION sur le plus grand côté) pour
// qu'elle s'affiche en entier dès la pose, sans recadrage — ensuite
// librement redimensionnable via NodeResizer (ratio conservé).
function getImageNaturalSize(file) {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => {
      URL.revokeObjectURL(url)
      resolve({ width: img.naturalWidth || IMAGE_MAX_DIMENSION, height: img.naturalHeight || IMAGE_MAX_DIMENSION })
    }
    img.onerror = () => {
      URL.revokeObjectURL(url)
      resolve({ width: IMAGE_MAX_DIMENSION, height: IMAGE_MAX_DIMENSION })
    }
    img.src = url
  })
}

function scaleToMaxDimension(width, height) {
  const scale = Math.min(IMAGE_MAX_DIMENSION / Math.max(width, height), 1)
  return { width: Math.round(width * scale), height: Math.round(height * scale) }
}

function noteToNode(note) {
  return {
    id: note.id,
    type: note.type === 'image' ? 'image' : 'postIt',
    position: { x: Number(note.position_x), y: Number(note.position_y) },
    width: Number(note.largeur),
    height: Number(note.hauteur),
    zIndex: note.z_index ?? 0,
    data: {
      contenu: note.contenu,
      couleur: note.couleur,
      rotation: Number(note.rotation ?? 0),
      imageUrl: note.resolvedImageUrl,
      imagePath: note.image_url,
    },
  }
}

function VisionCanvas() {
  const { user } = useAuth()
  const { data: visionNotes, isLoading } = useVisionNotes()
  const [nodes, setNodes, onNodesChange] = useNodesState([])
  const initializedRef = useRef(false)
  const wrapperRef = useRef(null)
  const fileInputRef = useRef(null)
  const [isDraggingFile, setIsDraggingFile] = useState(false)

  const createNote = useCreateVisionNote()
  const updateNote = useUpdateVisionNote()
  const uploadImage = useUploadVisionImage()
  const lastTapRef = useRef({ time: 0, x: 0, y: 0 })

  const { screenToFlowPosition, setCenter } = useReactFlow()

  useEffect(() => {
    if (initializedRef.current || !visionNotes) return
    initializedRef.current = true
    setNodes(visionNotes.map(noteToNode))
  }, [visionNotes, setNodes])

  function removeNode(id) {
    setNodes((current) => current.filter((node) => node.id !== id))
  }

  function nextZIndex() {
    return nodes.reduce((max, n) => Math.max(max, n.zIndex ?? 0), 0) + 1
  }

  function bumpZIndex(nodeId) {
    setNodes((current) => {
      const maxZ = current.reduce((max, n) => Math.max(max, n.zIndex ?? 0), 0)
      const target = current.find((n) => n.id === nodeId)
      if (!target || (target.zIndex ?? 0) >= maxZ) return current
      updateNote.mutate({ id: nodeId, values: { z_index: maxZ + 1 } })
      return current.map((n) => (n.id === nodeId ? { ...n, zIndex: maxZ + 1 } : n))
    })
  }

  function handleNodeDragStart(_event, node) {
    bumpZIndex(node.id)
  }

  function handleNodeDragStop(_event, node) {
    updateNote.mutate({
      id: node.id,
      values: { position_x: node.position.x, position_y: node.position.y },
    })
  }

  function getViewCenterFlowPosition() {
    const bounds = wrapperRef.current?.getBoundingClientRect()
    if (!bounds) return { x: 0, y: 0 }
    return screenToFlowPosition({ x: bounds.x + bounds.width / 2, y: bounds.y + bounds.height / 2 })
  }

  async function createPostItAt(position) {
    const values = {
      owner_id: user.id,
      type: 'note',
      contenu: '',
      position_x: position.x,
      position_y: position.y,
      largeur: 220,
      hauteur: 200,
      couleur: randomColor(),
      rotation: randomRotation(),
      z_index: nextZIndex(),
    }
    const created = await createNote.mutateAsync(values)
    const node = noteToNode(created)
    setNodes((current) => [...current, { ...node, data: { ...node.data, autoFocus: true } }])
  }

  async function createImageAt(file, position) {
    const naturalSize = await getImageNaturalSize(file)
    const { width, height } = scaleToMaxDimension(naturalSize.width, naturalSize.height)
    const path = await uploadImage.mutateAsync({ file, ownerId: user.id })
    const values = {
      owner_id: user.id,
      type: 'image',
      image_url: path,
      // Centrée sur le point sélectionné (clic/dépôt), pas ancrée par son
      // coin haut-gauche — sinon l'image apparaît décalée par rapport à
      // l'endroit choisi.
      position_x: position.x - width / 2,
      position_y: position.y - height / 2,
      largeur: width,
      hauteur: height,
      rotation: randomRotation(),
      z_index: nextZIndex(),
    }
    const created = await createNote.mutateAsync(values)
    const { data: signed } = await supabase.storage
      .from('vision')
      .createSignedUrl(path, IMAGE_SIGNED_URL_TTL)
    const node = noteToNode(created)
    setNodes((current) => [...current, { ...node, data: { ...node.data, imageUrl: signed?.signedUrl } }])
  }

  function handleDoubleClick(event) {
    if (event.target.closest('.react-flow__node')) return
    if (!event.target.closest('.react-flow__pane')) return
    const position = screenToFlowPosition({ x: event.clientX, y: event.clientY })
    createPostItAt(position)
  }

  // Le pan/zoom tactile (glisser pour déplacer, pincer pour zoomer) est
  // déjà géré nativement par React Flow. Mais un `dblclick` DOM ne se
  // déclenche pas de façon fiable sur un double-tap tactile — on le
  // détecte donc nous-mêmes à partir des `touchend` successifs.
  function handleTouchEnd(event) {
    if (event.target.closest('.react-flow__node')) return
    if (!event.target.closest('.react-flow__pane')) return
    const touch = event.changedTouches?.[0]
    if (!touch) return

    const now = Date.now()
    const last = lastTapRef.current
    const distance = Math.hypot(touch.clientX - last.x, touch.clientY - last.y)
    const isDoubleTap = now - last.time < 350 && distance < 30

    if (isDoubleTap) {
      lastTapRef.current = { time: 0, x: 0, y: 0 }
      const position = screenToFlowPosition({ x: touch.clientX, y: touch.clientY })
      createPostItAt(position)
    } else {
      lastTapRef.current = { time: now, x: touch.clientX, y: touch.clientY }
    }
  }

  function handleDragOver(event) {
    event.preventDefault()
    setIsDraggingFile(true)
  }

  function handleDragLeave() {
    setIsDraggingFile(false)
  }

  function handleDrop(event) {
    event.preventDefault()
    setIsDraggingFile(false)
    const file = event.dataTransfer.files?.[0]
    if (!file || !file.type.startsWith('image/')) return
    const position = screenToFlowPosition({ x: event.clientX, y: event.clientY })
    createImageAt(file, position)
  }

  function handleAddImageClick() {
    fileInputRef.current?.click()
  }

  function handleFileSelected(event) {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return
    createImageAt(file, getViewCenterFlowPosition())
  }

  function handleRecenter() {
    setCenter(0, 0, { zoom: 1, duration: 600 })
  }

  const nodesWithCallbacks = nodes.map((node) => ({
    ...node,
    data: { ...node.data, onDeleted: removeNode },
  }))

  const isEmpty = !isLoading && nodes.length === 0

  return (
    <div
      ref={wrapperRef}
      className="relative h-[calc(100vh-140px)] w-full overflow-hidden rounded-xl border border-neutral-700 bg-neutral-600"
      onDoubleClick={handleDoubleClick}
      onTouchEnd={handleTouchEnd}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <ReactFlow
        nodes={nodesWithCallbacks}
        onNodesChange={onNodesChange}
        nodeTypes={NODE_TYPES}
        onNodeDragStart={handleNodeDragStart}
        onNodeDragStop={handleNodeDragStop}
        panOnScroll
        zoomOnScroll={false}
        zoomOnDoubleClick={false}
        zoomActivationKeyCode="Control"
        zoomOnPinch
        minZoom={0.2}
        maxZoom={2}
        defaultViewport={{ x: 0, y: 0, zoom: 1 }}
        proOptions={{ hideAttribution: true }}
      >
        <Background variant={BackgroundVariant.Dots} gap={28} size={1.4} color="#9a9a9a" />
        <Controls showInteractive={false} position="bottom-left" />
        <Panel position="top-right" className="flex gap-2">
          <button
            type="button"
            onClick={handleAddImageClick}
            className="rounded-md border border-neutral-200 bg-white px-3 py-1.5 text-sm font-medium text-neutral-700 shadow-sm hover:bg-neutral-50"
          >
            + Image
          </button>
          <button
            type="button"
            onClick={handleRecenter}
            className="rounded-md border border-neutral-200 bg-white px-3 py-1.5 text-sm font-medium text-neutral-700 shadow-sm hover:bg-neutral-50"
          >
            Retour au centre
          </button>
        </Panel>
      </ReactFlow>

      {isDraggingFile && (
        <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center border-4 border-dashed border-neutral-400 bg-white/60">
          <p className="text-sm font-medium text-neutral-600">Dépose ton image ici</p>
        </div>
      )}

      {isEmpty && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <p className="max-w-xs text-center text-sm text-neutral-400">
            Ton mur d'inspiration est vide, double-clique (ou double-tape sur mobile) n'importe où
            pour poser ta première idée.
          </p>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelected}
        className="hidden"
      />
    </div>
  )
}

export default function VisionPage() {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-ink">Vision</h2>
      <ReactFlowProvider>
        <VisionCanvas />
      </ReactFlowProvider>
    </div>
  )
}
