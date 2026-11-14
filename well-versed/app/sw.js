/* Well-Versed: offline support for the installed app.
   The app shell is cached on install and opens from cache. Today's library and deck are fetched fresh when
   online (they change every morning), waiting at most 1.5 s before the cached copy opens. Lessons and images are cached
   the first time they are opened, so anything read once can be read again without a connection. */
var V='wvapp-d3b49392ae',SHELL=['./','index.html','app.css','app.js','store.js','data.js','library.js','deck.js','install.js','manifest.webmanifest','icons/icon-192.png'];
var FRESH=/(?:library|deck)\.js$/;
self.addEventListener('install',function(e){e.waitUntil(caches.open(V).then(function(c){return c.addAll(SHELL)}).then(function(){return self.skipWaiting()}))});
self.addEventListener('activate',function(e){e.waitUntil(caches.keys().then(function(ks){return Promise.all(ks.filter(function(k){return k.indexOf('wvapp-')===0&&k!==V}).map(function(k){return caches.delete(k)}))}).then(function(){return self.clients.claim()}))});
self.addEventListener('fetch',function(e){var r=e.request;if(r.method!=='GET')return;var u=new URL(r.url);
  if(u.origin!==location.origin&&!/fonts\.(googleapis|gstatic)\.com$/.test(u.hostname))return;
  /* 2026-11-06: launch like a native app. The page shell opens from cache at once and refreshes in the background.
     Today's library and deck still try the network first, but only for 1.5 s; after that the cached copy opens and
     the network copy lands in the cache for the next launch (a cold launch on cellular had sat on a black screen). */
  /* The cache write is inside the promise given to waitUntil synchronously; iOS WebKit rejects a waitUntil called later from a callback. */
  var net=fetch(r).then(function(res){if(!res.ok)return res;var cp=res.clone();return caches.open(V).then(function(c){return c.put(r,cp)}).then(function(){return res},function(){return res})});
  e.waitUntil(net.catch(function(){}));
  if(r.mode==='navigate'){
    e.respondWith(caches.match(r,{ignoreSearch:true}).then(function(m){return m||net.catch(function(){return caches.match('index.html')})}));return}
  if(FRESH.test(u.pathname)){
    e.respondWith(caches.match(r).then(function(m){if(!m)return net;
      return Promise.race([net.catch(function(){return m}),new Promise(function(ok){setTimeout(function(){ok(m)},1500)})])}));return}
  e.respondWith(caches.match(r).then(function(m){return m||fetch(r).then(function(res){if(res.ok||res.type==='opaque'){var cp=res.clone();caches.open(V).then(function(c){c.put(r,cp)})}return res})}))});
