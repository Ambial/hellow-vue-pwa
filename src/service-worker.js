// Service Worker for Hello Vue PWA
// Cache version - update this when you change assets
const CACHE_VERSION = 'v1';
const CACHE_NAME = `hello-vue-pwa-${CACHE_VERSION}`;

// Files to cache for offline use
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
  '/icons/icon-512x512.png'
];

// Install service worker and cache assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Service Worker: Caching assets');
        return cache.addAll(ASSETS_TO_CACHE);
      })
      .then(() => {
        console.log('Service Worker: Assets cached successfully');
        return self.skipWaiting(); // Activate immediately
      })
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
  // Skip API requests and non-GET requests
  if (event.request.method !== 'GET' || event.request.url.includes('/api/')) {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then((cachedResponse) => {
        // Return cached response if available
        if (cachedResponse) {
          return cachedResponse;
        }
        
        // Otherwise, fetch from network and cache it
        return fetch(event.request)
          .then((response) => {
            // Clone the response (streams can only be read once)
            const responseClone = response.clone();
            
            // Cache the new resource
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseClone);
              });
            
            return response;
          })
          .catch((error) => {
            console.error('Service Worker: Fetch failed:', error);
          });
      })
  );
});

// Listen for push notifications (optional future feature)
self.addEventListener('push', (event) => {
  const data = event.data ? event.data.json() : {};
  const title = data.title || 'Hello Vue PWA';
  const options = {
    body: data.body || 'You have a new message',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-72x72.png'
  };
  
  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});
