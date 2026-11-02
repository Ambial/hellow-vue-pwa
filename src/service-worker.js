// Service Worker for Hello Vue PWA
// Cache version - update this when you change assets
const CACHE_VERSION = 'v2.0';
const CACHE_NAME = `hello-vue-pwa-${CACHE_VERSION}`;

// Critical assets to pre-cache on install
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/main.js',
  '/vendors~main.js',
  '/runtime~main.js',
  '/manifest.webmanifest',
  '/icons/icon-72x72.png',
  '/icons/icon-96x96.png',
  '/icons/icon-128x128.png',
  '/icons/icon-144x144.png',
  '/icons/icon-152x152.png',
  '/icons/icon-192x192.png',
  '/icons/icon-384x384.png',
  '/icons/icon-512x512.png',
  '/icons/apple-touch-icon.png',
  '/icons/favicon-32x32.png',
  '/icons/favicon-16x16.png'
];

// Install service worker and cache assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(async (cache) => {
        console.log('Service Worker: Pre-caching critical assets');
        const promises = ASSETS_TO_CACHE.map(async (url) => {
          try {
            const response = await fetch(url);
            if (response.ok) {
              await cache.put(url, response);
            }
          } catch (err) {
            console.warn(`Service Worker: Skipped ${url}:`, err.message);
          }
        });
        await Promise.all(promises);
        console.log('Service Worker: Assets cached successfully');
      })
      .then(() => self.skipWaiting())
  );
});

// Activate service worker and purge older caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Service Worker: Purging outdated cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
    .then(() => {
      console.log('Service Worker: Activated and controlling clients');
      return self.clients.claim();
    })
  );
});

// Fetch assets with Network-First strategy for HTML & JS, Cache-First for static icons
self.addEventListener('fetch', (event) => {
  if (
    event.request.method !== 'GET' || 
    !event.request.url.startsWith('http') ||
    event.request.url.includes('/sockjs-node/') ||
    event.request.url.includes('hot-update') ||
    event.request.url.includes('/api/')
  ) {
    return;
  }

  // Network-First for HTML navigation and JS code bundles (so updates are immediate)
  if (event.request.mode === 'navigate' || event.request.url.endsWith('.js') || event.request.url.endsWith('.json')) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          if (response && response.status === 200 && response.type === 'basic') {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseClone)).catch(() => {});
          }
          return response;
        })
        .catch(() => caches.match(event.request))
    );
    return;
  }

  // Cache-First for static assets (images, icons, fonts)
  event.respondWith(
    caches.match(event.request)
      .then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }

        return fetch(event.request)
          .then((response) => {
            if (response && response.status === 200 && response.type === 'basic') {
              const responseClone = response.clone();
              caches.open(CACHE_NAME).then((cache) => {
                cache.put(event.request, responseClone).catch(() => {});
              });
            }
            return response;
          })
          .catch((error) => {
            console.error('Service Worker: Fetch failed:', error);
          });
      })
  );
});

// Listen for messages from client (e.g. SKIP_WAITING)
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
