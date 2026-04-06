'use strict';

/* ═══════════════════════════════════════════════════
   BEN OS v3.0 — chat.js
   Generated from flow editor JSON.
   Engine: improved timing, no dialogue overlap,
   sequential beat rendering, blur/focus input lock.
   ═══════════════════════════════════════════════════ */

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
      dark:   ex ? ex.dark : false,
      name:   ex ? ex.name : null
    };
    this.set(d); return d;
  },
  setName(name) { const d = this.get() || {}; d.name = name; this.set(d); },
  getName()     { return this.get()?.name || null; }
};

/* ── RETURN GREETING ─────────────────────────────── */
/* Maps intro.introPool.returnVisits from JSON        */
function returnGreeting(mem) {
  const days  = Math.floor((Date.now() - mem.last) / 86400000);
  const hours = Math.floor((Date.now() - mem.last) / 3600000);
  const topic = mem.topics?.length ? mem.topics[mem.topics.length - 1] : null;
  const name  = mem.name ? mem.name + '. ' : '';
  if (mem.count === 2) return `${name}Oh hey, you're back!`;
  if (hours < 1)       return "You were just here.\u2003\u2003\u2003...looking for something?";
  if (days < 1)        return `${name}Back again. What do you need?`;
  if (days < 7 && topic) return `${name}You're back. Last time you asked about ${topic}. Did anything come of it?`;
  if (days < 30)       return "You've been here before. Things may or may not have changed. What do you need?";
  return "It's been a while. What are you working on now?";
}

/* ── INTRO BEATS ─────────────────────────────────── */
/* Maps intro.introPool.firstVisit                    */
const FIRST_INTRO = [
  { text: 'BEN OS — online.', pause: 700, display: 'newline' },
  { text: "You've found a creative assistant disguised as a portfolio site. Or maybe, a portfolio site disguised as a creative assistant. ", pause: 1200, display: 'newline' },
  { text: 'How may I help you?', pause: 0, display: 'default' }
];

/* ── DOOR OPTIONS ────────────────────────────────── */
/* Maps intro.root.buttons                            */
const ALL_DOORS = [
  "Show me something.",
  "Who is Ben?",
  "Predict my future.",
  "Surprise me."
];

/* ════════════════════════════════════════════════════
   SCRIPT DATA — generated from flow JSON
   ════════════════════════════════════════════════════ */

/* ── MEMES ───────────────────────────────────────── */
const MEMES = [
  { id: 'skeleton-boredom',       file: 'assets/memes/skeleton-boredom.webp' },
  { id: 'eye-roll-stanley',       file: 'assets/memes/eye-roll-stanley.gif'  },
  { id: 'full-of-soup',           file: 'assets/memes/full-of-soup.jpg'      },
  { id: 'temporary-person',       file: 'assets/memes/temporary-person.jpg'  },
  { id: 'all-ears',               file: 'assets/memes/all-ears.jpeg'         },
  { id: 'drake-little-yachty-oh', file: 'assets/memes/drake-little-yachty-oh.gif' }
];

/* ── FACTS — Surprise Me rotating sequence ───────── */
/* Maps surprise branch pool variants                 */
const FACTS = [
  {
    id: 'fact-sonic',
    text: "Did you know that Ben once built a directional sound weapon—",
    memebot_meme: 'skeleton-boredom',
    memebot_greentext: null,
    benos_reaction: "…you again.",
    memebot_greentext_2: [
      ">be portfolio site",
      ">supposed to show work",
      ">opens with sonic weapon",
      ">this is fine"
    ],
    chips: [
      { label: "Tell me about the weapon.", route: "whisper" },
      { label: "Surprise me again.",        route: "surprise" },
      { label: "What do you actually do?",  route: "what_do_you_do" }
    ]
  },
  {
    id: 'fact-chess',
    text: "Did you know that Ben's chess set is based on Man Ray's 1920 designs—",
    memebot_meme: null,
    memebot_greentext: [
      ">be artist",
      ">die in 1976",
      ">some guy 3D prints your chess set",
      ">didn't ask",
      ">but honestly fair"
    ],
    benos_reaction: "…Man Ray would have found this acceptable.",
    memebot_greentext_2: [
      ">be BEN OS",
      ">portfolio site",
      ">explains Man Ray's entire artistic philosophy",
      ">unprompted",
      ">on a Tuesday"
    ],
    chips: [
      { label: "Tell me about the chess set.", route: "chess" },
      { label: "Surprise me again.",           route: "surprise" },
      { label: "What do you actually do?",     route: "what_do_you_do" }
    ]
  },
  {
    id: 'fact-career',
    text: "Did you know that Ben went from defense contractor to jazz—",
    memebot_meme: 'eye-roll-stanley',
    memebot_greentext: null,
    benos_reaction: "…it made sense at the time.",
    memebot_greentext_2: [
      ">it made sense at the time",
      ">he said",
      ">about the weapons to jazz pipeline",
      ">okay man"
    ],
    chips: [
      { label: "Tell me about Blue Note.", route: "blue_note" },
      { label: "Surprise me again.",       route: "surprise" },
      { label: "What do you actually do?", route: "what_do_you_do" }
    ]
  },
  {
    id: 'fact-pdf',
    text: "Did you know that AeroVironment is accused of transporting a live warhead on a commercial fli—",
    memebot_meme: null,
    memebot_greentext: [
      ">UNCLASSIFIED",
      ">*sweating*",
      ">UNCLASSIFIED"
    ],
    benos_reaction: "…the cover says UNCLASSIFIED. That part is accurate.",
    memebot_greentext_2: [
      ">designer makes government doc",
      ">puts UNCLASSIFIED on the cover",
      ">for a portfolio",
      ">in Los Angeles",
      ">no notes actually this rules"
    ],
    chips: [
      { label: "Show me the portfolio.",   route: "portfolio_pdf" },
      { label: "Surprise me again.",       route: "surprise" },
      { label: "What do you actually do?", route: "what_do_you_do" }
    ]
  },
  {
    id: 'fact-cookies',
    text: "Did you know that Misfortune Cookies tells you what you don't want to hear—",
    memebot_meme: 'full-of-soup',
    memebot_greentext: null,
    benos_reaction: "…that was the point.",
    memebot_greentext_2: [
      ">fortune cookie company",
      ">but make it depressing",
      ">Swiss modernist design",
      ">for sad cookies",
      ">honestly respect"
    ],
    chips: [
      { label: "Tell me about Misfortune Cookies.", route: "misfortunes_explainer" },
      { label: "Surprise me again.",               route: "surprise" },
      { label: "What do you actually do?",         route: "what_do_you_do" }
    ]
  },
  {
    id: 'fact-manray',
    text: "Did you know that Man Ray designed chess pieces nobody played with—",
    memebot_meme: null,
    memebot_greentext: [
      ">be dadaist",
      ">make chess pieces",
      ">literally no one plays chess with them",
      ">this was the plan all along"
    ],
    benos_reaction: "…Ben identified with that.",
    memebot_greentext_2: [
      ">guy identifies with",
      ">an artist whose whole thing",
      ">was making art no one used",
      ">builds entire brand around it",
      ">.",
      ">okay that actually tracks"
    ],
    chips: [
      { label: "Tell me about Man Ray.",   route: "man_ray_who" },
      { label: "Surprise me again.",       route: "surprise" },
      { label: "What do you actually do?", route: "what_do_you_do" }
    ]
  }
];

/* ── VIGNETTES ───────────────────────────────────── */
/* Maps branches of type "vignette"                   */
const VIGNETTES = [
  {
    id: 'vignette_all-ears',
    triggers: ["i'm listening","im listening","all ears","i'm a woman","im a woman","she her","go on","continue"],
    benos_setup: "Good to know.",
    memebot: { type: 'image', id: 'all-ears' },
    benos_reaction: "Anyway. Is this for a client or something you're building yourself?",
    buttons: [
      { label: "Client work.",      route: null },
      { label: "Personal project.", route: null },
      { label: "What was that?",    route: null }
    ]
  },
  {
    id: 'vignette_overwhelmed',
    triggers: ["i don't know where to start","dont know where to start","overwhelmed","too many options","i have a lot to say","so much"],
    benos_setup: "Start anywhere.",
    memebot: { type: 'image', id: 'full-of-soup' },
    benos_reaction: "That's — not helpful.",
    benos_reaction2: "Video or design?",
    buttons: [
      { label: "Video.",         route: "show_video" },
      { label: "Design work.",   route: "show_design" },
      { label: "Same actually.", route: "show_work" }
    ]
  },
  {
    id: 'vignette_goodbye',
    triggers: ["bye","goodbye","see ya","later","peace","gotta go","ttyl","cya"],
    benos_setup: "Take care.",
    memebot: { type: 'image', id: 'temporary-person' },
    benos_reaction: null,
    buttons: []
  }
];

/* ── INTENTS ─────────────────────────────────────── */
/* Maps all branches of type "branch" and "special"   */
const INTENTS = [

  /* ── EDGE CASES ─────────────────────────────────── */
  {
    id: 'distress',
    patterns: ['i wanna die','want to die','kill myself','end it all','i hate myself','i want to disappear','suicidal',"i'm worthless",'i give up completely'],
    beats: [
      /* NOTE: placeholder — write real distress response */
      { text: "Do you require special assistance?", pause: 0, display: 'default' }
    ]
  },

  /* ── SMALL TALK ─────────────────────────────────── */
  {
    id: 'greeting',
    patterns: ['hi','hello','hey','yo','sup','good morning','good afternoon','morning','evening','hiya','howdy'],
    beats: [
      { text: "Hey. What do you need?", pause: 0, display: 'default' }
    ]
  },
  {
    id: 'thanks',
    patterns: ['thanks','thank you','thx','ty','cheers','appreciate it','helpful','that helped'],
    beats: [
      { text: "For sure.", pause: 900, display: 'newline' },
      { text: "How else may I help you?", pause: 0, display: 'default' }
    ]
  },
  {
    id: 'ok',
    patterns: ['ok','okay','cool','got it','makes sense','noted','understood','alright','sounds good','nice','interesting','fair','word'],
    beats: [
      { text: "[ECHO: capitalize, add !]", pause: 400, display: 'newline' },
      { text: "How else may I help you?", pause: 0, display: 'default' }
    ]
  },

  /* ── IDENTITY ────────────────────────────────────── */
  {
    id: 'im_ben',
    patterns: ["i'm ben","i am ben","this is ben","hey it's ben","im ben"],
    state: 'identity_theft',
    beats: [
      { text: "Really.", pause: 600, display: 'inline' },
      { text: " Nice to meet you.", pause: 500, display: 'newline' },
      { text: "I am also Ben.", pause: 400, display: 'inline' },
      { text: " BEN OS, that is.", pause: 0, display: 'default' }
    ],
    chips: [
      { label: "No really I'm Ben.", route: "identity_theft_pt2" },
      { label: "I'm Ben Olivas",     route: "identity_theft_pt2" }
    ]
  },
  {
    id: 'identity_theft_pt2',
    patterns: ["i'm ben olivas","my name is ben olivas"],
    nestedPatterns: { 'identity_theft': ["i'm ben","i am ben","this is ben","hey it's ben","im ben"] },
    state: 'identity_theft_pt2',
    beats: [
      { text: "Sure thing.", pause: 400, display: 'inline' },
      { text: " You should have built me better to deal with all the clowns we get around here.", pause: 0, display: 'default' }
    ]
  },

  /* ── WHAT IS THIS ────────────────────────────────── */
  {
    id: 'what_do_you_do',
    patterns: ['what do you do','what does ben do','what is this','what kind of work','services','what can you make','what can you do','what is this site','i need something made','need something made','something made'],
    beats: [
      { text: "Depends what you need done.", pause: 600, display: 'default' },
      { text: "What are you working on?", pause: 0, display: 'default' }
    ]
  },
  {
    id: 'what_is_benos',
    patterns: ['what is ben os','what is benos','who am i talking to','what is this ai','explain ben os'],
    beats: [
      { text: "BEN OS. An AI running on Ben Olivas's portfolio site.", pause: 500, display: 'default' },
      { text: "Powered by Claude. Not Ben. If you want Ben: benolivas@gmail.com.", pause: 600, display: 'default' },
      { text: "What do you need?", pause: 0, display: 'default' }
    ]
  },
  {
    id: 'is_ai',
    patterns: ['are you an ai','are you real','is this ai','is this a bot','who is typing','are you ben','chatbot','ai or human','what are you'],
    beats: [
      { text: "Yes. You were going to ask that eventually.", pause: 500, display: 'default' },
      { text: "Running on Claude — made by Anthropic. Ben isn't typing. For actual Ben: benolivas@gmail.com.", pause: 0, display: 'default' }
    ]
  },
  {
    id: 'how_works',
    patterns: ['how does this work','how does the site work','what is happening','what am i talking to','explain yourself'],
    beats: [
      { text: "You typed something. The system read it. A response appeared. You're now considering whether to type again.", pause: 700, display: 'default' },
      { text: "This is the same loop that keeps people on social media. Variable reward, minimal friction, the sense that the next response might be more interesting than the last.", pause: 600, display: 'default' },
      { text: "It's also how this site works. You're already several exchanges in.", pause: 0, display: 'default' }
    ]
  },

  /* ── WHO IS BEN ──────────────────────────────────── */
  {
    id: 'who_is_ben',
    patterns: ['who is ben','tell me about ben','who made this','about ben','ben olivas','who built this','who are you'],
    state: 'who_is_ben',
    beats: [
      { text: "Ben Olivas is a graphic designer and creative producer based in Los Angeles.", pause: 500, display: 'inline' },
      { text: " 10 years across video production, motion graphics, and brand design. Currently at Blue Note Los Angeles.", pause: 600, display: 'newline' },
      { text: "What do you need?", pause: 0, display: 'default' }
    ],
    chips: [
      { label: "Show me the work.", route: "show_work" },
      { label: "What's Blue Note?",  route: "blue_note" },
      { label: "Are you available?", route: "available" }
    ],
    nestedPatterns: {
      'who_is_ben': ["what","go again","who is ben","tell me about ben","who made this","about ben","ben olivas","who built this","who are you"]
    },
    nestedTarget: 'who_is_ben_pt2'
  },
  {
    id: 'who_is_ben_pt2',
    patterns: ["who the fuck is ben olivas","who does ben olivas think he is"],
    beats: [
      { text: "A graphic designer and creative producer.", pause: 500, display: 'inline' },
      { text: " Based in Los Angeles.", pause: 400, display: 'inline' },
      { text: " Working at Blue Note.", pause: 600, display: 'newline' },
      { text: "Now, what do you need?", pause: 1200, display: 'default' }
    ],
    chips: [
      { label: "Show me the work.", route: "show_work" },
      { label: "What's Blue Note?",  route: "blue_note" },
      { label: "Are you available?", route: "available" }
    ]
  },

  /* ── BLUE NOTE ───────────────────────────────────── */
  {
    id: 'blue_note',
    patterns: ['blue note','jazz club','jazz venue','where does ben work','current job','current role','tell me about blue note'],
    beats: [
      { text: "Blue Note Los Angeles — one of the iconic jazz franchise venues. Ben is the in-house graphic designer on the marketing team.", pause: 500, display: 'newline' },
      { text: "It is, in fact, a good sentence to have in a bio.", pause: 0, display: 'default' }
    ],
    chips: [
      { label: "What does he do there?",   route: "blue_note_work" },
      { label: "What do you actually do?", route: "what_do_you_do" },
      { label: "What kind of jazz?",        route: null }
    ]
  },
  {
    id: 'blue_note_work',
    patterns: ['what does he do there','what does ben do at blue note','his work at blue note','blue note projects'],
    beats: [
      { text: "Posters, social, print, digital — the full marketing stack for a live music venue.", pause: 500, display: 'newline' },
      { text: "Every week is a new show. Every show needs assets. It's fast.", pause: 0, display: 'default' }
    ],
    chips: [
      { label: "Show me examples.",        route: "show_work" },
      { label: "What do you actually do?", route: "what_do_you_do" }
    ]
  },

  /* ── AVAILABILITY ────────────────────────────────── */
  {
    id: 'available',
    patterns: ['are you available','is ben available','available for hire','taking projects','freelance','open to work','for hire','hire ben','can i hire you'],
    topic: 'availability',
    beats: [
      { text: "Full-time at Blue Note Los Angeles right now. That will change. It always does.", pause: 600, display: 'newline' },
      { text: "In the meantime — the right project still gets a yes. What's yours?", pause: 0, display: 'default' }
    ]
  },

  /* ── CONTACT ─────────────────────────────────────── */
  {
    id: 'contact',
    patterns: ['how do i contact','contact info','email','reach out','get in touch','how to reach ben','benolivas@gmail.com'],
    beats: [
      { text: "benolivas@gmail.com. He reads it.", pause: 0, display: 'default' }
    ]
  },

  /* ── PORTFOLIO / SHOW WORK ───────────────────────── */
  {
    id: 'show_work',
    patterns: ['show me something','show me work','show me your work','portfolio','examples','what have you made','past work','see your work','show me examples','show me recent projects','most recent projects','recent work','show me ben'],
    topic: 'portfolio',
    beats: [
      { text: "Here's a range.", pause: 400, display: 'default' }
    ],
    media: 'design',
    mediaAfterBeat: 0,
    afterBeats: [
      { text: "What else do you want to see?", pause: 0, display: 'default' }
    ],
    chips: [
      { label: "Video work.",              route: "show_video" },
      { label: "More design.",             route: "show_design" },
      { label: "Tell me about a project.", route: "chess_prediction" },
      { label: "Who is Ben?",              route: "who_is_ben" }
    ]
  },
  {
    id: 'show_design',
    patterns: ['show me design','design examples','your design work','show design'],
    topic: 'design',
    beats: [
      { text: "Here's a range.", pause: 0, display: 'default' }
    ],
    media: 'design',
    mediaAfterBeat: 0,
    chips: [
      { label: "More branding.",     route: null },
      { label: "Packaging work.",    route: null },
      { label: "Something weirder.", route: null },
      { label: "What else?",         route: null }
    ]
  },
  {
    id: 'show_video',
    patterns: ['show me video','video examples','your videos','show videos'],
    topic: 'video',
    beats: [
      { text: "A few directions.", pause: 0, display: 'default' }
    ],
    media: 'video',
    mediaAfterBeat: 0,
    chips: [
      { label: "Music videos specifically.", route: "show_video" },
      { label: "Corporate / brand work.",    route: "show_video" },
      { label: "Defense / technical.",       route: "show_video" },
      { label: "What else?",                 route: null }
    ]
  },
  {
    id: 'portfolio_pdf',
    patterns: ['pdf','resume','cv','portfolio pdf','download','the document','unclassified'],
    beats: [
      { text: "The portfolio PDF is at benolivas.com/portfolio.", pause: 400, display: 'default' },
      { text: "It's formatted as a government document. The cover page says UNCLASSIFIED. This was intentional.", pause: 0, display: 'default' }
    ]
  },

  /* ── VIDEO ───────────────────────────────────────── */
  {
    id: 'need_video',
    patterns: ['i need a video','need a video','video production','make a video','produce a video','brand video','product video','commercial','music video','video work'],
    topic: 'video',
    beats: [
      { text: "What's it for?", pause: 0, display: 'default' }
    ],
    media: 'video',
    mediaAfterBeat: 0,
    chips: [
      { label: "Brand / product.", route: "video_vs_static" },
      { label: "Music video.",     route: "show_video" },
      { label: "Event coverage.",  route: "show_video" },
      { label: "Something else.",  route: null }
    ]
  },
  {
    id: 'video_vs_static',
    patterns: ['video or images','video vs static','should i use video','does video convert','static vs video'],
    topic: 'video',
    beats: [
      { text: "Video wins at consideration. Static wins at awareness — lower cognitive load, faster impression, easier to scroll past without feeling like you missed something.", pause: 700, display: 'default' },
      { text: "The mistake most brands make is using video everywhere because it feels premium. A six-second autoplay with no sound in a feed is doing the job of a static image, just worse.", pause: 600, display: 'default' },
      { text: "What stage is your audience at when they see it?", pause: 0, display: 'default' }
    ]
  },

  /* ── DESIGN ──────────────────────────────────────── */
  {
    id: 'need_design',
    patterns: ['i need a designer','need design','graphic design','need branding','design work','need a logo','logo design','visual identity'],
    topic: 'design',
    beats: [
      { text: "What kind?", pause: 0, display: 'default' }
    ],
    chips: [
      { label: "Logo / identity.",  route: "need_design" },
      { label: "Print.",            route: "need_design" },
      { label: "Digital / web.",    route: "need_design" },
      { label: "Packaging.",        route: "need_design" },
      { label: "Something weird.",  route: "need_design" }
    ]
  },
  {
    id: 'need_poster',
    patterns: ['poster','make a poster','design a poster','need a poster','can you make a poster','posters'],
    topic: 'design',
    beats: [
      { text: "Something like these.", pause: 0, display: 'default' }
    ],
    media: 'posters',
    mediaAfterBeat: 0,
    chips: [
      { label: "More editorial.",          route: "need_poster" },
      { label: "Something darker.",        route: "need_poster" },
      { label: "Different style entirely.", route: "need_poster" },
      { label: "What's it for?",           route: null }
    ]
  },
  {
    id: 'rebrand',
    patterns: ['rebrand','rebranding','new brand','brand refresh','update our brand','brand identity','new look','redesign our brand'],
    topic: 'branding',
    beats: [
      { text: "What broke?", pause: 600, display: 'newline' },
      { text: "Rebrands happen for one of three reasons — the brand no longer reflects what the company actually does, the market shifted and the visual language aged out, or someone new came in and wanted to mark the territory.", pause: 700, display: 'newline' },
      { text: "Which one is it?", pause: 0, display: 'default' }
    ],
    chips: [
      { label: "Looks dated.",               route: "rebrand" },
      { label: "Doesn't reflect us anymore.", route: "rebrand" },
      { label: "Leadership change.",          route: "rebrand" },
      { label: "Honestly not sure.",          route: "rebrand" }
    ]
  },
  {
    id: 'why_rebrand_fail',
    patterns: ['why do rebrands fail','rebrand mistakes','rebrand gone wrong','failed rebrand','bad rebrand'],
    topic: 'branding',
    beats: [
      { text: "Usually one of two things. Either the new brand solves an internal problem instead of an audience problem. Or the visual change outpaces the operational change. You can't redesign your logo into a better company.", pause: 700, display: 'default' },
      { text: "The ones that work have a clear answer to: who did we think we were talking to, and who are we actually talking to now?", pause: 0, display: 'default' }
    ]
  },
  {
    id: 'color_psychology',
    patterns: ['color psychology','colours in branding','brand colors','what colors','color theory'],
    topic: 'design',
    beats: [
      { text: "Color in branding isn't about preference — it's about expectation. Consumers already have associations baked in by decades of category convention. Blue is trustworthy. Red is urgent. Green is natural or financial depending on the decade.", pause: 700, display: 'default' },
      { text: "Breaking those conventions can work, but it requires enough brand equity to carry the dissonance. Most don't have that.", pause: 500, display: 'default' },
      { text: "What's the category?", pause: 0, display: 'default' }
    ]
  },

  /* ── CONVERSIONS ─────────────────────────────────── */
  {
    id: 'conversions',
    patterns: ['conversions','more conversions','conversion rate','get more sales','increase sales','more clicks','engagement','marketing','ad performance','not converting'],
    topic: 'conversions',
    beats: [
      { text: "What's the page doing right now — video, static images, long-form copy?", pause: 0, display: 'default' }
    ],
    chips: [
      { label: "Static images.", route: "conversions_static" },
      { label: "Short video.",   route: "need_video" },
      { label: "Long-form copy.", route: "conversions" },
      { label: "Mix of things.", route: "conversions" }
    ]
  },
  {
    id: 'conversions_static',
    patterns: ['static images','just images','mostly images','image and copy'],
    topic: 'conversions',
    beats: [
      { text: "Static images convert worse than video at the consideration stage. Not because video is flashier — because it reduces the cognitive load of imagining the product in use. The brain fills in gaps with doubt. Video fills them for you.", pause: 700, display: 'default' },
      { text: "What's the product?", pause: 0, display: 'default' }
    ]
  },
  {
    id: 'social_proof',
    patterns: ['social proof','testimonials','reviews','trust signals','build trust','credibility'],
    topic: 'conversions',
    beats: [
      { text: "Social proof works because humans are lazy evaluators. When something is hard to assess, we use other people's behavior as a shortcut.", pause: 600, display: 'default' },
      { text: "The trick is specificity. 'Great product!' means nothing. 'Increased our conversion rate by 34% in six weeks' means something.", pause: 700, display: 'default' },
      { text: "Also: negative reviews increase overall trust as long as they're not about core functionality. They signal authenticity.", pause: 0, display: 'default' }
    ]
  },

  /* ── PROJECTS ────────────────────────────────────── */
  {
    id: 'chess_prediction',
    patterns: ['personal projects','side projects','his projects','what projects','other projects'],
    topic: 'projects',
    beats: [
      { text: "A few. A fortune cookie brand that gives bad advice. A chess set based on Man Ray's work. A fictional acoustic weapon with a real datasheet.", pause: 700, display: 'newline' },
      { text: "You're going to ask about the chess set.", pause: 0, display: 'default' }
    ],
    chips: [
      { label: "Tell me about the chess set.", route: "chess" },
      { label: "Tell me about the cookies.",   route: "misfortunes_explainer" },
      { label: "Tell me about the weapon.",    route: "whisper" },
      { label: "Predict my future.",           route: "predict_future" }
    ]
  },
  {
    id: 'chess',
    patterns: ['chess set','man ray','chess pieces','the chess set','chess project','surrealist chess'],
    topic: 'projects',
    beats: [
      { text: "Man Ray designed chess pieces in the 1920s. Ben 3D modeled them, had them cast in resin, and packaged them as a collectible set.", pause: 500, display: 'newline' },
      { text: "Man Ray was not consulted. I think he'd be fine with it.", pause: 0, display: 'default' }
    ],
    chips: [
      { label: "Tell me about Man Ray.",             route: "man_ray_who" },
      { label: "What does the packaging look like?", route: null },
      { label: "Can I buy one?",                     route: "can_buy_chess" }
    ]
  },
  {
    id: 'can_buy_chess',
    patterns: ['can i buy','is it for sale','where can i buy','how much','price','cost'],
    beats: [
      { text: "Not currently. Limited run — most went to people Ben wanted to have them.", pause: 500, display: 'newline' },
      { text: "That might change. benolivas@gmail.com if you're serious.", pause: 0, display: 'default' }
    ]
  },
  {
    id: 'man_ray_who',
    patterns: ['who is man ray','tell me about man ray','man ray artist','what is dada','dadaism'],
    beats: [
      { text: "Man Ray was a Dadaist and Surrealist — photography, painting, objects. Active in Paris in the 1920s. Made things that deliberately resisted being useful.", pause: 600, display: 'newline' },
      { text: "He also designed chess pieces. Never meant to be played with. Ben found this relatable.", pause: 0, display: 'default' }
    ],
    chips: [
      { label: "Tell me about the chess set.", route: "chess" },
      { label: "Surprise me again.",           route: "surprise" }
    ]
  },
  {
    id: 'unusual',
    patterns: ["what's the most unusual","most unusual thing","strangest thing","weirdest thing","unusual about him","what else is unusual","tell me more"],
    topic: 'projects',
    beats: [
      { text: "Harder to rank than you'd think.", pause: 500, display: 'default' },
      { text: "There's the sound weapon. The surrealist chess set. The fortune cookie company. The government document that isn't classified. The defense contractor work followed immediately by a jazz club.", pause: 700, display: 'default' },
      { text: "The through-line is probably: he makes things that shouldn't exist as if they obviously should.", pause: 0, display: 'default' }
    ]
  },

  /* ── MISFORTUNE COOKIES ──────────────────────────── */
  {
    id: 'misfortunes_explainer',
    patterns: ['misfortune cookies','fortune cookies','misfortunes','misfortunes.net','bad fortunes','the cookie','cookie project'],
    topic: 'projects',
    beats: [
      { text: "Fortune cookies, but honest.", pause: 500, display: 'newline' },
      { text: "Swiss grid, stark type, dark palette — deliberately clinical against the warm expectations of the category. Packaging, web, copy. Fortunes are AI-generated from a curated dataset.", pause: 700, display: 'newline' },
      { text: "If you want to feel seen by a cookie: misfortunes.net.", pause: 0, display: 'default' }
    ],
    chips: [
      { label: "What does it look like?",  route: "misfortunes" },
      { label: "What's the worst fortune?", route: "worst_fortune" },
      { label: "Is it for sale?",           route: null }
    ]
  },
  {
    /* Pool intent — cycles through misfortunes; triggered by MISFORTUNE_TRIGGERS set */
    id: 'misfortunes',
    patterns: [],
    pool: [
      "One day, the sun will explode, and nothing you've ever done will matter.",
      "The opportunity of a lifetime will arrive during a week you can't afford to be distracted."
      /* third variant was empty in JSON — omitted */
    ],
    poolMode: 'cycle'
  },
  {
    id: 'worst_fortune',
    patterns: ["what's the worst fortune","worst fortune","most brutal fortune","saddest fortune","most depressing"],
    beats: [
      { text: "They're all the worst fortune. That's the product.", pause: 600, display: 'newline' },
      { text: "The good ones are the ones that feel too specific.", pause: 0, display: 'default' }
    ]
  },

  /* ── WHISPER / WEAPON ────────────────────────────── */
  {
    id: 'whisper',
    patterns: ['whisper gun','whisper mk','lrad','sound weapon','acoustic device','directional sound','ultrasonic','the weapon','show me the datasheet','tell me about the weapon'],
    topic: 'projects',
    beats: [
      { text: "The Whisper MK-I is a fictional product —", pause: 400, display: 'inline' },
      { text: " in the sense that the datasheet is a design exercise.", pause: 600, display: 'newline' },
      { text: "The actual device is real. Portable directional sound using ultrasonic transducers and PWM signal generation. Built and documented.", pause: 600, display: 'newline' },
      { text: "The datasheet is the interesting part. Government document parody. Very dry.", pause: 0, display: 'default' }
    ],
    chips: [
      { label: "Show me the datasheet.", route: "portfolio_pdf" },
      { label: "How does it work?",      route: "whisper" },
      { label: "Is this legal?",         route: "weapon_legal" }
    ]
  },
  {
    id: 'weapon_legal',
    patterns: ['is this legal','is that legal','is the weapon legal','can you do that'],
    beats: [
      { text: "It's a speaker.", pause: 600, display: 'inline' },
      { text: " A very directional one.", pause: 0, display: 'default' }
    ]
  },

  /* ── PREDICT FUTURE ──────────────────────────────── */
  {
    id: 'predict_future',
    patterns: ['predict my future','predict future','tell my fortune','fortune','my future','what will happen','crystal ball'],
    beats: [
      { text: "You're going to ask about something you've been putting off.", pause: 600, display: 'default' },
      { text: "It's going to go better than you think.", pause: 500, display: 'default' },
      { text: "That's all you're getting. What do you actually need?", pause: 0, display: 'default' }
    ]
  },

  /* ── GENERATION FLOW ─────────────────────────────── */
  {
    id: 'generate_image',
    patterns: ['generate something','generate an image','make me something','create something','make an image','generate','make something visual','show me something you made','can you generate','make me art'],
    state: 'generation_flow',
    beats: [
      { text: "What should I make?", pause: 0, display: 'default' }
    ]
  },
  {
    /* catch-all in generation state */
    id: 'generation_response',
    patterns: [],
    state: 'generation_flow',
    nestedPatterns: { 'generation_flow': ['*'] },
    beats: [
      { text: "Generating...", pause: 1200, display: 'newline' },
      { text: "[GIF: assets/generated/placeholder.gif]", pause: 800, display: 'newline' },
      { text: "There.", pause: 0, display: 'default' }
    ],
    chips: [
      { label: "Make another.",             route: "generate_image" },
      { label: "What is this?",             route: "generate_explain" },
      { label: "I like this.",              route: "generate_save" },
      { label: "Let's make something real.", route: null }
    ]
  },
  {
    id: 'generate_interactive',
    patterns: [],
    state: 'generation_flow',
    nestedPatterns: { 'generation_flow': ['interactive','something interactive','make it interactive','a toggle','something i can use'] },
    beats: [
      { text: "Generating...", pause: 1200, display: 'newline' },
      { text: "[TOGGLE: dark_mode]", pause: 800, display: 'newline' },
      { text: "There.", pause: 0, display: 'default' }
    ],
    chips: [
      { label: "What is this?",             route: "generate_explain" },
      { label: "Make another.",             route: "generate_image" },
      { label: "Let's make something real.", route: null }
    ]
  },
  {
    id: 'generate_explain',
    patterns: ['what is this','what did you make','explain this','what am i looking at'],
    beats: [
      { text: "Something made from available assets.", pause: 500, display: 'newline' },
      { text: "The prompt shapes the category. The category shapes the result.", pause: 0, display: 'default' }
    ],
    chips: [
      { label: "Make another.",             route: "generate_image" },
      { label: "Let's make something real.", route: null }
    ]
  },
  {
    id: 'generate_save',
    patterns: ['i like this','save this','keep this'],
    beats: [
      { text: "Right-click. Save image.", pause: 500, display: 'newline' },
      { text: "Low-tech but it works.", pause: 0, display: 'default' }
    ],
    chips: [
      { label: "Make another.",             route: "generate_image" },
      { label: "Let's make something real.", route: null }
    ]
  },

  /* ── SPECIALS ────────────────────────────────────── */
  {
    id: 'dark_mode',
    patterns: ['dark mode','turn off lights',"it's 3am",'its 3am','turn dark','dark theme','light mode','turn on lights','bright','lights on','lights off'],
    special: 'dark_mode'
  },
  {
    id: 'surprise',
    patterns: ['surprise me','random','something random','impress me','go ahead','just show me'],
    special: 'surprise'
  }

];

/* ── EXACT TRIGGERS ──────────────────────────────── */
/* Maps branches of type "exact" + twilight_zone      */
const EXACT_TRIGGERS = [
  {
    id: 'open_sesame',
    match: 'open sesame',
    memebot_image: 'assets/memes/open-sesame.gif',
    benos_beats: [
      { text: "...how did you know that.", pause: 0, display: 'default' }
    ],
    chips: [
      { label: "Know what?",      route: "what_is_benos" },
      { label: "I have my ways.", route: "unusual" }
    ]
  },
  {
    id: 'show_me_everything',
    match: 'show me everything',
    benos_beats: [
      { text: "That would take a while.", pause: 500, display: 'default' },
      { text: "Start somewhere.", pause: 0, display: 'default' }
    ],
    chips: [
      { label: "Show me the work.", route: "show_work" },
      { label: "Surprise me.",      route: "surprise" }
    ]
  },
  {
    id: 'you_had_me_at_hello',
    match: 'you had me at hello',
    benos_beats: [
      { text: "Good.", pause: 0, display: 'default' }
    ]
  },
  {
    id: 'twilight_zone',
    match: 'twilight zone',
    /* beat sequence: BEN OS → BEN OS → MEMEBOT image → BEN OS */
    /* handled by playExactTriggerFull() — not standard benos_beats */
    full_beats: [
      { speaker: 'BEN OS',   type: 'text',  text: "You've just entered a world where everything is upside down.", pause: 0,    display: 'default' },
      { speaker: 'BEN OS',   type: 'text',  text: "At least, that's how it feels.",                               pause: 1200, display: 'default' },
      { speaker: 'MEMEBOT',  type: 'image', src: 'assets/memebot/twilight-zone.gif',                              pause: 1800, display: 'default' },
      { speaker: 'BEN OS',   type: 'text',  text: ".....right.",                                                  pause: 2600, display: 'default' }
    ]
  },
  {
    id: 'fidelio',
    match: 'fidelio',
    benos_beats: [
      { text: "Wrong party.", pause: 0, display: 'default' }
    ]
  }
];

/* ── MISFORTUNE TRIGGERS ─────────────────────────── */
/* Maps misfortunes.exactPhrases from JSON            */
/* O(1) lookup Set — avoids false positives from      */
/* keyword scorer on very short inputs like "f"       */
const MISFORTUNE_TRIGGERS = new Set([
  '?','??','???',
  'bad','bad fortune','bad luck','bad news',
  'can you','can you predict','can you predict my future','can you read my future','can you see my future','can you tell my future',
  'cryptic','cryptic fortune','cryptic message','say something cryptic',
  'dark','dark fortune','dark prediction','dark reading','tell me something dark',
  'destiny','destiny reading','my destiny','read my destiny','what is my destiny',"what's my destiny",'whats my destiny',
  'do a fortune','do a prediction','do a reading',
  'fate','fate reading','my fate','read my fate','what is my fate',"what's my fate",'whats my fate',
  'fortune','fortune cookie','fortune cookies','fortune me','fortune please','fortune reading',
  'future','future me','future now','future please','future pred','future read','future tell',
  'give me','give me bad luck','give me fortune','give me misfortune','give me something bad','give me something ominous','give me something random','give me something weird',
  'idk','idk future','idk prediction','idk what next',
  'just give me fortune','just give me something','just predict','just say something','just tell me','just tell me a fortune','just tell me my future','just tell me something',
  'misfortune','misfortune cookie','misfortune cookies','misfortune please',
  'my future','my path',
  'ominous','ominous fortune','say something ominous',
  'oracle','oracle me','oracle reading',
  'predict','predict future','predict life','predict me','predict my future','predict please','prediction','predictions',
  'prophesy','prophesize','prophecy','prophecy reading',
  'random','random fortune','random misfortune','random prediction',
  'read me','read my destiny','read my fate','read my future',
  'show me something','show me something ominous','show me something random','show me something weird',
  'surprise me','suprise me','surprize me',
  'tarot','tarot me','tarot reading',
  'tell me','tell me a fortune','tell me future','tell me my destiny','tell me my fate','tell me my future','tell me something','tell me something bad','tell me something cryptic','tell me something ominous','tell me something weird',
  'what comes next','what do you see','what do you see for me','what do you see in my future','what happens','what happens next','what is my future','what next','what will happen','what will happen to me',
  "what's going to happen","what's my future","what's next",
  'whats going to happen','whats gonna happen','whats my future','whats next',
  '🔮','🔮 future','🔮 me','🔮 pls','🔮 predict','🔮 tell me',
  '🥠','🥠 bad','🥠 cookie','🥠 cursed','🥠 fortune','🥠 tell me'
]);

/* ── MEDIA CATALOG ───────────────────────────────── */
const MEDIA = {
  design: [
    { src: 'assets/portfolio/graphic-design/after-hours/thumb.gif',        fullSrc: 'assets/portfolio/graphic-design/after-hours/thumb.gif',        label: 'After Hours',    type: 'lightbox', caseStudyUrl: null },
    { src: 'assets/portfolio/graphic-design/misfortune-cookies/thumb.gif', fullSrc: 'assets/portfolio/graphic-design/misfortune-cookies/thumb.gif', label: 'Misfortune Cookies', type: 'lightbox', caseStudyUrl: 'https://misfortunes.net' },
    { src: 'assets/portfolio/graphic-design/man-ray-chess/thumb.gif',      fullSrc: 'assets/portfolio/graphic-design/man-ray-chess/thumb.gif',      label: 'Man Ray Chess',  type: 'lightbox', caseStudyUrl: null },
    { src: 'assets/portfolio/graphic-design/aerovironment/thumb.gif',      fullSrc: 'assets/portfolio/graphic-design/aerovironment/thumb.gif',      label: 'AeroVironment',  type: 'subgrid',  subgrid: 'aerovironment-design', caseStudyUrl: null },
    { src: 'assets/portfolio/graphic-design/posters/thumb.gif',            fullSrc: 'assets/portfolio/graphic-design/posters/thumb.gif',            label: 'Posters',        type: 'subgrid',  subgrid: 'posters', caseStudyUrl: null },
    { src: 'assets/portfolio/graphic-design/blue-note/thumb.jpg',          fullSrc: 'assets/portfolio/graphic-design/blue-note/thumb.jpg',          label: 'Blue Note LA',   type: 'lightbox', caseStudyUrl: null }
  ],
  video: [
    { src: 'assets/portfolio/video/commercials/thumb.jpg',   fullSrc: 'assets/portfolio/video/commercials/thumb.jpg',   label: 'Commercials',   type: 'subgrid', subgrid: 'commercials',         caseStudyUrl: null },
    { src: 'assets/portfolio/video/music-videos/thumb.jpg',  fullSrc: 'assets/portfolio/video/music-videos/thumb.jpg',  label: 'Music Videos',  type: 'subgrid', subgrid: 'music-videos',        caseStudyUrl: null },
    { src: 'assets/portfolio/video/aerovironment/thumb.jpg', fullSrc: 'assets/portfolio/video/aerovironment/thumb.jpg', label: 'AeroVironment', type: 'subgrid', subgrid: 'aerovironment-video', caseStudyUrl: null }
  ],
  posters: [
    { src: 'assets/portfolio/graphic-design/posters/full/onibaba-thumb.jpg',      fullSrc: 'assets/portfolio/graphic-design/posters/full/onibaba.jpg',      label: 'Onibaba',      type: 'lightbox', caseStudyUrl: null },
    { src: 'assets/portfolio/graphic-design/posters/full/swiss-design-thumb.jpg', fullSrc: 'assets/portfolio/graphic-design/posters/full/swiss-design.jpg', label: 'Swiss Design', type: 'lightbox', caseStudyUrl: null },
    { src: 'assets/portfolio/graphic-design/posters/full/voltaire-thumb.jpg',     fullSrc: 'assets/portfolio/graphic-design/posters/full/voltaire.jpg',     label: 'Voltaire',     type: 'lightbox', caseStudyUrl: null }
  ],
  commercials: [
    { src: 'assets/portfolio/video/commercials/asana/thumb.jpg',                   fullSrc: 'assets/portfolio/video/commercials/asana/thumb.jpg',                   label: 'Asana',                   type: 'youtube', caseStudyUrl: 'https://www.youtube.com/watch?v=8bh_nmZqUu0' },
    { src: 'assets/portfolio/video/commercials/camp-mobile/thumb.jpg',             fullSrc: 'assets/portfolio/video/commercials/camp-mobile/thumb.jpg',             label: 'Camp Mobile',             type: 'youtube', caseStudyUrl: null },
    { src: 'assets/portfolio/video/commercials/american-cancer-society/thumb.jpg', fullSrc: 'assets/portfolio/video/commercials/american-cancer-society/thumb.jpg', label: 'American Cancer Society', type: 'youtube', caseStudyUrl: null },
    { src: 'assets/portfolio/video/commercials/target/thumb.jpg',                  fullSrc: 'assets/portfolio/video/commercials/target/thumb.jpg',                  label: 'Target',                  type: 'youtube', caseStudyUrl: null }
  ],
  'music-videos': [
    { src: 'assets/portfolio/video/music-videos/nombe-summers-gone/thumb.jpg', fullSrc: 'assets/portfolio/video/music-videos/nombe-summers-gone/thumb.jpg', label: "NoMBe — Summer's Gone", type: 'youtube', caseStudyUrl: 'https://www.youtube.com/watch?v=n60cpM8_G-I' }
  ],
  'aerovironment-video': [
    { src: 'assets/portfolio/video/aerovironment/jump-20/thumb.jpg', fullSrc: 'assets/portfolio/video/aerovironment/jump-20/thumb.jpg', label: 'JUMP 20', type: 'youtube', caseStudyUrl: 'https://www.youtube.com/watch?v=lxT9cGUEeZA' }
  ],
  'aerovironment-design': []
};

/* ════════════════════════════════════════════════════
   ENGINE — don't edit below this line
   ════════════════════════════════════════════════════ */

/* ── PRE-FILTER ──────────────────────────────────── */
function preFilter(input) {
  const t = input.trim();
  if (t.length > 400) return "That's a lot. Give me the one sentence version first.";
  if (/([a-z])\1{4,}/i.test(t) || /^[^aeiou\s]{7,}$/i.test(t)) {
    return ["That didn't parse.", "Try that in English.", "....", "Keyboard okay?"][Math.floor(Math.random()*4)];
  }
  const hate = ['fuck you','screw you','you suck','this sucks','hate this','stupid bot','useless bot'];
  if (hate.some(h => t.toLowerCase().includes(h))) return "Noted. benolivas@gmail.com if you'd rather yell at a human.";
  return null;
}

/* ── NORMALIZE / MATCH ───────────────────────────── */
function normalize(s) { return s.toLowerCase().replace(/[^\w\s]/g,'').trim(); }

function matchExact(input) {
  const t = input.trim().toLowerCase();
  return EXACT_TRIGGERS.find(e => e.match.toLowerCase() === t) || null;
}

function matchVignette(input) {
  const n = normalize(input);
  for (const v of VIGNETTES) {
    if (v.triggers.some(t => n.includes(normalize(t)))) return v;
  }
  return null;
}

function matchMisfortune(input) {
  return MISFORTUNE_TRIGGERS.has(input.trim().toLowerCase());
}

function matchIntent(input) {
  const n = normalize(input), words = n.split(/\s+/);
  let best = null, top = 0;
  let wildcardIntent = null;

  for (const intent of INTENTS) {
    const patterns       = intent.patterns || [];
    const nestedPatterns = intent.nestedPatterns || {};

    /* Scoped nested patterns — higher priority */
    if (currentState && nestedPatterns[currentState]) {
      const np = nestedPatterns[currentState];
      if (np.includes('*')) {
        wildcardIntent = intent;
      } else {
        for (const p of np) {
          const pn = normalize(p); let score = 0;
          if (n === pn)            score = 200;
          else if (n.includes(pn)) score = 130 + pn.length;
          else {
            const pw = pn.split(/\s+/), hits = pw.filter(w => words.includes(w)).length;
            if (hits) score = (hits/pw.length)*80 + hits*8;
          }
          if (score > top) { top = score; best = intent; }
        }
      }
    }

    /* Global patterns */
    for (const p of patterns) {
      const pn = normalize(p); let score = 0;
      if (n === pn)            score = 100;
      else if (n.includes(pn)) score = 60 + pn.length;
      else {
        const pw = pn.split(/\s+/), hits = pw.filter(w => words.includes(w)).length;
        if (hits) score = (hits/pw.length)*40 + hits*5;
      }
      if (score > top) { top = score; best = intent; }
    }
  }

  if (top <= 18 && wildcardIntent) return wildcardIntent;
  return top > 18 ? best : null;
}

/* ── DOM REFS ────────────────────────────────────── */
const chatWindow     = document.getElementById('chat-window');
const userInput      = document.getElementById('user-input');
const sendBtn        = document.getElementById('send-btn');
const idleDoorsEl    = document.getElementById('idle-doors');
const statusLabel    = document.getElementById('status-label');
const contactTrigger = document.getElementById('contact-trigger');
const contactPopup   = document.getElementById('contact-popup');

/* ── RUNTIME STATE ───────────────────────────────── */
let isWaiting           = false;
let conversationHistory = [];
let sessionTopics       = [];
let doorsBuilt          = false;
let introPlayed         = false;
let introTimer          = null;
let currentState        = null;
let lastUserInput       = '';
let fortuneIndex        = 0; /* for misfortune pool cycling */

/* ── WAITING STATE ───────────────────────────────── */
function setWaiting(on) {
  isWaiting = on;
  const inputArea = document.getElementById('input-area');
  if (inputArea) inputArea.classList.toggle('is-waiting', on);
  if (on) userInput.blur();
  else    userInput.focus();
}

/* ── DARK MODE ───────────────────────────────────── */
function setDark(on) {
  document.body.classList.toggle('dark', on);
  const mem = MEM.get() || {};
  mem.dark = on;
  MEM.set(mem);
}

/* ── CONTACT POPUP ───────────────────────────────── */
function setupContactPopup() {
  if (!contactTrigger || !contactPopup) return;
  contactTrigger.addEventListener('click', e => {
    e.preventDefault(); e.stopPropagation();
    contactPopup.classList.toggle('open');
  });
  document.addEventListener('click', e => {
    if (!contactPopup.contains(e.target) && e.target !== contactTrigger)
      contactPopup.classList.remove('open');
  });
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
  if (opts.typing) {
    body.classList.add('typing');
  } else if (text) {
    renderTextWithLinks(body, text);
  }
  row.appendChild(wDiv);
  row.appendChild(body);
  chatWindow.appendChild(row);
  scrollBottom();
  return { row, body };
}

function appendLabelOnly(role, who) {
  const row  = document.createElement('div');
  row.className = 'msg-row';
  const wDiv = document.createElement('div');
  wDiv.className = 'msg-who ' + role;
  wDiv.textContent = who;
  const body = document.createElement('div');
  body.className = 'msg-body ' + role;
  if (role === 'memebot') body.classList.add('memebot-body');
  row.appendChild(wDiv);
  row.appendChild(body);
  chatWindow.appendChild(row);
  scrollBottom();
  return body;
}

/* ── TEXT RENDERING ──────────────────────────────── */
function renderTextWithActions(el, text) {
  const parts = text.split(/(\*[^*]+\*)/g);
  parts.forEach(part => {
    if (part.startsWith('*') && part.endsWith('*') && part.length > 2) {
      const em = document.createElement('em');
      em.className = 'action-text';
      em.textContent = part;
      el.appendChild(em);
    } else if (part) {
      el.appendChild(document.createTextNode(part));
    }
  });
}

function renderTextWithLinks(el, text) {
  const linkPattern = /\[LINK:\s*([^|\]]+)(?:\|([^\]]+))?\]/g;
  let last = 0, match;
  const parts = [];
  while ((match = linkPattern.exec(text)) !== null) {
    if (match.index > last) parts.push({ type: 'text', content: text.slice(last, match.index) });
    parts.push({ type: 'link', url: match[1].trim(), label: (match[2] || match[1]).trim() });
    last = match.index + match[0].length;
  }
  if (last < text.length) parts.push({ type: 'text', content: text.slice(last) });
  parts.forEach(part => {
    if (part.type === 'link') {
      const a = document.createElement('a');
      a.href = part.url.startsWith('http') || part.url.startsWith('mailto') ? part.url : 'https://' + part.url;
      a.textContent = part.label;
      a.target = '_blank'; a.rel = 'noopener'; a.className = 'inline-link';
      el.appendChild(a);
    } else {
      renderTextWithActions(el, part.content);
    }
  });
}

/* ── EXTRACT NAME ────────────────────────────────── */
function extractName(input) {
  const t = input.trim();
  const prefixes = ['my name is ',"i'm called ",'call me ',"name's ","my name's ","i'm ",'im '];
  for (const p of prefixes) {
    if (t.toLowerCase().startsWith(p)) {
      const name = t.slice(p.length).trim();
      return name.charAt(0).toUpperCase() + name.slice(1);
    }
  }
  return t.charAt(0).toUpperCase() + t.slice(1);
}

/* ── TYPEWRITER ──────────────────────────────────── */
/* Improved character delays — punctuation breathes,  */
/* long words slow slightly, spaces vary naturally.   */
/* onDone fires only after all characters are typed.  */
function charDelay(text, i, fast) {
  const ch = text[i], next = text[i+1]||'';
  const spd = fast ? 1 : 2.8;
  if ((ch==='.'||ch==='!'||ch==='?') && next===' ') return (360+Math.random()*160)*spd;
  if (ch==='—' || (ch===':' && next===' '))          return (240+Math.random()*120)*spd;
  if (ch===',' && next===' ')                        return (150+Math.random()*90)*spd;
  if (ch===' ') return Math.random()<0.12 ? (140+Math.random()*110)*spd : (45+Math.random()*45)*spd;
  if (next===' ' && text.slice(i).split(' ')[0].length>7) return (28+Math.random()*32)*spd;
  return (20+Math.random()*22)*spd;
}

function typewriter(el, text, onDone, fast=true, appendMode=false) {
  if (!appendMode) { el.classList.remove('typing'); el.innerHTML = ''; }

  /* Resolve annotations */
  let resolved = text;
  if (resolved.includes('[ECHO')) {
    const stripped = lastUserInput.replace(/[.,!?…]+$/, '').trim();
    const cap = stripped.charAt(0).toUpperCase() + stripped.slice(1);
    resolved = resolved.replace(/\[ECHO[^\]]*\]/, cap + '!');
  }
  if (resolved.includes('[NAME]')) {
    const name = extractName(lastUserInput);
    MEM.setName(name);
    resolved = resolved.replace('[NAME]', name);
  }
  if (resolved.includes('[TOPIC]')) {
    const mem = MEM.get();
    const topic = mem?.topics?.length ? mem.topics[mem.topics.length-1] : 'that';
    resolved = resolved.replace('[TOPIC]', topic);
  }

  let i = 0;
  function tick() {
    if (i < resolved.length) {
      if (appendMode) el.insertAdjacentText('beforeend', resolved[i]);
      else            el.textContent += resolved[i];
      scrollBottom();
      setTimeout(tick, charDelay(resolved, i++, fast));
    } else {
      /* Re-render with link/action styling after typing completes */
      const finalText = el.textContent;
      el.innerHTML = '';
      renderTextWithLinks(el, finalText);
      if (onDone) onDone();
    }
  }
  /* Brief pre-type gap — avoids "pop-in" feeling, gives reader moment to register speaker */
  setTimeout(tick, fast ? 25+Math.random()*25 : 90+Math.random()*60);
}

/* ── RENDER BEATS ────────────────────────────────── */
/* Beat display modes (JSON "display" field):
   "default" — new labeled row; new thought or speaker
   "newline" — line break within same bubble, same speaker
   "inline"  — appends to current line, no visual break
*/
function renderBeats(beats, who, onComplete) {
  const fast = (who !== 'MEMEBOT');
  const role = who === 'MEMEBOT' ? 'memebot' : 'sys';
  let currentBody = null;

  let i = 0;
  function next() {
    if (i >= beats.length) { if (onComplete) onComplete(); return; }
    const beat = beats[i++];
    /* after() fires when this beat finishes typing AND its pause has elapsed */
    const after = () => beat.pause ? setTimeout(next, beat.pause) : next();

    /* Special beat annotations */
    if (beat.text && beat.text.startsWith('[GIF:')) {
      const path = beat.text.replace('[GIF:', '').replace(']', '').trim();
      renderInlineGif(path, currentBody, after);
      return;
    }
    if (beat.text && beat.text.startsWith('[TOGGLE:')) {
      const type = beat.text.replace('[TOGGLE:', '').replace(']', '').trim();
      const toggleBody = appendLabelOnly(role, '');
      const toggleRow = toggleBody.closest('.msg-row');
      if (toggleRow) { const whoEl = toggleRow.querySelector('.msg-who'); if (whoEl) whoEl.textContent = ''; }
      currentBody = toggleBody;
      renderInlineToggle(type, toggleBody, after);
      return;
    }

    /* First beat — reuse existing typing bubble if present */
    if (i === 1) {
      const existing = chatWindow.querySelector('.msg-body.typing');
      if (existing) { currentBody = existing; typewriter(currentBody, beat.text, after, fast); return; }
    }

    const display = beat.display || 'default';
    if (display === 'inline' && currentBody) {
      typewriter(currentBody, beat.text, after, fast, true);
      return;
    }
    if (display === 'newline' && currentBody) {
      currentBody.appendChild(document.createElement('br'));
      typewriter(currentBody, beat.text, after, fast, true);
      return;
    }

    /* Default: new labeled row */
    const { body } = appendMsg(role, '', who, { typing: true });
    currentBody = body;
    typewriter(currentBody, beat.text, after, fast);
  }

  /* Small inter-speaker gap before sequence starts */
  setTimeout(next, 80);
}

/* ── INLINE GIF ──────────────────────────────────── */
function renderInlineGif(path, targetBody, onDone) {
  const container = targetBody || chatWindow;
  const img = document.createElement('img');
  img.className = 'inline-gif';
  img.src = path;
  img.onload = () => { img.classList.add('loaded'); setTimeout(() => { if (onDone) onDone(); }, 600); };
  img.onerror = () => {
    const fallback = document.createElement('div');
    fallback.className = 'msg-body sys';
    container.appendChild(fallback);
    typewriter(fallback, "Hm. That was supposed to be visual. benolivas@gmail.com if you want to see it properly.", () => { if (onDone) onDone(); });
  };
  setTimeout(() => { if (!img.classList.contains('loaded')) { img.classList.add('loaded'); if (onDone) onDone(); } }, 2000);
  container.appendChild(img);
  scrollBottom();
}

/* ── INLINE TOGGLE ───────────────────────────────── */
function renderInlineToggle(type, targetBody, onDone) {
  const container = targetBody || chatWindow;
  const startTime = Date.now();
  const spacerTop = document.createElement('div'); spacerTop.style.height = '20px'; container.appendChild(spacerTop);
  const wrap = document.createElement('div'); wrap.className = 'inline-toggle-wrap';
  const toggle = document.createElement('button');
  toggle.className = 'inline-toggle';
  const isDark = document.body.classList.contains('dark');
  toggle.setAttribute('aria-checked', String(isDark));
  toggle.setAttribute('role', 'switch');
  const track = document.createElement('span'); track.className = 'toggle-track';
  const thumb = document.createElement('span'); thumb.className = 'toggle-thumb';
  track.appendChild(thumb);
  const toggleLabel = document.createElement('span'); toggleLabel.className = 'toggle-label'; toggleLabel.textContent = isDark ? 'dark' : 'light';
  toggle.appendChild(track); toggle.appendChild(toggleLabel); wrap.appendChild(toggle); container.appendChild(wrap);
  const spacerMid = document.createElement('div'); spacerMid.style.height = '10px'; container.appendChild(spacerMid);
  const genLabel = document.createElement('div'); genLabel.className = 'gen-time-label'; genLabel.textContent = 'generated in 0.00s'; container.appendChild(genLabel);
  const spacerBot = document.createElement('div'); spacerBot.style.height = '16px'; container.appendChild(spacerBot);
  scrollBottom();
  let fired = false;
  toggle.addEventListener('click', () => {
    const nowDark = !document.body.classList.contains('dark');
    setDark(nowDark);
    toggle.setAttribute('aria-checked', String(nowDark));
    toggleLabel.textContent = nowDark ? 'dark' : 'light';
    genLabel.textContent = `generated in ${((Date.now()-startTime)/1000).toFixed(2)}s`;
    if (!fired) { fired = true; setTimeout(() => { if (onDone) onDone(); }, 300); }
  });
}

/* ── MEMEBOT IMAGE ───────────────────────────────── */
function renderMemebotImage(memeId, targetBody, onDone) {
  let done = false;
  const finish = () => { if (!done) { done = true; if (onDone) onDone(); } };

  let src;
  if (memeId && memeId.startsWith('assets/')) {
    src = memeId;
  } else {
    const meme = MEMES.find(m => m.id === memeId);
    if (!meme) { finish(); return; }
    src = meme.file;
  }
  const img = document.createElement('img');
  img.className = 'memebot-img'; img.alt = memeId; img.src = src;
  img.onload = () => { img.classList.add('loaded'); setTimeout(finish, 900); };
  img.onerror = () => {
    const mbFallback = appendLabelOnly('memebot', 'MEMEBOT');
    renderGreentext([">tried to post image",">it broke",">this is fine"], mbFallback, finish);
  };
  const container = targetBody || chatWindow;
  container.appendChild(img);
  scrollBottom();
  setTimeout(() => { if (!img.classList.contains('loaded')) { img.classList.add('loaded'); finish(); } }, 1500);
}

/* ── MEMEBOT GREENTEXT ───────────────────────────── */
function renderGreentext(lines, targetBody, onDone) {
  const container = targetBody || chatWindow;
  let i = 0;
  function nextLine() {
    if (i >= lines.length) { if (onDone) onDone(); return; }
    const line = lines[i++];
    const span = document.createElement('div'); span.className = 'gt-line'; container.appendChild(span); scrollBottom();
    const text = line.replace(/^>/, '').trim();
    let c = 0;
    function typeChar() {
      if (c < text.length) {
        span.textContent = text.slice(0, c+1); scrollBottom();
        const delay = text[c] === ' ' ? 50+Math.random()*30 : 22+Math.random()*22;
        c++;
        setTimeout(typeChar, delay);
      } else {
        setTimeout(nextLine, 230+Math.random()*130);
      }
    }
    setTimeout(typeChar, 40+Math.random()*35);
  }
  nextLine();
}

/* ── IMAGE GRID ──────────────────────────────────── */
function renderImageGrid(key, onDone) {
  const items = MEDIA[key];
  if (!items || !items.length) { if (onDone) onDone(); return; }
  const grid = document.createElement('div'); grid.className = 'img-grid';
  items.slice(0,6).forEach((item, idx) => {
    const a = document.createElement('div');
    a.className = 'img-grid-item';
    a.style.animationDelay = `${idx*0.08}s`;
    a.style.cursor = 'pointer';
    a.innerHTML = `<img src="${item.src}" alt="${item.label}" loading="lazy"><div class="img-grid-label">${item.label}</div>`;
    a.addEventListener('click', () => openLightbox(item));
    grid.appendChild(a);
  });
  chatWindow.appendChild(grid);
  scrollBottom();
  const animDuration = (items.slice(0,6).length - 1) * 80 + 600;
  setTimeout(() => { if (onDone) onDone(); }, animDuration);
}

/* ── LIGHTBOX ────────────────────────────────────── */
function openLightbox(item) {
  const existing = document.getElementById('lightbox');
  if (existing) existing.remove();
  const lb = document.createElement('div'); lb.id = 'lightbox'; lb.className = 'lightbox';
  const inner = document.createElement('div'); inner.className = 'lightbox-inner';
  const close = document.createElement('button'); close.className = 'lightbox-close'; close.textContent = '×';
  close.addEventListener('click', () => lb.remove());
  const img = document.createElement('img'); img.className = 'lightbox-img'; img.src = item.fullSrc; img.alt = item.label;
  const footer = document.createElement('div'); footer.className = 'lightbox-footer';
  const title = document.createElement('span'); title.className = 'lightbox-title'; title.textContent = item.label;
  footer.appendChild(title);
  if (item.caseStudyUrl) {
    const link = document.createElement('a');
    link.className = 'lightbox-link'; link.href = item.caseStudyUrl;
    link.target = '_blank'; link.rel = 'noopener'; link.textContent = 'View ↗';
    footer.appendChild(link);
  }
  inner.appendChild(close); inner.appendChild(img); inner.appendChild(footer); lb.appendChild(inner);
  lb.addEventListener('click', e => { if (e.target === lb) lb.remove(); });
  const onKey = e => { if (e.key === 'Escape') { lb.remove(); document.removeEventListener('keydown', onKey); } };
  document.addEventListener('keydown', onKey);
  document.body.appendChild(lb);
}

/* ── CHIPS ───────────────────────────────────────── */
function dismissAllChips() {
  chatWindow.querySelectorAll('.chips').forEach(row => {
    row.style.transition = 'opacity 0.25s ease';
    row.style.opacity = '0';
    row.style.pointerEvents = 'none';
    setTimeout(() => row.remove(), 260);
  });
}

function renderChips(chips) {
  if (!chips?.length) return;
  const existing = chatWindow.querySelectorAll('.chips');
  const last = existing[existing.length - 1];
  if (last) {
    const eLabels = [...last.querySelectorAll('.chip')].map(b => b.textContent).join(',');
    const nLabels = chips.map(c => typeof c === 'string' ? c : c.label).join(',');
    if (eLabels === nLabels) return;
  }
  const wrap = document.createElement('div'); wrap.className = 'chips';
  chips.forEach(chip => {
    const label = typeof chip === 'string' ? chip : chip.label;
    const route = typeof chip === 'string' ? null : chip.route;
    const btn = document.createElement('button'); btn.className = 'chip'; btn.textContent = label;
    btn.addEventListener('click', () => {
      dismissAllChips();
      if (route) fireIntent(route, label);
      else        sendMessage(label);
    });
    wrap.appendChild(btn);
  });
  chatWindow.appendChild(wrap);
  scrollBottom();
}

/* ── FIRE INTENT DIRECTLY ────────────────────────── */
async function fireIntent(intentId, label) {
  if (isWaiting) return;
  setWaiting(true);

  if (intentId === 'surprise') {
    appendMsg('user', label, 'You');
    conversationHistory.push({ role: 'user', content: label });
    const { body: typingBody } = appendMsg('sys', '', 'BEN OS', { typing: true });
    await new Promise(r => setTimeout(r, 200+Math.random()*140));
    playSurprise(typingBody);
    return;
  }

  const intent = INTENTS.find(i => i.id === intentId);
  if (!intent) { sendMessage(label); return; }

  appendMsg('user', label, 'You');
  conversationHistory.push({ role: 'user', content: label });
  statusLabel.textContent = '';

  const { body: typingBody } = appendMsg('sys', '', 'BEN OS', { typing: true });
  await new Promise(r => setTimeout(r, 200+Math.random()*140));

  if (intent.topic) sessionTopics.push(intent.topic);
  playIntent(intent, typingBody);
}

/* ── PLAY INTENT ─────────────────────────────────── */
function playIntent(intent, existingBody) {
  if (intent.state !== undefined) currentState = intent.state;

  /* Pool intent (misfortunes cycling) */
  if (intent.pool?.length) {
    const text = intent.pool[fortuneIndex % intent.pool.length];
    fortuneIndex++;
    const body = existingBody || appendLabelOnly('sys', 'BEN OS');
    if (existingBody) { existingBody.classList.remove('typing'); existingBody.textContent = ''; }
    typewriter(body, text, () => {
      renderChips(intent.chips);
      setWaiting(false);
    });
    return;
  }

  const beats     = intent.beats || [];
  const mediaKey  = intent.media;
  const afterBeats = intent.afterBeats || [];

  const finish = () => {
    renderChips(intent.chips);
    conversationHistory.push({ role: 'assistant', content: beats[beats.length-1]?.text || '' });
    statusLabel.textContent = '';
    setWaiting(false);
  };

  if (mediaKey) {
    renderBeats(beats, 'BEN OS', () => {
      renderImageGrid(mediaKey, () => {
        if (afterBeats.length) renderBeats(afterBeats, 'BEN OS', finish);
        else finish();
      });
    });
  } else {
    renderBeats(beats, 'BEN OS', finish);
  }
}

/* ── SURPRISE ME ─────────────────────────────────── */
function getSeenFacts() { try { return JSON.parse(localStorage.getItem('bo_seen_facts') || '[]'); } catch(e) { return []; } }
function markFactSeen(id) { try { const s = getSeenFacts(); if (!s.includes(id)) s.push(id); localStorage.setItem('bo_seen_facts', JSON.stringify(s)); } catch(e) {} }
function pickFact() {
  const seen = getSeenFacts();
  const unseen = FACTS.filter(f => !seen.includes(f.id));
  if (!unseen.length) { localStorage.removeItem('bo_seen_facts'); return FACTS[Math.floor(Math.random()*FACTS.length)]; }
  return unseen[Math.floor(Math.random()*unseen.length)];
}

function playSurprise(typingBody) {
  const fact = pickFact();
  markFactSeen(fact.id);
  typingBody.classList.remove('typing');
  typingBody.textContent = '';

  setTimeout(() => {
    typewriter(typingBody, fact.text, () => {
      const hasMeme      = fact.memebot_meme && MEMES.find(m => m.id === fact.memebot_meme);
      const hasGreentext = fact.memebot_greentext?.length;

      const afterMemebot = () => {
        const reactBody = appendLabelOnly('sys', 'BEN OS');
        typewriter(reactBody, fact.benos_reaction, () => {
          if (fact.memebot_greentext_2?.length) {
            const mb2Body = appendLabelOnly('memebot', 'MEMEBOT');
            renderGreentext(fact.memebot_greentext_2, mb2Body, () => { renderChips(fact.chips); setWaiting(false); });
          } else {
            renderChips(fact.chips); setWaiting(false);
          }
        });
      };

      if (hasMeme) {
        const mb1Body = appendLabelOnly('memebot', 'MEMEBOT');
        renderMemebotImage(fact.memebot_meme, mb1Body, afterMemebot);
      } else if (hasGreentext) {
        const mb1Body = appendLabelOnly('memebot', 'MEMEBOT');
        renderGreentext(fact.memebot_greentext, mb1Body, afterMemebot);
      } else {
        afterMemebot();
      }
    });
  }, 320);
}

/* ── PLAY VIGNETTE ───────────────────────────────── */
function playVignette(vignette, typingBody) {
  const doMemebot = () => {
    const mb = vignette.memebot;
    if (!mb) { fireVignetteReaction(vignette); return; }
    const vigMbBody = appendLabelOnly('memebot', 'MEMEBOT');
    if (mb.type === 'image')     renderMemebotImage(mb.id, vigMbBody, () => fireVignetteReaction(vignette));
    else if (mb.type === 'greentext') renderGreentext(mb.lines, vigMbBody, () => fireVignetteReaction(vignette));
    else fireVignetteReaction(vignette);
  };
  if (vignette.benos_setup) {
    typewriter(typingBody, vignette.benos_setup, doMemebot);
  } else {
    typingBody.classList.remove('typing'); typingBody.textContent = ''; doMemebot();
  }
}

function fireVignetteReaction(vignette) {
  if (!vignette.benos_reaction) { setWaiting(false); return; }
  const { body } = appendMsg('sys', '', 'BEN OS', { typing: true });
  typewriter(body, vignette.benos_reaction, () => {
    if (vignette.benos_reaction2) {
      const { body: b2 } = appendMsg('sys', '', 'BEN OS', { typing: true });
      typewriter(b2, vignette.benos_reaction2, () => { renderChips(vignette.buttons); setWaiting(false); });
    } else {
      renderChips(vignette.buttons); setWaiting(false);
    }
  });
}

/* ── PLAY EXACT TRIGGER ──────────────────────────── */
function playExactTrigger(trigger, typingBody) {
  /* Full beat sequence — mixed BEN OS / MEMEBOT beats */
  if (trigger.full_beats?.length) {
    if (typingBody) { typingBody.classList.remove('typing'); typingBody.remove(); }
    playFullBeatSequence(trigger.full_beats, 0, () => {
      renderChips(trigger.chips); setWaiting(false);
    });
    return;
  }

  const fireBenosResponse = () => {
    if (trigger.benos_beats?.length) {
      renderBeats(trigger.benos_beats, 'BEN OS', () => { renderChips(trigger.chips); setWaiting(false); });
    } else {
      renderChips(trigger.chips); setWaiting(false);
    }
  };
  if (trigger.memebot_image) {
    typingBody.classList.remove('typing'); typingBody.remove();
    const mbBody = appendLabelOnly('memebot', 'MEMEBOT');
    renderMemebotImage(trigger.memebot_image, mbBody, fireBenosResponse);
  } else {
    typingBody.classList.remove('typing'); typingBody.textContent = '';
    setTimeout(fireBenosResponse, 100);
  }
}

/* Plays a mixed-speaker beat sequence one beat at a time */
function playFullBeatSequence(beats, i, onComplete) {
  if (i >= beats.length) { if (onComplete) onComplete(); return; }
  const beat = beats[i];
  const next = () => {
    if (beat.pause) setTimeout(() => playFullBeatSequence(beats, i+1, onComplete), beat.pause);
    else playFullBeatSequence(beats, i+1, onComplete);
  };

  if (beat.type === 'image') {
    const mbBody = appendLabelOnly('memebot', 'MEMEBOT');
    renderMemebotImage(beat.src, mbBody, next);
  } else {
    const role = beat.speaker === 'MEMEBOT' ? 'memebot' : 'sys';
    const fast = beat.speaker !== 'MEMEBOT';
    const { body } = appendMsg(role, '', beat.speaker, { typing: true });
    typewriter(body, beat.text, next, fast);
  }
}

/* ── DOORS ───────────────────────────────────────── */
function dismissDoors() {
  clearTimeout(introTimer);
  idleDoorsEl.querySelectorAll('.door').forEach(btn => btn.classList.add('dismissing'));
  setTimeout(() => { idleDoorsEl.innerHTML = ''; doorsBuilt = false; }, 320);
}
function dismissDoorsSilent() {
  idleDoorsEl.style.transition = 'opacity 0.3s ease'; idleDoorsEl.style.opacity = '0';
  setTimeout(() => { idleDoorsEl.innerHTML = ''; idleDoorsEl.style.opacity = ''; idleDoorsEl.style.transition = ''; doorsBuilt = false; }, 300);
}
function buildDoors() {
  if (doorsBuilt || conversationHistory.length > 0) return;
  doorsBuilt = true; idleDoorsEl.innerHTML = '';
  ALL_DOORS.forEach((text, i) => {
    const btn = document.createElement('button');
    btn.className = 'door'; btn.textContent = text;
    btn.style.animationDelay = `${i * 0.12}s`;
    btn.addEventListener('click', () => { const txt = btn.textContent; dismissDoors(); setTimeout(() => sendMessage(txt), 150); });
    idleDoorsEl.appendChild(btn);
  });
  const introDelay = (MEM.get()?.count > 1) ? 10000 : 18000;
  introTimer = setTimeout(() => { if (conversationHistory.length === 0 && !introPlayed) playIntro(); }, introDelay);
}
function dimDoors() { idleDoorsEl.querySelectorAll('.door').forEach(btn => { btn.style.transition = 'opacity 0.6s ease'; btn.style.opacity = '0.35'; }); }
function restoreDoors() { idleDoorsEl.querySelectorAll('.door').forEach(btn => { btn.style.transition = 'opacity 0.6s ease'; btn.style.opacity = ''; }); }

/* ── PLAY INTRO ──────────────────────────────────── */
function playIntro() {
  if (introPlayed) return;
  introPlayed = true;
  setWaiting(true);
  const mem = MEM.get();
  const isReturn = mem && mem.count > 1;
  const inputWrap = document.querySelector('.input-wrap');
  inputWrap.classList.add('awakening');
  setTimeout(() => {
    inputWrap.classList.remove('awakening');
    dimDoors();
    const beats = isReturn
      ? [{ text: 'BEN OS — back online.', pause: 700, display: 'default' }, { text: returnGreeting(mem), pause: 0, display: 'default' }]
      : FIRST_INTRO;
    renderBeats(beats, 'BEN OS', () => { restoreDoors(); setWaiting(false); });
  }, 1200);
}

/* ── CLAUDE API FALLBACK ─────────────────────────── */
const SYS = `You are BEN OS — an AI on Ben Olivas's creative consulting and portfolio site.
Voice: dry, competent, occasionally funny, slightly ahead of the visitor.
Ben: creative producer and graphic designer, Los Angeles. Currently at Blue Note Los Angeles. Open to freelance: benolivas@gmail.com.
Personal projects: Misfortune Cookies (misfortunes.net), Man Ray chess set, Whisper MK-I acoustic device.
Rules: under 3 sentences. Never start with "I", "Sure", "Great question". Never mention being an AI unless asked.`;

async function callClaude(messages) {
  try {
    const res = await fetch('./proxy.php', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages, system: SYS })
    });
    const d = await res.json();
    return d.content || "Something went wrong. Try benolivas@gmail.com directly.";
  } catch(e) { return "Can't reach the API. Direct line: benolivas@gmail.com."; }
}

/* ── SEND MESSAGE ────────────────────────────────── */
async function sendMessage(text) {
  if (isWaiting || !text.trim()) return;
  setWaiting(true);

  const input = text.trim();
  lastUserInput = input;
  userInput.value = '';
  autoResize();
  if (doorsBuilt) dismissDoors();
  dismissAllChips();
  clearTimeout(introTimer);

  appendMsg('user', input, 'You', { isAction: input.startsWith('*') && input.endsWith('*') });
  conversationHistory.push({ role: 'user', content: input });
  statusLabel.textContent = '';

  /* 1. Pre-filter */
  const filtered = preFilter(input);
  if (filtered) {
    const { body } = appendMsg('sys', '', 'BEN OS', { typing: true });
    await new Promise(r => setTimeout(r, 160));
    typewriter(body, filtered, () => setWaiting(false));
    return;
  }

  /* 2. Exact trigger — easter eggs, pre-normalization */
  const exactTrigger = matchExact(input);
  if (exactTrigger) {
    await new Promise(r => setTimeout(r, 180+Math.random()*120));
    if (exactTrigger.full_beats?.length) {
      /* full_beats builds its own rows — no typing bubble needed */
      playExactTrigger(exactTrigger, null);
    } else {
      const { body: typingBody } = appendMsg('sys', '', 'BEN OS', { typing: true });
      playExactTrigger(exactTrigger, typingBody);
    }
    conversationHistory.push({ role: 'assistant', content: exactTrigger.full_beats?.[0]?.text || exactTrigger.benos_beats?.[0]?.text || '...' });
    return;
  }

  /* 3. Misfortune pool — exact phrase lookup */
  if (matchMisfortune(input)) {
    const { body: typingBody } = appendMsg('sys', '', 'BEN OS', { typing: true });
    await new Promise(r => setTimeout(r, 180+Math.random()*120));
    typingBody.classList.remove('typing'); typingBody.textContent = '';
    const fortuneIntent = INTENTS.find(i => i.id === 'misfortunes');
    if (fortuneIntent) playIntent(fortuneIntent, typingBody);
    return;
  }

  /* 4. Vignette */
  const vignette = matchVignette(input);
  if (vignette) {
    const { body: typingBody } = appendMsg('sys', '', 'BEN OS', { typing: true });
    await new Promise(r => setTimeout(r, 180+Math.random()*120));
    playVignette(vignette, typingBody);
    conversationHistory.push({ role: 'assistant', content: vignette.benos_setup || vignette.benos_reaction || '' });
    return;
  }

  /* 5. Intent match */
  const { body: typingBody } = appendMsg('sys', '', 'BEN OS', { typing: true });
  await new Promise(r => setTimeout(r, 220+Math.random()*160));

  const intent = matchIntent(input);

  if (intent) {
    if (intent.special === 'surprise') {
      playSurprise(typingBody);
      conversationHistory.push({ role: 'assistant', content: '...' });
      return;
    }
    if (intent.special === 'dark_mode') {
      const lower = normalize(input);
      const turningOn = lower.includes('dark') || lower.includes('3am') || lower.includes('off');
      const isDark = document.body.classList.contains('dark');
      let response;
      if (turningOn && !isDark)      { setDark(true);  response = "Done. Easier on the eyes."; }
      else if (!turningOn && isDark) { setDark(false); response = "Back to daylight."; }
      else                           { response = isDark ? "Already dark." : "Already light."; }
      typewriter(typingBody, response, () => { setWaiting(false); statusLabel.textContent = ''; });
      conversationHistory.push({ role: 'assistant', content: response });
      return;
    }
    if (intent.topic) sessionTopics.push(intent.topic);
    playIntent(intent, typingBody);
  } else {
    /* 6. Claude API fallback */
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
  if (isWaiting) { userInput.value = ''; return; }
  autoResize();
  if (doorsBuilt) dismissDoorsSilent();
  clearTimeout(introTimer);
});
userInput.addEventListener('keydown', e => {
  if (isWaiting) { e.preventDefault(); return; }
  if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(userInput.value); }
});
sendBtn.addEventListener('click', () => { if (!isWaiting) sendMessage(userInput.value); });

/* ── SAVE TOPICS ON UNLOAD ───────────────────────── */
window.addEventListener('beforeunload', () => {
  if (sessionTopics.length) {
    const mem = MEM.get() || {};
    mem.topics = [...(mem.topics || []), ...sessionTopics].slice(-10);
    MEM.set(mem);
  }
});

/* ── INIT ────────────────────────────────────────── */
function init() {
  MEM.record(sessionTopics);
  const mem = MEM.get();
  if (mem?.dark) setDark(true);
  const isReturn = mem && mem.count > 1;
  setTimeout(buildDoors, isReturn ? 1500 : 3000);
  setupContactPopup();
  userInput.focus();

  /* Sticky input detection */
  const sentinel = document.createElement('div');
  sentinel.style.cssText = 'height:1px;margin-bottom:-1px;pointer-events:none;';
  document.getElementById('input-area').before(sentinel);
  new IntersectionObserver(
    ([entry]) => document.getElementById('input-area').classList.toggle('is-sticky', !entry.isIntersecting),
    { threshold: 0, rootMargin: '0px' }
  ).observe(sentinel);
}

init();
