const CACHE = 'vips-v1';
const ARCHIVOS_BASE = ['/', '/manifest.webmanifest', '/icon-192.png', '/icon-512.png'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(ARCHIVOS_BASE)).catch(() => {})
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((claves) =>
      Promise.all(claves.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Network-first: siempre intenta traer la versión más nueva, y solo usa la
// caché como respaldo si no hay conexión — así nunca se muestran datos viejos.
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        const copia = response.clone();
        caches.open(CACHE).then((cache) => cache.put(event.request, copia)).catch(() => {});
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});
