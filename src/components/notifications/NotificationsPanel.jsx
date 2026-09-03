import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../lib/AuthContext'
import { formatRelativeTime } from '../../lib/dashboardUtils'
import {
  notificationTargetUrl,
  useMarkAllNotificationsRead,
  useMarkNotificationRead,
  useNotificationSettings,
  useNotifications,
  useUpdateNotificationSettings,
} from '../../hooks/useNotifications'
import { usePushSubscription } from '../../hooks/usePushSubscription'
import SidePanel from '../ui/SidePanel'
import {
  IconBell,
  IconCalendar,
  IconCalendarClock,
  IconCheck,
  IconDocument,
  IconInvoiceClock,
  IconMarketing,
  IconSettings,
  IconTarget,
} from '../ui/icons'

const TYPE_META = {
  action_marketing_du_jour: { Icon: IconMarketing, label: 'Marketing du jour' },
  facture_impayee_7j: { Icon: IconInvoiceClock, label: 'Facture impayée' },
  objectif_mi_mois: { Icon: IconTarget, label: 'Objectif mi-mois' },
  objectif_fin_mois: { Icon: IconTarget, label: 'Bilan fin de mois' },
  projet_demarre_ou_termine_bientot: { Icon: IconCalendarClock, label: 'Projet démarre/se termine' },
  prospect_bloque_devis: { Icon: IconDocument, label: 'Devis à transmettre' },
  evenement_calendrier: { Icon: IconCalendar, label: 'Rappel événement calendrier' },
}

function NotificationRow({ notification, onMarkRead, onNavigate }) {
  const { Icon } = TYPE_META[notification.type] ?? { Icon: IconBell }
  const targetUrl = notificationTargetUrl(notification)

  function handleClick() {
    if (!notification.lue) onMarkRead(notification.id)
    if (targetUrl) onNavigate(targetUrl)
  }

  return (
    <li
      className={`card-glass flex items-start gap-3 rounded-lg px-3 py-3 ${
        targetUrl ? 'cursor-pointer' : ''
      }`}
      onClick={targetUrl ? handleClick : undefined}
    >
      <div
        className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
          notification.lue ? 'text-ink-tertiary' : 'text-ink'
        }`}
      >
        <Icon className="h-4.5 w-4.5" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <p className={`text-sm ${notification.lue ? 'text-ink-secondary' : 'font-medium text-ink'}`}>
            {notification.titre}
          </p>
          {!notification.lue && (
            <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-chrome-light" aria-hidden="true" />
          )}
        </div>
        <p className="mt-0.5 text-sm text-ink-secondary">{notification.message}</p>
        <div className="mt-1.5 flex items-center gap-3">
          <span className="text-xs text-ink-tertiary">{formatRelativeTime(notification.created_at)}</span>
          {!notification.lue && (
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation()
                onMarkRead(notification.id)
              }}
              className="text-xs text-ink-tertiary underline decoration-dotted hover:text-ink-secondary"
            >
              Marquer comme lue
            </button>
          )}
        </div>
      </div>
    </li>
  )
}

function SettingsToggle({ label, checked, onChange }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="flex w-full items-center justify-between gap-3 py-2 text-left"
    >
      <span className="text-sm text-ink-secondary">{label}</span>
      <span
        className={`relative h-6 w-10 shrink-0 rounded-full transition-colors duration-150 ${
          checked ? 'bg-chrome-light' : 'bg-chrome-dark'
        }`}
      >
        <span
          className={`absolute top-0.5 h-5 w-5 rounded-full bg-surface shadow transition-transform duration-150 ${
            checked ? 'translate-x-[18px]' : 'translate-x-0.5'
          }`}
        />
      </span>
    </button>
  )
}

function NotificationSettingsSection({ onClose }) {
  const { user } = useAuth()
  const { data: typesActifs } = useNotificationSettings()
  const updateSettings = useUpdateNotificationSettings()
  const push = usePushSubscription(user?.id)

  function toggleType(type, value) {
    if (!typesActifs) return
    updateSettings.mutate({ ownerId: user.id, typesActifs: { ...typesActifs, [type]: value } })
  }

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-chrome-dark p-3">
        <p className="mb-1 text-sm font-medium text-ink">Notifications push</p>
        {!push.supported ? (
          <p className="text-xs text-ink-tertiary">
            Non disponible sur cet appareil/navigateur (ou clé VAPID non configurée).
          </p>
        ) : push.permission === 'denied' ? (
          <p className="text-xs text-ink-tertiary">
            Notifications bloquées dans les réglages du navigateur/téléphone. Autorisez-les puis
            rechargez la page.
          </p>
        ) : push.subscribed ? (
          <div className="flex items-center justify-between gap-2">
            <p className="text-xs text-ink-tertiary">Activées sur cet appareil.</p>
            <button type="button" onClick={push.unsubscribe} className="btn-secondary text-xs" disabled={push.loading}>
              Désactiver
            </button>
          </div>
        ) : (
          <button type="button" onClick={push.subscribe} className="btn-secondary text-xs" disabled={push.loading}>
            {push.loading ? 'Activation…' : 'Activer les notifications push'}
          </button>
        )}
        {push.error && <p className="mt-1 text-xs text-red-400">{push.error}</p>}
      </div>

      <div>
        <p className="mb-1 text-sm font-medium text-ink">Types d'alertes</p>
        <div className="divide-y divide-chrome-dark">
          {Object.entries(TYPE_META).map(([type, meta]) => (
            <SettingsToggle
              key={type}
              label={meta.label}
              checked={typesActifs?.[type] ?? true}
              onChange={(value) => toggleType(type, value)}
            />
          ))}
        </div>
      </div>

      <button type="button" onClick={onClose} className="btn-secondary w-full text-sm">
        Retour aux notifications
      </button>
    </div>
  )
}

export default function NotificationsPanel({ onClose }) {
  const navigate = useNavigate()
  const { data: notifications = [] } = useNotifications()
  const markRead = useMarkNotificationRead()
  const markAllRead = useMarkAllNotificationsRead()
  const [showSettings, setShowSettings] = useState(false)

  const unreadCount = notifications.filter((n) => !n.lue).length

  function handleNavigate(url) {
    onClose()
    navigate(url)
  }

  return (
    <SidePanel title={showSettings ? 'Paramètres des notifications' : 'Notifications'} onClose={onClose}>
      {showSettings ? (
        <NotificationSettingsSection onClose={() => setShowSettings(false)} />
      ) : (
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-2">
            {unreadCount > 0 ? (
              <button
                type="button"
                onClick={() => markAllRead.mutate()}
                className="flex items-center gap-1.5 text-xs text-ink-tertiary hover:text-ink-secondary"
              >
                <IconCheck className="h-3.5 w-3.5" />
                Tout marquer comme lu
              </button>
            ) : (
              <span />
            )}
            <button
              type="button"
              onClick={() => setShowSettings(true)}
              className="flex items-center gap-1.5 text-xs text-ink-tertiary hover:text-ink-secondary"
            >
              <IconSettings className="h-3.5 w-3.5" />
              Paramètres
            </button>
          </div>

          {notifications.length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-16 text-center">
              <IconBell className="h-8 w-8 text-ink-tertiary" />
              <p className="text-sm text-ink-secondary">Aucune notification pour le moment.</p>
              <p className="text-xs text-ink-tertiary">
                Les alertes du jour apparaîtront ici automatiquement.
              </p>
            </div>
          ) : (
            <ul className="space-y-2">
              {notifications.map((notification) => (
                <NotificationRow
                  key={notification.id}
                  notification={notification}
                  onMarkRead={(id) => markRead.mutate(id)}
                  onNavigate={handleNavigate}
                />
              ))}
            </ul>
          )}
        </div>
      )}
    </SidePanel>
  )
}
