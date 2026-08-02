(function(){"use strict";
var reduce=window.matchMedia&&window.matchMedia("(prefers-reduced-motion: reduce)").matches;
var coarse=window.matchMedia&&window.matchMedia("(pointer:coarse)").matches;
/* ---------- hero: ten distinct generative backgrounds, blending at random ---------- */
  try{
    var hex=function(h,a){var n=parseInt(h.slice(1),16);return 'rgba('+((n>>16)&255)+','+((n>>8)&255)+','+(n&255)+','+a+')';};
    var mix=function(h1,h2,f){var a=parseInt(h1.slice(1),16),b=parseInt(h2.slice(1),16);
      var r=((a>>16&255)+(((b>>16&255)-(a>>16&255))*f))|0,g=((a>>8&255)+(((b>>8&255)-(a>>8&255))*f))|0,bl=((a&255)+(((b&255)-(a&255))*f))|0;return 'rgb('+r+','+g+','+bl+')';};

    var ENG={
      silk:{filter:function(){return coarse?'blur(22px)':'blur(36px)';},
        init:function(L){var cols=['#e0935a','#d4604f','#c76a4a','#dcb47e','#8f5a6e','#e8a86a'];L.st.b=[];for(var i=0;i<6;i++)L.st.b.push({bx:Math.random(),by:Math.random(),r:.46+Math.random()*.34,sx:.6+Math.random()*1.0,sy:.5+Math.random()*1.0,ph:Math.random()*6.28,co:cols[i%cols.length]});},
        step:function(L,t){var c=L.ctx;c.globalCompositeOperation='source-over';c.fillStyle='#0b0908';c.fillRect(0,0,L.W,L.H);c.globalCompositeOperation='lighter';var tt=t*0.0002;
          for(var i=0;i<L.st.b.length;i++){var b=L.st.b[i],cx=(b.bx+Math.sin(tt*b.sx+b.ph)*0.26)*L.W,cy=(b.by+Math.cos(tt*b.sy+b.ph*1.3)*0.26)*L.H,rr=b.r*Math.min(L.W,L.H);
            var g=c.createRadialGradient(cx,cy,0,cx,cy,rr);g.addColorStop(0,hex(b.co,.72));g.addColorStop(.5,hex(b.co,.26));g.addColorStop(1,hex(b.co,0));c.fillStyle=g;c.beginPath();c.arc(cx,cy,rr,0,6.2832);c.fill();}c.globalCompositeOperation='source-over';}},
      aurora:{filter:function(){return coarse?'blur(14px)':'blur(22px)';},
        init:function(L){var cols=['#e0935a','#d4604f','#c07a58','#9f6478'];L.st.b=[];for(var i=0;i<4;i++)L.st.b.push({y:.24+i*0.16,amp:.07+Math.random()*.06,fr:.6+Math.random()*.8,ph:Math.random()*6.28,co:cols[i],sp:.5+Math.random()*.5,th:.12+Math.random()*.06});},
        step:function(L,t){var c=L.ctx;c.fillStyle='#0b0908';c.fillRect(0,0,L.W,L.H);c.globalCompositeOperation='lighter';var tt=t*0.00034;
          for(var i=0;i<L.st.b.length;i++){var b=L.st.b[i],baseY=b.y*L.H,th=b.th*L.H;c.beginPath();c.moveTo(0,baseY);
            for(var x=0;x<=L.W;x+=14){var yy=baseY+Math.sin(x*0.004*b.fr+tt*b.sp+b.ph)*b.amp*L.H+Math.cos(x*0.0012-tt*b.sp)*th*0.5;c.lineTo(x,yy);}
            c.lineTo(L.W,baseY+th*3.4);c.lineTo(0,baseY+th*3.4);c.closePath();
            var g=c.createLinearGradient(0,baseY-th,0,baseY+th*3.4);g.addColorStop(0,hex(b.co,0));g.addColorStop(.5,hex(b.co,.46));g.addColorStop(1,hex(b.co,0));c.fillStyle=g;c.fill();}c.globalCompositeOperation='source-over';}},
      ember:{filter:function(){return coarse?'blur(6px)':'blur(10px)';},
        init:function(L){var cols=['#e0935a','#d4604f','#dcb47e','#c76a4a'];var n=coarse?28:46;L.st.m=[];for(var i=0;i<n;i++){var r=14+Math.pow(Math.random(),1.5)*78;L.st.m.push({x:Math.random()*L.W,y:Math.random()*L.H,r:r,co:cols[i%cols.length],vy:-(0.08+Math.random()*0.34),ph:Math.random()*6.28,a:0.14+(92-r)/92*0.44});}},
        step:function(L,t){var c=L.ctx;c.globalCompositeOperation='source-over';c.fillStyle='#0b0908';c.fillRect(0,0,L.W,L.H);c.globalCompositeOperation='lighter';
          for(var i=0;i<L.st.m.length;i++){var p=L.st.m[i];p.y+=p.vy;p.x+=Math.sin(t*0.0005+p.ph)*0.22;if(p.y<-p.r){p.y=L.H+p.r;p.x=Math.random()*L.W;}
            var tw=p.a*(0.72+0.28*Math.sin(t*0.0018+p.ph)),g=c.createRadialGradient(p.x,p.y,0,p.x,p.y,p.r);g.addColorStop(0,hex(p.co,tw));g.addColorStop(.5,hex(p.co,tw*0.4));g.addColorStop(1,hex(p.co,0));c.fillStyle=g;c.beginPath();c.arc(p.x,p.y,p.r,0,6.2832);c.fill();}c.globalCompositeOperation='source-over';}},
      plasma:{filter:function(){return coarse?'blur(12px)':'blur(16px)';},
        init:function(L){L.st.cell=coarse?34:26;},
        step:function(L,t){var c=L.ctx,cell=L.st.cell,tt=t*0.0006,cx=L.W/2,cy=L.H/2;c.globalCompositeOperation='source-over';c.globalAlpha=0.96;
          for(var y=0;y<L.H;y+=cell){for(var x=0;x<L.W;x+=cell){
            var v=Math.sin(x*0.009+tt)+Math.sin(y*0.010-tt*1.1)+Math.sin((x+y)*0.006+tt*0.7)+Math.sin(Math.sqrt((x-cx)*(x-cx)+(y-cy)*(y-cy))*0.007-tt*1.3);
            var b=(v+4)/8;if(b<0)b=0;if(b>1)b=1;
            c.fillStyle=b<0.5?mix('#1f0e0c','#d4604f',b*2):mix('#d4604f','#f0b476',(b-0.5)*2);
            c.fillRect(x,y,cell+1,cell+1);}}c.globalAlpha=1;}},
      rays:{filter:function(){return coarse?'blur(6px)':'blur(3px)';},
        init:function(L){L.st.n=coarse?8:12;L.st.ph=[];for(var i=0;i<L.st.n;i++)L.st.ph.push(Math.random()*6.28);},
        step:function(L,t){var c=L.ctx;c.globalCompositeOperation='source-over';c.fillStyle='#0b0908';c.fillRect(0,0,L.W,L.H);
          var cx=L.W*0.5,cy=L.H*0.44,R=Math.max(L.W,L.H)*1.15,n=L.st.n,rot=t*0.00006;c.globalCompositeOperation='lighter';
          for(var i=0;i<n;i++){var ang=i*(6.2832/n)+rot,hw=0.05+0.03*Math.sin(t*0.0007+L.st.ph[i]),col=i%2?'#e0935a':'#d4604f';
            c.beginPath();c.moveTo(cx,cy);c.arc(cx,cy,R,ang-hw,ang+hw);c.closePath();
            var g=c.createRadialGradient(cx,cy,0,cx,cy,R);g.addColorStop(0,hex(col,0.20));g.addColorStop(.35,hex(col,0.07));g.addColorStop(1,hex(col,0));c.fillStyle=g;c.fill();}
          var cg=c.createRadialGradient(cx,cy,0,cx,cy,R*0.42);cg.addColorStop(0,hex('#e0935a',0.13));cg.addColorStop(1,hex('#e0935a',0));c.fillStyle=cg;c.fillRect(0,0,L.W,L.H);c.globalCompositeOperation='source-over';}},
      halftone:{filter:function(){return coarse?'blur(0.4px)':'none';},
        init:function(L){L.st.g=coarse?26:20;},
        step:function(L,t){var c=L.ctx,g=L.st.g;c.fillStyle='#0c0a09';c.fillRect(0,0,L.W,L.H);
          for(var y=g*0.5;y<L.H;y+=g){for(var x=g*0.5;x<L.W;x+=g){var v=Math.sin(x*0.011-t*0.0017)+Math.sin(y*0.013+t*0.0012)+Math.sin((x+y)*0.006+t*0.001);
            var b=(v+3)/6,r=(g*0.17)*(0.14+b*1.15),a=0.10+b*0.62,col=b>0.6?'#e0935a':'#d4604f';c.fillStyle=hex(col,a);c.beginPath();c.arc(x,y,r,0,6.2832);c.fill();}}}},
      contour:{filter:function(){return 'none';},
        init:function(L){L.st.n=coarse?15:20;},
        step:function(L,t){var c=L.ctx,tt=t*0.00042,N=L.st.n;c.fillStyle='#0c0a09';c.fillRect(0,0,L.W,L.H);
          for(var i=0;i<N;i++){var baseY=(i/(N-1))*L.H*1.18-L.H*0.09,a=0.10+0.22*Math.sin(i*0.55+tt*2);if(a<0.06)a=0.06;
            c.strokeStyle=hex(i%3===0?'#e0935a':'#d4604f',a);c.lineWidth=i%4===0?1.5:0.9;c.beginPath();
            for(var x=0;x<=L.W;x+=12){var yy=baseY+Math.sin(x*0.005+tt*1.3+i*0.5)*30+Math.sin(x*0.011-tt*1.6+i)*13+Math.cos(x*0.002+tt)*9;if(x===0)c.moveTo(x,yy);else c.lineTo(x,yy);}c.stroke();}}},
      ripple:{filter:function(){return coarse?'blur(1px)':'none';},
        init:function(L){L.st.k=coarse?8:12;},
        step:function(L,t){var c=L.ctx,cx=L.W*0.5,cy=L.H*0.46,maxR=Math.sqrt(L.W*L.W+L.H*L.H)*0.62,K=L.st.k,base=t*0.035;c.fillStyle='#0b0908';c.fillRect(0,0,L.W,L.H);c.globalCompositeOperation='lighter';
          for(var k=0;k<K;k++){var r=((base+k*(maxR/K))%maxR),a=(1-r/maxR)*0.5;if(a<0.02)continue;var col=k%2?'#e0935a':'#d4604f';
            c.strokeStyle=hex(col,a);c.lineWidth=1.5;c.beginPath();c.arc(cx,cy,r,0,6.2832);c.stroke();}c.globalCompositeOperation='source-over';}},
      lattice:{filter:function(){return coarse?'blur(0.6px)':'blur(0.4px)';},
        init:function(L){L.st.gap=coarse?58:46;},
        step:function(L,t){var c=L.ctx,gap=L.st.gap,off=(t*0.012)%gap,tt=t*0.0016;c.fillStyle='#0b0908';c.fillRect(0,0,L.W,L.H);
          c.strokeStyle=hex('#d4604f',0.055);c.lineWidth=1;c.beginPath();
          for(var x=-gap+off;x<L.W+gap;x+=gap){c.moveTo(x,0);c.lineTo(x,L.H);}for(var y=-gap+off*0.6;y<L.H+gap;y+=gap){c.moveTo(0,y);c.lineTo(L.W,y);}c.stroke();c.globalCompositeOperation='lighter';
          for(var yy=-gap+off*0.6;yy<L.H+gap;yy+=gap*2){for(var xx=-gap+off;xx<L.W+gap;xx+=gap*2){var a=0.12+0.4*Math.sin(xx*0.03+yy*0.02+tt*3);if(a>0.04){c.fillStyle=hex('#e0935a',a);c.beginPath();c.arc(xx,yy,1.7,0,6.2832);c.fill();}}}c.globalCompositeOperation='source-over';}},
      dust:{filter:function(){return coarse?'blur(0.5px)':'none';},
        init:function(L){var n=coarse?90:150;L.st.d=[];var cols=['#f3e6d0','#e0935a','#dcb47e','#f0c89a'];
          for(var i=0;i<n;i++){var dp=0.35+Math.random()*0.65;L.st.d.push({x:Math.random()*L.W,y:Math.random()*L.H,r:0.5+dp*2.1,vy:-(0.04+Math.random()*0.14)*dp,vx:(Math.random()-0.5)*0.1,a:0.18+dp*0.5,ph:Math.random()*6.28,co:cols[i%cols.length]});}},
        step:function(L,t){var c=L.ctx;c.globalCompositeOperation='source-over';c.fillStyle='#0b0908';c.fillRect(0,0,L.W,L.H);c.globalCompositeOperation='lighter';
          for(var i=0;i<L.st.d.length;i++){var p=L.st.d[i];p.y+=p.vy;p.x+=p.vx;if(p.y<-2){p.y=L.H+2;p.x=Math.random()*L.W;}if(p.x<-2)p.x=L.W+2;else if(p.x>L.W+2)p.x=-2;
            var a=p.a*(0.55+0.45*Math.sin(t*0.002+p.ph));c.fillStyle=hex(p.co,a);c.beginPath();c.arc(p.x,p.y,p.r,0,6.2832);c.fill();}c.globalCompositeOperation='source-over';}}
    };
    var SEQ=['silk','aurora','ember','plasma','rays','halftone','contour','ripple','lattice','dust'];

    var mk=function(id){var el=document.getElementById(id);return {el:el,ctx:el.getContext('2d'),W:0,H:0,st:{},eng:null};};
    var Ls=[mk('f0'),mk('f1')],frontIdx=0,t0=performance.now(),timer=null;
    var dims=function(L){L.W=L.el.clientWidth;L.H=L.el.clientHeight;if(L.W<2||L.H<2)return;var DPR=Math.min(window.devicePixelRatio||1,2);L.el.width=L.W*DPR;L.el.height=L.H*DPR;L.ctx.setTransform(DPR,0,0,DPR,0,0);};
    var mount=function(L,name){L.eng=name;dims(L);L.st={};L.el.style.filter=ENG[name].filter();ENG[name].init(L);};
    var frame=function(){var t=performance.now()-t0;for(var k=0;k<2;k++){var L=Ls[k];if(!L.eng)continue;if(L.el.clientWidth!==L.W||L.el.clientHeight!==L.H){dims(L);ENG[L.eng].init(L);}try{ENG[L.eng].step(L,t);}catch(e){}}requestAnimationFrame(frame);};
    var fadeTo=function(name){var back=1-frontIdx,B=Ls[back],F=Ls[frontIdx];mount(B,name);requestAnimationFrame(function(){requestAnimationFrame(function(){B.el.style.opacity='1';F.el.style.opacity='0';});});frontIdx=back;};
    var randNot=function(cur){var o=SEQ.filter(function(x){return x!==cur;});return o[Math.floor(Math.random()*o.length)];};
    var HOLD=reduce?7000:3000,JIT=reduce?3000:2000;
    var scheduleAuto=function(){clearTimeout(timer);var d=HOLD+Math.random()*JIT;timer=setTimeout(function(){fadeTo(randNot(Ls[frontIdx].eng));scheduleAuto();},d);};

    var first=SEQ[Math.floor(Math.random()*SEQ.length)];
    mount(Ls[0],first);mount(Ls[1],randNot(first));
    Ls[0].el.style.transition='none';Ls[0].el.style.opacity='1';
    requestAnimationFrame(function(){Ls[0].el.style.transition='';});
    requestAnimationFrame(frame);scheduleAuto();
    window.addEventListener('resize',function(){Ls.forEach(function(L){if(L.eng){dims(L);ENG[L.eng].init(L);}});});
  }catch(e){}

  /* ---------- folio: live Miami date + time ---------- */
  try{
    var fmt=function(o){try{return new Intl.DateTimeFormat('en-US',Object.assign({timeZone:'America/New_York'},o)).format(new Date());}catch(_){return'';}};
    var ticks=function(){var c=document.getElementById('clk'),d=document.getElementById('date');
      if(c)c.textContent=fmt({hour:'numeric',minute:'2-digit'});if(d)d.textContent=fmt({weekday:'long',month:'long',day:'numeric',year:'numeric'});};
    ticks();setInterval(ticks,20000);
  }catch(e){}

  
})();
