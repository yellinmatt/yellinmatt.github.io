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
  /* 4000 until 2026-08-30. The pull exists to notice an hourly Health Auto Export landing and an
     edit made on the other device, and four seconds buys nothing over fifteen against either of
     those, while costing four times the KV read budget: three open devices at 4s is 65,000 reads a
     day against a free-tier 100,000, which is the next wall after the one we just hit. The moment
     he actually looks at the app is already covered by the visibilitychange handler below, which
     forces a cycle immediately (on its own 20-second debounce, itself longer than this interval). */
  var POLL_MS = 15000;

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
      + '<button id="tsync-go" style="width:100%;min-height:44px;padding:12px;border:0;border-radius:10px;background:#e0592e;color:#fff;font-size:15px;font-weight:700">Sync</button>'
      + '<button id="tsync-skip" style="width:100%;min-height:44px;padding:12px 10px;border:0;border-radius:10px;background:transparent;color:#8a93a0;font-size:13px;margin-top:6px">Not now</button></div>';
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
      /* Steps, protein and nutrition are measurements, and they were being left behind for the
         same reason the anchor was: the wire schema was written before any of them existed and
         nobody widened it. Cal AI gets pasted on the phone and the scorecard is read on the
         laptop, so leaving these local meant the two devices disagreed about what he had eaten. */
      steps: S.steps && typeof S.steps === "object" ? S.steps : {},
      protein: S.protein && typeof S.protein === "object" ? S.protein : {},
      nutrition: S.nutrition && typeof S.nutrition === "object" ? S.nutrition : {},
      /* ROUND A. The per-day provenance for steps and nutrition. Sent verbatim,
         never synthesised at push time: a stamp invented on the way out would
         make whichever device pushed last the winner, which is exactly the
         clobber trap `stampedAt` exists to avoid for settings. An absent stamp
         means this device never authored that day, and the Worker treats it as
         gap-fill-only rather than as an authority. */
      stamps: (S.stamps && typeof S.stamps === "object") ? S.stamps : { nutrition: {}, steps: {} },
      runs: S.runs && typeof S.runs === "object" ? S.runs : {},
      override: S.override && typeof S.override === "object" ? S.override : {},
      daySlot: S.daySlot && typeof S.daySlot === "object" ? S.daySlot : {},
      /* ROUND C. Vetting verdicts: date-keyed, gap-fill on both ends, same shape as
         override/daySlot. A day marked clean on the phone must read clean everywhere,
         including to the daily audit, which reads the Worker copy. */
      vetted: S.vetted && typeof S.vetted === "object" ? S.vetted : {},
      /* Settings and the cycle cursor are last-write-wins, so their timestamps must only move when
         the value actually changed. Stamping Date.now() on every push would make whichever device
         pushed most recently the winner, which is how an idle laptop silently undoes a setting
         changed on the phone. `stampedAt` remembers the last value seen and reuses its timestamp. */
      profile: S.profile || null,
      profileUpdatedAt: stampedAt("profile", S.profile),
      cursor: { planPos: S.planPos || 0, cycleNext: S.cycleNext || 0 },
      cursorUpdatedAt: stampedAt("cursor", { planPos: S.planPos || 0, cycleNext: S.cycleNext || 0 }),
      progressState: S.progress || null,
      progressUpdatedAt: stampedAt("progress", S.progress),
      /* The sore flag. `stampedAt` already records when a VALUE last changed by comparing its
         signature, so neither the app nor `soreTap` needs to write a timestamp by hand, and a
         purge that removes a lapsed area re-stamps for free because the object changed. */
      sore: S.sore || {},
      soreUpdatedAt: stampedAt("sore", S.sore || {}),
      /* The ladder rung, 2026-08-08. Same mechanism as `sore` above and added for a blunter
         reason: this object IS the bodyweight programme's progress, and until now it never left
         the device it was earned on. `stampedAt` re-stamps for free whenever the object changes,
         which covers both directions — `ladStep` climbing him after a good session, and `soreEase`
         stepping him back a rung when a flag lapses. */
      bwLev: S.bwLev || {},
      bwLevUpdatedAt: stampedAt("bwLev", S.bwLev || {}),
      /* v3 families, 2026-08-21. The capability test is the strength level's whole input; the
         Pedometer series is his ruling's source of truth; hardDays is the once-a-week near-failure
         ledger; roundsCfg bundles the three small scalars so they travel under one stamp. All
         stamped by `stampedAt`, which only moves when the value changes, so an idle device cannot
         clobber a fresh edit. */
      capTest: Array.isArray(S.capTest) ? S.capTest : [],
      pedo: S.pedo && typeof S.pedo === "object" ? S.pedo : {},
      pedoUpdatedAt: stampedAt("pedo", S.pedo || {}),
      pedoMeta: S.pedoMeta || null,
      cardioTick: S.cardioTick && typeof S.cardioTick === "object" ? S.cardioTick : {},
      cardioTickUpdatedAt: stampedAt("cardioTick", S.cardioTick || {}),
      hardDays: S.hardDays && typeof S.hardDays === "object" ? S.hardDays : {},
      roundsCfg: { base: (typeof S.roundsBase === "number" ? S.roundsBase : null),
                   adaptDay: S.roundsAdaptDay || null, wchartWin: S.wchartWin || null },
      roundsCfgUpdatedAt: stampedAt("roundsCfg",
        { base: (typeof S.roundsBase === "number" ? S.roundsBase : null),
          adaptDay: S.roundsAdaptDay || null, wchartWin: S.wchartWin || null }),
    };
  }
  /* The capability test unions by (date, familiarisation): taken once, never edited remotely. */
  function unionCapTest(a, b) {
    var m = {}, out = [], i, t, k;
    for (i = 0; i < (a || []).length; i++) { t = a[i]; if (t && t.date) { k = t.date + "|" + (t.fam ? 1 : 0); if (!m[k]) { m[k] = 1; out.push(t); } } }
    for (i = 0; i < (b || []).length; i++) { t = b[i]; if (t && t.date) { k = t.date + "|" + (t.fam ? 1 : 0); if (!m[k]) { m[k] = 1; out.push(t); } } }
    out.sort(function (x, y) { return String(x.date) < String(y.date) ? -1 : 1; });
    return out;
  }
  var STAMP_KEY = "train.syncStamps";
  /* v7.9. `train.syncStamps` records when a VALUE LAST CHANGED, which is what last-write-wins needs
     and is emphatically NOT the same thing as when a sync last succeeded. The Track dashboard's
     "Sync" row was reading those stamps as a health signal, so it would happily say "today" while
     every push and pull had been failing for a week, which is the exact failure the row exists to
     catch. Success and failure are now recorded explicitly, here, by the only code that knows. */
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
  /* Accepting the server's value means adopting its timestamp too, otherwise this device would
     immediately re-stamp it as newer and push it straight back, and the two would ping-pong. */
  function bumpStamp(name, value, at) {
    var st = {};
    try { st = JSON.parse(localStorage.getItem(STAMP_KEY)) || {}; } catch (e) { st = {}; }
    st[name] = { sig: JSON.stringify(value === undefined ? null : value), at: at || Date.now() };
    try { localStorage.setItem(STAMP_KEY, JSON.stringify(st)); } catch (e) {}
  }
  /* `mergeSteps` (take the larger of the two) was deleted in Round A along with
     mergeAccum. Both encoded "a measurement only ever grows", which is true of a
     day in progress and false of a day being corrected. `mergeStamped` below
     replaces both. */
  function mergeFill(local, srv) {
    var out = {}, k;
    for (k in (local || {})) out[k] = local[k];
    for (k in (srv || {})) if (!(k in out)) out[k] = srv[k];
    return out;
  }

  /* ROUND 17, 2026-07-31. THE HALF-APPLIED ACCUMULATION RULE.
     On 2026-07-30 the Worker's nutrition rule changed from gap-fill to larger-value-per-field,
     because an hourly exporter sends days that are still in progress and breakfast pushed at 9am
     must not lock out dinner. The Worker got that change. The client did not, and kept pulling
     nutrition through mergeFill, which by construction can never replace a day it already holds.
     The result was a successful sync that adopted nothing: the Worker held 2026-07-30 at 2,670
     kcal and 150 g protein while this browser held 1,615 and 78, the sync reported ok 483 ms
     after the Worker's own updatedAt, and the Calories tile computed "333 under" off the stale
     row when the truth was roughly 185 OVER. Every day whose first partial export landed before
     he finished eating was frozen at that partial forever.
     Two rules, not one, because the streams differ in who authors them.
     mergeAccum: nutrition only. The client CAN author it (the Cal AI paste sheet), so a local
     value is real and must not be discarded; a day's intake only accumulates, so the larger
     number is the later truth. Same rule as steps, same rule the Worker now runs.
     mergeServer: vitals, sleep, body. PULL ONLY by design (see the 2026-07-30 note below) - no
     client ever authors one, so there is no local edit to protect and the server copy is simply
     newer. Max-per-field would be actively wrong here: resting HR and HRV are means, and a max
     rule would ratchet them upward forever and never come down. */
  /* ROUND A, 2026-07-31. mergeAccum (max per field) is RETIRED, on both ends.
     Max was right about one thing and catastrophically wrong about another. It
     was right that an hourly export of a day in progress must not lock the day
     at breakfast. It was wrong that the fix is arithmetic, because "take the
     bigger number" makes a day incapable of ever travelling DOWN, and a day
     that can only go up is a day no correction can reach. Matthew's 30 July sat
     at 2,670 kcal against 2,108 actually eaten, and under max, deleting the
     duplicated meal upstream would have changed that number never.

     The rule on both ends is now latest-write-wins, arbitrated by a per-day
     stamp rather than by size, so a smaller later truth beats a larger older
     one and a stale re-push still loses. `S.stamps` is the client's half of
     that: a day is stamped when this device authors it (the Cal AI sheet, a
     manual edit) and adopts the server's stamp when it pulls. A day this
     device has never authored carries no stamp and therefore cannot clobber. */
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

  /* Anchor days merge on ticks, not on recency: the device that actually did the routine holds
     the fuller record. Moved days merge as a logical OR, and the app recomputes them from
     sessions and the anchor on load, so a genuine removal corrects itself there. */
  function ticks(a) { var n = 0; for (var k in (a || {})) if (a[k]) n++; return n; }
  /* mergeAnchor retired 2026-08-01: the anchor merges stamped now (see pull). */
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

  /* 2026-08-30. A FAILING PUSH USED TO RETRY AT THE POLL RATE, FOREVER. `lastSnap` only advances
     on a 2xx, which is correct — a push that did not land must be re-sent — but with nothing else
     in the way that correctness became a 4-second hammer for as long as the endpoint stayed
     unhappy, and the endpoint's unhappiness was itself caused by too many writes. Exponential
     backoff caps a broken push at one attempt every ten minutes, so a bad day costs ~144 writes
     instead of 21,600 and the failure can no longer feed itself. A success clears it instantly. */
  var failStreak = 0, nextPushAt = 0;
  function backoff() {
    failStreak++;
    nextPushAt = Date.now() + Math.min(600000, 4000 * Math.pow(2, failStreak));
  }

  function push() {
    var t = getToken(); if (!t) return;
    if (Date.now() < nextPushAt) return;
    var S = loadState(); if (!S) return;
    var p = toWire(S);
    var snap = JSON.stringify({ s: p.sessions, w: p.weighins, g: p.progressState, so: p.sore, a: p.anchor, d: p.done, st: p.steps, pr: p.protein, nu: p.nutrition, ru: p.runs, ov: p.override, ds: p.daySlot, vt: p.vetted, pf: p.profile, cu: p.cursor, ct: p.capTest, pd: p.pedo, cdt: p.cardioTick, hd: p.hardDays, rc: p.roundsCfg });
    if (snap === lastSnap) return;
    fetch(EP + "/push", { method: "POST", headers: { "Content-Type": "application/json", "Authorization": "Bearer " + t }, body: JSON.stringify(p) })
      .then(function (r) {
        if (r.ok) { lastSnap = snap; failStreak = 0; nextPushAt = 0; mark(true); }
        else { backoff(); onUnauthorized(r.status); mark(false, "push " + r.status); }
      })
      .catch(function (e) { backoff(); mark(false, "push " + (e && e.message)); });
  }

  /* 2026-07-30. The passphrase prompt only ever fired when NO token was stored, so rotating
     SYNC_TOKEN on the Worker left every already-paired device holding a dead passphrase and
     401ing forever, silently, with no way back short of clearing site data. A stale credential
     has to invalidate itself: on a 401 the stored token is dropped and the pairing overlay is
     shown again, which turns "sync quietly stopped weeks ago" into one visible question. */
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

  /* The reload guard must not depend on storage succeeding. Both reload sites below read and wrote
     `sessionStorage` bare: if `setItem` throws or is unavailable (iOS private mode, storage
     disabled, quota), the flag never sticks, every state-changing pull reloads again, and the app
     reload-loops, which on a phone reads as a freeze. The in-memory flag is authoritative for this
     document and sessionStorage is the cross-reload half; either one having fired is enough.
     Related to the `forceUpdate` double-navigation fixed in index.html the same day: this is the
     other path that can navigate, and it had the same shape of unguarded repeat. */
  var reloadedOnce = false;
  /* v12.1. The in-place alternative to `reloadOnce`, for every change after the first.
     A blind repaint on every poll would be worse than a stale screen: it closes the round he has
     open, loses his scroll, and fights the in-place tick painting the rounds accordion and the
     anchor count depend on. So it declines in the three states where a repaint would interrupt him,
     and a declined repaint is not a lost one — the next poll or the next tab switch will land it. */
  function repaintInPlace() {
    try {
      if (typeof document === "undefined") return false;
      if (document.querySelector(".sheet-wrap, .sheet, #sheet, .sheetwrap")) return false;
      if (document.body && document.body.classList.contains("sheet-open")) return false;
      if (global.RND_ADV != null) return false;
      if (typeof global.refreshCurrent === "function") { global.refreshCurrent(); return true; }
      if (typeof global.renderToday === "function") { global.renderToday(); return true; }
    } catch (e) {}
    return false;
  }
  function reloadOnce() {
    if (reloadedOnce) return;
    var seen = false;
    try { seen = !!sessionStorage.getItem("train.reloaded"); } catch (e) {}
    if (seen) { reloadedOnce = true; return; }
    reloadedOnce = true;
    try { sessionStorage.setItem("train.reloaded", "1"); } catch (e) {}
    try { global.location.reload(); } catch (e) {}
  }

  /* Resolves TRUE when the merge actually altered the local store, so the caller can repaint only
     when there is something to repaint. Resolving a bare undefined is what let the old timer treat
     "nothing came back" and "everything changed" as the same event. */
  function pullAndMerge() {
    var t = getToken(); if (!t) return Promise.resolve(false);
    return fetch(EP + "/pull", { headers: { "Authorization": "Bearer " + t } })
      .then(function (r) { if (r.ok) { mark(true); } else { onUnauthorized(r.status); mark(false, "pull " + r.status); } return r.ok ? r.json() : null; })
      .then(function (srv) {
        if (!srv) return;
        var S = loadState();
        if (!S) {
          if ((srv.sessions && srv.sessions.length) || (srv.weighins && srv.weighins.length) || srv.progressState) {
            S = bootstrapFromServer(srv); saveState(S); lastSnap = "";
            reloadOnce();
            return true;
          }
          return false;
        }
        var before = JSON.stringify(S);
        if (!localStorage.getItem(BACKUP_KEY)) { try { localStorage.setItem(BACKUP_KEY, before); } catch (e) {} }
        S.deleted = mergeTombs(S.deleted, srv.deleted);
        S.sessions = unionSessions(S.sessions, srv.sessions, S.deleted);
        S.weigh = mergeWeigh(S.weigh, srv.weighins);
        /* 2026-08-01: anchor is stamped per day now, so an UNCHECK travels. Newer stamp wins;
           days with no stamp on either side keep the old most-ticks rule. */
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
        /* DEPLOY-ORDER SAFETY. This file ships to Pages the moment it is pushed;
           the Worker ships only when someone runs `wrangler deploy`. Between
           those two moments the client is new and the server is old, and an old
           server sends no `stamps` at all. Read naively that means every server
           day carries stamp 0, nothing can beat a local 0, and the merge quietly
           degrades to gap-fill, which is the EXACT defect 17a was opened to fix:
           a successful sync that adopts nothing.
           So an absent stamps object is treated as "this server predates
           provenance", and its days are taken as authoritative using the store's
           own updatedAt as their stamp. Once the Worker ships it sends real
           per-day stamps and this branch stops running. Delete it when the two
           have been in step for a while. */
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
        /* Protein follows nutrition rather than OR-ing, for the same reason the
           Worker recomputes it: a flag that can be set but never cleared lies
           about a day whose grams were corrected downward. The server is the one
           writer, so a day the server carries takes the server's verdict. */
        S.protein = S.protein || {};
        for (var _pk in (srv.nutrition || {})) {
          if ((srv.protein || {})[_pk]) S.protein[_pk] = true; else delete S.protein[_pk];
        }
        /* Body composition, vitals and sleep are PULL ONLY, deliberately (2026-07-30).
           Health Auto Export writes them straight into the Worker; no client ever authors one, so
           there is nothing to push and pushing would be actively dangerous. This client sends the
           whole object for every key it owns, so a device that had never seen these would push an
           empty {} and last-write-wins would erase 372 days of vitals and 315 nights of sleep.
           Pulling them costs nothing and stops the pipeline delivering into a void: before this
           the Worker captured all three and the client dropped them on hydrate, so the data existed
           and no surface in the app could reach it. */
        S.body = mergeServer(S.body || {}, srv.body);
        S.vitals = mergeServer(S.vitals || {}, srv.vitals);
        S.sleep = mergeServer(S.sleep || {}, srv.sleep);
        S.runs = mergeFill(S.runs, srv.runs);
        S.override = mergeFill(S.override, srv.override);
        S.daySlot = mergeFill(S.daySlot, srv.daySlot);
        S.vetted = mergeFill(S.vetted || {}, srv.vetted);
        /* Settings and the cursor only come down if the server's copy is genuinely newer than what
           this device last stamped. Same rule the Worker applies, checked on both ends. */
        if (srv.profile && Number(srv.profileUpdatedAt || 0) > stampedAt("profile", S.profile)) {
          S.profile = srv.profile; bumpStamp("profile", S.profile, Number(srv.profileUpdatedAt));
        }
        if (srv.cursor && Number(srv.cursorUpdatedAt || 0) > stampedAt("cursor", { planPos: S.planPos || 0, cycleNext: S.cycleNext || 0 })) {
          S.planPos = srv.cursor.planPos || 0; S.cycleNext = srv.cursor.cycleNext || 0;
          bumpStamp("cursor", { planPos: S.planPos, cycleNext: S.cycleNext }, Number(srv.cursorUpdatedAt));
        }
        var hasLocalProg = S.progress && Object.keys(S.progress).length > 0;
        /* Whole-object LWW, and it accepts an EMPTY object as a real answer: after the last area
           lapses and is purged, {} is precisely what the other device means. Guarding on
           truthiness here would make the expiry unsyncable in the one case it matters. */
        if (srv.sore && typeof srv.sore === "object" &&
            Number(srv.soreUpdatedAt || 0) > stampedAt("sore", S.sore || {})) {
          S.sore = srv.sore;
          bumpStamp("sore", S.sore, Number(srv.soreUpdatedAt));
        }
        /* The ladder rung. Empty-object-accepting like `sore`, and for a real case rather than a
           symmetrical one: a device that has never opened the bodyweight programme holds `{}`,
           and if this device is the newer writer that emptiness must be able to travel rather
           than being read as "no opinion" forever. The `typeof` guard is what stops a null or a
           stray array from a mismatched Worker version reaching `ladPos`. */
        if (srv.bwLev && typeof srv.bwLev === "object" && !Array.isArray(srv.bwLev) &&
            Number(srv.bwLevUpdatedAt || 0) > stampedAt("bwLev", S.bwLev || {})) {
          S.bwLev = srv.bwLev;
          bumpStamp("bwLev", S.bwLev, Number(srv.bwLevUpdatedAt));
        }
        /* v3 families. capTest unions; hardDays ORs; pedo and cardioTick are whole-object LWW
           accepting {} as a real answer (an entry can be removed); roundsCfg unpacks into its
           three fields. pedoMeta: earliest wins, it marks where the series began. */
        S.capTest = unionCapTest(S.capTest, srv.capTest);
        S.hardDays = mergeDone(S.hardDays || {}, srv.hardDays || {});
        if (srv.pedo && typeof srv.pedo === "object" && !Array.isArray(srv.pedo) &&
            Number(srv.pedoUpdatedAt || 0) > stampedAt("pedo", S.pedo || {})) {
          S.pedo = srv.pedo;
          bumpStamp("pedo", S.pedo, Number(srv.pedoUpdatedAt));
        }
        if (!S.pedoMeta && srv.pedoMeta) S.pedoMeta = srv.pedoMeta;
        if (srv.cardioTick && typeof srv.cardioTick === "object" && !Array.isArray(srv.cardioTick) &&
            Number(srv.cardioTickUpdatedAt || 0) > stampedAt("cardioTick", S.cardioTick || {})) {
          S.cardioTick = srv.cardioTick;
          bumpStamp("cardioTick", S.cardioTick, Number(srv.cardioTickUpdatedAt));
        }
        if (srv.roundsCfg && typeof srv.roundsCfg === "object" &&
            Number(srv.roundsCfgUpdatedAt || 0) > stampedAt("roundsCfg",
              { base: (typeof S.roundsBase === "number" ? S.roundsBase : null),
                adaptDay: S.roundsAdaptDay || null, wchartWin: S.wchartWin || null })) {
          if (typeof srv.roundsCfg.base === "number") S.roundsBase = srv.roundsCfg.base;
          S.roundsAdaptDay = srv.roundsCfg.adaptDay || S.roundsAdaptDay;
          S.wchartWin = srv.roundsCfg.wchartWin || null;
          bumpStamp("roundsCfg", { base: (typeof S.roundsBase === "number" ? S.roundsBase : null),
            adaptDay: S.roundsAdaptDay || null, wchartWin: S.wchartWin || null },
            Number(srv.roundsCfgUpdatedAt));
        }
        if (srv.progressState && !hasLocalProg) S.progress = srv.progressState;
        else if (srv.progressState && Number(srv.progressUpdatedAt || 0) > stampedAt("progress", S.progress)) {
          S.progress = srv.progressState; bumpStamp("progress", S.progress, Number(srv.progressUpdatedAt));
        }
        if (((srv.sessions && srv.sessions.length) || (srv.weighins && srv.weighins.length)) && S.profile && !S.profile.setup) S.profile.setup = true;
        var after = JSON.stringify(S);
        /* 2026-08-30, THE KV BURN. `lastSnap = ""` sat HERE, outside the branch below, and was
           harmless for as long as the timer was push-only: `pullAndMerge` ran once per page load,
           so the brake came off once. v12.1 (8/23) put the PULL on the 4-second timer, which turned
           one reset per load into one reset every 4 seconds — so `push()` could never see an
           unchanged snapshot, every cycle wrote, and every write is an unconditional KV put.
           21,600 puts/day against a free-tier 1,000, spent in 67 minutes, every day since.
           The reset belongs only where the merge actually moved something. */
        if (after !== before) {
          lastSnap = "";
          saveState(S);
          /* v12.1: bootstrap still reloads ONCE, because a device that has just adopted a whole
             history needs a clean start. Every later change repaints in place, because from here on
             this runs on a timer and a reload on every poll would make the app unusable. The return
             value tells the caller something moved, so a caller can say so without re-diffing. */
          if (!reloadedOnce) reloadOnce(); else repaintInPlace();
          return true;
        }
        return false;
      })
      .catch(function (e) { mark(false, "pull " + (e && e.message)); return false; });
  }

  function bootstrapFromServer(srv) {
    var S = { v: 2,
      profile: { setup: true, name: "", units: "lb", loc: "Miami", goalLb: 180, stretchLb: 175, rest: 90, theme: "system", equip: ["BW", "band"], adjustable: false, mode: "bw", started: null, programStart: null, runPlanStart: null },
      progress: srv.progressState || {}, sore: (srv.sore && typeof srv.sore === "object") ? srv.sore : {},
      wk: {}, sessions: Array.isArray(srv.sessions) ? srv.sessions : [],
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
      planPos: 0, override: {}, activeMode: "plan", genWk: null,
      capTest: Array.isArray(srv.capTest) ? srv.capTest : [],
      pedo: (srv.pedo && typeof srv.pedo === "object") ? srv.pedo : {},
      pedoMeta: srv.pedoMeta || null,
      cardioTick: (srv.cardioTick && typeof srv.cardioTick === "object") ? srv.cardioTick : {},
      hardDays: (srv.hardDays && typeof srv.hardDays === "object") ? srv.hardDays : {} };
    if (srv.roundsCfg && typeof srv.roundsCfg === "object") {
      if (typeof srv.roundsCfg.base === "number") S.roundsBase = srv.roundsCfg.base;
      if (srv.roundsCfg.adaptDay) S.roundsAdaptDay = srv.roundsCfg.adaptDay;
      if (srv.roundsCfg.wchartWin) S.wchartWin = srv.roundsCfg.wchartWin;
    }
    S.sessions.forEach(function (s) { if (s && s.date) S.done[s.date] = true; });
    return S;
  }
  function start() {
    // prompt (in-DOM) + pull first, even with no local state, so ANY device pairs just by entering the passphrase
    /* v12.1, HIS ITEM 4. This was `setInterval(push, POLL_MS)` — push only — so the app pushed
       forever into a Worker whose new data it never asked for again. His 15-minute export landed
       and an open device could not see it until he reloaded by hand.
       Pull FIRST and then push, because the merge is gap-fill plus last-write-wins and a pull
       landing after a push would re-merge work that has already gone up. */
    var cycle = function () {
      return pullAndMerge().then(function (changed) {
        push();
        return !!changed;
      }).catch(function () { return false; });
    };
    var run = function () { cycle().then(function () { setInterval(cycle, POLL_MS); }); };
    if (getToken()) run();
    else promptToken(run);
    if (global.addEventListener) global.addEventListener("online", function () { if (getToken()) { cycle(); } });
    /* THE MOMENT HE ACTUALLY LOOKS AT IT. */
    if (global.document && global.document.addEventListener) {
      var lastVis = 0;
      global.document.addEventListener("visibilitychange", function () {
        if (global.document.hidden || !getToken()) return;
        var t2 = Date.now();
        if (t2 - lastVis < 20000) return;
        lastVis = t2;
        cycle();
      });
    }
  }

  if (document.readyState === "complete" || document.readyState === "interactive") setTimeout(start, 500);
  else global.addEventListener("load", function () { setTimeout(start, 500); });

  /* v7.10. Settings needs a way to force an exchange and report what happened, rather than making
     Matthew wait out the poll interval and guess. `now()` runs a real pull then a real push and
     resolves with the health record, so the caller can show the actual outcome instead of a
     hopeful toast. */
  function now() {
    if (!getToken()) return Promise.resolve({ ok: false, reason: "not paired" });
    return pullAndMerge().then(function () { push(); }).then(function () {
      var h = {}; try { h = JSON.parse(localStorage.getItem(HEALTH_KEY)) || {}; } catch (e) {}
      return { ok: !!h.lastOk && !h.fails, health: h };
    }).catch(function (e) { return { ok: false, reason: String(e && e.message) }; });
  }
  global.TrainSyncAuto = { start: start, now: now, repaint: repaintInPlace, _toWire: toWire, _unionSessions: unionSessions, _mergeWeigh: mergeWeigh, _mergeTombs: mergeTombs };
})(typeof window !== "undefined" ? window : this);
