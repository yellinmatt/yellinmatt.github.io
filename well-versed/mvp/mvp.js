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
    '.mg-help{position:fixed;top:calc(14px + env(safe-area-inset-top));right:16px;z-index:8000;width:36px;height:36px;border-radius:50%;border:0;background:rgba(44,40,36,.72);color:#f3eee6;font:600 17px "Instrument Sans",sans-serif;cursor:pointer;-webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px)}' +
    '.mg button:focus-visible,.mg-help:focus-visible{outline:2px solid #fbf7f0;outline-offset:3px}';
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
