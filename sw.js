const CACHE_NAME = 'cellsplit-v1';
const ASSETS = [
  './',
  './index.html',
  './manifest.json'
];

// Instalar y cachear recursos
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
});

// Estrategia: Buscar en cache, si no, ir a red
self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((res) => res || fetch(e.request))
  );
});