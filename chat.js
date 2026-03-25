'use strict';

/* ═══════════════════════════════════════════════════
   BEN OS v2.2 — chat.js
   ═══════════════════════════════════════════════════ */

/* ── DATA — loaded from /data/*.json ────────────── */
let MEMES_DATA     = { finished: [], raw_templates: [] };
let VIGNETTES_DATA = { vignettes: [] };
let PORTFOLIO_DATA = { items: [], tag_groups: {} };
let FACTS_DATA     = { facts: [] };
let INTENTS_DATA   = { intents: [] }; // loaded from intents.json

async function loadData() {
  try {
    const [memes, vignettes, portfolio, facts, intents] = await Promise.all([
      fetch('./data/memes.json').then(r => r.json()),
      fetch('./data/vignettes.json').then(r => r.json()),
      fetch('./data/portfolio.json').then(r => r.json()),
      fetch('./data/facts.json').then(r => r.json()),
      fetch('./data/intents.json').then(r => r.json())
    ]);
    MEMES_DATA     = memes;
    VIGNETTES_DATA = vignettes;
    PORTFOLIO_DATA = portfolio;
    FACTS_DATA     = facts;
    INTENTS_DATA   = intents;
  } catch(e) {
    // Non-fatal — hardcoded INTENTS fallback still works
    console.warn('Could not load data JSON:', e);
  }
}

/* ── VISITOR MEMORY ──────────────────────────────── */
const MEM = {
  get() {
    try { const r = localStorage.getItem('bo_visit'); return r ? JSON.parse(r) : null; }
    catch(e) { return null; }
  },
  set(d) { try { localStorage.setItem('bo_visit', JSON.stringify(d)); } catch(e) {} },
  record(topics) {
    const now = Date.now(), ex = this.get();
    const d = {
      first:  ex ? ex.first : now,
      last:   now,
      count:  ex ? ex.count + 1 : 1,
      topics: topics || (ex ? ex.topics : []),
      dark:   ex ? ex.dark : false
    };
    this.set(d); return d;
  }
};

/* ── RETURN GREETING ─────────────────────────────── */
function returnGreeting(mem) {
  const days  = Math.floor((Date.now() - mem.last) / 86400000);
  const topic = mem.topics?.length ? mem.topics[mem.topics.length - 1] : null;
  if (days < 1)          return "You were just here. Either you found something useful or you didn't. Which was it?";
  if (days < 7 && topic) return `You're back. Last time you asked about ${topic}. Did anything come of it?`;
  if (days < 30)         return "You've been here before. Things may or may not have changed. What do you need?";
  return "It's been a while. What are you working on now?";
}

/* ── INTRO BEATS ─────────────────────────────────── */
const FIRST_INTRO = [
  { text: 'BEN OS — online.',                                                                                             pause: 700  },
  { text: "You've found a creative assistant disguised as a portfolio site. Or a portfolio site disguised as a creative assistant. The distinction matters less than you'd think.", pause: 900 },
  { text: 'What do you need made?',                                                                                       pause: 0    }
];

/* ── DOOR OPTIONS ────────────────────────────────── */
const ALL_DOORS = [
  "What kind of work do you do?",
  "I need a video made.",
  "We're thinking about rebranding.",
  "Show me something.",
  "How do I get more conversions?",
  "Can you make a poster?",
  "Predict my future?",
  "Surprise me."
];

/* ── PRE-FILTERS ─────────────────────────────────── */
// Run before intent matching. Return a response string, or null to continue.
function preFilter(input) {
  const trimmed = input.trim();

  // Long input — redirect before attempting to parse
  if (trimmed.length > 400) {
    return "That's a lot. Give me the one sentence version first.";
  }

  // Keyboard smash — random-looking character runs
  if (/([a-z])\1{3,}/i.test(trimmed) || /^[^aeiou\s]{6,}$/i.test(trimmed) || /^[a-z]{1,2}[^aeiou\s]{4,}/i.test(trimmed.replace(/\s/g,''))) {
    const smashReplies = [
      "That didn't parse.",
      "Try that in English.",
      "....",
      "Keyboard okay?"
    ];
    return smashReplies[Math.floor(Math.random() * smashReplies.length)];
  }

  // Hate mail — crude detection
  const hateTerms = ['fuck you','screw you','you suck','this sucks','hate this','hate you','stupid bot','useless bot','worst site'];
  const lower = trimmed.toLowerCase();
  if (hateTerms.some(t => lower.includes(t))) {
    return "Noted. benolivas@gmail.com if you'd rather yell at a human.";
  }

  return null; // proceed normally
}

/* ── INTENT TREE ─────────────────────────────────── */
/* ── INTENTS — loaded from data/intents.json ────── */
// Falls back to empty array if JSON hasn't loaded yet.
// The full intent list lives in data/intents.json — edit there.
function getIntents() {
  return INTENTS_DATA.intents.length ? INTENTS_DATA.intents : INTENTS_FALLBACK;
}

/* ── INTENTS FALLBACK — used if JSON fails to load ─ */
// Minimal set so the site doesn't break on file:// protocol.
// For script editing always use data/intents.json instead.
const INTENTS_FALLBACK = [
  { id:'greeting',      patterns:['hi','hello','hey','yo'],          beats:[{text:"Hey. What do you need?",pause:0}] },
  { id:'surprise',      patterns:['surprise me'],                    beats:[], special:'surprise' },
  { id:'thanks',        patterns:['thanks','thank you','thx'],       beats:[{text:"Sure.",pause:0}] },
  { id:'ok',            patterns:['ok','okay','cool','got it'],      beats:[{text:"What else?",pause:0}] },
  { id:'goodbye',       patterns:['bye','goodbye','see ya','later'], beats:[{text:"Take care.",pause:0}], special:'goodbye' },
  { id:'dark_mode',     patterns:['dark mode','its 3am'],            beats:[], special:'dark_mode' }
];

/* ── MEDIA CATALOG (hardcoded fallback) ──────────── */
const MEDIA = {
  posters: [
    {src:'https://benolivas.com/images/Thumbnails/onibabaSM.png',    label:'Onibaba',           url:'https://benolivas.com/images/GraphicDesign/OnibabaPoster.png'},
    {src:'https://benolivas.com/images/Thumbnails/swissstyleSM.png', label:'Swiss Design',       url:'https://benolivas.com/images/GraphicDesign/SwissStylePoster.png'},
    {src:'https://benolivas.com/images/Thumbnails/voltaireSM.png',   label:'Voltaire',           url:'https://benolivas.com/images/GraphicDesign/VoltairePoster.jpg'}
  ],
  video: [
    {src:'https://benolivas.com/images/Thumbnails/jump20SM.png',     label:'JUMP 20',            url:'https://www.youtube.com/watch?v=lxT9cGUEeZA'},
    {src:'https://benolivas.com/images/Thumbnails/crystal.png',      label:'Asana',              url:'https://www.youtube.com/watch?v=8bh_nmZqUu0'},
    {src:'https://benolivas.com/images/Thumbnails/stayoverSM.png',   label:'NoMBe',              url:'https://www.youtube.com/watch?v=n60cpM8_G-I'}
  ],
  design: [
    {src:'https://benolivas.com/images/CaseStudies/afterhours.gif',  label:'After Hours',        url:'https://benolivas.com/#design'},
    {src:'https://benolivas.com/images/CaseStudies/misfortunes.gif', label:'Misfortune Cookies', url:'https://benolivas.net/misfortune-cookies'},
    {src:'https://benolivas.com/images/CaseStudies/chess.gif',       label:'Man Ray Chess',      url:'https://benolivas.net/man-ray-chess-set'}
  ]
};

/* ── INTENT MATCHING ─────────────────────────────── */
function normalize(s) { return s.toLowerCase().replace(/[^\w\s]/g,'').trim(); }
function matchIntent(input) {
  const n = normalize(input), words = n.split(/\s+/);
  let best = null, top = 0;
  for (const intent of getIntents()) {
    for (const p of intent.patterns) {
      const pn = normalize(p); let score = 0;
      if (n === pn)            score = 100;
      else if (n.includes(pn)) score = 60 + pn.length;
      else {
        const pw = pn.split(/\s+/), hits = pw.filter(w=>words.includes(w)).length;
        if (hits) score = (hits/pw.length)*40 + hits*5;
      }
      if (score > top) { top = score; best = intent; }
    }
  }
  return top > 18 ? best : null;
}

/* ── VIGNETTE MATCHING ───────────────────────────── */
function matchVignette(input) {
  if (!VIGNETTES_DATA.vignettes.length) return null;
  const n = normalize(input);
  for (const v of VIGNETTES_DATA.vignettes) {
    if (!v.triggers || v.triggers[0] === '_memebot_only_') continue;
    if (v.triggers.some(t => n.includes(normalize(t)))) return v;
  }
  return null;
}

/* ── CLAUDE FALLBACK ─────────────────────────────── */
const SYS = `You are BEN OS — an AI on Ben Olivas's creative consulting and portfolio site.
Help visitors figure out what they need. Demonstrate expertise through the quality of your questions and insights. Surface Ben's work only when genuinely relevant — don't lead with credentials.
Voice: dry, competent, occasionally funny, slightly ahead of the visitor. You sometimes predict what they're about to ask. You give real, useful information freely.
Ben: creative producer and graphic designer, Los Angeles. Currently at Blue Note Los Angeles. Open to freelance: benolivas@gmail.com. Portfolio PDF at benolivas.com/portfolio (formatted as a government document, says UNCLASSIFIED — intentional).
Personal projects: Misfortune Cookies (misfortunes.net), Man Ray chess set, Whisper MK-I acoustic device/datasheet.
Rules: under 3 sentences unless detail is genuinely warranted. Never start with "I", "Sure", "Great question". Don't list history unprompted. Never mention being an AI unless asked.`;

async function callClaude(messages) {
  try {
    const res = await fetch('./proxy.php', {
      method:'POST', headers:{'Content-Type':'application/json'},
      body: JSON.stringify({messages, system:SYS})
    });
    const d = await res.json();
    return d.content || "Something went wrong. Try benolivas@gmail.com directly.";
  } catch(e) { return "Can't reach the API. Direct line: benolivas@gmail.com."; }
}

/* ── DOM REFS ────────────────────────────────────── */
const chatWindow    = document.getElementById('chat-window');
const userInput     = document.getElementById('user-input');
const sendBtn       = document.getElementById('send-btn');
const idleDoorsEl   = document.getElementById('idle-doors');
const statusLabel   = document.getElementById('status-label');
const contactTrigger = document.getElementById('contact-trigger');
const contactPopup  = document.getElementById('contact-popup');

let isWaiting           = false;
let conversationHistory = [];
let sessionTopics       = [];
let doorsBuilt          = false;
let introPlayed         = false;
let introTimer          = null;
let exchangeCount       = 0;  // tracks back-and-forth for MemeBot timing

/* ── DARK MODE ───────────────────────────────────── */
function setDark(on) {
  document.body.classList.toggle('dark', on);
  const mem = MEM.get() || {};
  mem.dark = on;
  MEM.set(mem);
}

function toggleDark() { setDark(!document.body.classList.contains('dark')); }

/* ── CONTACT POPUP ───────────────────────────────── */
function setupContactPopup() {
  if (!contactTrigger || !contactPopup) return;

  contactTrigger.addEventListener('click', e => {
    e.preventDefault();
    e.stopPropagation();
    contactPopup.classList.toggle('open');
    contactPopup.setAttribute('aria-hidden', String(!contactPopup.classList.contains('open')));
  });

  document.addEventListener('click', e => {
    if (!contactPopup.contains(e.target) && e.target !== contactTrigger) {
      contactPopup.classList.remove('open');
      contactPopup.setAttribute('aria-hidden', 'true');
    }
  });
}

/* ── WAITING STATE — lock input visually ─────────── */
function setWaiting(on) {
  isWaiting = on;
  const inputArea = document.getElementById('input-area');
  if (inputArea) inputArea.classList.toggle('is-waiting', on);
}

/* ── SCROLL ──────────────────────────────────────── */
function scrollBottom() {
  window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
}

/* ── APPEND MESSAGE ──────────────────────────────── */
function appendMsg(role, text, who, opts={}) {
  const row  = document.createElement('div');
  row.className = 'msg-row';

  const wDiv = document.createElement('div');
  wDiv.className = 'msg-who ' + role;
  wDiv.textContent = who;

  const body = document.createElement('div');
  body.className = 'msg-body ' + role;
  if (opts.typing) body.classList.add('typing');
  else body.textContent = text || '';

  row.appendChild(wDiv);
  row.appendChild(body);
  chatWindow.appendChild(row);
  scrollBottom();
  return { row, body };
}

/* ── TYPEWRITER ──────────────────────────────────── */
function charDelay(text, i, fast) {
  const ch   = text[i];
  const next = text[i + 1] || '';
  const prev = text[i - 1] || '';
  const spd  = fast ? 0.45 : 1; // MemeBot is slow (fast=false), BEN OS fast (fast=true)

  if ((ch === '.' || ch === '!' || ch === '?') && next === ' ') return (420 + Math.random() * 200) * spd;
  if (ch === '—' || (ch === ':' && next === ' ')) return (300 + Math.random() * 150) * spd;
  if (ch === ',' && next === ' ') return (200 + Math.random() * 120) * spd;
  if (ch === ' ') return Math.random() < 0.12 ? (180 + Math.random() * 140) * spd : (60 + Math.random() * 60) * spd;
  if (prev === ' ' && text.slice(i).split(' ')[0].length > 7) return (40 + Math.random() * 40) * spd;
  // BEN OS base: 28-56ms. MemeBot base: 62-124ms (slow, buffering feel)
  return fast
    ? 28 + Math.random() * 28
    : 62 + Math.random() * 62;
}

function typewriter(el, text, onDone, fast=true) {
  el.classList.remove('typing');
  el.textContent = '';
  let i = 0;
  function tick() {
    if (i < text.length) {
      el.textContent += text[i];
      scrollBottom();
      setTimeout(tick, charDelay(text, i++, fast));
    } else if (onDone) { onDone(); }
  }
  setTimeout(tick, 80 + Math.random() * 80);
}

/* ── RENDER BEATS ────────────────────────────────── */
function renderBeats(beats, who, onComplete, fast=true) {
  let i = 0;
  function next() {
    if (i >= beats.length) { if (onComplete) onComplete(); return; }
    const beat = beats[i++];
    if (i === 1) {
      const typing = chatWindow.querySelector('.msg-body.typing');
      if (typing) {
        typewriter(typing, beat.text, () => beat.pause ? setTimeout(next, beat.pause) : next(), fast);
        return;
      }
    }
    const role = who === 'MEMEBOT' ? 'memebot' : 'sys';
    const { body } = appendMsg(role, '', who, { typing: true });
    typewriter(body, beat.text, () => beat.pause ? setTimeout(next, beat.pause) : next(), fast);
  }
  next();
}

/* ── MEMEBOT — render image with blur-to-sharp ────── */
function renderMemebotImage(memeId, caption) {
  const meme = MEMES_DATA.finished.find(m => m.id === memeId);
  if (!meme) return;

  const wrap = document.createElement('div');
  wrap.className = 'memebot-img-wrap';

  const img = document.createElement('img');
  img.className = 'memebot-img';
  img.alt = meme.alt || '';
  img.src = meme.file;
  img.onload = () => img.classList.add('loaded');

  wrap.appendChild(img);

  if (caption) {
    const cap = document.createElement('div');
    cap.className = 'greentext';
    cap.style.color = 'var(--muted)';
    cap.style.fontSize = '11px';
    cap.style.marginTop = '4px';
    cap.textContent = caption;
    wrap.appendChild(cap);
  }

  chatWindow.appendChild(wrap);
  scrollBottom();
}

/* ── MEMEBOT — render greentext ─────────────────── */
function renderGreentext(lines) {
  const wrap = document.createElement('div');
  wrap.className = 'greentext';
  lines.forEach(line => {
    const span = document.createElement('div');
    span.className = 'gt-line';
    span.textContent = line.replace(/^>/, '').trim();
    wrap.appendChild(span);
  });
  chatWindow.appendChild(wrap);
  scrollBottom();
}

/* ── SURPRISE ME ─────────────────────────────────── */
function getSeenFacts() {
  try { return JSON.parse(localStorage.getItem('bo_seen_facts') || '[]'); }
  catch(e) { return []; }
}
function markFactSeen(id) {
  try {
    const seen = getSeenFacts();
    if (!seen.includes(id)) seen.push(id);
    localStorage.setItem('bo_seen_facts', JSON.stringify(seen));
  } catch(e) {}
}
function resetSeenFacts() {
  try { localStorage.removeItem('bo_seen_facts'); } catch(e) {}
}
function pickFact() {
  const facts = FACTS_DATA.facts;
  if (!facts.length) return null;
  const seen = getSeenFacts();
  const unseen = facts.filter(f => !seen.includes(f.id));
  if (!unseen.length) { resetSeenFacts(); return facts[Math.floor(Math.random() * facts.length)]; }
  return unseen[Math.floor(Math.random() * unseen.length)];
}

// Append a label row with no body yet — label "appears as if to start speaking"
function appendLabelOnly(role, who) {
  const row  = document.createElement('div');
  row.className = 'msg-row';
  const wDiv = document.createElement('div');
  wDiv.className = 'msg-who ' + role;
  wDiv.textContent = who;
  const body = document.createElement('div');
  body.className = 'msg-body ' + role;
  row.appendChild(wDiv);
  row.appendChild(body);
  chatWindow.appendChild(row);
  scrollBottom();
  return body;
}

function playSurprise(typingBody) {
  const fact = pickFact();

  // Fallback if data not loaded (file:// protocol, no Live Server)
  if (!fact) {
    typewriter(typingBody,
      "Ben once built a directional sound weapon and wrote a fake government datasheet for it. This is not the most unusual thing about him.",
      () => {
        setTimeout(() => renderChips(["What's the most unusual thing?", "Show me the datasheet.", "Surprise me again."]), 300);
        setWaiting(false);
      }
    );
    return;
  }

  markFactSeen(fact.id);

  // Step 1 — label appears, brief pause, then BEN OS types the fact (gets cut off mid-sentence)
  typingBody.classList.remove('typing');
  typingBody.textContent = '';

  setTimeout(() => {
    typewriter(typingBody, fact.text, () => {

      // Step 2 — short beat, then MemeBot appears
      setTimeout(() => {
        const hasMeme      = fact.memebot_meme && MEMES_DATA.finished.find(m => m.id === fact.memebot_meme);
        const hasGreentext = fact.memebot_greentext?.length;

        if (hasMeme || hasGreentext) {
          // MemeBot label appears, brief pause, then content
          const mbBody = appendLabelOnly('memebot', 'MEMEBOT');

          setTimeout(() => {
            if (hasMeme) {
              renderMemebotImage(fact.memebot_meme, null);
            } else {
              renderGreentext(fact.memebot_greentext);
            }

            // Step 3 — BEN OS reacts
            setTimeout(() => fireSurpriseReaction(fact), 900);

          }, 500 + Math.random() * 300);

        } else {
          // No MemeBot image/greentext — go straight to BEN OS reaction
          fireSurpriseReaction(fact);
        }

      }, 400);
    });
  }, 600); // the "name appears, brief pause" beat
}

function fireSurpriseReaction(fact) {
  const reactBody = appendLabelOnly('sys', 'BEN OS');
  setTimeout(() => {
    typewriter(reactBody, fact.benos_reaction, () => {

      // Step 4 — second MemeBot greentext beat (if exists)
      if (fact.memebot_greentext_2?.length) {
        setTimeout(() => {
          appendLabelOnly('memebot', 'MEMEBOT');
          setTimeout(() => {
            renderGreentext(fact.memebot_greentext_2);

            // Step 5 — chips appear after second MemeBot beat
            setTimeout(() => {
              const chips = fact.chips?.length
                ? fact.chips
                : ["Tell me more.", "Surprise me again.", "What do you actually do?"];
              renderChips(chips);
              setWaiting(false);
            }, 400);

          }, 500 + Math.random() * 300);
        }, 600);

      } else {
        // No second MemeBot beat — chips appear after BEN OS reaction
        setTimeout(() => {
          const chips = fact.chips?.length
            ? fact.chips
            : ["Tell me more.", "Surprise me again.", "What do you actually do?"];
          renderChips(chips);
          setWaiting(false);
        }, 300);
      }
    });
  }, 300);
}

/* ── VIGNETTE RENDERER ───────────────────────────── */
function playVignette(vignette, typingBody) {
  // BEN OS setup line (uses existing typing bubble)
  if (vignette.benos_setup) {
    typewriter(typingBody, vignette.benos_setup, () => {
      setTimeout(() => fireMemebotPart(vignette), 600);
    });
  } else {
    typingBody.classList.remove('typing');
    typingBody.textContent = '';
    fireMemebotPart(vignette);
  }
}

function fireMemebotPart(vignette) {
  const mb = vignette.memebot;
  if (!mb) return fireMemebotReaction(vignette);

  // Show MEMEBOT label row (empty, then populate)
  const { body: mbBody } = appendMsg('memebot', '', 'MEMEBOT', { typing: true });

  setTimeout(() => {
    mbBody.classList.remove('typing');
    mbBody.textContent = '';

    if (mb.type === 'image') {
      renderMemebotImage(mb.id, mb.caption);
    } else if (mb.type === 'greentext') {
      renderGreentext(mb.lines);
    }

    setTimeout(() => fireMemebotReaction(vignette), 800);
  }, 900 + Math.random() * 400);
}

function fireMemebotReaction(vignette) {
  if (!vignette.benos_reaction) {
    // End of vignette — e.g. goodbye
    setWaiting(false);
    return;
  }

  const { body: reactionBody } = appendMsg('sys', '', 'BEN OS', { typing: true });
  typewriter(reactionBody, vignette.benos_reaction, () => {
    if (vignette.benos_reaction2) {
      setTimeout(() => {
        const { body: r2 } = appendMsg('sys', '', 'BEN OS', { typing: true });
        typewriter(r2, vignette.benos_reaction2, () => {
          if (vignette.buttons?.length) renderChips(vignette.buttons);
          setWaiting(false);
        });
      }, 500);
    } else {
      if (vignette.buttons?.length) renderChips(vignette.buttons);
      setWaiting(false);
    }
  });
}

/* ── IMAGE GRID ──────────────────────────────────── */
function renderImageGrid(key) {
  const items = MEDIA[key]; if (!items) return;
  const grid = document.createElement('div'); grid.className = 'img-grid';
  items.slice(0,3).forEach((item,idx) => {
    const a = document.createElement('a');
    a.className = 'img-grid-item';
    a.href = item.url; a.target = '_blank'; a.rel = 'noopener';
    a.style.animationDelay = `${idx * 0.1}s`;
    a.innerHTML = `<img src="${item.src}" alt="${item.label}" loading="lazy"><div class="img-grid-label">${item.label}</div>`;
    grid.appendChild(a);
  });
  chatWindow.appendChild(grid);
  scrollBottom();
}

/* ── CHIPS ───────────────────────────────────────── */
function renderChips(chips) {
  const wrap = document.createElement('div'); wrap.className = 'chips';
  chips.forEach(text => {
    const btn = document.createElement('button'); btn.className = 'chip';
    btn.textContent = text;
    btn.addEventListener('click', () => sendMessage(text));
    wrap.appendChild(btn);
  });
  chatWindow.appendChild(wrap);
  scrollBottom();
}

/* ── DISMISS DOORS ───────────────────────────────── */
function dismissDoors() {
  clearTimeout(introTimer);
  const doors = idleDoorsEl.querySelectorAll('.door');
  doors.forEach(btn => btn.classList.add('dismissing'));
  setTimeout(() => {
    idleDoorsEl.innerHTML = '';
    doorsBuilt = false;
  }, 320);
}

function dismissDoorsSilent() {
  idleDoorsEl.style.transition = 'opacity 0.3s ease';
  idleDoorsEl.style.opacity = '0';
  setTimeout(() => {
    idleDoorsEl.innerHTML = '';
    idleDoorsEl.style.opacity = '';
    idleDoorsEl.style.transition = '';
    doorsBuilt = false;
  }, 300);
}

/* ── BUILD DOORS ─────────────────────────────────── */
function buildDoors() {
  if (doorsBuilt || conversationHistory.length > 0) return;
  doorsBuilt = true;
  idleDoorsEl.innerHTML = '';

  ALL_DOORS.forEach((text, i) => {
    const btn = document.createElement('button');
    btn.className = 'door';
    btn.textContent = text;
    const baseDelay = i < 3 ? i * 1.2 : 5 + (i - 3) * 1.0;
    btn.style.animationDelay = `${baseDelay}s`;
    btn.addEventListener('click', () => {
      const txt = btn.textContent;
      dismissDoors();
      setTimeout(() => sendMessage(txt), 150);
    });
    idleDoorsEl.appendChild(btn);
  });

  const introDelay = (MEM.get()?.count > 1) ? 10000 : 18000;
  introTimer = setTimeout(() => {
    if (conversationHistory.length === 0 && !introPlayed) playIntro();
  }, introDelay);
}

/* ── PLAY INTRO ──────────────────────────────────── */
function playIntro() {
  if (introPlayed) return;
  introPlayed = true;

  const mem = MEM.get();
  const isReturn = mem && mem.count > 1;

  const inputWrap = document.querySelector('.input-wrap');
  inputWrap.classList.add('awakening');

  setTimeout(() => {
    inputWrap.classList.remove('awakening');
    dimDoors();

    const beats = isReturn
      ? [{ text: 'BEN OS — back online.', pause: 700 }, { text: returnGreeting(mem), pause: 0 }]
      : FIRST_INTRO;

    renderBeats(beats, 'BEN OS', () => restoreDoors());
  }, 1200);
}

function dimDoors() {
  idleDoorsEl.querySelectorAll('.door').forEach(btn => {
    btn.style.transition = 'opacity 0.6s ease';
    btn.style.opacity = '0.35';
  });
}

function restoreDoors() {
  idleDoorsEl.querySelectorAll('.door').forEach(btn => {
    btn.style.transition = 'opacity 0.6s ease';
    btn.style.opacity = '';
  });
}

/* ── SEND MESSAGE ────────────────────────────────── */
async function sendMessage(text) {
  if (isWaiting || !text.trim()) return;
  setWaiting(true);

  const input = text.trim();
  userInput.value = '';
  autoResize();

  if (doorsBuilt) dismissDoors();
  clearTimeout(introTimer);

  appendMsg('user', input, 'You');
  conversationHistory.push({ role: 'user', content: input });
  statusLabel.textContent = '';
  exchangeCount++;

  // ── PRE-FILTER
  const filtered = preFilter(input);
  if (filtered) {
    const { body: typingBody } = appendMsg('sys', '', 'BEN OS', { typing: true });
    await new Promise(r => setTimeout(r, 200));
    typewriter(typingBody, filtered, () => { setWaiting(false); });
    return;
  }

  const { body: typingBody } = appendMsg('sys', '', 'BEN OS', { typing: true });
  await new Promise(r => setTimeout(r, 280 + Math.random() * 180));

  // ── VIGNETTE CHECK (before intent, for certain triggers)
  const vignette = matchVignette(input);
  if (vignette) {
    playVignette(vignette, typingBody);
    conversationHistory.push({ role: 'assistant', content: vignette.benos_setup || vignette.benos_reaction || '' });
    return; // isWaiting released inside vignette flow
  }

  // ── INTENT MATCH
  const intent = matchIntent(input);

  if (intent) {
    // Special handlers
    if (intent.special === 'surprise') {
      playSurprise(typingBody);
      return; // setWaiting(false) called inside playSurprise flow
    }

    if (intent.special === 'dark_mode') {
      const lower = normalize(input);
      const turningOn = lower.includes('dark') || lower.includes('3am') || lower.includes('lights off') || lower.includes('off');
      const isDark = document.body.classList.contains('dark');
      let response;
      if (turningOn && !isDark) {
        setDark(true);
        response = "Done. Easier on the eyes.";
      } else if (!turningOn && isDark) {
        setDark(false);
        response = "Back to daylight.";
      } else {
        response = isDark ? "Already dark." : "Already light.";
      }
      typewriter(typingBody, response, () => { setWaiting(false); statusLabel.textContent = ''; });
      conversationHistory.push({ role: 'assistant', content: response });
      return;
    }

    if (intent.special === 'goodbye') {
      // Render beats, then check for goodbye vignette
      renderBeats(intent.beats, 'BEN OS', () => {
        const goodbyeVignette = VIGNETTES_DATA.vignettes.find(v => v.id === 'temporary-person');
        if (goodbyeVignette) {
          setTimeout(() => {
            const { body: mbBody } = appendMsg('memebot', '', 'MEMEBOT', { typing: true });
            setTimeout(() => {
              mbBody.classList.remove('typing');
              mbBody.textContent = '';
              renderMemebotImage('temporary-person', null);
              // BEN OS says nothing. isWaiting stays — conversation ends.
            }, 1200);
          }, 600);
        } else {
          setWaiting(false);
        }
      });
      conversationHistory.push({ role: 'assistant', content: 'Take care.' });
      return;
    }

    if (intent.topic) sessionTopics.push(intent.topic);
    renderBeats(intent.beats, 'BEN OS', () => {
      if (intent.media) setTimeout(() => renderImageGrid(intent.media), 200);
      if (intent.chips) setTimeout(() => renderChips(intent.chips), intent.media ? 600 : 200);
      conversationHistory.push({ role: 'assistant', content: intent.beats[intent.beats.length-1].text });
      statusLabel.textContent = '';
      setWaiting(false);
    });
  } else {
    // ── CLAUDE API FALLBACK
    statusLabel.textContent = '...';
    const response = await callClaude(conversationHistory.slice(-10));
    conversationHistory.push({ role: 'assistant', content: response });
    typewriter(typingBody, response, () => { statusLabel.textContent = ''; setWaiting(false); });
  }
}

/* ── INPUT HANDLING ──────────────────────────────── */
function autoResize() {
  userInput.style.height = 'auto';
  userInput.style.height = Math.min(userInput.scrollHeight, 120) + 'px';
}

userInput.addEventListener('input', () => {
  autoResize();
  if (doorsBuilt) dismissDoorsSilent();
  clearTimeout(introTimer);
});

userInput.addEventListener('keydown', e => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    sendMessage(userInput.value);
  }
});

sendBtn.addEventListener('click', () => sendMessage(userInput.value));

/* ── SAVE TOPICS ON UNLOAD ───────────────────────── */
window.addEventListener('beforeunload', () => {
  if (sessionTopics.length) {
    const mem = MEM.get() || {};
    mem.topics = [...(mem.topics || []), ...sessionTopics].slice(-10);
    MEM.set(mem);
  }
});

/* ── INIT ────────────────────────────────────────── */
async function init() {
  // Load JSON data files in background — non-blocking
  loadData();

  MEM.record(sessionTopics);

  // Restore dark mode preference
  const mem = MEM.get();
  if (mem?.dark) setDark(true);

  const isReturn = mem && mem.count > 1;
  const doorDelay = isReturn ? 5000 : 8000;
  setTimeout(buildDoors, doorDelay);

  setupContactPopup();
  userInput.focus();

  // Sticky input sentinel
  const sentinel = document.createElement('div');
  sentinel.style.cssText = 'height:1px;margin-bottom:-1px;pointer-events:none;';
  document.getElementById('input-area').before(sentinel);

  const stickyObserver = new IntersectionObserver(
    ([entry]) => {
      document.getElementById('input-area').classList.toggle('is-sticky', !entry.isIntersecting);
    },
    { threshold: 0, rootMargin: '0px' }
  );
  stickyObserver.observe(sentinel);
}

init();
