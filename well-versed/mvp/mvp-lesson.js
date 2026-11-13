(function(){
var RM=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
function cl(v,a,b){return v<a?a:v>b?b:v}
function sm(t){t=cl(t,0,1);return t*t*(3-2*t)}
function eio(t){return t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2}
function lerp(a,b,t){return a+(b-a)*t}
function vis(s,a,b){return sm((s-a)/.35)*(1-sm((s-b)/.35))}
function act(el,fn){el.addEventListener('click',function(e){e.stopPropagation();fn(e)});el.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();fn(e)}})}
var NS='http://www.w3.org/2000/svg',SANS='Instrument Sans,-apple-system,sans-serif',SERIF='DM Serif Display,Georgia,serif';
function el(tag,at,par,txt){var e=document.createElementNS(NS,tag);for(var k in at)e.setAttribute(k,at[k]);if(txt!=null)e.textContent=txt;if(par)par.appendChild(e);return e}
function seed(n){return function(){n=(n*9301+49297)%233280;return n/233280}}

var R={};
R.voyage=function(o){var sec=o.el,g=sec.querySelector('.vy-dots'),h='',N=185,K=19,ord=[],rnd=seed(7);for(var i=0;i<N;i++){h+='<b></b>';if(i>=K)ord.push(i)}g.innerHTML=h;ord.sort(function(){return rnd()-.5});
 var dots=g.children,img=sec.querySelector('.vy-img'),cnt=sec.querySelector('.vy-count'),por=sec.querySelector('.vy-por'),wd=sec.querySelector('.vy-wound'),last=-1;
 return function(s){img.style.transform='scale('+(1.03+.05*s/4)+')';img.style.filter='brightness('+(1-.5*sm(s-.3))+')';
  por.style.opacity=vis(s,-1,.55);por.style.transform='translateY('+(10-10*sm(s+.4))+'px)';
  var dv=vis(s,.45,3.55);g.style.opacity=dv;cnt.style.opacity=dv;
  var p=sm((s-1.1)/.85),lost=Math.round(ord.length*p);if(lost!==last){for(var j=0;j<ord.length;j++)dots[ord[j]].classList.toggle('gone',j<lost);last=lost}
  cnt.textContent=Math.round(1854-(1854-188)*p).toLocaleString('en-US');wd.style.opacity=sm((s-3.3)/.6)}};

R.hold=function(o){var f=o.el,cam=f.querySelector('.cam'),spot=f.querySelector('.spot'),W=+f.dataset.w,H=+f.dataset.h,K=o.caps.map(function(x){return x.dataset.k.split(',').map(Number)});
 function view(x,y,z,sw,sh){var ah=sw*H/W,k=z<=1.001?Math.min(1,sh/ah):z,iw=sw*k,ih=ah*k,tx,ty;if(z<=1.001){tx=(sw-iw)/2;ty=sh*.4-ih/2}else{tx=cl(sw/2-x*iw,sw-iw,0);ty=sh*.36-y*ih}return {k:k,tx:tx,ty:ty}}
 return function(s){var sw=f.clientWidth,sh=f.clientHeight,i=Math.floor(cl(s,0,K.length-1)),j=Math.min(K.length-1,i+1),t=cl(s-i,0,1),a=K[i],b=K[j];
  var A=view(a[0],a[1],a[2],sw,sh),B=view(b[0],b[1],b[2],sw,sh),k=lerp(A.k,B.k,t),tx=lerp(A.tx,B.tx,t),ty=lerp(A.ty,B.ty,t);
  cam.style.width=sw+'px';cam.style.transform='translate3d('+tx.toFixed(1)+'px,'+ty.toFixed(1)+'px,0) scale('+k.toFixed(4)+')';
  var iw=sw*k,ih=sw*H/W*k,x=lerp(a[0],b[0],t),y=lerp(a[1],b[1],t),r=lerp(a[3]||b[3],b[3]||a[3],t)*iw,al=lerp(a[3]?.86:0,b[3]?.86:0,t);
  spot.style.background=al>.01?'radial-gradient(circle '+Math.round(r*1.15)+'px at '+Math.round(tx+x*iw)+'px '+Math.round(ty+y*ih)+'px, rgba(0,0,0,0) 0, rgba(0,0,0,0) 60%, rgba(10,7,4,'+al.toFixed(2)+') 100%)':'none'}};

var ICON={
 Cider:'M-6 -9h12l-1 3c3 1 4 4 4 8 0 5-3 8-9 8s-9-3-9-8c0-4 1-7 4-8z',
 Acid:'M-3 -11h6v5l6 11c1 3-1 5-4 5h-11c-3 0-5-2-4-5l6-11z',
 Vinegar:'M-2 -12h4v5c4 1 6 4 6 8v10h-16v-10c0-4 2-7 6-8z',
 Sea:'M-12 0c4-4 8-4 12 0s8 4 12 0v4c-4 4-8 4-12 0s-8-4-12 0zM-12 7c4-4 8-4 12 0s8 4 12 0v4c-4 4-8 4-12 0s-8-4-12 0z',
 Citrus:'M0 -11a11 11 0 1 0 0.1 0zM0 -11c2-3 6-4 8-3-1 3-4 4-8 3z',
 Paste:'M-11 -2h22l-3 11h-16zM-4 -12l8 8-2 2-8-8z'};
R.trial=function(o){var sec=o.el,svg=sec.querySelector('svg'),day=sec.querySelector('.tr-day'),P=[['Cider','Cider','#d99a3b',[0,.04,.1,.17,.24,.32]],['Acid tonic','Acid','#9a8f7e',[0,0,0,.02,.02,.03]],['Vinegar','Vinegar','#9a8f7e',[0,0,.01,.01,.02,.02]],['Sea water','Sea','#7fa6c9',[0,0,0,0,0,0]],['Oranges and lemon','Citrus','#f0a23a',[0,.14,.34,.58,.82,1]],['Garlic paste','Paste','#9a8f7e',[0,.01,0,.02,.01,.02]]];
 var C=[],F=[];function cpos(p){return [8+(p%2)*180,6+Math.floor(p/2)*130]}
 P.forEach(function(d,p){var c=cpos(p),g=el('g',{class:'pc'},svg);var r=el('rect',{x:c[0],y:c[1],width:164,height:118,rx:16,fill:'rgba(25,19,13,.72)',stroke:'rgba(255,255,255,.18)','stroke-width':1.5},g);
  var ic=el('g',{transform:'translate('+(c[0]+22)+','+(c[1]+24)+')'},g);el('circle',{r:16,fill:d[2],opacity:.22},ic);el('path',{d:ICON[d[1]],fill:d[2]},ic);
  var lb=el('text',{x:c[0]+44,y:c[1]+29,'font-family':SANS,'font-size':13.5,'font-weight':700,fill:'#f5efe4'},g,d[0]);
  var base=c[1]+108,sp=el('polyline',{points:'',fill:'none',stroke:d[2],'stroke-width':3,'stroke-linecap':'round','stroke-linejoin':'round'},g);
  var bl=el('line',{x1:c[0]+16,x2:c[0]+148,y1:base,y2:base,stroke:'rgba(255,255,255,.14)','stroke-width':1},g);
  var tag=el('text',{x:c[0]+82,y:c[1]-6,'text-anchor':'middle','font-family':SANS,'font-size':12,'font-weight':700,fill:'#ff8a70',opacity:0},svg,'Lind chose these two');
  C.push({g:g,r:r,ic:ic,lb:lb,sp:sp,bl:bl,tag:tag,c:c,d:d});
  g.addEventListener('click',function(e){if(o.wait!=='guess')return;e.stopPropagation();o.guess=p;sec.classList.remove('guessing');C.forEach(function(x,k){x.r.setAttribute('stroke',k===p?'#f2b84b':'rgba(255,255,255,.18)')});
   var gs=sec.querySelector('[data-guess]');if(gs)gs.textContent=(p===4?'You got it. ':'You picked '+P[p][0].toLowerCase()+'. It was citrus. ')+'By day six one man was fit for duty and the other was nursing the sick. Cider came second.';o.resume()})});
 for(var i=0;i<12;i++){var g=el('g',{},svg);F.push({b:el('rect',{rx:6,fill:'#cbbfa9'},g),h:el('circle',{r:8,fill:'#e3d6bf'},g)})}
 function A(i){return [52+(i%4)*86,80+Math.floor(i/4)*110]}
 function B(i){var p=Math.floor(i/2),c=cpos(p);return [c[0]+82+(i%2?28:-28),c[1]+68]}
 return function(s){var u=sm(s),dp=cl(s-2.05,0,1),res=sm((s-3.2)/.5),flaw=sm((s-4.3)/.5),pick=s>1.6&&s<2.6;
  day.style.opacity=sm((s-2)/.2)*(1-sm((s-3.6)/.3));day.textContent='Day '+(1+Math.round(5*dp));
  C.forEach(function(x,p){var po=sm((s-.15-p*.07)/.35);x.r.style.opacity=u;x.lb.style.opacity=po;x.ic.style.opacity=po;x.ic.setAttribute('transform','translate('+(x.c[0]+22)+','+(x.c[1]+24-(1-po)*14)+') scale('+(.6+.4*po)+')');
   var v=x.d[3],n=dp*5,pts=[];for(var k=0;k<=5;k++){if(k>n+1e-6&&k>0){var f=n-(k-1);if(f>0)pts.push([lerp(x.c[0]+16+(k-1)*26.4,x.c[0]+16+k*26.4,f),lerp(v[k-1],v[k],f)]);break}pts.push([x.c[0]+16+k*26.4,v[k]])}
   x.sp.setAttribute('points',dp>0?pts.map(function(q){return q[0].toFixed(1)+','+(x.c[1]+108-q[1]*34).toFixed(1)}).join(' '):'');x.bl.style.opacity=sm((s-1.95)/.2);
   var dim=(flaw>0&&p!==3)?1-.55*flaw:(res>0&&p!==4&&p!==0?1-.35*res:1);x.g.style.opacity=dim;
   if(!pick&&o.guess!=null&&s>3.2)x.r.setAttribute('stroke',p===4?'rgba(110,200,140,'+(.3+.7*res)+')':(p===3&&flaw>.1?'#ff8a70':(p===o.guess?'#f2b84b':'rgba(255,255,255,.18)')));
   else if(!pick&&o.guess==null)x.r.setAttribute('stroke',p===4&&res>.1?'#6ec88c':(p===3&&flaw>.1?'#ff8a70':'rgba(255,255,255,.18)'));
   if(pick&&o.guess==null)x.r.setAttribute('stroke','rgba(242,184,75,'+(.35+.35*Math.sin(Date.now()/260+p))+')');
   x.tag.style.opacity=0;if(p===3)x.lb.textContent=flaw>.5?'Lind’s pick':'Sea water'});
  for(var i=0;i<12;i++){var a=A(i),b=B(i),x=lerp(a[0],b[0],u),y=lerp(a[1],b[1],u),p=Math.floor(i/2),up=p===4?sm((dp-.6)/.4):0;
   var w=lerp(44,16,up),h=lerp(16,40,up);F[i].b.setAttribute('x',(x-w/2+lerp(6,0,up)).toFixed(1));F[i].b.setAttribute('y',(y-h/2+lerp(0,6,up)).toFixed(1));F[i].b.setAttribute('width',w.toFixed(1));F[i].b.setAttribute('height',h.toFixed(1));
   F[i].h.setAttribute('cx',lerp(x-24,x,up).toFixed(1));F[i].h.setAttribute('cy',lerp(y,y-22,up).toFixed(1));var col=up>.5?'#6ec88c':'#cbbfa9';F[i].b.setAttribute('fill',col);F[i].h.setAttribute('fill',up>.5?'#a5e3b8':'#e3d6bf')}}};

R.sci=function(o){var svg=o.el.querySelector('svg'),G=[0,1,2,3,4,5].map(function(){return el('g',{},svg)}),T='#1d1812';
 var str=[0,1,2].map(function(k){return el('path',{fill:'none',stroke:['#c96f4a','#d98d5f','#b85c3c'][k],'stroke-width':9,'stroke-linecap':'round'},G[0])}),knots=[],drops=[];
 for(var i=0;i<9;i++)knots.push(el('circle',{r:6,fill:'#f2a93b',stroke:'#fff','stroke-width':2},G[0]));
 for(var d=0;d<7;d++)drops.push(el('circle',{r:4.5,fill:'#b8321f',opacity:0},G[0]));
 el('text',{x:24,y:62,'font-family':SANS,'font-size':14,'font-weight':700,fill:T},G[0],'Collagen, magnified');var kl=el('text',{x:24,y:236,'font-family':SANS,'font-size':13,'font-weight':600,fill:'#b06a1d'},G[0],'● vitamin C locks each twist');
 var vx=50,vy=40,vw=80,vh=250;el('rect',{x:vx,y:vy,width:vw,height:vh,rx:18,fill:'#fff',stroke:T,'stroke-width':2},G[1]);var fill=el('rect',{x:vx+5,width:vw-10,rx:13,fill:'#e8962e'},G[1]),thr=vy+vh-vh*350/1500;
 el('line',{x1:vx-8,x2:vx+vw+8,y1:thr,y2:thr,stroke:'#b8321f','stroke-width':2,'stroke-dasharray':'5 4'},G[1]);el('text',{x:vx+vw+16,y:thr+5,'font-family':SANS,'font-size':13,'font-weight':700,fill:'#b8321f'},G[1],'350 mg: signs appear');
 var mg=el('text',{x:vx+vw+16,y:vy+30,'font-family':SERIF,'font-size':40,fill:T},G[1]),wk=el('text',{x:vx+vw+18,y:vy+54,'font-family':SANS,'font-size':15,'font-weight':600,fill:'#6b5f4f'},G[1]);
 var cx=180,cy=150,R0=100,W=[];el('circle',{cx:cx,cy:cy,r:R0+9,fill:'#f0a23a'},G[2]);
 for(var q=0;q<7;q++){var a0=-Math.PI/2+q*2*Math.PI/7+.03,a1=a0+2*Math.PI/7-.06,P=function(a,r){return (cx+r*Math.cos(a)).toFixed(1)+' '+(cy+r*Math.sin(a)).toFixed(1)};W.push(el('path',{d:'M'+P(a0,12)+' L'+P(a0,R0)+' A'+R0+' '+R0+' 0 0 1 '+P(a1,R0)+' L'+P(a1,12)+' Z',fill:'#f6c46a',stroke:'#f0a23a','stroke-width':2},G[2]))}
 var ol=el('text',{x:cx,y:cy+R0+42,'text-anchor':'middle','font-family':SANS,'font-size':16,'font-weight':700,fill:T},G[2]);
 var rows=[['Oranges and lemon',1,'#f0a23a','the cure'],['Cider',.12,'#d99a3b','a trace'],['Acid tonic',0,'#9a8f7e','sour, empty'],['Vinegar',0,'#9a8f7e','sour, empty'],['Garlic paste',0,'#9a8f7e','none'],['Sea water',0,'#5d86ad','dries you out']].map(function(d,i){var y=46+i*46,g=el('g',{},G[3]);el('text',{x:16,y:y,'font-family':SANS,'font-size':14,'font-weight':700,fill:T},g,d[0]);el('rect',{x:16,y:y+8,width:240,height:12,rx:6,fill:'#e4dccb'},g);var b=el('rect',{x:16,y:y+8,width:0,height:12,rx:6,fill:d[2]},g);el('text',{x:266,y:y+18,'font-family':SANS,'font-size':12.5,'font-weight':600,fill:d[1]?'#8a5a12':(i===5?'#2f5d86':'#7a6f60')},g,d[3]);return [g,b,d[1]]});
 el('text',{x:16,y:20,'font-family':SANS,'font-size':12,'font-weight':700,fill:'#6b5f4f','letter-spacing':'1.5'},G[3],'VITAMIN C IN EACH CURE');
 var mk=['Dogs','Cats','Cows','Goats','Rats','Most birds'],no=['Humans','Guinea pigs','Fruit bats'];el('text',{x:16,y:30,'font-family':SANS,'font-size':12,'font-weight':700,fill:'#2f7d4a','letter-spacing':'1.5'},G[4],'MAKE THEIR OWN');el('text',{x:196,y:30,'font-family':SANS,'font-size':12,'font-weight':700,fill:'#b8321f','letter-spacing':'1.5'},G[4],'MUST EAT IT');
 var chips=[];mk.forEach(function(t,i){var g=el('g',{},G[4]);el('rect',{x:16,y:44+i*42,width:150,height:32,rx:16,fill:'#dfeee3'},g);el('text',{x:32,y:65+i*42,'font-family':SANS,'font-size':14,'font-weight':600,fill:'#24553a'},g,t);chips.push(g)});
 no.forEach(function(t,i){var g=el('g',{},G[4]);el('rect',{x:196,y:44+i*42,width:150,height:32,rx:16,fill:'#f6dcd5'},g);el('text',{x:212,y:65+i*42,'font-family':SANS,'font-size':14,'font-weight':700,fill:'#8e2a19'},g,t);chips.push(g)});
 el('text',{x:196,y:196,'font-family':SANS,'font-size':12.5,'font-weight':500,fill:'#6b5f4f'},G[4],'Ours broke about');el('text',{x:196,y:213,'font-family':SANS,'font-size':12.5,'font-weight':500,fill:'#6b5f4f'},G[4],'61 million years ago.');
 return function(s){var o0=vis(s,-1,1),o1=vis(s,1,2),o2=vis(s,2,3),o3=vis(s,3,4),o4=vis(s,4,9);[o0,o1,o2,o3,o4].forEach(function(v,i){G[i].style.opacity=v;G[i].style.display=v<.01?'none':''});
  var br=sm((s+.6)/.5),loose=sm((s-.15)/.75),t=Date.now()/900;
  str.forEach(function(p,k){var d='',ph=k*2.09;for(var x=24;x<=336;x+=6){var y=150+Math.sin(x/34+ph+t*.0)*(14+28*loose)+(k-1)*loose*16;d+=(x===24?'M':'L')+x+' '+y.toFixed(1)}p.setAttribute('d',d);p.setAttribute('stroke-dasharray',loose>.05?(10+20*(1-loose))+' '+(8*loose):'none')});
  knots.forEach(function(kn,i){var x=40+i*36,y=150+Math.sin(x/34+1)*14;kn.setAttribute('cx',x);kn.setAttribute('cy',y);kn.style.opacity=br*(1-loose)});kl.style.opacity=br*(1-loose);
  drops.forEach(function(dr,i){var f=(t*.5+i/7)%1;dr.setAttribute('cx',60+i*40);dr.setAttribute('cy',190+f*40);dr.style.opacity=loose*(1-f)});
  var dr=sm((s-1.35)/.65),m=Math.round(lerp(1500,300,dr)),h=(vh-10)*m/1500;fill.setAttribute('y',vy+vh-5-h);fill.setAttribute('height',h);fill.setAttribute('fill',m<350?'#b8321f':'#e8962e');mg.textContent=m.toLocaleString('en-US')+' mg';wk.textContent=dr>0?'Week '+Math.round(12*dr):'Full store';
  var lit=cl((s-2.35)/.6,0,1)*7;W.forEach(function(w,i){w.setAttribute('fill',i<Math.max(1,Math.ceil(lit))?'#fffaf0':'#f6c46a')});ol.textContent=lit<=1.01?'One segment, about 10 mg: a day of protection':Math.round(lit*10)+' mg'+(lit>6.9?': one orange':'');
  rows.forEach(function(r,i){var a=sm((s-3.35-i*.06)/.3);r[0].style.opacity=a;r[1].setAttribute('width',(240*r[2]*a).toFixed(1))});
  chips.forEach(function(c,i){c.style.opacity=sm((s-4.35-i*.05)/.3)})}};

function stage(sec,sc){var caps=[].slice.call(sec.querySelectorAll('.st-cap')),n=caps.length,o={el:sec,caps:caps},draw=R[sec.dataset.st]?R[sec.dataset.st](o):function(){},auto=sec.hasAttribute('data-auto');
 var pips=document.createElement('div');pips.className='st-pips';pips.innerHTML=caps.map(function(){return '<i><b></b></i>'}).join('');sec.appendChild(pips);var pb=[].slice.call(pips.querySelectorAll('b'));
 sec.insertAdjacentHTML('beforeend','<div class="st-tap prev" aria-hidden="true"></div><div class="st-tap next" aria-hidden="true"></div><div class="st-hint"></div><div class="st-nav"><span role="button" tabindex="0" aria-label="Back" data-p>&lsaquo;</span><span role="button" tabindex="0" aria-label="Next" data-n>&rsaquo;</span></div>');
 var hint=sec.querySelector('.st-hint'),bp=sec.querySelector('[data-p]'),bn=sec.querySelector('[data-n]');
 var s=0,idx=0,tw=null,hold=null,holdStart=0,holdDur=0,started=false,inView=false,live=false;
 function paint(){caps.forEach(function(c,i){var d=Math.abs(s-i),op=d<.3?1:cl(1-(d-.3)/.25,0,1);c.style.opacity=op.toFixed(3);c.style.transform='translateY('+((i-s)*16).toFixed(1)+'px)'});draw(s);
  pb.forEach(function(b,i){b.style.width=(i<idx?100:i>idx?0:(auto&&hold&&holdDur?cl((Date.now()-holdStart)/holdDur,0,1)*100:100))+'%'})}
 function loop(){if(!live)return;paint();requestAnimationFrame(loop)}
 function setWait(){o.wait=caps[idx].dataset.wait||null;sec.classList.toggle('guessing',o.wait==='guess'&&o.guess==null);var last=idx>=n-1;sec.classList.toggle('waiting',!auto||!!o.wait);hint.textContent=o.wait==='guess'?'Tap a pair':(last?'Scroll on':'Tap to continue');bp.setAttribute('aria-disabled',idx===0);bn.setAttribute('aria-disabled',last||o.wait==='guess'&&o.guess==null)}
 function arrive(){tw=null;setWait();clearTimeout(hold);hold=null;if(auto&&idx<n-1&&!o.wait&&inView){holdDur=+(caps[idx].dataset.hold||3400);holdStart=Date.now();hold=setTimeout(function(){go(idx+1)},holdDur)}}
 function go(i,fast){i=cl(i,0,n-1);if(caps[idx].dataset.wait==='guess'&&o.guess==null&&i>idx)return;clearTimeout(hold);hold=null;sec.classList.remove('waiting');var from=s,back=i<idx;idx=i;
  var dur=RM?0:fast?350:back?700:+(caps[i].dataset.dur||1400),t0=performance.now();o.wait=null;
  tw={};var me=tw;(function step(){if(tw!==me)return;var t=dur?cl((performance.now()-t0)/dur,0,1):1;s=lerp(from,i,eio(t));if(t<1)requestAnimationFrame(step);else{s=i;arrive()}})()}
 o.resume=function(){go(idx+1)};
 function next(){if(tw){s=idx;tw=null;arrive();return}if(idx<n-1)go(idx+1)}
 function prev(){go(idx-1,true)}
 sec.querySelector('.st-tap.next').addEventListener('click',function(e){if(o.wait==='guess')return;e.stopPropagation();next()});
 sec.querySelector('.st-tap.prev').addEventListener('click',function(e){e.stopPropagation();prev()});
 act(bn,function(){if(o.wait==='guess'&&o.guess==null)return;next()});act(bp,prev);
 var io=new IntersectionObserver(function(es){es.forEach(function(e){inView=e.intersectionRatio>=.55;if(e.isIntersecting&&!live){live=true;loop()}else if(!e.isIntersecting){live=false}
  if(inView&&!started){started=true;arrive()}else if(inView&&auto&&!hold&&!tw&&idx<n-1&&!o.wait)arrive();else if(!inView&&hold){clearTimeout(hold);hold=null}})},{threshold:[0,.55]});
 io.observe(sec);paint()}

var QUILL='<svg class="quill" viewBox="0 0 64 64"><path d="M6 58 L22 40" stroke="#3a2a1a" stroke-width="2.5" stroke-linecap="round"/><path d="M20 42 C26 22 42 8 60 4 C56 20 44 36 22 44 Z" fill="#f6efe2" stroke="#8a6a44" stroke-width="1.5"/><path d="M22 42 C34 30 46 18 58 6" stroke="#8a6a44" stroke-width="1"/></svg>';
function writer(sheet){var spans=[];(function walk(n){[].slice.call(n.childNodes).forEach(function(c){if(c.nodeType===3){var f=document.createDocumentFragment();c.textContent.split('').forEach(function(ch){var sp=document.createElement('span');sp.className='ch-c';sp.textContent=ch;f.appendChild(sp);spans.push(sp)});c.parentNode.replaceChild(f,c)}else if(c.nodeType===1&&!c.classList.contains('dt')&&!c.classList.contains('gloss-body'))walk(c)})})(sheet);
 sheet.insertAdjacentHTML('beforeend',QUILL);var q=sheet.querySelector('.quill'),i=0,timer=null,done=false;
 function finish(){clearInterval(timer);spans.forEach(function(s){s.classList.add('on')});q.style.opacity=0;done=true}
 function start(){if(done||timer)return;if(RM){finish();return}q.style.opacity=1;timer=setInterval(function(){for(var k=0;k<3&&i<spans.length;k++,i++)spans[i].classList.add('on');if(i>=spans.length){finish();return}var r=spans[i-1].getBoundingClientRect(),b=sheet.getBoundingClientRect();q.style.left=(r.right-b.left)+'px';q.style.top=(r.top-b.top)+'px'},38)}
 sheet.addEventListener('click',function(e){if(!done&&timer&&!e.target.closest('.gloss')){e.stopPropagation();finish()}});return {start:start,finish:finish}}
function doc(d){var tr=d.querySelector('[data-doc-track]'),n=d.querySelector('[data-doc-n]'),sh=[].slice.call(tr.children),W=sh.map(function(s){return s.hasAttribute('data-write')?writer(s):null}),seen=false;
 function idx(){var c=tr.scrollLeft+tr.clientWidth/2,b=0,bd=1e9;sh.forEach(function(s,i){var m=s.offsetLeft+s.offsetWidth/2,dd=Math.abs(m-c);if(dd<bd){bd=dd;b=i}});return b}
 function to(i){i=cl(i,0,sh.length-1);var s=sh[i];tr.scrollTo({left:s.offsetLeft-(tr.clientWidth-s.offsetWidth)/2,behavior:RM?'auto':'smooth'})}
 function upd(){var i=idx();n.textContent=(i+1)+' / '+sh.length;if(seen&&W[i])W[i].start()}
 var t=0;tr.addEventListener('scroll',function(){clearTimeout(t);t=setTimeout(upd,120)},{passive:true});
 act(d.querySelector('[data-doc-prev]'),function(){to(idx()-1)});act(d.querySelector('[data-doc-next]'),function(){to(idx()+1)});
 new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting&&!seen){seen=true;setTimeout(function(){to(1)},900)}})},{threshold:.6}).observe(d)}

function spreads(root){[].forEach.call(root.querySelectorAll('[data-digits]'),function(t){var r=seed(23),h='';for(var i=0;i<54;i++)h+='<b>'+Math.floor(r()*10)+'</b>';t.innerHTML=h;var bs=t.children,k=0;setInterval(function(){if(!t.closest('.in'))return;for(var j=0;j<bs.length;j++)bs[j].classList.remove('hot');for(var m=0;m<4;m++)bs[(k*7+m*13)%bs.length].classList.add('hot');k++},700)});
 [].forEach.call(root.querySelectorAll('[data-count]'),function(c){var to=+c.dataset.count,sm2=c.querySelector('small'),done=false;new IntersectionObserver(function(es){es.forEach(function(e){if(!e.isIntersecting||done)return;done=true;var t0=performance.now(),D=RM?0:1800;(function f(){var t=D?cl((performance.now()-t0)/D,0,1):1;c.firstChild.nodeValue=Math.round(to*eio(t));if(t<1)requestAnimationFrame(f)})()})},{threshold:.5}).observe(c)})}
function reveal(root){var io=new IntersectionObserver(function(es){es.forEach(function(e){if(!e.isIntersecting)return;e.target.classList.add('in');io.unobserve(e.target)})},{threshold:.2});[].forEach.call(root.querySelectorAll('[data-rv]'),function(x){io.observe(x)})}
window.WVW=function(root,sc){try{var fo=root.querySelector('.folio');if(fo)fo.style.setProperty('--g',getComputedStyle(fo).paddingLeft);
 [].forEach.call(root.querySelectorAll('[data-st]'),function(s){stage(s,sc)});
 [].forEach.call(root.querySelectorAll('[data-doc]'),doc);spreads(root);
 [].forEach.call(root.querySelectorAll('[data-flips] .flip'),function(f){act(f,function(){f.setAttribute('aria-pressed',f.getAttribute('aria-pressed')==='true'?'false':'true')})});
 reveal(root)}catch(e){console.error('WVW',e)}};
})();
