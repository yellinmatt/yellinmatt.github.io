/* proofs.js — the shared content layer for the five preview directions.
   Every fact here traces to PROJECT-TRUTH.md. Nothing is invented except the
   numbers inside a proof panel that is explicitly badged "Sample data".
   All five directions load THIS file, so the copy is identical across them and
   the only variable under comparison is the design. */
(function (root) {
  "use strict";

  /* ---------------------------------------------------------------- proofs
     Each proof is DRAWN. No iframes, no screenshots. A private tool is
     rendered from its real shape with fictional data on the face of it. */

  var P = {};

  /* The Morning Brief — the entity card and the framing note are the two
     things nobody else does, so they are the two things shown. Text below is
     verbatim from the edition of 2026-08-02. */
  P.brief = function () {
    return '' +
      '<div class="pf pf-paper" data-kind="Real edition">' +
      '  <div class="pf-mast"><span>The Morning Brief</span><em>Vol. I &middot; No. 75 &middot; Sunday</em></div>' +
      '  <p class="pf-kick">The Splash &middot; Washington and Riyadh &middot; cross-spectrum</p>' +
      '  <h4 class="pf-head">Trump calls off the Iran strikes after a phone call from Riyadh, and Tehran calls the deal a lie</h4>' +
      '  <p class="pf-body">President Trump said late Saturday that the United States would hold off on new strikes against Iran, hours after Saudi Crown Prince <span class="pf-ent" tabindex="0">Mohammed bin Salman<span class="pf-card"><b>Person</b>Saudi Arabia\'s crown prince and de facto ruler. He telephoned Trump on August 1 urging restraint, warning that American strikes on Iranian energy sites would invite retaliation against Gulf oil facilities.</span></span> telephoned him to argue against them.</p>' +
      '  <div class="pf-note"><span class="pf-lab">Framing note</span>The same facts split cleanly. The <i>New York Times</i> ran &ldquo;In Iran, the U.S. Appears Headed for a Strategic Defeat&rdquo; and the <i>Guardian</i> called the halt a &ldquo;climbdown from extravagant threats,&rdquo; while <i>Fox News</i> led with a former CENTCOM deputy describing Iran as &ldquo;desperate.&rdquo; Nobody disputes the call, the post or the drones.</div>' +
      '  <div class="pf-src">Source: The Guardian &middot; Also reported by AP, BBC, NYT, CBS News, Times of Israel</div>' +
      '</div>';
  };

  /* Well-Versed — the house move is the correction, so the correction is the
     excerpt. Verbatim from the Wolf lesson. */
  P.versed = function () {
    return '' +
      '<div class="pf pf-paper" data-kind="Real lesson">' +
      '  <div class="pf-mast"><span>Well-Versed</span><em>2026-07-04 &middot; The Animal World</em></div>' +
      '  <h4 class="pf-head">The Wolf</h4>' +
      '  <p class="pf-body">Almost everything the phrase &ldquo;alpha wolf&rdquo; suggests is wrong. It goes back to a 1947 study of strangers penned together behind a fence, who behaved like strangers penned together. Mech carried that picture into the most-read wolf book of its generation, then spent years watching wild packs and found something quieter. He eventually asked his publisher to stop reprinting the book.</p>' +
      '  <div class="pf-note pf-note-2"><span class="pf-lab">And then it argues with itself</span>&ldquo;It is a beautiful story, and it is almost certainly too clean.&rdquo; The lesson tells the famous trophic-cascade parable in full, then spends its last section dismantling it, because the honest lesson is how hard a wild valley is to reduce to a single cause.</div>' +
      '</div>';
  };

  /* Dealcraft — the artefact is a clause taken apart. */
  P.deal = function () {
    return '' +
      '<div class="pf pf-paper" data-kind="Real breakdown">' +
      '  <div class="pf-mast"><span>Dealcraft</span><em>Deal Breakdowns</em></div>' +
      '  <h4 class="pf-head">Boeing / KLX</h4>' +
      '  <div class="pf-rows">' +
      '    <div class="pf-row"><span>Encyclopedia</span><b>Concepts, defined once</b></div>' +
      '    <div class="pf-row"><span>Toolkit</span><b>4 tracks &middot; 35 cards</b></div>' +
      '    <div class="pf-row"><span>Breakdowns</span><b>Clause by clause</b></div>' +
      '    <div class="pf-row"><span>Lessons</span><b>016 published, 7/6 &rarr; 7/23</b></div>' +
      '  </div>' +
      '  <p class="pf-body pf-small">Two complete B&rarr;C&rarr;A&rarr;E&rarr;D&rarr;F rotations plus a partial third, with cycle digests and Anki decks at 7/12 and 7/19. Taught in the order a deal actually runs.</p>' +
      '</div>';
  };

  P.bits = function () {
    return '' +
      '<div class="pf pf-paper" data-kind="Real archive">' +
      '  <div class="pf-mast"><span>Greatest Bits</span><em>459 comics</em></div>' +
      '  <div class="pf-tags"><i>Pryor</i><i>Carlin</i><i>Conway</i><i>Burnett</i><i>Hartman</i><i>Mulaney</i><i>Farley</i><i>Wiig</i><i>Key</i><i>Peele</i><i>Caesar</i><i>Gleason</i></div>' +
      '  <p class="pf-body pf-small">Catalogued by comic and by bit, so a routine you half remember from years ago can be found again. Scope widened from stand-up to comedy in any form, with stand-up as the spine and sketch admitted by curated note. A standing auditor sweeps for empty profiles, dead embeds and duplicates.</p>' +
      '</div>';
  };

  /* Train — the real app is a phone with exactly four tabs. Sample data. */
  P.train = function () {
    return '' +
      '<div class="pf pf-phone" data-kind="Sample data">' +
      '  <div class="ph">' +
      '    <div class="ph-top"><span>Today</span><em>Day 3 &middot; Push</em></div>' +
      '    <div class="ph-card">' +
      '      <span class="ph-lab">Today &middot; Lift</span>' +
      '      <div class="ph-big">Push A</div>' +
      '      <div class="ph-ex"><span>Incline press</span><b>4 &times; 8</b></div>' +
      '      <div class="ph-ex"><span>Overhead press</span><b>3 &times; 10</b></div>' +
      '      <div class="ph-ex"><span>Cable fly</span><b>3 &times; 12</b></div>' +
      '    </div>' +
      '    <div class="ph-card ph-sore">' +
      '      <span class="ph-lab">Anything sore?</span>' +
      '      <div class="ph-chips"><i>Neck</i><i>Shoulder</i><i class="on">Low back</i><i>Hip</i><i>Knee</i><i>Ankle</i></div>' +
      '      <p class="ph-fine">Biases the next three days away from it. Never blocks a session, never docks the level, lapses by itself.</p>' +
      '    </div>' +
      '    <div class="ph-card">' +
      '      <span class="ph-lab">Level</span>' +
      '      <svg class="ph-chart" viewBox="0 0 260 64" preserveAspectRatio="none" aria-hidden="true">' +
      '        <polyline points="0,54 26,50 52,52 78,44 104,40 130,42 156,33 182,29 208,30 234,22 260,18"/>' +
      '      </svg>' +
      '      <p class="ph-fine">No target line, because there is no denominator anywhere in this app.</p>' +
      '    </div>' +
      '    <nav class="ph-nav"><i class="on">Today</i><i>Lift</i><i>Cardio</i><i>Track</i></nav>' +
      '  </div>' +
      '</div>';
  };

  /* The Desk — the name is The Desk. */
  P.desk = function () {
    return '' +
      '<div class="pf pf-board" data-kind="Sample data">' +
      '  <div class="pf-mast"><span>The Desk</span><em>Rebuilt each morning</em></div>' +
      '  <div class="bd-fire"><span class="pf-lab">On fire</span>Externship close-out, three forms, Wednesday<em>src: Reminders</em></div>' +
      '  <div class="bd-move"><span class="pf-lab">First move</span>Email the supervising attorney before the day starts<em>src: PROJECTS.md</em></div>' +
      '  <div class="bd-grid">' +
      '    <div><span class="pf-lab">Horizon &middot; 14 days</span><i>OCI bids close</i><i>Fall term opens</i><i>Orientation</i></div>' +
      '    <div><span class="pf-lab">What ran overnight</span><i>Brief 6:04</i><i>Lesson 6:14</i><i>The board</i></div>' +
      '  </div>' +
      '  <p class="pf-body pf-small">Every line carries a source. A gate hard-fails a missing row, a dead item is killed once in a ledger so it can never come back, and a decision reached in conversation is not made until it is written to a surface.</p>' +
      '</div>';
  };

  P.kit = function () {
    return '' +
      '<div class="pf pf-board" data-kind="Sample data">' +
      '  <div class="pf-mast"><span>The Claude OS Kit</span><em>Four editions shipped</em></div>' +
      '  <div class="pf-rows">' +
      '    <div class="pf-row"><span>Enterprise</span><b>Information barriers, four data classes</b></div>' +
      '    <div class="pf-row"><span>Work account</span><b>Three files, cost and consequence gates</b></div>' +
      '    <div class="pf-row"><span>Beginner</span><b>One question at a time, never types a file</b></div>' +
      '    <div class="pf-row"><span>Advanced</span><b>Beginner layer cut entirely</b></div>' +
      '  </div>' +
      '  <p class="pf-body pf-small">The same system written four ways for four readers. The advanced edition builds through two layout gates that fail the build on any container overflow, because a deck that overflows is a deck nobody trusts.</p>' +
      '</div>';
  };

  P.uni = function () {
    return '' +
      '<div class="pf pf-board" data-kind="Sample data">' +
      '  <div class="pf-mast"><span>A Personal University</span><em>48 pages live</em></div>' +
      '  <div class="pf-bars">' +
      '    <div class="bar"><span>Microeconomics</span><i style="--w:100%"></i><b>15</b></div>' +
      '    <div class="bar"><span>Corporate finance</span><i style="--w:87%"></i><b>13</b></div>' +
      '    <div class="bar"><span>Philosophy, politics, economics</span><i style="--w:100%"></i><b>20</b></div>' +
      '    <div class="bar"><span>Organisational behaviour</span><i style="--w:27%"></i><b>3 / 11</b></div>' +
      '  </div>' +
      '  <p class="pf-body pf-small">Re-teaching a finished degree by writing the encyclopedia of it. No scores anywhere: the record pages became Assessments, the questions as a set with model answers, because it teaches the content and not the transcript.</p>' +
      '</div>';
  };

  P.music = function () {
    return '' +
      '<div class="pf pf-board" data-kind="Sample data">' +
      '  <div class="pf-mast"><span>The Listening Record</span><em>2015 &rarr; 2026</em></div>' +
      '  <div class="pf-figs"><div><b>5,068</b><span>artists</span></div><div><b>66,253</b><span>qualified plays</span></div><div><b>12</b><span>raw exports</span></div></div>' +
      '  <svg class="pf-spark" viewBox="0 0 300 60" preserveAspectRatio="none" aria-hidden="true">' +
      '    <g>' + Array.apply(null, Array(44)).map(function (_, i) {
        var h = [14, 19, 12, 26, 31, 22, 38, 29, 41, 35, 47, 30, 25, 44, 52, 38, 33, 49, 41, 28, 36, 55, 44, 31, 47, 39, 52, 35, 43, 58, 46, 33, 41, 50, 37, 44, 56, 42, 35, 48, 53, 39, 46, 51][i];
        return '<rect x="' + (i * 6.9) + '" y="' + (60 - h) + '" width="4.4" height="' + h + '"/>';
      }).join('') + '</g></svg>' +
      '  <p class="pf-body pf-small">Twelve years of raw rows, roughly 83 MB, rebuilt into something you can put a question to, then used to reorganise the library it came from.</p>' +
      '</div>';
  };

  P.fin = function () {
    return '' +
      '<div class="pf pf-board" data-kind="Sample data">' +
      '  <div class="pf-mast"><span>The Finance Desk</span><em>Mondays</em></div>' +
      '  <div class="bd-gate">' +
      '    <span class="pf-lab">The decision gate</span>' +
      '    <div class="pf-row"><span>Question</span><b>Does this change the allocation?</b></div>' +
      '    <div class="pf-row"><span>Evidence</span><b>Named, dated, or it does not count</b></div>' +
      '    <div class="pf-row"><span>Ruling</span><b>Written, or it was never made</b></div>' +
      '  </div>' +
      '  <p class="pf-body pf-small">A tracker and a weekly letter that report on my own money the way an analyst would report on somebody else\'s, which turns out to be the only way I will read it. No figures appear here and none ever will.</p>' +
      '</div>';
  };

  P.film = function () {
    return '' +
      '<div class="pf pf-board" data-kind="Sample data">' +
      '  <div class="pf-mast"><span>The Film Library</span><em>Top 100, running</em></div>' +
      '  <div class="pf-strip">' + Array.apply(null, Array(10)).map(function (_, i) {
        return '<i style="--d:' + (i * 0.06) + 's"></i>';
      }).join('') + '</div>' +
      '  <p class="pf-body pf-small">Everything worth watching, shelved and ranked, with an engine that reads the shelf and simply decides what I am watching tonight. The point of a library is that it answers.</p>' +
      '</div>';
  };

  P.read = function () {
    return '' +
      '<div class="pf pf-board" data-kind="Sample data">' +
      '  <div class="pf-mast"><span>The Reading Log</span><em>Shelved and counted</em></div>' +
      '  <div class="pf-shelf">' + Array.apply(null, Array(26)).map(function (_, i) {
        return '<i style="--h:' + (58 + ((i * 37) % 34)) + 'px;--w:' + (7 + ((i * 13) % 9)) + 'px"></i>';
      }).join('') + '</div>' +
      '  <p class="pf-body pf-small">Every book finished, so the year has a shape I can look at rather than a vague sense that I have not been reading enough.</p>' +
      '</div>';
  };

  /* ------------------------------------------------------------- projects */

  var PROJECTS = [
    { id: 'brief', n: 'The Morning Brief', tier: 'live', tone: '#d4604f', href: '../news/',
      role: 'Written, designed and automated',
      one: 'A daily newspaper that writes and publishes itself before six every morning.',
      what: 'Not a link list. Every item runs reported prose with a cross-spectrum source strip, definitions annotated in place so a name never stops the sentence, a close that says what the item changes, and a framing note showing how the same facts were framed differently across the spectrum.',
      how: 'A scheduled job gathers, scores for recency and consequence, drafts, then publishes to a static page. It has run every morning since May.',
      meta: ['Fires 6:04 AM', 'Vol. I, No. 75', 'Weekday and Sunday editions'] },

    { id: 'versed', n: 'Well-Versed', tier: 'live', tone: '#dd7d63', href: '../well-versed/',
      role: 'Written and automated',
      one: 'One lesson a day toward a general education, and every one of them kept.',
      what: 'A lesson is a long illustrated essay, not a card: a hook, several thousand words of real prose, captioned photographs, a video with a note on what to watch for, and a sourced index of where to read further.',
      how: 'The house move is the correction. The wolf lesson dismantles the alpha-wolf myth, then turns around and dismantles the tidy parable it just told you, because the honest lesson is that a valley is hard to reduce to one cause.',
      meta: ['Fires 6:14 AM', 'Every lesson indexed', 'Teaching'] },

    { id: 'deal', n: 'Dealcraft', tier: 'live', tone: '#dcb47e', href: '../dealcraft/',
      role: 'Researched, written and built',
      one: 'A two-year daily curriculum in corporate and transactional law.',
      what: 'An encyclopedia of the concepts, a toolkit of four tracks and thirty-five cards, and real transactions taken apart clause by clause, taught in the order a deal actually runs rather than the order a casebook lists them.',
      how: 'Sixteen lessons published between 6 July and 23 July, two full rotations through the six tracks plus a partial third, with cycle digests and spaced-repetition decks at each turn.',
      meta: ['016 lessons live', 'Two-year build', 'Research'] },

    { id: 'bits', n: 'Greatest Bits', tier: 'live', tone: '#7da3c2', href: '../greatest-bits/',
      role: 'Catalogued and built',
      one: 'An archive of great comedy, indexed so a bit you half remember can be found.',
      what: 'Four hundred and fifty-nine comics, catalogued by comic and by bit. The scope was widened from stand-up to comedy in any form, with stand-up as the spine and sketch admitted by curated note rather than by quietly moving the definition.',
      how: 'A standing read-only auditor sweeps the whole archive for empty profiles, dead embeds, missing photographs and duplicates, so the catalogue degrades loudly instead of silently.',
      meta: ['459 comics', 'Standing auditor', 'Archive'] },

    { id: 'train', n: 'Train', tier: 'private', tone: '#6f9e8c',
      role: 'Designed, built and run',
      one: 'A training system with no number in it you can fail.',
      what: 'A phone app in four tabs. It prescribes the day off a rotation, watches load over months rather than days, and lets a video session replace any day without advancing the rotation, so a lift you skipped is next rather than lost.',
      how: 'There is no denominator anywhere in it. No three-of-seven, no weekly target, no pass mark, because a denominator invents a total to fall behind on. A weekly scorer that survived underneath the surfaces which replaced it was hunted down and deleted for exactly that reason.',
      meta: ['Edge worker, object storage', 'Four audit harnesses', 'v7.77'] },

    { id: 'desk', n: 'The Desk', tier: 'private', tone: '#e0654f',
      role: 'Designed and built',
      one: 'The board I start every morning from, rebuilt while I am asleep.',
      what: 'The one thing on fire, the first move, a fourteen-day horizon, the live decisions, what ran overnight, and every project with where it stands.',
      how: 'One writer, and rerunning it self-heals. Every line carries a source, a gate hard-fails a missing row, a dead item is killed once so it can never come back, and a decision reached in conversation is not made until it is written down.',
      meta: ['Rebuilt each morning', 'One writer', 'Dashboard'] },

    { id: 'kit', n: 'The Claude OS Kit', tier: 'private', tone: '#9a8fb0',
      role: 'Written, designed and shipped',
      one: 'The system I run everything from, packaged four ways for four readers.',
      what: 'An enterprise build for a private equity firm with information barriers and four data classes; a three-file work-computer install; a beginner edition that asks one question at a time and never makes you type a file; and an advanced edition with the beginner layer cut out entirely.',
      how: 'The advanced edition builds through two layout gates that fail the build on any container overflow, because a document that overflows is a document nobody trusts.',
      meta: ['Four editions shipped', 'Documentation and design', 'Sent, not sold'] },

    { id: 'uni', n: 'A Personal University', tier: 'private', tone: '#c99a6a',
      role: 'Written and automated',
      one: 'Re-teaching myself a finished degree by writing the encyclopedia of it.',
      what: 'Three courses complete and live at forty-eight pages, a fourth building, written one course at a time by a job that runs daily.',
      how: 'No scores anywhere. The record pages became Assessments, the questions as a set with model answers, because explaining a thing properly is the only honest way to find out whether you understood it, and a grade is not that test.',
      meta: ['48 pages live', 'Fourth course building', 'Daily build'] },

    { id: 'music', n: 'The Listening Record', tier: 'private', tone: '#7fa89b',
      role: 'Built and analysed',
      one: 'Twelve years of listening, turned from raw rows into something you can question.',
      what: 'Twelve streaming exports covering 2015 to 2026, roughly eighty-three megabytes, rebuilt into 5,068 artists and 66,253 qualified plays.',
      how: 'Then used on itself: the record reorganised the library it came from, nine curated sets built and audited, each one verified by opening it rather than by trusting the write.',
      meta: ['5,068 artists', '66,253 qualified plays', 'Analysis'] },

    { id: 'fin', n: 'The Finance Desk', tier: 'private', tone: '#c2a15e',
      role: 'Modelled and written',
      one: 'A weekly letter that reports on my own money the way an analyst reports on somebody else\'s.',
      what: 'A tracker and a Monday-evening letter, with a monthly reconciliation folded into the first Monday of each month.',
      how: 'The interesting part is not the number, it is the gate: a ruling is not made until it is written, evidence is named and dated or it does not count, and no figure from it appears in public.',
      meta: ['Mondays', 'Decision gate', 'Modelling'] },

    { id: 'film', n: 'The Film Library', tier: 'private', tone: '#8fa6c4',
      role: 'Built',
      one: 'Everything worth watching, and an engine that decides what I watch tonight.',
      what: 'A shelf with a running top hundred.',
      how: 'The point of a library is that it answers. It reads the shelf and picks, rather than handing back a list to choose from.',
      meta: ['Self-running', 'Top 100', 'Collections'] },

    { id: 'read', n: 'The Reading Log', tier: 'private', tone: '#b08a5e',
      role: 'Built',
      one: 'Every book finished, so the year has a shape.',
      what: 'Shelved and counted.',
      how: 'A shape you can look at beats a vague sense that you have not been reading enough.',
      meta: ['Self-running', 'Collections'] }
  ];

  PROJECTS.forEach(function (p) { p.proof = P[p.id]; });

  root.MY = { PROJECTS: PROJECTS, proofs: P };
})(window);
