(function () {
  var KEY = 'wv.mvp.seen';
  function seen() { try { return localStorage.getItem(KEY) === '1'; } catch (e) { return false; } }
  function mark() { try { localStorage.setItem(KEY, '1'); } catch (e) {} }

  var css = document.createElement('style');
  css.textContent =
    '.mg{position:fixed;inset:0;z-index:9000;display:flex;justify-content:center;background:#141210;color:#f3eee6;opacity:0;transition:opacity .3s;font-family:"Instrument Sans",-apple-system,BlinkMacSystemFont,sans-serif}' +
    '.mg.on{opacity:1}' +
    '.mg-s{width:100%;max-width:460px;display:flex;flex-direction:column;padding:calc(18px + env(safe-area-inset-top)) 0 calc(22px + env(safe-area-inset-bottom));overflow:hidden}' +
    '.mg-top{display:flex;justify-content:space-between;align-items:center;padding:0 24px;height:44px}' +
    '.mg-brand{font:400 20px/1 "DM Serif Display",Georgia,serif;color:#fbf7f0}' +
    '.mg-skip{border:0;background:none;color:#b9b1a4;font:500 15px "Instrument Sans",sans-serif;padding:10px 0 10px 14px;cursor:pointer}' +
    '.mg-track{flex:1;display:flex;overflow-x:auto;scroll-snap-type:x mandatory;scrollbar-width:none;overscroll-behavior-x:contain}.mg-track::-webkit-scrollbar{display:none}' +
    '.mg-p{flex:0 0 100%;scroll-snap-align:start;display:flex;flex-direction:column;justify-content:flex-end;padding:8px 28px 0;min-height:0}' +
    '.mg-v{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:260px;padding:10px 0 26px}' +
    '.mg h2{font:400 38px/1.05 "DM Serif Display",Georgia,serif;margin:0 0 12px;color:#fbf7f0;letter-spacing:-.005em}' +
    '.mg-p p{font-size:17px;line-height:1.45;color:#d9d2c6;margin:0 0 6px;max-width:34ch}' +
    '.mg-card{width:230px;border-radius:22px;overflow:hidden;background:#1f1c19;box-shadow:0 30px 70px rgba(0,0,0,.55);transform:translateY(16px) rotate(-2deg);opacity:0;transition:transform .9s cubic-bezier(.16,1,.3,1),opacity .6s}' +
    '.mg-p.act .mg-card{transform:none;opacity:1}' +
    '.mg-card img{display:block;width:100%;height:250px;object-fit:cover;object-position:50% 30%}' +
    '.mg-ct{padding:14px 16px 16px}.mg-ct b{display:block;font:400 22px/1.1 "DM Serif Display",Georgia,serif;color:#fbf7f0}.mg-ct span{font-size:13px;color:#b9b1a4}' +
    '.mg-chat{width:100%;display:flex;flex-direction:column;gap:12px}' +
    '.mg-b{display:flex;align-items:flex-end;gap:8px;opacity:0;transform:translateY(12px);transition:opacity .5s,transform .7s cubic-bezier(.16,1,.3,1)}' +
    '.mg-b.r{justify-content:flex-end}.mg-av{flex:none;width:30px;height:30px}.mg-av .bosm,.mg-av svg{width:30px;height:30px}' +
    '.mg-bb{max-width:78%;padding:11px 14px;border-radius:18px;font-size:15.5px;line-height:1.35;background:#2a2622;color:#f3eee6}' +
    '.mg-b.r .mg-bb{background:#fbf7f0;color:#141210}' +
    '.mg-p.act .mg-b{opacity:1;transform:none}.mg-p.act .mg-b:nth-child(2){transition-delay:.9s}.mg-p.act .mg-b:nth-child(3){transition-delay:2s}' +
    '.mg-wave{display:inline-flex;gap:2px;margin-left:8px;vertical-align:middle}.mg-wave i{width:3px;height:12px;border-radius:2px;background:#9b2c1d;animation:mgw 1s ease-in-out infinite}.mg-wave i:nth-child(2){animation-delay:.15s}.mg-wave i:nth-child(3){animation-delay:.3s}.mg-wave i:nth-child(4){animation-delay:.45s}.mg-wave i:nth-child(5){animation-delay:.6s}' +
    '@keyframes mgw{50%{transform:scaleY(.35)}}' +
    '.mg-fc{position:relative;width:250px;height:190px;perspective:900px}' +
    '.mg-f,.mg-bk{position:absolute;inset:0;border-radius:22px;padding:22px;display:flex;align-items:center;font:400 21px/1.32 "Spectral",Georgia,serif;backface-visibility:hidden;-webkit-backface-visibility:hidden;transition:transform .8s cubic-bezier(.2,.8,.2,1);box-shadow:0 24px 60px rgba(0,0,0,.5)}' +
    '.mg-f{background:#7a2f22;color:#fbf7f0}.mg-f u{text-decoration:none;border-bottom:2px solid #fbf7f0}' +
    '.mg-bk{background:#fbf7f0;color:#7a2f22;justify-content:center;font-size:28px;transform:rotateY(180deg)}' +
    '.mg-p.act .mg-f{transform:rotateY(-180deg);transition-delay:1.1s}.mg-p.act .mg-bk{transform:none;transition-delay:1.1s}' +
    '.mg-due{margin-top:16px;font-size:13px;font-weight:600;color:#86b4f2;opacity:0;transition:opacity .5s 2s}.mg-p.act .mg-due{opacity:1}' +
    '.mg-dots{display:flex;justify-content:center;gap:7px;padding:18px 0 12px}.mg-dots i{width:7px;height:7px;border-radius:50%;background:#4a443d;transition:background .3s,width .3s}.mg-dots i.on{background:#fbf7f0;width:20px;border-radius:4px}' +
    '.mg .fine{font-size:12px;color:#9b9386;text-align:center;margin:0 24px 12px}' +
    '.mg .go{margin:0 24px;width:calc(100% - 48px);border:0;border-radius:999px;background:#fbf7f0;color:#141210;font:600 17px "Instrument Sans",sans-serif;padding:17px;cursor:pointer}' +
    '.mg-help{position:fixed;top:calc(18px + env(safe-area-inset-top));left:140px;z-index:8000;width:36px;height:36px;border-radius:50%;border:0;background:rgba(44,40,36,.72);color:#f3eee6;font:600 17px "Instrument Sans",sans-serif;cursor:pointer;-webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px)}' +
    '.mg button:focus-visible,.mg-help:focus-visible{outline:2px solid #fbf7f0;outline-offset:3px}' +
    '.scr.talk{--room-btn:#fbf7f0;--room-btn-ink:#141210}' +
    '.reader:not(.night):not(.sepia){--rbg:#f6f2ea;--rink:#1d1a16;--rsub:#5e564b;--rrule:#ddd6c9;--rsoft:#ece6db;--racc:#9b2c1d;--rpop:#fbf9f5}' +
    '.scr.talk .arow .skip{opacity:1;background:rgba(251,247,240,.12);border-radius:999px;padding:0 18px;height:52px;font-weight:600}';
  document.head.appendChild(css);

  function bos() { try { return typeof bosMini === 'function' ? bosMini() : ''; } catch (e) { return ''; } }
  function page(i, vis, t, d) { return '<section class="mg-p" data-i="' + i + '"><div class="mg-v">' + vis + '</div><h2' + (i === 0 ? ' id="mg-t"' : '') + '>' + t + '</h2><p>' + d + '</p></section>'; }
  function html() {
    var v1 = '<div class="mg-card"><img alt="" src="/well-versed/app/img/h/scurvy-trial.webp"><div class="mg-ct"><b>The Scurvy Trial</b><span>Medicine · 7 min</span></div></div>';
    var v2 = '<div class="mg-chat"><div class="mg-b l"><span class="mg-av">' + bos() + '</span><span class="mg-bb">What did Lind give the two men who got better?</span></div>' +
      '<div class="mg-b r"><span class="mg-bb">Oranges and lemons, two and one a day<i class="mg-wave"><i></i><i></i><i></i><i></i><i></i></i></span></div>' +
      '<div class="mg-b l"><span class="mg-av">' + bos() + '</span><span class="mg-bb">Right. Now, what was wrong with how he picked the sea-water pair?</span></div></div>';
    var v3 = '<div class="mg-fc"><div class="mg-f">After Lind’s trial, the Navy took <u>&emsp;&emsp;&emsp;</u> to order citrus for every sailor.</div><div class="mg-bk">forty-eight years</div></div><div class="mg-due">Back in 3 days</div>';
    return '<div class="mg-s" role="dialog" aria-modal="true" aria-labelledby="mg-t">' +
      '<div class="mg-top"><span class="mg-brand">Well-Versed</span><button class="mg-skip" data-mg="close">Skip</button></div>' +
      '<div class="mg-track">' +
      page(0, v1, 'One story a day', 'Each morning you get one short, illustrated story about something worth knowing. Today’s: a ship’s surgeon, twelve sick sailors and a basket of oranges.') +
      page(1, v2, 'Then tell it back', 'When you finish, explain it to Boswell, out loud or typed. He checks you against the story, tells you what you got right and coaches you through what you missed.') +
      page(2, v3, 'Keep what you learned', 'Anything you were shaky on becomes a card, and it comes back just before you would forget it.') +
      '</div><div class="mg-dots"><i class="on"></i><i></i><i></i></div>' +
      '<p class="fine">Your answers go to an AI for feedback and are not stored.</p>' +
      '<button class="go" data-mg="next">Next</button>' +
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
    var cur = 0;
    function goTo(i) { var tr = m.querySelector('.mg-track'), ps = m.querySelectorAll('.mg-p'); cur = Math.max(0, Math.min(ps.length - 1, i)); tr.scrollTo({ left: cur * tr.clientWidth, behavior: 'smooth' }); }
    function onPage(i) { cur = i; [].forEach.call(m.querySelectorAll('.mg-dots i'), function (d, k) { d.classList.toggle('on', k === i); }); [].forEach.call(m.querySelectorAll('.mg-p'), function (p, k) { p.classList.toggle('act', k === i); }); m.querySelector('.go').textContent = i === 2 ? 'Go to today’s story' : 'Next'; }
    m.addEventListener('click', function (e) {
      var a = e.target.closest('[data-mg]');
      if (!a) return;
      if (a.getAttribute('data-mg') === 'next') { if (cur < 2) return goTo(cur + 1); close(); try { S.tab = 'today'; root(); } catch (err) {} return; }
      close(); try { S.tab = 'today'; root(); } catch (err) {}
    });
    setTimeout(function () { var tr = m.querySelector('.mg-track'); tr.addEventListener('scroll', function () { var i = Math.round(tr.scrollLeft / tr.clientWidth); if (i !== cur) onPage(i); }, { passive: true }); onPage(0); }, 0);
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
