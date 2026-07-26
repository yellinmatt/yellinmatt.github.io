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

  function token() {
    var t = localStorage.getItem(TOKEN_KEY);
    if (!t && global.prompt) {
      t = (global.prompt("Enter your Train sync passphrase (one time on this device):") || "").trim();
      if (t) localStorage.setItem(TOKEN_KEY, t);
    }
    return (t || "").trim();
  }

  function loadState() { try { return JSON.parse(localStorage.getItem(LS)); } catch (e) { return null; } }
  function saveState(S) { try { localStorage.setItem(LS, JSON.stringify(S)); return true; } catch (e) { return false; } }

  // ---- export/import mapping between the app blob and the wire schema ----
  function toWire(S) {
    return {
      sessions: Array.isArray(S.sessions) ? S.sessions : [],
      weighins: Array.isArray(S.weigh) ? S.weigh.map(function (w) { return { date: w.date, weightLb: w.w }; }) : [],
      progressState: S.progress || null,
      progressUpdatedAt: Date.now(),
    };
  }

  function completeness(s) {
    var sets = Array.isArray(s.sets)
      ? s.sets.filter(function (x) { return x && (x.done || x.completed || x.reps != null || x.weight != null); }).length
      : Number(s.completedSets || 0);
    var d = Number(s.duration || s.durationSec || s.durationMs || 0) || 0;
    return sets * 1e9 + d;
  }
  function unionSessions(a, b) {
    var m = new Map();
    (a || []).forEach(function (s) { if (s && s.id != null) m.set(String(s.id), s); });
    (b || []).forEach(function (s) { if (!s || s.id == null) return; var k = String(s.id), p = m.get(k); if (!p || completeness(s) >= completeness(p)) m.set(k, s); });
    return Array.from(m.values());
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
    var t = token(); if (!t) return;
    var S = loadState(); if (!S) return;
    var p = toWire(S);
    var snap = JSON.stringify({ s: p.sessions, w: p.weighins, g: p.progressState });
    if (snap === lastSnap) return;
    fetch(EP + "/push", { method: "POST", headers: { "Content-Type": "application/json", "Authorization": "Bearer " + t }, body: JSON.stringify(p) })
      .then(function (r) { if (r.ok) lastSnap = snap; })
      .catch(function () {});
  }

  function pullAndMerge() {
    var t = token(); if (!t) return Promise.resolve();
    return fetch(EP + "/pull", { headers: { "Authorization": "Bearer " + t } })
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (srv) {
        if (!srv) return;
        var S = loadState(); if (!S) return;
        var before = JSON.stringify(S);
        if (!localStorage.getItem(BACKUP_KEY)) { try { localStorage.setItem(BACKUP_KEY, before); } catch (e) {} }
        S.sessions = unionSessions(S.sessions, srv.sessions);
        S.weigh = mergeWeigh(S.weigh, srv.weighins);
        var hasLocalProg = S.progress && Object.keys(S.progress).length > 0;
        if (srv.progressState && !hasLocalProg) S.progress = srv.progressState;
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

  function start() {
    if (!loadState()) return setTimeout(start, 2000); // app state not written yet
    pullAndMerge().then(function () {
      push();
      setInterval(push, POLL_MS);
    });
    if (global.addEventListener) global.addEventListener("online", function () { push(); pullAndMerge(); });
  }

  if (document.readyState === "complete" || document.readyState === "interactive") setTimeout(start, 500);
  else global.addEventListener("load", function () { setTimeout(start, 500); });

  global.TrainSyncAuto = { start: start, _toWire: toWire, _unionSessions: unionSessions, _mergeWeigh: mergeWeigh };
})(typeof window !== "undefined" ? window : this);
