const cacheName = 'bistro-cache-v1';
const offlineUrl = './views/offline/offline.html';

const filesToCache = [
  offlineUrl 
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(cacheName)
      .then(cache => cache.addAll(filesToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        return response || fetch(event.request).catch(() => caches.match(offlineUrl));
      })
  );
});