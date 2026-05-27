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
    document.querySelectorAll(".gbhero input, .gbhead input").forEach(function(el){
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
    document.querySelectorAll(".gbhero .btn, .gbhead .btn, .gbhero button, .gbhead button").forEach(function(btn){
      btn.addEventListener("click", function(e){
        e.preventDefault();
        var input = btn.parentElement.querySelector("input");
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
      var inHeroOrHead = isTyping && (ae.closest && (ae.closest(".gbhero") || ae.closest(".gbhead")));
      if (e.key === "/" && !isTyping && !ov && !document.querySelector("#gbsearch.on")){
        e.preventDefault(); open(""); return;
      }
      if (e.key === "/" && inHeroOrHead && !document.querySelector("#gbsearch.on")){
        // typing "/" inside the trigger inputs: ignore (let it type)
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

  // ---------- Hero rotating chip ----------
  function attachRotatingChip(){
    var chip = document.querySelector(".gbhero .chip");
    if (!chip) return;
    var examples = (chip.dataset.examples || "horse,Hot Pockets,Seven Words,kid gorgeous,crowd work,Carlin,Mulaney")
      .split(",").map(function(s){return s.trim();}).filter(Boolean);
    var i = 0;
    var lead = chip.dataset.lead || "Try";
    function tick(){
      chip.style.opacity = "0";
      setTimeout(function(){
        chip.textContent = lead + ": '" + examples[i] + "'";
        chip.style.opacity = "1";
        i = (i + 1) % examples.length;
      }, 220);
    }
    chip.textContent = lead + ": '" + examples[0] + "'";
    i = 1;
    setInterval(tick, 3200);
  }

  // ---------- Boot ----------
  function boot(){
    ensureOverlay();
    if (ip){
      ip.addEventListener("input", function(){ render(ip.value); });
    }
    attachTriggers();
    attachKeyboard();
    attachRotatingChip();
    // Pre-warm the index on idle
    if ("requestIdleCallback" in window) requestIdleCallback(load);
    else setTimeout(load, 800);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
