/* Odds & Fees — offline cache.
   BUMP THE VERSION STRING below whenever index.html / mobile.html change
   (e.g. fee-schedule updates), or installed apps will keep serving the old
   cached copy. */
const CACHE = 'oddsfees-v4';
const ASSETS = ['./', './index.html', './mobile.html', './apple-touch-icon.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});
/* cache-first: instant offline loads; updates arrive via a version bump */
self.addEventListener('fetch', e => {
  e.respondWith(caches.match(e.request).then(r => r || fetch(e.request)));
});
