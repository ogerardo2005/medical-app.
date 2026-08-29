/**
 * Minimal offline cache for the Expo web export.
 *
 * - Hashed static bundle assets (JS/CSS under /_expo/static/, fonts under
 *   /assets/) never change content under the same URL, so they're
 *   cache-first: once fetched, always served from cache.
 * - Everything else (the HTML shell, navigations) is network-first, so
 *   online users always get the latest app, falling back to the cached
 *   shell when offline. Cross-origin requests (e.g. to Supabase) are left
 *   alone entirely - this only caches the app's own static assets.
 *
 * Deliberately does NOT call clients.claim() on activate: doing so makes an
 * already-loading page's in-flight requests get re-intercepted mid-flight by
 * the new worker, racing with the browser's own consumption of those
 * responses. Without clients.claim(), a newly installed worker only takes
 * over on the *next* navigation/reload - no mid-load race.
 */
const CACHE_NAME = 'medical-app-cache-v4';
const IMMUTABLE_PREFIXES = ['/_expo/static/', '/assets/'];

self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))))
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  const isImmutableAsset = IMMUTABLE_PREFIXES.some((prefix) => url.pathname.startsWith(prefix));

  if (isImmutableAsset) {
    event.respondWith(
      (async () => {
        const cache = await caches.open(CACHE_NAME);
        const cached = await cache.match(request);
        if (cached) return cached;

        const response = await fetch(request);
        if (response.ok) {
          cache.put(request, response.clone()).catch(() => {});
        }
        return response;
      })()
    );
    return;
  }

  event.respondWith(
    (async () => {
      try {
        const response = await fetch(request);
        if (response.ok) {
          const cache = await caches.open(CACHE_NAME);
          cache.put(request, response.clone()).catch(() => {});
        }
        return response;
      } catch {
        const cached = await caches.match(request);
        return cached || caches.match('/');
      }
    })()
  );
});
