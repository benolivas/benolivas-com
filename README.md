# benolivas.com — BEN OS v2.4

## The short version

**To change what BEN OS says:** edit `SCRIPT.md`, share with Claude, Claude converts to `chat.js`.

**To push changes to GitHub:**
```
git add -A
git commit -m "describe what changed"
git push
```

**Never touch directly:** `chat.js`, `style.css`, `index.html` — unless Claude is making a structural change.

---

## File structure

```
benolivas.com/
│
├── index.html          ← page layout and static UI copy (title, nav, placeholder text)
├── style.css           ← all visual styling — colors, fonts, spacing, animations
├── chat.js             ← the engine — script data + all rendering logic
│
├── SCRIPT.md           ← EDIT THIS — human-readable script. Share with Claude to convert.
│
├── versions/           ← read-only script archives. One snapshot per milestone.
│   └── SCRIPT.YY.MM.DD.HHMM.md
│
├── data/               ← legacy folder, currently unused.
│
└── assets/
    ├── logo/           ← BenOlivasLogo3.png
    ├── memes/          ← meme image files (webp, gif, jpg, jpeg)
    ├── portfolio/      ← portfolio images (⚠️ migrating from old site)
    └── generated/      ← prerendered assets for magic tricks (⚠️ not yet created)
```

---

## How to edit the script

1. Open `SCRIPT.md`
2. Make edits — add intents, change copy, add chips, etc.
3. Archive: copy `SCRIPT.md` to `versions/SCRIPT.YY.MM.DD.HHMM.md`
4. Share updated `SCRIPT.md` with Claude
5. Claude converts and delivers updated `chat.js`
6. Replace `chat.js`, test locally, push

See `SCRIPT.md → HOW TO READ THIS` for full format reference.

---

## UI copy (static text in index.html)

| Element | Current value |
|---|---|
| Page title | "Ben Olivas" |
| Input placeholder | "Ask me something." |
| Header tagline | "Creative Producer · Graphic Designer · Los Angeles" |
| Watermark | "BEN OS V2.2" |
| Nav link 1 | "Portfolio PDF ↗" → benolivas.com/portfolio |
| Nav link 2 | "Contact" → triggers popup |
| Contact popup | benolivas@gmail.com, LinkedIn ↗, Behance ↗ |

---

## Working memory (localStorage)

Persists indefinitely until user clears browser data. Key: `bo_visit`.

| Key | What it stores |
|---|---|
| `count` | Visit count |
| `first` | First visit timestamp |
| `last` | Last visit timestamp |
| `topics` | Array of topics from `*Topic saved:*` annotations |
| `dark` | Dark mode preference |
| `name` | User's name if shared |

---

## Previewing locally

Right-click `index.html` in VSCode → **Open with Live Server**
(requires Live Server extension by Ritwick Dey)

---

## Git workflow

```bash
git pull                          # always pull before starting on a new device
git add -A
git commit -m "describe change"
git push

# if pull fails with diverged branches:
git config pull.rebase false
git pull
```

One active device at a time. Never edit on two machines simultaneously.

---

## Known gaps

See `SCRIPT.md → KNOWN GAPS / TODO` for full list. Top priorities:

- `assets/portfolio/` — migrate from old benolivas.com before it goes down
- `assets/generated/` — create folder + prerendered gifs for magic tricks
- `assets/memes/open-sesame.gif` — not yet sourced
- Animation pass — easing, scroll lock during typing, smoother text arrival
- Lightbox — gallery/slideshow, project copy, video embed

## Planned / on backburner

- Visual GUI script editor (nested node structure)
- Jazz admat / Blue Note poster generator
- Unmatched input logging (post-launch)
- Project pages / case studies
- `## GOTCHAS` script section
