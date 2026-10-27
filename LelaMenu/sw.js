// Offline support for patchy bar Wi-Fi: the app shell is cached up front, the wine list is
// network-first (so updates show), and map tiles/fonts are cached as they're viewed.
const VERSION = "v2";
const SHELL = `shell-${VERSION}`;
const TILES = `tiles-${VERSION}`;
const MAX_TILES = 1500;

const SHELL_FILES = [
  "./",
  "index.html",
  "css/styles.css",
  "js/main.js",
  "js/map.js",
  "js/data.js",
  "js/ui.js",
  "data/wines.json",
  "https://cdn.jsdelivr.net/npm/maplibre-gl@5.6.0/dist/maplibre-gl.js",
  "https://cdn.jsdelivr.net/npm/maplibre-gl@5.6.0/dist/maplibre-gl.css",
];
const TILE_HOSTS = ["tiles.openfreemap.org", "server.arcgisonline.com", "fonts.gstatic.com", "fonts.googleapis.com"];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(SHELL).then((c) => c.addAll(SHELL_FILES)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => ![SHELL, TILES].includes(k)).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);

  if (url.pathname.endsWith("/data/wines.json")) {
    e.respondWith(networkFirst(req, SHELL));
  } else if (TILE_HOSTS.includes(url.hostname)) {
    e.respondWith(staleWhileRevalidate(req, TILES));
  } else if (url.origin === location.origin || url.hostname === "cdn.jsdelivr.net") {
    e.respondWith(staleWhileRevalidate(req, SHELL));
  }
});

async function networkFirst(req, cacheName) {
  const cache = await caches.open(cacheName);
  try {
    const res = await fetch(req);
    if (res.ok) cache.put(req, res.clone());
    return res;
  } catch {
    return (await cache.match(req)) ?? Response.error();
  }
}

async function staleWhileRevalidate(req, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(req);
  const network = fetch(req)
    .then((res) => {
      if (res.ok || res.type === "opaque") {
        cache.put(req, res.clone());
        if (cacheName === TILES) trim(cache);
      }
      return res;
    })
    .catch(() => cached ?? Response.error());
  return cached ?? network;
}

let trimming = false;
async function trim(cache) {
  if (trimming) return;
  trimming = true;
  const keys = await cache.keys();
  for (let i = 0; i < keys.length - MAX_TILES; i++) await cache.delete(keys[i]);
  trimming = false;
}
