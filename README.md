# benolivas.com — chat interface
## BEN OS v2.2

## File structure
```
benolivas.com/
├── index.html           ← markup shell
├── style.css            ← styling, dark mode, DM Sans
├── chat.js              ← intent engine, vignettes, MemeBot scaffolding, pacing
├── proxy.php            ← Anthropic API proxy (NOT in git — contains API key)
├── .gitignore           ← keeps proxy.php off GitHub
├── README.md
├── data/
│   ├── memes.json       ← annotated meme library
│   ├── facts.json       ← rotating "Did you know" facts for Surprise Me path
│   ├── vignettes.json   ← MemeBot three-beat moments
│   └── portfolio.json   ← work catalog with tags
└── assets/
    ├── memes/           ← finished meme images + raw templates
    │   └── .gitkeep
    └── memebot/         ← MemeBot character state crops
        └── .gitkeep
```

## Local setup
Open `index.html` directly in a browser. The Claude API fallback requires a local server + proxy (CORS), but the full static intent tree, vignettes, and MemeBot rendering work offline once meme assets are added to `assets/memes/`.

For API testing locally: use VS Code Live Server or `python -m http.server 8000` and make sure proxy.php is served by a local PHP server.

---

## What changed in v2.2

- **New intents:** `who_is_ben`, `what_is_benos`, `im_ben`, `predict_future`, `dark_mode`
- **Door update:** "Predict my future?" replaces "What's Misfortune Cookies?"
- **Contact popup:** nav "Contact" link now opens inline popup with email, LinkedIn, Behance
- **Dark mode:** toggle via text ("dark mode", "it's 3am", etc.) — persisted in localStorage
- **Vignette system wired:** `vignettes.json` matched against user input, MemeBot renders image + greentext
- **MemeBot rendering:** blur-to-sharp image load, greentext style, separate label color (#C4622D)
- **Pre-filters:** long input redirect, keyboard smash detection, hate mail catch
- **Typewriter:** MemeBot types slow (buffering), BEN OS fast — same `charDelay()` function with speed multiplier
- **Goodbye beat:** "Take care." → MemeBot temporary-person image → BEN OS says nothing
- **dismissDoors fixed:** removed redundant if/else branch
- **JSON data loading:** all four data files fetched from `data/` on init (non-blocking, falls back gracefully)
- **Dark mode persistence:** restored on return visits via localStorage

---

## GitHub setup (first time)

### 1. Make sure Git is installed
```bash
git --version
# If not installed: https://git-scm.com/download/win
```

### 2. Run the setup script
Double-click `github-setup.bat` from inside your `benolivas.com/` folder, or run it from terminal:
```bash
cd C:\Users\benol\websites\benolivas.com
github-setup.bat
```
The script pauses mid-way so you can create the empty GitHub repo before pushing.

### 3. Verify after push
Open your GitHub repo in a browser. Confirm:
- `proxy.php` does NOT appear
- `.gitignore` IS visible
- `data/` contains the four JSON files
- `assets/memes/` and `assets/memebot/` exist (with `.gitkeep`)

---

## Deployment to sandbox.benolivas.com

### One-time Dreamhost Git setup
1. Dreamhost panel → Websites → sandbox.benolivas.com → Git → Create repository
2. Connect to GitHub repo `benolivas-com`
3. Copy Dreamhost webhook URL
4. GitHub repo → Settings → Webhooks → Add webhook → paste URL
5. Push = auto-deploy

### API proxy (manual, one-time)
1. Open `proxy.php` locally, replace `YOUR_ANTHROPIC_API_KEY_HERE` with your key
2. Upload via Dreamhost File Manager to: `sandbox.benolivas.com/benolivas.com/proxy.php`
3. Never commit this file

### Ongoing deploy
```bash
git add -A
git commit -m "your message"
git push
# Dreamhost webhook triggers automatic pull
```

---

## Adding meme assets

Drop finished memes into `assets/memes/` matching the `file` paths in `data/memes.json`:
```
assets/memes/skeleton-boredom.webp   ✓
assets/memes/eye-roll-stanley.gif    ✓
assets/memes/full-of-soup.jpg        ← needed
assets/memes/temporary-person.jpg    ← needed
assets/memes/all-ears.jpg            ← needed
assets/memes/it-hurts.jpg            ← needed
assets/memes/depressed-but-horny.jpg ← needed
assets/memes/play-with-me.jpg        ← needed (URGENT — first MemeBot appearance)
```

MemeBot character state crops go in `assets/memebot/`.

---

## Extending the intent tree
Add new objects to the `INTENTS` array in `chat.js`:
```js
{
  id: 'your_intent',
  patterns: ['phrase one', 'phrase two', 'synonym'],
  beats: [
    { text: "First sentence.", pause: 600 },
    { text: "Second sentence.", pause: 0 }
  ],
  chips: ["Follow-up option"],  // optional
  media: 'posters',             // optional — key into MEDIA object
  topic: 'design',              // optional — saved to localStorage for return visits
  special: 'dark_mode'          // optional — triggers special handler in sendMessage
}
```
