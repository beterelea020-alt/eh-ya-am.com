const CACHE_NAME = 'eh-ya-am-v3.0.1';
const APP_SHELL = [
  './', './index.html', './styles.css', './config.js', './questions.js',
  './questions-extra.js', './app.js', './manifest.json',
  './assets/icon.svg', './assets/developer-dog.jpg', './assets/hero.svg', './assets/brush.svg',
  './assets/crown.svg', './assets/trophy.svg', './assets/avatar-boy.svg', './assets/avatar-girl.svg',
  './assets/fonts/cairo-arabic-400-normal.woff2', './assets/fonts/cairo-arabic-700-normal.woff2',
  './assets/fonts/cairo-arabic-900-normal.woff2', './assets/fonts/cairo-latin-700-normal.woff2',
  './assets/fonts/cairo-latin-900-normal.woff2', './assets/fonts/lalezar-arabic-400-normal.woff2',
  './assets/fonts/lalezar-latin-400-normal.woff2'
];
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(APP_SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET' || new URL(event.request.url).origin !== self.location.origin) return;
  event.respondWith(caches.match(event.request).then(cached => {
    if (cached) return cached;
    return fetch(event.request).then(response => {
      if (response && response.ok) {
        const copy = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy));
      }
      return response;
    }).catch(() => caches.match('./index.html'));
  }));
});
