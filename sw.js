/* 여행 언어 노트 — 오프라인 캐시 (비행기 모드에서도 열리도록) */
const CACHE = "travel-lingo-v6";
const ASSETS = [
  "./",
  "./index.html",
  "./manifest.json",
  "./icon-192.png",
  "./icon-512.png",
  "./apple-touch-icon.png"
];

self.addEventListener("install", e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

/* 캐시 우선, 실패 시 네트워크 — 완전 오프라인에서도 항상 뜨도록 */
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  /* 버전 파일과 sw는 항상 네트워크에서 (업데이트 감지용) */
  if (/version\.json|sw\.js/.test(e.request.url)) {
    e.respondWith(fetch(e.request).catch(() => caches.match(e.request)));
    return;
  }
  e.respondWith(
    caches.match(e.request).then(cached => {
      if (cached) return cached;
      return fetch(e.request).then(res => {
        const copy = res.clone();
        caches.open(CACHE).then(c => c.put(e.request, copy));
        return res;
      }).catch(() => caches.match("./index.html"));
    })
  );
});
