/* Train service worker.
   Deliberately NETWORK-FIRST, not cache-first. A cache-first worker on a single-file app is how
   you end up staring at last week's build with no way to force an update from a phone. Every load
   tries the network, and the cache exists only so the app still opens when there is no signal.
   The app's own state lives in localStorage and is never touched here. */
var CACHE = "train-v13";
/* v27.8 U7: the workout pages and the plan files are cached with the shell, so a gym with no signal
   still opens Push, Pull and Legs on a phone that has never opened them there. */
var SHELL = ["./", "./index.html", "./manifest.webmanifest", "./icon-180.png", "./icon-512.png",
  "./train-sync-auto.js", "./d/push.html", "./d/pull.html", "./d/legs.html", "./d/custom.html", "./d/progs.json", "./d/plan.json"];

self.addEventListener("install", function (e) {
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then(function (c) {
    return Promise.all(SHELL.map(function (u) {
      return c.add(u).catch(function () { return null; });
    }));
  }));
});

self.addEventListener("activate", function (e) {
  e.waitUntil(caches.keys().then(function (keys) {
    return Promise.all(keys.map(function (k) {
      return k === CACHE ? null : caches.delete(k);
    }));
  }).then(function () { return self.clients.claim(); }));
});

self.addEventListener("fetch", function (e) {
  var req = e.request;
  if (req.method !== "GET") return;
  var url = new URL(req.url);
  /* Same-origin only. Sync calls to the Worker and any YouTube embed must never be intercepted. */
  if (url.origin !== self.location.origin) return;

  e.respondWith(
    fetch(req).then(function (res) {
      if (res && res.ok) {
        var copy = res.clone();
        caches.open(CACHE).then(function (c) { c.put(req, copy); });
      }
      return res;
    }).catch(function () {
      /* Review R9: match without the ?v= query, and never answer a workout page with the whole app. */
      return caches.match(req).then(function (exact) { return exact || caches.match(req, { ignoreSearch: true }); }).then(function (hit) {
        if (hit) return hit;
        if (url.pathname.indexOf("/d/") >= 0 && req.mode !== "navigate" && req.destination !== "iframe" && req.destination !== "document") return new Response("", { status: 503 });
        if (url.pathname.indexOf("/d/") >= 0) return new Response('<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><body style="background:#0B0D11;color:#F3F5F8;font:17px -apple-system,system-ui;padding:40px 24px"><p>This workout is not saved for offline use yet. Open it once with a signal and it will be.</p><p><a href="../index.html" style="color:#FF5C3A">Back to Train</a></p><script>try{if(parent!==window&&parent.location.origin===location.origin)document.querySelector("a").onclick=function(e){e.preventDefault();parent.postMessage({wk:"close"},location.origin);};}catch(e){}<\/script>', { headers: { "Content-Type": "text/html; charset=utf-8" } });
        return caches.match("./index.html");
      });
    })
  );
});
