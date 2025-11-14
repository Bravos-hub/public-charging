/* Service Worker (precache + runtime cache) */

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('evzone-precache-v1').then((cache) =>
      cache.addAll([
        '/',
        '/index.html',
        // These paths may vary by build setup; adjust as needed.
      ])
    )
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((k) => k !== 'evzone-precache-v1' && k !== 'evzone-runtime-v1')
            .map((k) => caches.delete(k))
        )
      )
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;
  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;
      return fetch(request)
        .then((resp) => {
          const copy = resp.clone();
          caches.open('evzone-runtime-v1').then((c) => c.put(request, copy));
          return resp;
        })
        .catch(() => cached || new Response('Offline', { status: 503 }));
    })
  );
});

self.addEventListener('message', (event) => {
  if (event.data === 'skipWaiting' || (event.data && event.data.type === 'SKIP_WAITING')) {
    self.skipWaiting();
  }
});

