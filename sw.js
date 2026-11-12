/* Qalb Nuri — oflayn ishlash uchun service worker */
const CACHE = "qalbnuri-v4";
const SHELL = [
  "./", "index.html", "manifest.json", "assets/css/style.css", "assets/img/icon.svg",
  "assets/js/app.js", "assets/js/views.js", "assets/js/data/core.js", "assets/js/data/lessons.js",
  "assets/js/data/ibodat.js", "assets/js/data/duas.js", "assets/js/data/hadith.js", "assets/js/data/names.js",
];
self.addEventListener("install", (e) => { e.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting())); });
self.addEventListener("activate", (e) => {
  e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", (e) => {
  const url = new URL(e.request.url);
  if (e.request.method !== "GET" || url.pathname.endsWith(".mp3")) return;
  // O'z fayllarimiz: avval tarmoq, bo'lmasa kesh
  if (url.origin === location.origin) {
    e.respondWith(fetch(e.request).then((r) => { const c = r.clone(); caches.open(CACHE).then((x) => x.put(e.request, c)); return r; }).catch(() => caches.match(e.request).then((r) => r || caches.match("index.html"))));
    return;
  }
  // Shriftlar va Qur'on matni: kesh, orqada yangilash
  if (/fonts\.(googleapis|gstatic)\.com|api\.alquran\.cloud/.test(url.host)) {
    e.respondWith(caches.open(CACHE).then(async (c) => {
      const hit = await c.match(e.request);
      const net = fetch(e.request).then((r) => { if (r.ok) c.put(e.request, r.clone()); return r; }).catch(() => hit);
      return hit || net;
    }));
  }
});
