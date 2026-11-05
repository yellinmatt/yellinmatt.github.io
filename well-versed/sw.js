// Well-Versed service worker (upgrade 3.1, PWA first). Same-origin only, no analytics, no push.
// Pages and lessons.js change (library.html and coverage.html every morning), so they are network-first
// with the cache as the offline fallback. Images and other assets are cache-first.
const VERSION = 'wv-v2';
const SHELL = ['./', './index.html', './lessons.js', './favicon.svg', './manifest.webmanifest'];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== VERSION).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  if (e.request.method !== 'GET' || url.origin !== location.origin || !url.pathname.startsWith('/well-versed/')) return;
  const fresh = e.request.mode === 'navigate' || url.pathname.endsWith('/') || url.pathname.endsWith('.html') || url.pathname.endsWith('lessons.js');
  if (fresh) {
    e.respondWith(fetch(e.request).then(r => { const c = r.clone(); caches.open(VERSION).then(x => x.put(e.request, c)); return r; })
      .catch(() => caches.match(e.request)));
  } else {
    e.respondWith(caches.match(e.request).then(hit => hit || fetch(e.request).then(r => {
      if (r.ok) { const c = r.clone(); caches.open(VERSION).then(x => x.put(e.request, c)); }
      return r;
    })));
  }
});
