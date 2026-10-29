var CACHE = "read-v5";
var SHELL = ["./", "./index.html", "./manifest.webmanifest", "./icon-180.png", "./icon-512.png"];
self.addEventListener("install", function (e) { self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then(function (c) { return Promise.all(SHELL.map(function (u) { return c.add(u).catch(function () { return null; }); })); })); });
self.addEventListener("activate", function (e) { e.waitUntil(caches.keys().then(function (k) { return Promise.all(k.map(function (x) { return x === CACHE ? null : caches.delete(x); })); }).then(function () { return self.clients.claim(); })); });
self.addEventListener("fetch", function (e) { var r = e.request; if (r.method !== "GET") return; var u = new URL(r.url); if (u.origin !== self.location.origin) return;
  e.respondWith(fetch(r).then(function (res) { if (res && res.ok) { var c = res.clone(); caches.open(CACHE).then(function (x) { x.put(r, c); }); } return res; })
    .catch(function () { return caches.match(r).then(function (m) { return m || caches.match("./index.html"); }); })); });
function db() { return new Promise(function (ok, no) { var q = indexedDB.open("read-sw", 1); q.onupgradeneeded = function () { q.result.createObjectStore("kv"); }; q.onsuccess = function () { ok(q.result); }; q.onerror = function () { no(q.error); }; }); }
function kvGet(k) { return db().then(function (d) { return new Promise(function (ok) { var t = d.transaction("kv").objectStore("kv").get(k); t.onsuccess = function () { ok(t.result); }; t.onerror = function () { ok(null); }; }); }).catch(function () { return null; }); }
function kvSet(k, v) { return db().then(function (d) { return new Promise(function (ok) { var t = d.transaction("kv", "readwrite"); t.objectStore("kv").put(v, k); t.oncomplete = function () { ok(true); }; t.onerror = function () { ok(false); }; }); }).catch(function () { return false; }); }
self.addEventListener("message", function (e) { var m = e.data || {}; if (m.t === "read-sync" && m.url && m.token) kvSet("sync", { url: m.url, token: m.token }); });
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
