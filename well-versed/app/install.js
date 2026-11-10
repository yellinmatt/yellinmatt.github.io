/* Well-Versed: install and offline, on the hosted site only.
   Inside a claude.ai artifact there is no service worker, so this does nothing there. */
(function(){
  if(!('serviceWorker' in navigator)||location.protocol!=='https:'&&location.hostname!=='localhost')return;
  if(/claude(usercontent)?\.(ai|com)$/.test(location.hostname))return;
  addEventListener('load',function(){navigator.serviceWorker.register('sw.js').catch(function(){})});
  /* A home-screen app resumes where it was left, so reopen fresh after an hour away. */
  var t=0;document.addEventListener('visibilitychange',function(){if(document.hidden){t=Date.now();return}if(t&&Date.now()-t>36e5)location.reload()});
})();
