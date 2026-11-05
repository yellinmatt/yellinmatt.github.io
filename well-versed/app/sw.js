/* Well-Versed: offline support for the installed app.
   The app shell is cached on install. Today's library and deck are fetched fresh when online
   (they change every morning) and fall back to the cache offline. Lessons and images are cached
   the first time they are opened, so anything read once can be read again without a connection. */
var V='wvapp-99b28927f5',SHELL=['./','index.html','app.css','app.js','store.js','data.js','library.js','deck.js','install.js','manifest.webmanifest','icons/icon-192.png'];
var FRESH=/(?:library|deck)\.js$/;
self.addEventListener('install',function(e){e.waitUntil(caches.open(V).then(function(c){return c.addAll(SHELL)}).then(function(){return self.skipWaiting()}))});
self.addEventListener('activate',function(e){e.waitUntil(caches.keys().then(function(ks){return Promise.all(ks.filter(function(k){return k.indexOf('wvapp-')===0&&k!==V}).map(function(k){return caches.delete(k)}))}).then(function(){return self.clients.claim()}))});
self.addEventListener('fetch',function(e){var r=e.request;if(r.method!=='GET')return;var u=new URL(r.url);
  if(u.origin!==location.origin&&!/fonts\.(googleapis|gstatic)\.com$/.test(u.hostname))return;
  if(r.mode==='navigate'||FRESH.test(u.pathname)){
    e.respondWith(fetch(r).then(function(res){var cp=res.clone();caches.open(V).then(function(c){c.put(r,cp)});return res}).catch(function(){return caches.match(r).then(function(m){return m||caches.match('index.html')})}));return}
  e.respondWith(caches.match(r).then(function(m){return m||fetch(r).then(function(res){if(res.ok||res.type==='opaque'){var cp=res.clone();caches.open(V).then(function(c){c.put(r,cp)})}return res})}))});
