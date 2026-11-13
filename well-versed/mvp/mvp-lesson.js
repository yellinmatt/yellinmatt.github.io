(function(){
var RM=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
function act(el,fn){el.addEventListener('click',function(e){e.stopPropagation();fn(e)});el.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();fn(e)}})}
function spotPx(x,y,r){return 'radial-gradient(circle '+Math.round(r*1.3)+'px at '+Math.round(x)+'px '+Math.round(y)+'px, rgba(0,0,0,0) 0, rgba(0,0,0,0) 62%, rgba(12,9,6,.8) 100%)'}
function tour(f,sc){
 var st=f.querySelector('.tour-stage'),cam=st.querySelector('.cam'),spot=st.querySelector('.spot'),steps=[].slice.call(f.querySelectorAll('.tour-step')),W=+f.dataset.w,H=+f.dataset.h,cur=-1,timer=null,play=f.querySelector('[data-tour-play]');
 function go(i){if(i===cur)return;cur=i;var s=steps[i].dataset,x=+s.x,y=+s.y,z=+s.z,r=s.r?+s.r:0,sw=st.clientWidth,sh=st.clientHeight,ah=sw*H/W;
  var c=(f.dataset.crop||'0,0,1,1').split(',').map(Number),cw=c[2]-c[0],ch=c[3]-c[1];
  var k=z===1?Math.min(1,sh/ah):Math.max(z,sh/(ah*ch),1/cw),iw=sw*k,ih=ah*k,tx,ty;
  if(z===1){tx=(sw-iw)/2;ty=(sh-ih)/2}else{tx=Math.min(-c[0]*iw,Math.max(sw-c[2]*iw,sw/2-x*iw));ty=Math.min(-c[1]*ih,Math.max(sh-c[3]*ih,sh/2-y*ih))}
  cam.style.width=sw+'px';cam.style.transform='translate3d('+tx+'px,'+ty+'px,0) scale('+k+')';
  if(r){spot.style.background=spotPx(tx+x*iw,ty+y*ih,r*iw);spot.classList.add('on')}else spot.classList.remove('on')}
 var caps=steps.map(function(s){return s.querySelector('.tour-cap')}),io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting)go(caps.indexOf(e.target))})},{rootMargin:'-30% 0px -30% 0px'});
 caps.forEach(function(c){io.observe(c)});go(0);
 window.addEventListener('resize',function(){var c=cur;cur=-1;go(Math.max(0,c))});
 function stop(){clearTimeout(timer);timer=null;play.innerHTML='&#9654; Play the tour'}
 function scrollTo(i){var t=steps[i].querySelector('.tour-cap'),r=t.getBoundingClientRect(),sr=sc.getBoundingClientRect();sc.scrollTo({top:sc.scrollTop+r.top-sr.top-sc.clientHeight*.5+r.height/2,behavior:RM?'auto':'smooth'})}
 act(play,function(){if(timer){stop();return}play.innerHTML='&#10073;&#10073; Pause';var i=Math.max(0,cur);if(i>=steps.length-1)i=-1;(function next(){i++;if(i>=steps.length){stop();return}scrollTo(i);timer=setTimeout(next,4600)})()});
 sc.addEventListener('wheel',function(){if(timer)stop()},{passive:true});sc.addEventListener('touchstart',function(){if(timer)stop()},{passive:true});
 var ex=f.querySelector('[data-explore]');if(ex){var es=ex.querySelector('.ex-stage'),sp=es.querySelector('.spot'),note=ex.querySelector('.ex-note');
  [].forEach.call(es.querySelectorAll('.hs'),function(h){act(h,function(){var on=h.getAttribute('aria-pressed')==='true';[].forEach.call(es.querySelectorAll('.hs'),function(o){o.setAttribute('aria-pressed','false')});
   if(on){sp.classList.remove('on');note.textContent='Five details are marked. Tap one.';return}
   h.setAttribute('aria-pressed','true');var x=parseFloat(h.style.left)/100,y=parseFloat(h.style.top)/100,r=+h.dataset.r;sp.style.background=spotPx(x*es.clientWidth,y*es.clientHeight,r*es.clientWidth);sp.classList.add('on');note.innerHTML=h.dataset.note})})}}
function pairs(g){var out=g.parentNode.querySelector('.pairs-out'),ps=[].slice.call(g.querySelectorAll('.pair'));ps.forEach(function(p){act(p,function(){ps.forEach(function(o){o.setAttribute('aria-pressed','false')});p.setAttribute('aria-pressed','true');out.textContent=p.dataset.out;if(p.classList.contains('citrus'))p.classList.add('show')})})}
function doc(d){var tr=d.querySelector('[data-doc-track]'),n=d.querySelector('[data-doc-n]'),sh=[].slice.call(tr.children);
 function idx(){var c=tr.scrollLeft+tr.clientWidth/2,b=0,bd=1e9;sh.forEach(function(s,i){var m=s.offsetLeft+s.offsetWidth/2,dd=Math.abs(m-c);if(dd<bd){bd=dd;b=i}});return b}
 function to(i){i=Math.max(0,Math.min(sh.length-1,i));var s=sh[i];tr.scrollTo({left:s.offsetLeft-(tr.clientWidth-s.offsetWidth)/2,behavior:RM?'auto':'smooth'})}
 tr.addEventListener('scroll',function(){n.textContent=(idx()+1)+' / '+sh.length},{passive:true});
 act(d.querySelector('[data-doc-prev]'),function(){to(idx()-1)});act(d.querySelector('[data-doc-next]'),function(){to(idx()+1)})}
function dots(f){var g=f.querySelector('.dots'),n=+g.dataset.n,k=+g.dataset.keep,h='';for(var i=0;i<n;i++)h+='<i'+(i>=k?' class="lost" style="transition-delay:'+(Math.round(i*6))+'ms"':'')+'></i>';g.innerHTML=h;return g}
function reveal(root){var io=new IntersectionObserver(function(es){es.forEach(function(e){if(!e.isIntersecting)return;var t=e.target;t.classList.add('in');var g=t.querySelector('.dots');if(g)setTimeout(function(){g.classList.add('go')},500);var tl=t.querySelector('.tl');if(tl)tl.classList.add('go');var b=t.querySelector('.bars');if(b)b.classList.add('go');io.unobserve(t)})},{threshold:.35});
 [].forEach.call(root.querySelectorAll('[data-rv]'),function(x){io.observe(x)})}
window.WVW=function(root,sc){try{
 [].forEach.call(root.querySelectorAll('[data-tour]'),function(f){tour(f,sc)});
 [].forEach.call(root.querySelectorAll('[data-pairs]'),pairs);
 [].forEach.call(root.querySelectorAll('[data-doc]'),doc);
 [].forEach.call(root.querySelectorAll('[data-dots]'),dots);
 [].forEach.call(root.querySelectorAll('[data-flips] .flip'),function(f){act(f,function(){f.setAttribute('aria-pressed',f.getAttribute('aria-pressed')==='true'?'false':'true')})});
 reveal(root)}catch(e){console.error('WVW',e)}};
})();
