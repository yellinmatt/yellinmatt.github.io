(function(){
var RM=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
function cl(v,a,b){return v<a?a:v>b?b:v}
function sm(t){t=cl(t,0,1);return t*t*(3-2*t)}
function lerp(a,b,t){return a+(b-a)*t}
function seg(s,n){var i=Math.floor(cl(s,0,n-1)),f=cl(s,0,n-1)-i;if(i>=n-1)return [n-1,n-1,0];return [i,i+1,sm((f-.22)/.56)]}
function act(el,fn){el.addEventListener('click',function(e){e.stopPropagation();fn(e)});el.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();fn(e)}})}
var NS='http://www.w3.org/2000/svg';
function el(tag,at,par){var e=document.createElementNS(NS,tag);for(var k in at)e.setAttribute(k,at[k]);if(par)par.appendChild(e);return e}

var R={};
R.voyage=function(o){var g=o.el.querySelector('.vy-dots'),h='',N=185,K=19,ord=[];for(var i=0;i<N;i++){h+='<b></b>';if(i>=K)ord.push(i)}g.innerHTML=h;
 var seed=7;ord.sort(function(){seed=(seed*9301+49297)%233280;return seed/233280-.5});var dots=g.children,img=o.el.querySelector('.vy-img'),cnt=o.el.querySelector('.vy-count'),last=-1;
 return function(s){img.style.transform='scale('+(1.04+.07*cl(s,0,3)/3)+')';img.style.filter='brightness('+(1-.45*sm(s-.4))+')';
  g.style.opacity=sm((s-.55)/.45);var lost=Math.round(ord.length*sm((s-1.25)/.75));if(lost!==last){for(var j=0;j<ord.length;j++)dots[ord[j]].classList.toggle('gone',j<lost);last=lost}
  cnt.style.opacity=sm((s-.55)/.45);cnt.textContent=Math.round(1854-(1854-188)*sm((s-1.25)/.75)).toLocaleString('en-US');
  g.style.top='';}};

R.hold=function(o){var f=o.el,st=f.querySelector('.sy-stage'),cam=f.querySelector('.cam'),spot=f.querySelector('.spot'),W=+f.dataset.w,H=+f.dataset.h,c=f.dataset.crop.split(',').map(Number),
 K=o.caps.map(function(x){return x.dataset.k.split(',').map(Number)});
 function view(x,y,z,sw,sh){var ah=sw*H/W,k=z<=1.001?Math.min(1,sh/ah):z,iw=sw*k,ih=ah*k,tx,ty;
  if(z<=1.001){tx=(sw-iw)/2;ty=sh*.38-ih/2}else{tx=cl(sw/2-x*iw,sw-c[2]*iw,-c[0]*iw);ty=sh*.36-y*ih}return {k:k,tx:tx,ty:ty,iw:iw,ih:ih}}
 return function(s){var sw=st.clientWidth,sh=st.clientHeight,q=seg(s,K.length),a=K[q[0]],b=K[q[1]],t=q[2];
  var A=view(a[0],a[1],a[2],sw,sh),B=view(b[0],b[1],b[2],sw,sh),k=lerp(A.k,B.k,t),tx=lerp(A.tx,B.tx,t),ty=lerp(A.ty,B.ty,t);
  cam.style.width=sw+'px';cam.style.transform='translate3d('+tx.toFixed(1)+'px,'+ty.toFixed(1)+'px,0) scale('+k.toFixed(4)+')';
  var iw=sw*k,ih=sw*H/W*k,x=lerp(a[0],b[0],t),y=lerp(a[1],b[1],t),ra=a[3]||b[3],rb=b[3]||a[3],r=lerp(ra,rb,t)*iw,al=lerp(a[3]?.86:0,b[3]?.86:0,t);
  spot.style.background=al>.01?'radial-gradient(circle '+Math.round(r*1.15)+'px at '+Math.round(tx+x*iw)+'px '+Math.round(ty+y*ih)+'px, rgba(0,0,0,0) 0, rgba(0,0,0,0) 60%, rgba(10,7,4,'+al.toFixed(2)+') 100%)':'none'}};

R.trial=function(o){var svg=o.el.querySelector('svg'),day=o.el.querySelector('.tr-day'),REM=['Cider','Acid tonic','Vinegar','Sea water','Oranges + lemon','Garlic paste'],F=[],L=[];
 var ring=el('rect',{x:0,y:0,width:148,height:88,rx:16,fill:'none',stroke:'#b8321f','stroke-width':3,opacity:0},svg),ringT=el('text',{'font-family':'Instrument Sans,sans-serif','font-size':13,'font-weight':700,fill:'#b8321f',opacity:0},svg);ringT.textContent='Lind chose these two';
 for(var p=0;p<6;p++){var tx=el('text',{'text-anchor':'middle','font-family':'Instrument Sans,sans-serif','font-size':16,'font-weight':600,fill:'#3b3227',opacity:0},svg);tx.textContent=REM[p];L.push(tx)}
 for(var i=0;i<12;i++){var g=el('g',{},svg);F.push({b:el('rect',{rx:6,fill:'#9a8f7e'},g),h:el('circle',{r:10,fill:'#9a8f7e'},g)})}
 function A(i){var c=i%4,r=Math.floor(i/4);return [48+c*88,70+r*92]}
 function B(i){var p=Math.floor(i/2),m=i%2,c=p%2,r=Math.floor(p/2);return [90+c*180+(m?38:-38),60+r*104]}
 return function(s){var u=sm(s/1.0),res=sm((s-2.55)/.45),flaw=sm((s-3.55)/.45);
  day.style.opacity=sm((s-1.55)/.3)*(1-sm((s-3.6)/.3));day.textContent='Day '+(1+Math.round(5*sm((s-1.75)/.9)));
  for(var i=0;i<12;i++){var a=A(i),b=B(i),x=lerp(a[0],b[0],u),y=lerp(a[1],b[1],u),p=Math.floor(i/2),up=p===4?res:0;
   var w=lerp(44,17,up),h=lerp(17,44,up),bx=x-w/2+lerp(6,0,up),by=y-h/2+lerp(0,8,up);
   F[i].b.setAttribute('x',bx.toFixed(1));F[i].b.setAttribute('y',by.toFixed(1));F[i].b.setAttribute('width',w.toFixed(1));F[i].b.setAttribute('height',h.toFixed(1));
   F[i].h.setAttribute('cx',lerp(x-26,x,up).toFixed(1));F[i].h.setAttribute('cy',lerp(y,y-24,up).toFixed(1));
   var col=p===4&&res>.5?'#2f7d4a':(p===3&&flaw>.1?'#b8321f':'#8c8170');F[i].b.setAttribute('fill',col);F[i].h.setAttribute('fill',col);
   F[i].b.style.opacity=F[i].h.style.opacity=(p!==4&&p!==3&&flaw>0)?String(1-.55*flaw):(p!==4&&res>0&&flaw<=0?String(1-.35*res):'1')}
  for(var q=0;q<6;q++){var bb=B(q*2);L[q].setAttribute('x',bb[0]+38);L[q].setAttribute('y',bb[1]+44);L[q].style.opacity=sm((s-.35)/.5);L[q].setAttribute('fill',q===4&&res>.5?'#2f7d4a':(q===3&&flaw>.1?'#b8321f':'#3b3227'))}
  var sb=B(6);ring.setAttribute('x',sb[0]-36);ring.setAttribute('y',sb[1]-34);ring.style.opacity=flaw;ringT.setAttribute('x',sb[0]+38);ringT.setAttribute('y',sb[1]+72);ringT.setAttribute('text-anchor','middle');ringT.style.opacity=flaw}};

R.time=function(o){var ly=[].slice.call(o.el.querySelectorAll('.tl-l')),yr=o.el.querySelector('.tl-year'),rail=o.el.querySelector('.tl-rail'),mk=o.el.querySelector('.tl-mark'),gap=o.el.querySelector('.tl-gap'),Y=o.caps.map(function(c){return +c.dataset.y}),y0=1600,y1=1960;
 function px(y){return (y-y0)/(y1-y0)*100}
 Y.forEach(function(y){var t=document.createElement('span');t.className='tl-tick';t.style.left=px(y)+'%';rail.appendChild(t)});
 gap.style.left=px(1747)+'%';gap.style.width=(px(1795)-px(1747))+'%';
 var rn=o.el.querySelector('[data-rnd]');if(rn){var h='',seed=11;for(var i=0;i<110;i++){seed=(seed*9301+49297)%233280;h+='<span>'+Math.floor(seed/233280*10)+'</span>'}rn.innerHTML=h}
 return function(s){ly.forEach(function(l,i){var d=Math.abs(s-i);l.style.opacity=d<.4?1:cl(1-(d-.4)/.2,0,1);l.style.transform='scale('+(1.06-.04*cl(s-i+.5,0,1))+')'});
  var q=seg(s,Y.length),y=lerp(Y[q[0]],Y[q[1]],q[2]);yr.textContent=Math.round(y);mk.style.left=px(y)+'%';gap.style.opacity=cl(1-Math.abs(s-3)*1.2,0,1)}};

R.tank=function(o){var svg=o.el.querySelector('svg'),T='Instrument Sans,sans-serif';
 var g1=el('g',{},svg),vx=40,vy=36,vw=76,vh=250;
 el('rect',{x:vx,y:vy,width:vw,height:vh,rx:16,fill:'#fff',stroke:'#3b3227','stroke-width':2},g1);
 var fill=el('rect',{x:vx+4,width:vw-8,rx:12,fill:'#e8962e'},g1),thr=vy+vh-vh*350/1500;
 el('line',{x1:vx-8,x2:vx+vw+8,y1:thr,y2:thr,stroke:'#b8321f','stroke-width':2,'stroke-dasharray':'5 4'},g1);
 var tl=el('text',{x:vx+vw+16,y:thr+5,'font-family':T,'font-size':13,'font-weight':700,fill:'#b8321f'},g1);tl.textContent='350 mg: signs appear';
 var mg=el('text',{x:vx+vw+16,y:vy+26,'font-family':'DM Serif Display,Georgia,serif','font-size':38,fill:'#1d1812'},g1),wk=el('text',{x:vx+vw+18,y:vy+50,'font-family':T,'font-size':15,'font-weight':600,fill:'#6b5f4f'},g1);
 var sy=['Gums bleed','Spots under the skin','Weak knees'].map(function(t,i){var x=el('text',{x:vx+vw+16,y:thr+44+i*24,'font-family':T,'font-size':15,'font-weight':600,fill:'#b8321f',opacity:0},g1);x.textContent=t;return x});
 var g2=el('g',{opacity:0},svg),cx=180,cy=150,R0=96,W=[];
 el('circle',{cx:cx,cy:cy,r:R0+8,fill:'#f0a23a'},g2);
 for(var i=0;i<7;i++){var a0=-Math.PI/2+i*2*Math.PI/7+.03,a1=a0+2*Math.PI/7-.06,P=function(a,r){return (cx+r*Math.cos(a)).toFixed(1)+' '+(cy+r*Math.sin(a)).toFixed(1)};
  W.push(el('path',{d:'M'+P(a0,12)+' L'+P(a0,R0)+' A'+R0+' '+R0+' 0 0 1 '+P(a1,R0)+' L'+P(a1,12)+' Z',fill:'#fbd38a',stroke:'#f0a23a','stroke-width':2},g2))}
 var ol=el('text',{x:cx,y:cy+R0+42,'text-anchor':'middle','font-family':T,'font-size':16,'font-weight':700,fill:'#1d1812'},g2);
 var g3=el('g',{opacity:0},svg),bars=[['Lemon','#f2c230',1],['Lime','#5aa33a',.25]].map(function(d,i){var y=110+i*80;el('circle',{cx:44,cy:y,r:24,fill:d[1]},g3);var t=el('text',{x:80,y:y-12,'font-family':T,'font-size':15,'font-weight':700,fill:'#1d1812'},g3);t.textContent=d[0];el('rect',{x:80,y:y-2,width:240,height:16,rx:8,fill:'#e6dcc8'},g3);return [el('rect',{x:80,y:y-2,width:0,height:16,rx:8,fill:d[1]},g3),d[2]]});
 var bl=el('text',{x:80,y:290,'font-family':T,'font-size':15,'font-weight':600,fill:'#6b5f4f'},g3);bl.textContent='Vitamin C, relative';
 return function(s){var dr=sm((s-.95)/1.25),m=Math.round(lerp(1500,300,dr)),h=(vh-8)*m/1500;
  fill.setAttribute('y',vy+vh-4-h);fill.setAttribute('height',h);fill.setAttribute('fill',m<350?'#b8321f':'#e8962e');mg.textContent=m.toLocaleString('en-US')+' mg';wk.textContent=dr>0?'Week '+Math.round(12*dr):'Full store';
  sy.forEach(function(x,i){x.style.opacity=sm((s-1.9-i*.12)/.25)});
  var o2=sm((s-2.5)/.4),o3=sm((s-3.5)/.4);g1.style.opacity=1-o2;g2.style.opacity=o2*(1-o3);g3.style.opacity=o3;
  var lit=cl((s-2.95)/.75,0,1)*7;W.forEach(function(w,i){w.setAttribute('fill',i<Math.max(1,Math.ceil(lit))?'#fffaf0':'#f6c46a')});ol.textContent=lit<=1.01?'One segment, about 10 mg: a day of protection':Math.round(lit*10)+' mg'+(lit>6.9?': one orange':'');
  bars.forEach(function(b){b[0].setAttribute('width',(240*b[1]*sm((s-3.6)/.4)).toFixed(1))})}};

function scrolly(root,sc){var S=[].slice.call(root.querySelectorAll('[data-sy]')).map(function(f){var o={el:f,caps:[].slice.call(f.querySelectorAll('.sy-cap'))};o.draw=R[f.dataset.sy]?R[f.dataset.sy](o):function(){};return o});
 if(!S.length)return;var raf=0;
 function frame(){raf=0;var vh=sc.clientHeight,sr=sc.getBoundingClientRect().top;S.forEach(function(o){var r=o.el.getBoundingClientRect(),top=r.top-sr,hh=o.el.offsetHeight;if(top>vh*1.2||top+hh<-vh*.2)return;
  var n=o.caps.length,t=cl(-top/Math.max(1,hh-vh),0,1),s=t*(n-1);
  o.caps.forEach(function(c,i){var d=Math.abs(s-i),op=d<.26?1:cl(1-(d-.26)/.2,0,1);c.style.opacity=op.toFixed(3);c.style.transform='translate3d(0,'+((i-s)*24).toFixed(1)+'px,0)'});o.draw(s)})}
 function req(){if(!raf)raf=requestAnimationFrame(frame)}
 sc.addEventListener('scroll',req,{passive:true});window.addEventListener('resize',req);[].forEach.call(root.querySelectorAll('img'),function(i){i.addEventListener('load',req)});frame();setTimeout(frame,400)}
function doc(d){var tr=d.querySelector('[data-doc-track]'),n=d.querySelector('[data-doc-n]'),sh=[].slice.call(tr.children);
 function idx(){var c=tr.scrollLeft+tr.clientWidth/2,b=0,bd=1e9;sh.forEach(function(s,i){var m=s.offsetLeft+s.offsetWidth/2,dd=Math.abs(m-c);if(dd<bd){bd=dd;b=i}});return b}
 function to(i){i=cl(i,0,sh.length-1);var s=sh[i];tr.scrollTo({left:s.offsetLeft-(tr.clientWidth-s.offsetWidth)/2,behavior:RM?'auto':'smooth'})}
 tr.addEventListener('scroll',function(){n.textContent=(idx()+1)+' / '+sh.length},{passive:true});
 act(d.querySelector('[data-doc-prev]'),function(){to(idx()-1)});act(d.querySelector('[data-doc-next]'),function(){to(idx()+1)})}
function reveal(root){var io=new IntersectionObserver(function(es){es.forEach(function(e){if(!e.isIntersecting)return;e.target.classList.add('in');io.unobserve(e.target)})},{threshold:.3});[].forEach.call(root.querySelectorAll('[data-rv]'),function(x){io.observe(x)})}
window.WVW=function(root,sc){try{var fo=root.querySelector('.folio');if(fo)fo.style.setProperty('--g',getComputedStyle(fo).paddingLeft);scrolly(root,sc);
 [].forEach.call(root.querySelectorAll('[data-doc]'),doc);
 [].forEach.call(root.querySelectorAll('[data-flips] .flip'),function(f){act(f,function(){f.setAttribute('aria-pressed',f.getAttribute('aria-pressed')==='true'?'false':'true')})});
 reveal(root)}catch(e){console.error('WVW',e)}};
})();
