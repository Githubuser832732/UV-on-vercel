importScripts("/uv/uv.bundle.js");
importScripts("/uv/uv.config.js");
importScripts(__uv$config.sw || "/uv/uv.sw.js");

const sw = new UVServiceWorker();

// Cache name for math resources
const MATH_CACHE = 'mathverse-resources-v1';

// Math-related domains to prioritize caching
const MATH_DOMAINS = [
    'wolframalpha.com',
    'mathworld.wolfram.com',
    'desmos.com',
    'khanacademy.org',
    'symbolab.com',
    'latex-project.org',
    'mathjax.org',
    'geogebra.org'
];

// Asset types to cache for math documentation
const CACHEABLE_TYPES = [
    'style',
    'script', 
    'font',
    'image'
];

/**
 * Check if URL is from a math-related domain
 * @param {string} url 
 * @returns {boolean}
 */
function isMathDomain(url) {
    try {
        const urlObj = new URL(url);
        return MATH_DOMAINS.some(domain => urlObj.hostname.includes(domain));
    } catch {
        return false;
    }
}

/**
 * Check if request is for a cacheable asset type
 * @param {Request} request 
 * @returns {boolean}
 */
function isCacheableAsset(request) {
    const destination = request.destination;
    return CACHEABLE_TYPES.includes(destination);
}

/**
 * Handle fetch with caching strategy for math resources
 * Uses stale-while-revalidate for better performance
 * @param {FetchEvent} event 
 */
async function handleFetchWithCache(event) {
    const request = event.request;
    
    // For proxied requests, use the UV service worker
    if (request.url.startsWith(location.origin + __uv$config.prefix)) {
        try {
            // Try to get from cache first for math-related assets
            const cache = await caches.open(MATH_CACHE);
            const cachedResponse = await cache.match(request);
            
            // Fetch from network
            const networkPromise = sw.fetch(event).then(response => {
                // Clone the response before caching
                if (response && response.ok && isCacheableAsset(request)) {
                    const responseToCache = response.clone();
                    cache.put(request, responseToCache).catch(() => {
                        // Ignore cache write errors
                    });
                }
                return response;
            }).catch(error => {
                console.error('[MathVerse SW] Network fetch failed:', error);
                // Return cached response if network fails
                if (cachedResponse) {
                    return cachedResponse;
                }
                throw error;
            });
            
            // Return cached response immediately if available (stale-while-revalidate)
            if (cachedResponse && isCacheableAsset(request)) {
                // Update cache in background
                networkPromise.catch(() => {});
                return cachedResponse;
            }
            
            return networkPromise;
        } catch (error) {
            console.error('[MathVerse SW] Fetch handling error:', error);
            return sw.fetch(event);
        }
    }
    
    // For non-proxied requests, use standard fetch
    return fetch(request);
}

// Main fetch event listener
self.addEventListener("fetch", (event) => {
    if (event.request.url.startsWith(location.origin + __uv$config.prefix)) {
        event.respondWith(handleFetchWithCache(event));
    }
});

// Install event - pre-cache critical assets
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(MATH_CACHE).then(cache => {
            console.log('[MathVerse SW] Cache opened');
            // Pre-cache local assets
            return cache.addAll([
                '/styles.css',
                '/app.js',
                '/uv/uv.bundle.js',
                '/uv/uv.config.js',
                '/uv/uv.handler.js',
                '/uv/uv.client.js'
            ]).catch(error => {
                console.warn('[MathVerse SW] Pre-cache failed:', error);
            });
        })
    );
    // Activate immediately
    self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames
                    .filter(name => name !== MATH_CACHE)
                    .map(name => caches.delete(name))
            );
        }).then(() => {
            console.log('[MathVerse SW] Activated and old caches cleared');
            return self.clients.claim();
        })
    );
});

// Handle messages from the main thread
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'CLEAR_CACHE') {
        caches.delete(MATH_CACHE).then(() => {
            console.log('[MathVerse SW] Cache cleared');
        });
    }
});
