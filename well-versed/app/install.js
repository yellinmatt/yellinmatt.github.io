/* Well-Versed: install and offline, on the hosted site only.
   Inside a claude.ai artifact there is no service worker, so this does nothing there. */
(function(){
  if(!('serviceWorker' in navigator)||location.protocol!=='https:'&&location.hostname!=='localhost')return;
  if(/claude(usercontent)?\.(ai|com)$/.test(location.hostname))return;
  addEventListener('load',function(){navigator.serviceWorker.register('sw.js').catch(function(){})});
})();
