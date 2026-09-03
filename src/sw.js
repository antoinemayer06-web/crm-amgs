import { cleanupOutdatedCaches, precacheAndRoute } from 'workbox-precaching'

// Précache des assets buildés (identique à ce que faisait le mode
// generateSW) — nécessaire pour garder l'app installable hors ligne.
precacheAndRoute(self.__WB_MANIFEST)
cleanupOutdatedCaches()

self.addEventListener('message', (event) => {
  if (event.data?.type === 'SKIP_WAITING') self.skipWaiting()
})

// Notification push : le payload est le JSON envoyé par la fonction
// planifiée (titre, message, lien vers l'entité concernée).
self.addEventListener('push', (event) => {
  if (!event.data) return

  let payload
  try {
    payload = event.data.json()
  } catch {
    payload = { titre: 'AM Growth Solutions', message: event.data.text() }
  }

  const { titre, message, url } = payload

  event.waitUntil(
    self.registration.showNotification(titre || 'AM Growth Solutions', {
      body: message,
      icon: '/icons/icon-192.png',
      badge: '/icons/icon-192.png',
      data: { url: url || '/dashboard' },
    }),
  )
})

// Clic sur la notification : ouvre l'app sur l'entité concernée, ou
// remet le focus sur un onglet déjà ouvert plutôt que d'en créer un.
self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  const targetUrl = event.notification.data?.url || '/dashboard'

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientsList) => {
      for (const client of clientsList) {
        if (client.url.startsWith(self.location.origin) && 'focus' in client) {
          client.navigate(targetUrl)
          return client.focus()
        }
      }
      if (self.clients.openWindow) return self.clients.openWindow(targetUrl)
      return undefined
    }),
  )
})
