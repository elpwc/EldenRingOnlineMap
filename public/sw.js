// PWA 缓存

const CACHE_NAME = `elpwc-eldenring-map-cache-v1`;

// Use the install event to pre-cache all initial resources.
self.addEventListener('install', event => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      cache.addAll(['./favicon.png', './index.html', './global.css', './build/main.js', './build/bundle.css', './build/zh-TW-3fb73925.js', './build/images/*']);
    })()
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    (async () => {
      const cache = await caches.open(CACHE_NAME);

      try {
        // Try to fetch the resource from the network.
        const fetchResponse = await fetch(event.request);

        // Save the resource in the cache.
        cache.put(event.request, fetchResponse.clone());

        // And return it.
        return fetchResponse;
      } catch (e) {
        // Fetching didn't work get the resource from the cache.
        const cachedResponse = await cache.match(event.request);

        // And return it.
        return cachedResponse;
      }
    })()
  );
});
