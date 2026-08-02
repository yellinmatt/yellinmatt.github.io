/* data.js — build state, one line per project, traced to PROJECTS.md as of
   2026-08-02. Shared by the portfolio and the about page so a version number
   has exactly one writer. */
window.BUILD = {
  brief : { v: 'Vol. I, No. 75', s: 'Live daily',   d: 'Runs itself at 6:04 AM. Every weekday plus a longer Sunday edition.' },
  versed: { v: 'Daily since May', s: 'Live daily',  d: 'Runs itself at 6:14 AM. Every lesson kept and indexed in a Library.' },
  deal  : { v: 'Lesson 016',      s: 'Building',    d: 'Two full rotations through six tracks plus a partial third, with digests and decks at each turn.' },
  bits  : { v: '459 comics',      s: 'Parked',      d: 'Catalogue complete and audited. Ranking is still the seeded order.' },
  train : { v: 'v7.77',           s: 'Maintaining', d: 'Four audit harnesses, all at zero. Sixteen shipped versions since the rebuild.' },
  desk  : { v: 'Rebuilt daily',   s: 'Live',        d: 'One writer, every morning, and rerunning it self-heals.' },
  kit   : { v: '4 editions',      s: 'Shipped',     d: 'Enterprise, work account, beginner and advanced. All four sent.' },
  uni   : { v: '48 pages',        s: 'Building',    d: 'Three courses complete and live, a fourth at 3 of 11.' },
  music : { v: '66,253 plays',    s: 'Building',    d: 'Twelve exports rebuilt into one queryable record. Reorganisation about four fifths done.' },
  fin   : { v: 'Weekly letter',   s: 'Live',        d: 'A letter every Monday, with a monthly reconciliation folded into the first.' },
  film  : { v: 'Top 100',         s: 'Self-running',d: 'The shelf, and an engine that decides what I watch tonight.' },
  read  : { v: 'Self-running',    s: 'Live',        d: 'Every book finished, shelved and counted.' }
};

/* Anything already inside the viewport reveals SYNCHRONOUSLY; the observer
   only owns what is below it. Gating the top of a page on an async callback
   is what left the masthead at opacity 0 for seconds on 2026-08-01. */
window.reveal = function () {
  function visible() {
    [].forEach.call(document.querySelectorAll('.rv'), function (e) {
      var r = e.getBoundingClientRect();
      if (r.top < window.innerHeight && r.bottom > 0) e.classList.add('in');
    });
  }
  try {
    if (!('IntersectionObserver' in window)) {
      [].forEach.call(document.querySelectorAll('.rv'), function (e) { e.classList.add('in'); });
      return;
    }
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { threshold: .06, rootMargin: '0px 0px -4% 0px' });
    [].forEach.call(document.querySelectorAll('.rv'), function (e) { io.observe(e); });
    visible();
    window.addEventListener('load', visible);
  } catch (e) {
    [].forEach.call(document.querySelectorAll('.rv'), function (e) { e.classList.add('in'); });
  }
};
