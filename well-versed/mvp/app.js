var FAMS=[['Arts',['Visual Arts & Architecture','Film & Performing Arts','Music'],'#d0674f'],['Letters',['Literature & Letters','Language & Rhetoric'],'#c49a3a'],['Thought',['Philosophy & Religion','History'],'#8569c4'],['Sciences',['Sciences & Mathematics','Medicine & the Body','Technology'],'#3a9dbd'],['The Table',['Drinks','Food','Smoke'],'#c47f35'],['Craft',['Practical Skills','Outdoors & Survival','Outdoor Pursuits','Physical & Self-Defense','Games & Pastimes','Sports'],'#4fa265'],['The World',['Objects & Style','Civic & Money','Social Living','The Animal World'],'#c9638f']];
function famOf(f){for(var i=0;i<FAMS.length;i++)if(FAMS[i][1].indexOf(f)>-1)return FAMS[i];return FAMS[0]}
function rnd(n){var x=Math.sin(n*12.9898+4.1)*43758.5453;return x-Math.floor(x)}
L.forEach(function(l,i){l.state='unread';l.fade=0;l.i=i});
C.forEach(function(c,i){c.i=i;c.unl=false;c.st='new';c.stab=0;c.df=0;c.last=null;c.ivl=0;c.due=0;c.reps=0;c.lapses=0;c.flag=0;c.mark=false;c.susp=false;c.bury=false});
var S={tab:'today',done:false,theme:'',fs:1,opts:{nw:3,rv:20,ret:90,voice:true,look:'dark',vx:{L:1,T:1,D:1,C:1,N:2,S:1,F:1,R:1,B:1}},hist:[],sess:null,filter:'All',q:'',shelf:'All',sort:'Newest',wall:'Wall',reviewed:0,newToday:0,rlog:[],talks:{},prog:{},pos:{},readAt:{},days:[],seen:{},told:{}};
var app=document.getElementById('app');
var I={today:'<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="4"/><path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6 7 7M17 17l1.4 1.4M18.4 5.6 17 7M7 17l-1.4 1.4"/></svg>',cards:'<svg viewBox="0 0 24 24"><rect x="4" y="7" width="13" height="13" rx="2"/><path d="M8 7V6a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-1"/></svg>',wall:'<svg viewBox="0 0 24 24"><rect x="4" y="4" width="7" height="7" rx="1"/><rect x="13" y="4" width="7" height="7" rx="1"/><rect x="4" y="13" width="7" height="7" rx="1"/><rect x="13" y="13" width="7" height="7" rx="1"/></svg>',shelf:'<svg viewBox="0 0 24 24"><path d="M5 4v16M10 4v16M15.5 4.5 20 19.5"/></svg>',
plus:'<svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>',search:'<svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="6.5"/><path d="m16 16 4 4"/></svg>',chart:'<svg viewBox="0 0 24 24"><path d="M5 20V11M12 20V5M19 20v-6"/></svg>',gear:'<svg viewBox="0 0 24 24"><path d="M4 7h10M18 7h2M4 17h2M10 17h10"/><circle cx="16" cy="7" r="2"/><circle cx="8" cy="17" r="2"/></svg>',more:'<svg viewBox="0 0 24 24"><circle cx="6" cy="12" r="1.2"/><circle cx="12" cy="12" r="1.2"/><circle cx="18" cy="12" r="1.2"/></svg>',mic:'<svg viewBox="0 0 24 24" width="46" height="46" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><rect x="9" y="3" width="6" height="12" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3"/></svg>'};
function esc(s){return String(s).replace(/&(?!\w+;)/g,'&amp;').replace(/</g,'&lt;')}

function due(c){return !c.susp&&!c.bury&&!c.del&&c.unl&&((c.st==='review'&&c.due<=0)||c.st==='learn')}
function counts(d){var o={n:0,l:0,r:0,t:0};C.forEach(function(c){if(d&&c.d!==d)return;o.t++;if(c.susp||c.bury||c.del||!c.unl)return;if(c.st==='new')o.n++;else if(c.st==='learn')o.l++;else if(due(c))o.r++});o.n=Math.min(o.n,Math.max(0,S.opts.nw-(S.newToday||0)));o.r=Math.min(o.r,S.opts.rv);return o}

function closeTop(){var s=app.querySelectorAll(':scope > .scr');if(s.length>1){var top=s[s.length-1];exitShot(top,s[s.length-2]);top.remove()}if(app.querySelectorAll(':scope > .scr').length===1){var t=app.querySelector('.tabs');if(t)t.classList.remove('hide')}}
function sheet(html){var w=document.createElement('div');w.id='sh';w.innerHTML='<div class="scrim" data-a="shut"></div><div class="sheet"><div class="grab"></div>'+html+'</div>';app.appendChild(w);return w}
function shut(){var s=document.getElementById('sh');if(s)s.remove();if(S.optsDirty){S.optsDirty=false;root()}}
function toast(t){var d=document.createElement('div');d.className='toast';d.textContent=t;app.appendChild(d);setTimeout(function(){d.remove()},1500)}


function aa(){var t=S.theme;sheet('<h3>Text</h3><div class="seg"><button data-th="" aria-pressed="'+(t==='')+'">Paper</button><button data-th="sepia" aria-pressed="'+(t==='sepia')+'">Sepia</button><button data-th="night" aria-pressed="'+(t==='night')+'">Night</button></div><div class="group"><div class="row"><span class="g">Size</span><span class="step"><button data-fs="-1" aria-label="Smaller">−</button><button data-fs="1" aria-label="Larger">+</button></span></div></div>')}
var tm=null;

var BEATS=[[1,'Gerry, 1812, a monster-shaped district'],[1,'More votes, fewer seats'],[1,'Rucho closed the federal courts'],[0,'Madison saw it coming in 1787'],[0,'Congress can still act under Article I']];


function buildQ(d,opt){var q=C.filter(function(c){return(!d||c.d===d)&&!c.susp&&!c.bury&&!c.del&&c.unl});
 if(opt==='forgot')q=q.filter(function(c){return c.lapses});else if(opt==='ahead')q=q.filter(function(c){return c.st==='review'}).sort(function(a,b){return a.due-b.due}).slice(0,10);else if(opt==='flag')q=q.filter(function(c){return c.flag||c.mark});else{var n=q.filter(function(c){return c.st==='new'}).slice(0,Math.max(0,S.opts.nw-(S.newToday||0))),l=q.filter(function(c){return c.st==='learn'}),r=q.filter(due).filter(function(c){return c.st==='review'}).sort(function(a,b){return a.due-b.due}).slice(0,S.opts.rv);q=l.concat(r,n)}
 return q}
function study(d,opt){S.sess={d:d,q:buildQ(d,opt),show:false,done:0};open('','rv up').id='rv';drawRv()}
function nextIv(c,g){var x=fsrs(c,g+1);return x.st==='review'?x.ivl:0}
function fmt(v,g){if(v===0)return g===0?'1m':'10m';return v<30?v+'d':v<365?Math.round(v/30)+'mo':(Math.round(v/36.5)/10)+'y'}
function curly(t){return t.replace(/(^|[\s(\[\u2014\u2013-])"/g,'$1\u201c').replace(/"/g,'\u201d').replace(/(^|[\s(\[])'/g,'$1\u2018').replace(/'/g,'\u2019')}
function clozeHtml(q,show,cn){return curly(esc(q)).replace(/&lt;(\/?)(em|i|b|strong)>/g,'<$1$2>').replace(/\*([^*{}]+)\*/g,'<i>$1</i>').replace(/\{\{c(\d+)::(.*?)(::.*?)?\}\}/g,function(_,n,a){return n===String(cn||1)?(show?'<span class="cl">'+a+'</span>':'<span class="hole">'+a+'</span>'):a})}

function grade(g){var s=S.sess,c=s.q.shift(),G=g+1;S.hist.push({c:c,prev:JSON.parse(JSON.stringify(cardState(c))),q:s.q.slice(),nt:S.newToday});
 var wasNew=c.st==='new',wasRev=c.st==='review',x=fsrs(c,G);Object.assign(c,x);if(wasNew)S.newToday=(S.newToday||0)+1;
 S.rlog.push([WV.today(),G,wasRev?1:0]);if(S.rlog.length>4000)S.rlog.splice(0,S.rlog.length-4000);
 if(c.st==='learn')s.q.splice(G===1?Math.min(3,s.q.length):s.q.length,0,c);
 s.done++;S.reviewed++;s.show=false;drawRv()}


function sorted(a){a=a.slice();if(S.sort==='A–Z')a.sort(function(x,y){return x.t.replace(/^The /,'').localeCompare(y.t.replace(/^The /,''))});if(S.sort==='Oldest')a.reverse();return a}

function bk(l){return '<button class="bk" data-less="'+l.i+'">'+art(l)+'<p>'+l.t+'</p></button>'}
function rowOf(t,k,a){return '<div class="hh"><b>'+t+'</b><button data-all="'+k+'">See all</button></div><div class="hs">'+a.map(bk).join('')+'</div>'}
function listAll(title,a){open('<div class="pad"><div class="top"><button class="back" data-a="closeTop">‹ Back</button></div><h1 class="large">'+esc(title)+'</h1><div class="grid">'+sorted(a).map(bk).join('')+'</div></div>')}
function famPage(n){var f=FAMS.filter(function(x){return x[0]===n})[0];open('<div class="pad"><div class="top"><button class="back" data-a="closeTop">‹ Shelf</button></div><h1 class="large">'+n+'</h1>'+f[1].map(function(x){var a=L.filter(function(l){return l.f===x}),r=a.filter(function(l){return l.state==='read'}).length;return '<div class="hh"><b>'+esc(x)+'</b><span style="color:var(--sub);font-size:14px">'+r+'/'+a.length+'</span></div><div class="hs">'+sorted(a).map(bk).join('')+'</div>'}).join('')+'</div>')}

app.addEventListener('click',function(e){var b=e.target.closest('[data-tab],[data-a],[data-less],[data-deck],[data-study],[data-g],[data-c],[data-gl],[data-th],[data-fs],[data-o],[data-w],[data-sf],[data-all],[data-field],[data-bf],[data-card],[data-browse],[data-cs],[data-save],[data-ad],[data-unsusp]');if(!b)return;var d=b.dataset;
 if(d.unsusp!=null){C[+d.unsusp].susp=false;shut();toast('Back in your reviews');root();return}
 if(d.tab){S.tab=d.tab;root();return}
 if(d.less!=null){lessonSheet(L[+d.less]);return}
 if(d.study!=null){study(d.study||null);return}
 if(d.g!=null){rvFling(+d.g,0,0);return}
 if(d.th!=null){S.theme=d.th;S.opts.thSet=true;var r=app.querySelector('.reader');r.classList.toggle('sepia',S.theme==='sepia');r.classList.toggle('night',S.theme==='night');syncHost();shut();aa();return}
 if(d.fs){S.fs=Math.max(.85,Math.min(1.3,S.fs+(+d.fs)*.08));app.querySelector('.reader').style.setProperty('--fs',S.fs);syncHost();return}
 if(d.gl){sheet({l:'<h3>latitude</h3>Room to act. The phrase hands over more than it seems to.',v:'<h3>viva voce</h3>Voting aloud in public instead of by secret ballot.'}[d.gl]);return}
 if(d.o){var p=d.o.split(','),k=p[0];var lim={nw:[0,50],rv:[0,500],ret:[70,97]}[k]||[0,1e4];S.opts[k]=Math.min(lim[1],Math.max(lim[0],S.opts[k]+(+p[1])));S.optsDirty=true;document.getElementById('o-'+k).textContent=S.opts[k]+(k==='ret'?'%':'');return}
 if(d.w){S.wall=d.w;root();return}
 if(d.sf){S.shelf=d.sf;root();return}
 if(d.all){if(d.all.indexOf('f:')===0)famPage(d.all.slice(2));else{S.shelf=d.all;root()}return}
 if(d.field){listAll(d.field,L.filter(function(l){return l.f===d.field}));return}
 if(d.bf){S.filter=d.bf;document.querySelectorAll('#bf button').forEach(function(x){x.setAttribute('aria-pressed',x.dataset.bf===d.bf)});drawBrowse();return}
 if(d.card!=null){editSheet(C[+d.card]);return}
 if(d.browse!=null){browse(d.browse);return}
 if(d.cs){shut();study(d.d||null,d.cs);return}
 if(d.save!=null){var c=C[+d.save];c.q=document.getElementById('etxt').value;c.edited=true;shut();if(S.sess)drawRv();drawBrowse();refreshLC();refreshIS();toast('Saved');return}
 if(d.ad){S.adeck=d.ad;document.querySelectorAll('[data-ad]').forEach(function(x){x.setAttribute('aria-pressed',x===b)});return}
 if(d.c){var cd=S.sess.q[0];shut();if(d.c==='undo'){var h=S.hist.pop();if(h){Object.assign(h.c,h.prev);S.newToday=h.nt;S.rlog.pop();S.reviewed=Math.max(0,S.reviewed-1);S.sess.q=[h.c].concat(h.q.filter(function(x){return x!==h.c}));S.sess.done=Math.max(0,S.sess.done-1);S.sess.show=false;drawRv()}else toast('Nothing to undo');return}
  if(d.c==='edit'){editSheet(cd);return}if(d.c==='flag'){cd.flag=cd.flag?0:1;drawRv();return}if(d.c==='mark'){cd.mark=!cd.mark;drawRv();return}
  if(d.c==='bury'){cd.bury=true;S.sess.q.shift();drawRv();toast('Buried');return}if(d.c==='susp'){cd.susp=true;S.sess.q.shift();drawRv();toast('Suspended');return}
  if(d.c==='info'){sheet('<h3>Card info</h3><div class="group"><div class="row"><span class="g">State</span>'+cd.st+'</div><div class="row"><span class="g">Interval</span>'+cd.ivl+'d</div><div class="row"><span class="g">Lesson</span>'+esc(cd.s)+'</div><div class="row"><span class="g">Deck</span>'+cd.d+'</div></div>');return}}
 var a=d.a;
 if(a==='shut')shut();else if(a==='read')reader();else if(a==='closeRead'){closeTop();if(app.querySelectorAll(':scope > .scr').length===1)root()}else if(a==='closeTop'){clearInterval(tm);tm=null;closeTop();if(app.querySelectorAll(':scope > .scr').length===1)root()}
 else if(a==='aa')aa();else if(a==='tell'){tell()}
 else if(a==='finish')finish();else if(a==='wall'){S.tab='wall';root()}
 else if(a==='flip'){rvFlip()}else if(a==='endRv'){closeTop();root()}else if(a==='tools')tools();
 else if(a==='add')addSheet();else if(a==='opts')optsSheet();
 else if(a==='voice'){S.opts.voice=!S.opts.voice;b.setAttribute('aria-checked',S.opts.voice)}else if(a==='bk'){wvBackup()}else if(a==='rs'){wvRestore(b)}else if(a==='wipe'){if(b.dataset.armed){WV.clear();location.reload()}else{b.dataset.armed=1;b.textContent='Tap again to clear everything';setTimeout(function(){if(b.isConnected){delete b.dataset.armed;b.textContent='Clear saved progress'}},4000)}return}else if(a==='unbury'){C.forEach(function(c){c.bury=false});shut();toast('Unburied')}
 else if(a==='hideword'){var t=document.getElementById('atxt'),s=t.selectionStart,e2=t.selectionEnd;if(e2>s)t.value=t.value.slice(0,s)+'{{c1::'+t.value.slice(s,e2)+'}}'+t.value.slice(e2);else toast('Select a word first')}
 else if(a==='saveadd'){var v=document.getElementById('atxt').value.trim();if(!v){toast('Write the card first');return}if(!/\{\{c1::[^}]*\S[^}]*\}\}/.test(v)){toast('Hide a word first');var ht=document.querySelector('.addhint');if(ht)ht.classList.add('on');return}C.unshift({i:C.length,d:S.adeck||'Arts',tags:[],ty:'Cloze',q:v,a:'',s:'Added by you',st:'new',unl:true,ivl:0,due:0,flag:0,mark:false,susp:false,bury:false});C.forEach(function(c,i){c.i=i});shut();toast('Added');if(S.tab==='cards'&&app.querySelectorAll(':scope > .scr').length===1)root()}
 else if(a==='sort'){sheet('<h3>Sort</h3><div class="group">'+['Newest','Oldest','A–Z'].map(function(s){return '<button class="row" data-sortv="'+s+'"><span class="g">'+s+'</span>'+(S.sort===s?'✓':'')+'</button>'}).join('')+'</div>')}
});
app.addEventListener('click',function(e){var b=e.target.closest('[data-sortv]');if(b){S.sort=b.dataset.sortv;shut();root()}});
app.addEventListener('input',function(e){if(e.target.id==='sq'){S.sq=e.target.value.toLowerCase();var s=e.target.selectionStart;root();var i=document.getElementById('sq');i.focus();i.setSelectionRange(s,s)}});


S.ring={read:0,talk:0,cards:0};
var COL=[['The Great Trials','socrates',['trial-of-socrates.html','dreyfus-affair.html','the-metamorphosis.html','magna-carta.html','gerrymander.html','waiting-for-godot.html']],['What to Order','negroni',['negroni.html','martini.html','champagne.html','port.html','bourbon.html','india-pale-ale.html','scotch-whisky-regions.html','bordeaux-1855.html']],['Empires Turning','milvian',['milvian-bridge.html','rubicon.html','fall-of-constantinople.html','meiji-restoration.html','cuban-missile-crisis.html','marshall-plan.html']],['The Masterpieces','wave',['great-wave-off-kanagawa.html','mona-lisa.html','las-meninas.html','ecstasy-of-saint-teresa.html','migrant-mother.html','neoclassicism.html']],['Out There','matterhorn',['matterhorn.html','building-a-fire.html','map-and-compass.html','finding-north-by-the-stars.html','cold-water.html','cpr.html','reading-the-sky.html']],['The Big Questions','hubble',['hubble-deep-field.html','cosmic-microwave-background.html','special-relativity.html','allegory-of-the-cave.html','cogito-ergo-sum.html','god-is-dead.html']]];
function byH(h){return L.filter(function(l){return l.h===h})[0]}

function imKey(src){var m=/img\/([hb]\/[^.\/]+)\./.exec(src||'');return m?m[1]:null}
function artFor(src){var k=imKey(src),m=k&&typeof IM!=='undefined'&&IM[k];if(!m)return {src:src,w:3,h:4,frame:false,pos:'50% 50%',lb:150,lt:150,dh:null};
 return {src:src,w:m[0],h:m[1],frame:m[0]/m[1]>=1.15||m[1]<700,pos:Math.round(m[2]*100)+'% '+Math.round(m[3]*100)+'%',lb:m[4],lt:m[5],dh:m[6]}}
function hamming(a,b){if(!a||!b)return 99;var n=0;for(var i=0;i<16;i+=4){var x=parseInt(a.substr(i,4),16)^parseInt(b.substr(i,4),16);while(x){n+=x&1;x>>=1}}return n}
function artClash(a,used){return used.some(function(u){return hamming(a.dh,u)<=10})}
function scrimVars(a){var ta=Math.min(.78,.34+Math.max(0,a.lt-70)/185*.44),ba=a.frame?.82:Math.min(.94,.7+Math.max(0,a.lb-50)/205*.24);return '--ta:'+ta.toFixed(2)+';--ba:'+ba.toFixed(2)}
function artImg(a){return a.frame?'<img class="bg blur" alt="" src="'+a.src+'"><div class="frm"><img alt="" src="'+a.src+'" width="'+a.w+'" height="'+a.h+'"></div>':'<img class="bg" alt="" src="'+a.src+'" style="object-position:'+a.pos+'">'}
function artPanel(a,inner){return '<section class="panel'+(a.frame?' framed':'')+'" style="'+scrimVars(a)+'">'+artImg(a)+inner+'</section>'}
function titleStep(t,a,base){var n=plain(t).length,s=base+(n>16?1:0)+(n>30?1:0)+(a.frame?1:0);return 'p'+Math.min(4,Math.max(base,s))}
function sayLabel(l){return 'Talk to Boswell'}
function root(){var v={today:vToday,shelf:vShelf,cards:vCards,record:vRecord}[S.tab](),xs=[].slice.call(app.querySelectorAll(':scope > .scr-x'));app.innerHTML='<div class="scr" id="r"'+(S.tab==='today'?' style="overflow:hidden"':'')+'>'+v+'</div>'+tabs()+vxPill();xs.forEach(function(x){app.appendChild(x)});after();fitAll()}
var lastTap={x:'50%',y:'80%'};
document.addEventListener('keydown',function(e){if(e.target&&e.target.id==='tin'&&e.key==='Enter'&&(e.metaKey||e.ctrlKey)){e.preventDefault();tsend()}});
document.addEventListener('pointerdown',function(e){var r=app.getBoundingClientRect();lastTap={x:(e.clientX-r.left)+'px',y:(e.clientY-r.top)+'px'};
 var el=e.target.closest&&e.target.closest('button,a,.cv,.bk,.cc,.prog-row,.evr');var b=el?el.getBoundingClientRect():{left:e.clientX,top:e.clientY,right:e.clientX,bottom:e.clientY};lastRect={t:Date.now(),r:b}},true);
var lastRect=null;

function ringsSvg(){var R=[[23,S.ring.read,'var(--ring-1)'],[15,S.ring.talk,'var(--ring-2)'],[7,S.ring.cards,'var(--ring-3)']];return '<svg class="rings" viewBox="0 0 52 52" aria-label="Today\'s rings">'+R.map(function(x){var c=2*Math.PI*x[0];return '<circle class="tr" cx="26" cy="26" r="'+x[0]+'"/><circle class="v" cx="26" cy="26" r="'+x[0]+'" style="stroke:'+x[2]+'" stroke-dasharray="'+c+'" stroke-dashoffset="'+(c*(1-x[1]))+'"/>'}).join('')+'</svg>'}
function vToday(){
 var tl=todayLesson(),c=counts(),n=c.n+c.l+c.r,q=buildQ('').slice(0,3),day=WV.today(),st=streak();
 S.ring.read=Math.max(S.ring.read||0,S.prog[tl.h]||0);S.ring.cards=cardRing();
 var cardsHtml=q.map(function(x){return '<div>'+clozeHtml(x.q,false,x.cn).replace(/\*([^*]+)\*/g,'<i>$1</i>').slice(0,240)+'</div>'}).join('');
 var V=vx(),rd=tl.state==='read',p0=S.prog[tl.h]||0,isT=tl.d===isoDay(),used=[],tdate=new Date(tl.d+'T12:00:00').toLocaleDateString('en-US',{weekday:'short',month:'short',day:'numeric'});
 var tagT=isT?'Today':new Date(tl.d+'T12:00:00').toLocaleDateString('en-US',{month:'short',day:'numeric'});
 var a0=artFor(hero(tl));used.push(a0.dh);
 var h=lessonCard(a0,tl,V.D===1?tagH(tagT,'var(--accent)'):tagH(esc(tl.f),famOf(tl.f)[2]),{h1:1,pre:V.D===2?'<div class="tdate">'+tdate+'</div>':'',rib:V.D===3?'<span class="ribbon">'+tagT+'</span>':'',meta:rd?'Read · '+tl.m+' min':(p0>.05?minsLeft(tl)+' min left':tl.m+' min')});
 if(C.some(function(x){return x.unl&&!x.del}))h+='<section class="panel deckp">'+istackHtml(null,'today')+'</section>';
 var kgs=L.filter(function(l){var p=S.prog[l.h]||0;return l!==tl&&l.state!=='read'&&p>.05&&p<.92}).sort(function(a,b){return (S.seen[b.h]||0)-(S.seen[a.h]||0)}),kg=null,ak=null;
 for(var k=0;k<kgs.length&&!kg;k++){var ax=artFor(hero(kgs[k]));if(!artClash(ax,used)){kg=kgs[k];ak=ax}}
 if(kg){used.push(ak.dh);h+=lessonCard(ak,kg,tagH('Keep going','var(--accent)'),{bar:S.prog[kg.h],meta:minsLeft(kg)+' min left'})}
 var fs=fieldStats().filter(function(f){return f.r<f.t}).sort(function(a,b){return a.r/a.t-b.r/b.t||a.n.localeCompare(b.n)});
 if(fs.length){var f=fs[day%Math.min(3,fs.length)],un=L.filter(function(l){return l.f===f.n&&l.state!=='read'&&l!==tl&&l!==kg}),pk=null,ap=null;
  for(var j=0;j<un.length&&!pk;j++){var c0=un[(day+j)%un.length],ay=artFor(hero(c0));if(!artClash(ay,used)){pk=c0;ap=ay}}
  if(pk){used.push(ap.dh);h+=lessonCard(ap,pk,tagH(esc(pk.f),famOf(pk.f)[2]),{meta:pk.m+' min'})}}
 var cols=COL.map(function(c,i){return [c,i]}).filter(function(x){return x[0][2].filter(byH).length>=4}),cx=null,acl=null;
 for(var m=0;m<cols.length&&!cx;m++){var cc=cols[(day+m)%cols.length],az=artFor(B[cc[0][1]]);if(!artClash(az,used)){cx=cc;acl=az}}
 if(!cx&&cols.length){cx=cols[day%cols.length];acl=artFor(B[cx[0][1]])}
 if(cx)h+=collCard(cx[0],cx[1],acl,used);

 return '<div class="hud">'+ringsSvg()+'<div class="tnav"><button class="trw" data-a="trw" aria-label="Previous card">'+I.rw+'</button><span class="tdots" id="tdots" aria-hidden="true"></span></div>'+(st?'<b>'+st+(st===1?' day':' days')+'</b>':'<b></b>')+'</div><div class="feed tstack" id="feed" role="region" aria-roledescription="carousel" aria-label="Today">'+h+'<div class="tedge" data-a="tnext" role="button" tabindex="0" aria-label="Next card"><i></i></div></div>'}

var PIN=[[0,0,1,'A map as a monster.'],[.62,.0,2.3,'Salisbury in its jaws.'],[.1,.25,2.1,'Andover for a chest.'],[.4,.62,2.4,'Marblehead curls into a talon.'],[.02,.68,2.6,'Chelsea hangs off like a spur.']];

var MAPS=[[0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,2,2,2,2,2,2,2,2,2,2,3,3,3,3,3,3,3,3,3,3,4,4,4,4,4,4,4,4,4,4],[0,0,0,3,3,0,0,0,3,3,0,0,0,3,3,1,1,0,3,3,1,1,1,3,3,1,1,1,4,4,2,2,1,2,4,2,2,1,2,4,2,2,2,2,4,4,4,4,4,4]];

var BOS='<svg viewBox="0 0 112 112" class="bos" id="bos" aria-label="Boswell"><circle cx="56" cy="58" r="50" fill="#fff"/><path d="M20 62c-8-24 10-46 36-46s44 22 36 46c-3 8-11 7-12 0l-48 0c-1 7-9 8-12 0Z" fill="#efe9dc" stroke="#1b1a10" stroke-width="3"/><circle cx="24" cy="48" r="9" fill="#efe9dc" stroke="#1b1a10" stroke-width="3"/><circle cx="88" cy="48" r="9" fill="#efe9dc" stroke="#1b1a10" stroke-width="3"/><circle cx="56" cy="62" r="27" fill="#f2b98f" stroke="#1b1a10" stroke-width="3"/><circle cx="46" cy="56" r="4" fill="#1b1a10"/><circle cx="66" cy="56" r="4" fill="#1b1a10"/><rect class="lid" x="38" y="50" width="36" height="11" fill="#f2b98f"/><path d="M47 71q9 8 18 0" fill="none" stroke="#1b1a10" stroke-width="3" stroke-linecap="round"/><path d="M92 74 106 44l3 2-11 34Z" fill="#ff5a3c" stroke="#1b1a10" stroke-width="2"/></svg>';
var turn=0,tt=null,listening=false;


function colPage(i){var c=COL[i],a=c[2].map(byH).filter(Boolean);open('<div class="chero tall"><img alt="" src="'+B[c[1]]+'"><div class="shade"></div><button class="ic cback" data-a="closeTop" aria-label="Back">‹</button><h1 class="poster p2">'+c[0]+'</h1></div><div class="clist">'+a.map(function(l,n){return '<button class="prog-row" data-less="'+l.i+'"><em>'+(n+1)+'</em><img alt="" src="'+(T[l.no]||'')+'"><span class="t">'+l.t+'</span>'+(l.state==='read'?'<span class="ck">✓</span>':'')+'</button>'}).join('')+'</div>','reveal')}
function fieldStats(){var o=[];FAMS.forEach(function(f){f[1].forEach(function(n){var a=L.filter(function(l){return l.f===n}),r=a.filter(function(l){return l.state==='read'}).length;if(!a.length)return;o.push({n:n,c:f[2],r:r,t:a.length,tier:r>=5&&r>=Math.ceil(a.length*.75)?'Well-Versed':r>=3?'Conversant':r>=1?'Novice':'Unread'})})});return o.sort(function(a,b){return b.r/b.t-a.r/a.t})}
function chart(){var rd=L.filter(function(l){return l.state==='read'}).slice().reverse(),N=rd.length,w=358,h=150,pts=[];for(var i=0;i<=24;i++){var x=i/24*w,y=h-8-(Math.pow(i/24,.82)*N/170*(h-16)*1.5);pts.push(x.toFixed(1)+','+y.toFixed(1))}var d='M'+pts.join('L');return '<svg class="chart" viewBox="0 0 '+w+' '+h+'" width="100%"><path class="a" d="'+d+'L'+w+','+h+'L0,'+h+'Z"/><path class="l" d="'+d+'"/></svg>'}

function shareCard(){var all=fieldStats(),wv=all.filter(function(f){return f.tier==='Well-Versed'}),cv=all.filter(function(f){return f.tier==='Conversant'}),rd=L.filter(function(l){return l.state==='read'}),th=rd.slice(0,12),st=streak();
 sheet('<div class="scard" id="scard"><div class="lbl">Well-Versed</div><div class="poster p2 sbig">'+wv.length+(wv.length===1?' field':' fields')+'</div><div class="slede">Well-versed in '+wv.length+' of '+all.length+'</div>'+wv.slice(0,3).map(function(f){return '<div class="poster p4 fieldp">'+esc(f.n)+'</div>'}).join('')+(!wv.length&&cv.length?'<div class="sconv">Conversant in '+cv.slice(0,3).map(function(f){return esc(f.n)}).join(', ')+'</div>':'')+'<div class="sfig">'+rd.length+(rd.length===1?' lesson':' lessons')+(st?' · '+st+(st===1?' day':' days')+' in a row':'')+'</div>'+(th.length?'<div class="cg">'+th.map(function(l){return '<img alt="" src="'+(T[l.no]||'')+'">'}).join('')+'</div>':'')+'</div><div class="sacts" id="sacts"></div>');
 capUse('downloads').then(function(dl){var a=document.getElementById('sacts');if(!dl||!a||typeof dl.save!=='function')return;a.innerHTML='<button class="pri" data-a="saveshare">Save image</button>';a._dl=dl})}

function drawRv(){var s=S.sess,r=document.getElementById('rv');if(!r)return;if(!s.total)s.total=s.q.length;r.classList.add('rv3');
 if(!s.q.length){r.innerHTML='<div class="rvbar"><button data-a="endRv">✕</button></div><div class="rvclear"><div class="poster p1">Clear</div><div>'+s.done+' reviewed</div></div>';S.ring.cards=1;return}
 var c=s.q[0],mk=(c.flag?' ⚑':'')+(c.mark?' ★':''),bh=s.q.slice(1,3).map(function(x,k){return cardFace(x,{cls:'rv-b rv-b'+(k+1),noBack:true})}).reverse().join('');
 r.innerHTML='<div class="rvbar"><button data-a="endRv" aria-label="Close">✕</button><span><i class="sd '+esc(c.st)+'" aria-hidden="true"></i>'+(s.done+1)+' / '+(s.done+s.q.length)+' · '+esc(c.d)+mk+'</span><button data-a="tools" aria-label="Card actions">•••</button></div><div class="rvline"><i style="width:'+Math.min(100,s.done/(s.done+s.q.length)*100)+'%"></i></div><div class="rvstage">'+bh+cardFace(c,{cls:'rv-top'+(s._in?' enter':''),flip:s.show,attr:' data-a="flip" role="button" tabindex="0" aria-label="'+(s.show?'Card answer':'Show the answer')+'"',extra:'<div class="cue" aria-hidden="true"></div>'})+'</div><div class="rvctl" id="rvctl">'+rvCtl(c)+'</div>';
 s._in=false;fitFaces(r);rvDrag(r)}
function rvCtl(c){return S.sess.show?'<div class="gr">'+RV_G.map(function(g,i){return '<button class="g'+i+'" data-g="'+i+'">'+g+'<small>'+fmt(nextIv(c,i),i)+'</small></button>'}).join('')+'</div>':'<button class="pri ink rvshow" data-a="flip">Show</button>'}

app.addEventListener('click',function(e){var b=e.target.closest('[data-pm],[data-col],[data-a],[data-field2]');if(!b)return;var d=b.dataset;
 if(d.col!=null){colPage(+d.col);return}
 if(d.field2){var ls=L.filter(function(l){return l.f===d.field2.replace('&amp;','&')});listAll(d.field2.replace('&amp;','&'),ls);return}
 var a=d.a;if(a==='speak')speak();else if(a==='closeTalk'){if(listening){try{rec0.stop()}catch(e){}}listening=false;talkId++;sending=false;if(turn>=1){finish();toast('Telling saved')}else closeTop()}else if(a==='tsend'){tsend()}else if(a==='treward'){reward()}else if(a==='seerec'){S.tab='record';root()}else if(a==='shareCard')shareCard();else if(a==='fAll'){S.fAll=true;root()}
});
I.today='<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="4.2"/><path d="M12 2.8v2.4M12 18.8v2.4M2.8 12h2.4M18.8 12h2.4M5.5 5.5l1.7 1.7M16.8 16.8l1.7 1.7M18.5 5.5l-1.7 1.7M7.2 16.8l-1.7 1.7"/></svg>';
I.shelf='<svg viewBox="0 0 24 24"><rect x="4" y="4" width="4.5" height="16" rx="1"/><rect x="10" y="4" width="4.5" height="16" rx="1"/><path d="m16.6 5.2 3.4-.9 3 15.4"/></svg>'.replace('m16.6 5.2 3.4-.9 3 15.4','M16.5 5.2 19.6 4.5 22 19.3 18.9 20Z');
I.cards='<svg viewBox="0 0 24 24"><rect x="3.5" y="7.5" width="14" height="13" rx="2.5"/><path d="M7.5 4h10.5A2.5 2.5 0 0 1 20.5 6.5V17"/></svg>';
I.rec='<svg viewBox="0 0 24 24"><circle cx="12" cy="9.5" r="6"/><path d="M8.5 14.5 7 21.5l5-2.6 5 2.6-1.5-7"/></svg>';
function open(html,cls){var d=document.createElement('div');d.className='scr '+(cls||'in');d.innerHTML=html;
 var pv=app.querySelectorAll(':scope > .scr');pv=pv[pv.length-1];
 if((cls||'').indexOf('reveal')>-1){var ar=app.getBoundingClientRect(),r=lastRect&&Date.now()-lastRect.t<1200?lastRect.r:{left:ar.left+ar.width/2-20,right:ar.left+ar.width/2+20,top:ar.top+ar.height*.6-20,bottom:ar.top+ar.height*.6+20};
  d.style.setProperty('--ct',Math.max(0,r.top-ar.top)+'px');d.style.setProperty('--cl',Math.max(0,r.left-ar.left)+'px');d.style.setProperty('--cr',Math.max(0,ar.right-r.right)+'px');d.style.setProperty('--cb',Math.max(0,ar.bottom-r.bottom)+'px');
  d.classList.add('clip');d.dataset.tx='clip';lastRect=null}
 else d.dataset.tx=(cls||'in').indexOf('up')>-1?'up':'push';
 if(S.tab==='cards'&&!cls)d.classList.add('doc');app.appendChild(d);
 if(pv){if(d.dataset.tx==='clip'){var u=document.createElement('div');u.className='uscrim';u.style.zIndex=getComputedStyle(d).zIndex==='auto'?0:getComputedStyle(d).zIndex;app.insertBefore(u,d);setTimeout(function(){u.remove()},460)}
  else if(d.dataset.tx==='push'){pv.classList.add('under');setTimeout(function(){pv.classList.remove('under')},480)}}
 setTimeout(function(){d.classList.remove('in','up','clip','reveal')},700);
 var t=app.querySelector('.tabs');if(t)t.classList.add('hide');return d}
function exitShot(n,under){try{var x=n.cloneNode(true),st=n.scrollTop,hs=n.querySelector('#lh');
 x.classList.remove('scr','in','up','clip','reveal','under','back');x.classList.add('scr-x','x-'+(n.dataset.tx||'push'));x.removeAttribute('id');x.setAttribute('aria-hidden','true');x.inert=true;
 var xh=x.querySelector('#lh');if(hs&&hs.shadowRoot&&xh){xh.attachShadow({mode:'open'}).innerHTML=hs.shadowRoot.innerHTML}
 [].slice.call(x.querySelectorAll('[id]')).forEach(function(e){e.removeAttribute('id')});
 var body=document.createElement('div');body.className='scr-x-body';while(x.firstChild)body.appendChild(x.firstChild);x.appendChild(body);
 app.appendChild(x);body.scrollTop=st;var inner=body;inner.style.transform='translate3d(0,'+(-st)+'px,0)';inner.style.overflow='visible';
 if(n.dataset.tx==='push'&&under){under.classList.add('back');setTimeout(function(){under.classList.remove('back')},320)}
 setTimeout(function(){x.remove()},320)}catch(e){}}
function art(l,cls){var src=T[l.no];return '<div class="art '+(cls||'')+'">'+(src?'<img alt="" loading="lazy" src="'+src+'">':'')+(l.state==='read'?'<span class="rd" aria-label="Read"></span>':'')+'</div>'}
var REC=[['churchills-cigar.html','churchill','Your gap'],['great-wave-off-kanagawa.html','wave','New to you'],['trial-of-socrates.html','socrates','Start here'],['hubble-deep-field.html','hubble','Tonight'],['negroni.html','negroni','Your gap'],['matterhorn.html','matterhorn','New to you']];

S.evf='All';S.evs='A–Z';
function evPage(){S.sq='';open('<div class="ev"><div class="evtop"><div class="top"><button class="back2" data-a="closeTop">‹ Shelf</button></div><div class="poster p2" style="margin:0">Everything</div><input id="evq" class="evq" placeholder="Search" aria-label="Search lessons"><div class="chips">'+['All','Unread','Fading','Read'].map(function(f){return '<button data-evf="'+f+'" aria-pressed="'+(S.evf===f)+'">'+f+'</button>'}).join('')+'<span style="width:10px;flex:none"></span>'+['A–Z','Newest','Field'].map(function(f){return '<button data-evs="'+f+'" aria-pressed="'+(S.evs===f)+'">'+f+'</button>'}).join('')+'</div></div><div id="ev"></div></div>','reveal');drawEv();document.getElementById('evq').addEventListener('input',function(e){S.sq=e.target.value.toLowerCase();drawEv()})}
function drawEv(){var q=S.sq,f=S.evf,a=L.filter(function(l){return(!q||l.t.toLowerCase().indexOf(q)>-1||l.f.toLowerCase().indexOf(q)>-1)&&(f==='All'||(f==='Unread'&&l.state==='unread')||(f==='Fading'&&l.state==='read'&&l.fade<.3)||(f==='Read'&&l.state==='read'))});
 var key=function(l){return S.evs==='A–Z'?l.t.replace(/^(The|A) /,'').charAt(0).toUpperCase():S.evs==='Field'?l.f:l.dt.split(' ').slice(1).join(' ')};
 if(S.evs==='A–Z')a.sort(function(x,y){return x.t.replace(/^(The|A) /,'').localeCompare(y.t.replace(/^(The|A) /,''))});if(S.evs==='Field')a.sort(function(x,y){return x.f.localeCompare(y.f)});
 var h='',last=null;a.forEach(function(l){var k=key(l);if(k!==last){h+='<div class="evh">'+esc(k)+'</div>';last=k}h+='<button class="evr" data-less="'+l.i+'"><img alt="" loading="lazy" src="'+(T[l.no]||'')+'"><span>'+l.t+'</span>'+(l.state==='read'?'<i aria-label="Read"></i>':'<b></b>')+'</button>'});
 document.getElementById('ev').innerHTML=h||'<div class="evh">Nothing</div>'}
S.ctab='Review';

function fieldBlocks(fs){var T2=['Well-Versed','Conversant','Novice','Unread'];return T2.map(function(t){var a=fs.filter(function(f){return f.tier===t});if(!a.length)return '';return '<div class="tierh"><span>'+t+'</span><span>'+a.length+'</span></div>'+a.map(function(f){var on=Math.round(f.r/f.t*8);var m='';for(var i=0;i<8;i++)m+='<i class="'+(i<on?'on':'')+'"></i>';return '<button class="fr" data-field2="'+esc(f.n)+'"><span>'+esc(f.n)+'</span><span class="mt">'+m+'</span></button>'}).join('')}).join('')}
S.rtab='Lessons';

function vRecord(){var fs=fieldStats(),wv=fs.filter(function(f){return f.tier==='Well-Versed'}).length,rd=L.filter(function(l){return l.state==='read'}).length,rc=recallPct(30);
 var st=stamps();
 var read=L.filter(function(l){return l.state==='read'}).sort(function(a,b){return (S.readAt[b.h]||0)-(S.readAt[a.h]||0)}).slice(0,8);
 var days=read.map(function(l){var t=(S.talks[l.h]||[]).slice(-1)[0],b=t&&t.b,n=b&&b[1]>0?Math.max(0,Math.min(5,Math.round(b[0]/b[1]*5))):0,dd=dayDate(S.readAt[l.h]);return '<button class="day" data-less="'+l.i+'"><small>'+dd.getDate()+' '+'JanFebMarAprMayJunJulAugSepOctNovDec'.substr(dd.getMonth()*3,3)+'</small><span>'+l.t+'</span><span class="beats" aria-label="'+(b?b[0]+' of '+b[1]+' key points told':'Not told yet')+'">'+(b?Array(n+1).join('●')+Array(6-n).join('○'):'<em>Talk to Boswell</em>')+'</span></button>'}).join('')||'<p class="rnone">Lessons you finish appear here with the date you read them.</p>';
 return '<div class="rec"><div class="rhead"><span>Your record</span>'+(rd?'<button data-a="shareCard">Share</button>':'')+'</div><div class="poster p1 rbig" style="margin:0">'+(wv?wv+(wv===1?' field':' fields'):rd+(rd===1?' lesson':' lessons'))+'</div><div class="rlede">'+(wv?'Well-versed in '+wv+' of '+fs.length:'Read five lessons in a subject to become well-versed in it')+'</div><div class="rtrio"><div><b>'+rd+'</b>'+(rd===1?'lesson':'lessons')+'</div><div><b>'+streak()+'</b>day streak</div>'+(rc==null?'<div class="rnr">Recall shows after your first reviews</div>':'<div><b>'+rc+'%</b>recall</div>')+'</div><h2>Your Fields</h2>'+fieldBlocks(fs)+'<h2>Over Time</h2><div class="seg">'+['Lessons','Recall','Streak'].map(function(t){return '<button data-rt="'+t+'" aria-pressed="'+(S.rtab===t)+'">'+t+'</button>'}).join('')+'</div><div id="rc">'+chartFor(S.rtab)+'</div><h2>Stamps <small class="rsub">'+st.filter(function(x){return x[1]}).length+' of '+st.length+'</small></h2><div class="stmps">'+st.map(function(x){return '<div class="st'+(x[1]?'':' off')+'" style="--c:'+x[2]+'" title="'+esc(x[3])+'">'+x[0]+'</div>'}).join('')+'</div><h2>Diary</h2>'+days+'</div>'}
function after(){lensGo();var f=document.getElementById('feed');if(f)todayStack(f);document.querySelectorAll('#r .istack').forEach(wireIS);fitFaces(app.querySelector('#r'))
 var bq=document.getElementById('bq');if(bq){S.bd='';drawBrowse();bq.addEventListener('input',function(e){S.q=e.target.value.toLowerCase();drawBrowse()})}}
app.addEventListener('click',function(e){var b=e.target.closest('[data-ct],[data-evf],[data-evs],[data-rt],[data-a="ev"]');if(!b)return;var d=b.dataset;
 if(d.ct){S.ctab=d.ct;S.q='';root();return}if(d.a==='ev'){evPage();return}
 if(d.evf){S.evf=d.evf;document.querySelectorAll('[data-evf]').forEach(function(x){x.setAttribute('aria-pressed',x===b)});drawEv();return}
 if(d.evs){S.evs=d.evs;document.querySelectorAll('[data-evs]').forEach(function(x){x.setAttribute('aria-pressed',x===b)});drawEv();return}
 if(d.rt){S.rtab=d.rt;document.querySelectorAll('[data-rt]').forEach(function(x){x.setAttribute('aria-pressed',x===b)});document.getElementById('rc').innerHTML=chartFor(d.rt)}});
var COL2=[
['What to Order','negroni',[['Cocktails',['negroni.html','martini.html']],['Whisky',['bourbon.html','scotch-whisky-regions.html']],['Wine',['champagne.html','bordeaux-1855.html','port.html']],['Beer',['india-pale-ale.html']]]],
['Cook Like You Mean It','',[['Technique',['maillard-reaction.html','five-mother-sauces.html','barbecue-stall.html','sharpening-a-knife.html']],['Dishes',['beef-bourguignon.html','pizza-margherita.html','sushi.html','cheese.html']],['Eating Out',['michelin-star.html']]]],
['The Smoke Room','',[['Cigars',['cigar.html','humidor.html','churchills-cigar.html']],['Pipe and Paper',['tobacco-pipe.html','cigarette.html']]]],
['Dress the Part','',[['Tailoring',['bespoke-suit.html','trench-coat.html','necktie.html']],['Everyday',['dress-shoe.html','blue-jeans.html','panama-hat.html','wet-shave.html']],['Machines',['omega-speedmaster.html','jaguar-e-type.html']]]],
['Good Company','',[['Greetings',['handshake.html','calling-card.html']],['The Room',['salon.html','waltz.html','grand-tour.html']]]],
['Games of the Mind','',[['Chess',['morphy-opera-game.html','match-of-the-century.html','deep-blue.html']],['Cards',['bridge.html','moneymaker-effect.html']],['Board',['go.html','backgammon.html','monopoly.html']]]],
['The Great Trials','socrates',[['In Court',['trial-of-socrates.html','dreyfus-affair.html']],['Of Law',['magna-carta.html','gerrymander.html']]]],
['Empires Turning','milvian',[['Rome',['rubicon.html','milvian-bridge.html','fall-of-constantinople.html']],['The Modern World',['meiji-restoration.html','marshall-plan.html','cuban-missile-crisis.html']]]],
['The Masterpieces','wave',[['Painting',['mona-lisa.html','las-meninas.html','great-wave-off-kanagawa.html','neoclassicism.html']],['Sculpture and Photography',['ecstasy-of-saint-teresa.html','migrant-mother.html']]]],
['Out There','matterhorn',[['Stay Alive',['building-a-fire.html','cold-water.html','cpr.html']],['Find Your Way',['map-and-compass.html','finding-north-by-the-stars.html','reading-the-sky.html']],['Go Further',['matterhorn.html','ski-turn.html','fly-fishing.html']]]],
['The Big Questions','hubble',[['The Universe',['hubble-deep-field.html','cosmic-microwave-background.html','special-relativity.html']],['The Mind',['allegory-of-the-cave.html','cogito-ergo-sum.html','god-is-dead.html']]]]];
var GRP=[['At the Table',[0,1,2]],['In the Room',[3,4,5]],['Big Ideas',[6,7,8,10]],['Outside',[9]]];
function colL(c){var a=[];c[2].forEach(function(p){p[1].forEach(function(h){var l=byH(h);if(l)a.push(l)})});return a}
function vShelf(){
 var rec=REC.map(function(r){var l=byH(r[0]);return '<button class="cv" data-less="'+l.i+'"><img alt="" src="'+B[r[1]]+'"><span class="tag">'+r[2]+'</span><span class="poster" style="margin:0">'+l.t+'</span></button>'}).join('');
 var groups=GRP.filter(function(g){return g[1].some(function(i){return colL(COL2[i]).length>=4})}).map(function(g){return '<div class="hh"><b>'+g[0]+'</b></div><div class="hs">'+g[1].filter(function(i){return colL(COL2[i]).length>=4}).map(function(i){var c=COL2[i],a=colL(c);a=a.concat(a,a,a).slice(0,4);return '<button class="cc" data-col2="'+i+'"><div class="m4">'+a.map(function(l){return '<img alt="" loading="lazy" src="'+(T[l.no]||'')+'">'}).join('')+'</div><p>'+c[0]+'</p></button>'}).join('')+'</div>'}).join('');
 var fam=FAMS.filter(function(f){return L.some(function(l){return f[1].indexOf(l.f)>-1})}).map(function(f){return '<div class="hh"><b>'+f[0]+'</b><button data-all="f:'+f[0]+'">All</button></div><div class="hs">'+L.filter(function(l){return f[1].indexOf(l.f)>-1}).slice(0,8).map(function(l){return '<button class="bk" data-less="'+l.i+'">'+art(l)+'<p>'+l.t+'</p></button>'}).join('')+'</div>'}).join('');
 return '<div class="shelf"><div class="top2"><span><span class="poster p2" style="margin:0">Shelf</span></span><button class="ic" data-a="ev" aria-label="Search everything">'+I.search+'</button></div><div class="coll">'+rec+'</div>'+groups+'<button class="evbtn" data-a="ev"><b>Everything</b><span>'+L.length+' ›</span></button>'+fam+'</div>'}
function colPage2(i){var c=COL2[i],a=colL(c),r=a.filter(function(l){return l.state==='read'}).length,hero=B[c[1]]?'<img alt="" src="'+B[c[1]]+'">':'<div class="mos">'+a.concat(a).slice(0,9).map(function(l){return '<img alt="" src="'+(T[l.no]||'')+'">'}).join('')+'</div>';var n=0;
 open('<div class="chero">'+hero+'<div class="shade"></div><button class="ic cback" data-a="closeTop" aria-label="Back">‹</button><h1 class="poster p2">'+c[0]+'</h1></div><div class="cprog"><div style="display:flex;justify-content:space-between;align-items:center"><span>'+r+' of '+a.length+'</span><span>'+a.reduce(function(m,l){return m+l.m},0)+' min</span></div><div class="bar"><i style="width:'+(a.length?r/a.length*100:0)+'%"></i></div></div><div class="clist">'+c[2].map(function(p){var ls=p[1].map(byH).filter(Boolean);return ls.length?'<div class="part">'+p[0]+'</div>'+ls.map(function(l){n++;return '<button class="prog-row" data-less="'+l.i+'"><em>'+n+'</em><img alt="" src="'+(T[l.no]||'')+'"><span class="t">'+l.t+'</span>'+(l.state==='read'?'<span class="rdm" aria-label="Read"></span>':'')+'</button>'}).join(''):''}).join('')+'</div>','reveal')}

var retell=null,talkL=null;
function tell(l){turn=0;talkL=l||byH('gerrymander.html');retell=S.told[talkL.h]!=null?talkL:null;talkCard=null;talkBeats=null;talkAsk=null;
 var q=retell?'What do you remember about '+esc(plain(talkL.t))+'?':'Tell me about '+esc(plain(talkL.t))+'. What happened, and what do you make of it?';talkId++;sending=false;
 open('<button class="wx" data-a="closeTalk" aria-label="Close">✕</button>'+BOS+'<div class="tx" id="tx"><div class="says">'+q+'</div></div><div class="ask" id="ask"><textarea id="tin" class="tin" rows="3" placeholder="Say it the way you would tell a friend"></textarea><div class="arow">'+(SRC&&S.opts.voice?'<button class="micb" id="micb" data-a="speak" aria-label="Speak">'+I.mic.replace(/46/g,'30')+'</button>':'')+'<button class="send" data-a="tsend">Send</button></div></div>','talk reveal');
 var t=document.getElementById('tin');if(S.tdraft&&S.tdraft.h===talkL.h)t.value=S.tdraft.v;setTimeout(function(){t.focus()},350)}
function speak(){var m=document.getElementById('micb'),t=document.getElementById('tin');if(!m||!SRC)return;
 if(listening){try{rec0.stop()}catch(e){}return}
 var base=t.value?t.value.replace(/\s*$/,' '):'';rec0=new SRC();rec0.lang='en-US';rec0.interimResults=true;rec0.continuous=true;
 rec0.onresult=function(e){var s='';for(var i=0;i<e.results.length;i++)s+=e.results[i][0].transcript;t.value=base+s};
 rec0.onend=function(){listening=false;m.classList.remove('live')};
 rec0.onerror=function(e){listening=false;m.classList.remove('live');if(e.error==='not-allowed'||e.error==='service-not-allowed'){m.remove();toast('Type your answer instead')}};
 try{rec0.start();listening=true;m.classList.add('live')}catch(e){m.remove();toast('Type your answer instead')}}
function reward(){var l=talkL,c=talkCard;open('<div class="stamp">'+esc(l.f)+'<br>'+(retell?'Renewed':new Date().toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'numeric'}))+'</div><div class="beatsum"><b>Nicely told.</b></div>'+(c?'<div class="cardnote">Boswell made you a card from this lesson. Try it once, then keep it, change it or let it go.</div><div style="height:26px"></div><button class="go" data-mv="cardtry">Try your card</button>':'<div style="height:26px"></div><button class="go" data-a="finish">Done</button>'),'win in')}
function finish(){S.tdraft=null;while(app.querySelectorAll(':scope > .scr').length>1)closeTop();var l=talkL;markRead(l);S.told[l.h]=WV.today();S.talks[l.h]=(S.talks[l.h]||[]).concat([{d:WV.today(),b:talkBeats,re:!!retell}]);retell=null;S.ring.talk=1;if(l===todayLesson())S.done=true;root()}
app.addEventListener('click',function(e){var b=e.target.closest('[data-col2],[data-rl],[data-tl]');if(!b)return;var d=b.dataset;
 if(d.col2!=null){colPage2(+d.col2);return}
 if(d.rl!=null){shut();var l=L[+d.rl];readLesson(l);return}
 if(d.tl!=null){shut();tell(L[+d.tl])}});
function fitAll(){requestAnimationFrame(function(){document.querySelectorAll('.poster').forEach(function(el){if(!el.clientWidth)return;var fs=parseFloat(getComputedStyle(el).fontSize),n=0;while(n<30&&(el.scrollWidth>el.clientWidth+1||el.clientHeight>fs*1.02*3.2)){fs-=2;el.style.fontSize=fs+'px';n++}})})}
REC=REC.filter(function(r){return byH(r[0])}).map(function(r){var l=byH(r[0]);return [r[0],r[1],l.f.replace('The Animal World','Animals')]});
function lessonSheet(l){var rd=l.state==='read';
 open('<button class="wx" data-a="closeTop" aria-label="Close">✕</button>'+'<img alt="" src="'+hero(l)+'" style="object-position:'+artFor(hero(l)).pos+'">'+'<h1 class="poster p2" style="margin:0 0 8px">'+l.t+'</h1><div class="meta">'+esc(l.f)+' · '+l.m+' min</div><button class="go" data-rl="'+l.i+'">Read</button>'+(rd?'<button class="ghost" data-tl="'+l.i+'">'+sayLabel(l)+'</button>':''),'lp reveal');fitAll()}
var PIN2=[[null,null,1,''],[.86,.2,2.3,'Salisbury sits in its jaws.'],[.31,.34,2.1,'Andover fills its chest.'],[.56,.8,2.3,'Marblehead curls into a talon.'],[.2,.86,2.4,'Chelsea hangs off like a spur.'],[null,null,1,'One state senate district.']];
function gmHtml(){return '<div class="prog"><i id="pb"></i></div><div class="rtop"><button data-a="closeRead" aria-label="Close">✕</button><button data-a="aa" aria-label="Text settings">Aa</button></div><div class="bfloat"><button class="bosb" data-a="tell" aria-label="Talk to Boswell">'+bosMini()+'</button></div>'+bosBar(' data-a="tell"')+'<div class="pin" id="pin"><div class="pinbox"><img id="pimg" alt="The Gerry-mander woodcut" src="'+H.hero+'"><div class="pintitle" id="pt"><h1 class="poster p1" style="margin:0">The Gerry&shy;mander</h1></div><div class="pincap" id="pc" style="opacity:0"></div></div></div><div class="lesson"><div class="txt"><p>A Boston newspaper printed this creature on 26 March 1812 and called it a new species of monster. Its body was a real place. The towns of northern Essex County had been strung into a single state senate district, a thin arc that began near Boston, climbed to the New Hampshire line and hooked east along the Merrimack to the sea. Nobody draws that shape to serve the people living inside it. Somebody drew it to decide what their votes would be worth.</p><p>The governor who signed it took the blame, and has kept it for two centuries. Elbridge Gerry had put his name to the Declaration of Independence and, in 1787, refused to put it on the Constitution. His son-in-law says he found the bill &ldquo;exceedingly disagreeable&rdquo; and thought of sending it back. He signed anyway, in February. He pronounced his name with a hard G, like Gary. The word softened; the insult stuck.</p></div><figure class="bleed" style="margin:8px 0 0"><img alt="Portrait of Elbridge Gerry" src="'+H.gerry+'"></figure><div class="txt"><p>The arithmetic deserves a minute, because it has not changed since. A district pays nothing extra for a landslide, so every vote past a majority is wasted, and so is every vote for a loser. The mapmaker&rsquo;s craft is making the other side waste more. Cram your opponents into a few districts they win by absurd margins, which is called packing. Scatter the rest so they lose everywhere else by a little, which is called cracking.</p><p>That April the Federalists won more votes across Massachusetts and took 11 senate seats. The party that drew the lines took 29.</p></div><div class="txt"><p>None of this would have surprised the men in Philadelphia. On 9 August 1787, twenty-five years before the woodcut, James Madison warned the Convention what state legislatures would do with control of elections:</p></div><div class="quote">&ldquo;they would take care so to mould their regulations as to favor the candidates they wished to succeed.&rdquo;</div><div class="txt"><p>So Article I lets each legislature set the &ldquo;Times, Places and Manner&rdquo; of House elections and lets Congress &ldquo;make or alter&rdquo; those rules. Congress has rarely bothered.</p><p>In 2016 North Carolina Republicans told their mapmaker to deliver ten seats to three, and Representative David Lewis said why on the record: &ldquo;I think electing Republicans is better than electing Democrats.&rdquo; Maryland Democrats had done the same to a Republican seat. Both cases reached the Supreme Court, and on 27 June 2019 it ruled 5&ndash;4 that partisan gerrymandering claims are &ldquo;beyond the reach of the federal courts.&rdquo;</p><p>Texas redrew its map in August 2025 for five more Republican seats. California&rsquo;s voters answered that November with five the other way. Today&rsquo;s fights run on the same logic as Essex County in 1812.</p></div><div class="use"><div class="poster p3" style="margin:0">Read any map</div><ol><li>Compare vote share with seat share. A wide gap is the first sign.</li><li>Ask who held the pen: a legislature, a commission, or a court.</li><li>Check the shape last. A tidy map can still be rigged.</li></ol><a href="https://planscore.org/" target="_blank" rel="noopener">Score a real map at PlanScore ↗</a></div><div class="say"><span class="eyebrow">Your line</span>Both parties do it, the federal courts have left the field, and the power Madison won for Congress is the one nobody uses.</div><div class="rend lend"><button class="lendb" data-a="tell">'+bosMini()+'<span>Talk to Boswell</span></button></div></div>'}
function reader(){
 autoTheme();var d=open(gmHtml(),'reader reveal');d._l=byH('gerrymander.html');readerChrome(d,function(){var p=d.querySelector('#pin');return p?p.offsetHeight-d.clientHeight:0});
 d.classList.toggle('sepia',S.theme==='sepia');d.classList.toggle('night',S.theme==='night');d.style.setProperty('--fs',S.fs);
 fitAll();
 var pin=d.querySelector('#pin'),im=d.querySelector('#pimg'),pc=d.querySelector('#pc'),pt=d.querySelector('#pt');
 function st(k,w,h0){var p=PIN2[k],iw=w,ih=w*1005/960,s=p[2];if(p[0]==null)return [0,h0*.07,1];return [w*.5-p[0]*iw*s,h0*.4-p[1]*ih*s,s]}
 function on(){var H0=d.clientHeight,w=d.clientWidth,max=pin.offsetHeight-H0,p=Math.min(1,Math.max(0,d.scrollTop/max)),seg=p*(PIN2.length-1),i=Math.min(PIN2.length-2,Math.floor(seg)),t=seg-i,e=t*t*(3-2*t),a=st(i,w,H0),b=st(i+1,w,H0);im.style.transform='translate('+(a[0]+(b[0]-a[0])*e)+'px,'+(a[1]+(b[1]-a[1])*e)+'px) scale('+(a[2]+(b[2]-a[2])*e)+')';pt.style.opacity=seg<.35?1:0;var k=Math.round(seg);if(k>0){pc.textContent=PIN2[k][3];pc.style.opacity=Math.abs(seg-k)<.34?1:0}else pc.style.opacity=0;document.getElementById('pb').style.width=(d.scrollTop/(d.scrollHeight-H0)*100)+'%'}
 var gl=byH('gerrymander.html');S.seen[gl.h]=Date.now();
 d.addEventListener('scroll',function(){requestAnimationFrame(on);requestAnimationFrame(function(){var mx=d.scrollHeight-d.clientHeight,p=mx>0?d.scrollTop/mx:0;if(p>(S.prog[gl.h]||0))S.prog[gl.h]=p;S.pos[gl.h]=p;if(p>.92&&gl.state!=='read'){markRead(gl);WV.save()}})},{passive:true});on();
}
var PAL=['#efe2c8','#c9b892','#9fb09a','#8fa3c4','#c7a0ae'],Pz={m:null,d:1,won:false};

function pzConn(d){var cells=[];Pz.m.forEach(function(v,i){if(v===d)cells.push(i)});if(!cells.length)return false;var seen={},st=[cells[0]];seen[cells[0]]=1;while(st.length){var c=st.pop();[c-5,c+5,c%5?c-1:-1,c%5<4?c+1:-1].forEach(function(n){if(n>=0&&n<50&&Pz.m[n]===d&&!seen[n]){seen[n]=1;st.push(n)}})}return Object.keys(seen).length===cells.length}
function pzDraw(){var sz=[0,0,0,0,0],r=[0,0,0,0,0];Pz.m.forEach(function(d,i){sz[d]++;if(i%5<2)r[d]++});var ch='',red=0,blue=0,ok=true;for(var d=0;d<5;d++){var b=sz[d]-r[d],w=sz[d]!==10?'?':r[d]>b?'Red':b>r[d]?'Blue':'Tie';if(w==='Red')red++;if(w==='Blue')blue++;if(sz[d]!==10||!pzConn(d))ok=false;ch+='<button data-dd="'+d+'" aria-pressed="'+(Pz.d===d)+'" style="background:'+PAL[d]+'">'+sz[d]+'<small>'+w+'</small></button>'}document.getElementById('dch').innerHTML=ch;
 Array.prototype.forEach.call(document.getElementById('pz').children,function(c,i){c.style.background=PAL[Pz.m[i]]});
 document.getElementById('ps').innerHTML='<span style="color:#ff6a55">Red '+red+'</span> · <span style="color:#6ea5f5">Blue '+blue+'</span>';document.getElementById('pn').textContent=ok?'Valid map':'Each district: 10, joined';
 var msg=ok&&red>=3?'That is a gerrymander. Same voters, 40% of the votes, 3 of 5 seats. Look at how many blue votes you wasted in your safe blue districts.':ok&&red===0?'Fair-looking lines, and red wins nothing. Pick a district, then drag across precincts to move them.':sz.some(function(x){return x!==10})?'Keep going until every district holds 10.':!ok?'A district has to be one joined piece.':'Closer. Pack blue into two districts.';document.getElementById('pm').textContent=msg}
app.addEventListener('click',function(e){var b=e.target.closest('[data-dd],[data-pz]');if(!b)return;if(b.dataset.dd!=null){Pz.d=+b.dataset.dd;pzDraw();return}if(b.dataset.pz==='reset'){Pz.m=MAPS[0].slice();pzDraw()}else{Pz.m=MAPS[1].slice();pzDraw()}});
S.cd='';
function vCards(){var any=C.some(function(x){return x.unl&&!x.del}),pool=C.filter(function(x){return x.unl&&!x.del&&!x.susp});
 var fam=FAMS.map(function(f){var n=pool.filter(function(c){return c.d===f[0]}).length;return n?'<button class="trow" data-tp="d:'+encodeURIComponent(f[0])+'" style="--fam:'+f[2]+'"><i></i><span>'+f[0]+'</span><b>'+n+'</b></button>':''}).join(''),nf=pool.filter(function(c){return c.flag||c.mark}).length;
 if(nf)fam+='<button class="trow" data-tp="f:1" style="--fam:var(--accent)"><i></i><span>Flagged</span><b>'+nf+'</b></button>';
 return '<div class="doc cards3 cards4"><div class="pad"><div class="top"><span class="unl">'+C.filter(function(x){return x.unl&&!x.del}).length+' of '+C.length+' unlocked</span><button class="addb" data-a="add" aria-label="Add card">+</button></div>'+istackHtml(null,'cards')+fcStrip()+(fam?'<div class="tlist">'+fam+'</div>':'')+'<div class="search">'+I.search.replace('<svg','<svg width="17" height="17" fill="none" stroke="currentColor" stroke-width="1.8"')+'<input id="bq" value="'+esc(S.q||'')+'" placeholder="Search" aria-label="Search cards"></div></div><div class="brw" id="bl"></div><div class="pad cpad"><div class="cfoot"><span>'+C.filter(function(x){return !x.del}).length+' cards</span><button data-a="opts">Settings</button></div></div></div>'}
function drawBrowse(){var q=S.q||'',el=document.getElementById('bl');if(!el)return;el.className='brw';
 var a=cardPool().filter(function(c){return !q||c.q.toLowerCase().indexOf(q)>-1||c.s.toLowerCase().indexOf(q)>-1});
 if(!a.length){el.innerHTML='<p class="bempty">'+(C.some(function(c){return c.unl})?'No cards match.':'Your cards appear here as you finish lessons.')+'</p>';return}
 el.innerHTML=q?carHtml(a.slice(0,40)):'<div class="covers">'+cardGroups(a).map(coverHtml).join('')+'</div>';fitFaces(el)}
function optsSheet(){var o=S.opts,row=function(k,t,step){return '<div class="flat"><span>'+t+'</span><span class="n3"><button data-o="'+k+','+(-step)+'" aria-label="Less">−</button><b id="o-'+k+'" style="font-weight:600">'+o[k]+(k==='ret'?'%':'')+'</b><button data-o="'+k+','+step+'" aria-label="More">+</button></span></div>'};sheet('<h3>Settings</h3>'+row('nw','New cards a day',1)+row('rv','Reviews a day',5)+row('ret','Desired recall',1)+'<div class="flat"><span>Answer aloud</span><button class="tog" role="switch" aria-label="Answer aloud" aria-checked="'+o.voice+'" data-a="voice"></button></div><div class="flat"><span>Appearance</span><div class="seg" role="group" aria-label="Appearance">'+[['light','Light'],['dark','Dark'],['system','System']].map(function(x){return '<button data-look="'+x[0]+'" aria-pressed="'+((o.look||'dark')===x[0])+'">'+x[1]+'</button>'}).join('')+'</div></div><button class="flat" data-a="vx"><span>Versions</span><span class="chev">›</span></button><button class="flat" data-a="bk"><span>Back up progress</span><span class="chev">›</span></button><button class="flat" data-a="rs"><span>Restore from a backup</span><span class="chev">›</span></button><button class="flat danger" data-a="wipe">Clear saved progress</button>')}
function editSheet(c){sheet('<h3>Edit card</h3><textarea class="field" id="etxt">'+esc(c.q)+'</textarea><div style="height:12px"></div><button class="pri ink" data-save="'+c.i+'">Save</button>'+(c.susp?'<button class="flat" data-unsusp="'+c.i+'">Show this card again</button>':''));}
function addSheet(){S.adeck=S.cd&&S.cd!=='Flagged'?S.cd:(S.adeck||'Arts');sheet('<h3>New card</h3><div class="lab">Topic</div><div class="chips adk" role="group" aria-label="Topic">'+FAMS.map(function(f){return '<button data-ad="'+f[0]+'" aria-pressed="'+(S.adeck===f[0])+'" style="--fam:'+f[2]+'"><i></i>'+f[0]+'</button>'}).join('')+'</div><textarea class="field" id="atxt" placeholder="Type the fact, then select the word to hide"></textarea><p class="addhint">Select the word the card should ask for, then tap Hide a word.</p><button class="sec" data-a="hideword">Hide a word</button><div style="height:8px"></div><button class="pri ink" data-a="saveadd">Add card</button>')}
function tools(){var c=S.sess.q[0];sheet('<div class="group"><button class="row" data-c="undo">Undo</button><button class="row" data-c="edit">Edit</button><button class="row" data-c="flag">'+(c.flag?'Remove flag':'Flag')+'</button><button class="row" data-c="bury">Skip until tomorrow</button><button class="row" data-c="susp">Stop showing</button></div>')}
app.addEventListener('click',function(e){var b=e.target.closest('[data-cd],[data-a="revnow"]');if(!b)return;if(b.dataset.cd!=null){S.cd=b.dataset.cd;root();return}if(S.cd==='Flagged')study(null,'flag');else study(S.cd||null)});
function weekly(){var w=new Array(12).fill(0),t=WV.today();Object.keys(S.readAt).forEach(function(h){var k=Math.floor((t-S.readAt[h])/7);if(k>=0&&k<12)w[11-k]++});return w}
function chartFor(t){var W=358,H2=170,pb=22,pt=8,pl=26;
 if(t==='Streak'){var h='',t=WV.today(),on={};S.days.forEach(function(x){on[x]=1});for(var j=0;j<7;j++){var wd=new Date(((t-34+j)*864e5)+144e5+new Date().getTimezoneOffset()*6e4);h+='<b>'+'SMTWTFS'.charAt(wd.getDay())+'</b>'}for(var i=0;i<35;i++){var dn=t-34+i,dt=new Date((dn*864e5)+144e5+new Date().getTimezoneOffset()*6e4);h+='<i class="'+(on[dn]?'on':'')+'">'+dt.getDate()+'</i>'}return '<div class="chh"><span class="poster">'+streak()+'</span><span>'+(streak()===1?'day':'days')+' now</span></div><div class="cal">'+h+'</div>'}
 if(t==='Lessons'){var w=weekly(),mx=Math.max(1,Math.max.apply(0,w)),ch=H2-pb-pt,bw=(W-pl)/12,g='';[0,mx].forEach(function(v){var y=pt+ch-(v/mx*ch);g+='<line x1="'+pl+'" x2="'+W+'" y1="'+y+'" y2="'+y+'" /><text x="0" y="'+(y+4)+'">'+v+'</text>'});w.forEach(function(v,i){var h=v/mx*ch;g+='<rect x="'+(pl+i*bw+3)+'" y="'+(pt+ch-h)+'" width="'+(bw-6)+'" height="'+h+'" rx="2"/>'});g+='<text x="'+pl+'" y="'+(H2-4)+'">12 weeks ago</text><text x="'+W+'" y="'+(H2-4)+'" text-anchor="end">This week</text>';return '<div class="chh"><span class="poster">'+w[11]+'</span><span>this week</span></div><svg class="chart" viewBox="0 0 '+W+' '+H2+'" width="100%">'+g+'</svg>'}
 var ch=H2-pb-pt,wk=recallWeeks(),pts=wk.map(function(v,i){return v==null?null:[pl+(W-pl-6)*i/11,v]}).filter(Boolean);if(!pts.length)return '<div class="chh"><span>Recall shows here once you review cards that are due.</span></div>';var yy=function(v){return pt+ch-((v-50)/50*ch)},d='M'+pts.map(function(q){return q[0].toFixed(1)+','+yy(Math.max(50,q[1])).toFixed(1)}).join('L'),g='',last=pts[pts.length-1];[50,75,100].forEach(function(v){g+='<line x1="'+pl+'" x2="'+W+'" y1="'+yy(v)+'" y2="'+yy(v)+'" /><text x="0" y="'+(yy(v)+4)+'">'+v+'</text>'});g+=(pts.length>1?'<path class="l" d="'+d+'"/>':'')+'<circle cx="'+last[0]+'" cy="'+yy(Math.max(50,last[1]))+'" r="4.5" class="dot"/><text x="'+pl+'" y="'+(H2-4)+'">12 weeks ago</text><text x="'+W+'" y="'+(H2-4)+'" text-anchor="end">This week</text>';return '<div class="chh"><span class="poster">'+Math.round(last[1])+'%</span><span>recall on due cards</span></div><svg class="chart" viewBox="0 0 '+W+' '+H2+'" width="100%">'+g+'</svg>'}

function isoDay(){var d=new Date(Date.now()-144e5);return d.getFullYear()+'-'+('0'+(d.getMonth()+1)).slice(-2)+'-'+('0'+d.getDate()).slice(-2)}
function todayLesson(){var l=byH('scurvy-trial.html')||L[0];l.d=isoDay();return l}
function slug(l){return l.h.replace(/\.html$/,'')}
function hero(l){return 'img/h/'+slug(l)+'.webp'}
function minsLeft(l){return Math.max(1,Math.ceil(l.m*(1-(S.prog[l.h]||0))))}
function streak(){var d={},t=WV.today(),n=0;S.days.forEach(function(x){d[x]=1});if(!d[t])t--;while(d[t]){n++;t--}return n}
function cardRing(){var c=counts(),left=c.l+c.r;return S.reviewed+left?S.reviewed/(S.reviewed+left):0}
function markRead(l){var t=WV.today();if(l.state!=='read'){l.state='read';S.readAt[l.h]=t}l.fade=1;S.prog[l.h]=1;if(S.days.indexOf(t)<0)S.days.push(t);
 C.forEach(function(c){if(c.h===l.h)c.unl=true});if(l===todayLesson())S.ring.read=1}
var LSN_THEME=[
 ":host(.lhost){--t-2:calc(clamp(0.6875rem,0.5057rem + 0.909vw,0.75rem) * var(--fs,1));--t-1:calc(clamp(0.8125rem,0.6307rem + 0.909vw,0.875rem) * var(--fs,1));--t0:calc(clamp(1rem,0.8182rem + 0.909vw,1.0625rem) * var(--fs,1));--t1:calc(clamp(1.125rem,0.8523rem + 1.36vw,1.219rem) * var(--fs,1));--t2:calc(clamp(1.3125rem,0.9489rem + 1.82vw,1.4375rem) * var(--fs,1));--t3:calc(clamp(1.625rem,1.08rem + 2.73vw,1.8125rem) * var(--fs,1));--t4:calc(clamp(2rem,0.9091rem + 5.45vw,2.375rem) * var(--fs,1));--t-read:calc(clamp(1.0625rem,0.8807rem + 0.909vw,1.125rem) * var(--fs,1))}",
 ".wvb a.wv-ext{color:inherit;border-bottom:1px dashed color-mix(in oklch,var(--accent) 70%,transparent)}.wvb .wv-exti{color:var(--accent);font-family:var(--sans);font-size:.8em}",
 ":host(.lhost){display:block;--bg:var(--rbg);--ink:var(--rink);--muted:var(--rsub);--rule:var(--rrule);--rule-soft:color-mix(in oklch,var(--rrule) 55%,var(--rbg));--soft:var(--rsoft);--accent:var(--racc);--plate:var(--rplate);--pop:var(--rpop);--serif:-apple-system,BlinkMacSystemFont,\"SF Pro Text\",\"Helvetica Neue\",Arial,sans-serif;--sans:-apple-system,BlinkMacSystemFont,\"SF Pro Text\",\"Helvetica Neue\",Arial,sans-serif;--poster:\"Anton\",\"Arial Narrow\",Impact,sans-serif;--g:var(--gut,20px);--wall:#0b0a09;color-scheme:light}",
 ":host(.lhost.night){color-scheme:dark}",
 ".wvb{background:var(--bg);color:var(--ink);font-family:var(--serif);text-rendering:optimizeLegibility;-webkit-font-smoothing:antialiased}",
 ".wvb .folio,.wvb .spread{max-width:none;padding:var(--s5,24px) var(--g) var(--s6,32px)}",
 ".wvb h1,.wvb .rule{display:none}",
 ".wvb{font-family:var(--sans)}",
 ".wvb .deck{font-style:normal!important;font-weight:500;max-width:40ch;color:var(--ink)}",
 ".wvb .body p,.wvb ol.steps li{hyphens:manual!important;-webkit-hyphens:manual!important;line-height:1.55!important}",
 ".wvb em,.wvb i{font-style:italic}",
 ".wvb .read{background:var(--soft)!important;border:0!important;border-radius:18px!important;padding:var(--s5) var(--s4)!important}",
 ".wvb .read-body{border:0!important;padding-left:0!important}",
 ".wvb .read-source,.wvb .watch-cap{font-style:normal!important}",
 ".wvb .watch{background:var(--soft)!important;border:0!important;border-radius:18px!important;padding:var(--s4)!important}",
 ".wvb table.compare th{font:400 var(--t1)/1.1 var(--poster);text-transform:uppercase;letter-spacing:.01em}",
 ".wvb .em-label{font:400 var(--t1)/1.1 var(--poster);text-transform:uppercase;letter-spacing:.01em;color:var(--ink)}",
 ".wvb .kicker{text-align:left;margin:0 0 var(--s2);font:600 var(--t-2)/1.3 var(--sans);letter-spacing:.12em;text-transform:uppercase;color:var(--accent)}",
 ".wvb .deck{text-align:left;margin:0 0 var(--s5);max-width:36ch;font-size:var(--t1);line-height:1.45;font-style:italic;color:var(--muted);text-wrap:pretty}",
 ".wvb .body>*{max-width:65ch;margin-left:0;margin-right:0}",
 ".wvb .body>figure{max-width:none}",
 ".wvb .body p,.wvb ol.steps li{font-size:var(--t-read);line-height:1.65;text-align:left;hyphens:auto;-webkit-hyphens:auto;text-wrap:pretty}",
 ".wvb .body p{margin:0 0 1.05em;max-width:65ch}",
 ".wvb a{text-decoration:none}",
 ".wvb .body p a,.wvb .body li a{color:inherit;border-bottom:1px solid color-mix(in oklch,var(--accent) 70%,transparent)}",
 ".wvb .dingbat{color:var(--accent);margin:var(--s6) 0;text-align:center;letter-spacing:.6em}",
 ".wvb .divider{display:block;margin:var(--s7) 0 var(--s4);border:0;max-width:65ch}",
 ".wvb .divider hr{display:none}",
 ".wvb .divider span{display:block;font:400 var(--t3)/1.02 var(--poster);text-transform:uppercase;letter-spacing:.005em;color:var(--ink);text-wrap:balance}",
 ".wvb figure{margin:var(--s6) 0}",
 ".wvb figure.plate,.wvb figure.hero{max-width:none;margin-left:calc(var(--g) * -1);margin-right:calc(var(--g) * -1)}",
 ".wvb figure.plate .frame{padding:0;background:none;border-radius:0}",
 ".wvb figure.plate .frame.mat{padding:12px;background:var(--mat,#f2ede4)}",
 ".wvb figure.plate img{display:block;width:100%;height:auto}",
 ".wvb figcaption,.wvb .watch-cap{margin:var(--s3) var(--g) 0;text-align:left;font:400 var(--t-1)/1.5 var(--sans);font-style:normal;color:var(--muted);text-wrap:pretty}",
 ".wvb .credit{display:block;margin-top:var(--s1);font:400 var(--t-2)/1.45 var(--sans);font-style:normal;opacity:1;color:var(--muted)}",
 ".wvb .credit a{color:inherit;border-bottom:1px solid color-mix(in oklch,var(--muted) 45%,transparent)}",
 ".wvb .imgnote{font:400 var(--t-2)/1.4 var(--sans);opacity:1;color:var(--muted)}",
 ".wvb .wv-herodup{margin-top:0}.wvb .wv-herodup .frame{display:none}.wvb .wv-herodup figcaption{margin-top:0}",
 ".wvb figure.diagram .frame{border-radius:12px;background:var(--soft);border-color:var(--rule)}",
 ".wvb .strip{display:block;border:0;margin:var(--s5) 0 var(--s6);padding:0;max-width:65ch}",
 ".wvb .strip>div{display:flex;justify-content:space-between;align-items:baseline;gap:var(--s4);padding:var(--s3) 0;border-top:1px solid var(--rule)}",
 ".wvb .strip>div:last-child{border-bottom:1px solid var(--rule)}",
 ".wvb .strip .label{margin:0;flex:none;font:400 var(--t-1)/1.35 var(--sans);letter-spacing:0;text-transform:none;color:var(--muted)}",
 ".wvb .strip .value{margin:0;font:500 var(--t-1)/1.35 var(--sans);text-align:right;color:var(--ink)}",
 ".wvb .card{border:0;border-radius:0;background:none;padding:0;margin:var(--s7) 0 var(--s6);max-width:65ch}",
 ".wvb .lead-num{margin:0 0 var(--s2);font:400 var(--t4)/1 var(--poster);color:var(--accent);letter-spacing:0;font-variant-numeric:tabular-nums}",
 ".wvb .lead{margin:0 0 var(--s4);font:500 var(--t1)/1.4 var(--serif);font-style:normal;color:var(--ink);text-wrap:pretty}",
 ".wvb ul.recipe{list-style:none;margin:0;padding:0;border-top:1px solid var(--rule)}",
 ".wvb .recipe li{display:grid;grid-template-columns:minmax(2.6em,auto) 1fr;gap:var(--s3);padding:var(--s3) 0;border-bottom:1px solid var(--rule);font:400 var(--t-1)/1.5 var(--sans);color:var(--ink)}",
 ".wvb .recipe li::before{display:none}",
 ".wvb .recipe .amt{font:600 var(--t-1)/1.5 var(--sans);font-variant-numeric:tabular-nums;color:var(--accent);white-space:nowrap}",
 ".wvb .recipe-meta{margin:var(--s3) 0 0;font:400 var(--t-1)/1.55 var(--sans);font-style:normal;color:var(--muted)}",
 ".wvb .variation{display:block;padding:var(--s3) 0;margin:0;border:0;border-top:1px solid var(--rule)}",
 ".wvb .variation>div:first-child{display:flex;align-items:baseline;flex-wrap:wrap;gap:0 .5em;margin-bottom:2px}",
 ".wvb .v-name{font:600 var(--t0)/1.3 var(--sans);color:var(--ink)}",
 ".wvb .pron{font:italic 400 var(--t-1)/1.3 var(--serif);color:var(--muted)}",
 ".wvb div.gloss{display:block;font:400 var(--t-1)/1.55 var(--sans);color:var(--ink);text-decoration:none;cursor:auto}",
 ".wvb .fam{border-color:var(--rule)}.wvb .fam-name{font-family:var(--sans);font-weight:600}.wvb .fam-note{font-family:var(--sans);font-size:var(--t-1);color:var(--muted)}",
 ".wvb .read,.wvb .listen,.wvb .watch,.wvb .callout,.wvb .spec,.wvb .figures{margin:var(--s7) 0;padding:0;border:0;background:none;border-radius:0;max-width:65ch}",
 ".wvb .read-head,.wvb .listen-head,.wvb .watch-head{display:flex;flex-direction:column;align-items:flex-start;gap:2px;margin:0 0 var(--s3);padding:0;border:0}",
 ".wvb .wv-hl,.wvb .co-label{display:inline-flex;align-items:center;gap:7px;margin:0;font:600 var(--t-1)/1.25 var(--sans);letter-spacing:0;text-transform:none;color:var(--accent)}",
 ".wvb .wv-hl svg{width:18px;height:18px;flex:none}",
 ".wvb .read-head .who,.wvb .listen-head .who,.wvb .watch-who{font:400 var(--t-1)/1.4 var(--sans);font-style:normal;letter-spacing:0;text-transform:none;color:var(--muted)}",
 ".wvb .read-body,.wvb .listen-body,.wvb .co-text{padding:0 0 0 var(--s4);border-left:2px solid var(--accent);font-size:var(--t-read);line-height:1.7}",
 ".wvb .read-body p,.wvb .listen-body p{margin:0 0 .8em}",
 ".wvb .co-title{margin:var(--s2) 0;font:500 var(--t1)/1.35 var(--serif)}",
 ".wvb .co-note,.wvb .co-attr{font:400 var(--t-1)/1.55 var(--sans);color:var(--muted);font-style:normal}",
 ".wvb .read-source,.wvb .watch-source,.wvb .read-crib,.wvb .spec-note,.wvb .figures-cap,.wvb .listen-source{margin-top:var(--s3);font:400 var(--t-1)/1.5 var(--sans);font-style:normal;color:var(--muted)}",
 ".wvb .learn-more a,.wvb table.index a,.wvb .co-link a,.wvb .read-source a,.wvb .watch-source a,.wvb .watch-cap a,.wvb .read-crib a,.wvb .listen-link a{color:var(--accent);font-family:var(--sans);font-weight:600;border:0}",
 ".wvb .watch-embed,.wvb .co-link,.wvb .listen-link{margin:var(--s3) 0 0}",
 ".wvb .wv-video,.wvb .co-link a,.wvb .listen-link a{display:inline-flex;align-items:center;gap:10px;min-height:44px;padding:10px 18px 10px 14px;border-radius:22px;background:var(--soft);color:var(--ink);font:600 var(--t-1)/1.3 var(--sans);border:0}",
 ".wvb .wv-video::before,.wvb .co-link a::before,.wvb .listen-link a::before{content:\"\";flex:none;width:0;height:0;border-left:10px solid var(--accent);border-top:6.5px solid transparent;border-bottom:6.5px solid transparent;margin-left:2px}",
 ".wvb .watch-frame{border-radius:12px;overflow:hidden}",
 ".wvb blockquote,.wvb .pull{margin:var(--s6) 0;max-width:65ch;padding:0 0 0 var(--s4);border-left:2px solid var(--accent);font:italic 400 var(--t2)/1.4 var(--serif);color:var(--ink)}",
 ".wvb table.compare,.wvb table.spec-table,.wvb table.fig{width:100%;border-collapse:collapse;font:400 var(--t-1)/1.45 var(--sans);font-variant-numeric:tabular-nums}",
 ".wvb .compare th,.wvb .spec-table th{font:600 var(--t-2)/1.3 var(--sans);letter-spacing:.02em;text-transform:none;color:var(--muted);text-align:left;padding:0 var(--s3) var(--s2) 0;border:0;border-bottom:1px solid var(--rule)}",
 ".wvb .compare td,.wvb .spec-table td,.wvb .fig td{padding:var(--s3) var(--s3) var(--s3) 0;border:0;border-bottom:1px solid var(--rule);vertical-align:top;color:var(--ink);font:400 var(--t-1)/1.45 var(--sans)}",
 ".wvb .compare td:last-child,.wvb .spec-table td:last-child,.wvb .fig td:last-child{padding-right:0}",
 ".wvb .fig td:last-child{text-align:right;font-weight:600;white-space:nowrap}",
 ".wvb .spec-label,.wvb .figures-head{margin:0 0 var(--s2);font:600 var(--t-1)/1.3 var(--sans);letter-spacing:0;text-transform:none;color:var(--ink)}",
 ".wvb .lead,.wvb .region{font-family:var(--serif)}.wvb .region{font-size:var(--t2)}",
 ".wvb ol.steps{list-style:none;counter-reset:wvst;margin:var(--s5) 0;padding:0;max-width:65ch;border-bottom:1px solid var(--rule)}",
 ".wvb ol.steps li{counter-increment:wvst;display:grid;grid-template-columns:2.4em 1fr;column-gap:var(--s2);padding:var(--s3) 0;margin:0;border-top:1px solid var(--rule)}",
 ".wvb ol.steps li::before{content:counter(wvst);font:400 var(--t3)/1 var(--poster);color:var(--accent);padding-top:.1em}",
 ".wvb ol.steps li>*{grid-column:2}",
 ".wvb ol.steps strong{font-weight:600}",
 ".wvb button.gloss{text-decoration-line:underline;text-decoration-style:dotted;text-decoration-color:color-mix(in oklch,var(--accent) 80%,transparent);text-decoration-thickness:1.5px;text-underline-offset:4px;border-radius:3px;transition:background-color 160ms cubic-bezier(.165,.84,.44,1)}",
 ".wvb button.gloss[data-open=\"true\"]{background:color-mix(in oklch,var(--accent) 14%,transparent)}",
 ".wvb .gloss-body{background:var(--pop);color:var(--ink);border:.5px solid var(--rule);border-radius:14px;padding:var(--s3) var(--s4);width:288px;font:400 var(--t-1)/1.5 var(--sans);box-shadow:0 1px 2px rgba(0,0,0,.08),0 8px 24px rgba(0,0,0,.14),0 24px 48px rgba(0,0,0,.12)}",
 ".wvb .gloss-body::before{background:var(--pop);border-color:var(--rule)}",
 ".wvb .gloss[data-open=\"true\"]>.gloss-body{animation:wvpop 200ms cubic-bezier(.165,.84,.44,1) backwards}",
 "@keyframes wvpop{from{opacity:0;translate:0 calc(var(--lift,12px) / 3)}}",
 ".wvb .gloss-kind{font:600 var(--t-2)/1.3 var(--sans);letter-spacing:.06em;color:var(--accent)}",
 ".wvb .endmatter{max-width:65ch;margin:var(--s7) 0 0;padding:var(--s2) 0 0;border-top:0}",
 ".wvb .em-label{margin:var(--s5) 0 var(--s2);font:600 var(--t-1)/1.3 var(--sans);letter-spacing:0;text-transform:none;color:var(--muted)}",
 ".wvb .learn-more{margin:0;border-top:1px solid var(--rule);border-bottom:1px solid var(--rule)}",
 ".wvb .learn-more a{display:flex;align-items:center;min-height:52px;padding:var(--s3) 0;font:500 var(--t0)/1.4 var(--sans);color:var(--ink)}",
 ".wvb table.index{display:block;width:100%;border-collapse:collapse}",
 ".wvb table.index tbody{display:block}",
 ".wvb table.index tr{display:flex;flex-direction:column;gap:2px;padding:var(--s3) 0;border-top:1px solid var(--rule)}",
 ".wvb table.index tr:last-child{border-bottom:1px solid var(--rule)}",
 ".wvb table.index td{display:block;width:auto!important;padding:0;border:0;font:400 var(--t-1)/1.45 var(--sans);color:var(--ink)}",
 ".wvb table.index td:last-child a{font-weight:600}",
 ".wvb .site-head{display:none}",
 "@media (max-width:400px){.wvb .variation,.wvb .fam{grid-template-columns:1fr;gap:var(--s1)}}",
 ":host(.r2) .wvb{font-family:var(--sans)}",
 ":host(.r2) .wvb .kicker{display:none}",
 ":host(.r2) .wvb .deck{font:500 var(--t1)/1.45 var(--sans);color:var(--muted);max-width:none;font-style:normal;letter-spacing:-.01em}",
 ":host(.r2) .wvb .body p,:host(.r2) .wvb ol.steps li{font-family:var(--sans);line-height:1.6;letter-spacing:-.006em;hyphens:manual;-webkit-hyphens:manual}",
 ":host(.r2) .wvb .divider{margin:var(--s7) 0 var(--s3)}",
 ":host(.r2) .wvb .divider span{font:700 var(--t2)/1.2 var(--sans);text-transform:none;letter-spacing:-.02em}",
 ":host(.r2) .wvb figure.plate,:host(.r2) .wvb figure.hero{margin-left:0;margin-right:0}",
 ":host(.r2) .wvb figure.plate .frame{border-radius:16px;overflow:hidden}",
 ":host(.r2) .wvb figcaption{margin-left:0;margin-right:0}",
 ":host(.r2) .wvb .read,:host(.r2) .wvb .listen,:host(.r2) .wvb .watch,:host(.r2) .wvb .callout{background:var(--soft);border-radius:18px;padding:var(--s4) var(--s4) var(--s4)}",
 ":host(.r2) .wvb .read-body,:host(.r2) .wvb .listen-body,:host(.r2) .wvb .co-text{border:0;padding:0}",
 ":host(.r2) .wvb .wv-video,:host(.r2) .wvb .co-link a,:host(.r2) .wvb .listen-link a{background:var(--bg)}",
 ":host(.r2) .wvb .lead-num{font:700 var(--t-1)/1 var(--sans);letter-spacing:.06em;margin-bottom:var(--s2)}",
 ":host(.r2) .wvb .lead{font:700 var(--t2)/1.25 var(--sans);letter-spacing:-.02em}",
 ":host(.r2) .wvb ol.steps li::before{content:counter(wvst);width:26px;height:26px;border-radius:50%;display:grid;place-items:center;padding:0;margin-top:.15em;font:700 var(--t-2)/1 var(--sans);background:var(--ink);color:var(--bg)}",
 ":host(.r2) .wvb button.gloss{text-decoration:none;background:color-mix(in oklch,var(--accent) 16%,transparent);border-radius:4px;padding:0 2px;-webkit-box-decoration-break:clone;box-decoration-break:clone}",
 ":host(.r2) .wvb blockquote,:host(.r2) .wvb .pull{border-left-width:3px;font:600 var(--t2)/1.35 var(--sans);font-style:normal;letter-spacing:-.015em}",
 ":host(.r2) .wvb .strip>div{border-color:var(--rule)}",
 ":host(.r3) .wvb .deck{font:400 var(--t2)/1.4 var(--serif);font-style:normal;color:var(--ink);max-width:none}",
 ":host(.r3) .wvb .body p{font-size:calc(var(--t-read) * 1.04);line-height:1.72}",
 ":host(.r3) .wvb .body>p.wv-lede::first-letter{float:left;font:400 calc(var(--t-read) * 4.3)/.8 var(--poster);color:var(--accent);margin:.07em .1em 0 0}",
 ":host(.r3) .wvb figure.plate{background:var(--wall);padding:var(--s6) 0 var(--s5);margin:var(--s7) calc(var(--g) * -1)}",
 ":host(.r3) .wvb figure.plate figcaption{color:rgba(251,247,240,.8)}",
 ":host(.r3) .wvb figure.plate .credit,:host(.r3) .wvb figure.plate .credit a{color:rgba(251,247,240,.66)}",
 ":host(.r3) .wvb figure.plate img{max-height:82vh;width:auto;max-width:100%;margin:0 auto}",
 ":host(.r3) .wvb figure.plate.wv-herodup{background:none;padding:0}",
 ":host(.r3) .wvb figure.plate.wv-herodup figcaption{color:var(--muted)}",
 ":host(.r3) .wvb figure.plate.wv-herodup .credit,:host(.r3) .wvb figure.plate.wv-herodup .credit a{color:var(--muted)}",
 ":host(.r3) .wvb .divider{text-align:center;margin:var(--s8) auto var(--s5)}",
 ":host(.r3) .wvb .divider::before{content:\"\";display:block;width:40px;height:2px;margin:0 auto var(--s4);background:var(--accent)}",
 ":host(.r3) .wvb .divider span{font:italic 400 var(--t3)/1.2 var(--serif);text-transform:none}",
 ":host(.r3) .wvb .lead-num{font-size:var(--t6);line-height:.9}",
 ":host(.r3) .wvb .read,:host(.r3) .wvb .listen,:host(.r3) .wvb .watch,:host(.r3) .wvb .callout{background:var(--soft);margin-left:calc(var(--g) * -1);margin-right:calc(var(--g) * -1);padding:var(--s6) var(--g);max-width:none}",
 ":host(.r3) .wvb .read-body,:host(.r3) .wvb .co-text{border:0;padding:0;font-size:var(--t1);font-style:italic;line-height:1.6}",
 ":host(.r3) .wvb .wv-video,:host(.r3) .wvb .co-link a,:host(.r3) .wvb .listen-link a{background:var(--bg)}",
 ":host(.r3) .wvb blockquote,:host(.r3) .wvb .pull{border:0;padding:0;text-align:center;font:400 var(--t4)/1.05 var(--poster);text-transform:uppercase;color:var(--accent)}",
 ":host(.r3) .wvb ol.steps li::before{font-size:var(--t4)}",
 ":host(.lhost) .wvb .body p.recipe-meta{margin:var(--s3) 0 0;font:400 var(--t-1)/1.55 var(--sans);font-style:normal;color:var(--muted)}",
 ":host(.lhost) .wvb .body p.co-note{font:400 var(--t-1)/1.55 var(--sans);font-style:normal;color:var(--muted)}",
 ":host(.lhost) .wvb .body p.co-attr{font:400 var(--t-1)/1.55 var(--sans);font-style:normal;color:var(--muted)}",
 ":host(.lhost) .wvb .body p.co-title{margin:var(--s2) 0;font:500 var(--t1)/1.35 var(--serif)}",
 ":host(.lhost) .wvb .body p.lead{margin:0 0 var(--s4);font:500 var(--t1)/1.4 var(--serif);font-style:normal;color:var(--ink)}",
 ":host(.lhost) .wvb .body p.lead-num{margin:0 0 var(--s2);font:400 var(--t4)/1 var(--poster);color:var(--accent)}",
 ":host(.lhost) .wvb .body p.read-source{margin-top:var(--s3);font:400 var(--t-1)/1.5 var(--sans);font-style:normal;color:var(--muted)}",
 ":host(.lhost) .wvb .body p.watch-cap{margin:var(--s3) 0 0;font:400 var(--t-1)/1.5 var(--sans);font-style:normal;color:var(--muted)}",
 ":host(.lhost) .wvb .body p.spec-note{margin-top:var(--s3);font:400 var(--t-1)/1.5 var(--sans);color:var(--muted)}",
 ":host(.lhost) .wvb .body p.figures-cap{margin-top:var(--s3);font:400 var(--t-1)/1.5 var(--sans);color:var(--muted)}",
 ":host(.lhost) .wvb .body p.read-crib{margin-top:var(--s3);font:400 var(--t-1)/1.5 var(--sans);color:var(--muted)}",
 ":host(.lhost) .wvb .body p.spec-label{margin:0 0 var(--s2);font:600 var(--t-1)/1.3 var(--sans);color:var(--ink)}",
 ":host(.lhost) .wvb .body p.co-link{margin:var(--s3) 0 0}",
 ":host(.lhost) .wvb .body p.listen-link{margin:var(--s3) 0 0}",
 ":host(.lhost) .wvb .body p.label{margin:0;font:400 var(--t-1)/1.35 var(--sans);color:var(--muted)}",
 ":host(.lhost) .wvb .body p.value{margin:0;font:500 var(--t-1)/1.35 var(--sans);text-align:right;color:var(--ink)}",
 ":host(.lhost) .wvb .body p.co-link a,.wvb .body p.listen-link a{border:0;color:var(--ink)}",
 ":host(.r2) .wvb .body p.lead-num{font:700 var(--t-1)/1 var(--sans);letter-spacing:.06em}",
 ":host(.r2) .wvb .body p.lead{font:700 var(--t2)/1.25 var(--sans);letter-spacing:-.02em}",
 ":host(.r3) .wvb .body p.lead-num{font-size:var(--t6);line-height:.9}",
 ":host(.lhost) .wvb table.spec-table td,:host(.lhost) .wvb table.compare td,:host(.lhost) .wvb table.fig td{font-family:var(--sans);font-size:var(--t-1);color:var(--ink)}",
 ":host(.r2) .wvb .wv-hl,:host(.r3) .wvb .wv-hl,:host(.r2) .wvb .co-label,:host(.r3) .wvb .co-label{color:var(--ink)}",
 ":host(.r2) .wvb .wv-hl svg,:host(.r3) .wvb .wv-hl svg{color:var(--accent)}"
].join('');
function syncHost(){var h=document.getElementById('lh');if(!h)return;h.className='lhost '+(S.theme||'paper')+' r'+vx().R;h.style.setProperty('--fs',S.fs);var r=h.closest('.reader');if(r){r.classList.toggle('sepia',S.theme==='sepia');r.classList.toggle('night',S.theme==='night')}}
function applyLook(){var v=S.opts.look||'dark',r=document.documentElement;if(v==='system')r.removeAttribute('data-theme');else r.setAttribute('data-theme',v);
 var m=document.querySelector('meta[name="theme-color"]');if(!m){m=document.createElement('meta');m.name='theme-color';document.head.appendChild(m)}
 m.content=getComputedStyle(r).getPropertyValue('--bg').trim()||'#12100e'}
app.addEventListener('click',function(e){var b=e.target.closest('[data-look]');if(!b)return;S.opts.look=b.dataset.look;applyLook();b.parentNode.querySelectorAll('[data-look]').forEach(function(x){x.setAttribute('aria-pressed',x===b)})});
if(window.matchMedia)try{matchMedia('(prefers-color-scheme: dark)').addEventListener('change',function(){if(S.opts.look==='system')applyLook()})}catch(e){}
function lookDark(){var v=S.opts.look||'dark';return v==='dark'||(v==='system'&&window.matchMedia&&matchMedia('(prefers-color-scheme: dark)').matches)}
function autoTheme(){if(!S.opts.thSet)S.theme=''}
function readerChrome(d,heroH){var last=0,raf=0;d.addEventListener('scroll',function(){if(raf)return;raf=requestAnimationFrame(function(){raf=0;var y=d.scrollTop;d.classList.toggle('rt-band',y>heroH());if(Math.abs(y-last)>6){d.classList.toggle('rt-hide',y>last&&y>160);last=y}})},{passive:true})}
var MVPL={'scurvy-trial':1};function lsnUrl(l){var k=slug(l);return MVPL[k]?'/well-versed/mvp/lessons/'+k+'.html?v=r7':'lessons/'+k+'.html'}
function readLesson(l){
 if(l.h==='gerrymander.html'){reader();return}
 S.seen[l.h]=Date.now();autoTheme();
 var d=open('<div class="prog"><i id="pb"></i></div><div class="rtop"><button data-a="closeRead" aria-label="Close">✕</button><button data-a="aa" aria-label="Text settings">Aa</button></div><div class="bfloat"><button class="bosb" data-tl="'+l.i+'" aria-label="Talk to Boswell">'+bosMini()+'</button></div>'+bosBar(' data-tl="'+l.i+'"')+lessonHero(l)+'<div id="lh" class="lhost"></div><div class="lend" id="le" hidden><button class="lendb" data-tl="'+l.i+'">'+bosMini()+'<span>Talk to Boswell</span></button>'+upNext(l)+'</div>','reader reveal');d._l=l;
 d.style.setProperty('--fam',famOf(l.f)[2]);syncHost();readerChrome(d,function(){var h=d.querySelector('.lhero');return h?h.offsetHeight-60:0});var host=d.querySelector('#lh'),pb=d.querySelector('#pb'),sh=host.attachShadow({mode:'open'}),ready=false,pinning=false;
 function prog(){if(!ready)return;var mx=d.scrollHeight-d.clientHeight,p=mx>0?d.scrollTop/mx:0;pb.style.width=(p*100)+'%';S.pos[l.h]=p;if(!pinning)S.anc[l.h]=anchorOf(d,sh);if(p>(S.prog[l.h]||0))S.prog[l.h]=p;if(p>.92&&l.state!=='read'){markRead(l);WV.save()}}
 function closeGloss(except){sh.querySelectorAll('.gloss[data-open]').forEach(function(x){if(x===except)return;x.removeAttribute('data-open');x.removeAttribute('data-flip');var b=x.querySelector('.gloss-body');if(b){b.style.left=b.style.right=b.style.transform=''}})}
 function openGloss(g){closeGloss(g);g.setAttribute('data-open','true');var b=g.querySelector('.gloss-body');if(!b)return;var r=b.getBoundingClientRect();if(r.top<8)g.setAttribute('data-flip','true');r=b.getBoundingClientRect();var W=d.clientWidth;if(r.left<8){b.style.left=(8-g.getBoundingClientRect().left)+'px';b.style.right='auto';b.style.transform='none'}else if(r.right>W-8){b.style.left='auto';b.style.right=(g.getBoundingClientRect().right-(W-8))+'px';b.style.transform='none'}}
 function load(){ready=false;sh.innerHTML='<p class="wv-wait">Opening the lesson</p><style>.wv-wait{padding:38vh 24px 0;text-align:center;font:15px var(--sans);color:var(--rsub);animation:wvf 1.2s ease-in-out infinite alternate}@keyframes wvf{to{opacity:.45}}</style>';
  fetch(lsnUrl(l)).then(function(r){if(!r.ok)throw 0;return r.text()}).then(function(t){
   sh.innerHTML=t+'<style>'+LSN_THEME+'</style>';d.querySelector('#le').hidden=false;
   var dup=sh.querySelector('figure img[src$="img/h/'+slug(l)+'.webp"]');if(dup){var fg=dup.closest('figure');if(fg)fg.classList.add('wv-herodup')}
   lessonDom(sh);markExternal(sh);if(window.WVW)WVW(sh,d);
   var imgs=[].slice.call(sh.querySelectorAll('img')).filter(function(i){return !i.complete});
   Promise.race([Promise.all(imgs.map(function(i){return new Promise(function(res){i.onload=i.onerror=res})})),new Promise(function(res){setTimeout(res,2500)})]).then(function(){
    var p=S.pos[l.h]!=null?S.pos[l.h]:0,an=S.anc[l.h];if(p>.02&&p<.95){if(an)pinAnchor(d,sh,an,function(v){pinning=v});else d.scrollTop=p*(d.scrollHeight-d.clientHeight)}ready=true;prog()});
  }).catch(function(){sh.innerHTML='<div class="wv-err"><p>This lesson did not load. Check your connection.</p><button id="rt">Try again</button></div><style>.wv-err{padding:36vh 24px 0;text-align:center;font:16px var(--sans);color:var(--rink)}.wv-err button{font:inherit;min-height:44px;padding:10px 18px;border-radius:22px;border:1px solid currentColor;background:none;color:inherit}</style>';sh.getElementById('rt').onclick=load})}
 sh.addEventListener('click',function(e){
  var a=e.target.closest('a[data-wvl]');if(a){e.preventDefault();var n=byH(a.getAttribute('data-wvl')+'.html');if(n){readLesson(n)}else{window.open('https://mattyellin.com/well-versed/'+a.getAttribute('data-wvl')+'.html','_blank','noopener')}return}
  var g=e.target.closest('button.gloss');if(g){e.preventDefault();e.stopPropagation();if(vx().R===2&&!e.target.closest('.gloss-body')){closeGloss();glossSheet(g);return}if(g.hasAttribute('data-open'))closeGloss();else openGloss(g);return}
  closeGloss()});
 d.addEventListener('click',function(e){if(!host.contains(e.target))closeGloss()});
 d.addEventListener('keydown',function(e){if(e.key==='Escape')closeGloss()});
 d.addEventListener('scroll',function(){closeGloss();requestAnimationFrame(prog)},{passive:true});load()}
var FW=[0.40255,1.18385,3.173,15.69105,7.1949,0.5345,1.4604,0.0046,1.54575,0.1192,1.01925,1.9395,0.11,0.29605,2.2698,0.2315,2.9898,0.51655,0.6621],FDECAY=-0.5,FFACTOR=19/81;
function fClamp(x,a,b){return Math.min(b,Math.max(a,x))}
function fD0(G){return fClamp(FW[4]-Math.exp(FW[5]*(G-1))+1,1,10)}
function fNextD(D,G){var d=D+(-FW[6]*(G-3))*(10-D)/9;return fClamp(FW[7]*fD0(4)+(1-FW[7])*d,1,10)}
function fR(t,S){return Math.pow(1+FFACTOR*t/S,FDECAY)}
function cardState(c){return {st:c.st,stab:c.stab,df:c.df,last:c.last,ivl:c.ivl,due:c.due,reps:c.reps,lapses:c.lapses}}
function fsrs(c,G,noEasy){var t=WV.today(),x=cardState(c),ret=(S.opts.ret||90)/100,ivl=function(s){return Math.min(36500,Math.max(1,Math.round(s/FFACTOR*(Math.pow(ret,1/FDECAY)-1))))};
 x.reps=(x.reps||0)+1;
 if(x.st==='new'){x.stab=FW[G-1];x.df=fD0(G)}
 else if(x.st==='learn'&&(x.last==null||t-x.last<1)){x.stab=x.stab*Math.exp(FW[17]*(G-3+FW[18]));x.df=fNextD(x.df,G)}
 else{var el=Math.max(0,t-(x.last==null?t:x.last)),R=fR(el,x.stab),D=x.df;
  if(G===1){x.stab=Math.min(x.stab,FW[11]*Math.pow(D,-FW[12])*(Math.pow(x.stab+1,FW[13])-1)*Math.exp(FW[14]*(1-R)));x.lapses=(x.lapses||0)+1}
  else x.stab=x.stab*(Math.exp(FW[8])*(11-D)*Math.pow(x.stab,-FW[9])*(Math.exp(FW[10]*(1-R))-1)*(G===2?FW[15]:1)*(G===4?FW[16]:1)+1);
  x.df=fNextD(D,G)}
 x.stab=Math.max(0.1,x.stab);
 if(G<=2&&x.st!=='review'||G===1){x.st='learn';x.ivl=0;x.due=0}
 else{x.st='review';x.ivl=ivl(x.stab);if(G===4&&!noEasy){var g=fsrs(c,3,true);if(g.st==='review'&&x.ivl<=g.ivl)x.ivl=Math.min(36500,g.ivl+1)}x.due=x.ivl}
 x.last=t;return x}
function forecast(n){var f=new Array(n).fill(0);C.forEach(function(c){if(!c.unl||c.susp||c.del||c.st!=='review')return;var d=Math.max(0,c.due);if(d<n)f[d]++});return f}

function fcStrip(){var f=forecast(7),mx=Math.max(1,Math.max.apply(0,f)),t=new Date(Date.now()-144e5),dn='SMTWTFS';if(!f.some(Boolean))return '';return '<div class="fc" aria-label="Reviews due over the next seven days">'+f.map(function(v,i){var d=new Date(t.getTime()+i*864e5);return '<div><i style="height:'+Math.max(3,Math.round(v/mx*44))+'px"></i><b>'+v+'</b><span>'+(i===0?'Today':dn.charAt(d.getDay()))+'</span></div>'}).join('')+'</div>'}
var SRC=window.SpeechRecognition||window.webkitSpeechRecognition||null,rec0=null,talkCard=null,talkBeats=null,talkAsk=null,AI=null,AIready=false;
var talkId=0,sending=false;
function capUse(n){try{if(!(window.claude&&typeof claude.use==='function'))return Promise.resolve(null);return Promise.resolve(claude.use(n)).catch(function(){return null})}catch(e){return Promise.resolve(null)}}
var AIwait=capUse('sample').then(function(s){AI=s&&typeof s.json==='function'?s:null;AIready=true});
function plain(t){var d=document.createElement('textarea');for(var k=0;k<3;k++){d.innerHTML=t;if(d.value===t)break;t=d.value}return t}
function lessonText(l){var src=l.h==='gerrymander.html'?Promise.resolve(gmHtml()):fetch(lsnUrl(l)).then(function(r){return r.text()});return src.then(function(h){var d=document.createElement('div');d.innerHTML=h.replace(/<style[\s\S]*?<\/style>/g,'');d.querySelectorAll('.endmatter,figure,.credit,button,.prog,.rtop,.pin').forEach(function(x){x.remove()});return d.textContent.replace(/\s+/g,' ').trim().slice(0,24000)})}
function askAI(prompt){return AIwait.then(function(){return askAI0(prompt)})}
function askAI0(prompt){if(AI)return AI.json(prompt,{modelTier:'default'});if(window.WV_AI_URL)return fetch(window.WV_AI_URL,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({prompt:prompt,kind:prompt.indexOf('"reply"')>=0?'followup':'tell'})}).then(function(r){if(!r.ok)throw {code:'http_'+r.status};return r.json()});return Promise.reject({code:'unavailable'})}
var TELL_MVP='The user just read this lesson and is telling it back from memory. Work in this order. points: the 4 to 6 most important points of the lesson, each under 15 words. covered: how many of those points their answer gets right. fixes: only statements in their answer that the lesson contradicts, such as a wrong date, name, number or claim; copy their exact words into wrong and give the lesson\u2019s version in right; leaving something out is not a fix; use an empty list when nothing they said is wrong. got: one or two sentences, in your own words, naming what they got right; never repeat their answer back and never credit anything listed in fixes. missed: the one most important point from your list that they left out or got wrong, in one or two sentences. Speak to them as you, in full sentences that end with a period. ask: one short question about the lesson that points them toward what they missed. card: one cloze flashcard for the missed point, a single sentence under 25 words, with the key term wrapped as {{c1::term}}; the hidden term must be a specific name, number or word from the lesson, must not appear in the lesson title, and must not be guessable from the rest of the sentence. Their answer may have been spoken and turned into text by speech recognition, so treat a word that sounds like the right one (scrubby for scurvy) as the right word and never list it as a fix. If they say they do not remember or say very little, coach instead of correcting: in got, say kindly that starting is the hard part; in missed, give one small hint from the lesson without giving the answer away; and make ask an easy question that the hint helps them answer.';
var BOS_RULES='You are Boswell, a warm, quick-witted tutor in a learning app called Well-Versed. Rules: judge ONLY against the lesson text below and never add facts that are not in it; never grade or score; never correct in a way that stings: say what they got right first, specifically, then the one most important thing they missed or got wrong; write plainly, the way a well-read friend talks at coffee; no em dashes; no exclamation marks; keep every field short.';
function lev(a,b){var m=a.length,n=b.length,d=[],i,j;for(i=0;i<=m;i++){d[i]=[i]}for(j=1;j<=n;j++)d[0][j]=j;for(i=1;i<=m;i++)for(j=1;j<=n;j++)d[i][j]=Math.min(d[i-1][j]+1,d[i][j-1]+1,d[i-1][j-1]+(a[i-1]===b[j-1]?0:1));return d[m][n]}
function heardAs(f){if(!f||typeof f.wrong!=='string'||typeof f.right!=='string')return false;var w=f.wrong.toLowerCase().replace(/[^a-z ]/g,'').trim(),r=f.right.toLowerCase().replace(/[^a-z ]/g,'').trim();if(!w||!r||/\d/.test(f.wrong+f.right))return false;var ws=w.split(' '),rs=r.split(' ');if(ws.length!==rs.length)return false;return ws.every(function(x,k){var y=rs[k];return x===y||lev(x,y)<=Math.max(2,Math.ceil(Math.max(x.length,y.length)*0.45))})}
function markFixes(text,fixes){fixes=(Array.isArray(fixes)?fixes:[]).filter(function(f){return !heardAs(f)});var lo=text.toLowerCase(),hits=[];(Array.isArray(fixes)?fixes:[]).forEach(function(f){if(!f||typeof f.wrong!=='string'||!f.wrong.trim())return;var w=f.wrong.trim(),i=lo.indexOf(w.toLowerCase());if(i<0)return;if(hits.some(function(h){return i<h[1]&&i+w.length>h[0]}))return;hits.push([i,i+w.length,String(f.right||'')])});
 hits.sort(function(a,b){return a[0]-b[0]});var out='',p=0;hits.forEach(function(h){out+=esc(text.slice(p,h[0]))+'<s>'+esc(text.slice(h[0],h[1]))+'</s>'+(h[2]?' <ins>'+esc(h[2])+'</ins>':'');p=h[1]});return out+esc(text.slice(p))}
function bosSay(t,cls){var tx=document.getElementById('tx');if(!tx)return null;var s=document.createElement('div');s.className='says'+(cls?' '+cls:'');s.textContent=t;tx.appendChild(s);tx.scrollTop=tx.scrollHeight;return s}
function tsend(){var t=document.getElementById('tin'),v=(t&&t.value||'').trim();if(!v||sending)return;if(listening){try{rec0.stop()}catch(e){}}
 if(turn===0&&v.split(/\s+/).length<6&&!/know|sure|idea|remember|forgot|no clue/i.test(v)){toast('Say a little more, or just say you don’t remember');return}
 var tx=document.getElementById('tx'),u=document.createElement('div');u.className='you';u.textContent=v;tx.appendChild(u);t.value='';
 var ask=document.getElementById('ask');ask.classList.add('busy');var bos=document.getElementById('bos');if(bos)bos.classList.add('say');
 var wait=bosSay('Thinking','dots'),l=talkL,myId=talkId,myTurn=turn;sending=true;
 lessonText(l).then(function(lt){
  var p=turn===0?BOS_RULES+'\n\n'+TELL_MVP+'\n\nLESSON: '+plain(l.t)+'\n'+lt+'\n\nTHEIR ANSWER:\n'+v
   :BOS_RULES+'\n\nYou are coaching the user through a short conversation about the lesson. You asked them a question and they answered. Their answer may have come through speech recognition, so read a sound-alike word as the right word. In reply, two short sentences: if they got it, say so specifically; if they were partly right, build on the right part and add the missing piece from the lesson; if they did not know, tell them the answer warmly with one vivid detail from the lesson that makes it easy to remember. Never make them feel tested. Then in ask, one more easy question that leads to the next important point they have not covered, or an empty string if they have now covered the main points.\nReturn JSON only: {"fixes":[{"wrong":"exact words from their answer","right":"correction"}],"reply":"your two sentences","ask":"next question or empty"}\n\nLESSON: '+plain(l.t)+'\n'+lt+'\n\nYOUR QUESTION: '+talkAsk+'\n\nTHEIR ANSWER:\n'+v;
  return askAI(p)}).then(function(r){
  if(myId!==talkId||!document.getElementById('tx'))return;sending=false;if(wait)wait.remove();if(bos)bos.classList.remove('say');ask.classList.remove('busy');
  var str=function(x){return typeof x==='string'?x.trim():''};
  if(!r||typeof r!=='object'||(myTurn===0?!(str(r.got)||str(r.missed)):!str(r.reply)))throw {code:'shape'};
  u.innerHTML=markFixes(v,r.fixes);
  if(myTurn===0){bosSay([str(r.got),str(r.missed)].filter(Boolean).map(function(x){return /[.!?]$/.test(x)?x:x+'.'}).join(' '));talkAsk=str(r.ask);if(talkAsk)bosSay(talkAsk);
   var bt=Array.isArray(r.beats)&&r.beats.length===2?[Math.round(+r.beats[0]),Math.round(+r.beats[1])]:null;talkBeats=bt&&bt[1]>=1&&bt[1]<=12&&bt[0]>=0?[Math.min(bt[0],bt[1]),bt[1]]:null;
   var cterm=typeof r.card==='string'&&(r.card.match(/\{\{c1::([^}]+)\}\}/)||[])[1];if(cterm&&plain(l.t).toLowerCase().indexOf(cterm.trim().toLowerCase())<0&&r.card.replace(/\{\{c1::[^}]+\}\}/,'').toLowerCase().indexOf(cterm.trim().toLowerCase())<0){var f=famOf(l.f);talkCard={i:C.length,d:f[0],tags:['boswell'],ty:'Cloze',q:String(r.card).slice(0,400),a:'',s:l.t,h:l.h,st:'new',stab:0,df:0,last:null,ivl:0,due:0,reps:0,lapses:0,unl:true,added:true,flag:0,mark:false,susp:false,bury:false};C.unshift(talkCard);C.forEach(function(c,i){c.i=i});WV.save()}
   turn=1;if(!talkAsk)ask.innerHTML='<button class="go" data-a="treward">Done</button>';else{document.getElementById('tin').placeholder='Answer Boswell';var ar=ask.querySelector('.arow');if(ar)ar.insertAdjacentHTML('afterbegin','<button class="skip" data-a="treward">Finish</button>')}}
  else{var rp=str(r.reply);bosSay(/[.!?]$/.test(rp)?rp:rp+'.');talkAsk=str(r.ask);turn++;if(talkAsk&&turn<4){bosSay(talkAsk);document.getElementById('tin').placeholder='Answer Boswell, or say you don’t know'}else ask.innerHTML='<button class="go" data-a="treward">Done</button>'}
 }).catch(function(e){if(myId!==talkId||!document.getElementById('tx'))return;sending=false;if(wait)wait.remove();if(bos)bos.classList.remove('say');ask.classList.remove('busy');u.remove();
  bosSay(e&&e.code==='not_granted'?'Boswell needs your permission to answer. Allow Claude for this page and try again.':e&&e.code==='rate_limited'?'Boswell needs a moment. Try again shortly.':e&&e.code==='unavailable'?'Boswell cannot answer from this copy of the app.':e&&e.code==='http_429'?'Boswell has used today\u2019s free allowance and will be back tomorrow. Your answer is still in the box. The welcome guide (the ? button) shows a sample of his feedback.':'That did not go through. Your answer is still in the box, so send it again.','err');if(t)t.value=v})}
function dayDate(n){return new Date(n*864e5+144e5+new Date().getTimezoneOffset()*6e4)}
function recallPct(days){var t=WV.today(),a=S.rlog.filter(function(r){return r[2]===1&&t-r[0]<days});if(!a.length)return null;return Math.round(a.filter(function(r){return r[1]>1}).length/a.length*100)}
function recallWeeks(){var t=WV.today(),w=[];for(var k=11;k>=0;k--){var a=S.rlog.filter(function(r){return r[2]===1&&Math.floor((t-r[0])/7)===k});w.push(a.length?a.filter(function(r){return r[1]>1}).length/a.length*100:null)}return w}
function bestStreak(){var d=S.days.slice().sort(function(a,b){return a-b}),best=0,run=0,prev=null;d.forEach(function(x){run=prev!=null&&x===prev+1?run+1:1;best=Math.max(best,run);prev=x});return best}
function stamps(){var rd=L.filter(function(l){return l.state==='read'}),n=rd.length,fs=fieldStats(),fam=function(f){return f[1].some(function(x){return fs.some(function(y){return y.n===x&&y.r>0})})},told=Object.keys(S.told).length,bs=bestStreak(),conv=fs.filter(function(f){return f.tier==='Conversant'||f.tier==='Well-Versed'}).length;
 var o=[['First lesson',n>=1,'#a32a1c','Finish a lesson'],['First telling',told>=1,'#c6a02b','Talk to Boswell about a lesson'],['7 days',bs>=7,'#a32a1c','Read seven days in a row'],['25 lessons',n>=25,'#3a9dbd','Finish 25 lessons'],['50 lessons',n>=50,'#4fa265','Finish 50 lessons'],['100 lessons',n>=100,'#2c6e4a','Finish 100 lessons']];
 FAMS.forEach(function(f){o.push([f[0],fam(f),f[2],'Finish a lesson in '+f[0]])});
 o.push(['All 7 rooms',FAMS.every(fam),'#8569c4','Finish a lesson in every family'],['Polymath',conv>=10,'#c9638f','Reach Conversant in ten fields']);
 return o.sort(function(a,b){return b[1]-a[1]})}
I.rw='<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M9 14 4 9l5-5"/><path d="M4 9h10.5a5.5 5.5 0 0 1 0 11H11"/></svg>';
function reducedM(){return !!(window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches)}
(function(){try{var k=170,c=20,x=1,v=0,dt=1/600,ys=[];for(var t=0;t<1.5;t+=dt){v+=(-k*x-c*v)*dt;x+=v*dt;ys.push(1-x)}
 var end=ys.length;for(var i=ys.length-1;i>=0;i--)if(Math.abs(ys[i]-1)>.002){end=i+1;break}
 var o=[];for(var j=0;j<=40;j++)o.push(ys[Math.min(end-1,Math.round(j/40*(end-1)))].toFixed(4));var f='linear('+o.join(',')+')';
 if(window.CSS&&CSS.supports('transition-timing-function',f)){document.documentElement.style.setProperty('--spring',f);document.documentElement.style.setProperty('--spring-d',Math.round(end*dt*1000)+'ms')}}catch(e){}})();
function famHue(d){for(var i=0;i<FAMS.length;i++)if(FAMS[i][0]===d)return FAMS[i][2];return '#8a8277'}
function clozeAns(q,cn){var o=[];curly(esc(q)).replace(/\{\{c(\d+)::(.*?)(::.*?)?\}\}/g,function(_,n,a){if(n===String(cn||1))o.push(a);return a});return o.join(' · ')}
function cardSrc(c){var l=c.h&&byH(c.h);return l?l.t:esc(c.s||'')}
function cardFace(c,o){o=o||{};var q=clozeHtml(c.q,false,c.cn);if(o.ital)q=q.replace(/\*([^*]+)\*/g,'<i>$1</i>');var src=cardSrc(c),ans=(String(c.q).match(new RegExp('\\{\\{c'+(c.cn||1)+'::(.*?)(::.*?)?\\}\\}'))||[])[1]||'',leak=ans.toLowerCase().split(/[^a-z0-9\u00c0-\u024f]+/).some(function(w){return w.length>3&&src.toLowerCase().indexOf(w)>=0}),fk=leak?esc(c.d):src;
 return '<div class="cf'+(o.flip?' flip':'')+(c.susp?' off':'')+(o.cls?' '+o.cls:'')+'" style="--fam:'+famHue(c.d)+'"'+(o.attr||'')+'><div class="cf-in"><div class="cf-f"><div class="cf-k"><i></i><span>'+fk+'</span></div><div class="cf-q"><div class="cf-qt">'+q+'</div></div></div>'+
  (o.noBack?'':o.corners?cornerBack(c,src):'<div class="cf-b"><div class="cf-k"><span>'+esc(c.d)+'</span></div><div class="cf-a">'+clozeAns(c.q,c.cn)+'</div><div class="cf-s">'+clozeHtml(c.q,true,c.cn)+'</div><div class="cf-src">'+src+'</div></div>')+'</div>'+(o.extra||'')+'</div>'}
function fitFaces(root,again){if(!root)return;if(!again){setTimeout(function(){fitFaces(root,1)},260);if(document.fonts)document.fonts.ready.then(function(){fitFaces(root,1)})}requestAnimationFrame(function(){root.querySelectorAll('.cf-f,.cf-b').forEach(function(box){if(box.clientHeight<40)return;
 if(box.classList.contains('cf-bk')){fitAns(box);return}
 var qt=box.querySelector('.cf-qt'),q=box.querySelector('.cf-q'),a=box.querySelector('.cf-a'),s2=box.querySelector('.cf-s'),last=box.lastElementChild,n=0,fs;
 [q,a,s2].forEach(function(e){if(e)e.style.fontSize=''});
 box.classList.remove('cf-clip');if(qt){while(n++<40&&qt.offsetHeight>q.clientHeight+1&&(fs=parseFloat(getComputedStyle(q).fontSize))>13)q.style.fontSize=(fs-1)+'px';if(qt.offsetHeight>q.clientHeight+1)box.classList.add('cf-clip');return}
 var over=function(){return last.offsetTop+last.offsetHeight>box.clientHeight-18};
 while(n++<80&&over()){var e=a&&parseFloat(getComputedStyle(a).fontSize)>22?a:(s2&&parseFloat(getComputedStyle(s2).fontSize)>13?s2:a);if(!e)break;fs=parseFloat(getComputedStyle(e).fontSize);if(fs<=12)break;e.style.fontSize=(fs-1)+'px'}if(over())box.classList.add('cf-clip')})})}
function dragger(el,o){var on=false,mv=false,x0,y0,lx,ly,lt,vx,vy,id;
 function move(e){if(!on||e.pointerId!==id)return;var dx=e.clientX-x0,dy=e.clientY-y0;if(!mv){if(dx*dx+dy*dy<64)return;if(o.axis&&((o.axis==='x')!==(Math.abs(dx)>=Math.abs(dy)))){on=false;off();el._nc=Date.now();return}mv=true;try{el.setPointerCapture(id)}catch(_){}if(o.begin)o.begin()}
  var t=performance.now(),dt=Math.max(1,t-lt);vx=.75*vx+.25*(e.clientX-lx)/dt;vy=.75*vy+.25*(e.clientY-ly)/dt;lx=e.clientX;ly=e.clientY;lt=t;o.move(dx,dy);e.preventDefault()}
 function off(){document.removeEventListener('pointermove',move);document.removeEventListener('pointerup',onUp);document.removeEventListener('pointercancel',cancel);document.removeEventListener('mouseout',out);removeEventListener('blur',up)}
 function up(){if(!on)return;on=false;off();if(mv){el._nc=Date.now();o.end(lx-x0,ly-y0,vx,vy)}}
 function onUp(e){if(e.pointerId===id)up()}
 function cancel(e){if(!on||e.pointerId!==id)return;on=false;off();if(mv)o.end(0,0,0,0)}
 function out(e){if(on&&mv&&!e.relatedTarget)up()}
 el.addEventListener('pointerdown',function(e){var hb=e.target.closest&&e.target.closest('button,a,input,textarea,[data-a="trw"]');if(e.button>0||(hb&&hb!==el&&el.contains(hb)))return;if(o.can&&!o.can(e))return;
  if(on)off();on=true;mv=false;x0=lx=e.clientX;y0=ly=e.clientY;lt=performance.now();vx=vy=0;id=e.pointerId;
  document.addEventListener('pointermove',move,{passive:false});document.addEventListener('pointerup',onUp);document.addEventListener('pointercancel',cancel);document.addEventListener('mouseout',out);addEventListener('blur',up)});
 el.addEventListener('click',function(e){if(el._nc&&Date.now()-el._nc<400){e.stopPropagation();e.preventDefault()}},true)}
var RV_G=['Again','Hard','Good','Easy'],RV_DIR=[[-1,0],[0,1],[1,0],[0,-1]];
function rvFlip(){var s=S.sess,r=document.getElementById('rv'),top=r&&r.querySelector('.rv-top');if(!s||!s.q.length)return;s.show=!s.show;if(!top){drawRv();return}
 top.classList.toggle('flip',s.show);top.setAttribute('aria-label',s.show?'Card answer':'Show the answer');var ctl=document.getElementById('rvctl');if(ctl)ctl.innerHTML=rvCtl(s.q[0])}
function rvPick(dx,dy){var ax=Math.abs(dx),ay=Math.abs(dy);if(ax<14&&ay<14)return null;return ax>=ay?(dx>0?2:0):(dy<0?3:1)}
function rvDrag(r){var top=r.querySelector('.rv-top');if(!top)return;var cue=top.querySelector('.cue'),b1=r.querySelector('.rv-b1'),c=S.sess.q[0];
 function prog(dx,dy,g){return g==null?0:Math.min(1,(g===0||g===2)?Math.abs(dx)/(r.clientWidth*.3):Math.abs(dy)/110)}
 dragger(top,{can:function(){return S.sess&&S.sess.show&&!S.sess._busy},begin:function(){top.classList.add('drag')},
  move:function(dx,dy){var g=rvPick(dx,dy),p=prog(dx,dy,g);top.style.transform='translate3d('+dx+'px,'+dy+'px,0) rotate('+Math.max(-16,Math.min(16,dx/r.clientWidth*16)).toFixed(2)+'deg)';
   if(g!=null){cue.textContent=RV_G[g]+' · '+fmt(nextIv(c,g),g);cue.className='cue c'+g+(p>=1?' on':'');cue.style.opacity=Math.min(1,p*1.25).toFixed(3);top.style.setProperty('--cue',p.toFixed(3));top.dataset.g=g}else{cue.style.opacity=0;top.style.setProperty('--cue',0)}
   if(b1)b1.style.setProperty('--p',p.toFixed(3))},
  end:function(dx,dy,vx,vy){top.classList.remove('drag');var g=rvPick(dx,dy),ax=Math.abs(dx),ay=Math.abs(dy),W=r.clientWidth,
   hit=g!=null&&((g===0||g===2)?(ax>W*.3||(Math.abs(vx)>.5&&ax>40)):(ay>110||(Math.abs(vy)>.5&&ay>40)));
   if(hit){rvFling(g,dx,dy);return}top.style.transform='';cue.style.opacity=0;top.style.setProperty('--cue',0);if(b1)b1.style.setProperty('--p',0)}})}
function rvFling(g,dx,dy){var s=S.sess,r=document.getElementById('rv'),top=r&&r.querySelector('.rv-top');if(!s)return;if(!top){grade(g);return}if(s._busy)return;
 s._busy=true;var W=r.clientWidth,H=r.clientHeight,d=RV_DIR[g],c=s.q[0],cue=top.querySelector('.cue'),rm=reducedM();
 if(cue&&!cue.textContent){cue.textContent=RV_G[g]+' · '+fmt(nextIv(c,g),g);cue.className='cue on c'+g;cue.style.opacity=1}
 top.classList.add('fling');if(rm)top.style.opacity=0;else top.style.transform='translate3d('+(d[0]?d[0]*W*1.3:dx||0)+'px,'+(d[1]?d[1]*H:dy||0)+'px,0) rotate('+(d[0]*20)+'deg)';
 setTimeout(function(){s._busy=false;if(S.sess!==s||s.q[0]!==c||!top.isConnected)return;s._in=!rm;grade(g)},rm?160:280)}

function cardPool(){return C.filter(function(c){if(!c.unl||c.del)return false;if(S.cd==='Flagged')return c.flag||c.mark;return !S.cd||c.d===S.cd})}
function cardGroups(a){var g={},order=[];a.forEach(function(c){var k=c.h||('s:'+c.s);if(!g[k]){g[k]=[];order.push(k)}g[k].push(c)});
 return order.map(function(k){return {k:k,l:k.indexOf('s:')?byH(k):null,cards:g[k]}}).sort(function(x,y){return ((y.l&&S.readAt[y.l.h])||1e9)-((x.l&&S.readAt[x.l.h])||1e9)})}
function coverHtml(g){var l=g.l,c=g.cards[0],src=l&&(T[l.no]||hero(l));
 return '<button class="cov" data-lc="'+esc(g.k)+'" style="--fam:'+famHue(c.d)+'"><span class="cov-art">'+(src?'<img alt="" loading="lazy" src="'+src+'">':'<b>'+esc(c.s||c.d)+'</b>')+'</span><span class="cov-t">'+(l?l.t:esc(c.s||''))+'</span><small>'+g.cards.length+' card'+(g.cards.length>1?'s':'')+'</small></button>'}
function carHtml(a){return '<div class="ccar">'+a.map(function(c){return '<div class="ci">'+cardFace(c,{attr:' data-cflip="'+c.i+'" role="button" tabindex="0"'})+'<div class="cact"><button data-card="'+c.i+'">Edit</button><button data-cflag="'+c.i+'">'+(c.flag?'Remove flag':'Flag')+'</button><button data-csusp="'+c.i+'">'+(c.susp?'Show again':'Stop showing')+'</button></div></div>'}).join('')+'</div>'}
function openLC(k){var a=C.filter(function(c){return c.unl&&!c.del&&(c.h||('s:'+c.s))===k}),l=k.indexOf('s:')?byH(k):null;if(!a.length)return;
 var d=open('<div class="lc" data-k="'+esc(k)+'"><div class="pad"><div class="top"><button class="back" data-a="closeTop">‹ Cards</button></div><h1 class="large">'+(l?l.t:esc(a[0].s||''))+'</h1><p class="lcmeta">'+a.length+' card'+(a.length>1?'s':'')+' · tap a card to turn it</p></div><div id="lcar">'+carHtml(a)+'</div></div>','in doc');fitFaces(d)}
function refreshLC(){var w=document.querySelector('.lc');if(!w)return;var k=w.dataset.k,a=C.filter(function(c){return c.unl&&(c.h||('s:'+c.s))===k}),x=document.getElementById('lcar');if(x){var sl=x.querySelector('.ccar').scrollLeft;x.innerHTML=carHtml(a);x.querySelector('.ccar').scrollLeft=sl;fitFaces(x)}}
app.addEventListener('click',function(e){var b=e.target.closest('[data-lc],[data-cflip],[data-cflag],[data-csusp],[data-a="trw"]');if(!b)return;var d=b.dataset;
 if(d.lc!=null){openTopic({k:d.lc});return}
 if(d.cflip!=null){b.classList.toggle('flip');return}
 if(d.cflag!=null){var c=C[+d.cflag];c.flag=c.flag?0:1;b.textContent=c.flag?'Remove flag':'Flag';return}
 if(d.csusp!=null){var c2=C[+d.csusp];c2.susp=!c2.susp;b.textContent=c2.susp?'Show again':'Stop showing';var f=b.closest('.ci');if(f)f.querySelector('.cf').classList.toggle('off',c2.susp);toast(c2.susp?'Suspended':'Back in your reviews');return}
 if(d.a==='trw'){var fd=document.getElementById('feed');if(fd&&fd._go)fd._go(-1)}});
app.addEventListener('keydown',function(e){if((e.key==='Enter'||e.key===' ')&&e.target.matches&&e.target.matches('[data-cflip],.rv-top')){e.preventDefault();e.target.click()}});

document.addEventListener('keydown',function(e){if(S.tab!=='today'||app.querySelectorAll(':scope > .scr').length>1||document.getElementById('sh'))return;if(e.target.closest&&e.target.closest('input,textarea'))return;var f=document.getElementById('feed');if(!f||!f._go)return;
 if(e.key==='ArrowRight'){e.preventDefault();f._go(1)}else if(e.key==='ArrowLeft'){e.preventDefault();f._go(-1)}});

function tagH(t,col){return '<span class="tag" style="--tc:'+col+'">'+t+'</span>'}
function lessonCard(a,l,tag,o){o=o||{};return '<section class="panel lcard" data-rl="'+l.i+'" role="button" tabindex="0" aria-label="'+esc(plain(l.t))+'" style="'+scrimVars({lt:a.lt,lb:a.lb,frame:false})+'"><img class="bg" alt="" src="'+a.src+'" style="object-position:'+a.pos+'">'+(o.rib||'')+'<div class="cbody">'+tag+(o.pre||'')+'<'+(o.h1?'h1':'h2')+' class="poster '+titleStep(l.t,{frame:false},o.h1?1:2)+'">'+l.t+'</'+(o.h1?'h1':'h2')+'>'+(o.bar!=null?'<div class="bar"><i style="width:'+Math.round(o.bar*100)+'%"></i></div>':'')+(o.meta?'<p class="cmeta">'+o.meta+'</p>':'')+'</div></section>'}
function collCard(cl,ci,a,used){var V=vx().C,ls=cl[2].map(byH).filter(Boolean),n=ls.length,pics=[],seen=used.concat([a.dh]),art='';ls.forEach(function(l){var x=artFor(hero(l));if(!artClash(x,seen)){pics.push(x);seen.push(x.dh)}});
 if(V===2){var m=[a].concat(pics).slice(0,4);art='<div class="mosaic m'+m.length+'">'+m.map(function(x){return '<img alt="" src="'+x.src+'" style="object-position:'+x.pos+'">'}).join('')+'</div>'}
 else if(V===3){var b=pics.slice(0,2);art='<div class="cstack">'+b.map(function(x,k){return '<img class="cs'+(k+1)+'" alt="" src="'+x.src+'" style="object-position:'+x.pos+'">'}).reverse().join('')+'<img class="cs0" alt="" src="'+a.src+'" style="object-position:'+a.pos+'"></div>'}
 else art='<img class="bg" alt="" src="'+a.src+'" style="object-position:'+a.pos+'">';
 return '<section class="panel lcard ccard c'+V+'" data-col="'+ci+'" role="button" tabindex="0" aria-label="'+esc(cl[0])+'" style="'+scrimVars({lt:a.lt,lb:V===2?255:Math.max(a.lb,140),frame:false})+'">'+art+'<div class="cbody">'+tagH('Collection','var(--ring-2)')+'<h2 class="poster '+titleStep(cl[0],{frame:false},2)+'">'+cl[0]+'</h2><p class="cmeta">'+n+' lessons</p></div></section>'}
var IC={today:['<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><circle cx="12" cy="12" r="4"/><path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M18.7 5.3l-1.4 1.4M6.7 17.3l-1.4 1.4"/></svg>','<svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"><circle cx="12" cy="12" r="4.6"/><path fill="none" d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M18.7 5.3l-1.4 1.4M6.7 17.3l-1.4 1.4"/></svg>'],
 shelf:['<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"><rect x="3.5" y="4" width="4.5" height="16" rx="1.2"/><rect x="9.5" y="4" width="4.5" height="16" rx="1.2"/><path d="m15.6 5.2 3.3-.8 2.6 14.9-3.3.8z"/></svg>','<svg viewBox="0 0 24 24" fill="currentColor"><rect x="3" y="3.5" width="5.5" height="17" rx="1.5"/><rect x="9.5" y="3.5" width="5.5" height="17" rx="1.5"/><path d="M15.3 5.3a1 1 0 0 1 .8-1.2l2.6-.6a1 1 0 0 1 1.2.8l2.5 14.6a1 1 0 0 1-.8 1.2l-2.6.6a1 1 0 0 1-1.2-.8z"/></svg>'],
 cards:['<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"><rect x="3.5" y="7.5" width="13" height="13" rx="2.6"/><path d="M7.5 4.5h10a3 3 0 0 1 3 3v10"/></svg>','<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"><rect x="3.5" y="7.5" width="13" height="13" rx="2.6" fill="currentColor"/><path d="M7.5 4.5h10a3 3 0 0 1 3 3v10"/></svg>'],
 rec:['<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"><circle cx="12" cy="9.5" r="6"/><path d="m8.6 14.4-1.6 7 5-2.6 5 2.6-1.6-7"/></svg>','<svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"><circle cx="12" cy="9.5" r="6.3"/><path d="m8.6 14.4-1.6 7 5-2.6 5 2.6-1.6-7z"/></svg>']};
function bosMini(){return BOS.replace(' id="bos"','').replace('class="bos"','class="bosm" aria-hidden="true"').replace(' aria-label="Boswell"','')}

S.fx={recent:[],front:null,enter:false,lastDel:null};
function scOf(s){if(!s)return null;var p=s.indexOf(':');return p<0?null:(function(o){o[s.slice(0,p)]=decodeURIComponent(s.slice(p+1));return o})({})}
function scStr(sc){if(!sc)return '';return sc.d?'d:'+encodeURIComponent(sc.d):sc.k?'k:'+encodeURIComponent(sc.k):sc.f?'f:1':''}
function inScope(c,sc){if(!sc)return true;if(sc.d)return c.d===sc.d;if(sc.k)return (c.h||('s:'+c.s))===sc.k;if(sc.f)return !!(c.flag||c.mark);return true}
function freeQ(sc){var t=C.filter(function(c){return c.unl&&!c.susp&&!c.del&&!c.bury&&inScope(c,sc)}),by=function(a,b){return (a.due||0)-(b.due||0)};
 var q=t.filter(due).sort(by).concat(t.filter(function(c){return c.st==='new'}),t.filter(function(c){return c.st!=='new'&&!due(c)}).sort(by));
 var rc=S.fx.recent.filter(function(c){return q.indexOf(c)>-1});q=q.filter(function(c){return rc.indexOf(c)<0}).concat(rc);
 if(S.fx.front&&q.indexOf(S.fx.front)>0){q.splice(q.indexOf(S.fx.front),1);q.unshift(S.fx.front)}return q}
function topicBar(c){return '<div class="tbar"><button data-im="flag">'+(c.flag?'Remove flag':'Flag')+'</button><button data-im="edit">Edit</button><button data-im="del">Delete</button><button data-im="more" aria-label="More">•••</button></div>'}
function fgrade(c,g){if(document.getElementById('rv'))return;var old=S.sess;S.sess={q:[c],done:0,show:true,total:1,inline:1};try{grade(g)}finally{S.sess=old}WV.save()}
function redrawIS(box,enter){if(!box||!box.isConnected)return;S.fx.enter=!!enter;var t=document.createElement('div');t.innerHTML=istackHtml(scOf(box.dataset.sc),box.dataset.kind);S.fx.enter=false;var nb=t.firstChild;box.replaceWith(nb);wireIS(nb);fitFaces(nb);return nb}
function refreshIS(){document.querySelectorAll('.istack').forEach(function(b){redrawIS(b)})}
function curCard(b){var box=b.closest('.istack')||document.querySelector('.topic .istack'),l=box&&box.querySelector('.ilive');return l?C[+l.dataset.ci]:null}
function delToast(){var o=document.querySelector('.toast');if(o)o.remove();var d=document.createElement('div');d.className='toast act';d.innerHTML='Card deleted <button data-undel>Undo</button>';app.appendChild(d);setTimeout(function(){d.remove()},4500)}
function openTopic(sc){var a=C.filter(function(c){return c.unl&&!c.del&&inScope(c,sc)}),l=sc.k&&sc.k.indexOf('s:')?byH(sc.k):null,t=sc.d?esc(sc.d):sc.f?'Flagged':l?l.t:esc((a[0]&&a[0].s)||'');if(!a.length)return;
 var d=open('<div class="topic" style="--fam:'+(sc.d?famHue(sc.d):a[0]?famHue(a[0].d):'var(--accent)')+'"><div class="pad"><div class="top"><button class="back" data-a="closeTop">‹ Cards</button><span class="unl">'+a.length+' card'+(a.length>1?'s':'')+'</span></div><h1 class="large">'+t+'</h1></div><div class="tpad">'+istackHtml(sc,'topic')+'</div></div>','in doc');wireIS(d.querySelector('.istack'));fitFaces(d)}
function topicStudy(sc,opt){study(sc.d||null,opt);if(!sc.d){S.sess.q=S.sess.q.filter(function(c){return inScope(c,sc)});S.sess.total=0;drawRv()}}
app.addEventListener('click',function(e){var b=e.target.closest('[data-ig],[data-cg],[data-ci],[data-im],[data-undel],[data-tp],[data-vx],[data-sx],[data-a="vx"]');if(!b)return;var d=b.dataset;
 if(d.ig!=null){var bx=b.closest('.istack');if(bx)igrade(bx,+d.ig);return}
 if(d.cg!=null){var bx2=b.closest('.istack'),lv=b.closest('.ilive');if(bx2&&lv&&lv.classList.contains('flip'))igrade(bx2,+d.cg);else if(lv)turnLive(lv);return}
 if(d.ci!=null){turnLive(b);return}
 if(d.tp){var sc=scOf(d.tp);if(sc)openTopic(sc);return}
 if(d.vx){setVx(d.vx);return}
 if(d.a==='vx'){var o0=document.getElementById('sh');if(o0)o0.remove();vxSheet();return}
 if(d.undel!=null){if(S.fx.lastDel){S.fx.lastDel.del=false;S.fx.front=S.fx.lastDel;S.fx.lastDel=null;refreshIS();topicCount();WV.save()}b.parentNode.remove();return}
 if(d.sx){var tp=document.querySelector('.topic .istack');var sc2=tp?scOf(tp.dataset.sc):null;shut();if(sc2)topicStudy(sc2,d.sx==='due'?undefined:d.sx);return}
 if(d.im){var c=curCard(b);if(d.im==='undo'){var h=S.hist.pop();if(!h){toast('Nothing to undo');return}Object.assign(h.c,h.prev);S.newToday=h.nt;S.rlog.pop();S.reviewed=Math.max(0,S.reviewed-1);S.fx.front=h.c;S.fx.recent=S.fx.recent.filter(function(x){return x!==h.c});refreshIS();toast('Undone');return}
  if(!c)return;
  if(d.im==='flag'){c.flag=c.flag?0:1;b.textContent=c.flag?'Remove flag':'Flag';return}
  if(d.im==='edit'){editSheet(c);return}
  if(d.im==='del'){c.del=true;S.fx.lastDel=c;if(S.fx.front===c)S.fx.front=null;refreshIS();topicCount();delToast();WV.save();return}
  if(d.im==='mark'){c.mark=!c.mark;shut();toast(c.mark?'Marked':'Unmarked');return}
  if(d.im==='susp'){c.susp=true;shut();refreshIS();toast('Suspended');return}
  if(d.im==='more'){sheet('<div class="group"><button class="row" data-im="mark">'+(c.mark?'Unmark':'Mark')+'</button><button class="row" data-im="susp">Stop showing</button></div><div class="group"><button class="row" data-sx="due">Review due</button><button class="row" data-sx="forgot">Forgotten</button><button class="row" data-sx="ahead">Review ahead</button><button class="row" data-sx="flag">Flagged</button></div>');return}}});
app.addEventListener('keydown',function(e){if((e.key==='Enter'||e.key===' ')&&e.target.matches&&e.target.matches('.panel[role=button],[data-ci],[data-cg],.tedge')){e.preventDefault();e.target.click()}});

var VX=[
 ['N','Bottom bar',[['Classic','iOS 18 tab bar: full width, blurred material, a hairline on top, labels.'],['Liquid Glass','iOS 26 floating glass capsule; the selected tab sits in a lens.'],['Glass + action','The glass capsule plus a round button that opens today’s lesson.'],['Now reading','The classic bar with a “Continue reading” player above it, as in Books.'],['Icons only','A compact floating capsule with icons and no labels.']]],
 ['S','Today swipe',[['Vertical','Swipe up for the next card and down to go back. Side swipes only grade flashcards.'],['Sideways','Swipe the stack left or right. A drag on the flashcard grades it instead.'],['Pager','Cards side by side with a handle on the right edge to drag or tap.']]],
 ['F','Flashcard',[['Paper','Ivory paper; the answer in ink with the grades in the corners.'],['Colour','Every card in its family’s colour, front and back, as in Drops.'],['Glass','Dark frosted glass with light type.']]],
 ['R','Reader',[['Editorial','Art hero, Spectral text, poster section heads, ruled tables.'],['Modern','System type, an inset picture, bold heads, highlighted terms that open a sheet.'],['Magazine','Full-screen hero, pictures on a dark gallery wall, large numerals.']]],
 ['B','Boswell in the reader',[['Floating','His avatar floats at the bottom right while you read.'],['Bar','A slim “Talk to Boswell” bar along the bottom.'],['At the end','Only at the end of the lesson.']]],
 ['L','Lesson card',[['Cover','Full-bleed picture, title bottom left.'],['Drift','A slow drift across the picture, a larger centred title.'],['Editorial','The picture on top, the title in a solid band below.']]],
 ['T','Tag',[['Chip','A solid chip.'],['Dot','Small capitals after a coloured dot.'],['Outline','A thin outlined label.']]],
 ['D','Today marker',[['Tag','“Today” in the tag.'],['Date','The date set large above the title.'],['Ribbon','A bookmark ribbon on the top edge.']]],
 ['C','Collection card',[['Cover','One picture, like a lesson card.'],['Mosaic','Four of its lessons’ pictures.'],['Stack','Its picture with two more fanned behind.']]]];
var VXD={L:1,T:3,D:2,C:2,N:2,S:1,F:2,R:1,B:2};
function vx(){var d=Object.assign({},VXD),o=S.opts.vx||{};VX.forEach(function(g){var k=g[0];if(o[k]>=1&&o[k]<=g[2].length)d[k]=o[k]});return d}
function applyVx(){if(S.opts.vxLock!==1){S.opts.vx={};S.opts.vxHide=true;S.opts.vxLock=1}var v=vx(),r=document.documentElement;VX.forEach(function(g){r.setAttribute('data-v'+g[0].toLowerCase(),v[g[0]])});if(S.opts.vxHide)r.setAttribute('data-vxhide','');else r.removeAttribute('data-vxhide')}
function vxPill(){return '<button class="vxp" data-a="vx" aria-label="Versions">'+'<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 7h10M18 7h2M4 17h2M10 17h10"/><circle cx="16" cy="7" r="2"/><circle cx="8" cy="17" r="2"/></svg><span>Versions</span></button>'}
function vxSheet(){var v=vx();sheet('<h3>Versions</h3><p class="vxsub">Tap an option to switch. It applies at once and is kept.</p><div class="flat vxtog"><span>Show the Versions button</span><button class="tog" role="switch" aria-label="Show the Versions button" aria-checked="'+(!S.opts.vxHide)+'" data-a="vxpill"></button></div>'+
 VX.map(function(g){return '<div class="vxg"><div class="vxh"><b>'+g[0]+'</b>'+g[1]+'</div>'+g[2].map(function(o,i){var c=g[0]+(i+1);return '<button class="vxo" data-vx="'+c+'" aria-pressed="'+(v[g[0]]===i+1)+'"><span class="vxc">'+c+'</span><span class="vxt"><b>'+o[0]+(VXD[g[0]]===i+1?'<em>Default</em>':'')+'</b><small>'+o[1]+'</small></span><span class="vxk" aria-hidden="true"></span></button>'}).join('')+'</div>'}).join(''))}
function rebase(){var r=document.getElementById('r');if(!r){root();return}
 r.innerHTML={today:vToday,shelf:vShelf,cards:vCards,record:vRecord}[S.tab]();r.style.overflow=S.tab==='today'?'hidden':'';
 var t=app.querySelector('.tabs');if(t){var x=document.createElement('div');x.innerHTML=tabs();if(t.classList.contains('hide'))x.firstChild.classList.add('hide');t.replaceWith(x.firstChild)}after();fitAll()}
function setVx(code){var k=code[0],n=+code.slice(1),v=vx();if(v[k]!==n){v[k]=n;S.opts.vx=v;applyVx();
  if('NLDCS'.indexOf(k)>-1)rebase();
  if(k==='R'){var rd=app.querySelector('.reader');if(rd&&rd._l&&rd._l.h!=='gerrymander.html'){var h=rd.querySelector('.lhero');if(h){var t=document.createElement('div');t.innerHTML=lessonHero(rd._l);h.replaceWith(t.firstChild);fitAll()}}syncHost()}
  if(k==='F')document.querySelectorAll('.istack').forEach(function(b){fitFaces(b)});
  try{WV.save()}catch(e){}}
 document.querySelectorAll('#sh [data-vx^="'+k+'"]').forEach(function(b){b.setAttribute('aria-pressed',b.dataset.vx===code)});
 var g=VX.filter(function(x){return x[0]===k})[0],o=document.querySelector('.toast');if(o)o.remove();toast(code+' · '+g[2][n-1][0])}
(function(){function mark(){var s=app.querySelectorAll(':scope > .scr'),t=s[s.length-1],k='tab';if(t&&t.id!=='r')k=t.classList.contains('reader')?'reader':t.id==='rv'?'rv':t.classList.contains('talk')?'talk':t.classList.contains('win')?'win':t.classList.contains('lp')?'lp':'screen';if(app.dataset.top!==k)app.dataset.top=k}
 try{new MutationObserver(mark).observe(app,{childList:true})}catch(e){}})();

var IC={
 today:['<svg viewBox="0 0 28 28" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><circle cx="14" cy="14" r="4.7"/><path d="M14 3.4V6M14 22v2.6M3.4 14H6M22 14h2.6M6.5 6.5l1.84 1.84M19.66 19.66l1.84 1.84M21.5 6.5l-1.84 1.84M8.34 19.66 6.5 21.5"/></svg>',
  '<svg viewBox="0 0 28 28" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round"><circle cx="14" cy="14" r="5.6" fill="currentColor" stroke="none"/><path d="M14 3.2V5.9M14 22.1v2.7M3.2 14h2.7M22.1 14h2.7M6.4 6.4l1.9 1.9M19.7 19.7l1.9 1.9M21.6 6.4l-1.9 1.9M8.3 19.7l-1.9 1.9"/></svg>'],
 shelf:['<svg viewBox="0 0 28 28" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round" stroke-linecap="round"><rect x="4" y="4.5" width="5.2" height="19" rx="1.4"/><rect x="11" y="4.5" width="5.2" height="19" rx="1.4"/><path d="m17.9 6.4 4.2-1.1a.9.9 0 0 1 1.1.66l3.7 15.2a.9.9 0 0 1-.66 1.1l-4.2 1.1a.9.9 0 0 1-1.1-.66L17.24 7.5a.9.9 0 0 1 .66-1.1Z"/><path d="M4 8.6h5.2M11 8.6h5.2M4 19.4h5.2M11 19.4h5.2"/></svg>',
  '<svg viewBox="0 0 28 28" fill="currentColor"><path fill-rule="evenodd" d="M5.4 3.7h3.4c.99 0 1.8.81 1.8 1.8v17c0 .99-.81 1.8-1.8 1.8H5.4c-.99 0-1.8-.81-1.8-1.8v-17c0-.99.81-1.8 1.8-1.8ZM3.6 8v1.3h7V8Zm0 10.7V20h7v-1.3Z"/><path fill-rule="evenodd" d="M13.2 3.7h3.4c.99 0 1.8.81 1.8 1.8v17c0 .99-.81 1.8-1.8 1.8h-3.4c-.99 0-1.8-.81-1.8-1.8v-17c0-.99.81-1.8 1.8-1.8ZM11.4 8v1.3h7V8Zm0 10.7V20h7v-1.3Z"/><path d="m19.4 6.3 3.6-.95a1.6 1.6 0 0 1 1.95 1.15l3.5 14.4a1.6 1.6 0 0 1-1.15 1.95l-3.6.95a1.6 1.6 0 0 1-1.95-1.15l-3.5-14.4a1.6 1.6 0 0 1 1.15-1.95Z"/></svg>'],
 cards:['<svg viewBox="0 0 28 28" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"><rect x="3.8" y="9" width="15.4" height="15.4" rx="3"/><path d="M8.4 5.6h12.2a3 3 0 0 1 3 3v12.2"/></svg>',
  '<svg viewBox="0 0 28 28" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" stroke-linecap="round"><rect x="3.6" y="8.8" width="15.8" height="15.8" rx="3.1" fill="currentColor" stroke="none"/><path d="M8.4 5.5h12.2a3.1 3.1 0 0 1 3.1 3.1v12.2"/></svg>'],
 rec:['<svg viewBox="0 0 28 28" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"><circle cx="14" cy="11.2" r="7"/><path d="m9.6 16.7-1.7 8.1 6.1-3.1 6.1 3.1-1.7-8.1"/></svg>',
  '<svg viewBox="0 0 28 28" fill="currentColor" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"><circle cx="14" cy="11.2" r="7.4" stroke="none"/><path d="m9.7 17.4-1.6 7.4 5.9-3 5.9 3-1.6-7.4a9 9 0 0 1-8.6 0Z"/></svg>'],
 book:'<svg viewBox="0 0 28 28" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" stroke-linecap="round"><path d="M14 8.2c-2.6-2-6.2-2.6-9.8-2v15.6c3.6-.6 7.2 0 9.8 2 2.6-2 6.2-2.6 9.8-2V6.2c-3.6-.6-7.2 0-9.8 2Z"/><path d="M14 8.2v15.6"/></svg>',
 go:'<svg viewBox="0 0 28 28" fill="currentColor"><path d="M10 6.6c0-1.1 1.2-1.8 2.2-1.2l11 7.4c.9.6.9 1.9 0 2.4l-11 7.4c-1 .6-2.2-.1-2.2-1.2Z"/></svg>'};
function contLesson(){var a=L.filter(function(l){var p=S.prog[l.h]||0;return l.state!=='read'&&p>.02&&p<.92}).sort(function(x,y){return (S.seen[y.h]||0)-(S.seen[x.h]||0)});return a[0]||todayLesson()}
function tabs(){var v=vx().N,a=[['today','Today','today'],['shelf','Shelf','shelf'],['cards','Cards','cards'],['record','Record','rec']],ix=Math.max(0,a.map(function(t){return t[0]}).indexOf(S.tab)),pv=S._ptab!=null?S._ptab:ix;S._ptab=ix;
 var btns=a.map(function(t){var on=S.tab===t[0];return '<button data-tab="'+t[0]+'"'+(on?' aria-current="page"':'')+(v===5?' aria-label="'+t[1]+'"':'')+'>'+IC[t[2]][on?1:0]+'<span>'+t[1]+'</span></button>'}).join(''),acc='';
 if(v===4){var cl=contLesson(),p=S.prog[cl.h]||0;acc='<button class="tacc" data-rl="'+cl.i+'" aria-label="Continue reading '+esc(plain(cl.t))+'"><img alt="" src="'+(T[cl.no]||hero(cl))+'"><span class="tacc-t"><b>'+cl.t+'</b><small>'+(p>.02?'Continue reading · '+minsLeft(cl)+' min left':'Today · '+cl.m+' min')+'</small></span><span class="tacc-go" aria-hidden="true">'+IC.go+'</span><i class="tacc-p" style="width:'+Math.round(p*100)+'%"></i></button>'}
 return '<nav class="tabs n'+v+'" aria-label="Sections">'+acc+'<div class="tcap" style="--ti:'+pv+'"><i class="lens" aria-hidden="true"></i>'+btns+'</div>'+(v===3?'<button class="tact" data-rl="'+todayLesson().i+'" aria-label="Open today’s lesson">'+IC.book+'</button>':'')+'</nav>'}
function lensGo(){var tc=app.querySelector('.tcap');if(tc)requestAnimationFrame(function(){requestAnimationFrame(function(){tc.style.setProperty('--ti',S._ptab)})})}

function todayStack(f){var ps=[].slice.call(f.querySelectorAll(':scope > .panel')),n=ps.length;if(!n)return;var M=vx().S,cur=((S.ti||0)%n+n)%n,busy=false,dots=document.getElementById('tdots');
 f.classList.toggle('vert',M===1);f.classList.toggle('pager',M===3);
 ps.forEach(function(p){p._im=p.querySelector('img.bg')});
 function rel(i){var k=(i-cur+n)%n;return k===n-1&&n>2?-1:k}
 function step(){return (ps[0].offsetWidth||f.clientWidth-44)+10}
 function lay(){ps.forEach(function(p,i){var k=(i-cur+n)%n,r=rel(i);
   if(M===3){var vis=r>=-1&&r<=1;p.dataset.k=r===0?0:r===1?1:r===-1?'p':3;p.classList.toggle('jump',!vis);p.style.transform='translate3d('+((vis?r:(r>0?2:-2))*step())+'px,0,0)'}
   else{p.dataset.k=k===0?0:k===1?1:k===2?2:(k===n-1&&n>3)?'x':3;if(k)p.style.transform=''}
   p.classList.toggle('is-top',k===0);p.setAttribute('aria-hidden',k?'true':'false');p.inert=k!==0});
  S.ti=cur;trwSync();if(dots)dots.innerHTML=ps.map(function(_,i){return '<i'+(i===cur?' class="on"':'')+'></i>'}).join('')}
 function go(dir,dx,dy){if(busy||n<2)return;busy=true;var rm=reducedM(),top=ps[cur],W=f.clientWidth,H=f.clientHeight;
  if(M===3){cur=(cur+dir+n)%n;lay();setTimeout(function(){busy=false},rm?160:320);return}
  if(dir>0){top.classList.add('out');if(rm)top.style.opacity=0;else if(M===1)top.style.transform='translate3d(0,'+(-H*1.08)+'px,0) scale(.96)';else{var sg=dx<0?-1:1;top.style.transform='translate3d('+(sg*W*1.25)+'px,'+((dy||0)+40)+'px,0) rotate('+(sg*18)+'deg)'}
   setTimeout(function(){top.classList.remove('out');top.classList.add('jump');top.style.opacity='';top.style.transform='';cur=(cur+1)%n;lay();requestAnimationFrame(function(){requestAnimationFrame(function(){top.classList.remove('jump');busy=false})})},rm?180:280)}
  else{cur=(cur-1+n)%n;var pv=ps[cur];pv.classList.add('jump');pv.dataset.k=0;pv.style.transform=rm?'':M===1?'translate3d(0,-108%,0)':'translate3d(-115%,-20px,0) rotate(-14deg)';if(rm)pv.style.opacity=0;pv.offsetWidth;pv.classList.remove('jump');pv.style.transform='';pv.style.opacity='';lay();setTimeout(function(){busy=false},120)}}
 f._go=go;f._mode=M;lay();
 dragger(f,{axis:M===1?'y':M===3?'x':null,
  can:function(e){var t=e.target;if(busy||n<2||!t.closest)return false;if(M===3&&t.closest('.tedge'))return true;if(!t.closest('.panel.is-top'))return false;return M===1||!t.closest('.ilive')},
  begin:function(){if(M===3){ps.forEach(function(p){p.classList.add('drag')});return}ps[cur].classList.add('drag');ps[(cur+1)%n].classList.add('drag')},
  move:function(dx,dy){var top=ps[cur],nx=ps[(cur+1)%n],W=f.clientWidth,H=f.clientHeight,rm=reducedM();
   if(M===3){var s=step(),edge=(cur===0&&dx>0)||(cur===n-1&&dx<0)?1:1;ps.forEach(function(p,i){var r=rel(i);if(r>=-1&&r<=1)p.style.transform='translate3d('+(r*s+dx*edge)+'px,0,0)'});return}
   if(M===1){if(dy>0){top.style.transform=rm?'':'translate3d(0,'+(dy*.35).toFixed(1)+'px,0)';return}var q=Math.min(1,-dy/(H*.35));if(rm){top.style.opacity=(1-q*.5).toFixed(3);return}
    top.style.transform='translate3d(0,'+dy.toFixed(1)+'px,0)';if(nx!==top)nx.style.transform='translate3d(0,'+(14*(1-q)).toFixed(1)+'px,0) scale('+(.94+.06*q).toFixed(4)+')';return}
   if(dy>Math.abs(dx)&&dy>0){top.style.transform=rm?'':'translate3d(0,'+(dy*.35).toFixed(1)+'px,0)';return}
   var p=Math.min(1,Math.abs(dx)/(W*.35));if(rm){top.style.opacity=(1-p*.5).toFixed(3);return}
   top.style.transform='translate3d('+dx+'px,'+(dy*.12).toFixed(1)+'px,0) rotate('+(dx/W*12).toFixed(2)+'deg)';if(top._im&&!top.classList.contains('framed'))top._im.style.transform='translate3d('+(-dx*.06).toFixed(1)+'px,0,0)';
   if(nx!==top)nx.style.transform='translate3d(0,'+(14*(1-p)).toFixed(1)+'px,0) scale('+(.94+.06*p).toFixed(4)+')'},
  end:function(dx,dy,vx0,vy){var top=ps[cur],nx=ps[(cur+1)%n],W=f.clientWidth,H=f.clientHeight;ps.forEach(function(p){p.classList.remove('drag')});if(top._im)top._im.style.transform='';top.style.opacity='';
   if(M===3){if(dx<-W*.22||(vx0<-.5&&dx<-30)){go(1);return}if(dx>W*.22||(vx0>.5&&dx>30)){go(-1);return}lay();return}
   if(M===1){if(dy<0&&(-dy>H*.18||(vy<-.5&&-dy>30))){go(1,0,dy);return}if(dy>0&&(dy>H*.16||(vy>.5&&dy>30))){top.style.transform='';go(-1);return}top.style.transform='';if(nx!==top)nx.style.transform='';return}
   if(dy>Math.abs(dx)&&(dy>H*.16||(vy>.5&&dy>30))){top.style.transform='';go(-1);return}
   if(Math.abs(dx)>W*.28||(Math.abs(vx0)>.5&&Math.abs(dx)>30)){go(1,dx,dy);return}
   top.style.transform='';if(nx!==top)nx.style.transform=''}})}
document.addEventListener('keydown',function(e){if(S.tab!=='today'||app.querySelectorAll(':scope > .scr').length>1||document.getElementById('sh'))return;if(e.target.closest&&e.target.closest('input,textarea'))return;var f=document.getElementById('feed');if(!f||!f._go||f._mode!==1)return;
 if(e.key==='ArrowDown'){e.preventDefault();f._go(1)}else if(e.key==='ArrowUp'){e.preventDefault();f._go(-1)}});

var CG=[[1,'tl'],[3,'tr'],[0,'bl'],[2,'br']],GV=[[-1,.12],[-1,-.55],[1,.12],[1,-.55]];
function cornerBack(c,src){return '<div class="cf-b cf-bk"><div class="cf-ans"><div class="cf-a">'+clozeAns(c.q,c.cn)+'</div><div class="cf-src">'+src+'</div></div>'+
 CG.map(function(x){var g=x[0],iv=fmt(nextIv(c,g),g);return '<span class="cgz cgz-'+x[1]+' g'+g+'" data-cg="'+g+'" role="button" tabindex="0" aria-label="'+RV_G[g]+', next in '+iv+'"><span class="cgl"><i></i><b>'+RV_G[g]+'</b><small>'+iv+'</small></span></span>'}).join('')+'</div>'}
function fitAns(box){var an=box.querySelector('.cf-ans'),a=box.querySelector('.cf-a'),k=0,fs;if(!an||!a)return;a.style.fontSize='';while(k++<40&&an.scrollHeight>an.clientHeight+1&&(fs=parseFloat(getComputedStyle(a).fontSize))>16)a.style.fontSize=(fs-2)+'px'}
function turnLive(lv){lv.classList.toggle('flip');lv.setAttribute('aria-label',lv.classList.contains('flip')?'Card answer. Swipe or tap a corner to grade':'Turn the card')}
var GLY={x:'<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round"><path d="M6.5 6.5l11 11M17.5 6.5l-11 11"/></svg>',v:'<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12.6 4.6 4.6L19.2 7.4"/></svg>'};
function istackHtml(sc,kind){var q=freeQ(sc),foot=kind==='today'?'<button class="iall" data-tab="cards">All cards</button>':'';
 if(!q.length)return '<div class="istack empty" data-sc="'+scStr(sc)+'" data-kind="'+kind+'"><div class="ifaces"><div class="cf ghost fan0"><div class="cf-in"><div class="cf-f"><p class="cempty">'+(C.some(function(c){return c.unl&&!c.del})?'Nothing here to study.':'Each lesson you finish unlocks its cards.')+'</p></div></div></div></div>'+foot+'</div>';
 var top=q[0],bh=q.slice(1,3);
 return '<div class="istack" data-sc="'+scStr(sc)+'" data-kind="'+kind+'"><div class="ifaces">'+bh.map(function(x,k){return cardFace(x,{cls:'ib ib'+(k+1),noBack:true})}).reverse().join('')+
  cardFace(top,{cls:'ilive'+(S.fx.enter?' enter':''),corners:true,attr:' data-ci="'+top.i+'" role="button" tabindex="0" aria-label="Turn the card"',extra:'<div class="itint" aria-hidden="true"></div><div class="istamp" aria-hidden="true"></div>'})+'</div>'+
  '<div class="ibtns"><button class="ibx" data-ig="0" aria-label="Again, I did not know it">'+GLY.x+'</button><button class="ibu" data-im="undo" aria-label="Undo the last grade">'+I.rw+'</button><button class="ibv" data-ig="2" aria-label="Good, I knew it">'+GLY.v+'</button></div>'+
  (kind==='topic'?topicBar(top):'')+foot+'</div>'}
function cueIS(box,live,g,p){var c=C[+live.dataset.ci],tint=live.querySelector('.itint'),st=live.querySelector('.istamp');
 tint.className='itint g'+g;tint.style.opacity=p.toFixed(3);st.className='istamp g'+g+(p>=1?' on':'');st.textContent=RV_G[g]+' · '+fmt(nextIv(c,g),g);st.style.opacity=Math.min(1,p*1.4).toFixed(3);
 box.style.setProperty('--px',(g<2?p:0).toFixed(3));box.style.setProperty('--pv',(g>=2?p:0).toFixed(3))}
function wireIS(box){var live=box&&box.querySelector('.ilive');if(!live||live._w)return;live._w=1;
 dragger(live,{axis:'x',can:function(){return !box._busy},begin:function(){live.classList.add('drag')},
  move:function(dx,dy){var W=box.clientWidth||300,p=Math.min(1,Math.abs(dx)/(W*.3));
   live.style.transform='translate3d('+dx.toFixed(1)+'px,'+(dy*.1).toFixed(1)+'px,0) rotate('+(dx/W*14).toFixed(2)+'deg)';cueIS(box,live,dx>0?2:0,p)},
  end:function(dx,dy,vx0){live.classList.remove('drag');var W=box.clientWidth||300;
   if(Math.abs(dx)>W*.3||(Math.abs(vx0)>.5&&Math.abs(dx)>40)){igrade(box,dx>0?2:0,dx,dy);return}
   live.style.transform='';live.querySelector('.itint').style.opacity=0;live.querySelector('.istamp').style.opacity=0;box.style.setProperty('--px',0);box.style.setProperty('--pv',0)}})}
function igrade(box,g,dx,dy){var live=box.querySelector('.ilive');if(!live||box._busy)return;box._busy=1;var c=C[+live.dataset.ci],W=box.clientWidth||300,v=GV[g],rm=reducedM();
 cueIS(box,live,g,1);live.classList.add('fling');
 if(rm)live.style.opacity=0;else live.style.transform='translate3d('+(v[0]*W*1.35)+'px,'+((dy||0)+v[1]*W*.6+24)+'px,0) rotate('+(v[0]*18)+'deg)';
 setTimeout(function(){fgrade(c,g);S.fx.recent=S.fx.recent.filter(function(x){return x!==c});S.fx.recent.push(c);if(S.fx.recent.length>6)S.fx.recent.shift();if(S.fx.front===c)S.fx.front=null;redrawIS(box,true)},rm?160:280)}

function lessonHero(l){var R=vx().R,a=artFor(hero(l));
 if(R===2)return '<header class="lhero lh2"><div class="lh2-k">'+esc(l.f)+' · '+l.m+' min</div><h1 class="lh2-t">'+l.t+'</h1><div class="lh2-im"><img alt="" src="'+a.src+'" style="object-position:'+a.pos+'"></div></header>';
 return '<header class="lhero'+(R===3?' lh3':'')+(a.frame?' framed':'')+'" style="'+scrimVars(a)+'">'+artImg(a)+'<h1 class="poster '+titleStep(l.t,a,R===3?1:2)+'">'+l.t+'</h1><div class="meta">'+esc(l.f)+' · '+l.m+' min</div></header>'}
function bosBar(attr){return '<div class="bbar"><button class="bbarb"'+attr+'>'+bosMini()+'<span>Talk to Boswell</span></button></div>'}
function upNext(l){var u=L.filter(function(x){return x!==l&&x.state!=='read'&&x.f===l.f})[0]||L.filter(function(x){return x!==l&&x.state!=='read'})[0];if(!u)return '';
 return '<div class="upn"><div class="upn-k">Up next</div><button class="upn-r" data-upn="'+u.i+'"><img alt="" src="'+(T[u.no]||hero(u))+'"><span class="upn-t"><b>'+u.t+'</b><small>'+esc(u.f)+' · '+u.m+' min</small></span><span class="upn-c" aria-hidden="true"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 5 7 7-7 7"/></svg></span></button></div>'}
var HI={read:'<svg viewBox="0 0 28 28" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M14 8.2c-2.6-2-6.2-2.6-9.8-2v15.6c3.6-.6 7.2 0 9.8 2 2.6-2 6.2-2.6 9.8-2V6.2c-3.6-.6-7.2 0-9.8 2Z"/><path d="M14 8.2v15.6"/></svg>',
 listen:'<svg viewBox="0 0 28 28" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4.5 17v-3a9.5 9.5 0 0 1 19 0v3"/><rect x="4.5" y="16" width="4.6" height="7.4" rx="2"/><rect x="18.9" y="16" width="4.6" height="7.4" rx="2"/></svg>',
 watch:'<svg viewBox="0 0 28 28" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><rect x="3.5" y="6" width="21" height="16" rx="3.5"/><path d="M12 10.6v6.8l5.6-3.4Z" fill="currentColor"/></svg>'};
function lessonDom(sh){sh.querySelectorAll('.read-head>span:first-child,.listen-head>span:first-child,.watch-label,.co-label').forEach(function(s){if(s.classList.contains('wv-hl'))return;var t=s.textContent,k=/listen/i.test(t)?'listen':/watch/i.test(t)?'watch':'read';s.insertAdjacentHTML('afterbegin',HI[k]);s.classList.add('wv-hl')});
 var b=sh.querySelector('.body');if(b){var p=b.querySelector(':scope > p');if(p)p.classList.add('wv-lede')}}
function glossSheet(g){var gb=g.querySelector('.gloss-body'),k=gb&&gb.querySelector('.gloss-kind'),term=[].filter.call(g.childNodes,function(n){return n!==gb}).map(function(n){return n.textContent}).join('').trim(),def=gb?gb.textContent.slice(k?k.textContent.length:0).trim():'';
 sheet('<div class="glsh">'+(k?'<div class="glk">'+esc(k.textContent)+'</div>':'')+'<div class="glt">'+esc(term)+'</div><p>'+esc(def)+'</p></div>')}
app.addEventListener('click',function(e){var b=e.target.closest('[data-upn],[data-a="vxpill"],[data-a="tnext"]');if(!b)return;var d=b.dataset;
 if(d.upn!=null){var n=L[+d.upn];closeTop();if(app.querySelectorAll(':scope > .scr').length===1)root();readLesson(n);return}
 if(d.a==='vxpill'){S.opts.vxHide=!S.opts.vxHide;b.setAttribute('aria-checked',!S.opts.vxHide);applyVx();try{WV.save()}catch(_){}return}
 if(d.a==='tnext'){var f=document.getElementById('feed');if(f&&f._go)f._go(1)}});

S.anc=S.anc||{};S.tdraft=S.tdraft||null;
function topicCount(){var t=document.querySelector('.topic'),bx=t&&t.querySelector('.istack');if(!bx)return;var sc=scOf(bx.dataset.sc),n=C.filter(function(c){return c.unl&&!c.del&&inScope(c,sc)}).length,u=t.querySelector('.top .unl');if(u)u.textContent=n+' card'+(n===1?'':'s')}
function ancList(sh){return [].slice.call(sh.querySelectorAll('.body > *, .endmatter, .folio > figure, .folio > .strip'))}
function docTop(d,el){return el.getBoundingClientRect().top-d.getBoundingClientRect().top+d.scrollTop}
function anchorOf(d,sh){var y=d.scrollTop+72,a=ancList(sh);for(var i=0;i<a.length;i++){var t=docTop(d,a[i]);if(t+a[i].offsetHeight>y)return [i,Math.round(d.scrollTop-t)]}return null}
function pinAnchor(d,sh,an,flag){var host=sh.host,stop=false,ro=null;function put(){if(stop)return;var el=ancList(sh)[an[0]];if(el)d.scrollTop=docTop(d,el)+an[1]}
 function end(){if(stop)return;stop=true;flag(false);if(ro)ro.disconnect();['wheel','touchstart','pointerdown','keydown'].forEach(function(t){d.removeEventListener(t,end)})}
 flag(true);put();['wheel','touchstart','pointerdown','keydown'].forEach(function(t){d.addEventListener(t,end,{passive:true})});
 try{ro=new ResizeObserver(function(){requestAnimationFrame(put)});ro.observe(host)}catch(e){}
 [].slice.call(sh.querySelectorAll('img')).forEach(function(i){if(!i.complete)i.addEventListener('load',function(){requestAnimationFrame(put)})});
 setTimeout(end,5000)}
function markExternal(sh){sh.querySelectorAll('a[data-wvl]').forEach(function(a){if(byH(a.getAttribute('data-wvl')+'.html')||a.classList.contains('wv-ext'))return;a.classList.add('wv-ext');a.setAttribute('aria-label',a.textContent.trim()+' (opens the lesson on the website)');var tn=a.lastChild;if(tn&&tn.nodeType===3&&/\s*\u2192\s*$/.test(tn.textContent))tn.textContent=tn.textContent.replace(/\s*\u2192\s*$/,'');a.insertAdjacentHTML('beforeend','<span class="wv-exti" aria-hidden="true"> ↗</span>')})}
function shareImage(){var W=1080,H=1350,cv=document.createElement('canvas'),x=cv.getContext('2d'),all=fieldStats(),wv=all.filter(function(f){return f.tier==='Well-Versed'}),rd=L.filter(function(l){return l.state==='read'}),st=streak();cv.width=W;cv.height=H;
 x.fillStyle='#0b0a09';x.fillRect(0,0,W,H);x.fillStyle='rgba(251,247,240,.78)';x.font='600 34px -apple-system,Helvetica,Arial,sans-serif';x.fillText('Well-Versed',80,120);
 x.fillStyle='#fbf7f0';x.font='180px "DM Serif Display",Georgia,serif';x.fillText((wv.length+(wv.length===1?' field':' fields')),76,320);
 x.font='italic 44px Spectral,Georgia,serif';x.fillText('Well-versed in '+wv.length+' of '+all.length,80,400);
 x.fillStyle='#c6cc4e';x.font='72px "DM Serif Display",Georgia,serif';wv.slice(0,3).forEach(function(f,i){x.fillText(plain(f.n),80,500+i*86)});
 x.fillStyle='rgba(251,247,240,.78)';x.font='500 36px -apple-system,Helvetica,Arial,sans-serif';x.fillText(rd.length+(rd.length===1?' lesson':' lessons')+(st?' · '+st+(st===1?' day':' days')+' in a row':''),80,820);
 var th=rd.slice(0,12),s=(W-160-5*10)/6;return Promise.all(th.map(function(l,i){return new Promise(function(res){var im=new Image();im.onload=function(){var cx=80+(i%6)*(s+10),cy=900+Math.floor(i/6)*(s+10),r=Math.min(im.width,im.height);x.drawImage(im,(im.width-r)/2,(im.height-r)/2,r,r,cx,cy,s,s);res()};im.onerror=res;im.src=T[l.no]||''})})).then(function(){return new Promise(function(res){cv.toBlob(res,'image/png')})})}
app.addEventListener('click',function(e){var b=e.target.closest('[data-a="saveshare"]');if(!b)return;var a=document.getElementById('sacts'),dl=a&&a._dl;if(!dl)return;b.disabled=true;
 shareImage().then(function(blob){return dl.save({filename:'well-versed.png',data:blob})}).then(function(){toast('Saved')},function(err){var c=err&&err.code;if(c==='declined'||c==='rate_limited'){}else{a.innerHTML=''}}).then(function(){if(b.isConnected)b.disabled=false})});
app.addEventListener('input',function(e){if(e.target.id==='tin'&&talkL)S.tdraft=e.target.value.trim()?{h:talkL.h,v:e.target.value}:null});
function trwSync(){var r=document.querySelector('.trw');if(r)r.hidden=!(S.ti>0)}
if(document.fonts&&document.fonts.ready)document.fonts.ready.then(function(){fitAll()});
WV.load();
if((S.opts.vxr||0)<5){S.opts.vx=Object.assign({},S.opts.vx||{},{N:VXD.N});S.opts.vxr=5}
applyLook();applyVx();
C.forEach(function(c){var l=c.h&&byH(c.h);if(l&&l.state==='read')c.unl=true});
root();
(function(){var m=/[?&]l=([a-z0-9-]+)/.exec(location.search);if(!m)return;var l=byH(m[1]+'.html');if(l)readLesson(l)})();

document.addEventListener('dragstart',function(e){if(e.target.closest&&e.target.closest('#app'))e.preventDefault()});

function wvBackup(){var raw=null;try{raw=localStorage.getItem('wv.mvp.v1')}catch(e){}
 if(!raw){toast('Nothing saved yet on this device');return}
 var name='well-versed-backup-'+new Date().toISOString().slice(0,10)+'.json',f=null;try{f=new File([raw],name,{type:'application/json'})}catch(e){}
 if(f&&navigator.canShare&&navigator.canShare({files:[f]})){navigator.share({files:[f],title:'Well-Versed backup'}).catch(function(){});return}
 var u=URL.createObjectURL(new Blob([raw],{type:'application/json'})),l=document.createElement('a');l.href=u;l.download=name;document.body.appendChild(l);l.click();setTimeout(function(){URL.revokeObjectURL(u);l.remove()},1500)}
function wvRestore(btn){var i=document.createElement('input');i.type='file';i.accept='application/json,.json';
 i.onchange=function(){var f=i.files&&i.files[0];if(!f)return;var r=new FileReader();r.onload=function(){var o=null;try{o=JSON.parse(r.result)}catch(e){}
  if(!o||o.v!==3||typeof o.prog!=='object'){toast('That file is not a Well-Versed backup');return}
  try{localStorage.setItem('wv.mvp.v1',r.result)}catch(e){toast('Could not save the backup on this device');return}
  var keep=Storage.prototype.setItem;Storage.prototype.setItem=function(k,v){if(k!=='wv.mvp.v1')keep.call(this,k,v)};
  location.reload()};r.readAsText(f)};i.click()}
