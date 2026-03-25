# benolivas.com — BEN OS v2.2

## The short version

**To change what BEN OS says:** open a file in `data/`, edit the text, save, refresh the browser.

**To push changes to GitHub:** three commands in the terminal (see bottom of this file).

**Never need to touch:** `chat.js`, `style.css`, `index.html` — unless something structural is changing.

---

## The files and what they do

```
benolivas.com/
│
├── index.html        ← the page itself. Don't touch unless changing layout.
├── style.css         ← colors, fonts, spacing. Don't touch unless changing visuals.
├── chat.js           ← the engine. Don't touch unless adding a new feature type.
│
├── data/             ← EDIT THESE. This is where the script lives.
│   ├── intents.json      ← every response BEN OS gives to user input
│   ├── facts.json        ← the Surprise Me rotating facts + MemeBot reactions
│   ├── vignettes.json    ← MemeBot scripted moments (triggered by specific phrases)
│   ├── memes.json        ← meme image library (filenames, alt text, when to use)
│   └── portfolio.json    ← work catalog (not fully wired yet)
│
└── assets/
    ├── logo/             ← BenOlivasLogo3.png goes here
    ├── memes/            ← meme image files go here
    ├── memebot/          ← MemeBot character face crops (future)
    └── portfolio/        ← portfolio images (future)
```

---

## How to edit the script

### Changing what BEN OS says to a specific question

Open `data/intents.json`. Find the entry by its `_note` or `id`. Change the text in `"beats"`.

Example — changing the greeting:
```json
{
  "id": "greeting",
  "_note": "Fires when someone just says hi",
  "patterns": ["hi", "hello", "hey"],
  "beats": [
    { "text": "Hey. What do you need?", "pause": 0 }
  ]
}
```
Change `"Hey. What do you need?"` to whatever you want. Save. Refresh browser.

### Adding a pause between sentences

Each beat is one typed message. Add another beat object with a `pause` value (milliseconds).
`pause: 600` = 0.6 second gap. `pause: 0` = no gap (always use 0 on the last beat).

```json
"beats": [
  { "text": "First sentence.", "pause": 700 },
  { "text": "Second sentence.", "pause": 500 },
  { "text": "Final question?", "pause": 0 }
]
```

### Adding a new response branch

Add a new object to the `"intents"` array in `intents.json`:

```json
{
  "id": "something_unique",
  "_note": "What this is for — your own reference, not shown to users",
  "patterns": ["phrase that triggers it", "another way they might say it"],
  "beats": [
    { "text": "BEN OS response here.", "pause": 0 }
  ]
}
```

### Adding follow-up buttons after a response

Add a `"chips"` field:
```json
"chips": ["Button one", "Button two", "Button three"]
```

### Changing a Surprise Me fact

Open `data/facts.json`. Each fact has:
- `"text"` — what BEN OS starts saying (gets cut off by MemeBot mid-sentence)
- `"memebot_meme"` — image MemeBot posts (must match an id in memes.json)
- `"memebot_greentext"` — if MemeBot posts text lines instead of an image
- `"benos_reaction"` — BEN OS one-liner after MemeBot
- `"memebot_greentext_2"` — MemeBot's second beat after BEN OS reacts
- `"chips"` — buttons shown at the end

### Adding a new meme

1. Drop the image into `assets/memes/`
2. Add an entry to `data/memes.json` in the `"finished"` array:
```json
{
  "id": "your-meme-name",
  "file": "assets/memes/your-meme-name.jpg",
  "alt": "describe what's in the image",
  "format": "image",
  "notes": "when to use this"
}
```
3. Reference it in `facts.json` or `vignettes.json` by its id.

---

## Previewing locally

Direct double-click on `index.html` will not load JSON files — browser security blocks it.

**One-time setup:**
1. Open VSCode
2. Extensions panel (square icon, left sidebar) → search **Live Server** → Install (by Ritwick Dey)

**Every session:**
- Right-click `index.html` in the Explorer panel → **Open with Live Server**
- Browser opens at `http://127.0.0.1:5500` and everything works

---

## Pushing changes to GitHub

Open terminal in VSCode (Ctrl + backtick) → select Command Prompt → run:

```
git add -A
git commit -m "describe what you changed"
git push
```

---

## Quick verification commands

```
ls assets/memes/
git status
git diff --name-only
```
