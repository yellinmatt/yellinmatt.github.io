/* screens.js — the drawn product screens and the device viewer.
   Facts trace to PROJECT-TRUTH.md. The Train screens are modelled on the
   running app measured 2026-08-02 at 390x844 across all four tabs in both
   colour schemes: its real tokens, its real four-tab bottom navigation, and
   its real Today / Lift / Cardio / Track compositions. Numbers inside are
   invented and the panel says so. */
(function (root) {
  "use strict";

  var I = {
    home: '<svg viewBox="0 0 24 24"><path d="M3 10.5 12 3l9 7.5"/><path d="M5.5 9.5V20h13V9.5"/></svg>',
    lift: '<svg viewBox="0 0 24 24"><path d="M4 9v6M7 7v10M17 7v10M20 9v6M7 12h10"/></svg>',
    run:  '<svg viewBox="0 0 24 24"><circle cx="15" cy="4.5" r="1.8"/><path d="M13 21l1.6-5.2-3-2.4.9-4.6 3.1 2.6 3.2.6M10.4 9.3 6.6 10.6 5 14"/></svg>',
    chart:'<svg viewBox="0 0 24 24"><path d="M4 20V4M4 20h16"/><path d="m7.5 15 3.5-4.5 3 2.5L20 6"/></svg>',
    gear: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M12 3v2.2M12 18.8V21M3 12h2.2M18.8 12H21M5.6 5.6l1.6 1.6M16.8 16.8l1.6 1.6M18.4 5.6l-1.6 1.6M7.2 16.8l-1.6 1.6"/></svg>',
    sync: '<svg viewBox="0 0 24 24"><path d="M20 11a8 8 0 0 0-14-4.5L4 9"/><path d="M4 13a8 8 0 0 0 14 4.5L20 15"/><path d="M4 5v4h4M20 19v-4h-4"/></svg>',
    plus: '<svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>',
    pen:  '<svg viewBox="0 0 24 24"><path d="M4 20h4L19 9a2.1 2.1 0 0 0-3-3L5 17v3Z"/></svg>',
    play: '<svg viewBox="0 0 24 24"><path d="M7 4.5 19 12 7 19.5Z"/></svg>'
  };

  function trNav(active) {
    var t = [['today', 'Today', I.home], ['lift', 'Lift', I.lift],
             ['cardio', 'Cardio', I.run], ['track', 'Track', I.chart]];
    return '<div class="nav" role="tablist">' + t.map(function (x) {
      return '<button type="button" role="tab" data-tr="' + x[0] + '"' +
        ' aria-selected="' + (x[0] === active ? 'true' : 'false') + '">' + x[2] + '<span>' + x[1] + '</span></button>';
    }).join('') + '</div>';
  }

  /* ---------------------------------------------------------- Train tabs */
  var TR = {};

  TR.today = '' +
    '<div class="scroll"><div class="top">' +
    '  <div class="eyebrow">Sunday, August 2</div>' +
    '  <div class="h1row"><h1>Morning</h1><div class="tools">' +
    '    <span class="streak"><b>18</b><span>days</span></span>' +
    '    <span class="ico">' + I.sync + '</span><span class="ico">' + I.gear + '</span></div></div></div>' +
    '<div class="card">' +
    '  <div class="cardtop"><span class="lbl">Today &middot; Day A</span><span class="edit">' + I.pen + 'Edit</span></div>' +
    '  <h2>Squat + Push</h2>' +
    '  <div class="sub"><b>7 exercises</b> &middot; bodyweight and bands &middot; ~30 min</div>' +
    '  <div class="cta">' + I.play + 'Start workout</div>' +
    '  <div class="div">Or make it a session</div>' +
    '  <div class="vid"><span class="play">' + I.play + '</span><div style="min-width:0">' +
    '    <div class="t">Sunrise Yoga, 15 Minute Mor&hellip;</div><div class="c">Yoga With Adriene &middot; 15m</div></div></div>' +
    '  <div class="split">' +
    '    <div><span class="ringlite">4</span><div><span class="lbl">Lift</span>' +
    '      <div style="font-size:12px;font-weight:700">Building</div><span class="chip">BASE</span></div></div>' +
    '    <div><span class="ringlite">3</span><div><span class="lbl">Cardio</span>' +
    '      <div style="font-size:12px;font-weight:700">Steady</div><span class="chip">BASE</span></div></div></div>' +
    '  <div class="sore"><span class="dot on"></span>Low back, 2 days left<span class="ch">&rsaquo;</span></div>' +
    '</div>' +
    '<div class="anchor"><span>Morning anchor</span><b>3 of 4</b></div>' +
    '<div class="week">' +
    ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'].map(function (d, i) {
      var done = [1, 0, 1, 1, 0, 1, 0][i], nm = ['Lift', 'Walk', 'Run', 'Lift', 'Rest', 'Run', 'Lift'][i];
      return '<div><div class="d">' + d + '</div><div class="r' + (done ? ' done' : '') + '">' + (done ? '&check;' : '') +
        '</div><div class="n' + (i === 6 ? ' on' : '') + '">' + nm + '</div></div>';
    }).join('') + '</div></div>' + trNav('today');

  TR.lift = '' +
    '<div class="scroll"><div class="top">' +
    '  <div class="eyebrow">Day A next &middot; bodyweight and bands</div>' +
    '  <div class="h1row"><h1>Lift</h1><div class="tools">' +
    '    <span class="streak"><b>6</b><span>weeks</span></span><span class="ico">' + I.gear + '</span></div></div></div>' +
    '<div class="card">' +
    '  <div class="big"><span class="ring" style="--p:64%"><span>4</span></span>' +
    '    <div><span class="lbl">Level 4 <span class="chip" style="margin-left:4px">BASE</span></span>' +
    '      <h2 style="margin:4px 0 3px">Building</h2>' +
    '      <div class="sub"><b>3 more sessions</b> and your level starts moving</div></div></div>' +
    '  <div class="div" style="margin-bottom:0">The rotation</div>' +
    '  <div class="rot"><div class="on">Day A</div><div>Day B</div><div>Day C</div></div>' +
    '  <h2>Squat + Push</h2>' +
    '  <div class="sub"><b>7 movements</b> &middot; bodyweight and bands</div>' +
    '  <div class="cta">' + I.play + 'Start workout</div>' +
    '  <div class="btn2"><span>Change kit</span><span>Build custom</span></div></div>' +
    '<div class="lvl"><span>Where the lift level comes from</span><b>Level 4</b></div>' +
    '<div class="lvl"><span>The rotation</span><b>Squat + Push next</b></div>' +
    '<div class="lvl"><span>Your sessions</span><b>Day A &middot; 7 to train</b></div></div>' + trNav('lift');

  TR.cardio = '' +
    '<div class="scroll"><div class="top">' +
    '  <div class="eyebrow">Level 3 &middot; steady</div>' +
    '  <div class="h1row"><h1>Cardio</h1><div class="tools">' +
    '    <span class="streak"><b>9</b><span>weeks</span></span><span class="ico">' + I.gear + '</span></div></div></div>' +
    '<div class="card">' +
    '  <div class="big"><span class="ring" style="--p:48%"><span>3</span></span>' +
    '    <div><span class="lbl">Level 3 <span class="chip" style="margin-left:4px">BASE</span></span>' +
    '      <h2 style="margin:4px 0 3px">Steady</h2>' +
    '      <div class="sub">31 runs on record</div></div></div>' +
    '  <div class="metric"><div class="lbl">This week</div>' +
    '    <div class="k" style="margin-top:7px">Miles run</div><div class="v">9.4<i> mi</i></div>' +
    '    <div class="track" style="--w:74%"><i></i></div>' +
    '    <div class="say">ahead of your usual<em>best twelve weeks: 12.6 mi</em></div></div>' +
    '  <div class="metric"><div class="lbl">Next run</div>' +
    '    <h2 style="margin:4px 0 3px">Easy &middot; 3 mi</h2>' +
    '    <div class="sub">Conversational the whole way. If it is not easy it is not this run.</div>' +
    '    <div class="cta">' + I.run + 'Start a run</div>' +
    '    <div class="btn2"><span>Log a run</span><span>Log a walk</span></div></div></div>' +
    '<div class="lvl"><span>Where the level comes from</span><b>Level 3</b></div>' +
    '<div class="lvl"><span>Pace zones</span><b>Easy 10:40 &ndash; 11:30</b></div></div>' + trNav('cardio');

  TR.track = '' +
    '<div class="scroll"><div class="top">' +
    '  <div class="eyebrow">Body &amp; metrics</div>' +
    '  <div class="h1row"><h1>Track</h1><div class="tools">' +
    '    <span class="ico">' + I.plus + '</span><span class="ico">' + I.gear + '</span></div></div></div>' +
    '<div class="card">' +
    '  <div class="lbl">This week</div>' +
    '  <div class="tiles">' +
    '    <div><div class="v">7h 12m</div><div class="k">Sleep</div><div class="s">7-night median</div></div>' +
    '    <div><div class="v">8,940</div><div class="k">Steps</div><div class="s">daily median</div></div>' +
    '    <div><div class="v">2,410</div><div class="k">Calories</div><div class="s">median</div></div>' +
    '    <div><div class="v">54</div><div class="k">Resting HR</div><div class="s">bpm</div></div>' +
    '    <div><div class="v">24.1</div><div class="k">BMI</div><div class="s">&nbsp;</div></div>' +
    '    <div><div class="v">9.4</div><div class="k">Miles run</div><div class="s">this week</div></div></div>' +
    '  <div class="btn2" style="margin-top:11px"><span style="flex:1">Log a weigh-in</span></div></div>' +
    '<div class="card">' +
    '  <div class="lbl">Against your own previous seven days</div>' +
    '  <div class="lrow">Strength sessions<span>4</span></div><div class="say"><em>more than last week</em></div>' +
    '  <div class="lrow">Days moved<span>6</span></div><div class="say"><em>right at your usual</em></div>' +
    '  <div class="lrow">Protein days<span>5</span></div><div class="say"><em>more than last week</em></div>' +
    '  <div class="lrow">Miles run<span>9.4<i style="font-style:normal;font-size:11px"> mi</i></span></div>' +
    '  <div class="say"><em>ahead of your usual</em></div></div></div>' + trNav('track');

  /* ------------------------------------------------------------- screens */
  var S = {};
  function phoneOnly(html) { return { phone: html, web: null }; }

  S.train = {
    phone: '<div class="tr" data-trapp>' + TR.today + '</div>',
    web: '<div class="web dark" style="background:#F5F6F8;color:#0E1116;font-family:-apple-system,BlinkMacSystemFont,system-ui,sans-serif;padding:34px 0">' +
      '<div style="max-width:540px;margin:0 auto;padding:0 16px"><div class="tr" style="position:static;background:none">' +
      TR.today.replace('<div class="scroll">', '<div class="scroll" style="padding:0;overflow:visible">').replace(trNav('today'), '') +
      '</div></div></div>',
    note: 'The app is phone-first. In a browser it is the same PWA in a 540px column.'
  };

  S.brief = {
    web: '<div class="web">' +
      '<div class="wmast"><div class="wm">The Morning Brief</div>' +
      '<div class="mm">Vol. I &middot; No. 75 &middot; Sunday &middot; ~16 min read</div></div>' +
      '<p class="wintro">A week that began with a data centre and ended with a phone call talking a president out of a war.</p>' +
      '<div class="wcover"><div class="cin"><div class="ck">The Splash &middot; Washington and Riyadh &middot; cross-spectrum</div>' +
      '<div class="ch">Trump calls off the Iran strikes after a phone call from Riyadh</div></div></div>' +
      '<p class="wp">President Trump said late Saturday that the United States would hold off on new strikes against Iran, hours after Saudi Crown Prince <span class="went">Mohammed bin Salman</span> telephoned him to argue against them. A Gulf client state exercised a veto over its patron&rsquo;s war plan by pointing at its own refineries.</p>' +
      '<div class="wnote"><span class="nl">Why it matters</span>The constraint that finally bit came from a foreign sovereign protecting its own balance sheet, not from American politics. Worth remembering the next time anyone models sanctions risk.</div>' +
      '<div class="wnote"><span class="nl">Framing note</span>The same facts split cleanly. The <i>New York Times</i> ran &ldquo;the U.S. Appears Headed for a Strategic Defeat&rdquo; and the <i>Guardian</i> called it a &ldquo;climbdown,&rdquo; while <i>Fox News</i> led with a former CENTCOM deputy describing Iran as &ldquo;desperate.&rdquo;</div>' +
      '<p class="wsrc">Source: The Guardian &middot; Also reported by AP, BBC, NYT, CBS News, Times of Israel</p>' +
      '<div class="wgrid">' +
      '<div class="wc"><b>Brussels can start fining the AI labs</b><span>Two regulators acquire teeth today, at 7 percent of worldwide turnover.</span></div>' +
      '<div class="wc"><b>The Senate fails a war powers vote 49 to 50</b><span>One absence decided it.</span></div>' +
      '<div class="wc"><b>Nvidia underwrites a data centre</b><span>The vendor is now the lender.</span></div></div></div>'
  };

  S.versed = {
    web: '<div class="web">' +
      '<div class="wmast" style="border-bottom-color:#7d5a3c"><div class="wm">Well-Versed</div>' +
      '<div class="mm">2026-07-04 &middot; The Animal World &middot; Lesson kept</div></div>' +
      '<p class="wkick" style="color:#7d5a3c;text-align:center">The predator that came back</p>' +
      '<h2 class="wh" style="text-align:center;font-size:44px;margin-bottom:18px">The Wolf</h2>' +
      '<div class="wcover" style="height:170px;background:linear-gradient(150deg,#4c5548,#242a24 60%,#39412f)"></div>' +
      '<p class="wp">In the winter of 1995, wildlife officers carried wolves into Yellowstone in wooden crates. The last one born in the park had been shot in 1926, and for seventy years the country&rsquo;s oldest national park held elk and bison and grizzlies but no wolves.</p>' +
      '<div class="wnote" style="border-left-color:#7d5a3c"><span class="nl" style="color:#7d5a3c">The correction</span>Almost everything the phrase &ldquo;alpha wolf&rdquo; suggests is wrong. It goes back to a 1947 study of strangers penned together behind a fence, who behaved like strangers penned together. Mech eventually asked his publisher to stop reprinting the book.</div>' +
      '<div class="wnote" style="border-left-color:#7d5a3c"><span class="nl" style="color:#7d5a3c">And then it argues with itself</span>&ldquo;It is a beautiful story, and it is almost certainly too clean.&rdquo; The lesson tells the trophic-cascade parable in full, then spends its last section dismantling it.</div>' +
      '<p class="wsrc">Learn more &middot; National Park Service &middot; Scientific American &middot; U.S. Fish &amp; Wildlife &middot; Natural History Museum</p></div>'
  };

  S.deal = {
    web: '<div class="web">' +
      '<div class="wmast" style="border-bottom-color:#8a6a34"><div class="wm">Dealcraft</div>' +
      '<div class="mm">A two-year daily curriculum &middot; Lesson 016</div></div>' +
      '<div class="wgrid" style="margin-top:0;margin-bottom:22px">' +
      '<div class="wc"><b>Encyclopedia</b><span>The concepts, defined once and linked from everywhere.</span></div>' +
      '<div class="wc"><b>Toolkit</b><span>Four tracks, thirty-five cards, the moves themselves.</span></div>' +
      '<div class="wc"><b>Deal Breakdowns</b><span>Real transactions taken apart clause by clause.</span></div></div>' +
      '<p class="wkick" style="color:#8a6a34">Deal Breakdown &middot; 002</p>' +
      '<h2 class="wh">Boeing / KLX &middot; the indemnity, line by line</h2>' +
      '<p class="wp">Taught in the order a deal actually runs, not the order a casebook lists them. Sixteen lessons published between 6 July and 23 July, two complete rotations through the six tracks plus a partial third, with cycle digests and spaced-repetition decks at each turn.</p>' +
      '<div class="wnote" style="border-left-color:#8a6a34"><span class="nl" style="color:#8a6a34">The rotation</span>B &rarr; C &rarr; A &rarr; E &rarr; D &rarr; F, then again. Each cycle closes with a digest and an Anki deck so nothing published is left un-revisited.</div></div>'
  };

  S.bits = {
    web: '<div class="web">' +
      '<div class="wmast" style="border-bottom-color:#4a6f8c"><div class="wm">Greatest Bits</div>' +
      '<div class="mm">459 comics &middot; catalogued by comic and by bit</div></div>' +
      '<p class="wintro">The stand-up worth keeping, and the sketch worth keeping with it.</p>' +
      '<div class="wgrid">' +
      ['Richard Pryor', 'George Carlin', 'Tim Conway', 'Carol Burnett', 'Phil Hartman', 'John Mulaney',
       'Chris Farley', 'Kristen Wiig', 'Sid Caesar'].map(function (n, i) {
        return '<div class="wc"><b>' + n + '</b><span>' + [5, 8, 5, 6, 7, 9, 4, 6, 3][i] + ' bits &middot; verified embeds</span></div>';
      }).join('') + '</div>' +
      '<div class="wnote" style="border-left-color:#4a6f8c;margin-top:20px"><span class="nl" style="color:#4a6f8c">The auditor</span>A standing read-only sweep checks the whole archive for empty profiles, dead embeds, missing photographs and duplicates, so the catalogue degrades loudly instead of silently.</div></div>'
  };

  S.desk = {
    web: '<div class="web dark">' +
      '<div class="bmast"><b>The Desk</b><span>Rebuilt before the day starts</span></div>' +
      '<div class="bband">' +
      '<div class="bcard fire"><div class="bk">On fire</div><div class="bv">Externship close-out, three forms, Wednesday</div><div class="bs">src: Reminders</div></div>' +
      '<div class="bcard"><div class="bk">First move</div><div class="bv">Email the supervising attorney before the day starts</div><div class="bs">src: PROJECTS.md</div></div></div>' +
      '<div class="bcols">' +
      '<div><div class="bk">Horizon &middot; 14 days</div>' +
      '<div class="brow"><span>OCI bids close</span><span class="st">Aug 17</span></div>' +
      '<div class="brow"><span>Fall term opens</span><span class="st">Aug 17</span></div>' +
      '<div class="brow"><span>Orientation</span><span class="st">Aug 21</span></div></div>' +
      '<div><div class="bk">What ran overnight</div>' +
      '<div class="brow"><span>The Morning Brief</span><span class="st">6:04</span></div>' +
      '<div class="brow"><span>Well-Versed</span><span class="st">6:14</span></div>' +
      '<div class="brow"><span>This board</span><span class="st">early</span></div></div>' +
      '<div><div class="bk">Live decisions</div>' +
      '<div class="brow"><span>No metric you can fail</span><span class="st">held</span></div>' +
      '<div class="brow"><span>One writer per number</span><span class="st">held</span></div>' +
      '<div class="brow"><span>A gate before a claim</span><span class="st">held</span></div></div></div>' +
      '<div style="margin-top:22px"><div class="bk">The sweep</div>' +
      ['Train', 'The Morning Brief', 'Dealcraft', 'A Personal University', 'The Listening Record'].map(function (n, i) {
        return '<div class="brow"><span>' + n + '</span><span class="st">' +
          ['maintaining', 'live', 'building', 'building', 'building'][i] + '</span><span class="dots">' +
          ['●●●●●', '●●●●●', '●●●●○', '●●●○○', '●●●○○'][i] + '</span></div>';
      }).join('') + '</div></div>'
  };

  S.kit = {
    web: '<div class="web dark">' +
      '<div class="bmast"><b>The Claude OS Kit</b><span>Four editions shipped</span></div>' +
      '<div class="bcols">' +
      '<div class="bcard"><div class="bk">Enterprise</div><div class="bv">Information barriers</div>' +
      '<div class="bs">16-slide deck &middot; 16-page handbook &middot; four data classes &middot; per-person caches over shared firm memory</div></div>' +
      '<div class="bcard"><div class="bk">Work account</div><div class="bv">Three files</div>' +
      '<div class="bs">Cost and consequence gates &middot; a worklog memory model &middot; paste and go</div></div>' +
      '<div class="bcard"><div class="bk">Beginner</div><div class="bv">One question at a time</div>' +
      '<div class="bs">Plain-language orientation &middot; a phased runbook that never makes her type a file</div></div></div>' +
      '<div class="bcard" style="margin-top:16px"><div class="bk">Advanced</div>' +
      '<div class="bv">The beginner layer cut out entirely</div>' +
      '<div class="bs">An 11 &times; 8.5 one-page PDF, a 20-slide deck and a self-contained offline HTML reference, built through two layout gates that fail the build on any container overflow.</div></div></div>'
  };

  S.uni = {
    web: '<div class="web dark">' +
      '<div class="bmast"><b>A Personal University</b><span>48 pages live &middot; a fourth course building</span></div>' +
      '<div class="bbars">' +
      '<div class="bbar"><span>Microeconomics</span><i style="--w:100%"></i><em>15 pages</em></div>' +
      '<div class="bbar"><span>Corporate finance</span><i style="--w:87%"></i><em>13 pages</em></div>' +
      '<div class="bbar"><span>Philosophy, politics and economics</span><i style="--w:100%"></i><em>20 pages</em></div>' +
      '<div class="bbar"><span>Organisational behaviour</span><i style="--w:27%"></i><em>3 of 11</em></div></div>' +
      '<div class="bcard" style="margin-top:20px"><div class="bk">The rule</div>' +
      '<div class="bv">No scores anywhere</div>' +
      '<div class="bs">The record pages became Assessments, the questions as a set with model answers, because explaining a thing properly is the only honest way to find out whether you understood it, and a grade is not that test.</div></div></div>'
  };

  S.music = {
    web: '<div class="web dark">' +
      '<div class="bmast"><b>The Listening Record</b><span>2015 &rarr; 2026</span></div>' +
      '<div class="bcols">' +
      '<div><div class="bfig">5,068</div><div class="bfigk">artists</div></div>' +
      '<div><div class="bfig">66,253</div><div class="bfigk">qualified plays</div></div>' +
      '<div><div class="bfig">12</div><div class="bfigk">raw exports, 83 MB</div></div></div>' +
      '<div class="bspark">' + [14, 19, 12, 26, 31, 22, 38, 29, 41, 35, 47, 30, 25, 44, 52, 38, 33, 49, 41, 28, 36, 55, 44, 31, 47, 39, 52, 35, 43, 58, 46, 33, 41, 50, 37, 44].map(function (h) {
        return '<i style="--h:' + (h * 1.55) + '%"></i>';
      }).join('') + '</div>' +
      '<div class="bcard" style="margin-top:18px"><div class="bk">Then used on itself</div>' +
      '<div class="bv">The record reorganised the library it came from</div>' +
      '<div class="bs">Nine curated sets built and audited, each one verified by opening it rather than by trusting the write.</div></div></div>'
  };

  S.fin = {
    web: '<div class="web dark">' +
      '<div class="bmast"><b>The Finance Desk</b><span>The letter, every Monday</span></div>' +
      '<div class="bcard fire"><div class="bk">The decision gate</div>' +
      '<div class="bv">A ruling is not made until it is written</div></div>' +
      '<div class="bcols" style="margin-top:16px">' +
      '<div class="bcard"><div class="bk">Question</div><div class="bv">Does this change the allocation?</div></div>' +
      '<div class="bcard"><div class="bk">Evidence</div><div class="bv">Named and dated, or it does not count</div></div>' +
      '<div class="bcard"><div class="bk">Ruling</div><div class="bv">Written to a surface, or it never happened</div></div></div>' +
      '<div class="bcard" style="margin-top:16px"><div class="bs">A tracker and a weekly letter that report on my own money the way an analyst would report on somebody else&rsquo;s, which turns out to be the only way I will read it. <b style="color:#eceadf">No figures appear here and none ever will.</b></div></div></div>'
  };

  S.film = {
    web: '<div class="web dark">' +
      '<div class="bmast"><b>The Film Library</b><span>Top 100, running</span></div>' +
      '<div class="bstrip">' + Array.apply(null, Array(16)).map(function () { return '<i></i>'; }).join('') + '</div>' +
      '<div class="bcard" style="margin-top:20px"><div class="bk">The pick-me engine</div>' +
      '<div class="bv">The point of a library is that it answers</div>' +
      '<div class="bs">It reads the shelf and decides what I am watching tonight, rather than handing back a list to choose from.</div></div></div>'
  };

  S.read = {
    web: '<div class="web dark">' +
      '<div class="bmast"><b>The Reading Log</b><span>Shelved and counted</span></div>' +
      '<div class="bshelf">' + Array.apply(null, Array(34)).map(function (_, i) {
        return '<i style="--h:' + (66 + ((i * 37) % 46)) + 'px;--w:' + (9 + ((i * 13) % 11)) + 'px"></i>';
      }).join('') + '</div>' +
      '<div class="bcard" style="margin-top:20px"><div class="bk">Why</div>' +
      '<div class="bv">So the year has a shape</div>' +
      '<div class="bs">A shape you can look at beats a vague sense that you have not been reading enough.</div></div></div>'
  };

  /* ------------------------------------------------------- device viewer */
  function viewer(id, tone, kind) {
    var s = S[id] || {};
    var hasPhone = !!s.phone, hasWeb = !!s.web;
    var first = hasPhone ? 'phone' : 'web';
    return '<div class="dv" data-dv="' + id + '" style="--tone:' + tone + '">' +
      '<div class="dv-bar"><div class="seg">' +
      '<button type="button" data-m="phone" aria-pressed="' + (first === 'phone') + '"' + (hasPhone ? '' : ' disabled') + '>' +
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="7" y="2.5" width="10" height="19" rx="2.6"/><path d="M10.6 5.2h2.8"/></svg>iPhone</button>' +
      '<button type="button" data-m="web" aria-pressed="' + (first === 'web') + '"' + (hasWeb ? '' : ' disabled') + '>' +
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="2.5" y="4" width="19" height="14" rx="2"/><path d="M2.5 8h19M8 21h8"/></svg>Browser</button>' +
      '</div><span class="cap">' + (kind || 'Sample data') + '</span></div>' +
      '<div class="dv-stage">' +
      (hasPhone ? '<div class="dv-view' + (first === 'phone' ? ' on' : '') + '" data-v="phone">' +
        '<div class="iphone"><span class="side"></span><div class="glass"><span class="island"></span>' +
        s.phone + '<span class="home"></span></div></div></div>' : '') +
      (hasWeb ? '<div class="dv-view' + (first === 'web' ? ' on' : '') + '" data-v="web">' +
        '<div class="browser"><div class="chrome"><span class="lights"><i></i><i></i><i></i></span>' +
        '<span class="url">' + (s.url || 'mattyellin.com') + '</span></div>' +
        '<div class="pane">' + s.web + '</div></div></div>' : '') +
      '</div>' + (s.note ? '<p class="dv-note">' + s.note + '</p>' : '') + '</div>';
  }

  /* Scale the 1440px drawn page down into whatever the browser pane is. The
     page is rendered at full desktop width and then transformed, so the type
     inside keeps its real proportions instead of being re-laid-out narrow. */
  function fitWeb(scope) {
    (scope || document).querySelectorAll('.browser .pane').forEach(function (pane) {
      var page = pane.firstElementChild;
      if (!page) return;
      var w = pane.clientWidth;
      if (!w) return;
      var s = w / 1440;
      page.style.transform = 'scale(' + s.toFixed(4) + ')';
      /* A fixed 16:10 pane leaves a band of raw white under any page that is
         shorter than the frame, which reads as a broken screenshot. Measure
         the page and let the window take its height, capped so a long page
         crops the way a real viewport does. */
      var h = page.scrollHeight * s;
      pane.style.height = Math.round(Math.min(h, w * 0.68)) + 'px';
    });
    /* Same treatment for the phone: the app is authored at a true 390 and
       scaled into whatever the frame is, so its fixed pixel type keeps the
       proportions of the running build instead of overflowing its cards. */
    (scope || document).querySelectorAll('.iphone .glass').forEach(function (g) {
      var app = g.querySelector('.tr');
      if (!app) return;
      var w = g.clientWidth;
      if (!w) return;
      app.style.transform = 'scale(' + (w / 390).toFixed(4) + ')';
    });
  }

  function wire(scope) {
    (scope || document).querySelectorAll('.dv').forEach(function (dv) {
      if (dv._wired) return; dv._wired = true;
      dv.querySelectorAll('.dv-bar button').forEach(function (b) {
        b.addEventListener('click', function () {
          if (b.disabled) return;
          var m = b.getAttribute('data-m');
          dv.querySelectorAll('.dv-bar button').forEach(function (o) {
            o.setAttribute('aria-pressed', String(o === b));
          });
          dv.querySelectorAll('.dv-view').forEach(function (v) {
            v.classList.toggle('on', v.getAttribute('data-v') === m);
          });
          fitWeb(dv);
        });
      });
    });
    /* The Train phone's own bottom navigation works. */
    (scope || document).querySelectorAll('[data-trapp]').forEach(function (app) {
      if (app._wired) return; app._wired = true;
      app.addEventListener('click', function (e) {
        var b = e.target.closest('.nav button[data-tr]'); if (!b) return;
        var tab = b.getAttribute('data-tr');
        if (!TR[tab]) return;
        app.innerHTML = TR[tab];
        fitWeb(app.closest('.dv') || document);
      });
    });
  }

  root.MYS = { screens: S, viewer: viewer, wire: wire, fitWeb: fitWeb, TR: TR };
})(window);
