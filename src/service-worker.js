// Service Worker for Hello Vue PWA
// Cache version - update this when you change assets
const CACHE_VERSION = 'v1.1';
const CACHE_NAME = `hello-vue-pwa-${CACHE_VERSION}`;

// Files to cache for offline use
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/main.js',
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

// Optional chunks that may vary between dev and production
const OPTIONAL_ASSETS = [
  '/vendors~main.js',
  '/runtime~main.js'
];

// Install service worker and cache assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(async (cache) => {
        console.log('Service Worker: Caching critical assets');
        
        // Cache assets resiliently so a missing optional chunk doesn't break installation
        const cachePromises = ASSETS_TO_CACHE.concat(OPTIONAL_ASSETS).map(async (url) => {
          try {
            const response = await fetch(url);
            if (response.ok) {
              await cache.put(url, response);
            }
          } catch (err) {
            // Non-critical if optional assets fail in some dev configurations
            console.warn(`Service Worker: Skipped caching ${url}:`, err.message);
          }
        });

        await Promise.all(cachePromises);
        console.log('Service Worker: Assets cached successfully');
      })
      .then(() => self.skipWaiting())
      .catch((error) => {
        console.error('Service Worker: Failed to cache assets:', error);
      })
  );
});

// Activate service worker and clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Service Worker: Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
    .then(() => {
      console.log('Service Worker: Activated');
      return self.clients.claim(); // Take control of all clients
    })
  );
});

// Fetch assets from cache or network
self.addEventListener('fetch', (event) => {
  // Only handle HTTP/HTTPS GET requests, skip Webpack HMR and API requests
  if (
    event.request.method !== 'GET' || 
    !event.request.url.startsWith('http') ||
    event.request.url.includes('/sockjs-node/') ||
    event.request.url.includes('hot-update') ||
    event.request.url.includes('/api/')
  ) {
    return;
  }

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

// Listen for messages from clients (e.g. skipWaiting)
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
