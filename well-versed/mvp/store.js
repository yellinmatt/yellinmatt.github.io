var WV=(function(){
  var KEY='wv.mvp.v1',OLDER=['wv.mvp.none2','wv.mvp.none1'],mem=null,ready=false,base=null;
  function today(t){var d=new Date(t==null?Date.now():t);d.setHours(d.getHours()-4);return Math.floor((d.getTime()-d.getTimezoneOffset()*6e4)/864e5)}
  function get(){try{
    var v=localStorage.getItem(KEY);if(v)return JSON.parse(v);
    v=localStorage.getItem(OLDER[0]);if(v){v=JSON.parse(v);v.v=3;v.cards={};return v}
    v=localStorage.getItem(OLDER[1]);if(v){v=JSON.parse(v);return {v:3,s:v.s,added:v.added||[]}}
    return mem}catch(e){return mem}}
  function put(o){mem=o;try{localStorage.setItem(KEY,JSON.stringify(o))}catch(e){}}
  function keyCards(){var seen={};C.forEach(function(c){if(c.k)return;var k=c.s+'|'+c.q+(c.cn>1?'|c'+c.cn:''),n=seen[k]=(seen[k]||0)+1;c.k=n>1?k+'#'+n:k})}
  function rec(c,t){return {st:c.st,stab:c.stab,df:c.df,last:c.last,ivl:c.ivl,due:t+(c.due||0),reps:c.reps||0,lapses:c.lapses||0,flag:c.flag||0,mark:!!c.mark,susp:!!c.susp,bury:!!c.bury,del:!!c.del,q:c.q,tags:c.tags||[]}}
  function snapshot(){
    var t=base,cards={},added=[];
    C.forEach(function(c){
      if(!c.k){c.k='u'+Date.now().toString(36)+Math.random().toString(36).slice(2,6);c.added=true}
      var r=rec(c,t);
      if(c.added){r.d=c.d;r.ty=c.ty;r.a=c.a;r.src=c.s;r.h=c.h||null;added.push([c.k,r])}
      else if(c.st!=='new'||c.flag||c.mark||c.susp||c.bury||c.del||c.edited)cards[c.k]=r});
    return {v:3,saved:Date.now(),readAt:S.readAt,prog:S.prog,pos:S.pos,days:S.days,seen:S.seen,told:S.told,talks:S.talks,rlog:S.rlog,anc:S.anc,tdraft:S.tdraft,
      cards:cards,added:added,s:{theme:S.theme,fs:S.fs,opts:S.opts},
      day:{n:t,done:!!S.done,ring:S.ring,reviewed:S.reviewed,newToday:S.newToday||0}};
  }
  function load(){
    keyCards();ready=true;base=today();var o=get();if(!o||o.v!==3)return;
    var t=base,rd=o.readAt||{};
    S.readAt=rd;S.prog=o.prog||{};S.pos=o.pos||{};S.days=o.days||[];S.seen=o.seen||{};S.told=o.told||{};S.talks=o.talks||{};Object.keys(S.talks).forEach(function(h){S.talks[h]=(S.talks[h]||[]).map(function(x){var b=x&&x.b;if(!(Array.isArray(b)&&b[1]>=1&&b[1]<=12&&b[0]>=0))b=null;else b=[Math.min(Math.round(b[0]),Math.round(b[1])),Math.round(b[1])];return {d:x&&x.d,b:b,re:!!(x&&x.re)}})});S.rlog=o.rlog||[];S.anc=o.anc||{};S.tdraft=o.tdraft||null;
    L.forEach(function(l){l.state=rd[l.h]!=null?'read':'unread';var a=rd[l.h];l.fade=l.state==='read'&&a!=null?Math.max(0,1-(t-a)/30):0});
    var newDay=!(o.day&&o.day.n===t);
    function apply(c,r){if(r.st&&r.st!=='new'&&!(r.stab>0)){r=Object.assign({},r,{st:'new',stab:0,df:0,last:null,ivl:0,due:null})}c.st=r.st||'new';c.stab=r.stab||0;c.df=r.df||0;c.last=r.last==null?null:r.last;c.ivl=r.ivl||0;c.due=(r.due==null?t:r.due)-t;c.reps=r.reps||0;c.lapses=r.lapses||0;
      c.flag=r.flag||0;c.mark=!!r.mark;c.susp=!!r.susp;c.del=!!r.del;c.bury=newDay?false:!!r.bury;if(r.q&&r.q!==c.q){c.q=r.q;c.edited=true}c.tags=r.tags||c.tags}
    C.forEach(function(c){var r=o.cards&&o.cards[c.k];if(r)apply(c,r)});
    (o.added||[]).forEach(function(p){var r=p[1],c={k:p[0],added:true,d:r.d,ty:r.ty,a:r.a,s:r.src||r.s||'Added by you',h:r.h||null,unl:true,q:r.q};apply(c,r);C.unshift(c)});
    C.forEach(function(c,i){c.i=i});
    if(o.s){if(o.s.theme!=null)S.theme=o.s.theme;if(o.s.fs)S.fs=o.s.fs;if(o.s.opts)Object.assign(S.opts,o.s.opts)}
    if(!newDay){S.done=o.day.done;S.ring=o.day.ring;S.reviewed=o.day.reviewed;S.newToday=o.day.newToday||0}
    else S.ring={read:0,talk:0,cards:0};
  }
  var timer=0;
  function busy(){return !!document.querySelector('#app > .scr.talk, #app > .scr.reader')}
  function turned(){if(!ready||today()===base||busy())return false;put(snapshot());ready=false;location.reload();return true}
  function save(){if(!ready||turned())return;clearTimeout(timer);timer=setTimeout(function(){put(snapshot())},0)}
  function clear(){ready=false;clearTimeout(timer);mem=null;try{localStorage.removeItem(KEY);OLDER.forEach(function(k){localStorage.removeItem(k)})}catch(e){}}
  ['click','input','change'].forEach(function(t){document.addEventListener(t,save)});
  addEventListener('pagehide',function(){if(ready)put(snapshot())});
  document.addEventListener('visibilitychange',function(){if(!ready)return;if(document.hidden)put(snapshot());else turned()});
  addEventListener('focus',turned);setInterval(turned,6e4);
  return {load:load,save:save,clear:clear,today:today};
})();
