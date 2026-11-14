(function(){
var RM=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
function cl(v,a,b){return v<a?a:v>b?b:v}
function $(r,s){return r.querySelector(s)}
function $$(r,s){return [].slice.call(r.querySelectorAll(s))}
function h(tag,cls,html){var e=document.createElement(tag);if(cls)e.className=cls;if(html!=null)e.innerHTML=html;return e}
function esc(t){return String(t).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
function words(el){return (el.textContent||'').trim().split(/\s+/).filter(Boolean).length}
function pad(n){return (n<10?'0':'')+n}
function split(el,base,step){var i=0;base=base||0;step=step||.045;(function walk(n){[].slice.call(n.childNodes).forEach(function(c){if(c.nodeType===3){var parts=c.textContent.split(/(\s+)/),f=document.createDocumentFragment();parts.forEach(function(p){if(!p)return;if(/^\s+$/.test(p)){f.appendChild(document.createTextNode(' '));return}var s=document.createElement('span');s.className='wd';s.style.setProperty('--d',(base+i*step).toFixed(3)+'s');s.textContent=p;f.appendChild(s);i++});n.replaceChild(f,c)}else if(c.nodeType===1&&!c.classList.contains('wd'))walk(c)})})(el);return base+i*step}
function A(el,how,d,du){if(!el)return el;el.classList.add('a');if(how)el.setAttribute('data-in',how);if(d!=null)el.style.setProperty('--d',(+d).toFixed(2)+'s');if(du)el.style.setProperty('--du',du+'s');return el}

var CSS=[
'.fd{--cream:#f6eedb;--ink:#1c140d;--amber:#f0b03f;--rust:#b4391f;--ok:#2f8f57;--sans:"Instrument Sans",-apple-system,BlinkMacSystemFont,sans-serif;--disp:"DM Serif Display",Georgia,serif;--fell:"IM Fell English","Spectral",Georgia,serif;--post:"DM Serif Display",Georgia,serif;--top0:var(--top,0px);--safe:calc(var(--top0) + 74px);font-family:var(--sans);-webkit-font-smoothing:antialiased;display:block;position:relative;background:#120d09}',
'.fd *{box-sizing:border-box}',
'.fd .fd-head,.fd .endmatter,.fd figure.pw,.fd section.ch>h2,.fd section.ch>.tease{display:none}',
'.fd section.ch{display:block}',
'.cd{position:relative;height:var(--fh,100svh);overflow:hidden;scroll-snap-align:start;scroll-snap-stop:always;background:var(--cdp,#1a120b);color:#fff;--cc:#c2571f;--cdp:#1a120b;--ca:#f0b03f}',
'.cd[hidden]{display:none}',
'.wvb .fd .cd p{margin:0}',
'.cd.light{color:var(--ink)}',
'.fd:not(.rm) .cd:not(.on) .a,.fd:not(.rm) .cd:not(.on) .wd{opacity:0}',
'.cd.on .a{animation:var(--an,inUp) var(--du,.75s) var(--ez,cubic-bezier(.16,1,.3,1)) var(--d,0s) both}',
'.cd.on .wd{display:inline-block;animation:inWd .5s cubic-bezier(.16,1,.3,1) var(--d,0s) both}',
'.cd .wd{display:inline-block}',
'.a[data-in=left]{--an:inL}.a[data-in=right]{--an:inR}.a[data-in=pop]{--an:inPop;--ez:cubic-bezier(.3,1.55,.5,1)}.a[data-in=drop]{--an:inDrop;--ez:cubic-bezier(.3,1.3,.5,1)}.a[data-in=fade]{--an:inFade}.a[data-in=stamp]{--an:inStamp;--ez:cubic-bezier(.3,1.6,.5,1);--du:.45s}.a[data-in=flip]{--an:inFlip}.a[data-in=wipe]{--an:inWipe;--du:.9s}.a[data-in=grow]{--an:inGrow}',
'@keyframes inUp{from{opacity:0;transform:translateY(34px)}}',
'@keyframes inL{from{opacity:0;transform:translateX(-115%) rotate(-7deg)}68%{opacity:1;transform:translateX(3%) rotate(.8deg)}84%{transform:translateX(-1%) rotate(-.2deg)}}',
'@keyframes inR{from{opacity:0;transform:translateX(115%) rotate(7deg)}68%{opacity:1;transform:translateX(-3%) rotate(-.8deg)}84%{transform:translateX(1%) rotate(.2deg)}}',
'@keyframes inPop{from{opacity:0;transform:scale(.3)}}',
'@keyframes inDrop{from{opacity:0;transform:translateY(-130%) rotate(-10deg)}}',
'@keyframes inFade{from{opacity:0}}',
'@keyframes inStamp{from{opacity:0;transform:rotate(var(--r,-5deg)) scale(2.2)}}',
'@keyframes inFlip{from{opacity:0;transform:perspective(700px) rotateX(-70deg) translateY(30px)}}',
'@keyframes inWipe{from{clip-path:inset(0 100% 0 0)}to{clip-path:inset(0 0 0 0)}}',
'@keyframes inGrow{from{transform:scaleX(0)}}',
'@keyframes inWd{from{opacity:0;transform:translateY(.7em) rotate(4deg)}}',
'.cd .art{transition:opacity .7s ease,transform 1.4s cubic-bezier(.16,1,.3,1)}',
'.fd:not(.rm) .cd:not(.on) .art{opacity:.3;transform:scale(1.1)}',
'.fd{--hand:"Petit Formal Script","IM Fell English",cursive}',
'.lg{position:absolute;left:0;right:0;top:var(--safe);bottom:0;padding:0 16px calc(78px + env(safe-area-inset-bottom));display:flex;flex-direction:column;justify-content:center;gap:14px;z-index:2}',
'.wvb .fd .lg .lead{font:600 18.5px/1.36 var(--sans);color:#fff;max-width:32ch;padding:0 6px}',
'.wvb .fd .lg .note{color:rgba(255,255,255,.9);padding:0 6px;font-size:17px}',
'.book{position:relative;background:linear-gradient(90deg,rgba(70,45,10,.3),rgba(70,45,10,0) 8%),linear-gradient(#f8f0da,#efe3c4);border-radius:3px 10px 10px 3px;box-shadow:0 24px 54px rgba(0,0,0,.55),0 2px 0 rgba(255,255,255,.5) inset;padding:12px 14px 16px 30px;transform:rotate(-1.4deg);color:#2a1d10}',
'.book::before{content:"";position:absolute;left:22px;top:0;bottom:0;width:1.5px;background:rgba(180,57,31,.45)}',
'.book-t{font:400 16px/1.2 var(--hand);text-align:center;margin:2px 0 8px;color:#3a2a16}',
'.book-g{display:grid;grid-template-columns:1.25fr 1fr}','.book{overflow:hidden}',
'.book-c{padding:0 8px 0 0}.book-c+.book-c{padding:0 0 0 12px;border-left:1.5px solid rgba(42,29,16,.38)}',
'.book-c h4{margin:0 0 4px;font:400 25px/1.2 var(--hand);color:#2a1d10;border-bottom:3px double rgba(42,29,16,.5);padding-bottom:3px}',
'.wvb .fd .book ul{list-style:none;margin:0;padding:0}',
'.wvb .fd .book .rows{gap:0}','.wvb .fd .book .rows li{display:flex;gap:9px;align-items:baseline;margin:0;padding:0;height:35px;border-bottom:1px solid rgba(40,70,120,.22)}',
'.wvb .fd .book .rows li b{flex:0 0 40px;text-align:right;font:400 22px/35px var(--fell);color:#2a1d10}',
'.wvb .fd .book .rows li span{font:400 16px/35px var(--hand);white-space:nowrap;color:#2a1d10}',
'.wvb .fd .book .rows li.hot b,.wvb .fd .book .rows li.hot span{color:var(--rust)}',
'.book-gain{display:grid;place-items:center;height:175px}',
'.book-gain span{font:400 27px/1 var(--hand);color:var(--rust);transform:rotate(-9deg);border-bottom:2px solid var(--rust);padding:0 4px 6px}',
'.a[data-in=write]{--an:inWipe;--du:.6s;--ez:linear}',
'.turn{display:inline-flex;align-items:center;gap:8px;align-self:flex-start;font:700 11.5px/1 var(--sans);letter-spacing:.13em;text-transform:uppercase;color:#f6edd6;background:var(--ink);padding:8px 12px;border-radius:999px}',
'.turn i{font-style:normal;opacity:.7;letter-spacing:.04em}',
'.cd.reply .turn{align-self:flex-end;background:var(--rust)}',
'.sig{font:400 21px/1.2 var(--hand);color:#3a2a16;align-self:flex-end;margin-top:-4px}',
'.cd.ask .doc-body{padding-right:34px}.cd.reply .doc-body{padding-left:34px}',
'.cd.ask blockquote::before,.cd.reply blockquote::before{content:"";display:block;width:34px;height:3px;background:var(--rust);margin-bottom:12px}',
'.badge{align-self:flex-start;display:flex;gap:10px;align-items:center;background:var(--ink);color:#f6edd6;border-radius:14px;padding:11px 14px;font:700 14px/1.25 var(--sans);max-width:31ch;box-shadow:0 10px 24px rgba(28,20,13,.28)}',
'.badge svg{width:26px;height:26px;flex:none;color:var(--amber)}',
'.pk{position:absolute;left:14px;right:14px;top:var(--safe);bottom:calc(20px + env(safe-area-inset-bottom));display:flex;flex-direction:column;justify-content:center;gap:12px;z-index:8}',
'.pk-card{background:#fffdf8;color:var(--ink);border-radius:24px;padding:18px 13px 13px;box-shadow:0 20px 54px rgba(0,0,0,.45)}',
'.wvb .fd .pk-card .q{font:700 18.5px/1.3 var(--sans);text-align:center;margin:0 6px 5px;text-wrap:balance}',
'.pk-n{display:block;text-align:center;font:600 13px/1.3 var(--sans);color:rgba(28,20,13,.7);margin-bottom:12px}',
'.wvb .fd .pk-grid{list-style:none;margin:0;padding:0;display:grid;grid-template-columns:repeat(3,1fr);gap:8px}',
'.wvb .fd .pk-grid li{margin:0;min-height:50px;border-radius:14px;background:#f1e9d8;display:grid;place-items:center;text-align:center;padding:6px 4px;font:600 14.5px/1.15 var(--sans);cursor:pointer;-webkit-tap-highlight-color:transparent;transition:transform .15s,background .25s,color .25s,opacity .3s;user-select:none}',
'.pk-grid li:active{transform:scale(.95)}',
'.pk-grid li.sel{background:var(--ink);color:#fffdf8;transform:scale(1.04)}',
'.pk.done .pk-grid li{cursor:default;opacity:.38}',
'.pk.done .pk-grid li.ok{opacity:1;background:var(--ok);color:#fff}',
'.pk.done .pk-grid li.ok.sel{animation:okPop .5s var(--spr)}',
'.pk.done .pk-grid li.ok:not(.sel){background:#fffdf8;color:var(--ok);box-shadow:inset 0 0 0 2.5px var(--ok)}',
'.pk.done .pk-grid li.sel:not(.ok){opacity:1;background:var(--rust);color:#fff;animation:bdNo .4s}',
'.pk-go{margin-top:12px;width:100%;min-height:52px;border:0;border-radius:999px;background:var(--ink);color:#fbf7ee;font:600 16.5px/1.2 var(--sans);cursor:pointer;transition:opacity .25s}',
'.pk-go:disabled{opacity:.3}.pk.done .pk-go{display:none}',
'.pk .why{display:none;font:500 17.5px/1.4 var(--sans);color:#fff;padding:0 6px;text-wrap:pretty;max-width:34ch}',
'.pk.done .why{display:block;animation:inUp .6s cubic-bezier(.16,1,.3,1) .5s both}',
'.pk .why b{display:block;font:700 12px/1.3 var(--sans);letter-spacing:.12em;text-transform:uppercase;color:var(--ca);margin-bottom:6px}',
'.cd[data-t=pick]:not(.open) .nx,.cd[data-t=guess]:not(.open) .nx{display:none}',
'.cd[data-t=pick].open .pk,.cd[data-t=guess].open .pk{bottom:calc(74px + env(safe-area-inset-bottom))}',
'.gs-read{text-align:center;font:400 62px/1 var(--post);color:var(--ink);font-variant-numeric:tabular-nums;margin:6px 0 2px}',
'.gs-read small{font:700 14px/1 var(--sans);letter-spacing:.08em;text-transform:uppercase;margin-left:6px;color:rgba(28,20,13,.7)}',
'.gs-ice:empty{display:none}','.gs-ice{display:grid;grid-template-columns:repeat(9,1fr);gap:4px;margin:10px 2px 12px}',
'.gs-ice i{aspect-ratio:1;border-radius:5px;background:#e8dfcb;transition:background .25s,transform .25s}',
'.gs-ice i.on{background:linear-gradient(145deg,#d6f1ff,#7cc4ea);box-shadow:inset 0 0 0 1.5px rgba(255,255,255,.7)}',
'.gs-ice i.gone{background:#e8dfcb;transform:scale(.6);opacity:.5}',
'.gs-r{-webkit-appearance:none;appearance:none;width:100%;height:44px;background:transparent;margin:0;touch-action:pan-y}',
'.gs-r::-webkit-slider-runnable-track{height:8px;border-radius:4px;background:#e2d8c2}',
'.gs-r::-moz-range-track{height:8px;border-radius:4px;background:#e2d8c2}',
'.gs-r::-webkit-slider-thumb{-webkit-appearance:none;width:34px;height:34px;border-radius:50%;background:var(--ink);border:4px solid #fffdf8;box-shadow:0 3px 10px rgba(0,0,0,.35);margin-top:-13px}',
'.gs-r::-moz-range-thumb{width:28px;height:28px;border-radius:50%;background:var(--ink);border:4px solid #fffdf8}',
'.gs-ends{display:flex;justify-content:space-between;font:600 12px/1 var(--sans);color:rgba(28,20,13,.7);margin:-2px 2px 0}',
'.pk.done .gs-r,.pk.done .gs-ends{display:none}',
'.clip{position:absolute;inset:0;background:#0c0a08}.clip video{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}',
'.clipw{position:absolute;left:14px;right:14px;top:calc(var(--safe) + 7%);z-index:3}.clipw video{display:block;width:100%;aspect-ratio:16/9;object-fit:cover;border-radius:16px;background:#000;box-shadow:0 24px 54px rgba(0,0,0,.55),0 0 0 1px rgba(255,255,255,.12)}.clipw span{display:block;margin:9px 4px 0;font:500 11.5px/1.3 var(--sans);color:rgba(255,255,255,.72)}','.num-sub{display:inline-block;margin-top:16px;font:700 17px/1.2 var(--sans);color:var(--ink);background:var(--ca);padding:9px 13px;border-radius:999px;text-shadow:none;letter-spacing:0}',

'.fd{--spr:cubic-bezier(.3,1.55,.5,1)}',
'@supports (animation-timing-function:linear(0,1)){.fd{--spr:linear(0,.009,.035 2.1%,.141 4.4%,.723 12.9%,.938 16.7%,1.017,1.077,1.121,1.149 24.3%,1.159,1.163,1.161,1.154 29.9%,1.129 32.8%,1.051 39.6%,1.017 43.1%,.991,.977 51%,.974 53.8%,.975 57.1%,.997 69.8%,1.003 76.9%,1.004 83.8%,1)}.a[data-in=pop]{--ez:var(--spr);--du:1s}.a[data-in=drop]{--ez:var(--spr);--du:1.1s}.a[data-in=flip]{--ez:var(--spr);--du:.9s}.cd.on .plate img.a{--ez:var(--spr);--du:1.2s}}',
'.gr::after,.cd[data-t=title]::before,.cd[data-t=collect]::before,.cd.paper::before{content:"";position:absolute;inset:0;pointer-events:none;background:url(\"data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%27160%27 height=%27160%27%3E%3Cfilter id=%27n%27%3E%3CfeTurbulence type=%27fractalNoise%27 baseFrequency=%27.9%27 numOctaves=%272%27 stitchTiles=%27stitch%27/%3E%3CfeColorMatrix values=%270 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 .55 0%27/%3E%3C/filter%3E%3Crect width=%27160%27 height=%27160%27 filter=%27url(%23n)%27/%3E%3C/svg%3E\");mix-blend-mode:soft-light;opacity:.5;z-index:0}',
'.cd.paper::before{mix-blend-mode:multiply;opacity:.16;filter:invert(1)}',
'.cd[data-t=title]::after{content:"";position:absolute;inset:0;pointer-events:none;background:radial-gradient(90% 60% at 15% 0%,rgba(255,255,255,.22),transparent 60%),radial-gradient(120% 70% at 100% 100%,rgba(0,0,0,.34),transparent 60%);z-index:0}',
'.scene svg{filter:drop-shadow(0 10px 0 rgba(0,0,0,.16)) drop-shadow(0 26px 24px rgba(0,0,0,.22))}',
'.plate img{box-shadow:0 2px 0 rgba(255,255,255,.5) inset,0 30px 60px rgba(0,0,0,.5),0 6px 12px rgba(0,0,0,.35)}',
'.poll-card,.who .rows li,.co-ic{backface-visibility:hidden}',
'.cd.on:not([data-tag]) .cam.art{animation:camIdle 18s ease-in-out 4.5s infinite alternate}@keyframes camIdle{to{scale:1.045}}',
'.who-pic{position:relative;overflow:hidden}.who-pic::after{content:"";position:absolute;top:-20%;bottom:-20%;left:-70%;width:45%;background:linear-gradient(90deg,transparent,rgba(255,255,255,.55),transparent);transform:skewX(-20deg)}.cd.on .who-pic::after{animation:coShine 1.2s ease 1.1s both}',
'.cd.on .li-wrap{animation:hit .34s ease var(--hit,999s) 1}@keyframes hit{20%{transform:translate(0,4px)}45%{transform:translate(-2px,-2px)}70%{transform:translate(1px,1px)}}',
'.num-big span{display:inline-block;transform-origin:0 60%}.num-big.land span{animation:numLand .5s var(--spr)}@keyframes numLand{from{transform:scale(1.14)}}',
'.hud-bar i b{box-shadow:0 0 8px rgba(255,255,255,.7)}.hud.lt .hud-bar i b{box-shadow:none}',
'.cd.on .nx{box-shadow:0 0 0 1px rgba(255,255,255,.2)}.cd.on .nx:not(.bare) span{animation:nxBreath 2.4s ease-in-out 3s infinite}@keyframes nxBreath{50%{opacity:.72}}',
'.cd.on .tagp{animation:var(--an,inPop) var(--du,.75s) var(--ez) var(--d,0s) both,tagFloat 3s ease-in-out calc(var(--d,0s) + 1s) infinite}@keyframes tagFloat{50%{margin-top:-5px}}',
'.cd.on .co-ic{animation:inPop 1s var(--spr) .25s both,coFloat 3.6s ease-in-out 1.6s infinite}@keyframes coFloat{50%{translate:0 -7px}}',
'.cd.on .stamp::after{content:"";position:absolute;inset:-10px;border-radius:10px;border:2px solid var(--rust);opacity:0;animation:stRing .6s ease-out calc(var(--d,0s) + .12s) both}.stamp{position:relative}@keyframes stRing{from{opacity:.7;transform:scale(.8)}to{opacity:0;transform:scale(1.5)}}',
'.cv{position:absolute;inset:0;z-index:30;pointer-events:none;background:radial-gradient(circle at 1px 1px,rgba(255,255,255,.1) 1.3px,transparent 1.6px) 0 0/14px 14px,var(--cc)}','.fd.rm .cv{display:none}','.cd.on .cv{animation:var(--cvn,cvUp) .62s cubic-bezier(.7,0,.2,1) both}','.cv[data-v="1"]{--cvn:cvDiag}.cv[data-v="2"]{--cvn:cvSide}.cv[data-v="3"]{--cvn:cvSplit}','@keyframes cvUp{from{clip-path:inset(0 0 0 0)}to{clip-path:inset(0 0 100% 0)}}','@keyframes cvDiag{from{clip-path:polygon(0 0,100% 0,100% 130%,0 100%)}to{clip-path:polygon(0 0,100% 0,100% 0,0 -30%)}}','@keyframes cvSide{from{clip-path:inset(0 0 0 0)}to{clip-path:inset(0 0 0 100%)}}','@keyframes cvSplit{from{clip-path:polygon(0 0,100% 0,100% 100%,0 100%,0 50%,100% 50%,100% 50%,0 50%)}to{clip-path:polygon(0 0,100% 0,100% 0,0 0,0 100%,100% 100%,100% 100%,0 100%)}}',
'.nx{position:absolute;left:50%;bottom:calc(16px + env(safe-area-inset-bottom));z-index:12;transform:translateX(-50%);display:flex;align-items:center;gap:9px;min-height:44px;max-width:calc(100% - 36px);border:0;border-radius:999px;padding:9px 12px 9px 17px;background:rgba(255,255,255,.16);-webkit-backdrop-filter:blur(14px);backdrop-filter:blur(14px);color:#fff;font:600 14px/1.25 var(--sans);text-align:left;cursor:pointer;-webkit-tap-highlight-color:transparent;box-shadow:0 0 0 1px rgba(255,255,255,.2)}',
'.nx.bare{padding:0;width:46px;justify-content:center}',
'.nx svg{width:22px;height:22px;flex:none;animation:nxBob 1.5s ease-in-out infinite}',
'.cd.light .nx{background:rgba(28,20,13,.09);color:var(--ink);box-shadow:0 0 0 1px rgba(28,20,13,.16)}',
'.nx:active{transform:translateX(-50%) scale(.96)}',
'@keyframes nxBob{50%{transform:translateY(4px)}}',
'.cd.on .nx{animation:nxIn .6s cubic-bezier(.16,1,.3,1) var(--nd,2.4s) both}',
'.fd:not(.rm) .cd:not(.on) .nx{opacity:0}',
'@keyframes nxIn{from{opacity:0;transform:translate(-50%,16px)}}',
'.cd.gate:not(.open) .nx{display:none}',
'.cd.open .nx{--nd:.9s}',
'.cap{position:absolute;left:0;right:0;bottom:0;z-index:6;padding:150px 22px calc(82px + env(safe-area-inset-bottom));background:linear-gradient(to top,rgba(10,7,4,.97) 0,rgba(10,7,4,.93) 48%,rgba(10,7,4,.74) 76%,rgba(10,7,4,0));font:500 21px/1.36 var(--sans);color:#fff;text-wrap:pretty}',
'.cap>span{display:block;max-width:31ch}',
'.cap .kick,.kick{display:block;font:700 11.5px/1.3 var(--sans);letter-spacing:.15em;text-transform:uppercase;color:var(--ca);margin-bottom:9px}',
'.cap b{font-weight:700;color:var(--ca)}',
'.cam{position:absolute;inset:0;overflow:hidden;background:#0c0a08}',
'.cam img{position:absolute;left:0;top:0;max-width:none;transform-origin:0 0;transform:var(--t0)}',
'.cd.on .cam img{transform:var(--t1);animation:camPan var(--pd,3.2s) cubic-bezier(.45,0,.15,1) var(--pw,.5s) both;will-change:transform}',
'.fd.rm .cam img{transform:var(--t1)}',
'@keyframes camPan{from{transform:var(--t0)}to{transform:var(--t1)}}',
'.cam .spot{position:absolute;inset:0;background:var(--sp,none);opacity:0}',
'.cd.on .cam .spot{opacity:1;animation:inFade .9s ease calc(var(--pw,.5s) + var(--pd,3.2s) - .5s) both}',
'.tagp{position:absolute;z-index:5;font:700 12px/1 var(--sans);letter-spacing:.04em;color:var(--ink);background:var(--ca);padding:8px 11px;border-radius:999px;box-shadow:0 6px 18px rgba(0,0,0,.4);white-space:nowrap}',
'.tagp::after{content:"";position:absolute;left:50%;top:100%;margin-left:-5px;border:5px solid transparent;border-top-color:var(--ca)}',
'.por{position:absolute;right:18px;top:var(--safe);z-index:5;width:98px;border-radius:14px;overflow:hidden;background:#14110d;box-shadow:0 14px 36px rgba(0,0,0,.6)}',
'.por img{display:block;width:100%;height:118px;object-fit:cover}',
'.por b{display:block;padding:6px 8px 7px;font:600 11px/1.25 var(--sans);color:#efe6d6}',
'.gr{position:absolute;inset:0;background:radial-gradient(circle at 1px 1px,rgba(255,255,255,.09) 1.3px,transparent 1.6px) 0 0/14px 14px,linear-gradient(160deg,var(--cc),var(--cdp) 78%)}',
'.plate{position:absolute;left:0;right:0;top:var(--safe);bottom:38%;display:flex;align-items:center;justify-content:center;padding:0 18px;z-index:2}',
'.plate img{display:block;max-width:100%;max-height:100%;width:auto;height:auto;min-height:0;min-width:84%;object-fit:contain;border:7px solid #fbf6ea;border-radius:3px;box-shadow:0 24px 54px rgba(0,0,0,.55);transform:rotate(var(--rot,-1.4deg))}',
'.cd.on .plate img.a{--an:plIn;--du:1s;--ez:cubic-bezier(.2,1.2,.4,1)}',
'@keyframes plIn{from{opacity:0;transform:translateX(var(--fx,120%)) rotate(calc(var(--rot,-1.4deg) + var(--fr,14deg)))}}',
'.cd>.who,.cd>.li-wrap,.cd>.co,.cd>.tt,.cd>.fact-in,.cd>.doc-body,.cd>.bd,.cd>.end{z-index:2}','.cd.paper{background:radial-gradient(ellipse at 20% 0%,rgba(255,255,255,.55),rgba(255,255,255,0) 55%),linear-gradient(#f7efdc,#ebdebf);color:var(--ink)}',
'.doc-win{position:absolute;left:18px;right:18px;top:var(--safe);height:var(--dh,28%);overflow:hidden;border-radius:4px;background:#fff;box-shadow:0 1px 0 rgba(255,255,255,.6) inset,0 16px 34px rgba(60,40,10,.3);z-index:2}',
'.doc-win .cam{background:#f3ead4}','.cd.fitw .doc-win{max-height:34%}','.cd.fitw .doc-body{justify-content:center}',
'.doc-body{position:absolute;left:0;right:0;top:calc(var(--safe) + var(--dh,28%) + 20px);bottom:0;padding:0 24px calc(78px + env(safe-area-inset-bottom));display:flex;flex-direction:column;justify-content:center;gap:15px}',
'.cd.noscan .doc-body{top:var(--safe)}',
'.wvb .fd .cd blockquote{margin:0;padding:0;border:0;font:400 24px/1.33 var(--fell);color:var(--ink);text-wrap:pretty}',
'.wvb .fd .cd blockquote.long{font-size:20.5px;line-height:1.36}',
'.cd blockquote mark{color:inherit;background:linear-gradient(rgba(240,176,63,.6),rgba(240,176,63,.6)) 0 88%/0 44% no-repeat;-webkit-box-decoration-break:clone;box-decoration-break:clone}',
'.cd.on blockquote mark{animation:mkSweep 1s cubic-bezier(.4,0,.2,1) var(--md,2.2s) both}.fd.rm blockquote mark{background-size:100% 44%}',
'@keyframes mkSweep{to{background-size:100% 44%}}',
'.note{font:500 18px/1.42 var(--sans);color:rgba(28,20,13,.88);max-width:33ch}.note b{font-weight:700}',
'.src{font:700 11px/1.3 var(--sans);letter-spacing:.14em;text-transform:uppercase;color:var(--rust)}',
'.fd .gloss{cursor:help;text-decoration:underline dotted currentColor;text-decoration-thickness:1.5px;text-underline-offset:4px;-webkit-tap-highlight-color:transparent}',
'.li-wrap{position:absolute;left:0;right:0;top:var(--safe);bottom:0;padding:6px 24px calc(80px + env(safe-area-inset-bottom));display:flex;flex-direction:column;justify-content:center;gap:15px;z-index:2}',
'.wvb .fd .li-wrap .lead{font:600 21px/1.34 var(--sans);max-width:30ch;color:#fff}.wvb .fd .cd.paper .li-wrap .lead{color:var(--ink);font-weight:500;font-size:19px}','.wvb .fd .cd.qa .rows{gap:10px}.wvb .fd .cd.qa .rows li{display:block;background:rgba(255,255,255,.1);border-radius:16px;padding:11px 14px 12px}.wvb .fd .cd.qa .rows li b{display:block;font:700 18px/1.25 var(--sans);color:#fff;margin-bottom:4px}.wvb .fd .cd.qa .rows li{background:rgba(0,0,0,.26)}.wvb .fd .cd.qa .rows{gap:12px}.wvb .fd .cd.qa .rows li span{font-size:16.5px}','.co-ic{position:relative;overflow:hidden}.co-ic::after{content:"";position:absolute;top:-20%;bottom:-20%;left:-60%;width:40%;background:linear-gradient(90deg,transparent,rgba(255,255,255,.85),transparent);transform:skewX(-20deg)}.cd.on .co-ic::after{animation:coShine 1.1s ease 1.2s both}@keyframes coShine{to{left:130%}}','.wvb .fd .cd.five .rows li{grid-template-columns:30px 1fr}.wvb .fd .cd.five .rows li span{font-size:17.5px}',
'.wvb .fd .rows{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:12px}',
'.wvb .fd .rows li{display:grid;grid-template-columns:62px 1fr;gap:12px;align-items:baseline;margin:0}',
'.rows li b{font:400 23px/1.1 var(--disp);color:var(--ca);font-variant-numeric:tabular-nums}',
'.rows li span{font:500 18.5px/1.36 var(--sans)}',
'.rows li.hot span{color:var(--ca);font-weight:700}',
'.cd.paper .rows li{grid-template-columns:78px 1fr;border-bottom:1px solid rgba(28,20,13,.16);padding-bottom:10px}',
'.cd.paper .rows li b{font:400 31px/1 var(--fell);color:var(--ink);text-align:right}',
'.cd.paper .rows li span{font:400 22px/1.2 var(--fell)}',
'.cd.paper .rows li.hot b,.cd.paper .rows li.hot span{color:var(--rust)}',
'.stamp{align-self:flex-start;font:400 30px/1 var(--disp);letter-spacing:.04em;color:var(--rust);border:3px solid var(--rust);border-radius:6px;padding:8px 14px 6px;transform:rotate(-5deg);--r:-5deg}',
'.stamp small{display:block;font:700 11px/1 var(--sans);letter-spacing:.18em;text-transform:uppercase;margin-bottom:5px}',
'.li-wrap .note{color:rgba(255,255,255,.86)}.cd.paper .li-wrap .note{color:rgba(28,20,13,.82)}',
'.who{position:absolute;left:0;right:0;top:var(--safe);bottom:0;padding:4px 22px calc(80px + env(safe-area-inset-bottom));display:flex;flex-direction:column;justify-content:center;gap:14px;z-index:2}',
'.who-top{display:flex;align-items:flex-end;gap:16px}',
'.who-pic{width:128px;height:156px;flex:none;border-radius:18px;background:#2a1d12 center/cover no-repeat;box-shadow:0 0 0 4px var(--ca),0 18px 40px rgba(0,0,0,.5);transform:rotate(-3deg)}',
'.who-id{min-width:0;padding-bottom:4px}',
'.who-id i{display:inline-block;font:700 11.5px/1 var(--sans);font-style:normal;letter-spacing:.14em;text-transform:uppercase;color:var(--ink);background:var(--ca);padding:7px 10px;border-radius:999px;margin-bottom:10px}',
'.who-id b{display:block;font:400 34px/1 var(--post);letter-spacing:.01em;text-transform:uppercase;color:#fff}',
'.who-id small{display:block;font:600 14px/1.3 var(--sans);color:rgba(255,255,255,.78);margin-top:8px}',
'.wvb .fd .who .rows{gap:9px}',
'.wvb .fd .who .rows li{display:block;background:rgba(255,255,255,.1);border-radius:16px;padding:11px 14px 12px;box-shadow:inset 0 0 0 1px rgba(255,255,255,.1)}',
'.who .rows li b{display:block;font:700 11px/1.2 var(--sans);letter-spacing:.14em;text-transform:uppercase;color:var(--ca);margin-bottom:4px}',
'.who .rows li span{font:500 17.5px/1.36 var(--sans);color:#fff}',
'.wvb .fd .who .rows li.hot{background:var(--ca);box-shadow:0 10px 26px rgba(0,0,0,.3)}.wvb .fd .who .rows li.hot b{color:rgba(28,20,13,.72)}.wvb .fd .who .rows li.hot span{color:var(--ink);font-weight:600}',
'.bgim{position:absolute;inset:0;background:center/cover no-repeat}',
'.bgim::after{content:"";position:absolute;inset:0;background:rgba(12,8,5,.66)}',
'.num-big{position:absolute;left:22px;right:22px;top:calc(var(--safe) + 15%);z-index:3;font:400 118px/.92 var(--post);color:var(--ca);font-variant-numeric:tabular-nums;letter-spacing:.005em;text-shadow:0 6px 34px rgba(0,0,0,.45)}',
'.num-big.short{font-size:230px;line-height:.8}','.num-big.wide{font-size:88px}','.num-big small{display:block;font:700 15px/1.3 var(--sans);letter-spacing:.1em;text-transform:uppercase;color:#fff;margin-top:14px;text-shadow:none}',
'.fact-in{position:absolute;inset:0;z-index:5;display:flex;flex-direction:column;justify-content:flex-end;padding:var(--safe) 24px calc(92px + env(safe-area-inset-bottom))}',
'.wvb .fd .fact-in p{font:400 35px/1.1 var(--disp);color:#fff;text-wrap:balance;max-width:16ch}',
'.wvb .fd .fact-in p.sm{font-size:29px;max-width:19ch}',
'.wvb .fd .fact-in p em{font-style:normal;color:var(--ca)}',
'.fact-in .kick{margin-bottom:14px}',
'.poll{position:absolute;left:16px;right:16px;top:var(--safe);bottom:calc(74px + env(safe-area-inset-bottom));display:flex;flex-direction:column;justify-content:center;gap:14px;z-index:8}',
'.poll-card{background:#fffdf8;color:var(--ink);border-radius:24px;padding:20px 15px 15px;box-shadow:0 20px 54px rgba(0,0,0,.45);transform:rotate(-1.2deg)}',
'.poll-tag{display:block;width:max-content;margin:0 auto 12px;font:700 11px/1 var(--sans);letter-spacing:.14em;text-transform:uppercase;color:#fff;background:var(--ink);padding:7px 11px;border-radius:999px}',
'.wvb .fd .poll-card .q{font:700 19.5px/1.3 var(--sans);text-align:center;margin:0 6px 15px;text-wrap:balance}',
'.wvb .fd .opts{list-style:none;margin:0;padding:0;display:grid;grid-template-columns:1fr 1fr;gap:10px}',
'.wvb .fd .opts.one{grid-template-columns:1fr}',
'.wvb .fd .opts li{position:relative;margin:0;min-height:64px;border-radius:16px;background:#f1e9d8;padding:10px 12px;display:flex;align-items:center;gap:10px;font:600 16px/1.22 var(--sans);cursor:pointer;-webkit-tap-highlight-color:transparent;transition:transform .15s,background .3s,color .3s,opacity .3s;box-shadow:inset 0 0 0 2px transparent}',
'.opts li:active{transform:scale(.97)}',
'.opts li svg,.opts li .ic{width:38px;height:38px;flex:none;border-radius:50%;display:grid;place-items:center;font:700 14px/1 var(--sans);color:#fff}',
'.opts li small{display:block;font:500 12.5px/1.3 var(--sans);color:rgba(28,20,13,.78);margin-top:2px}',
'.poll.done .opts li{cursor:default;opacity:.5}',
'.poll.done .opts li.ok{opacity:1;background:var(--ok);color:#fff;animation:okPop .5s cubic-bezier(.3,1.6,.5,1)}',
'.poll.done .opts li.ok small{color:rgba(255,255,255,.88)}',
'.poll.done .opts li.mine{opacity:1;box-shadow:inset 0 0 0 2.5px var(--ink)}',
'.poll.done .opts li.ok.mine{box-shadow:inset 0 0 0 2.5px #fff,0 0 0 2.5px var(--ok)}',
'@keyframes okPop{50%{transform:scale(1.07)}}',
'.poll .why{display:none;font:500 18.5px/1.4 var(--sans);color:#fff;padding:0 6px;text-wrap:pretty;max-width:33ch}',
'.poll.done .why{display:block;animation:inUp .6s cubic-bezier(.16,1,.3,1) .35s both}',
'.poll .why b{display:block;font:700 12px/1.3 var(--sans);letter-spacing:.12em;text-transform:uppercase;color:var(--ca);margin-bottom:6px}',
'.poll-wait{text-align:center;font:600 13px/1 var(--sans);letter-spacing:.03em;color:rgba(255,255,255,.8);animation:hintP 1.9s ease-in-out infinite}',
'.poll.done .poll-wait{display:none}',
'@keyframes hintP{50%{opacity:.4}}',
'.cf{position:absolute;left:50%;top:44%;z-index:30;pointer-events:none}',
'.cf i{position:absolute;width:9px;height:14px;border-radius:2px;background:var(--c);animation:cfFly .95s cubic-bezier(.15,.7,.3,1) both}',
'@keyframes cfFly{from{opacity:1;transform:translate(0,0) rotate(0)}to{opacity:0;transform:translate(var(--x),var(--y)) rotate(var(--r))}}',
'.wipe{position:absolute;inset:0;--x:50%}',
'.wipe .wa,.wipe .wb{position:absolute;inset:0;background:center/cover no-repeat}',
'.wipe .wb{clip-path:inset(0 0 0 var(--x))}',
'.wipe .ln{position:absolute;top:0;bottom:36%;left:var(--x);width:48px;margin-left:-24px;z-index:9;cursor:ew-resize;touch-action:none}',
'.wipe .ln::before{content:"";position:absolute;left:23px;top:0;bottom:0;width:2.5px;background:#fff;box-shadow:0 0 10px rgba(0,0,0,.5)}',
'.wipe .kn{position:absolute;left:50%;top:60%;width:56px;height:56px;margin:-28px 0 0 -28px;border-radius:50%;background:#fff;box-shadow:0 6px 20px rgba(0,0,0,.45);display:grid;place-items:center;color:var(--ink);font:700 18px/1 var(--sans);letter-spacing:2px}',
'.wipe .tg{position:absolute;top:var(--safe);z-index:7;font:700 12px/1 var(--sans);letter-spacing:.1em;text-transform:uppercase;color:#fff;background:rgba(0,0,0,.6);padding:8px 11px;border-radius:999px}',
'.wipe .tg.l{left:16px}.wipe .tg.r{right:16px}',
'.cd.on .wipe.demo{animation:wpDemo 2.4s cubic-bezier(.45,0,.2,1) .8s both}',
'@keyframes wpDemo{0%{--x:50%}35%{--x:22%}75%{--x:76%}100%{--x:50%}}',
'.bd{position:absolute;left:0;right:0;top:var(--safe);bottom:0;padding:0 20px calc(22px + env(safe-area-inset-bottom));display:flex;flex-direction:column;z-index:2}',
'.wvb .fd .bd .q{font:700 19px/1.3 var(--sans);margin:0 2px;max-width:30ch}',
'.bd-glass{flex:1;min-height:140px;display:grid;place-items:center;padding:6px 0}',
'.bd-glass svg{height:100%;max-height:300px;width:auto;overflow:visible}',
'.bd-say{min-height:70px;font:500 17px/1.38 var(--sans);margin:0 2px 12px;max-width:33ch}',
'.bd-say b{display:block;font:700 11.5px/1.3 var(--sans);letter-spacing:.14em;text-transform:uppercase;color:var(--rust);margin-bottom:4px}',
'.bd-chips{display:grid;grid-template-columns:1fr 1fr 1fr;gap:9px}',
'.bd-chip{min-height:58px;border:0;border-radius:16px;background:#fffdf8;color:var(--ink);font:600 14.5px/1.15 var(--sans);padding:8px 6px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:5px;cursor:pointer;box-shadow:0 2px 0 rgba(28,20,13,.14),0 6px 16px rgba(60,40,10,.12);-webkit-tap-highlight-color:transparent;transition:opacity .3s,transform .15s}',
'.bd-chip i{width:20px;height:20px;border-radius:50%;display:block}',
'.bd-chip:active{transform:scale(.96)}',
'.bd-chip.used{opacity:.28;box-shadow:none;pointer-events:none}',
'.bd-chip.no{animation:bdNo .4s}',
'@keyframes bdNo{20%{transform:translateX(-7px)}40%{transform:translateX(7px)}60%{transform:translateX(-5px)}80%{transform:translateX(4px)}}',
'.bd-glass .lay{opacity:0;transition:opacity .5s,transform .7s cubic-bezier(.16,1,.3,1)}',
'.bd-glass .lay.in{opacity:1;transform:none!important}',
'.bd-go{display:none;margin-top:12px;min-height:54px;border:0;border-radius:999px;background:var(--ink);color:#fbf7ee;font:600 16.5px/1.2 var(--sans);cursor:pointer}',
'.cd.open .bd-go{display:block;animation:inUp .6s cubic-bezier(.16,1,.3,1) both}.cd.open .bd-chips{display:none}',
'.cd[data-t=build] .nx{display:none}',
'.end{position:absolute;left:0;right:0;top:var(--safe);bottom:0;padding:0 22px calc(30px + env(safe-area-inset-bottom));display:flex;flex-direction:column;justify-content:center;gap:15px;z-index:2}',
'.wvb .fd .end p{font:500 19px/1.42 var(--sans);max-width:32ch}',
'.wvb .fd .end p b{display:block;font:400 46px/.98 var(--post);text-transform:uppercase;margin-bottom:12px}',
'.end a.task{display:flex;gap:12px;align-items:center;padding:14px 16px;border-radius:16px;background:#fffdf8;color:var(--ink);text-decoration:none;box-shadow:0 2px 0 rgba(28,20,13,.12);min-height:56px}',
'.end a.task span{font:600 15.5px/1.3 var(--sans)}.end a.task small{display:block;font:500 13px/1.3 var(--sans);color:rgba(28,20,13,.76)}',
'.end a.task em{margin-left:auto;font:600 20px/1 var(--sans);font-style:normal;color:var(--rust)}',
'.end-bos{min-height:60px;border:0;border-radius:999px;background:var(--ink);color:#fbf7ee;font:600 17.5px/1.2 var(--sans);padding:16px 22px;cursor:pointer;margin-top:4px;-webkit-tap-highlight-color:transparent;box-shadow:0 10px 26px rgba(28,20,13,.3)}',
'.end-bos:active{transform:scale(.98)}',
'.end-row{display:flex;justify-content:center;gap:6px}','.end-pc{display:flex;flex-wrap:wrap;gap:8px;align-items:center}.end-pc small{flex:0 0 100%;font:700 11.5px/1.2 var(--sans);letter-spacing:.14em;text-transform:uppercase;color:var(--rust);margin-bottom:4px}.end-pc .pc{width:40px;height:40px;background:rgba(28,20,13,.08);box-shadow:inset 0 0 0 1.5px rgba(28,20,13,.14)}.end-pc .pc.got{background:#fff;box-shadow:0 3px 10px rgba(60,40,10,.18)}.end-pc .pc svg{width:26px;height:26px}',
'.end-src{min-height:44px;background:none;border:0;font:600 13.5px var(--sans);color:rgba(28,20,13,.76);text-decoration:underline;text-underline-offset:3px;cursor:pointer;padding:0 10px}',
'.cd[data-t=end] .nx{display:none}',
'.mapf{position:absolute;left:0;right:0;top:0;bottom:36%;overflow:hidden;background:#e9dfc9}',
'.mapf .cam{background:#e9dfc9}',
'.mapf svg{position:absolute;left:0;top:0;overflow:visible;transform-origin:0 0;transform:var(--t0);pointer-events:none}',
'.cd.on .mapf svg{transform:var(--t1);animation:camPan var(--pd,3.2s) cubic-bezier(.45,0,.15,1) var(--pw,.5s) both}.fd.rm .mapf svg{transform:var(--t1)}',
'.mapf svg .rt{fill:none;stroke:var(--rust);stroke-width:9;stroke-linecap:round;stroke-linejoin:round;stroke-dasharray:1;stroke-dashoffset:1}',
'.cd.on .mapf svg .rt{animation:rtDraw 3s cubic-bezier(.4,0,.3,1) .7s both}.fd.rm .mapf svg .rt{stroke-dashoffset:0}',
'.mapf svg .pin{fill:var(--rust);stroke:#fff;stroke-width:5;opacity:0}.cd.on .mapf svg .pin{opacity:1;animation:inFade .4s ease 3.6s both}.cd.on .mapf svg .pin.s{animation-delay:.6s}.fd.rm .mapf svg .pin{opacity:1}',
'.mapf svg .ship{display:none}',
'@supports (offset-path:path("M0 0L1 1")){.cd.on .mapf svg .ship{display:block;offset-rotate:0deg;animation:shipGo 3s cubic-bezier(.4,0,.3,1) .7s both}}',
'@keyframes shipGo{from{offset-distance:0%}to{offset-distance:100%}}',
'.mapf::after{content:"";position:absolute;left:0;right:0;bottom:0;height:90px;background:linear-gradient(rgba(23,17,12,0),#17110c);z-index:3}',
'@keyframes rtDraw{to{stroke-dashoffset:0}}',
'.cd[data-t=title]{background:var(--cc)}',
'.tt-no{position:absolute;right:14px;top:calc(var(--safe) + 2px);font:400 64px/.8 var(--post);color:transparent;-webkit-text-stroke:1.5px rgba(255,255,255,.6);z-index:1}',
'.tt{position:absolute;left:22px;right:22px;top:calc(var(--safe) + 12px);z-index:3}',
'.tt-wh{display:inline-block;font:700 12px/1 var(--sans);letter-spacing:.15em;text-transform:uppercase;color:var(--ink);background:var(--ca);padding:8px 11px;border-radius:999px}',
'.tt-nm{font:400 66px/.94 var(--post);text-transform:uppercase;color:#fff;margin:16px 0 0;letter-spacing:.005em;text-wrap:balance}',
'.tt-nm span{display:block;overflow:hidden}.tt-nm span i{display:block;font-style:normal}',
'.cd.on .tt-nm span i{animation:ttUp .8s cubic-bezier(.16,1,.3,1) calc(.25s + var(--i) * .12s) both}.fd:not(.rm) .cd:not(.on) .tt-nm span i{transform:translateY(105%)}',
'@keyframes ttUp{from{transform:translateY(105%)}}',
'.wvb .fd .tt-ts{font:500 20px/1.34 var(--sans);color:#fff;max-width:26ch;margin-top:16px;text-wrap:pretty}',
'.scene{position:absolute;left:0;right:0;bottom:calc(142px + env(safe-area-inset-bottom));height:38%;z-index:2;pointer-events:none}',
'.scene svg{display:block;width:100%;height:100%;overflow:visible}',
'.tt-pc{position:absolute;left:22px;right:22px;bottom:calc(74px + env(safe-area-inset-bottom));z-index:4;display:flex;flex-wrap:wrap;gap:7px;align-items:center}',
'.tt-pc small{flex:0 0 100%;font:700 10.5px/1.2 var(--sans);letter-spacing:.14em;text-transform:uppercase;color:rgba(255,255,255,.85);margin-bottom:2px}',
'.pc{width:34px;height:34px;border-radius:11px;background:rgba(0,0,0,.22);display:grid;place-items:center;flex:none;box-shadow:inset 0 0 0 1.5px rgba(255,255,255,.22)}',
'.pc svg{width:22px;height:22px;opacity:.0}.pc.got{background:#fffdf8;box-shadow:none}.pc.got svg{opacity:1}',
'.pc.now{box-shadow:inset 0 0 0 2px var(--ca);animation:pcPulse 1.6s ease-in-out infinite}',
'@keyframes pcPulse{50%{transform:scale(1.12)}}',
'.cd.on .s-bob{animation:sBob var(--sd,3s) ease-in-out infinite}.cd.on .s-sway{animation:sSway var(--sd,4s) ease-in-out infinite;transform-box:fill-box;transform-origin:50% 100%}.cd.on .s-drift{animation:sDrift var(--sd,7s) linear infinite}.cd.on .s-spin{animation:sSpin var(--sd,9s) linear infinite;transform-box:fill-box;transform-origin:50% 50%}.cd.on .s-flick{animation:sFlick var(--sd,.5s) ease-in-out infinite alternate;transform-box:fill-box;transform-origin:50% 100%}.cd.on .s-drip{animation:sDrip var(--sd,1.6s) cubic-bezier(.5,0,.9,.5) var(--dl,0s) infinite}.cd.on .s-in{animation:inPop .7s cubic-bezier(.3,1.55,.5,1) var(--dl,.4s) both;transform-box:fill-box;transform-origin:50% 100%}.fd:not(.rm) .cd:not(.on) .s-in{opacity:0}.cd.on .s-draw{stroke-dasharray:1;animation:rtDraw 1.4s ease var(--dl,.5s) both}.fd:not(.rm) .cd:not(.on) .s-draw{stroke-dasharray:1;stroke-dashoffset:1}',
'@keyframes sBob{50%{transform:translateY(-7px)}}@keyframes sSway{0%,100%{transform:rotate(-3deg)}50%{transform:rotate(3deg)}}@keyframes sDrift{from{transform:translateX(0)}to{transform:translateX(-80px)}}@keyframes sSpin{to{transform:rotate(360deg)}}@keyframes sFlick{from{transform:scale(1,.9)}to{transform:scale(.92,1.12)}}@keyframes sDrip{0%{transform:translateY(0);opacity:0}15%{opacity:1}80%{opacity:1}100%{transform:translateY(var(--fall,70px));opacity:0}}',
'.cd[data-t=collect]{background:var(--cdp)}',
'.co{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:16px;padding:var(--safe) 26px calc(86px + env(safe-area-inset-bottom));text-align:center;z-index:3}',
'.co-rays{position:absolute;left:50%;top:38%;width:560px;height:560px;margin:-280px 0 0 -280px;background:repeating-conic-gradient(from 0deg,rgba(255,255,255,.07) 0 9deg,transparent 9deg 18deg);border-radius:50%;-webkit-mask:radial-gradient(circle,#000 20%,transparent 68%);mask:radial-gradient(circle,#000 20%,transparent 68%);z-index:1}',
'.cd.on .co-rays{animation:sSpin 26s linear infinite}',
'.co-ic{width:124px;height:124px;border-radius:36px;background:#fffdf8;display:grid;place-items:center;box-shadow:0 22px 50px rgba(0,0,0,.45),0 0 0 6px var(--ca)}',
'.co-ic svg{width:78px;height:78px}',
'.co .kick{margin:6px 0 -6px}',
'.co-nm{font:400 52px/.95 var(--post);text-transform:uppercase;color:#fff}',
'.wvb .fd .co p{font:500 19px/1.4 var(--sans);color:#fff;max-width:28ch;text-wrap:pretty}',
'.co-row{display:flex;gap:7px;margin-top:4px}',
'.hud{position:sticky;top:0;height:0;z-index:40;pointer-events:none;transition:opacity .3s}',
'.hud.off{opacity:0}',
'.hud-in{position:absolute;left:70px;right:70px;top:calc(var(--top0) + 12px);height:44px;display:flex;flex-direction:column;justify-content:center;gap:6px;color:#fff}',
'.hud.lt .hud-in{color:var(--ink)}',
'.hud-l{display:flex;align-items:baseline;justify-content:center;gap:7px;white-space:nowrap;overflow:hidden;text-shadow:0 1px 4px rgba(0,0,0,.45)}.hud.lt .hud-l{text-shadow:none}',
'.hud-l b{font:700 13.5px/1.2 var(--sans)}.hud-l span{font:500 12.5px/1.2 var(--sans);opacity:.78}',
'.hud-bar{display:flex;gap:3px}',
'.hud-bar i{flex:1;height:3px;border-radius:2px;background:rgba(255,255,255,.3);overflow:hidden}',
'.hud-bar i b{display:block;height:100%;width:0;background:#fff;border-radius:2px;transition:width .45s cubic-bezier(.16,1,.3,1)}',
'.hud.lt .hud-bar i{background:rgba(28,20,13,.18)}.hud.lt .hud-bar i b{background:var(--ink)}',
'.ov{position:sticky;top:0;height:0;z-index:60}',
'.ov-in{position:absolute;left:0;right:0;top:0;height:var(--fh,100svh);overflow:hidden;pointer-events:none}',
'.sheet{position:absolute;left:0;right:0;bottom:0;background:#fbf7ee;color:var(--ink);border-radius:22px 22px 0 0;padding:14px 22px calc(26px + env(safe-area-inset-bottom));box-shadow:0 -16px 50px rgba(0,0,0,.4);transform:translateY(105%);transition:transform .34s cubic-bezier(.16,1,.3,1);max-height:72%;overflow-y:auto;-webkit-overflow-scrolling:touch;pointer-events:auto}',
'.sheet.on{transform:none}',
'.sheet::before{content:"";display:block;width:38px;height:4px;border-radius:2px;background:rgba(28,20,13,.2);margin:0 auto 14px}',
'.sheet .gk{font:700 11px/1.3 var(--sans);letter-spacing:.14em;text-transform:uppercase;color:var(--rust);margin:0 0 6px}',
'.sheet .gt{font:400 27px/1.12 var(--disp);margin:0 0 8px}',
'.sheet .gd{font:500 17px/1.45 var(--sans);margin:0}',
'.sheet h3{font:400 24px/1.15 var(--disp);margin:0 0 12px}',
'.sheet ol{padding-left:20px;margin:0}.sheet li,.sheet p{font:400 13.5px/1.5 var(--sans);margin:0 0 8px}.sheet a{color:inherit}',
'.shade{position:absolute;inset:0;background:rgba(0,0,0,.4);opacity:0;transition:opacity .3s}.shade.on{opacity:1;pointer-events:auto}',
'@media (max-height:700px){.wvb .fd .book .rows li{height:30px}.wvb .fd .book .rows li b{font-size:19px;line-height:30px}.wvb .fd .book .rows li span{font-size:14.5px;line-height:30px}.num-big.wide{font-size:76px}.book-gain{height:150px}.wvb .fd .lg .lead{font-size:16.5px}.wvb .fd .pk-grid li{min-height:42px;font-size:13.5px}.wvb .fd .pk-card .q{font-size:16.5px}.gs-read{font-size:50px}.pk .why{font-size:16px}.wvb .fd .opts li{min-height:52px;padding:7px 11px}.wvb .fd .poll-card .q{font-size:17.5px;margin-bottom:11px}.poll-card{padding:15px 13px 13px}.poll .why{font-size:16.5px}.poll{gap:10px}.cap{font-size:19px;padding-bottom:calc(74px + env(safe-area-inset-bottom))}.plate{bottom:50%}.wvb .fd .fact-in p{font-size:30px}.wvb .fd .fact-in p.sm{font-size:25px}.wvb .fd .cd blockquote{font-size:21px}.wvb .fd .cd blockquote.long{font-size:18.5px}.num-big{font-size:96px}.tt-nm{font-size:54px}.who-pic{width:104px;height:126px}.who-id b{font-size:29px}.who .rows li span{font-size:16px}.co-ic{width:100px;height:100px;border-radius:30px}.co-ic svg{width:62px;height:62px}.co-nm{font-size:44px}.scene{height:34%}}',
'@media (max-height:650px){.who{gap:8px}.who-pic{width:82px;height:98px}.wvb .fd .who .rows li{padding:7px 12px 8px}.who .rows li span{font-size:14.5px}.who-id b{font-size:25px}.note{font-size:15.5px}.wvb .fd .cd blockquote{font-size:19px}.wvb .fd .cd blockquote.long{font-size:17px}.wvb .fd .cd.qa .rows li span{font-size:15px}.wvb .fd .cd.qa .rows li{padding:7px 12px 8px}.wvb .fd .cd.qa .rows li b{font-size:15.5px}.cap{font-size:17.5px}.doc-body{gap:11px}}',
'.fd.rm *,.fd.rm *::before,.fd.rm *::after{animation-duration:1ms!important;animation-delay:0s!important;animation-iteration-count:1!important;transition:none!important}'
].join('\n');

var HOSTCSS='@property --x{syntax:"<percentage>";inherits:true;initial-value:50%}'
+'.reader.wvfd{scroll-snap-type:y mandatory}'
+'.reader.wvfd .lhero{height:100%;min-height:0;max-height:none;scroll-snap-align:start;scroll-snap-stop:always;padding-bottom:calc(96px + var(--bot,0px))}'
+'.reader.wvfd .lhost{min-height:0}'
+'.reader.wvfd .bbar,.reader.wvfd .bfloat{display:none!important}'
+'.reader.wvfd .lend{scroll-snap-align:end}'
+'.reader.wvfd.wvfd-lock{overflow:hidden!important}'
+'.reader.wvfd .prog{display:none}'
+'.wvfd-hook{font:500 18.5px/1.4 "Instrument Sans",-apple-system,sans-serif;color:#fff;max-width:31ch;margin:12px 0 0;text-wrap:pretty;text-shadow:0 1px 12px rgba(0,0,0,.5)}'
+'.wvfd-meta{font:600 12.5px/1.3 "Instrument Sans",-apple-system,sans-serif;letter-spacing:.04em;color:rgba(255,255,255,.82);margin:12px 0 0}'
+'.wvfd-cue{position:absolute!important;left:0;right:0;bottom:calc(18px + var(--bot,0px));display:flex;flex-direction:column;align-items:center;gap:4px;border:0;background:none;color:#fff;font:700 12px/1 "Instrument Sans",-apple-system,sans-serif;letter-spacing:.14em;text-transform:uppercase;cursor:pointer;min-height:56px;-webkit-tap-highlight-color:transparent}'
+'.wvfd-cue svg{width:26px;height:26px;animation:wvfdBob 1.4s ease-in-out infinite}'
+'.wvfd-cue.go{flex-direction:row;justify-content:center;gap:10px;left:20px;right:20px;bottom:calc(22px + var(--bot,0px));background:#fff;color:#1c140d;border-radius:999px;letter-spacing:.02em;text-transform:none;font-size:16px;font-weight:600}'
+'.wvfd-cue.go svg{animation:none;width:20px;height:20px}'
+'@keyframes wvfdBob{50%{transform:translateY(-6px)}}'
+'@media (prefers-reduced-motion:reduce){.wvfd-cue svg{animation:none}}';

var CHEV='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 9.5l6 6 6-6" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg>';
var CHEVUP='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 14.5l6-6 6 6" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg>';

function view(k,iw,ih,fw,fh,cy){var s0=Math.max(fw/iw,fh/ih),s=s0*k[2],tx=cl(fw/2-k[0]*iw*s,fw-iw*s,0),ty=cl(fh*(cy||.42)-k[1]*ih*s,fh-ih*s,0);if(iw*s<fw)tx=(fw-iw*s)/2;if(ih*s<fh)ty=(fh-ih*s)/2;return {s:s,tx:tx,ty:ty}}
function tf(v){return 'translate3d('+v.tx.toFixed(1)+'px,'+v.ty.toFixed(1)+'px,0) scale('+v.s.toFixed(4)+')'}
function camHTML(f,eager){return '<div class="cam art"><img alt="'+esc(f.dataset.alt||'')+'" src="'+f.dataset.img+'" width="'+f.dataset.w+'" height="'+f.dataset.h+'" draggable="false"'+(eager?'':' loading="lazy"')+' decoding="async"><div class="spot"></div></div>'}
function camSet(f,cam){var img=$(cam,'img'),iw=+f.dataset.w,ih=+f.dataset.h,fw=cam.clientWidth,fh=cam.clientHeight;if(!fw||!fh)return;
 var K=(f.dataset.k||'.5,.5,1').split(';').map(function(x){return x.split(',').map(Number)}),a=view(K[0],iw,ih,fw,fh,+f.dataset.cy),b=view(K[K.length-1],iw,ih,fw,fh,+f.dataset.cy);
 img.style.width=iw+'px';img.style.height=ih+'px';var host=cam,sv=$(cam.parentNode,'svg[data-over]');if(sv){sv.setAttribute('width',iw);sv.setAttribute('height',ih);sv.style.setProperty('--t0',tf(a));sv.style.setProperty('--t1',tf(b))}
 host.style.setProperty('--t0',tf(a));host.style.setProperty('--t1',tf(b));
 var kb=K[K.length-1],sp=$(cam,'.spot');if(kb[3]&&sp){var r=kb[3]*iw*b.s;sp.style.setProperty('--sp','radial-gradient(circle '+Math.round(r*1.2)+'px at '+Math.round(b.tx+kb[0]*iw*b.s)+'px '+Math.round(b.ty+kb[1]*ih*b.s)+'px,rgba(0,0,0,0) 0,rgba(0,0,0,0) 62%,rgba(8,6,4,.74) 100%)')}
 if(f.dataset.pd){host.style.setProperty('--pd',f.dataset.pd);if(sv)sv.style.setProperty('--pd',f.dataset.pd)}
 $$(f,'.tagp').forEach(function(t){var p=t.dataset.at.split(',').map(Number);t.style.left=cl(b.tx+p[0]*iw*b.s,70,fw-70)+'px';t.style.top=(b.ty+p[1]*ih*b.s)+'px';t.style.transform='translate(-50%,-150%)'})}

var B={};
function capOf(f,d0){var p=$$(f,':scope > p'),end=d0||.5;p.forEach(function(x){x.classList.add('cap');var k=f.dataset.kick?'<i class="kick a" data-in="fade" style="--d:'+(end-.2).toFixed(2)+'s;font-style:normal">'+esc(f.dataset.kick)+'</i>':'';x.innerHTML='<span>'+x.innerHTML+'</span>';end=split($(x,'span'),end,.04);if(k)$(x,'span').insertAdjacentHTML('beforebegin',k)});return end}
function tags(f){if(!f.dataset.tag)return;f.dataset.tag.split(';').forEach(function(s,i){var a=s.split('|'),t=h('div','tagp',esc(a[1]));t.dataset.at=a[0];A(t,'pop',2.6+i*.5);f.appendChild(t)})}
B.pan=function(f,i){f.insertAdjacentHTML('afterbegin',camHTML(f,i<4));var e=capOf(f,.7);tags(f);if(f.dataset.por){var a=f.dataset.por.split('|'),p=h('div','por','<img alt="" src="'+a[0]+'"><b>'+esc(a[1])+'</b>');A(p,'right',1.1);f.appendChild(p)}return e};
B.plate=function(f){f.insertAdjacentHTML('afterbegin','<div class="gr art"></div><div class="plate"'+(f.dataset.rot?' style="--rot:'+f.dataset.rot+'"':'')+'><img class="a" style="--d:.15s;--fx:'+(f.dataset.from==='left'?'-120%':'120%')+';--fr:'+(f.dataset.from==='left'?'-14deg':'14deg')+'" alt="'+esc(f.dataset.alt||'')+'" src="'+f.dataset.img+'" loading="lazy" decoding="async" draggable="false"></div>');return capOf(f,.8)};
var STAR='<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2l2.9 6.3 6.9.8-5.1 4.7 1.4 6.8L12 17.2 5.900 20.600l1.400-6.800L2.200 9.100l6.900-.8z"/></svg>';
B.doc=function(f){var kids=[].slice.call(f.children),body=h('div','doc-body'),t=.55;if(f.dataset.turn){f.classList.add(f.dataset.turn);body.appendChild(A(h('div','turn',esc(f.dataset.who||'')+(f.dataset.step?' <i>'+esc(f.dataset.step)+'</i>':'')),f.dataset.turn==='reply'?'right':'left',.3))}if(f.dataset.src){body.appendChild(A(h('div','src',esc(f.dataset.src)),'fade',.4))}
 kids.forEach(function(k){if(k.tagName==='BLOCKQUOTE'){if(words(k)>34)k.classList.add('long');t=split(k,t,.05);f.style.setProperty('--md',(t+.1).toFixed(2)+'s');t+=.5}else if(k.tagName==='P'){if(k.classList.contains('sig')){A(k,'write',t);t+=.5}else if(k.classList.contains('badge')){k.innerHTML=STAR+'<span>'+k.innerHTML+'</span>';A(k,'pop',t);t+=.6}else{k.classList.add('note');A(k,'up',t);t+=.4}}body.appendChild(k)});
 if(f.dataset.img){var w=h('div','doc-win',camHTML(f));A(w,'drop',.05,.9);if(f.dataset.dh)f.style.setProperty('--dh',f.dataset.dh);if(f.dataset.fit)f.classList.add('fitw');f.appendChild(w)}else f.classList.add('noscan');f.appendChild(body);f.classList.add('paper','light');return t};
B.list=function(f){var w=h('div','li-wrap'),rows=$(f,'.rows'),t=.2,paper=f.classList.contains('paper');
 if(!paper)f.insertAdjacentHTML('afterbegin','<div class="gr art"></div>');
 [].slice.call(f.children).forEach(function(k){if(k.classList.contains('gr'))return;if(k.tagName==='P'){if(k.classList.contains('lead')){A(k,'up',t);t+=.5}else k.classList.add('note')}w.appendChild(k)});
 if(rows)[].forEach.call(rows.children,function(li,i){A(li,i%2?'right':'left',t,.6);t+=(paper?.32:.45)});
 if(f.dataset.stamp){var a2=f.dataset.stamp.split('|'),st=h('div','stamp','<small>'+esc(a2[0])+'</small>'+esc(a2[1]));A(st,'stamp',t+.3);rows.insertAdjacentElement('afterend',st);w.style.setProperty('--hit',(t+.62).toFixed(2)+'s');t+=.8}
 $$(w,'.note').forEach(function(n){A(n,'up',t);t+=.4});f.appendChild(w);if(paper)f.classList.add('light');return t};
B.who=function(f){var w=h('div','who'),rows=$(f,'.rows'),t=1.0;f.insertAdjacentHTML('afterbegin','<div class="gr art"></div>');
 var top=h('div','who-top','<div class="who-pic" style="background-image:url('+f.dataset.img+');background-position:'+(f.dataset.pos||'50% 25%')+(f.dataset.size?';background-size:'+f.dataset.size:'')+'"></div><div class="who-id"></div>');var id=$(top,'.who-id'),r0=$(f,':scope > .role'),n0=$(f,':scope > h3'),m0=$(f,':scope > .meta');if(r0){id.appendChild(h('i','',r0.innerHTML));r0.parentNode.removeChild(r0)}if(n0){id.appendChild(h('b','',n0.innerHTML));n0.parentNode.removeChild(n0)}if(m0){id.appendChild(h('small','',m0.innerHTML));m0.parentNode.removeChild(m0)}
 A($(top,'.who-pic'),'left',.1,.8);A($(top,'.who-id i'),'pop',.5);A($(top,'.who-id b'),'right',.6,.7);if($(top,'.who-id small'))A($(top,'.who-id small'),'fade',.95);w.appendChild(top);
 if(rows){[].forEach.call(rows.children,function(li){A(li,'flip',t,.6);t+=.4});w.appendChild(rows)}
 $$(f,':scope > p').forEach(function(p){p.classList.add('note');p.style.color='rgba(255,255,255,.88)';A(p,'up',t);t+=.4;w.appendChild(p)});f.appendChild(w);return t};

B.ledger=function(f){var w=h('div','lg'),lead=$(f,'.lead'),rows=$(f,'.rows'),gain=$(f,'.gain'),t=.3;f.insertAdjacentHTML('afterbegin','<div class="gr art"></div>');
 if(lead){A(lead,'up',t);w.appendChild(lead);t+=.7}
 var book=h('div','book','<div class="book-t"></div><div class="book-g"><div class="book-c"><h4>Loss</h4></div><div class="book-c"><h4>Gain</h4><div class="book-gain"></div></div></div>');$(book,'.book-t').textContent=f.dataset.title||'';A(book,'drop',t,1);t+=.9;
 $(book,'.book-c').appendChild(rows);[].forEach.call(rows.children,function(li){A(li,'write',t);t+=.42});
 t+=.5;var g=h('span','',gain?gain.innerHTML:'');$(book,'.book-gain').appendChild(A(g,'write',t,.9));if(gain)gain.parentNode.removeChild(gain);t+=1;
 w.appendChild(book);$$(f,':scope > p').forEach(function(p2){p2.classList.add('note');A(p2,'up',t);t+=.4;w.appendChild(p2)});f.appendChild(w);return t};
B.pick=function(f){var w=h('div','pk'),card=h('div','pk-card'),q=$(f,'.q'),ul=$(f,'.opts'),why=$(f,'.why'),n=+f.dataset.n||$$(ul,'li[data-ok]').length;card.appendChild(q);card.appendChild(h('span','pk-n','Pick '+n));ul.className='pk-grid';card.appendChild(ul);
 var go=h('button','pk-go','Check');go.type='button';go.disabled=true;card.appendChild(go);A(card,'flip',.15,.7);w.appendChild(card);why.insertAdjacentHTML('afterbegin','<b></b>');w.appendChild(why);
 f.insertAdjacentHTML('afterbegin',f.dataset.img?'<div class="bgim art" style="background-image:url('+f.dataset.img+');background-position:'+(f.dataset.pos||'center')+'"></div>':'<div class="gr art"></div>');f.appendChild(w);
 $$(ul,'li').forEach(function(li,i){li.setAttribute('role','button');li.setAttribute('tabindex','0');A(li,'pop',.5+i*.05,.5)});f.classList.add('gate');return 1.4};
B.guess=function(f){var w=h('div','pk'),card=h('div','pk-card'),q=$(f,'.q'),why=$(f,'.why'),mx=+f.dataset.max,mn=+f.dataset.min||0,per=+f.dataset.per||10,cells='';if(!f.dataset.plain)for(var i=0;i<Math.round(mx/per);i++)cells+='<i></i>';
 card.appendChild(q);card.insertAdjacentHTML('beforeend','<div class="gs-read"><span></span><small>'+esc(f.dataset.unit||'')+'</small></div><div class="gs-ice">'+cells+'</div><input class="gs-r" type="range" min="'+mn+'" max="'+mx+'" step="'+(f.dataset.step||per)+'" value="'+(f.dataset.start||Math.round(mx/2))+'" aria-label="Your guess"><div class="gs-ends"><span>'+esc(f.dataset.lo||mn)+'</span><span>'+esc(f.dataset.hi||mx)+'</span></div>');
 var go=h('button','pk-go','Lock it in');go.type='button';card.appendChild(go);A(card,'flip',.15,.7);w.appendChild(card);why.insertAdjacentHTML('afterbegin','<b></b>');w.appendChild(why);
 f.insertAdjacentHTML('afterbegin',f.dataset.img?'<div class="bgim art" style="background-image:url('+f.dataset.img+');background-position:'+(f.dataset.pos||'center')+'"></div>':'<div class="gr art"></div>');f.appendChild(w);f.classList.add('gate');return 1.2};
B.clip=function(f){if(f.dataset.fit==='wide'){f.insertAdjacentHTML('afterbegin','<div class="gr art"></div><div class="clipw a" data-in="drop" style="--d:.1s"><video muted loop playsinline preload="metadata" poster="'+(f.dataset.poster||'')+'" src="'+f.dataset.src+'"'+(RM?' controls':'')+'></video>'+(f.dataset.credit?'<span>'+esc(f.dataset.credit)+'</span>':'')+'</div>');return capOf(f,.9)}f.insertAdjacentHTML('afterbegin','<div class="clip art"><video muted loop playsinline preload="metadata" poster="'+(f.dataset.poster||'')+'" src="'+f.dataset.src+'"'+(RM?' controls':'')+'></video></div>');return capOf(f,.8)};
B.num=function(f){var e=capOf(f,1.6),big=h('div','num-big'+(String(f.dataset.to).length<3?' short':String(f.dataset.to).length>5?' wide':''),'<span></span>'+(f.dataset.unit?'<small>'+esc(f.dataset.unit)+'</small>':''));A(big,'pop',.15);if(f.dataset.sub){var sb=h('div','','<span class="num-sub">'+esc(f.dataset.sub)+'</span>');A(sb,'pop',+(f.dataset.dur||1500)/1000+.9);big.appendChild(sb)}f.insertBefore(big,f.firstChild);f.insertAdjacentHTML('afterbegin',f.dataset.img?'<div class="bgim art" style="background-image:url('+f.dataset.img+')"></div>':'<div class="gr art"></div>');return e};
B.fact=function(f){var w=h('div','fact-in'),t=.35;if(f.dataset.kick)w.appendChild(A(h('i','kick',esc(f.dataset.kick)),'fade',.15)).style.fontStyle='normal';[].slice.call(f.children).forEach(function(k){if(words(k)>19)k.classList.add('sm');t=split(k,t,.07)+.2;w.appendChild(k)});
 f.insertAdjacentHTML('afterbegin',f.dataset.img?'<div class="bgim art" style="background-image:url('+f.dataset.img+');background-position:'+(f.dataset.pos||'center')+'"></div>':'<div class="gr art"></div>');f.appendChild(w);return t};
B.poll=function(f){var w=h('div','poll'),card=h('div','poll-card');card.appendChild(h('span','poll-tag',esc(f.dataset.tagline||'Your guess')));card.appendChild($(f,'.q'));card.appendChild($(f,'.opts'));A(card,'flip',.15,.7);w.appendChild(card);w.appendChild(h('div','poll-wait a','Pick one to keep going'));$(w,'.poll-wait').style.setProperty('--d','1.6s');$(w,'.poll-wait').setAttribute('data-in','fade');var why=$(f,'.why');why.insertAdjacentHTML('afterbegin','<b></b>');w.appendChild(why);
 f.insertAdjacentHTML('afterbegin',f.dataset.img?'<div class="bgim art" style="background-image:url('+f.dataset.img+');background-position:'+(f.dataset.pos||'center')+'"></div>':'<div class="gr art"></div>');f.appendChild(w);
 $$(f,'.opts li').forEach(function(li,i){li.setAttribute('role','button');li.setAttribute('tabindex','0');A(li,i%2?'right':'left',.55+i*.1,.55)});f.classList.add('gate');return 1.4};
B.wipe=function(f){f.insertAdjacentHTML('afterbegin','<div class="wipe demo"><div class="wa" style="background-image:url('+f.dataset.a+');background-position:'+(f.dataset.apos||'center')+'"></div><div class="wb" style="background-image:url('+f.dataset.b+');background-position:'+(f.dataset.bpos||'center')+'"></div><span class="tg l">'+esc(f.dataset.la)+'</span><span class="tg r">'+esc(f.dataset.lb)+'</span><div class="ln" role="slider" aria-label="Compare" tabindex="0"><div class="kn">‹›</div></div></div>');return capOf(f,.6)+1.6};
B.build=function(f){var w=h('div','bd'),q=$(f,'.q'),ol=$(f,'ol'),why=$(f,'.why');w.appendChild(q);w.appendChild(h('div','bd-glass',GLASS));w.appendChild(h('p','bd-say',''));var chips=h('div','bd-chips');
 var items=$$(ol,'li');items.slice().sort(function(a,b){return (+a.dataset.ord)-(+b.dataset.ord)}).forEach(function(li){var c=h('button','bd-chip','<i style="background:'+(li.dataset.c||'#999')+'"></i>'+esc($(li,'b').textContent));c.type='button';c._li=li;chips.appendChild(c)});
 w.appendChild(chips);var go=h('button','bd-go','Keep going');go.type='button';go.setAttribute('data-act','next');w.appendChild(go);ol.hidden=true;why.hidden=true;w.appendChild(ol);w.appendChild(why);f.appendChild(w);f.classList.add('paper','light','gate');return 0};
B.end=function(f){var w=h('div','end');w.appendChild(A(h('div','end-pc',''),'pop',.05));[].slice.call(f.children).forEach(function(k,i){A(k,'up',.2+i*.25);w.appendChild(k)});var b=h('button','end-bos','Tell Boswell what you remember');b.type='button';b.setAttribute('data-act','boswell');A(b,'pop',.9);w.appendChild(b);
 var row=h('div','end-row','<button class="end-src" type="button" data-act="sources">Sources and credits</button><button class="end-src" type="button" data-act="again">Start again</button>');A(row,'fade',1.2);w.appendChild(row);f.appendChild(w);f.classList.add('paper','light');return 0};
B.map=function(f){var pts=f.dataset.route.split(' ').map(function(p){return p.split(',').map(Number)}),iw=+f.dataset.w,ih=+f.dataset.h,d=pts.map(function(p,i){return (i?'L':'M')+(p[0]*iw).toFixed(0)+' '+(p[1]*ih).toFixed(0)}).join(' '),a=pts[0],z=pts[pts.length-1];
 f.insertAdjacentHTML('afterbegin','<div class="mapf">'+camHTML(f)+'<svg data-over viewBox="0 0 '+iw+' '+ih+'"><path class="rt" pathLength="1" d="'+d+'"/><circle class="pin s" r="15" cx="'+(a[0]*iw)+'" cy="'+(a[1]*ih)+'"/><circle class="pin" r="17" cx="'+(z[0]*iw)+'" cy="'+(z[1]*ih)+'"/><g class="ship" style="offset-path:path(\''+d+'\')"><circle r="34" fill="#fffdf8" stroke="#1c140d" stroke-width="5"/><path d="M-19 6h38l-7 13h-24zM-2 -22v25h-15zM2 -16v19h13z" fill="#1c140d"/></g></svg></div>');$(f,'.mapf .cam').classList.remove('art');return capOf(f,1)};
B.title=function(f){var n=+f.dataset.n,nm=f.dataset.name.split(' '),lines=[],cur='';nm.forEach(function(w2){if((cur+' '+w2).trim().length>9&&cur){lines.push(cur);cur=w2}else cur=(cur+' '+w2).trim()});if(cur)lines.push(cur);
 f.innerHTML='<div class="tt-no a" data-in="right" style="--d:.05s;--du:.9s">'+pad(n)+'</div><div class="tt"><span class="tt-wh a" data-in="pop" style="--d:.15s">'+esc(f.dataset.when||'')+'</span><h2 class="tt-nm">'+lines.map(function(l,i){return '<span><i style="--i:'+i+'">'+esc(l)+'</i></span>'}).join('')+'</h2>'+(f.dataset.tease?'<p class="tt-ts"></p>':'')+'</div>'+(f._scene?'<div class="scene"></div>':'')+'<div class="tt-pc a" data-in="up" style="--d:1.4s"></div>';
 if(f.dataset.tease){$(f,'.tt-ts').textContent=f.dataset.tease;split($(f,'.tt-ts'),.7+lines.length*.12,.05)}if(f._scene)$(f,'.scene').appendChild(f._scene);return 1.6};
B.collect=function(f){var w=h('div','co'),p=$(f,':scope > p');f.insertAdjacentHTML('afterbegin','<div class="co-rays"></div>');
 w.appendChild(A(h('div','co-ic',''),'pop',.25,.8));w.appendChild(A(h('i','kick',''),'fade',.7)).style.fontStyle='normal';w.appendChild(A(h('div','co-nm',''),'up',.8));if(p){split(p,1.2,.045);w.appendChild(p)}w.appendChild(A(h('div','co-row',''),'up',1.9));f.appendChild(w);return 2.6};

var GLASS='<svg viewBox="0 0 220 240" aria-hidden="true"><defs><clipPath id="gcl"><path d="M38 34 L52 214 Q53 222 62 222 L158 222 Q167 222 168 214 L182 34 Z"/></clipPath></defs>'
+'<g clip-path="url(#gcl)">'
+'<rect class="lay" data-l="whiskey" x="30" y="92" width="160" height="134" fill="#c9792a" opacity=".92" style="transform:translateY(90px)"/>'
+'<rect class="lay" data-l="water" x="30" y="196" width="160" height="30" fill="#bfd9e6" style="transform:translateY(20px)"/>'
+'<g class="lay" data-l="ice" style="transform:translateY(-70px)"><rect x="62" y="104" width="52" height="52" rx="9" fill="#fff" opacity=".78" transform="rotate(-8 88 130)"/><rect x="112" y="118" width="50" height="50" rx="9" fill="#fff" opacity=".7" transform="rotate(10 137 143)"/><rect x="78" y="158" width="54" height="50" rx="9" fill="#fff" opacity=".74" transform="rotate(4 105 183)"/></g>'
+'<rect class="lay" data-l="cube" x="97" y="194" width="26" height="26" rx="4" fill="#fffaf0" stroke="#d9cdb4" stroke-width="2" style="transform:translateY(-120px)"/>'
+'<g class="lay" data-l="bitters" style="transform:translateY(-60px)"><rect x="97" y="194" width="26" height="26" rx="4" fill="#8a2f18" opacity=".8"/><circle cx="92" cy="186" r="3.4" fill="#8a2f18"/><circle cx="128" cy="180" r="2.8" fill="#8a2f18"/></g>'
+'</g>'
+'<path d="M38 34 L52 214 Q53 222 62 222 L158 222 Q167 222 168 214 L182 34" fill="none" stroke="#1c140d" stroke-width="3.5" stroke-linejoin="round" stroke-linecap="round"/><path d="M52 214 Q53 222 62 222 L158 222 Q167 222 168 214 L170 196 L50 196 Z" fill="#1c140d" opacity=".1"/>'
+'<path class="lay" data-l="peel" d="M118 30 C150 6 196 22 204 50 C176 40 150 44 128 62 Z" fill="#f08a1c" stroke="#c9650a" stroke-width="2" style="transform:translate(30px,-40px) rotate(12deg)"/></svg>';

function startFeed(root,sc){var fd=$(root,'[data-feed]');if(!fd||fd._wv)return;fd._wv=1;
 var slug=fd.dataset.slug,L=sc&&sc._l,KEY='wv.feed.'+slug,st={at:0,max:0,poll:{},got:{},built:0,done:0};
 try{var j=JSON.parse(localStorage.getItem(KEY)||'null');if(j&&j.poll)st=j}catch(e){}
 function save(){try{localStorage.setItem(KEY,JSON.stringify(st))}catch(e){}}
 var css=document.createElement('style');css.textContent=CSS;root.appendChild(css);
 if(!document.getElementById('wvfd-css')){var hc=document.createElement('style');hc.id='wvfd-css';hc.textContent=HOSTCSS;document.head.appendChild(hc)}
 var rm=RM;if(rm)fd.classList.add('rm');if(sc)sc.classList.add('wvfd');
 var PCS=$$(fd,'.pieces > li').map(function(li){return {id:li.dataset.id,label:li.dataset.label,svg:li.innerHTML}});
 function pcRow(nowId){return PCS.map(function(p){return '<span class="pc'+(st.got[p.id]?' got':'')+(p.id===nowId?' now':'')+'" title="'+esc(p.label)+'">'+p.svg+'</span>'}).join('')}
 var chs=$$(fd,'section.ch'),cards=[];
 chs.forEach(function(c,ci){var col=(c.dataset.c||'#c2571f,#1a120b,#f0b03f').split(','),sceneEl=$(c,':scope > .scene svg');
  var t=h('div','fr');t.dataset.t='title';t.dataset.n=ci+1;t.dataset.name=c.dataset.name;t.dataset.when=c.dataset.when||'';var ts=$(c,':scope > .tease');if(ts)t.dataset.tease=ts.textContent;if(c.dataset.next)t.dataset.next=c.dataset.next;if(sceneEl){t._scene=sceneEl;var so=$(c,':scope > .scene');so.parentNode.removeChild(so)}
  c.insertBefore(t,c.firstChild);
  $$(c,':scope > .fr').forEach(function(f,k){f.classList.add('cd');f._ci=ci;f._k=k;f.style.setProperty('--cc',col[0]);f.style.setProperty('--cdp',col[1]);f.style.setProperty('--ca',col[2]||'#f0b03f');cards.push(f)});c._n=$$(c,':scope > .fr').length});
 cards.forEach(function(f,i){f._i=i;var t=f.dataset.t||'pan',end=2;try{end=(B[t]||B.pan)(f,i)||0}catch(e){console.error('feed card',t,e)}
  f.style.setProperty('--nd',(cl(end+.5,1.2,6)).toFixed(2)+'s');
  if(t!=='title'&&t!=='collect'){var cv=h('div','cv');cv.setAttribute('data-v',i%4);f.appendChild(cv)}
  var nx=h('button','nx'+(f.dataset.next?'':' bare'),(f.dataset.next?'<span>'+esc(f.dataset.next)+'</span>':'')+CHEV);nx.type='button';nx.setAttribute('data-act','next');nx.setAttribute('aria-label',f.dataset.next||'Next card');f.appendChild(nx)});
 var N=cards.length;
 var hud=h('div','hud off','<div class="hud-in"><div class="hud-l"><b></b><span></span></div><div class="hud-bar">'+chs.map(function(){return '<i><b></b></i>'}).join('')+'</div></div>');
 var ov=h('div','ov','<div class="ov-in"><div class="shade"></div><div class="sheet" role="dialog"></div></div>');
 fd.insertBefore(ov,fd.firstChild);fd.insertBefore(hud,fd.firstChild);
 var sheet=$(ov,'.sheet'),shade=$(ov,'.shade'),bars=$$(hud,'.hud-bar i b');
 var hero=sc&&$(sc,'.lhero'),cue=null,head=$(fd,'.fd-head');
 if(hero&&!$(hero,'.wvfd-cue')){var dk=head&&$(head,'.fd-deck');if(dk){var hk=h('p','wvfd-hook');hk.innerHTML=dk.innerHTML;hero.appendChild(hk)}
  var mt=h('p','wvfd-meta',chs.length+' chapters · about '+Math.max(3,Math.round(cards.length/6))+' minutes'+(PCS.length?' · '+PCS.length+' pieces to collect':''));hero.appendChild(mt);var om=$(hero,'.meta');if(om)om.style.display='none';
  cue=h('button','wvfd-cue','');cue.type='button';hero.appendChild(cue);cue.addEventListener('click',function(){go(st.at>0&&!st.done?st.at:0,st.at>0&&!st.done)})}
 function paintCue(){if(!cue)return;var back=st.at>0&&!st.done;cue.className='wvfd-cue'+(back?' go':'');cue.innerHTML=back?'<span>Continue: '+esc(chs[cards[st.at]._ci].dataset.name)+'</span>'+CHEV:CHEVUP+'<span>Swipe up</span>'}

 var cur=-1,fh=0,streak=0;
 function vis(){return cards.filter(function(c){return !c.hidden})}
 function offTop(el){return el.getBoundingClientRect().top-sc.getBoundingClientRect().top+sc.scrollTop}
 function size(){if(!sc)return;fh=sc.clientHeight;fd.style.setProperty('--fh',fh+'px');cards.forEach(function(f){if(!f.hidden)cams(f)})}
 function cams(f){if(f.dataset.fit){var w=(f.clientWidth||sc.clientWidth)-36;f.style.setProperty('--dh',Math.round(w*(+f.dataset.h)/(+f.dataset.w))+'px')}$$(f,'.cam').forEach(function(c){camSet(f,c)})}
 function gateOpen(f){var t=f.dataset.t;return (t==='poll'||t==='pick'||t==='guess')?!!f._ans:t==='build'?!!f._done:true}
 function unlock(){var shut=false;cards.forEach(function(f){var was=f.hidden;f.hidden=shut;if(was&&!shut)cams(f);if(f.classList.contains('gate')){f.classList.toggle('open',gateOpen(f));if(!gateOpen(f))shut=true}});var le=sc&&$(sc,'#le');if(le)le.hidden=shut||!st.done}
 function go(i,jump){i=cl(i,0,N-1);var f=cards[i];if(!f||f.hidden)return false;sc.scrollTo({top:offTop(f),behavior:(jump||rm)?'auto':'smooth'});if(jump||rm)setTimeout(track,60);return true}
 function next(){if(cur<0)return go(0);var f=cards[cur];if(f.classList.contains('gate')&&!gateOpen(f))return false;if(cur>=N-1){var le=$(sc,'#le');if(le&&!le.hidden)sc.scrollTo({top:sc.scrollHeight,behavior:rm?'auto':'smooth'});return false}return go(cur+1)}
 function prev(){if(cur<=0){sc.scrollTo({top:0,behavior:rm?'auto':'smooth'});return}go(cur-1)}

 function activate(i){if(i===cur)return;if(cur>=0&&cards[cur]){cards[cur].classList.remove('on');var ov0=$(cards[cur],'video');if(ov0){try{ov0.pause()}catch(e){}}}cur=i;
  if(i<0){hud.classList.add('off');paintCue();return}
  var f=cards[i],t=f.dataset.t||'pan',c=chs[f._ci];cams(f);f.classList.add('on');
  hud.classList.remove('off');hud.classList.toggle('lt',f.classList.contains('light'));$(hud,'.hud-l b').textContent=c.dataset.name;$(hud,'.hud-l span').textContent=c.dataset.when||'';
  bars.forEach(function(b,k){b.style.width=(k<f._ci?100:k>f._ci?0:Math.round((f._k+1)/c._n*100))+'%'});
  if(t==='title')$(f,'.tt-pc').innerHTML=PCS.length?'<small>The drink so far</small>'+pcRow():'';
  if(t==='end'&&PCS.length){var g=PCS.filter(function(x){return st.got[x.id]}).length;$(f,'.end-pc').innerHTML='<small>'+(g===PCS.length?'All '+g+' pieces collected':g+' of '+PCS.length+' pieces collected')+'</small>'+pcRow()}
  if(t==='num')count(f);if(t==='pick')pickInit(f);if(t==='guess')guessInit(f);if(t==='clip'){var vd=$(f,'video');if(vd&&!rm){try{vd.currentTime=0;var pr=vd.play();if(pr&&pr.catch)pr.catch(function(){})}catch(e){}}}if(t==='poll')pollInit(f);if(t==='build')buildInit(f);if(t==='wipe')wipeInit(f);if(t==='collect')collect(f);
  st.at=i;if(i>st.max)st.max=i;if(i===N-1&&!st.done){st.done=1;unlock()}save();progress()}
 var raf=0;
 function track(){raf=0;if(!sc||!fh)return;var v=vis();if(!v.length)return;var top0=offTop(v[0]),y=sc.scrollTop,k=Math.round((y-top0)/fh);
  if(y<top0-fh*.5){activate(-1);return}k=cl(k,0,v.length-1);if(Math.abs(y-(top0+k*fh))<fh*.42)activate(v[k]._i)}
 if(sc)sc.addEventListener('scroll',function(){if(!raf)raf=requestAnimationFrame(track)},{passive:true});

 var ts=null;if(sc){sc.addEventListener('touchstart',function(e){if(e.touches.length===1)ts={y:e.touches[0].clientY,x:e.touches[0].clientX,c:cur,t:e.target}},{passive:true});
  sc.addEventListener('touchend',function(e){if(!ts||!e.changedTouches.length)return;var dy=ts.y-e.changedTouches[0].clientY,dx=ts.x-e.changedTouches[0].clientX,c0=ts.c;ts=null;if(Math.abs(dy)<56||Math.abs(dx)>Math.abs(dy)||sheet.classList.contains('on'))return;
   setTimeout(function(){if(cur!==c0)return;var v=vis(),y=sc.scrollTop,t0=v.length?offTop(v[0]):0,at=c0<0?0:t0+v.indexOf(cards[c0])*fh;if(Math.abs(y-at)>fh*.5)return;if(dy>0)next();else prev()},140)},{passive:true})}
 function progress(){if(!L||typeof S==='undefined')return;try{var p=Math.min(.95,(st.max+1)/N*.95);if(st.done){if(L.state!=='read'&&typeof markRead==='function')markRead(L);S.prog[L.h]=1}else if(p>(S.prog[L.h]||0))S.prog[L.h]=p;if(window.WV&&WV.save)WV.save()}catch(e){}}
 function boswell(){try{closeSheet();if(typeof shut==='function')shut();if(typeof tell==='function'&&L)tell(L)}catch(e){console.error('feed boswell',e)}}

 function count(f){var sp=$(f,'.num-big span'),a=+f.dataset.from||0,b=+f.dataset.to,pre=f.dataset.pre||'',D=rm?0:+(f.dataset.dur||1500),t0=0;
  function fmt(v){return pre+Math.round(v).toLocaleString('en-US')}sp.textContent=fmt(D?a:b);if(!D)return;
  (function step(now){if(!f.classList.contains('on'))return;if(!t0)t0=now;var u=cl((now-t0-450)/D,0,1),e=1-Math.pow(1-u,3);sp.textContent=fmt(a+(b-a)*e);if(u<1)requestAnimationFrame(step);else{var bg=sp.parentNode;bg.classList.remove('land');void bg.offsetWidth;bg.classList.add('land')}})(performance.now())}
 function confetti(f){if(rm)return;var c=h('div','cf'),cols=['#f0b03f','#2f8f57','#b4391f','#fffdf8','#3f7fb0'];for(var i=0;i<22;i++){var a=Math.random()*6.283,d=90+Math.random()*150,e=h('i');e.style.cssText='--c:'+cols[i%5]+';--x:'+Math.round(Math.cos(a)*d)+'px;--y:'+Math.round(Math.sin(a)*d-60)+'px;--r:'+Math.round(Math.random()*720-360)+'deg;animation-delay:'+(Math.random()*.08).toFixed(2)+'s';c.appendChild(e)}f.appendChild(c);setTimeout(function(){if(c.parentNode)c.parentNode.removeChild(c)},1300)}
 function pollDone(f,k,quiet){var w=$(f,'.poll'),opts=$$(f,'.opts li'),id=f.dataset.poll;f._ans=1;w.classList.add('done');opts.forEach(function(o,i){o.classList.toggle('mine',i===k);o.classList.toggle('ok',o.hasAttribute('data-ok'));o.removeAttribute('tabindex');o.classList.remove('a');o.style.opacity=''});
  var ok=opts[k]&&opts[k].hasAttribute('data-ok'),lab=function(o){return (o.dataset.say||o.textContent).trim().replace(/\s+/g,' ')};
  if(!quiet){streak=ok?streak+1:0;st.poll[id]=k;save();if(ok){confetti(f);try{navigator.vibrate&&navigator.vibrate(12)}catch(e){}}}
  $(f,'.why b').textContent=ok?(streak>1?'You got it · '+streak+' in a row':'You got it'):'You picked '+lab(opts[k]).toLowerCase();
  f.classList.add('open');unlock()}
 function pollInit(f){if(f._pi)return;f._pi=1;var opts=$$(f,'.opts li');
  opts.forEach(function(o,i){function pick(e){e.stopPropagation();if(f._ans)return;pollDone(f,i)}o.addEventListener('click',pick);o.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();pick(e)}})})}

 function pickDone(f,sel,quiet){var w=$(f,'.pk'),opts=$$(f,'.pk-grid li'),hit=0,tot=0;f._ans=1;w.classList.add('done');opts.forEach(function(o,i){var on=sel.indexOf(i)>=0,ok=o.hasAttribute('data-ok');o.classList.toggle('sel',on);o.classList.toggle('ok',ok);o.removeAttribute('tabindex');o.classList.remove('a');if(ok){tot++;if(on)hit++}});
  if(!quiet){st.poll[f.dataset.poll]=sel;streak=hit===tot?streak+1:0;save();if(hit===tot){confetti(f);try{navigator.vibrate&&navigator.vibrate(12)}catch(e){}}}
  $(f,'.why b').textContent=hit===tot?'All '+tot+' right':'You found '+hit+' of '+tot;f.classList.add('open');unlock()}
 function pickInit(f){if(f._pi)return;f._pi=1;var opts=$$(f,'.pk-grid li'),n=+f.dataset.n||$$(f,'.pk-grid li[data-ok]').length,go=$(f,'.pk-go'),lab=$(f,'.pk-n');
  function paint(){var c=$$(f,'.pk-grid li.sel').length;go.disabled=c!==n;lab.textContent=c===n?'Ready':'Pick '+n+(c?' · '+(n-c)+' to go':'')}
  opts.forEach(function(o){function tg(e){e.stopPropagation();if(f._ans)return;if(!o.classList.contains('sel')&&$$(f,'.pk-grid li.sel').length>=n)return;o.classList.toggle('sel');paint()}o.addEventListener('click',tg);o.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();tg(e)}})});
  go.addEventListener('click',function(e){e.stopPropagation();if(f._ans||go.disabled)return;var sel=[];opts.forEach(function(o,i){if(o.classList.contains('sel'))sel.push(i)});pickDone(f,sel)})}
 function guessPaint(f,v,final){var per=+f.dataset.per||10,cells=$$(f,'.gs-ice i'),ans=+f.dataset.answer;$(f,'.gs-read span').textContent=v;cells.forEach(function(c,i){var on=(i+1)*per<=v;c.className=final?((i+1)*per<=ans?'on':'gone'):(on?'on':'')})}
 function guessDone(f,v,quiet){var ans=+f.dataset.answer,w=$(f,'.pk'),d=v-ans,tol=f.dataset.tol!=null?+f.dataset.tol:15;f._ans=1;w.classList.add('done');if(!quiet){st.poll[f.dataset.poll]=v;save()}
  var run=function(){guessPaint(f,ans,1);$(f,'.gs-read span').textContent=ans};if(quiet||rm)run();else{guessPaint(f,v);setTimeout(run,500)}
  $(f,'.why b').textContent='You said '+v+'. '+(d===0?'Exactly right.':Math.abs(d)<=tol?'Almost exactly right.':d<0?(f.dataset.under||'Higher than that.'):(f.dataset.over||'Lower than that.'));if(!quiet&&Math.abs(d)<=tol)confetti(f);f.classList.add('open');unlock()}
 function guessInit(f){if(f._gi)return;f._gi=1;var r=$(f,'.gs-r');guessPaint(f,+r.value);r.addEventListener('input',function(){if(!f._ans)guessPaint(f,+r.value)});['pointerdown','touchstart','click'].forEach(function(ev){r.addEventListener(ev,function(e){e.stopPropagation()},{passive:true})});
  $(f,'.pk-go').addEventListener('click',function(e){e.stopPropagation();if(!f._ans)guessDone(f,+r.value)})}
 function buildInit(f){if(f._bi)return;f._bi=1;var say=$(f,'.bd-say'),items=$$(f,'ol li'),chips=$$(f,'.bd-chip'),n=0;
  function fin(quiet){f._done=1;st.built=1;save();chips.forEach(function(x){x.disabled=true});f.classList.add('open');unlock();setTimeout(function(){say.innerHTML='<b>Done</b>'+$(f,'.why').innerHTML},(quiet||rm)?0:2200)}
  if(st.built){items.forEach(function(li){var l=$(f,'.lay[data-l="'+li.dataset.l+'"]');if(l)l.classList.add('in')});var cb=$(f,'.lay[data-l=cube]'),bt=$(f,'.lay[data-l=bitters]');if(cb)cb.style.opacity=0;if(bt)bt.style.opacity=0;chips.forEach(function(c){c.classList.add('used')});fin(1);return}
  say.innerHTML='<b>Step 1 of '+items.length+'</b>The glass is empty.';
  chips.forEach(function(c){c.addEventListener('click',function(e){e.stopPropagation();if(c.classList.contains('used')||f._done)return;
   if(c._li!==items[n]){c.classList.remove('no');void c.offsetWidth;c.classList.add('no');say.innerHTML='<b>Not yet</b>'+esc(items[n].dataset.hint||'Something else goes in first.');return}
   c.classList.add('used');var l=$(f,'.lay[data-l="'+c._li.dataset.l+'"]');if(l)l.classList.add('in');if(c._li.dataset.l==='water'){var cb=$(f,'.lay[data-l=cube]'),bt=$(f,'.lay[data-l=bitters]');setTimeout(function(){if(cb)cb.style.opacity=0;if(bt)bt.style.opacity=0;var wl=$(f,'.lay[data-l=water]');if(wl)wl.setAttribute('fill','#c98f5a')},rm?0:900)}
   n++;say.innerHTML='<b>'+esc($(c._li,'b').textContent)+'</b>'+$(c._li,'span').innerHTML;if(n>=items.length)fin()})})}
 function wipeInit(f){if(f._wi)return;f._wi=1;var w=$(f,'.wipe'),ln=$(f,'.ln'),drag=false;
  function set(x){var r=w.getBoundingClientRect();w.classList.remove('demo');w.style.setProperty('--x',cl((x-r.left)/r.width*100,6,94)+'%')}
  ln.addEventListener('pointerdown',function(e){e.stopPropagation();drag=true;try{ln.setPointerCapture(e.pointerId)}catch(_){}set(e.clientX)});
  ln.addEventListener('pointermove',function(e){if(drag){e.stopPropagation();set(e.clientX)}});
  function up(e){if(drag){e.stopPropagation();drag=false}}ln.addEventListener('pointerup',up);ln.addEventListener('pointercancel',up);
  ln.addEventListener('keydown',function(e){var x=parseFloat(getComputedStyle(w).getPropertyValue('--x'))||50;if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.stopPropagation();e.preventDefault();w.classList.remove('demo');w.style.setProperty('--x',cl(x+(e.key==='ArrowLeft'?-8:8),6,94)+'%')}})}
 function collect(f){var id=f.dataset.piece,p=PCS.filter(function(x){return x.id===id})[0];if(!p)return;var fresh=!st.got[id];st.got[id]=1;if(fresh)setTimeout(function(){if(f.classList.contains('on'))confetti(f)},650);var n=PCS.filter(function(x){return st.got[x.id]}).length;
  $(f,'.co-ic').innerHTML=p.svg;$(f,'.co .kick').textContent='Piece '+n+' of '+PCS.length;$(f,'.co-nm').textContent=p.label;$(f,'.co-row').innerHTML=pcRow(id)}

 function openSheet(html){sheet.innerHTML=html;$$(sheet,'a').forEach(function(a){a.target='_blank';a.rel='noopener'});sheet.scrollTop=0;sheet.classList.add('on');shade.classList.add('on');if(sc)sc.classList.add('wvfd-lock')}
 function closeSheet(){if(!sheet.classList.contains('on'))return;sheet.classList.remove('on');shade.classList.remove('on');if(sc)sc.classList.remove('wvfd-lock')}
 shade.addEventListener('click',function(e){e.stopPropagation();closeSheet()});
 fd.addEventListener('click',function(e){var t=e.target;if(!t.closest)return;
  var g=t.closest('.gloss');if(g){e.preventDefault();e.stopPropagation();openSheet('<p class="gk">'+esc(g.dataset.kind||'Word')+'</p><p class="gt">'+esc(g.dataset.name||g.textContent.trim())+'</p><p class="gd">'+esc(g.dataset.def||'')+'</p>');return}
  var a=t.closest('[data-act]');if(!a)return;var act=a.getAttribute('data-act');e.stopPropagation();
  if(act==='next')next();else if(act==='boswell')boswell();else if(act==='sources'){var em=$(fd,'.endmatter');openSheet('<h3>Sources</h3>'+(em?em.innerHTML:''))}
  else if(act==='again'){st={at:0,max:st.max,poll:{},got:{},built:0,done:st.done};save();streak=0;cards.forEach(function(f){var tt=f.dataset.t;if(tt==='poll'){f._ans=0;f.classList.remove('open');var w=$(f,'.poll');w.classList.remove('done');$$(f,'.opts li').forEach(function(o){o.classList.remove('mine','ok');o.setAttribute('tabindex','0')})}if(tt==='pick'||tt==='guess'){f._ans=0;f.classList.remove('open');$(f,'.pk').classList.remove('done');$$(f,'.pk-grid li').forEach(function(o){o.classList.remove('sel','ok');o.setAttribute('tabindex','0')});var pg=$(f,'.pk-go');if(pg)pg.disabled=tt==='pick';if(tt==='guess')guessPaint(f,+$(f,'.gs-r').value)}});unlock();sc.scrollTo({top:0,behavior:'auto'});setTimeout(track,60)}});
 fd.addEventListener('keydown',function(e){var g=e.target.closest&&e.target.closest('.gloss');if(g&&(e.key==='Enter'||e.key===' ')){e.preventDefault();g.click()}});
 function onKey(e){if(!fd.isConnected){document.removeEventListener('keydown',onKey);return}if(e.target&&/INPUT|TEXTAREA/.test(e.target.tagName))return;
  if(e.key==='Escape'&&sheet.classList.contains('on')){e.preventDefault();e.stopPropagation();closeSheet();return}
  if(e.key==='ArrowDown'||e.key==='PageDown'||(e.key===' '&&!(e.target.closest&&e.target.closest('[role=button],button')))){e.preventDefault();next()}else if(e.key==='ArrowUp'||e.key==='PageUp'){e.preventDefault();prev()}}
 document.addEventListener('keydown',onKey);
 window.addEventListener('resize',function(){size();track()});

 cards.forEach(function(f){var sv=st.poll[f.dataset.poll];if(f.dataset.t==='pick'&&sv&&sv.length){pickInit(f);pickDone(f,sv,1)}if(f.dataset.t==='guess'&&sv!=null){guessInit(f);guessDone(f,+sv,1)}if(f.dataset.t==='poll'&&sv!=null){pollInit(f);pollDone(f,sv,1)}if(f.dataset.t==='build'&&st.built)buildInit(f)});
 size();unlock();paintCue();setTimeout(function(){size();track()},350);if(document.fonts&&document.fonts.ready)document.fonts.ready.then(function(){size()});
 fd._feed={go:go,next:next,prev:prev,cards:cards,state:function(){return {cur:cur,n:N,vis:vis().length,fh:fh,st:st,t:cur>=0?cards[cur].dataset.t:null,gate:cur>=0&&cards[cur].classList.contains('gate')&&!gateOpen(cards[cur])}}}}

(window.WVX=window.WVX||[]).push(function(root,sc){if(root.querySelector('[data-feed]'))startFeed(root,sc)});
})();
