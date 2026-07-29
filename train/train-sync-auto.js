/*
 * train-sync-auto.js  -  zero-wiring sync for the Train logger.
 * Adapted to this app's storage model: the ENTIRE app state lives in one
 * localStorage object under "train_v2" (sessions[], weigh[], progress{}, ...).
 * We read/write that single blob and never touch the app's other fields.
 * Wire-up is still one line after your scripts:
 *     <script src="train-sync-auto.js"></script>
 * Override the state key if it ever changes:
 *     <script>window.TRAIN_SYNC = { key:"train_v2" };</script>
 * The passphrase is entered once per device and stored in that device's
 * localStorage; it is never in this file.
 */
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
      /* The morning anchor and the moved-day map. These were missing until 2026-07-29, which meant
         the declared minimum day - open the anchor, do the four movements - was the one thing in
         the app that did not survive a second device. */
      anchor: S.anchor && typeof S.anchor === "object" ? S.anchor : {},
      done: S.done && typeof S.done === "object" ? S.done : {},
      progressState: S.progress || null,
      progressUpdatedAt: Date.now(),
    };
  }

  /* Anchor days merge on ticks, not on recency: the device that actually did the routine holds
     the fuller record. Moved days merge as a logical OR, and the app recomputes them from
     sessions and the anchor on load, so a genuine removal corrects itself there. */
  function ticks(a) { var n = 0; for (var k in (a || {})) if (a[k]) n++; return n; }
  function mergeAnchor(local, srv) {
    var out = {}, k;
    for (k in (local || {})) out[k] = local[k];
    for (k in (srv || {})) if (!out[k] || ticks(srv[k]) > ticks(out[k])) out[k] = srv[k];
    return out;
  }
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
  /* A plain union cannot express a deletion: whatever you remove locally comes straight back on
     the next pull, because the server still has it and a union only ever adds. Deleted ids are
     therefore carried as tombstones and filtered out of the merged result, so a delete survives
     sync and propagates to the other device instead of silently resurrecting. */
  function unionSessions(a, b, tomb) {
    var dead = {};
    (tomb || []).forEach(function (t) { if (t && t.id != null) dead[String(t.id)] = true; });
    var m = new Map();
    (a || []).forEach(function (s) { if (s && s.id != null && !dead[String(s.id)]) m.set(String(s.id), s); });
    (b || []).forEach(function (s) { if (!s || s.id == null || dead[String(s.id)]) return; var k = String(s.id), p = m.get(k); if (!p || completeness(s) >= completeness(p)) m.set(k, s); });
    return Array.from(m.values());
  }
  /* Tombstones are pruned after 120 days: long enough for every device to have seen the delete,
     short enough that the list never grows without bound. */
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
    var snap = JSON.stringify({ s: p.sessions, w: p.weighins, g: p.progressState, a: p.anchor, d: p.done });
    if (snap === lastSnap) return;
    fetch(EP + "/push", { method: "POST", headers: { "Content-Type": "application/json", "Authorization": "Bearer " + t }, body: JSON.stringify(p) })
      .then(function (r) { if (r.ok) lastSnap = snap; })
      .catch(function () {});
  }

  function pullAndMerge() {
    var t = getToken(); if (!t) return Promise.resolve();
    return fetch(EP + "/pull", { headers: { "Authorization": "Bearer " + t } })
      .then(function (r) { return r.ok ? r.json() : null; })
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
        S.anchor = mergeAnchor(S.anchor, srv.anchor);
        S.done = mergeDone(S.done, srv.done);
        var hasLocalProg = S.progress && Object.keys(S.progress).length > 0;
        if (srv.progressState && !hasLocalProg) S.progress = srv.progressState;
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
      .catch(function () {});
  }

  function bootstrapFromServer(srv) {
    var S = { v: 2,
      profile: { setup: true, name: "", units: "lb", loc: "Miami", goalLb: 180, stretchLb: 175, rest: 90, theme: "system", equip: ["BW", "band"], adjustable: false, mode: "bw", started: null, programStart: null, runPlanStart: null },
      progress: srv.progressState || {}, wk: {}, sessions: Array.isArray(srv.sessions) ? srv.sessions : [],
      done: (srv.done && typeof srv.done === "object") ? srv.done : {},
      runs: {},
      anchor: (srv.anchor && typeof srv.anchor === "object") ? srv.anchor : {},
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

  global.TrainSyncAuto = { start: start, _toWire: toWire, _unionSessions: unionSessions, _mergeWeigh: mergeWeigh, _mergeTombs: mergeTombs };
})(typeof window !== "undefined" ? window : this);
