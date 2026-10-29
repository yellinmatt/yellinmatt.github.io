var CACHE = "read-v4";
var SHELL = ["./", "./index.html", "./manifest.webmanifest", "./icon-180.png", "./icon-512.png"];
self.addEventListener("install", function (e) { self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then(function (c) { return Promise.all(SHELL.map(function (u) { return c.add(u).catch(function () { return null; }); })); })); });
self.addEventListener("activate", function (e) { e.waitUntil(caches.keys().then(function (k) { return Promise.all(k.map(function (x) { return x === CACHE ? null : caches.delete(x); })); }).then(function () { return self.clients.claim(); })); });
self.addEventListener("fetch", function (e) { var r = e.request; if (r.method !== "GET") return; var u = new URL(r.url); if (u.origin !== self.location.origin) return;
  e.respondWith(fetch(r).then(function (res) { if (res && res.ok) { var c = res.clone(); caches.open(CACHE).then(function (x) { x.put(r, c); }); } return res; })
    .catch(function () { return caches.match(r).then(function (m) { return m || caches.match("./index.html"); }); })); });
