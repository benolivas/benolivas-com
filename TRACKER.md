# BEN OS — Project Tracker
*Last updated: 2026-03-28*
*Keep this current. Update status as things get done.*

---

## ASSET MIGRATION STATUS
*Moving from old benolivas.com to local assets/ folder*

### Graphic Design Thumbs (for design grid)
| Project | Thumb | Full assets | Status |
|---|---|---|---|
| after-hours | ✅ thumb.gif | ⬜ | local |
| misfortune-cookies | ✅ thumb.gif | ⬜ | local |
| man-ray-chess | ✅ thumb.gif | ⬜ | local |
| aerovironment | ✅ thumb.gif | ⬜ | local |
| posters | ⚠️ needs representative thumb | ⬜ | pending |
| blue-note | ⚠️ no work yet | ⬜ | pending |

### Posters (individual, for posters sub-grid)
| Project | Thumb | Full | Status |
|---|---|---|---|
| onibaba | ⚠️ | ⚠️ | migrate from old site |
| swiss-design | ⚠️ | ⚠️ | migrate from old site |
| voltaire | ⚠️ | ⚠️ | migrate from old site |

### Video Thumbs (for video grid + sub-grids)
| Project | Thumb | YouTube URL | Status |
|---|---|---|---|
| commercials/ (category thumb) | ⚠️ | — | pending |
| music-videos/ (category thumb) | ⚠️ | — | pending |
| aerovironment/ (category thumb) | ⚠️ | — | pending |
| asana | ⚠️ | ✅ youtube.com/watch?v=8bh_nmZqUu0 | migrate thumb from old site |
| camp-mobile | ⚠️ | ⚠️ URL needed | pending |
| american-cancer-society | ⚠️ | ⚠️ URL needed | pending |
| target | ⚠️ | ⚠️ URL needed | pending |
| nombe-summers-gone | ⚠️ | ✅ youtube.com/watch?v=n60cpM8_G-I | migrate thumb from old site |
| jump-20 | ⚠️ | ✅ youtube.com/watch?v=lxT9cGUEeZA | migrate thumb from old site |

### Memes
| ID | File | Status |
|---|---|---|
| skeleton-boredom | skeleton-boredom.webp | ✅ local |
| eye-roll-stanley | eye-roll-stanley.gif | ✅ local |
| full-of-soup | full-of-soup.jpg | ✅ local |
| temporary-person | temporary-person.jpg | ✅ local |
| all-ears | all-ears.jpeg | ✅ local |
| drake-little-yachty-oh | drake-little-yachty-oh.gif | ✅ local (unassigned) |
| open-sesame | open-sesame.gif | ⚠️ not yet sourced |

---

## FOLDER STRUCTURE STATUS
| Folder | Status | Notes |
|---|---|---|
| assets/logo/ | ✅ | |
| assets/memes/ | ✅ | open-sesame.gif missing |
| assets/memebot/ | ✅ empty | future use |
| assets/photos/ | ✅ empty | TBD |
| assets/generated/album-covers/ | ✅ empty | magic tricks |
| assets/generated/ui/ | ✅ empty | magic tricks |
| assets/portfolio/graphic-design/* | ✅ structure done | thumbs partially migrated |
| assets/portfolio/video/* | ✅ structure done | thumbs pending |
| assets/portfolio/video/music-videos/nombe-summers-gone/ | ⚠️ rename needed | currently "nombe" |

---

## ENGINE / CODE TODO
| Item | Priority | Status |
|---|---|---|
| Sub-grid behavior on lightbox click | high | ⬜ not built — falls back to lightbox |
| Animation pass — cubic-bezier easing throughout | high | ⬜ |
| Scroll lock during typing | high | ⬜ |
| Smoother text arrival (blur-fade on typewriter) | high | ⬜ |
| webm/mp4 thumb support in grid | medium | ⬜ |
| Grid modes: pool, category, custom N count | medium | ⬜ |
| Lightbox expanded — gallery, copy, video embed | medium | ⬜ |
| Unmatched input logging (post-launch) | medium | ⬜ |
| predict_future — misfortunes.net popup | low | ⬜ |
| STATE system — full nested trigger testing | medium | partial |
| [matched-asset] generation logic | low | ⬜ |

---

## SCRIPT TODO
| Item | Priority | Status |
|---|---|---|
| distress intent — write response | high | ⬜ |
| show_work flow — script changes (in progress) | high | 🔄 |
| show_video chips — need dedicated intents | medium | ⬜ |
| need_design chips — need dedicated intents | medium | ⬜ |
| rebrand chips — need dedicated intents | medium | ⬜ |
| blue_note — "What kind of jazz?" response | low | ⬜ |
| chess — packaging images | low | ⬜ |
| misfortunes — images | low | ⬜ |
| whisper — "How does it work?" | low | ⬜ |
| ## GOTCHAS section | low | ⬜ |
| Return visit — more visit count states | low | ⬜ |

---

## PLANNED / BACKBURNER
- Visual GUI script editor (nested node structure)
- Jazz admat / Blue Note poster generator  
- Project pages / case studies (linked from lightbox)
- Photos section (portraits, product, street)
- AeroVironment design sub-grid (individual projects)

---

## VERSION LOG
| Version | Date | What changed |
|---|---|---|
| 2.0 | 2026-03-20 | Initial build |
| 2.1 | 2026-03-24 | Beat types, lightbox, chip routing |
| 2.2 | 2026-03-25 | State system, nested triggers, exact triggers, magic tricks |
| 2.3 | 2026-03-25 | Merged session edits, version control added |
| 2.4 | 2026-03-28 | Placeholder text, chip dismiss, toggle, memory docs, folder structure, MEDIA catalog |
