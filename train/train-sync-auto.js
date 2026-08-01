(function (global) {
  var EP = "https://train-sync.yellinmatt.workers.dev"; // set automatically after deploy
  var CFG = global.TRAIN_SYNC || {};
  var LS = CFG.key || "train_v2";           // the single app-state blob
  var TOKEN_KEY = "train.syncToken";
  var BACKUP_KEY = "train_v2_syncbak";      // one-time pre-merge safety copy
  var POLL_MS = 4000;

  function getToken() { return (localStorage.getItem(TOKEN_KEY) || "").trim(); }
  function setToken(t) { t = (t || "").trim(); if (t) localStorage.setItem(TOKEN_KEY, t); return t; }
  var overlayShown = false;
  // In-DOM passphrase entry. iOS Safari (esp. home-screen PWAs) suppresses native prompt(),
  // so we draw our own box that works everywhere.
  function promptToken(cb) {
    if (overlayShown || !document.body) return;
    overlayShown = true;
    var wrap = document.createElement("div");
    wrap.setAttribute("style", "position:fixed;inset:0;z-index:99999;background:rgba(8,10,14,.74);display:flex;align-items:center;justify-content:center;padding:22px;font-family:-apple-system,system-ui,sans-serif");
    wrap.innerHTML = '<div style="background:#161a20;color:#fff;max-width:340px;width:100%;border-radius:16px;padding:20px 18px;box-shadow:0 20px 60px rgba(0,0,0,.5)">'
      + '<div style="font-size:17px;font-weight:800;margin-bottom:4px">Sync this device</div>'
      + '<div style="font-size:13px;color:#aab3c0;margin-bottom:14px;line-height:1.4">Enter your Train passphrase once. Your workouts and weigh-ins then sync across every device.</div>'
      + '<input id="tsync-pass" type="text" autocomplete="off" autocapitalize="none" autocorrect="off" spellcheck="false" placeholder="passphrase" style="width:100%;box-sizing:border-box;padding:12px;border-radius:10px;border:1px solid #2a313b;background:#0e1116;color:#fff;font-size:15px;margin-bottom:12px">'
      + '<button id="tsync-go" style="width:100%;padding:12px;border:0;border-radius:10px;background:#e0592e;color:#fff;font-size:15px;font-weight:700">Sync</button>'
      + '<button id="tsync-skip" style="width:100%;padding:10px;border:0;border-radius:10px;background:transparent;color:#8a93a0;font-size:13px;margin-top:6px">Not now</button></div>';
    document.body.appendChild(wrap);
    var inp = wrap.querySelector("#tsync-pass");
    function done() { var v = (inp.value || "").trim(); if (!v) { inp.focus(); return; } setToken(v); if (wrap.parentNode) wrap.parentNode.removeChild(wrap); overlayShown = false; cb(); }
    wrap.querySelector("#tsync-go").addEventListener("click", done);
    wrap.querySelector("#tsync-skip").addEventListener("click", function () { if (wrap.parentNode) wrap.parentNode.removeChild(wrap); overlayShown = false; });
    inp.addEventListener("keydown", function (e) { if (e.key === "Enter") done(); });
    setTimeout(function () { try { inp.focus(); } catch (e) {} }, 60);
  }

  function loadState() { try { return JSON.parse(localStorage.getItem(LS)); } catch (e) { return null; } }
  function saveState(S) { try { localStorage.setItem(LS, JSON.stringify(S)); return true; } catch (e) { return false; } }

  // ---- export/import mapping between the app blob and the wire schema ----
  function toWire(S) {
    return {
      sessions: Array.isArray(S.sessions) ? S.sessions : [],
      weighins: Array.isArray(S.weigh) ? S.weigh.map(function (w) { return { date: w.date, weightLb: w.w }; }) : [],
      deleted: Array.isArray(S.deleted) ? S.deleted : [],
      anchor: S.anchor && typeof S.anchor === "object" ? S.anchor : {},
      done: S.done && typeof S.done === "object" ? S.done : {},
      steps: S.steps && typeof S.steps === "object" ? S.steps : {},
      protein: S.protein && typeof S.protein === "object" ? S.protein : {},
      nutrition: S.nutrition && typeof S.nutrition === "object" ? S.nutrition : {},
      stamps: (S.stamps && typeof S.stamps === "object") ? S.stamps : { nutrition: {}, steps: {} },
      runs: S.runs && typeof S.runs === "object" ? S.runs : {},
      override: S.override && typeof S.override === "object" ? S.override : {},
      daySlot: S.daySlot && typeof S.daySlot === "object" ? S.daySlot : {},
      vetted: S.vetted && typeof S.vetted === "object" ? S.vetted : {},
      profile: S.profile || null,
      profileUpdatedAt: stampedAt("profile", S.profile),
      cursor: { planPos: S.planPos || 0, cycleNext: S.cycleNext || 0 },
      cursorUpdatedAt: stampedAt("cursor", { planPos: S.planPos || 0, cycleNext: S.cycleNext || 0 }),
      progressState: S.progress || null,
      progressUpdatedAt: stampedAt("progress", S.progress),
    };
  }
  var STAMP_KEY = "train.syncStamps";
  var HEALTH_KEY = "train.syncHealth";
  function mark(ok, what) {
    var h = {};
    try { h = JSON.parse(localStorage.getItem(HEALTH_KEY)) || {}; } catch (e) { h = {}; }
    h.lastTry = Date.now();
    if (ok) { h.lastOk = Date.now(); h.fails = 0; h.lastErr = null; }
    else { h.fails = (h.fails || 0) + 1; h.lastErr = String(what || "failed").slice(0, 80); }
    try { localStorage.setItem(HEALTH_KEY, JSON.stringify(h)); } catch (e) {}
  }
  function stampedAt(name, value) {
    var st = {};
    try { st = JSON.parse(localStorage.getItem(STAMP_KEY)) || {}; } catch (e) { st = {}; }
    var sig = JSON.stringify(value === undefined ? null : value);
    if (!st[name] || st[name].sig !== sig) {
      st[name] = { sig: sig, at: Date.now() };
      try { localStorage.setItem(STAMP_KEY, JSON.stringify(st)); } catch (e) {}
    }
    return st[name].at;
  }
  function bumpStamp(name, value, at) {
    var st = {};
    try { st = JSON.parse(localStorage.getItem(STAMP_KEY)) || {}; } catch (e) { st = {}; }
    st[name] = { sig: JSON.stringify(value === undefined ? null : value), at: at || Date.now() };
    try { localStorage.setItem(STAMP_KEY, JSON.stringify(st)); } catch (e) {}
  }
  function mergeFill(local, srv) {
    var out = {}, k;
    for (k in (local || {})) out[k] = local[k];
    for (k in (srv || {})) if (!(k in out)) out[k] = srv[k];
    return out;
  }

  function mergeStamped(local, srv, localS, srvS) {
    var out = {}, outS = {}, k;
    for (k in (local || {})) out[k] = local[k];
    for (k in (localS || {})) outS[k] = localS[k];
    for (k in (srv || {})) {
      var st = (srvS && Object.prototype.hasOwnProperty.call(srvS, k)) ? (Number(srvS[k]) || 0) : 0;
      var lt = Number(outS[k]) || 0;
      if (!(k in out) || st > lt) { out[k] = srv[k]; outS[k] = st > lt ? st : lt; }
    }
    return { map: out, stamps: outS };
  }
  function mergeServer(local, srv) {
    var out = {}, k;
    for (k in (local || {})) out[k] = local[k];
    for (k in (srv || {})) out[k] = srv[k];
    return out;
  }

  function ticks(a) { var n = 0; for (var k in (a || {})) if (a[k]) n++; return n; }
  function mergeDone(local, srv) {
    var out = {}, k;
    for (k in (local || {})) if (local[k]) out[k] = true;
    for (k in (srv || {})) if (srv[k]) out[k] = true;
    return out;
  }

  function completeness(s) {
    var sets = Array.isArray(s.sets)
      ? s.sets.filter(function (x) { return x && (x.done || x.completed || x.reps != null || x.weight != null); }).length
      : Number(s.completedSets || 0);
    var d = Number(s.duration || s.durationSec || s.durationMs || 0) || 0;
    return sets * 1e9 + d;
  }
  function unionSessions(a, b, tomb) {
    var dead = {};
    (tomb || []).forEach(function (t) { if (t && t.id != null) dead[String(t.id)] = true; });
    var m = new Map();
    (a || []).forEach(function (s) { if (s && s.id != null && !dead[String(s.id)]) m.set(String(s.id), s); });
    (b || []).forEach(function (s) { if (!s || s.id == null || dead[String(s.id)]) return; var k = String(s.id), p = m.get(k); if (!p || completeness(s) >= completeness(p)) m.set(k, s); });
    return Array.from(m.values());
  }
  function mergeTombs(a, b) {
    var m = {}, cut = Date.now() - 120 * 86400000;
    (a || []).concat(b || []).forEach(function (t) {
      if (!t || t.id == null) return;
      var at = +t.at || Date.now();
      if (at < cut) return;
      var k = String(t.id);
      if (!m[k] || at > m[k].at) m[k] = { id: k, at: at };
    });
    return Object.keys(m).map(function (k) { return m[k]; });
  }
  // Merge server weighins ({date,weightLb}) into app weigh ({date,w,...}) by date; keep existing.
  function mergeWeigh(localWeigh, srvWeighins) {
    var out = Array.isArray(localWeigh) ? localWeigh.slice() : [];
    var seen = {};
    out.forEach(function (w) { if (w && w.date != null) seen[String(w.date)] = true; });
    (srvWeighins || []).forEach(function (w) {
      if (!w || w.date == null) return;
      if (!seen[String(w.date)]) { out.push({ date: w.date, w: w.weightLb }); seen[String(w.date)] = true; }
    });
    out.sort(function (a, b) { return String(a.date).localeCompare(String(b.date)); });
    return out;
  }

  var lastSnap = "";

  function push() {
    var t = getToken(); if (!t) return;
    var S = loadState(); if (!S) return;
    var p = toWire(S);
    var snap = JSON.stringify({ s: p.sessions, w: p.weighins, g: p.progressState, a: p.anchor, d: p.done, st: p.steps, pr: p.protein, nu: p.nutrition, ru: p.runs, ov: p.override, ds: p.daySlot, vt: p.vetted, pf: p.profile, cu: p.cursor });
    if (snap === lastSnap) return;
    fetch(EP + "/push", { method: "POST", headers: { "Content-Type": "application/json", "Authorization": "Bearer " + t }, body: JSON.stringify(p) })
      .then(function (r) { if (r.ok) { lastSnap = snap; mark(true); } else { onUnauthorized(r.status); mark(false, "push " + r.status); } })
      .catch(function (e) { mark(false, "push " + (e && e.message)); });
  }

  var reprompting = false;
  function onUnauthorized(status) {
    if (status !== 401 || reprompting) return;
    reprompting = true;
    try { localStorage.removeItem(TOKEN_KEY); } catch (e) {}
    lastSnap = null;
    promptToken(function () {
      reprompting = false;
      pullAndMerge().then(function () { push(); });
    });
  }

  function pullAndMerge() {
    var t = getToken(); if (!t) return Promise.resolve();
    return fetch(EP + "/pull", { headers: { "Authorization": "Bearer " + t } })
      .then(function (r) { if (r.ok) { mark(true); } else { onUnauthorized(r.status); mark(false, "pull " + r.status); } return r.ok ? r.json() : null; })
      .then(function (srv) {
        if (!srv) return;
        var S = loadState();
        if (!S) {
          if ((srv.sessions && srv.sessions.length) || (srv.weighins && srv.weighins.length) || srv.progressState) {
            S = bootstrapFromServer(srv); saveState(S); lastSnap = "";
            if (!sessionStorage.getItem("train.reloaded")) { sessionStorage.setItem("train.reloaded", "1"); global.location.reload(); }
          }
          return;
        }
        var before = JSON.stringify(S);
        if (!localStorage.getItem(BACKUP_KEY)) { try { localStorage.setItem(BACKUP_KEY, before); } catch (e) {} }
        S.deleted = mergeTombs(S.deleted, srv.deleted);
        S.sessions = unionSessions(S.sessions, srv.sessions, S.deleted);
        S.weigh = mergeWeigh(S.weigh, srv.weighins);
        S.stamps = S.stamps || { nutrition: {}, steps: {} };
        S.stamps.anchor = S.stamps.anchor || {};
        var srvAS = (srv.stamps && srv.stamps.anchor) || {};
        var mA = mergeStamped(S.anchor, srv.anchor, S.stamps.anchor, srvAS);
        for (var _ak in (srv.anchor || {})) {
          if (!Object.prototype.hasOwnProperty.call(srvAS, _ak) && !Object.prototype.hasOwnProperty.call(S.stamps.anchor, _ak)) {
            if (!mA.map[_ak] || ticks(srv.anchor[_ak]) > ticks(mA.map[_ak])) mA.map[_ak] = srv.anchor[_ak];
          }
        }
        S.anchor = mA.map; S.stamps.anchor = mA.stamps;
        S.done = mergeDone(S.done, srv.done);
        S.stamps = S.stamps || { nutrition: {}, steps: {} };
        var srvS = srv.stamps;
        if (!srvS || typeof srvS !== "object") {
          var at = Number(srv.updatedAt) || Date.now();
          srvS = { nutrition: {}, steps: {} };
          for (var _k in (srv.nutrition || {})) srvS.nutrition[_k] = at;
          for (var _k2 in (srv.steps || {})) srvS.steps[_k2] = at;
        }
        var mSteps = mergeStamped(S.steps, srv.steps, S.stamps.steps, srvS.steps);
        S.steps = mSteps.map; S.stamps.steps = mSteps.stamps;
        var mNut = mergeStamped(S.nutrition, srv.nutrition, S.stamps.nutrition, srvS.nutrition);
        S.nutrition = mNut.map; S.stamps.nutrition = mNut.stamps;
        S.protein = S.protein || {};
        for (var _pk in (srv.nutrition || {})) {
          if ((srv.protein || {})[_pk]) S.protein[_pk] = true; else delete S.protein[_pk];
        }
        S.body = mergeServer(S.body || {}, srv.body);
        S.vitals = mergeServer(S.vitals || {}, srv.vitals);
        S.sleep = mergeServer(S.sleep || {}, srv.sleep);
        S.runs = mergeFill(S.runs, srv.runs);
        S.override = mergeFill(S.override, srv.override);
        S.daySlot = mergeFill(S.daySlot, srv.daySlot);
        S.vetted = mergeFill(S.vetted || {}, srv.vetted);
        if (srv.profile && Number(srv.profileUpdatedAt || 0) > stampedAt("profile", S.profile)) {
          S.profile = srv.profile; bumpStamp("profile", S.profile, Number(srv.profileUpdatedAt));
        }
        if (srv.cursor && Number(srv.cursorUpdatedAt || 0) > stampedAt("cursor", { planPos: S.planPos || 0, cycleNext: S.cycleNext || 0 })) {
          S.planPos = srv.cursor.planPos || 0; S.cycleNext = srv.cursor.cycleNext || 0;
          bumpStamp("cursor", { planPos: S.planPos, cycleNext: S.cycleNext }, Number(srv.cursorUpdatedAt));
        }
        var hasLocalProg = S.progress && Object.keys(S.progress).length > 0;
        if (srv.progressState && !hasLocalProg) S.progress = srv.progressState;
        else if (srv.progressState && Number(srv.progressUpdatedAt || 0) > stampedAt("progress", S.progress)) {
          S.progress = srv.progressState; bumpStamp("progress", S.progress, Number(srv.progressUpdatedAt));
        }
        if (((srv.sessions && srv.sessions.length) || (srv.weighins && srv.weighins.length)) && S.profile && !S.profile.setup) S.profile.setup = true;
        var after = JSON.stringify(S);
        lastSnap = "";
        if (after !== before) {
          saveState(S);
          if (!sessionStorage.getItem("train.reloaded")) {
            sessionStorage.setItem("train.reloaded", "1");
            global.location.reload();
          }
        }
      })
      .catch(function (e) { mark(false, "pull " + (e && e.message)); });
  }

  function bootstrapFromServer(srv) {
    var S = { v: 2,
      profile: { setup: true, name: "", units: "lb", loc: "Miami", goalLb: 180, stretchLb: 175, rest: 90, theme: "system", equip: ["BW", "band"], adjustable: false, mode: "bw", started: null, programStart: null, runPlanStart: null },
      progress: srv.progressState || {}, wk: {}, sessions: Array.isArray(srv.sessions) ? srv.sessions : [],
      done: (srv.done && typeof srv.done === "object") ? srv.done : {},
      runs: {},
      anchor: (srv.anchor && typeof srv.anchor === "object") ? srv.anchor : {},
      steps: (srv.steps && typeof srv.steps === "object") ? srv.steps : {},
      protein: (srv.protein && typeof srv.protein === "object") ? srv.protein : {},
      nutrition: (srv.nutrition && typeof srv.nutrition === "object") ? srv.nutrition : {},
      // A fresh device adopts the server's provenance wholesale. Starting it
      // empty would let this browser's first push look like an authority on
      // days it has never seen.
      stamps: (srv.stamps && typeof srv.stamps === "object") ? srv.stamps : { nutrition: {}, steps: {} },
      body: (srv.body && typeof srv.body === "object") ? srv.body : {},
      vitals: (srv.vitals && typeof srv.vitals === "object") ? srv.vitals : {},
      sleep: (srv.sleep && typeof srv.sleep === "object") ? srv.sleep : {},
      vetted: (srv.vetted && typeof srv.vetted === "object") ? srv.vetted : {},
      deleted: Array.isArray(srv.deleted) ? srv.deleted : [],
      weigh: Array.isArray(srv.weighins) ? srv.weighins.map(function (w) { return { date: w.date, w: w.weightLb }; }) : [],
      planPos: 0, override: {}, activeMode: "plan", genWk: null };
    S.sessions.forEach(function (s) { if (s && s.date) S.done[s.date] = true; });
    return S;
  }
  function start() {
    // prompt (in-DOM) + pull first, even with no local state, so ANY device pairs just by entering the passphrase
    var run = function () { pullAndMerge().then(function () { push(); setInterval(push, POLL_MS); }); };
    if (getToken()) run();
    else promptToken(run);
    if (global.addEventListener) global.addEventListener("online", function () { if (getToken()) { push(); pullAndMerge(); } });
  }

  if (document.readyState === "complete" || document.readyState === "interactive") setTimeout(start, 500);
  else global.addEventListener("load", function () { setTimeout(start, 500); });

  function now() {
    if (!getToken()) return Promise.resolve({ ok: false, reason: "not paired" });
    return pullAndMerge().then(function () { push(); }).then(function () {
      var h = {}; try { h = JSON.parse(localStorage.getItem(HEALTH_KEY)) || {}; } catch (e) {}
      return { ok: !!h.lastOk && !h.fails, health: h };
    }).catch(function (e) { return { ok: false, reason: String(e && e.message) }; });
  }
  global.TrainSyncAuto = { start: start, now: now, _toWire: toWire, _unionSessions: unionSessions, _mergeWeigh: mergeWeigh, _mergeTombs: mergeTombs };
})(typeof window !== "undefined" ? window : this);
