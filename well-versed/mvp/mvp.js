(function () {
  var KEY = 'wv.mvp.seen';
  function seen() { try { return localStorage.getItem(KEY) === '1'; } catch (e) { return false; } }
  function mark() { try { localStorage.setItem(KEY, '1'); } catch (e) {} }

  var css = document.createElement('style');
  css.textContent =
    '.mg{position:fixed;inset:0;z-index:9000;display:flex;justify-content:center;background:#141210;color:#f3eee6;opacity:0;transition:opacity .25s;font-family:"Instrument Sans",-apple-system,BlinkMacSystemFont,sans-serif}' +
    '.mg.on{opacity:1}' +
    '.mg-s{width:100%;max-width:460px;display:flex;flex-direction:column;padding:calc(56px + env(safe-area-inset-top)) 24px calc(24px + env(safe-area-inset-bottom));overflow:auto}' +
    '.mg h2{font:400 52px/1 "DM Serif Display",Georgia,serif;margin:0 0 10px;letter-spacing:-.01em}' +
    '.mg .lede{font-size:17px;line-height:1.4;color:#d9d2c6;margin:0 0 30px}' +
    '.mg ul{list-style:none;margin:0;padding:0}' +
    '.mg li{display:flex;align-items:center;gap:16px;padding:12px 0}' +
    '.mg .ic{flex:none;width:30px;height:30px;display:flex;align-items:center;justify-content:center;color:#fbf7f0}' +
    '.mg .ic svg{width:26px;height:26px}' +
    '.mg .ic .bosm{width:30px;height:30px}' +
    '.mg li b{display:block;font-size:16px;font-weight:600;color:#fbf7f0}' +
    '.mg li span{display:block;font-size:14px;color:#b9b1a4;line-height:1.35}' +
    '.mg .sp{flex:1;min-height:24px}' +
    '.mg .fine{font-size:12px;color:#9b9386;text-align:center;margin:0 0 14px}' +
    '.mg .go{width:100%;border:0;border-radius:999px;background:#fbf7f0;color:#141210;font:600 17px "Instrument Sans",sans-serif;padding:17px;cursor:pointer}' +
    '.mg .alt{width:100%;border:0;background:none;color:#d9d2c6;font:500 15px "Instrument Sans",sans-serif;padding:14px;cursor:pointer}' +
    '.mg-help{position:fixed;top:calc(18px + env(safe-area-inset-top));left:140px;z-index:8000;width:36px;height:36px;border-radius:50%;border:0;background:rgba(44,40,36,.72);color:#f3eee6;font:600 17px "Instrument Sans",sans-serif;cursor:pointer;-webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px)}' +
    '.mg button:focus-visible,.mg-help:focus-visible{outline:2px solid #fbf7f0;outline-offset:3px}' +
    '.scr.talk{--room-btn:#fbf7f0;--room-btn-ink:#141210}' +
    '.reader:not(.night):not(.sepia){--rbg:#f6f2ea;--rink:#1d1a16;--rsub:#5e564b;--rrule:#ddd6c9;--rsoft:#ece6db;--racc:#9b2c1d;--rpop:#fbf9f5}' +
    '.scr.talk .arow .skip{opacity:1;background:rgba(251,247,240,.12);border-radius:999px;padding:0 18px;height:52px;font-weight:600}';
  document.head.appendChild(css);

  function icon(k) { try { return (window.I && I[k]) || ''; } catch (e) { return ''; } }
  function bos() { try { return typeof bosMini === 'function' ? bosMini() : ''; } catch (e) { return ''; } }
  function row(ic, t, d) { return '<li><span class="ic" aria-hidden="true">' + ic + '</span><div><b>' + t + '</b><span>' + d + '</span></div></li>'; }

  function html() {
    return '<div class="mg-s" role="dialog" aria-modal="true" aria-labelledby="mg-t">' +
      '<h2 id="mg-t">Well-Versed</h2>' +
      '<p class="lede">Read a short lesson, explain it back, and keep what you learned.</p>' +
      '<ul>' +
      row(icon('today'), 'Today', 'Your lesson for the day.') +
      row(bos(), 'Boswell', 'Tell him what you remember. He checks it against the lesson.') +
      row(icon('cards'), 'Cards', 'What you missed comes back before you forget it.') +
      row(icon('shelf'), 'Shelf', 'Every lesson, by subject.') +
      row(icon('rec'), 'Record', 'Your streak and what you know.') +
      '</ul><div class="sp"></div>' +
      '<p class="fine">Your answers go to an AI for feedback and are not stored.</p>' +
      '<button class="go" data-mg="start">Start with The Scurvy Trial</button>' +
      '<button class="alt" data-mg="close">Look around first</button>' +
      '</div>';
  }

  var lastFocus = null;
  function close() {
    var m = document.querySelector('.mg');
    if (!m) return;
    mark();
    m.classList.remove('on');
    setTimeout(function () { m.remove(); if (lastFocus && lastFocus.focus) lastFocus.focus(); }, 220);
    document.removeEventListener('keydown', onKey);
  }
  function onKey(e) { if (e.key === 'Escape') close(); }
  function show() {
    if (document.querySelector('.mg')) return;
    lastFocus = document.activeElement;
    var m = document.createElement('div');
    m.className = 'mg';
    m.innerHTML = html();
    m.addEventListener('click', function (e) {
      var a = e.target.closest('[data-mg]');
      if (e.target === m) return close();
      if (!a) return;
      if (a.getAttribute('data-mg') === 'start') {
        close();
        try { var l = byH('scurvy-trial.html'); if (l) readLesson(l); } catch (err) {}
      } else close();
    });
    document.body.appendChild(m);
    document.addEventListener('keydown', onKey);
    requestAnimationFrame(function () { m.classList.add('on'); var b = m.querySelector('.go'); if (b) b.focus(); });
  }

  var h = document.createElement('button');
  h.className = 'mg-help';
  h.type = 'button';
  h.setAttribute('aria-label', 'How Well-Versed works');
  h.textContent = '?';
  h.addEventListener('click', show);
  document.body.appendChild(h);

  // Show the help button only on the main tabs, so it never covers a screen's own controls.
  var app = document.getElementById('app');
  function sync() {
    var s = app ? app.querySelectorAll(':scope > .scr') : [];
    var top = s[s.length - 1];
    var root = (!top || top.id === 'r') && (typeof S === 'undefined' || !S.tab || S.tab === 'today');
    var open = document.querySelector('.sheet.on, .talk, .reader');
    h.hidden = !root || !!open;
  }
  if (app && window.MutationObserver) new MutationObserver(sync).observe(app, { childList: true, subtree: true, attributes: true, attributeFilter: ['class'] });
  sync();

  if (!seen()) setTimeout(show, 600);
})();

(function () {
  var css = document.createElement('style');
  css.textContent =
    '.mvc{width:100%;max-width:420px;margin:0 auto;text-align:left;font-family:"Instrument Sans",-apple-system,sans-serif}' +
    '.mvc .k{font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:#b9b1a4;margin:0 0 12px}' +
    '.mvc .q{background:#7a2f22;color:#fbf7f0;border-radius:22px;padding:26px 24px;font:400 25px/1.3 "Spectral",Georgia,serif;min-height:180px;box-shadow:0 20px 50px rgba(0,0,0,.4)}' +
    '.mvc .q .bl{display:inline-block;min-width:4.5em;border-bottom:2px solid #fbf7f0}' +
    '.mvc .q .ans{background:#fbf7f0;color:#7a2f22;border-radius:6px;padding:0 6px}' +
    '.mvc .row{display:flex;gap:10px;margin-top:18px}' +
    '.mvc button{flex:1;border:0;border-radius:999px;padding:15px 10px;font:600 16px "Instrument Sans",sans-serif;cursor:pointer}' +
    '.mvc .pri{background:#fbf7f0;color:#141210}' +
    '.mvc .sec{background:#2c2924;color:#f3eee6}' +
    '.mvc textarea{width:100%;min-height:120px;border-radius:16px;border:1px solid #3a362f;background:#1f1d1a;color:#f3eee6;font:17px/1.4 "Instrument Sans",sans-serif;padding:14px}' +
    '.mvc .hint{font-size:13px;color:#b9b1a4;margin:8px 0 0}';
  document.head.appendChild(css);

  function esc(t) { return String(t).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function face(q, show) {
    var m = q.match(/\{\{c1::([^}]+)\}\}/), term = m ? m[1] : '';
    var parts = q.split(/\{\{c1::[^}]+\}\}/);
    var mid = show ? '<span class="ans">' + esc(term) + '</span>' : '<span class="bl">&nbsp;</span>';
    return esc(parts[0] || '').replace(/\*([^*]+)\*/g, '<i>$1</i>') + mid + esc(parts.slice(1).join('') || '').replace(/\*([^*]+)\*/g, '<i>$1</i>');
  }
  function host() { var s = document.querySelectorAll('#app > .scr'); return s[s.length - 1]; }
  function render(view) {
    var c = window.talkCard, h = host();
    if (!c || !h) { try { finish(); } catch (e) {} return; }
    var title = (window.talkL && talkL.t) ? String(talkL.t).replace(/<[^>]+>/g, '') : '';
    var body;
    if (view === 'try') body = '<div class="q">' + face(c.q, false) + '</div><div class="row"><button class="pri" data-mv="reveal">Show the answer</button></div>';
    else if (view === 'edit') body = '<textarea id="mvt">' + esc(c.q.replace(/\{\{c1::([^}]+)\}\}/, '[$1]')) + '</textarea><p class="hint">Put the hidden answer in [square brackets].</p><div class="row"><button class="sec" data-mv="back">Cancel</button><button class="pri" data-mv="save">Save</button></div>';
    else body = '<div class="q">' + face(c.q, true) + '</div><div class="row"><button class="sec" data-mv="remove">Remove</button><button class="sec" data-mv="edit">Change</button><button class="pri" data-mv="keep">Keep</button></div>';
    h.innerHTML = '<div class="mvc"><p class="k">Your new card · ' + esc(title) + '</p>' + body + '</div>';
  }
  document.addEventListener('click', function (e) {
    var b = e.target.closest('[data-mv]'); if (!b) return;
    var a = b.getAttribute('data-mv'), c = window.talkCard;
    if (a === 'cardtry') render('try');
    else if (a === 'reveal' || a === 'back') render('shown');
    else if (a === 'edit') render('edit');
    else if (a === 'save') {
      var v = (document.getElementById('mvt') || {}).value || '';
      var m = v.match(/\[([^\]]+)\]/);
      if (!m) { try { toast('Put the answer in [brackets]'); } catch (x) {} return; }
      c.q = v.replace(/\[([^\]]+)\]/, '{{c1::$1}}').trim(); try { WV.save(); } catch (x) {}
      render('shown');
    } else if (a === 'remove') {
      var i = C.indexOf(c); if (i >= 0) { C.splice(i, 1); C.forEach(function (x, k) { x.i = k; }); }
      window.talkCard = null; try { WV.save(); toast('Card removed'); } catch (x) {}
      try { finish(); } catch (x) {}
    } else if (a === 'keep') { try { toast('Card kept'); finish(); } catch (x) {} }
  });
})();
