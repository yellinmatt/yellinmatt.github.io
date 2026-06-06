/* Greatest Bits — shared search module.
 *
 * Loads data/search-index.json (built by scripts/build_search_index.py).
 * Auto-creates the modal overlay if missing.
 * Wires up:
 *   - The home-page hero card  (any .gbhero with an input inside)
 *   - The inner-page header strip (any .gbhead with an input inside)
 *   - Legacy .nav .search / .navsearch triggers
 *   - The "/" key from anywhere
 * Scoring: every query token must appear in title or full-text; title hits 3x,
 *          sub 2x, full-text 1x; prefix-of-name bonus.
 */
(function(){
  if (window.__gbsearch_loaded__) return;
  window.__gbsearch_loaded__ = true;

  var INDEX = null;       // {items:[...]}
  var sel = 0;
  var rows = [];
  var ov, ip, res;

  // ---------- Overlay markup (auto-create if not present) ----------
  function ensureOverlay(){
    ov = document.getElementById("gbsearch");
    if (!ov){
      ov = document.createElement("div");
      ov.id = "gbsearch";
      ov.className = "gbsearch";
      ov.innerHTML = '<div class="panel">'
        + '<div class="ip"><span class="ic">&#9906;</span>'
        + '<input id="gbq" autocomplete="off" placeholder="Search comics, specials, bits…">'
        + '<span class="esc">ESC</span></div>'
        + '<div class="res" id="gbres"></div>'
        + '</div>';
      document.body.appendChild(ov);
    }
    ip  = document.getElementById("gbq");
    res = document.getElementById("gbres");
  }

  // ---------- Index ----------
  function load(){
    if (INDEX) return Promise.resolve(INDEX);
    return fetch("data/search-index.json?v="+Date.now())
      .then(function(r){return r.ok ? r.json() : {items:[]};})
      .catch(function(){return {items:[]};})
      .then(function(d){INDEX = d; return d;});
  }

  // ---------- Scoring ----------
  function tokens(q){
    return (q||"").toLowerCase()
      .replace(/[^\w\s'-]+/g, " ")
      .split(/\s+/)
      .filter(function(t){return t && t.length>=2;});
  }

  function score(it, toks){
    var t = it.t || "";
    var sub = (it.sub||"").toLowerCase();
    var ft = it.ft || "";
    var s = 0;
    for (var i=0;i<toks.length;i++){
      var tok = toks[i];
      var inT  = t.indexOf(tok) > -1;
      var inS  = sub.indexOf(tok) > -1;
      var inFt = ft.indexOf(tok) > -1;
      if (!inT && !inS && !inFt) return 0;        // every token must match somewhere
      if (inT) s += 3;
      if (inS) s += 2;
      if (inFt && !inT) s += 1;                    // ft hit only counts if not already in title
      if (inT && t.indexOf(tok) === 0) s += 2;     // prefix bonus
    }
    // Type tiebreaker: Comic > Special > Bit > TV/Podcast/Set/Other
    var tieMap = {Comic:0.5, Special:0.4, Bit:0.35, TV:0.25, Podcast:0.2, Set:0.15, Play:0.1, Other:0.05};
    s += tieMap[it.ty] || 0;
    return s;
  }

  function esc(x){
    return (x||"").toString()
      .replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
  }

  function render(q){
    if (!INDEX){ res.innerHTML = '<div class="empty">Loading…</div>'; return; }
    var toks = tokens(q);
    if (!toks.length){
      res.innerHTML = '<div class="empty">Type to search comics, specials, and bits. <kbd>/</kbd> focuses · <kbd>↑↓</kbd> navigate · <kbd>↵</kbd> opens.</div>';
      rows = []; return;
    }
    var hits = [];
    var items = INDEX.items;
    for (var i=0;i<items.length;i++){
      var s = score(items[i], toks);
      if (s>0) hits.push([s, items[i]]);
    }
    hits.sort(function(a,b){return b[0]-a[0];});
    rows = hits.slice(0,24).map(function(h){return h[1];});
    sel = 0;
    if (!rows.length){
      res.innerHTML = '<div class="empty">No matches. Tough crowd.</div>';
      return;
    }
    res.innerHTML = rows.map(function(d,i){
      var av = d.img
        ? '<span class="av'+(d.ty==="Special"?' poster':'')+'"><img src="'+esc(d.img)+'" alt=""></span>'
        : '<span class="av"></span>';
      return '<a class="r'+(i===0?' sel':'')+'" href="'+esc(d.href)+'">'
        + av
        + '<div class="rt"><div class="nm">'+esc(d.nm)+'</div>'
        + '<div class="sub">'+esc(d.sub||'')+'</div></div>'
        + '<span class="ty">'+esc(d.ty)+'</span>'
        + '</a>';
    }).join("");
  }

  function open(prefill){
    ensureOverlay();
    ov.classList.add("on");
    ip.value = prefill || "";
    setTimeout(function(){ ip.focus(); ip.select(); }, 0);
    render(ip.value);
    load().then(function(){ render(ip.value); });
  }
  function close(){ if (ov) ov.classList.remove("on"); }

  function move(n){
    if (!rows.length) return;
    var els = res.querySelectorAll(".r");
    if (els[sel]) els[sel].classList.remove("sel");
    sel = (sel + n + rows.length) % rows.length;
    els[sel].classList.add("sel");
    els[sel].scrollIntoView({block:"nearest"});
  }

  // ---------- Triggers ----------
  function attachTriggers(){
    // gbhero (home page card input) and gbhead (inner-page header strip input):
    // both ACT as inputs but actually open the overlay and pre-fill it.
    document.querySelectorAll(".gbhero input, .gbhead input, .gbhero-mega input").forEach(function(el){
      el.setAttribute("autocomplete","off");
      el.addEventListener("focus", function(){
        var v = el.value;
        open(v);
      });
      el.addEventListener("click", function(){
        var v = el.value;
        open(v);
      });
      // Type-ahead: if a user types into the trigger before focus moved, mirror to overlay
      el.addEventListener("input", function(){
        ensureOverlay();
        if (!ov.classList.contains("on")) open(el.value);
        else { ip.value = el.value; render(ip.value); }
      });
    });
    // Also bind buttons inside the gbhero/gbhead that act as "Search" submits
    document.querySelectorAll(".gbhero .btn, .gbhead .btn, .gbhero button, .gbhead button, .gbhero-mega .btn.go").forEach(function(btn){
      btn.addEventListener("click", function(e){
        // Skip Surprise-Me buttons — they have their own click handlers
        if (btn.classList.contains("lucky") || btn.id === "gbHeroLucky") return;
        e.preventDefault();
        var input = btn.closest(".gbhero, .gbhead, .gbhero-mega")?.querySelector("input");
        open(input ? input.value : "");
      });
    });
    // Legacy navsearch / search pill triggers
    document.querySelectorAll(".nav .search, .nav .navsearch, [data-gbtrigger]").forEach(function(el){
      el.addEventListener("click", function(e){ e.preventDefault(); open(""); });
    });
  }

  function attachKeyboard(){
    document.addEventListener("keydown", function(e){
      var ae = document.activeElement || {};
      var isTyping = /^(INPUT|TEXTAREA|SELECT)$/.test(ae.tagName || "");
      var inHeroOrHead = isTyping && (ae.closest && (ae.closest(".gbhero") || ae.closest(".gbhead") || ae.closest(".gbhero-mega")));
      // "/" from anywhere opens the search overlay. Old condition had a stray `!ov` check
      // that was always false after boot(), so the shortcut never fired.
      if (e.key === "/" && !isTyping && !document.querySelector("#gbsearch.on")){
        e.preventDefault(); open(""); return;
      }
      if (!ov || !ov.classList.contains("on")) return;
      if (e.key === "Escape") close();
      else if (e.key === "ArrowDown"){ e.preventDefault(); move(1); }
      else if (e.key === "ArrowUp"){   e.preventDefault(); move(-1); }
      else if (e.key === "Enter"){
        var el = res.querySelectorAll(".r")[sel];
        if (el) location.href = el.getAttribute("href");
      }
    });
    // Click outside the panel closes
    document.addEventListener("click", function(e){
      if (ov && ov.classList.contains("on") && e.target === ov) close();
    });
  }

  // ---------- Surprise Me — opens a random verified bit in the cream BotD lightbox.
  // Pages can override with window.gbSurpriseOverride (browse.html keeps filter-aware comic-pick).
  // The cream lightbox markup is injected if the page didn't define one (so inner pages get it free).
  var ROSTER = null, SPECIALS = null, BITPOOL = null;
  function loadRoster(){
    if (ROSTER) return Promise.resolve(ROSTER);
    return fetch("data/comedians.json?v="+Date.now())
      .then(function(r){return r.ok ? r.json() : [];})
      .catch(function(){return [];})
      .then(function(d){ROSTER = d || []; return ROSTER;});
  }
  function loadBitPool(){
    if (BITPOOL) return Promise.resolve(BITPOOL);
    return fetch("data/specials.json?v="+Date.now())
      .then(function(r){return r.ok ? r.json() : {};})
      .catch(function(){return {};})
      .then(function(idx){
        SPECIALS = idx || {};
        var pool = [];
        Object.entries(SPECIALS).forEach(function(entry){
          var slug = entry[0], v = entry[1];
          (v.bits || []).forEach(function(b){
            if (b.id && !b.shortcode && /^[A-Za-z0-9_-]{11}$/.test(b.id)) {
              pool.push({slug: slug, t: b.t, id: b.id, comicId: v.comicId, comic: v.comic});
            }
          });
        });
        BITPOOL = pool;
        return BITPOOL;
      });
  }
  // Auto-create the shared bit lightbox if a page didn't define one.
  // Two modes from ONE component:
  //   openBitLB(bit)                       -> cream single-clip (Bit of the Day / Surprise Me)
  //   openBitLB(bit, {list, index, label}) -> dark "theater" with prev/next + position + swipe
  //                                           (the Screening Room: a row IS the feed)
  // Bit fields are tolerant: comic|c, comicId|cid, slug|sp, subj|su, era|e.
  function ensureBitLightbox(){
    if (window.openBitLB) return; // home page already provides its own cream version
    var lb = document.getElementById("gblb");
    if (!lb) {
      lb = document.createElement("div");
      lb.id = "gblb";
      lb.className = "gblightbox";
      lb.innerHTML = '<div class="lbpanel">'
        + '<button class="lbx" type="button" id="gblbx" aria-label="Close">&times;</button>'
        + '<div class="lbrow" id="gblbrowlabel"></div>'
        + '<div class="lbk" id="gblbk">Bit of the day</div>'
        + '<div class="lbttl" id="gblbttl"></div>'
        + '<div class="lbby" id="gblbby"></div>'
        + '<div class="lbplayer" id="gblbplayer">'
        +   '<button type="button" class="lbnav prev" id="gblbprev" aria-label="Previous clip"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M18 15l-6-6-6 6"/></svg></button>'
        +   '<button type="button" class="lbnav next" id="gblbnext" aria-label="Next clip"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M6 9l6 6 6-6"/></svg></button>'
        + '</div>'
        + '<div class="lbview-row">'
        + '<a class="lbview" id="gblbview" href="#">View on comic page &#8594;</a>'
        + '<span class="lbpos" id="gblbpos"></span>'
        + '<button type="button" class="lbagain" id="gblbagain">&#9856; Surprise me again</button>'
        + '</div>'
        + '</div>';
      document.body.appendChild(lb);
    }
    var pl = document.getElementById("gblbplayer");
    var seq = null, idx = 0;   // theater sequence state

    function close(){
      lb.classList.remove("on","theater");
      var fr = pl && pl.querySelector("iframe"); if (fr) fr.remove();
      seq = null;
      document.body.style.overflow = "";
    }
    function bf(b, a, c){ return b[a] != null ? b[a] : b[c]; } // field-or-fallback
    function paint(b){
      var ttl = document.getElementById("gblbttl");
      var by  = document.getElementById("gblbby");
      var vw  = document.getElementById("gblbview");
      var comic = bf(b,"comic","c"), cid = bf(b,"comicId","cid"),
          slug = bf(b,"slug","sp"), subj = bf(b,"subj","su"), era = bf(b,"era","e");
      if (ttl) ttl.textContent = b.t || "";
      if (by)  by.textContent  = comic ? ("Bit by " + comic) : "";
      var fr = pl.querySelector("iframe"); if (fr) fr.remove();
      pl.insertAdjacentHTML("beforeend",
        '<iframe src="https://www.youtube.com/embed/'+b.id+'?autoplay=1&rel=0" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe>');
      if (vw) vw.href = "comic.html?c=" + (cid||"") + (slug ? "#sp-"+slug : "");
      // theater chrome
      var pos = document.getElementById("gblbpos");
      if (pos) pos.textContent = seq ? (idx+1) + " / " + seq.length : "";
      var rl = document.getElementById("gblbrowlabel");
      if (rl) rl.innerHTML = (seq && lb.__label) ? ("In <b>"+lb.__label+"</b>") : "";
      var k = document.getElementById("gblbk");
      if (k) k.textContent = seq ? [subj, era].filter(Boolean).join(" · ") || "Now playing" : "Bit of the day";
    }
    function move(d){ if(!seq) return; idx = (idx + d + seq.length) % seq.length; paint(seq[idx]); }

    window.openBitLB = function(b, opts){
      if (opts && opts.list && opts.list.length){
        seq = opts.list; idx = opts.index || 0; lb.__label = opts.label || "";
        lb.classList.add("theater");
        paint(seq[idx]);
      } else {
        seq = null; lb.classList.remove("theater");
        paint(b);
      }
      lb.classList.add("on");
      document.body.style.overflow = "hidden";
    };
    window.__gbCloseBitLB = close;

    var xbtn = document.getElementById("gblbx"); if (xbtn) xbtn.addEventListener("click", close);
    var pv = document.getElementById("gblbprev"); if (pv) pv.addEventListener("click", function(e){e.stopPropagation();move(-1);});
    var nx = document.getElementById("gblbnext"); if (nx) nx.addEventListener("click", function(e){e.stopPropagation();move(1);});
    lb.addEventListener("click", function(e){if (e.target === lb) close();});
    document.addEventListener("keydown", function(e){
      if (!lb.classList.contains("on")) return;
      if (e.key === "Escape") close();
      else if (lb.classList.contains("theater")){
        if (e.key === "ArrowDown" || e.key === "ArrowRight"){ e.preventDefault(); move(1); }
        else if (e.key === "ArrowUp" || e.key === "ArrowLeft"){ e.preventDefault(); move(-1); }
      }
    });
    // vertical swipe = the feed (theater only)
    var ty = null;
    lb.addEventListener("touchstart", function(e){ ty = e.changedTouches[0].clientY; }, {passive:true});
    lb.addEventListener("touchend", function(e){
      if (ty === null || !lb.classList.contains("theater")) { ty = null; return; }
      var dy = e.changedTouches[0].clientY - ty;
      if (Math.abs(dy) > 55) move(dy < 0 ? 1 : -1);
      ty = null;
    }, {passive:true});
  }
  function wireSurpriseAgain(){
    document.addEventListener("click", function(e){
      var btn = e.target.closest && e.target.closest("#gblbagain, .lbagain");
      if (!btn) return;
      e.preventDefault();
      surpriseBit();
    });
  }
  function surpriseBit(){
    // Per-page override wins (browse.html keeps filter-aware comic-pick)
    if (typeof window.gbSurpriseOverride === "function") {
      try { window.gbSurpriseOverride(); return; } catch(e){}
    }
    ensureBitLightbox();
    loadBitPool().then(function(pool){
      if (!pool || !pool.length) return;
      var pick = pool[Math.floor(Math.random()*pool.length)];
      if (pick && window.openBitLB) window.openBitLB(pick);
    });
  }
  var surpriseComic = surpriseBit; // alias for any legacy callers
  function makeSurpriseBtn(){
    var b = document.createElement("button");
    b.type = "button";
    b.className = "gbsurprise";
    b.title = "Open a random comic";
    b.innerHTML = '<span class="dice">&#9856;</span><span class="lbl">Surprise me</span>';
    b.addEventListener("click", function(e){ e.preventDefault(); surpriseComic(); });
    return b;
  }
  function injectSurprise(){
    document.querySelectorAll(".gbhead").forEach(function(h){
      var parent = h.parentElement;
      if (!parent) return;
      // Skip if the page already provides a custom Surprise button (browse.html's filter-aware one)
      if (parent.querySelector(".navsurprise")) return;
      if (parent.querySelector(".gbsurprise")) return;
      h.insertAdjacentElement("afterend", makeSurpriseBtn());
    });
    // Home page: append INSIDE the .gbhero postcard, after the Search button,
    // so it sits inline with the search controls (not below).
    document.querySelectorAll(".gbhero").forEach(function(h){
      if (h.querySelector(".gbsurprise")) return;
      h.appendChild(makeSurpriseBtn());
    });
  }
  // Expose for the home page (BotD chip + any future caller)
  window.gbSurprise = surpriseComic;
  window.gbLoadRoster = loadRoster;

  // ---------- Boot ----------
  function boot(){
    ensureOverlay();
    if (ip){
      ip.addEventListener("input", function(){ render(ip.value); });
    }
    attachTriggers();
    attachKeyboard();
    injectSurprise();
    ensureBitLightbox();
    wireSurpriseAgain();
    // Pre-warm the bit pool so the first Surprise Me click is instant
    if ("requestIdleCallback" in window) requestIdleCallback(loadBitPool);
    else setTimeout(loadBitPool, 1200);
    // Pre-warm the index on idle
    if ("requestIdleCallback" in window) requestIdleCallback(load);
    else setTimeout(load, 800);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
