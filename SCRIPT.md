# BEN OS — Script v2.2
*Human-readable script. Edit here, share with Claude, Claude converts to chat.js.*
*Last updated: March 2026*

---

## HOW TO READ THIS

This document controls everything BEN OS says and does. Edit it, share with Claude, Claude converts to code. You never need to touch chat.js for script changes.

---

### STRUCTURE OF AN INTENT

An intent is one conversational branch — a thing the user might say, and what happens in response.

```
=== INTENT: intent_id ===
TRIGGERS: phrase one, phrase two, another way they might say it

> Beat one text.  *(pause 600ms, newline)*
> Beat two text.  *(pause 0)*

[MEDIA: grid-name]

*Topic saved: topic-name*

CHIPS:
  "Button label."     → intent_id
  "Another button."   → another_intent_id
```

---

### BEATS
Each `>` line is one typed message — a "beat."

**Pause** = gap in milliseconds before the next beat.
- `*(pause 0)*` = no gap (use on the last beat always)
- `*(pause 400ms)*` = short gap
- `*(pause 600ms)*` = medium gap
- `*(pause 900ms)*` = long, dramatic gap

**Beat types** control how consecutive beats from the same speaker connect visually:

| Type | What it does | When to use |
|---|---|---|
| *(default — no type)* | New row, new label | New speaker, or a genuinely distinct thought |
| `*(pause Xms, inline)*` | Appends to same line, no break | Mid-sentence pause, dramatic hesitation, em dash moment |
| `*(pause Xms, newline)*` | New line in same row, no new label | Same speaker continuing, new sentence |

**Examples:**

Same row, flowing paragraph:
```
> Graphic designer and creative producer. Los Angeles.  *(pause 500ms, newline)*
> 10 years across video production, motion graphics, and brand design.  *(pause 0)*
```

Mid-sentence dramatic pause (inline):
```
> "It's a speaker."  *(pause 600ms, inline)*
> " A very directional one."  *(pause 0)*
```

New row (default — new label appears):
```
> Take care.

**MEMEBOT:** [image: temporary-person]
```

---

### MEDIA
`[MEDIA: grid-name]` on its own line renders an image grid at that point in the conversation. Clicking any thumbnail opens a fullscreen lightbox (stays on site).

```
> Here's a range.  *(pause 400ms)*
[MEDIA: design grid]
> What else do you want to see?  *(pause 0)*
```

The grid appears between the two beats — after "Here's a range." and before "What else do you want to see?"

**Available grids:**
- `design grid` — After Hours, Misfortune Cookies, Man Ray Chess, Onibaba, Swiss Design, Voltaire *(6 items, placeholder — needs Blue Note work added)*
- `video grid` — JUMP 20, Asana, NoMBe *(3 items)*
- `posters grid` — Onibaba, Swiss Design, Voltaire *(3 items)*

⚠️ All images currently pulled from old benolivas.com — needs migration before old site goes down.

---

### CHIPS
Clickable buttons shown after the response. Each chip routes directly to an intent by ID — no ambiguity, no pattern matching.

```
CHIPS:
  "Button label."       → intent_id
  "Another button."     → another_intent_id
```

The same label can appear in multiple places and route to different intents each time. "Yes." can mean different things in different branches — no conflict.

---

### MEMEBOT
Second character. Types slow and human-paced. Always appears as a new row with its own label.

```
**MEMEBOT:** [image: meme-id]
```
or
```
**MEMEBOT:** [greentext]
  > line one
  > line two
  > line three
```

Greentext comes in line by line, like 4chan. Each line types out character by character with a pause between lines.

**Available memes:**
| ID | Description | Currently used in |
|---|---|---|
| skeleton-boredom | Skeleton at computer, boredom intensifies | Fact 1 (sonic weapon) |
| eye-roll-stanley | Stanley from The Office slow eye roll | Fact 3 (career pivot) |
| full-of-soup | Tiny kitten, round belly, "full of soup" | Fact 5 (cookies), vignette: overwhelmed |
| temporary-person | Dark painted dog, "temporary person" | Vignette: goodbye |
| all-ears | Man covered in ears | Vignette: all-ears |
| drake-little-yachty-oh | Drake and Lil Yachty "oh" reaction | **Unassigned — available** |

---

### TOPICS
`*Topic saved: topic-name*` means this intent saves a topic to the user's memory. Used to personalize the return-visitor greeting.

Available topics: `video`, `design`, `branding`, `conversions`, `projects`, `portfolio`, `availability`

---

### VIGNETTES
Vignettes are MemeBot scripted moments that can fire on specific phrases regardless of where the user is in the conversation. Format is the same as intents but uses `=== VIGNETTE ===` header.

---

### ROUTING CONVENTIONS
- `→ intent_id` = routes directly to that intent
- `→ surprise` = picks next unseen Surprise Me fact
- `*TODO*` = placeholder, not yet built
- `*NOTE*` = important context, not shown to user
- `*(loops)*` = chip currently routes back to itself, needs a real destination

---

## DOORS
*Suggestion buttons on load. Trickle in quickly one after another.*
*"Surprise me." always loads last — rewarding patience/exploration.*

1. Show me something.    → show_work
2. Who is Ben?           → who_is_ben
3. Predict my future.    → predict_future
4. **Surprise me.**      → surprise  *(loads last)*

---

## INTRO
*Auto-plays if user stays idle without typing.*

**First visit:**
> BEN OS — online.  *(pause 700ms)*
> You've found a creative assistant disguised as a portfolio site. Or a portfolio site disguised as a creative assistant. The distinction matters less than you'd think.  *(pause 1200ms)*
> How may I help you?

**Return visit (personalized by memory):**
> BEN OS — back online.  *(pause 700ms)*
> [one of the following based on days since last visit + last topic:]
> - 2nd visit specifically: "You came back!"
> — same hour: "You were just here. Either you found something useful or you didn't. Which was it?"
> — within a week + has topic: "You're back. Last time you asked about [topic]. Did anything come of it?"
> — within a month: "You've been here before. Things may or may not have changed. What do you need?"
> — longer: "It's been a while. What are you working on now?"

---

## SMALL TALK

=== INTENT: greeting ===
TRIGGERS: hi, hello, hey, yo, sup, good morning, good afternoon, morning, evening, hiya, howdy

> Hey. What do you need?

---

=== INTENT: user_name ===
TRIGGERS: my name is, i'm called, call me, name's, my name's

// Saves name to localStorage as mem.name. Used in return greeting.

> [NAME].  *(pause 400ms, inline)*  Good to know.  *(pause 500ms, newline)*
> What do you need?

---

=== INTENT: thanks ===
TRIGGERS: thanks, thank you, thx, ty, cheers, appreciate it, helpful, that helped

> For sure. *(pause 900ms)*
> How else may I help you?

---

=== INTENT: ok ===
TRIGGERS: ok, okay, cool, got it, makes sense, noted, understood, alright, sounds good, nice, interesting, fair, word

> *(pause 600ms)* [ECHO: capitalize, add !] *(pause 400ms, newline)*
> How else may I help you?

---

=== INTENT: im_ben ===
TRIGGERS: i'm ben, i am ben, this is ben, hey it's ben, im ben
STATE: identity_theft

> Really.  *(pause 600ms, inline)*  Nice to meet you.  *(pause 500ms, newline)*
> I am also Ben.  *(pause 400ms, inline)*  BEN OS, that is.

CHIPS:
  "No really I'm Ben."  → identity_theft_pt2
  "I'm Ben Olivas"      → identity_theft_pt2

---

=== INTENT: identity_theft_pt2 ===
NESTED TRIGGERS (identity_theft): i'm ben, i am ben, this is ben, hey it's ben, im ben
TRIGGERS: i'm ben olivas, my name is ben olivas
STATE: identity_theft_pt2

> Sure thing.  *(pause 400ms, inline)*  You should have built me better to deal with all the clowns we get around here.

---

## WHAT IS THIS

=== INTENT: what_do_you_do ===
TRIGGERS: what do you do, what does ben do, what is this, what kind of work, services, what can you make, what can you do, what is this site, i need something made, need something made

> I can help with a variety of tasks, such as presenting work examples...  *(pause 200ms, newline)*
>[GIF: assets/portfolio/sizzle-reel.gif]  *(pause 600ms, newline)*
> ...provide resources, connect you to Ben — or generate something.  *(pause 900ms, newline)*
> What are you working on?

---

=== INTENT: who_is_ben ===
TRIGGERS: who is ben, tell me about ben, who made this, about ben, ben olivas, who built this, who are you

> Ben Olivas is a graphic designer and creative producer based in Los Angeles.  *(pause 500ms, inline)* 10 years across video production, motion graphics, and brand design. Currently at Blue Note Los Angeles.  *(pause 600ms, newline)*
> What do you need?

CHIPS:
  "Show me the work."     → show_work
  "What's Blue Note?"     → blue_note
  "Are you available?"    → available

---

=== INTENT: who_is_ben_pt2 ===
TRIGGERS: who the fuck is ben olivas, who does ben olivas think he is
NESTED TRIGGERS (who_is_ben): what, go again, who is ben, tell me about ben, who made this, about ben, ben olivas, who built this, who are you

> A graphic designer and creative producer. *(pause 500ms, inline)*  Based in Los Angeles. *(pause 400ms, inline)* Working at Blue Note. *(pause 600ms, newline)*
> What do you need?

CHIPS:
  "Show me the work."     → show_work
  "What's Blue Note?"     → blue_note
  "Are you available?"    → available

---

=== INTENT: what_is_benos ===
TRIGGERS: what is ben os, what is benos, who am i talking to, what is this ai, explain ben os

> BEN OS. An AI running on Ben Olivas's portfolio site.  *(pause 500ms, newline)*
> Powered by Claude. Not Ben. If you want Ben: benolivas@gmail.com.  *(pause 600ms, newline)*
> What do you need?

---

=== INTENT: is_ai ===
TRIGGERS: are you an ai, are you real, is this ai, is this a bot, who is typing, are you ben, chatbot, ai or human, what are you

> Yes. You were going to ask that eventually.  *(pause 500ms, newline)*
> Running on Claude — made by Anthropic. Ben isn't typing. For actual Ben: benolivas@gmail.com.

---

=== INTENT: how_works ===
TRIGGERS: how does this work, how does the site work, what is happening, what am i talking to, explain yourself

> You typed something. The system read it. A response appeared. You're now considering whether to type again.  *(pause 700ms, newline)*
> This is the same loop that keeps people on social media. Variable reward, minimal friction, the sense that the next response might be more interesting than the last.  *(pause 600ms, newline)*
> It's also how this site works. You're already several exchanges in.

---

## SPECIAL PATHS

=== INTENT: predict_future ===
TRIGGERS: predict my future, predict future, tell my fortune, fortune, my future, what will happen, crystal ball, predict my future.

*TODO: Opens draggable fake browser popup showing misfortunes.net. Not yet built.*
*Current placeholder:*

> You're going to ask about something you've been putting off.  *(pause 600ms, newline)*
> It's going to go better than you think.  *(pause 500ms, newline)*
> That's all you're getting. What do you actually need?

---

=== INTENT: dark_mode ===
TRIGGERS: dark mode, turn off lights, it's 3am, its 3am, turn dark, dark theme, light mode, turn on lights, bright, lights on, lights off

*Handled by code. No beats.*
*Responds: "Done. Easier on the eyes." / "Back to daylight." / "Already dark." / "Already light."*
*Persists across sessions via localStorage.*

---

## SURPRISE ME PATH
*TRIGGERS: surprise me, random, something random, impress me, go ahead, just show me*
*Picks one fact at random, no repeats per session. Rotates through all 6 then resets.*
*"Surprise me." button loads last — rewarding patience/exploration.*

---

=== FACT 1: sonic weapon ===

> **BEN OS:** Did you know that Ben once built a directional sound weapon—

**MEMEBOT:** [image: skeleton-boredom]

> **BEN OS:** …you again.

**MEMEBOT:** [greentext]
  > be portfolio site
  > supposed to show work
  > opens with sonic weapon
  > this is fine

CHIPS:
  "Tell me about the weapon."   → whisper
  "Surprise me again."          → surprise
  "What do you actually do?"    → what_do_you_do

---

=== FACT 2: chess set ===

> **BEN OS:** Did you know that Ben's chess set is based on Man Ray's 1920 designs—

**MEMEBOT:** [greentext]
  > be artist
  > die in 1976
  > some guy 3D prints your chess set
  > didn't ask
  > but honestly fair

> **BEN OS:** …Man Ray would have found this acceptable.

**MEMEBOT:** [greentext]
  > be BEN OS
  > portfolio site
  > explains Man Ray's entire artistic philosophy
  > unprompted
  > on a Tuesday

CHIPS:
  "Tell me about the chess set."  → chess
  "Surprise me again."            → surprise
  "What do you actually do?"      → what_do_you_do

---

=== FACT 3: career pivot ===

> **BEN OS:** Did you know that Ben went from defense contractor to jazz—

**MEMEBOT:** [image: eye-roll-stanley]

> **BEN OS:** …it made sense at the time.

**MEMEBOT:** [greentext]
  > it made sense at the time
  > he said
  > about the weapons to jazz pipeline
  > okay man

CHIPS:
  "Tell me about Blue Note."    → blue_note
  "Surprise me again."          → surprise
  "What do you actually do?"    → what_do_you_do

---

=== FACT 4: classified PDF ===

> **BEN OS:** Did you know that AeroVironment is accused of transporting a live warhead on a commercial fli—

**MEMEBOT:** [greentext]
  > UNCLASSIFIED
  > *sweating*
  > UNCLASSIFIED

> **BEN OS:** …the cover says UNCLASSIFIED. That part is accurate.

**MEMEBOT:** [greentext]
  > designer makes government doc
  > puts UNCLASSIFIED on the cover
  > for a portfolio
  > in Los Angeles
  > no notes actually this rules

CHIPS:
  "Show me the portfolio."      → portfolio_pdf
  "Surprise me again."          → surprise
  "What do you actually do?"    → what_do_you_do

---

=== FACT 5: Misfortune Cookies ===

> **BEN OS:** Did you know that Misfortune Cookies tells you what you don't want to hear—

**MEMEBOT:** [image: full-of-soup]

> **BEN OS:** …that was the point.

**MEMEBOT:** [greentext]
  > fortune cookie company
  > but make it depressing
  > Swiss modernist design
  > for sad cookies
  > honestly respect

CHIPS:
  "Tell me about Misfortune Cookies."   → misfortunes
  "Surprise me again."                  → surprise
  "What do you actually do?"            → what_do_you_do

---

=== FACT 6: Man Ray ===

> **BEN OS:** Did you know that Man Ray designed chess pieces nobody played with—

**MEMEBOT:** [greentext]
  > be dadaist
  > make chess pieces
  > literally no one plays chess with them
  > this was the plan all along

> **BEN OS:** …Ben identified with that.

**MEMEBOT:** [greentext]
  > guy identifies with
  > an artist whose whole thing
  > was making art no one used
  > builds entire brand around it
  > .
  > okay that actually tracks

CHIPS:
  "Tell me about Man Ray."      → man_ray_who
  "Surprise me again."          → surprise
  "What do you actually do?"    → what_do_you_do

---

## HIRING / CONTACT

=== INTENT: available ===
TRIGGERS: are you available, is ben available, available for hire, taking projects, freelance, open to work, for hire, hire ben, can i hire you

> Full-time at Blue Note Los Angeles right now. That will change. It always does.  *(pause 600ms, newline)*
> In the meantime — the right project still gets a yes. What's yours?

*Topic saved: availability*

---

=== INTENT: contact ===
TRIGGERS: how do i contact, contact info, email, reach out, get in touch, how to reach ben, benolivas@gmail.com

> benolivas@gmail.com. He reads it.

---

## VIDEO

=== INTENT: need_video ===
TRIGGERS: i need a video, need a video, video production, make a video, produce a video, brand video, product video, commercial, music video, video work

> What's it for?

[MEDIA: video grid]

*Topic saved: video*

CHIPS:
  "Brand / product."    → video_vs_static
  "Music video."        → show_video
  "Event coverage."     → show_video
  "Something else."     → what_do_you_do

---

=== INTENT: show_video ===
TRIGGERS: show me video, video examples, your videos, show videos

> A few directions.

[MEDIA: video grid]

*Topic saved: video*

CHIPS:
  "Music videos specifically."    → show_video  *(loops — needs dedicated intent)*
  "Corporate / brand work."       → show_video  *(loops — needs dedicated intent)*
  "Defense / technical."          → show_video  *(loops — needs dedicated intent)*
  "What else?"                    → what_do_you_do

---

=== INTENT: video_vs_static ===
TRIGGERS: video or images, video vs static, should i use video, does video convert, static vs video

> Video wins at consideration. Static wins at awareness — lower cognitive load, faster impression, easier to scroll past without feeling like you missed something.  *(pause 700ms, newline)*
> The mistake most brands make is using video everywhere because it feels premium. A six-second autoplay with no sound in a feed is doing the job of a static image, just worse.  *(pause 600ms, newline)*
> What stage is your audience at when they see it?

*Topic saved: video*

---

## DESIGN

=== INTENT: need_design ===
TRIGGERS: i need a designer, need design, graphic design, need branding, design work, need a logo, logo design, visual identity

> What kind?

*Topic saved: design*

CHIPS:
  "Logo / identity."      → need_design  *(loops — needs dedicated intent)*
  "Print."                → need_design  *(loops — needs dedicated intent)*
  "Digital / web."        → need_design  *(loops — needs dedicated intent)*
  "Packaging."            → need_design  *(loops — needs dedicated intent)*
  "Something weird."      → need_design  *(loops — needs dedicated intent)*

---

=== INTENT: need_poster ===
TRIGGERS: poster, make a poster, design a poster, need a poster, can you make a poster, posters

> Something like these.

[MEDIA: posters grid]

*Topic saved: design*

CHIPS:
  "More editorial."               → need_poster  *(loops)*
  "Something darker."             → need_poster  *(loops)*
  "Different style entirely."     → need_poster  *(loops)*
  "What's it for?"                → what_do_you_do

---

=== INTENT: show_design ===
TRIGGERS: show me design, design examples, your design work, show design

> Here's a range.

[MEDIA: design grid]

*Topic saved: design*

CHIPS:
  "More branding."        → show_design  *(loops)*
  "Packaging work."       → show_design  *(loops)*
  "Something weirder."    → show_design  *(loops)*
  "What else?"            → what_do_you_do

---

=== INTENT: color_psychology ===
TRIGGERS: color psychology, colours in branding, brand colors, what colors, color theory

> Color in branding isn't about preference — it's about expectation. Consumers already have associations baked in by decades of category convention. Blue is trustworthy. Red is urgent. Green is natural or financial depending on the decade.  *(pause 700ms, newline)*
> Breaking those conventions can work, but it requires enough brand equity to carry the dissonance. Most don't have that.  *(pause 500ms, newline)*
> What's the category?

*Topic saved: design*

---

## PORTFOLIO

=== INTENT: show_work ===
TRIGGERS: show me something, show me work, show me your work, portfolio, examples, what have you made, past work, see your work, show me examples, show me recent projects, most recent projects, recent work, show me ben

> Here's a range.  *(pause 400ms)*

[MEDIA: design grid]

> What else do you want to see?  *(pause 0)*

*Topic saved: portfolio*

CHIPS:
  "Video work."               → show_video
  "More design."              → show_design
  "Tell me about a project."  → chess_prediction
  "Who is Ben?"               → who_is_ben

---

=== INTENT: portfolio_pdf ===
TRIGGERS: pdf, resume, cv, portfolio pdf, download, the document, unclassified

> The portfolio PDF is at benolivas.com/portfolio.  *(pause 400ms, newline)*
> It's formatted as a government document. The cover page says UNCLASSIFIED. This was intentional.

*NOTE: URL needs updating once old site goes away*

---

## BRANDING

=== INTENT: rebrand ===
TRIGGERS: rebrand, rebranding, new brand, brand refresh, update our brand, brand identity, new look, redesign our brand

> What broke?  *(pause 600ms, newline)*
> Rebrands happen for one of three reasons — the brand no longer reflects what the company actually does, the market shifted and the visual language aged out, or someone new came in and wanted to mark the territory.  *(pause 700ms, newline)*
> Which one is it?

*Topic saved: branding*

CHIPS:
  "Looks dated."                  → rebrand  *(loops — needs dedicated intent)*
  "Doesn't reflect us anymore."   → rebrand  *(loops — needs dedicated intent)*
  "Leadership change."            → rebrand  *(loops — needs dedicated intent)*
  "Honestly not sure."            → rebrand  *(loops — needs dedicated intent)*

---

=== INTENT: why_rebrand_fail ===
TRIGGERS: why do rebrands fail, rebrand mistakes, rebrand gone wrong, failed rebrand, bad rebrand

> Usually one of two things. Either the new brand solves an internal problem instead of an audience problem. Or the visual change outpaces the operational change. You can't redesign your logo into a better company.  *(pause 700ms, newline)*
> The ones that work have a clear answer to: who did we think we were talking to, and who are we actually talking to now?

*Topic saved: branding*

---

## MARKETING

=== INTENT: conversions ===
TRIGGERS: conversions, more conversions, conversion rate, get more sales, increase sales, more clicks, engagement, marketing, ad performance, not converting

> What's the page doing right now — video, static images, long-form copy?

*Topic saved: conversions*

CHIPS:
  "Static images."    → conversions_static
  "Short video."      → need_video
  "Long-form copy."   → conversions  *(loops — needs dedicated intent)*
  "Mix of things."    → conversions  *(loops — needs dedicated intent)*

---

=== INTENT: conversions_static ===
TRIGGERS: static images, just images, mostly images, image and copy

> Static images convert worse than video at the consideration stage. Not because video is flashier — because it reduces the cognitive load of imagining the product in use. The brain fills in gaps with doubt. Video fills them for you.  *(pause 700ms, newline)*
> What's the product?

*Topic saved: conversions*

---

=== INTENT: social_proof ===
TRIGGERS: social proof, testimonials, reviews, trust signals, build trust, credibility

> Social proof works because humans are lazy evaluators. When something is hard to assess, we use other people's behavior as a shortcut.  *(pause 600ms, newline)*
> The trick is specificity. 'Great product!' means nothing. 'Increased our conversion rate by 34% in six weeks' means something.  *(pause 700ms, newline)*
> Also: negative reviews increase overall trust as long as they're not about core functionality. They signal authenticity.

*Topic saved: conversions*

---

## PROJECTS

=== INTENT: chess_prediction ===
TRIGGERS: personal projects, side projects, his projects, what projects, other projects, tell me about a project

> A few. A fortune cookie brand that gives bad advice. A chess set based on Man Ray's work. A fictional acoustic weapon with a real datasheet.  *(pause 700ms, newline)*
> You're going to ask about the chess set.

*Topic saved: projects*

CHIPS:
  "Tell me about the chess set."    → chess
  "Tell me about the cookies."      → misfortunes
  "Tell me about the weapon."       → whisper

---

=== INTENT: unusual ===
TRIGGERS: what's the most unusual, most unusual thing, strangest thing, weirdest thing, unusual about him, what else is unusual, tell me more

> Harder to rank than you'd think.  *(pause 500ms, newline)*
> There's the sound weapon. The surrealist chess set. The fortune cookie company. The government document that isn't classified. The defense contractor work followed immediately by a jazz club.  *(pause 700ms, newline)*
> The through-line is probably: he makes things that shouldn't exist as if they obviously should.

*Topic saved: projects*

---

=== INTENT: chess ===
TRIGGERS: chess set, man ray, chess pieces, the chess set, chess project, surrealist chess

> Man Ray designed chess pieces in the 1920s. Ben 3D modeled them, had them cast in resin, and packaged them as a collectible set.  *(pause 500ms, newline)*
> Man Ray was not consulted. I think he'd be fine with it.

*Topic saved: projects*

CHIPS:
  "Tell me about Man Ray."              → man_ray_who
  "What does the packaging look like?"  → chess  *(loops — needs images)*
  "Can I buy one?"                      → can_buy_chess

---

=== INTENT: misfortunes ===
TRIGGERS: misfortune cookies, fortune cookies, misfortunes, misfortunes.net, bad fortunes, the cookie, cookie project

> Fortune cookies, but honest.  *(pause 500ms, newline)*
> Swiss grid, stark type, dark palette — deliberately clinical against the warm expectations of the category. Packaging, web, copy. Fortunes are AI-generated from a curated dataset.  *(pause 700ms, newline)*
> If you want to feel seen by a cookie: misfortunes.net.

*Topic saved: projects*

CHIPS:
  "What does it look like?"     → misfortunes  *(loops — needs images)*
  "What's the worst fortune?"   → worst_fortune
  "Is it for sale?"             → can_buy_chess

---

=== INTENT: whisper ===
TRIGGERS: whisper gun, whisper mk, lrad, sound weapon, acoustic device, directional sound, ultrasonic, the weapon, show me the datasheet, tell me about the weapon

> The Whisper MK-I is a fictional product —  *(pause 400ms, inline)*
> in the sense that the datasheet is a design exercise.  *(pause 600ms, newline)*
> The actual device is real. Portable directional sound using ultrasonic transducers and PWM signal generation. Built and documented.  *(pause 600ms, newline)*
> The datasheet is the interesting part. Government document parody. Very dry.

*Topic saved: projects*

CHIPS:
  "Show me the datasheet."  → portfolio_pdf
  "How does it work?"       → whisper  *(loops — needs dedicated response)*
  "Is this legal?"          → weapon_legal

---

=== INTENT: weapon_legal ===
TRIGGERS: is this legal, is that legal, is the weapon legal, can you do that

> It's a speaker.  *(pause 600ms, inline)*
> A very directional one.

---

=== INTENT: blue_note ===
TRIGGERS: blue note, jazz club, jazz venue, where does ben work, current job, current role, tell me about blue note, what's blue note

> Blue Note Los Angeles — one of the iconic jazz franchise venues. Ben is the in-house graphic designer on the marketing team.  *(pause 500ms, newline)*
> It is, in fact, a good sentence to have in a bio.

CHIPS:
  "What does he do there?"      → blue_note_work
  "What kind of jazz?"          → blue_note  *(loops — needs a response)*
  "What do you actually do?"    → what_do_you_do

---

=== INTENT: blue_note_work ===
TRIGGERS: what does he do there, what does ben do at blue note, his work at blue note, blue note projects

> Posters, social, print, digital — the full marketing stack for a live music venue.  *(pause 500ms, newline)*
> Every week is a new show. Every show needs assets. It's fast.

CHIPS:
  "Show me examples."           → show_work
  "What do you actually do?"    → what_do_you_do

*NOTE: "Show me examples." shows design grid for now. Blue Note work to be added to MEDIA catalog.*

---

=== INTENT: man_ray_who ===
TRIGGERS: who is man ray, tell me about man ray, man ray artist, what is dada, dadaism

> Man Ray was a Dadaist and Surrealist — photography, painting, objects. Active in Paris in the 1920s. Made things that deliberately resisted being useful.  *(pause 600ms, newline)*
> He also designed chess pieces. Never meant to be played with. Ben found this relatable.

CHIPS:
  "Tell me about the chess set."  → chess
  "Surprise me again."            → surprise

---

=== INTENT: can_buy_chess ===
TRIGGERS: can i buy, is it for sale, where can i buy, how much, price, cost

> Not currently. Limited run — most went to people Ben wanted to have them.  *(pause 500ms, newline)*
> That might change. benolivas@gmail.com if you're serious.

---

=== INTENT: worst_fortune ===
TRIGGERS: what's the worst fortune, worst fortune, most brutal fortune, saddest fortune, most depressing

> They're all the worst fortune. That's the product.  *(pause 600ms, newline)*
> The good ones are the ones that feel too specific.

---

## MAGIC TRICKS

---

=== INTENT: generate_image ===
TRIGGERS: generate something, generate an image, make me something, create something, 
make an image, generate, make something visual, show me something you made,
can you generate, make me art
STATE: generation_flow

// AUTHOR'S NOTE: No real generation. Pull from prerendered assets/generated/ folder, no repeats per session. Assets should loosely match common prompt patterns — abstract, portrait, landscape, product, etc. User thinks they prompted it.

> What should I make?  *(pause 0)*

---

=== INTENT: generation_response ===
NESTED TRIGGERS (generation_flow): *
STATE: generation_flow

// AUTHOR'S NOTE: Whatever the user says here, we pick the closest prerendered asset and present it as if generated. Categories: abstract, portrait, dark, colorful, minimal, chaotic. Map user words to categories, serve asset, never break the illusion.

> Generating...  *(pause 1200ms, newline)*
> [GIF: assets/generated/[matched-asset].gif]  *(pause 800ms, newline)*
> There.

CHIPS:
  "Make another."     → generate_image
  "What is this?"     → generate_explain
  "I like this."      → generate_save

---

=== INTENT: generate_interactive ===
NESTED TRIGGERS (generation_flow): interactive, something interactive, 
make it interactive, a toggle, something i can use

> Generating...  *(pause 1200ms, newline)*
> [TOGGLE: dark_mode]  *(pause 800ms, newline)*
> There.

CHIPS:
  "What is this?"    → generate_explain
  "Make another."    → generate_image

---

## VIGNETTES
*MemeBot scripted moments. Fire on specific phrases regardless of current path.*

---

=== VIGNETTE: all-ears ===
TRIGGERS: i'm listening, im listening, all ears, i'm a woman, im a woman, she her, go on, continue

> **BEN OS:** Good to know.

**MEMEBOT:** [image: all-ears]

> **BEN OS:** Anyway. Is this for a client or something you're building yourself?

CHIPS:
  "Client work."      → what_do_you_do
  "Personal project." → chess_prediction
  "What was that?"    → what_is_benos

---

=== VIGNETTE: overwhelmed ===
TRIGGERS: i don't know where to start, dont know where to start, overwhelmed, too many options, i have a lot to say, so much

> **BEN OS:** Start anywhere.

**MEMEBOT:** [image: full-of-soup]

> **BEN OS:** That's — not helpful.  *(pause 500ms, newline)*
> Video or design?

CHIPS:
  "Video."          → show_video
  "Design work."    → show_design
  "Same actually."  → what_do_you_do

---

=== VIGNETTE: goodbye ===
TRIGGERS: bye, goodbye, see ya, later, peace, gotta go, ttyl, cya

> **BEN OS:** Take care.

**MEMEBOT:** [image: temporary-person]

*BEN OS says nothing after this. Conversation ends.*

---

## KNOWN GAPS / TODO
*Every loop, placeholder, and incomplete path. This is the writing agenda.*

**Script gaps — need new content:**
- `predict_future` — placeholder only. Build: draggable fake browser popup → misfortunes.net
- `need_design` chips — logo / print / digital / packaging / weird all loop back
- `rebrand` chips — dated / doesn't reflect us / leadership / not sure all loop back
- `show_video` chips — music / corporate / defense all loop back
- `blue_note` — "What kind of jazz?" loops
- `chess` — "What does the packaging look like?" loops, needs images
- `misfortunes` — "What does it look like?" loops, needs images
- `whisper` — "How does it work?" loops

**Asset gaps — need media:**
- Blue Note work → add to MEDIA catalog when assets ready
- Project pages → lightbox "View ↗" links need destinations
- Media migration → all images on old benolivas.com need moving to assets/portfolio/

**Unassigned:**
- `drake-little-yachty-oh.gif` — in meme library, waiting for the right moment

---

*End of script v2.2*
