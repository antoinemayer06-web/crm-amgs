import { useEffect, useState } from 'react'
import {
  getCompanyFileSignedUrl,
  useCompanyFiles,
  useCompanySettings,
  useDeleteCompanyFile,
  useUpdateCompanySettings,
  useUploadCompanyFile,
} from '../hooks/useCompanySettings'
import { useAuth } from '../lib/AuthContext'

const emptyValues = {
  nom_societe: '',
  forme_juridique: '',
  siret: '',
  adresse: '',
  code_postal: '',
  ville: '',
  email_contact: '',
  telephone: '',
  iban: '',
  bic: '',
  notes: '',
}

const formatDate = (value) => new Date(value).toLocaleDateString('fr-FR')

function Field({ label, field, values, onChange, onBlurField, type = 'text', className = '' }) {
  return (
    <div className={`space-y-1 ${className}`}>
      <label htmlFor={field} className="block text-xs font-medium text-ink-secondary">
        {label}
      </label>
      <input
        id={field}
        type={type}
        value={values[field]}
        onChange={(event) => onChange(field, event.target.value)}
        onBlur={() => onBlurField(field)}
        className="w-full input-chrome"
      />
    </div>
  )
}

export default function SettingsPage() {
  const { user } = useAuth()
  const { data: settings } = useCompanySettings()
  const updateSettings = useUpdateCompanySettings()
  const { data: files, isLoading, isError, error } = useCompanyFiles()
  const uploadFile = useUploadCompanyFile()
  const deleteFile = useDeleteCompanyFile()

  const [values, setValues] = useState(emptyValues)
  const [openingId, setOpeningId] = useState(null)
  const [uploadError, setUploadError] = useState(null)

  useEffect(() => {
    if (settings) {
      setValues({ ...emptyValues, ...settings })
    }
  }, [settings])

  function update(field, value) {
    setValues((prev) => ({ ...prev, [field]: value }))
  }

  function saveIfChanged(field) {
    const current = values[field] ?? ''
    const original = settings?.[field] ?? ''
    if (current === original) return
    updateSettings.mutate({ ownerId: user.id, values: { [field]: current || null } })
  }

  async function handleFileSelected(event) {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return
    setUploadError(null)
    try {
      await uploadFile.mutateAsync({ file, ownerId: user.id })
    } catch (err) {
      setUploadError(err.message)
    }
  }

  async function handleOpen(file) {
    setOpeningId(file.id)
    try {
      const signedUrl = await getCompanyFileSignedUrl(file.url)
      window.open(signedUrl, '_blank', 'noopener')
    } catch (openError) {
      window.alert(`Impossible d'ouvrir le fichier : ${openError.message}`)
    } finally {
      setOpeningId(null)
    }
  }

  async function handleDelete(file) {
    if (!window.confirm(`Supprimer le fichier « ${file.nom} » ?`)) return
    await deleteFile.mutateAsync({ id: file.id, path: file.url })
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold tracking-tight text-ink">Paramètres</h2>

      <div className="rounded-xl border border-chrome-dark bg-surface p-4 shadow-sm">
        <h3 className="mb-3 text-sm font-semibold text-ink">Société</h3>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Nom de la société" field="nom_societe" values={values} onChange={update} onBlurField={saveIfChanged} />
          <Field label="Forme juridique" field="forme_juridique" values={values} onChange={update} onBlurField={saveIfChanged} />
          <Field label="SIRET" field="siret" values={values} onChange={update} onBlurField={saveIfChanged} />
          <Field label="Téléphone" field="telephone" values={values} onChange={update} onBlurField={saveIfChanged} />
          <Field label="Email de contact" field="email_contact" values={values} onChange={update} onBlurField={saveIfChanged} type="email" />
          <Field label="Adresse" field="adresse" values={values} onChange={update} onBlurField={saveIfChanged} />
          <Field label="Code postal" field="code_postal" values={values} onChange={update} onBlurField={saveIfChanged} />
          <Field label="Ville" field="ville" values={values} onChange={update} onBlurField={saveIfChanged} />
        </div>
      </div>

      <div className="rounded-xl border border-chrome-dark bg-surface p-4 shadow-sm">
        <h3 className="mb-3 text-sm font-semibold text-ink">Coordonnées bancaires</h3>
        <div className="grid grid-cols-2 gap-4">
          <Field label="IBAN" field="iban" values={values} onChange={update} onBlurField={saveIfChanged} />
          <Field label="BIC" field="bic" values={values} onChange={update} onBlurField={saveIfChanged} />
        </div>
      </div>

      <div className="rounded-xl border border-chrome-dark bg-surface p-4 shadow-sm">
        <h3 className="mb-3 text-sm font-semibold text-ink">Notes</h3>
        <textarea
          rows={4}
          value={values.notes}
          onChange={(event) => update('notes', event.target.value)}
          onBlur={() => saveIfChanged('notes')}
          placeholder="Mentions légales, conditions générales, informations diverses…"
          className="w-full input-chrome"
        />
      </div>

      <div className="rounded-xl border border-chrome-dark bg-surface p-4 shadow-sm">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-ink">Fichiers</h3>
          <label className="btn-primary cursor-pointer">
            + Ajouter un fichier
            <input type="file" onChange={handleFileSelected} className="hidden" />
          </label>
        </div>

        {uploadError && <p className="mb-2 text-sm font-medium text-red-400">{uploadError}</p>}

        <div className="overflow-hidden rounded-lg border border-chrome-dark">
          {isLoading && <p className="p-6 text-sm text-ink-secondary">Chargement…</p>}
          {isError && <p className="p-6 text-sm font-medium text-red-400">Erreur : {error.message}</p>}
          {!isLoading && !isError && files.length === 0 && (
            <p className="p-6 text-sm text-ink-secondary">Aucun fichier pour l'instant.</p>
          )}
          {!isLoading && !isError && files.length > 0 && (
            <ul className="divide-y divide-chrome-dark">
              {files.map((file) => (
                <li key={file.id} className="flex items-center gap-3 px-4 py-3 text-sm">
                  <button
                    type="button"
                    onClick={() => handleOpen(file)}
                    disabled={openingId === file.id}
                    className="min-w-0 flex-1 truncate text-left font-medium text-ink hover:underline disabled:opacity-50"
                  >
                    {file.nom}
                  </button>
                  <span className="shrink-0 text-xs text-ink-tertiary">{formatDate(file.created_at)}</span>
                  <button
                    type="button"
                    onClick={() => handleDelete(file)}
                    className="shrink-0 text-red-500 hover:text-red-400"
                  >
                    Supprimer
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="rounded-xl border border-chrome-dark bg-surface p-4 shadow-sm">
        <h3 className="mb-3 text-sm font-semibold text-ink">Informations</h3>
        <p className="mb-3 text-xs text-ink-tertiary">Raccourcis clavier disponibles dans l'application.</p>
        <ul className="divide-y divide-chrome-dark text-sm">
          <li className="flex items-center justify-between py-2">
            <span className="text-ink-secondary">Ouvrir la palette de commande</span>
            <span className="flex items-center gap-1">
              <kbd className="rounded border border-chrome-dark bg-canvas px-1.5 py-0.5 text-xs text-ink">⌘</kbd>
              <kbd className="rounded border border-chrome-dark bg-canvas px-1.5 py-0.5 text-xs text-ink">K</kbd>
            </span>
          </li>
          <li className="flex items-center justify-between py-2">
            <span className="text-ink-secondary">Fermer la palette de commande</span>
            <kbd className="rounded border border-chrome-dark bg-canvas px-1.5 py-0.5 text-xs text-ink">Échap</kbd>
          </li>
          <li className="flex items-center justify-between py-2">
            <span className="text-ink-secondary">Naviguer dans les résultats</span>
            <span className="flex items-center gap-1">
              <kbd className="rounded border border-chrome-dark bg-canvas px-1.5 py-0.5 text-xs text-ink">↑</kbd>
              <kbd className="rounded border border-chrome-dark bg-canvas px-1.5 py-0.5 text-xs text-ink">↓</kbd>
            </span>
          </li>
          <li className="flex items-center justify-between py-2">
            <span className="text-ink-secondary">Sélectionner un résultat</span>
            <kbd className="rounded border border-chrome-dark bg-canvas px-1.5 py-0.5 text-xs text-ink">Entrée</kbd>
          </li>
        </ul>
      </div>
    </div>
  )
}
