const CACHE_NAME = 'inlog24-v1';
const STATIC_ASSETS = [
  '/',
  '/manifest.json',
  '/offline',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((names) =>
      Promise.all(
        names.filter((name) => name !== CACHE_NAME).map((name) => caches.delete(name))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  // Не кешируем API, WS, админку
  if (request.url.includes('/api/') || request.url.includes('/admin/')) {
    return;
  }
  // Для навигации — network-first, fallback на cache
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request).catch(() => caches.match('/offline').then((r) => r || caches.match('/')))
    );
    return;
  }
  // Для статики — cache-first
  event.respondWith(
    caches.match(request).then((cached) => cached || fetch(request))
  );
});
