(function () {
  var KEY = 'wv.mvp.seen';
  function seen() { try { return localStorage.getItem(KEY) === '1'; } catch (e) { return false; } }
  function mark() { try { localStorage.setItem(KEY, '1'); } catch (e) {} }

  var css = document.createElement('style');
  css.textContent =
    '.mg{position:fixed;inset:0;z-index:9000;display:flex;align-items:flex-end;justify-content:center;background:rgba(8,7,6,.62);-webkit-backdrop-filter:blur(6px);backdrop-filter:blur(6px);opacity:0;transition:opacity .25s}' +
    '.mg.on{opacity:1}' +
    '.mg-s{width:100%;max-width:520px;max-height:92vh;overflow:auto;background:#1b1916;color:#efe9df;border-radius:22px 22px 0 0;padding:26px 22px calc(22px + env(safe-area-inset-bottom));font:15px/1.5 var(--sans,system-ui);box-shadow:0 -12px 40px rgba(0,0,0,.45)}' +
    '@media (min-width:700px){.mg{align-items:center}.mg-s{border-radius:22px}}' +
    '.mg h2{font:400 30px/1.1 "DM Serif Display",Georgia,serif;margin:0 0 8px}' +
    '.mg p{margin:0 0 14px;color:#cfc7ba}' +
    '.mg ol{list-style:none;margin:6px 0 16px;padding:0;border-top:1px solid #34302a}' +
    '.mg li{display:grid;grid-template-columns:28px 1fr;gap:10px;padding:11px 0;border-bottom:1px solid #34302a}' +
    '.mg li b{display:block;color:#efe9df;font-weight:600}' +
    '.mg li span{color:#b3aa9c;font-size:14px}' +
    '.mg .n{font:600 13px/26px var(--sans,system-ui);width:26px;height:26px;border-radius:50%;background:#2c2924;color:#e2b25c;text-align:center}' +
    '.mg .fine{font-size:13px;color:#a69d8f}' +
    '.mg .row{display:flex;gap:10px;margin-top:6px}' +
    '.mg button{font:600 15px var(--sans,system-ui);border-radius:14px;padding:13px 16px;border:0;cursor:pointer}' +
    '.mg .go{flex:1;background:#e2b25c;color:#1b1916}' +
    '.mg .alt{background:#2c2924;color:#efe9df}' +
    '.mg details{margin:4px 0 14px;border:1px solid #34302a;border-radius:12px;padding:10px 12px}' +
    '.mg summary{cursor:pointer;color:#efe9df;font-weight:600}' +
    '.mg .ex{font-size:14px;color:#cfc7ba;margin:10px 0 0}' +
    '.mg .ex q{display:block;color:#b3aa9c;margin:0 0 8px;quotes:"\\201C" "\\201D"}' +
    '.mg .tag{display:inline-block;font-size:11px;letter-spacing:.06em;text-transform:uppercase;color:#a69d8f;margin-bottom:4px}' +
    '.mg-help{position:fixed;top:calc(14px + env(safe-area-inset-top));right:16px;z-index:8000;width:36px;height:36px;border-radius:50%;border:0;background:rgba(44,40,36,.72);color:#efe9df;font:600 17px var(--sans,system-ui);cursor:pointer;-webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px)}' +
    '.mg button:focus-visible,.mg-help:focus-visible{outline:2px solid #e2b25c;outline-offset:2px}';
  document.head.appendChild(css);

  var html =
    '<div class="mg-s" role="dialog" aria-modal="true" aria-labelledby="mg-t">' +
    '<h2 id="mg-t">Well-Versed</h2>' +
    '<p>Most of what we read is forgotten within days. Well-Versed gives you one short lesson, then asks you to explain it back in your own words, because saying it out loud is how it sticks.</p>' +
    '<ol>' +
    '<li><span class="n">1</span><div><b>Read today’s lesson</b><span>The Scurvy Trial, about seven minutes.</span></div></li>' +
    '<li><span class="n">2</span><div><b>Tell Boswell what you remember</b><span>Tap Talk to Boswell at the end of the lesson. Speak or type. Boswell is an AI tutor who checks what you said against the lesson only.</span></div></li>' +
    '<li><span class="n">3</span><div><b>Keep what you missed</b><span>Boswell turns the point you missed into a flashcard in Cards, and the review schedule brings it back before you forget it.</span></div></li>' +
    '</ol>' +
    '<details><summary>See a sample of Boswell’s feedback</summary><div class="ex">' +
    '<span class="tag">Sample from testing</span>' +
    '<q>James Lind gave twelve sailors with scurvy different remedies in pairs, and the two who got oranges and lemons recovered fastest.</q>' +
    '<p><b>Boswell:</b> You have Lind, the pairs and the result right. What you left out is how he set it up: the patients were as alike as he could make them, with one difference between each pair, which is what made it a fair test.</p>' +
    '<p><b>Boswell asks:</b> What was unique about the way Lind designed his trial?</p></div></details>' +
    '<p class="fine">Your explanation is sent to an AI model to write the feedback and is not saved by Well-Versed. Your progress stays in this browser. Boswell can be wrong, so the lesson is always the final word.</p>' +
    '<div class="row"><button class="go" data-mg="start">Start the lesson</button><button class="alt" data-mg="close">Look around</button></div>' +
    '</div>';

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
    m.innerHTML = html;
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
    var root = !top || top.id === 'r';
    var open = document.querySelector('.sheet.on, .talk, .reader');
    h.hidden = !root || !!open;
  }
  if (app && window.MutationObserver) new MutationObserver(sync).observe(app, { childList: true, subtree: false, attributes: true, attributeFilter: ['class'] });
  sync();

  if (!seen()) setTimeout(show, 600);
})();
