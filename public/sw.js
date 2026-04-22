/* CompraHogar Service Worker */
const VERSION = "comprahogar-v1";
const PRECACHE = `${VERSION}-precache`;
const RUNTIME = `${VERSION}-runtime`;
const IMAGE_CACHE = `${VERSION}-images`;

const PRECACHE_URLS = [
    "/offline.html",
    "/icons/icon-192.png",
    "/icons/icon-512.png",
];

self.addEventListener("install", (event) => {
    event.waitUntil(
        caches
            .open(PRECACHE)
            .then((cache) => cache.addAll(PRECACHE_URLS))
            .then(() => self.skipWaiting())
    );
});

self.addEventListener("activate", (event) => {
    const allowed = new Set([PRECACHE, RUNTIME, IMAGE_CACHE]);
    event.waitUntil(
        caches
            .keys()
            .then((keys) =>
                Promise.all(
                    keys.map((key) => (allowed.has(key) ? null : caches.delete(key)))
                )
            )
            .then(() => self.clients.claim())
    );
});

function isShopifyImage(url) {
    return url.hostname === "cdn.shopify.com";
}

function isSameOrigin(url) {
    return url.origin === self.location.origin;
}

function isHTMLRequest(request) {
    return (
        request.mode === "navigate" ||
        (request.method === "GET" &&
            request.headers.get("accept")?.includes("text/html"))
    );
}

function isStaticAsset(url) {
    return (
        url.pathname.startsWith("/_next/static/") ||
        url.pathname.startsWith("/icons/") ||
        /\.(?:css|js|woff2?|ttf|otf|svg)$/i.test(url.pathname)
    );
}

async function staleWhileRevalidate(request, cacheName) {
    const cache = await caches.open(cacheName);
    const cached = await cache.match(request);
    const networkPromise = fetch(request)
        .then((response) => {
            if (response && response.status === 200 && response.type !== "opaque") {
                cache.put(request, response.clone());
            }
            return response;
        })
        .catch(() => cached);
    return cached || networkPromise;
}

async function networkFirstHTML(request) {
    try {
        const response = await fetch(request);
        const cache = await caches.open(RUNTIME);
        if (response && response.status === 200) {
            cache.put(request, response.clone());
        }
        return response;
    } catch {
        const cache = await caches.open(RUNTIME);
        const cached = await cache.match(request);
        if (cached) return cached;
        const offline = await caches.match("/offline.html");
        return (
            offline ||
            new Response("Sin conexión", {
                status: 503,
                headers: { "Content-Type": "text/plain; charset=utf-8" },
            })
        );
    }
}

self.addEventListener("fetch", (event) => {
    const { request } = event;

    if (request.method !== "GET") return;

    const url = new URL(request.url);

    // Never cache Shopify Storefront API or auth-sensitive endpoints
    if (
        url.hostname.endsWith("myshopify.com") ||
        url.pathname.startsWith("/api/")
    ) {
        return;
    }

    if (isShopifyImage(url)) {
        event.respondWith(staleWhileRevalidate(request, IMAGE_CACHE));
        return;
    }

    if (isSameOrigin(url) && isStaticAsset(url)) {
        event.respondWith(staleWhileRevalidate(request, RUNTIME));
        return;
    }

    if (isHTMLRequest(request) && isSameOrigin(url)) {
        event.respondWith(networkFirstHTML(request));
        return;
    }
});

self.addEventListener("message", (event) => {
    if (event.data === "SKIP_WAITING") {
        self.skipWaiting();
    }
});
