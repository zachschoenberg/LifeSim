/* LIFEPAK 15 Simulator — service worker
 *
 * Makes the app open offline after the first visit (GitHub Pages / any https
 * or localhost host). index.html registers this file as 'sw.js' next to it.
 *
 * Strategy:
 *   - The page itself (index.html / the site root) is NETWORK-FIRST: when
 *     online you always get the latest published version, and the cached copy
 *     is only used when the network is unavailable. This avoids the classic
 *     "I pushed an update but the old version keeps loading" problem.
 *   - Everything else (manifest, icons, ...) is cache-first with a background
 *     refresh.
 *   - Bluetooth is unaffected: the service worker never touches BLE traffic.
 *
 * Releasing an update: just push the new index.html. Bump CACHE_VERSION only
 * if you add or rename other files and want old caches discarded right away.
 */
const CACHE_VERSION = 'lifesim-v1';

// Resolved against this worker's own location, so it works both at the root
// of a domain and under a GitHub Pages project path (/repo-name/).
const CORE_ASSETS = [
  './',
  './index.html',
  './manifest.webmanifest',
  './icons/icon-192.png',
  './icons/icon-512.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_VERSION);
    // add each asset on its own so one that isn't in the repo (for example an
    // icon size you haven't added) can't make the whole install fail
    await Promise.allSettled(CORE_ASSETS.map((url) => cache.add(new Request(url, { cache: 'reload' }))));
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const names = await caches.keys();
    await Promise.all(names.filter((n) => n !== CACHE_VERSION).map((n) => caches.delete(n)));
    await self.clients.claim();
  })());
});

function isPageRequest(request) {
  if (request.mode === 'navigate') return true;
  const url = new URL(request.url);
  return url.pathname.endsWith('/') || url.pathname.endsWith('/index.html');
}

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return; // leave third-party requests alone

  if (isPageRequest(request)) {
    // network-first for the page itself
    event.respondWith((async () => {
      const cache = await caches.open(CACHE_VERSION);
      try {
        const fresh = await fetch(request);
        if (fresh && fresh.ok) cache.put('./index.html', fresh.clone());
        return fresh;
      } catch (err) {
        const cached = (await cache.match(request, { ignoreSearch: true }))
          || (await cache.match('./index.html'))
          || (await cache.match('./'));
        if (cached) return cached;
        throw err;
      }
    })());
    return;
  }

  // cache-first, refreshed in the background
  event.respondWith((async () => {
    const cache = await caches.open(CACHE_VERSION);
    const cached = await cache.match(request);
    const refresh = fetch(request).then((resp) => {
      if (resp && resp.ok) cache.put(request, resp.clone());
      return resp;
    }).catch(() => null);
    return cached || (await refresh) || Response.error();
  })());
});
