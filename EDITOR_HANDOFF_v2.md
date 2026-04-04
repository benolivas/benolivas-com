# BEN OS — Flow Editor Handoff v2
**Date:** 2026-04-03
**Editor version:** v7+ (benos-flow-editor.html, ~1026 lines)
**Purpose:** Full context for continuing editor development and generating chat.js
**Supplies:** Provide this doc + benos-flow-editor.html + a saved .json export

---

## 1. WHAT THIS IS

benolivas.com is a portfolio site for Ben Olivas (graphic designer, creative producer, Blue Note Los Angeles) built as a conversational chat interface. Stack: vanilla HTML/CSS/JS, no framework. Two characters:

- **BEN OS** — primary AI. Dry, competent, types fast. Gold accent color.
- **MEMEBOT** — secondary. Gen Z, irreverent, memes + greentext. Types slow. Orange (`#C4622D`).

The **Flow Editor** is a single-file HTML/JS/CSS visual node editor (`benos-flow-editor.html`) for designing the conversation flow. It is self-contained — open in Chrome, no server needed. It saves to browser localStorage and exports `.json` (lossless) and `.md` (human-readable script format).

**Current workflow:**
1. Design flow in editor
2. Save JSON (persistent) + Export .md (for human review)
3. Share JSON + this handoff with Claude → Claude generates chat.js
4. Deploy chat.js to site

**Goal workflow (not yet reached):**
1. Design in editor
2. Export JSON → automated or Claude-assisted conversion to chat.js
3. JSON becomes the canonical source of truth, replacing SCRIPT.md

---

## 2. EDITOR — CURRENT FEATURE STATE

### Built and working
- Infinite canvas with pan/zoom, SVG wire layer (inside canvas transform so wires track correctly)
- Branch nodes with drag-to-move (10px snap grid)
- All branch types: **branch, memebot, special, vignette, intro, exact, fallback**
- Beat editor: text, pool, photo grid, image, video, component
- Beat fields: speaker (BEN OS/MEMEBOT), pause (ms), display (new row/newline/inline)
- Pool beats: random, cycle, cycle-session, weighted modes; per-variant weight inputs; collapsible continuations per variant (beats + chips)
- Invisible buttons (text-triggered, pattern matching, scopeable to state)
- Catch-all buttons (one per resp-block max; normal or priority)
- Wire system: drag output dot → input dot; wires color-coded by target branch type; self-loop wires render as dashed rightward arc
- Wire + inline child conflict detection: ⚠ badge on card, warning in detail panel, confirm prompts both ways; × Remove wire and × Remove inline response to resolve
- Triggers on all button types (visible buttons can also respond to typed text)
- Resizable sidebar (drag left edge, 220–520px, persists to localStorage)
- Save to localStorage (key: `benos_v7`), Save JSON (download), Load JSON (file picker)
- Export .md (SCRIPT.md-compatible format with pause/display annotations)
- Drag-to-reorder: beats, buttons, pool variants (⠷ handle)
- Memory panel (floating, toggleable): all localStorage variables documented
- Intro branch: first-visit beats, 6 return-visit variants, door buttons, default chatbar placeholder field
- Chatbar customization per branch: placeholder text override, disabled/chips-only mode
- Fallback branch type: global catch-all, one allowed, red striped border
- Systematic tooltips on all toolbar buttons, beat types, display modes, dots
- Color system: branch=gold, intro=green, vignette=purple, memebot=orange, special=blue, exact=red, fallback=striped red
- Wire colors match target branch type (via CSS vars, dark-mode compatible)
- Migration function: old saves get missing fields filled with safe defaults on load
- Minimap (bottom-left), clickable for navigation

### localStorage keys
- `benos_v7` — editor save data
- `benos_dk9` — dark mode preference
- `benos_dpw` — sidebar width

### Known issues / not yet built
- **Drag-to-reorder works in detail panel only** — card-level button order matches, but the visual card doesn't re-render button order on canvas without reopening DP
- **Variant chip wiring** — variant continuation chips have output dots but they're positioned approximately (at branch card center-right), not aligned to specific rows
- **Vignette structure not enforced** — vignettes are free-form beats; the three-beat structure (BEN OS setup → MemeBot → BEN OS reaction) is convention, not enforced by editor
- **FACTS not a branch type** — Surprise Me rotating facts (`FACTS[]` in chat.js) have their own structure that doesn't map cleanly to any current branch type; currently approximated with pool beats on a `special` branch
- **Media library** — photo grid collections are referenced by name string (design/video/posters/blue-note/aerovironment) but there's no visual media manager; paths are typed manually
- **PDF beat type** — data model field exists (`type: 'pdf'`), beat type button not yet in editor UI, chat.js render function not written
- **Chatbar customization runtime** — editor stores the data; chat.js doesn't read it yet
- **Cycle-session pool** — editor stores `poolMode: 'cycle-session'`; chat.js doesn't implement the localStorage tracking yet
- **Pop-out nested flow** — requested feature: convert an inline child response into its own branch node
- **Auto-arrange** — no layout algorithm; branches positioned manually
- **JSON → chat.js pipeline** — no automated conversion; Claude does it manually using this handoff

---

## 3. DATA MODEL

### Branch
```json
{
  "id": "who_is_ben",
  "type": "branch",
  "x": 540, "y": 340,
  "triggers": ["who is ben", "tell me about ben"],
  "state": "who_is_ben",
  "topic": "design",
  "special": "none",
  "exactMatch": "",
  "isGlobalFallback": false,
  "chatbar": { "placeholder": "", "disabled": false },
  "root": { ...Resp }
}
```

**Branch types:** `branch` `memebot` `special` `vignette` `intro` `exact` `fallback`

**Special notes:**
- `intro` has an additional `introPool` field (see below) and no triggers
- `exact` uses `exactMatch` string instead of triggers; checked pre-normalization
- `fallback` has no triggers; fires when nothing else matches anywhere
- `memebot` / `special` are structurally identical to `branch`; type is semantic

### Resp (Response block)
```json
{
  "rid": "who_is_ben.showme",
  "beats": [ ...Beat ],
  "buttons": [ ...Button ]
}
```

RIDs are auto-generated: `branchId.firstwords.morewords` — walks button label words until unique among siblings. Stable across renames (branch rename updates all wires automatically).

### Beat
```json
{
  "id": "bt_abc",
  "speaker": "BEN OS",
  "type": "text",
  "text": "Graphic designer. Los Angeles.",
  "pause": 500,
  "display": "newline",
  "isPool": false,
  "poolMode": "random",
  "variants": [],
  "media": null
}
```

**Beat types:** `text` `pool` `grid` `image` `video` `component`

**Display values:** `"default"` (new row) `"newline"` (same bubble) `"inline"` (append same line)

**Pool variant:**
```json
{
  "id": "v_xyz",
  "text": "Did you know that Ben...",
  "weight": 1,
  "beats": [ ...Beat ],
  "buttons": [ ...Button ]
}
```

**Media objects by type:**
- `grid`: `{ collection: "design", picks: [] }`
- `image`: `{ memeId: "skeleton-boredom", src: "" }`
- `video`: `{ url: "", label: "", thumb: "" }`
- `component`: `{ kind: "dark_mode" }`

### Button
```json
{
  "id": "b_abc",
  "label": "Show me the work.",
  "visible": true,
  "btnType": "normal",
  "priority": false,
  "wireTarget": "show_work",
  "child": null,
  "triggers": ["show me work", "portfolio"],
  "scopedState": ""
}
```

**Button types:**
- `visible: true, btnType: "normal"` → visible chip
- `visible: false, btnType: "normal"` → invisible (text-triggered only); uses `triggers[]` and optionally `scopedState`
- `btnType: "catchall"` → fires when nothing matches; `priority: true` overrides nodes
- Both `wireTarget` AND `child` can exist (ambiguous — wire takes priority at runtime; editor flags with ⚠)

### Intro branch
```json
{
  "id": "intro",
  "type": "intro",
  "introPool": {
    "chatbarDefault": "Ask me something.",
    "firstVisit": [ ...Beat ],
    "returnVisits": [
      { "condition": "2nd_visit", "beats": [ ...Beat ] },
      { "condition": "same_hour", "beats": [ ...Beat ] },
      { "condition": "same_day", "beats": [ ...Beat ] },
      { "condition": "within_week", "beats": [ ...Beat ] },
      { "condition": "within_month", "beats": [ ...Beat ] },
      { "condition": "longer", "beats": [ ...Beat ] }
    ]
  },
  "root": { "rid": "intro", "beats": [], "buttons": [ ...door buttons ] }
}
```

The `root.buttons` are the door chips shown after intro plays. They wire to other branches.

---

## 4. EDITOR → chat.js MAPPING

### Priority order (runtime)
1. Wired buttons (explicit node connections)
2. Nested inline buttons (chip expands content within same branch)
3. Invisible buttons (pattern-matched against typed input; scoped to state if `scopedState` set)
4. Catch-all (fires when nothing else matches at current response depth)

### Branch → Intent
| Editor | chat.js |
|---|---|
| `id` | `id` |
| `triggers[]` | `patterns[]` |
| `state` | `state` (sets `currentState`) |
| `topic` | `topic` (saved to localStorage) |
| `special: "surprise"` | `special: 'surprise'` handler |
| `special: "dark_mode"` | `special: 'dark_mode'` handler |
| `type === "exact"` + `exactMatch` | Entry in `EXACT_TRIGGERS[]` |
| `type === "vignette"` | Entry in `VIGNETTES[]` |
| `type === "fallback"` | Replaces Claude API fallback in `sendMessage()` |
| `type === "intro"` | `FIRST_INTRO` beats + `returnGreeting()` update |
| `chatbar.placeholder` | Per-branch input placeholder (runtime, not yet wired) |
| `chatbar.disabled` | Chips-only mode (runtime, not yet wired) |

### Button → Chip
| Editor | chat.js |
|---|---|
| `visible: true, wireTarget` | `{ label, route: targetBranchId }` chip |
| `visible: true, triggers[]` | Also add to intent `patterns[]` |
| `visible: false, triggers[], scopedState: ""` | Global entry in `patterns[]` |
| `visible: false, triggers[], scopedState: "x"` | Entry in `nestedPatterns["x"]` |
| `btnType: "catchall", priority: false` | Wildcard `*` in `nestedPatterns` |
| `btnType: "catchall", priority: true` | Pre-filter check before intent matching |

### Beat → Beat object
| Editor | chat.js |
|---|---|
| `display: "default"` | `type` field omitted |
| `display: "newline"` | `type: 'newline'` |
| `display: "inline"` | `type: 'inline'` |
| `speaker: "MEMEBOT"` | Passed to `renderBeats(beats, 'MEMEBOT', cb)` |
| `type: "grid"` | `media: collectionName` on intent |
| `type: "image", memeId` | `renderMemebotImage(memeId, ...)` call |
| `type: "pool", poolMode: "cycle"` | `playSurprise()` pattern with seen-tracking |
| `type: "component", kind: "dark_mode"` | `[TOGGLE: dark_mode]` in beat text |

### Memory tokens (resolved at runtime in chat.js)
- `[ECHO]` → user's last input, capitalized, + `!`
- `[NAME]` → captured and saved name from `extractName()`
- `[TOPIC]` → last saved topic from localStorage
- `[LINK: url | text]` → rendered as inline anchor after typing

---

## 5. chat.js ARCHITECTURE (don't rewrite the engine)

The file has two sections separated by a comment banner:

```
/* ════ SCRIPT DATA ════ */   ← this is what you're updating
/* ════ ENGINE ════ */        ← don't touch unless adding new render functions
```

### Current intent IDs (live site)
`distress` `greeting` `thanks` `ok` `im_ben` `identity_theft_pt2` `what_do_you_do` `who_is_ben` `who_is_ben_pt2` `what_is_benos` `is_ai` `how_works` `surprise` `dark_mode` `predict_future` `available` `contact` `need_video` `show_video` `video_vs_static` `need_design` `need_poster` `show_design` `color_psychology` `show_work` `portfolio_pdf` `rebrand` `why_rebrand_fail` `conversions` `conversions_static` `social_proof` `generate_image` `generation_response` `generate_interactive` `generate_explain` `generate_save` `chess_prediction` `unusual` `chess` `misfortunes` `whisper` `weapon_legal` `blue_note` `blue_note_work` `man_ray_who` `can_buy_chess` `worst_fortune`

Vignettes: `all-ears` `overwhelmed` `goodbye`
Exact triggers: `open_sesame`
Facts: `fact-sonic` `fact-chess` `fact-career` `fact-pdf` `fact-cookies` `fact-manray`

### Key engine functions
```js
renderBeats(beats, who, onComplete)   // who: 'BEN OS' | 'MEMEBOT'
renderChips(chips)                     // [{label, route}] or [string]
renderImageGrid(key, onDone)           // key = MEDIA catalog key
renderMemebotImage(memeId, body, cb)   // looks up MEMES catalog
renderGreentext(lines, body, cb)       // MemeBot greentext lines
typewriter(el, text, onDone, fast)     // fast=true for BEN OS
playSurprise(typingBody)               // cycles FACTS with seen-tracking
```

### Pattern matching scores
- Nested specific (exact): 200 | (contains): 130+
- Global (exact): 100 | (contains): 60+ | word overlap: proportional
- State wildcard `*`: fires only if nothing scores > 18
- Threshold for Claude API fallback: 18

---

## 6. KNOWN GAPS IN LIVE chat.js

- `distress` intent: response not written — placeholder text only
- Animation pass: no cubic-bezier easing, no scroll-lock during typing, no blur-fade text arrival
- `ok/ECHO` intent too broad: matches long sentences, should be single-word only
- Subgrid click behavior not implemented
- Asset paths still pointing to old benolivas.com (TIME-SENSITIVE — old site may go down)
- Chatbar customization: editor has data, chat.js doesn't read it
- Cycle-session pool: editor stores mode, chat.js doesn't track seen variants in localStorage
- PDF beat type: not implemented anywhere yet

---

## 7. EXPORT FORMAT REFERENCE

The .md export uses SCRIPT.md-compatible format:

```
=== BRANCH: who_is_ben [branch] ===
TRIGGERS: who is ben, tell me about ben
STATE: who_is_ben
*Topic saved: design*

[RESP: who_is_ben]
> [BEN OS] Graphic designer and creative producer. Los Angeles.  *(pause 500ms, newline)*
> [BEN OS] What do you need?  *(pause 0ms)*

"Show me the work." [also: show me work,portfolio] → WIRE:show_work
"What's Blue Note?"
  [RESP: who_is_ben.whatsblue]
  > [BEN OS] Blue Note LA. In-house designer.  *(pause 500ms, newline)*

"what do you do" [INVISIBLE] patterns:what do you do,services state:who_is_ben
"[catch-all]" [CATCHALL] → WIRE:fallback
---
```

The JSON export is preferred for programmatic conversion. Use .md for human review and git archiving.

---

## 8. FUTURE WORK (documented for forward compatibility)

### Live site preview toggle
**Goal:** A button in the editor toolbar that opens the live site with the active branch highlighted or jumped to.

**How to build:** The editor already outputs stable branch IDs that map to intent IDs in chat.js. The toggle would:
1. Open `benolivas.com` (or sandbox) in a new tab with a URL parameter: `?branch=who_is_ben`
2. chat.js reads the param on load and fires that intent immediately
3. Optionally: postMessage bridge so editor and site communicate live

**Compatibility requirement:** Branch IDs in editor JSON must stay stable and match intent IDs in chat.js 1:1. This is currently true. Don't break it.

**Implementation note:** Add `?branch=X` URL param handler to chat.js `init()` — check for param, find matching intent, call `fireIntent(intentId, '')` after intro plays. Low effort, high value.

### JSON as human-readable canonical source
**Goal:** Deprecate SCRIPT.md. Make the JSON export readable enough that Ben can review and understand it without needing the editor.

**Current state:** JSON is lossless but dense. Not human-readable without the editor.

**Path forward:**
1. Add a "pretty export" mode that outputs a more indented, commented JSON with branch names as top-level keys rather than array indices
2. Or: keep .md export as the human-readable layer, use JSON as the machine layer, let Claude convert between them on request
3. Either way: the JSON schema is stable enough to be canonical now — SCRIPT.md can become a read-only artifact generated from the editor rather than the source

**Schema stability note:** The current JSON schema (v7) covers: all beat types, pause/display, pool variants with continuations, invisible/catchall buttons with scoping, intro with return variants, wires, branch metadata (state/topic/special/chatbar). What it doesn't yet cover: vignette three-beat enforcement, FACTS pool format, easter egg exact triggers (these need a dedicated branch type or field).

### Branch type consolidation
Current types: branch, memebot, special, vignette, intro, exact, fallback — 7 types.

**Consolidation candidates:**
- `memebot` → could be `branch` where first beat speaker is MEMEBOT. Type distinction is semantic only.
- `special` → could be `branch` with `special` handler field set (already exists). As `surprise` gets replaced by pool beats and `dark_mode` by component beats, `special` becomes vestigial.
- Eventual target: **branch, vignette, intro, exact, fallback** — 5 types, each structurally distinct.

### Media library panel
**Current:** Photo grid collections referenced by name string. Paths typed manually per beat.
**Goal:** Floating panel (like memory panel) listing all named collections with their file paths. Ability to add/rename collections, preview thumbnails, manage individual assets.
**Compatibility:** Collection names in beats are just strings — panel would just provide a UI for managing what those strings mean.

### PDF media type
**Editor:** Data model has `type: 'pdf'` beat; UI button not added yet.
**chat.js:** No render function written.
**Design:** Clean card display in chat window — document icon, filename/label, description, "Open ↗" link. Blur-to-sharp load animation. No iframe embed.
**Files to touch:** `chat.js` (render function), `style.css` (card styles), editor (beat type button).

### Chatbar customization (runtime)
**Editor:** Stores `branch.chatbar = { placeholder: "", disabled: false }`.
**chat.js needs:** Read `currentBranchChatbar` when an intent fires; update `#user-input` placeholder; set `isWaiting` style when disabled.
**Intro chatbar:** `introPool.chatbarDefault` is the site default placeholder.

### Cycle-session pool (runtime)
**Editor:** Stores `poolMode: "cycle-session"`.
**chat.js needs:** localStorage key per pool beat ID tracking which variants have been seen this session. Reset when all seen. Same pattern as existing `bo_seen_facts` key for the Surprise Me facts.

---

## 9. VOICE & CHARACTER NOTES (non-negotiable)

- BEN OS never starts a response with "I", "Sure", "Great question", or any affirmation
- BEN OS is dry, warm, specific — not generic AI phrasing
- MEMEBOT and BEN OS never speak simultaneously — strict sequential callback timing
- All timing via sequential callbacks in `renderBeats()` — no guessed `setTimeout` delays
- Chip routing uses `route: intentId` not pattern matching (chips bypass the matcher)
- `currentState` is runtime-only — not saved between visits

---

## 10. DEPLOYMENT

```bash
# Local dev: open index.html directly in Chrome
# proxy.php must be present for Claude API fallback (never in git)

git add -A
git commit -m "describe change"
git push
# Dreamhost: git pull on server (or webhook)
```

API model in proxy.php: `claude-sonnet-4-5` — update to latest Sonnet as needed.

Git repo: https://github.com/benolivas/benolivas-com (private)

---

*End of handoff v2.*
*Supply this doc + benos-flow-editor.html + a .json export from the editor.*
*The JSON is the script. The handoff is the context. The editor is the tool.*
