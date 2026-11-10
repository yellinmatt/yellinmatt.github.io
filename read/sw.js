var CACHE = "read-v7";
var SHELL = ["./", "./index.html", "./manifest.webmanifest", "./icon-180.png", "./icon-512.png"];
self.addEventListener("install", function (e) { self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then(function (c) { return Promise.all(SHELL.map(function (u) { return c.add(u).catch(function () { return null; }); })); })); });
self.addEventListener("activate", function (e) { e.waitUntil(caches.keys().then(function (k) { return Promise.all(k.map(function (x) { return x === CACHE || x === COVERS ? null : caches.delete(x); })); }).then(function () { return self.clients.claim(); })); });
var COVERS = "read-covers-v1", COVER_MAX = 600;
var COVER_HOST = /(^|\.)mzstatic\.com$|^covers\.openlibrary\.org$|(^|\.)archive\.org$|^upload\.wikimedia\.org$|^books\.google(apis)?\.com$/;
function isCover(r, u) { return r.method === "GET" && (r.destination === "image" || r.destination === "") && (COVER_HOST.test(u.hostname) || /^\/c\/[0-9a-f]{64}$/.test(u.pathname)); }
function pickEvict(keys, lib, max) { var over = keys.length - max; if (over <= 0) return [];
  var other = keys.filter(function (k) { return !lib.has(k.replace(/\?r=\d+$/, "")); }), mine = keys.filter(function (k) { return lib.has(k.replace(/\?r=\d+$/, "")); });
  return other.concat(mine).slice(0, over); }
function trim(name, max) { return Promise.all([caches.open(name), kvGet("libcovers")]).then(function (x) { var c = x[0], lib = new Set(x[1] || []);
  return c.keys().then(function (k) { var drop = new Set(pickEvict(k.map(function (r) { return r.url; }), lib, max));
    return Promise.all(k.filter(function (r) { return drop.has(r.url); }).map(function (r) { return c.delete(r); })); }); }); }
var used = {};   // url -> last time a hit was moved to the back of the LRU order (at most once a minute per cover)
function coverFetch(r, wait) {
  var mo = { ignoreVary: true, ignoreSearch: /\/c\/[0-9a-f]{64}$/.test(new URL(r.url).pathname) };
  return caches.open(COVERS).then(function (c) { return c.match(r, mo).then(function (hit) {
    if (hit) { var now = Date.now(); if (!used[r.url] || now - used[r.url] > 60000) { used[r.url] = now; var h2 = hit.clone(); wait(c.delete(r, mo).then(function () { return c.put(r, h2); }).catch(function () {})); } return hit; }
    return fetch(r).then(function (res) {
      if (res && res.ok && res.type !== "opaque") { var cl = res.clone(); wait(c.put(r, cl).then(function () { return trim(COVERS, COVER_MAX); }).catch(function () {})); }
      return res; }); }); }); }
self.addEventListener("fetch", function (e) { var r = e.request; if (r.method !== "GET") return; var u = new URL(r.url);
  if (isCover(r, u)) { if (r.cache !== "no-store" && r.cache !== "reload") e.respondWith(coverFetch(r, function (p) { e.waitUntil(p); })); return; }
  if (u.origin !== self.location.origin) return;
  var net = fetch(r).then(function (res) { if (!res || !res.ok) return res; var c = res.clone();
    return caches.open(CACHE).then(function (x) { return x.put(r, c); }).then(function () { return res; }, function () { return res; }); });
  e.waitUntil(net.catch(function () {}));
  e.respondWith(caches.match(r, { ignoreSearch: r.mode === "navigate" }).then(function (m) {
    return m || net.catch(function () { return caches.match("./index.html"); }); })); });
function db() { return new Promise(function (ok, no) { var q = indexedDB.open("read-sw", 1); q.onupgradeneeded = function () { q.result.createObjectStore("kv"); }; q.onsuccess = function () { ok(q.result); }; q.onerror = function () { no(q.error); }; }); }
function kvGet(k) { return db().then(function (d) { return new Promise(function (ok) { var t = d.transaction("kv").objectStore("kv").get(k); t.onsuccess = function () { ok(t.result); }; t.onerror = function () { ok(null); }; }); }).catch(function () { return null; }); }
function kvSet(k, v) { return db().then(function (d) { return new Promise(function (ok) { var t = d.transaction("kv", "readwrite"); t.objectStore("kv").put(v, k); t.oncomplete = function () { ok(true); }; t.onerror = function () { ok(false); }; }); }).catch(function () { return false; }); }
self.addEventListener("message", function (e) { var m = e.data || {}; if (m.t === "read-sync" && m.url && m.token) kvSet("sync", { url: m.url, token: m.token });
  if (m.t === "warm-covers" && m.urls && m.urls.length) e.waitUntil(kvSet("libcovers", m.urls.slice(0, COVER_MAX)).then(function () { return warm(m.urls.slice(0, COVER_MAX)); })); });
function warm(urls) { return caches.open(COVERS).then(function (c) { var i = 0;
  function next() { if (i >= urls.length) return Promise.resolve(); var u = urls[i++]; var r = new Request(u, { mode: "cors", credentials: "omit" });
    return c.match(r, { ignoreVary: true }).then(function (hit) { return hit ? null : fetch(r).then(function (res) { if (res.ok) return c.put(r, res); }).catch(function () {}); }).then(next); }
  return Promise.all([next(), next(), next(), next()]).then(function () { return trim(COVERS, COVER_MAX); }); }); }
self.addEventListener("push", function (e) {
  e.waitUntil(kvGet("sync").then(function (c) {
    if (!c) return self.registration.showNotification("Read", { body: "Tonight\u2019s reading is still open.", tag: "read-nudge", data: { url: "./" } });
    return fetch(c.url.replace(/\/$/, "") + "/tonight", { headers: { Authorization: "Bearer " + c.token } }).then(function (r) { return r.json(); }).then(function (t) {
      if (t && t.met) return;
      var b = t && t.book, body = b ? (b.title + (b.pages ? ", page " + b.page + " of " + b.pages : "") + ". ") : "", g = t && t.goal;
      var need = g && g.type === "minutes" ? g.n + " min" : g && g.type === "pages" ? g.n + " pages" : "A few pages";
      body += need + (t && t.streak ? " keeps the " + t.streak + "-night streak." : " starts a streak.");
      return self.registration.showNotification("Tonight", { body: body, tag: "read-nudge", icon: "./icon-180.png", data: { url: b ? "./#start=" + b.id : "./" } });
    }).catch(function () { return self.registration.showNotification("Read", { body: "Tonight\u2019s reading is still open.", tag: "read-nudge", data: { url: "./" } }); });
  }));
});
self.addEventListener("notificationclick", function (e) { e.notification.close(); var url = new URL((e.notification.data && e.notification.data.url) || "./", self.location.href).href;
  e.waitUntil(self.clients.matchAll({ type: "window", includeUncontrolled: true }).then(function (cs) { for (var i = 0; i < cs.length; i++) { if ("focus" in cs[i]) { cs[i].navigate(url); return cs[i].focus(); } } return self.clients.openWindow(url); })); });
