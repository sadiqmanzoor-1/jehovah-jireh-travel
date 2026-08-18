# Jehovah Jireh — Kashmir Travel Agency Landing Page · Design Spec

**Date:** 2026-08-18
**Status:** Approved structure (brainstorm complete); pending final user review of this document
**Type:** Portfolio piece — fictional travel agency, single-page scroll-story website

---

## 1. Overview

A one-page travel agency website for **Jehovah Jireh**, a fictional agency based in Kashmir.
The page is a cinematic scroll-story: a film-like video hero, poetic manifesto, a pinned
horizontal destinations journey, package cards, a calm video interlude, testimonials, an
inquiry CTA, and a signature footer. Design goal: *alien yet human* — an
"Ethereal Cinematic" art direction that feels like scrolling through a film about the valley.

**Purpose:** portfolio showpiece demonstrating advanced scroll animation and art direction.
**Success criteria:** buttery 60fps scroll on a mid-range laptop, distinctive memorable
design, clean readable code, deployable as a static site, in its own GitHub repository.

## 2. Tech Stack

| Layer | Choice | Notes |
|---|---|---|
| Build | Vite (vanilla template) | no framework |
| Language | HTML + CSS + vanilla JS (ES modules) | |
| Animation | GSAP 3 + ScrollTrigger (free tier only) | all scroll choreography |
| Smooth scroll | Lenis | synced to ScrollTrigger via `lenis.on('scroll', ScrollTrigger.update)` |
| Fonts | Self-hosted via @fontsource: **Cormorant Garamond** (display serif), **IBM Plex Mono** (data accents) | no external font CDN at runtime |
| Media | Pexels videos (downloaded, trimmed, compressed locally), Pexels/Unsplash stills | all free-license |
| Deploy | GitHub Pages (repo created at project end) | static output of `vite build` |

No paid GSAP plugins. Horizontal scroll, pinning, scrubbing, and text reveals are all
achievable with free ScrollTrigger + manual text splitting (no SplitText).

## 3. Art Direction — "Ethereal Cinematic"

- **Palette:** pine black `#070B09` (page ground) · deep forest `#1E3A2F` (panels/accents)
  · saffron gold `#D4AF37` (the only loud color: accents, italics, lines, cursor)
  · ivory `#F0EAD6` (type) · mist white at low opacities (overlays).
- **Type:** Cormorant Garamond for display and body (large sizes, generous line-height);
  IBM Plex Mono, small caps/letterspaced, for "expedition data" accents (altitudes,
  coordinates, shot logs, section numbers). This mono seasoning is deliberate — a trace of
  the "Alien Alpine" direction the user liked.
- **Texture:** subtle film grain overlay (CSS/SVG noise, ~3% opacity), letterbox bars on the
  hero, soft vignettes on all full-bleed media.
- **Motion feel:** slow, weighty, cinematic. Ease of choice `power2.out`/`expo.out`;
  scrub-linked animations for scroll storytelling; nothing bouncy.

## 4. Assets

### 4.1 Hero videos (locked during brainstorm)

| Cut | Content | Pexels ID | Source page |
|---|---|---|---|
| 1 | "The Drive" — aerial follow of car on mountain pass | 7400102 | pexels.com/video/7400102 |
| 2 | "Aru Valley" — lush green Kashmir valley aerial | 33333520 | pexels.com/video/33333520 |
| 3 | "Gulmarg" — snow Himalayan peaks aerial | 10760752 | pexels.com/video/10760752 |

Pipeline: download originals → trim each to its best ~8s → transcode H.264 1920×1080,
CRF ~26, no audio, `-movflags +faststart` → target ≤6MB per clip → extract first frame of
Cut 1 as hero poster (`poster.jpg`). Store in `public/media/`. Keep a `CREDITS.md` with
creator attributions (not legally required by Pexels license, but good portfolio manners).

### 4.2 Interlude video

One calm Dal Lake / shikara clip from Pexels, chosen at asset-gathering time by these
criteria: landscape orientation, ≥1080p, slow motion of water/boat, dusk or soft light, no
on-screen people close to camera. Same compression pipeline, trimmed to ~10s.

### 4.3 Destination stills

Five photos (Gulmarg, Sonamarg, Aru Valley, Dal Lake, Gurez) from Pexels/Unsplash:
landscape, high-res, consistent moody grade (cool greens/blues; avoid oversaturated
tourist shots). Compressed to ~1600px WebP + JPEG fallback.

## 5. Page Structure & Animation Spec

Sections in order. "Scrub" = animation progress tied to scroll position.

### 00 · Preloader — "The Ascent"
Black overlay. IBM Plex Mono altitude counter animates 0 → 2,650 M (~2.2s) while a 1px
gold line draws horizontally. On completion, two mist layers (blurred white radial
gradients) slide apart and the overlay fades, revealing the hero already playing.
Runs once per page load; skipped entirely under `prefers-reduced-motion` (instant reveal).
Assets load behind it; if videos are not ready when the counter finishes, hold on a
breathing gold dot until `canplay` of Cut 1 (max wait 4s, then reveal regardless with poster).

### 01 · Hero — the three-shot film (LOCKED)
- Full viewport. Letterbox bars (fixed-height black strips top/bottom).
- Three stacked `<video muted loop playsinline>` elements (Cut 1 `preload="auto"`,
  Cuts 2–3 `preload="metadata"`); GSAP timeline
  crossfades Cut 1 → 2 → 3, ~8s per cut, 1s fades, infinite. Each cut has a slow
  scale drift (1.0 → 1.06) for life.
- Steady headline: "Paradise, *found.*" (gold italic on "found."); caption line beneath
  swaps per cut, letterspaced serif:
  1. THE JOURNEY BEGINS · MOUNTAIN PASS
  2. ARU VALLEY · WHERE THE GREEN NEVER ENDS
  3. GULMARG · KASHMIR · 2,650M
- Gold progress ticks (3 segments) fill per cut; mono shot-log bottom-right
  (SHOT 01/03 — AERIAL FOLLOW, etc.).
- Nav: JEHOVAH JIREH wordmark left; links (DESTINATIONS · JOURNEYS · STORIES) +
  gold-outline button PLAN MY ESCAPE right. Anchor links smooth-scroll via Lenis.
- On scroll (scrub over first ~80vh): title lifts and fades, letterbox bars grow ~40%
  taller (film ending feel), then the section releases.
- Videos pause via IntersectionObserver when hero is fully off-screen; resume on return.

### 02 · Manifesto
"Some places you visit. / This one, *you feel*." — display serif at ~7vw. Manual word
splitting (`<span>` per word); scrub timeline fades/raises each word in sequence, so
scrolling backwards rewinds the sentence. Slow mist layer drifts behind at 0.5× scroll
speed. When the last word lands, a gold divider draws itself (scaleX 0→1). Small mono
coordinates bottom-corner: `34.0837°N — 74.7973°E`.

### 03 · The Valley Calls — horizontal destinations journey
- Pinned section: vertical scroll drives a horizontal track of 5 full-height panels
  (Gulmarg, Sonamarg, Aru Valley, Dal Lake, Gurez). Track length ≈ 4×100vw of scroll.
- Each panel: full-bleed still with slow Ken Burns zoom (scrub), destination name in
  giant serif sliding slightly faster than the panel (parallax), altitude + one-liner in
  mono/serif. Gold panel index (01–05).
- Section header before pin: "01 — WHERE WE TAKE YOU" mono label + serif line.
- Custom cursor becomes a "DRAG" ring inside this section (drag/swipe also moves the
  track on desktop as a nicety; scroll remains primary).
- **Mobile (<768px):** no pin — native horizontal snap-scroll strip with the same panels.

### 04 · Signature Journeys — packages
Three cards on deep-forest panels: THE HONEYMOON (7 days · Srinagar–Gulmarg–Pahalgam),
THE GRAND VALLEY (10 days · everything, flagship w/ gold border), THE WANDERER
(5 days · offbeat Gurez & Aru). Card contents: name (serif), route (mono), 3-line
description, price (counts up from 0 on section entry: ₹48,500 / ₹86,000 / ₹32,500 —
fictional), "RESERVE →" text link.
Entry: staggered rise + fade. Hover (desktop): 3D tilt toward cursor (max ~6°), gold
border glow, itinerary preview (day list) expands within the card. Touch: tap toggles
the expanded state; no tilt.

### 05 · Interlude — the shikara breath
Full-width, ~70vh video strip (Dal Lake clip), scroll-parallaxed (video translates at
0.85× scroll). Overlaid quote in large serif italic drifting at 0.7×:
"And in the evening, the lake turns to glass." No UI, no buttons. Video pauses off-screen.

### 06 · Stories
Fictional-but-believable placeholder quotes (4), large serif italic, auto-rotating
crossfade every ~6s with manual dots; name + trip in mono beneath
(e.g., "AARAV & MEHER — THE HONEYMOON, MAY 2026"). Behind: faint destination stills
slideshow with slow zoom, heavily darkened. Rotation pauses on hover/focus and under
reduced motion (becomes static first quote with dots).

### 07 · Plan My Escape — CTA + inquiry form
Full-screen dark section. Headline "The valley is *calling*." fades up over drifting
mist. Form fields: NAME, EMAIL, WHEN? (month/year text input), TELL US YOUR DREAM TRIP
(textarea) — minimal style: no boxes, gold underline draws itself on focus. Submit
button "BEGIN YOUR JOURNEY" (gold outline, slow shimmer sweep). **No backend:**
client-side validation (required name + valid email); on submit, form crossfades to a
confirmation: "The valley heard you. We'll write to you within a day." + mono
`INQUIRY LOGGED — 34.08°N`. Invalid fields: underline turns warm red, small serif hint.

### 08 · Footer — the signature
Giant serif "Jehovah Jireh" spanning the width, rising from below the fold (scrub) as
the user reaches the end; "Paradise, found." beneath. Columns: contact (fictional
Srinagar address, phone, email), socials (text links, non-functional `#`), and mono
credits: "SHOT ON LOCATION · KASHMIR · 34.08°N 74.79°E · FOOTAGE: PEXELS ARTISTS".
Gold top border draws in on entry. Copyright line with current year.

### ✦ Connective tissue (site-wide)
- **Lenis** smooth scroll, `lerp` tuned heavy (~0.08).
- **Custom cursor** (desktop/fine pointers only): 8px gold dot, lerped follow; grows to
  ring over interactive elements; becomes "DRAG" pill in section 03. Hidden on touch.
- **Film grain**: fixed overlay using an inline SVG turbulence tile, ~3% opacity.
- **Scroll progress**: 2px gold line fixed at viewport top, scaleX = scroll progress.
- **Section markers**: current section number (01–08) in mono, fixed bottom-left,
  crossfades on section change.
- **Nav behavior**: hides on scroll down, slides back on scroll up; backdrop blurs
  once past the hero.

## 6. Architecture

```
jehovah-jireh/
├── index.html               # all section markup, semantic (header/main/section/footer)
├── public/
│   └── media/               # compressed videos, posters, images
├── src/
│   ├── main.js              # boot: fonts, Lenis, GSAP registration, module init order
│   ├── styles/
│   │   ├── base.css         # reset, tokens (CSS custom props), typography
│   │   ├── components.css   # nav, cursor, grain, progress, buttons, form
│   │   └── sections.css     # per-section layout (also fine to split per section)
│   └── modules/
│       ├── preloader.js
│       ├── hero.js          # video sequencing + scroll-out
│       ├── manifesto.js
│       ├── destinations.js  # pin + horizontal track (+ mobile fallback)
│       ├── journeys.js
│       ├── interlude.js
│       ├── stories.js
│       ├── contact.js       # form validation + confirmation state
│       ├── footer.js
│       └── ui.js            # cursor, nav, progress line, section markers, grain
└── docs/superpowers/specs/  # this spec + implementation plan
```

Each module exports one `init()` (and returns its ScrollTriggers where relevant).
`main.js` initializes in DOM order. Modules never reach into each other's DOM; shared
constants (breakpoints, eases) live in a small `constants.js` if needed. Media element
pausing handled by a shared IntersectionObserver helper in `ui.js`.

## 7. Responsiveness, Accessibility, Performance

- **Breakpoints:** ≥1024 full experience · 768–1023 same but tamer type scale ·
  <768 mobile: no pinning in 03 (native snap strip), no custom cursor/tilt, hero
  sequence unchanged (videos are light).
- **`prefers-reduced-motion: reduce`:** kill preloader count/scrubs/parallax/auto-rotation;
  content appears with simple fades or statically; hero shows Cut 1 only, no crossfade.
- **Autoplay safety:** videos muted + `playsinline`; if `play()` rejects, show poster
  (hero still reads as designed).
- **Performance:** only `transform`/`opacity` animated; `will-change` sparingly on
  actively animated layers; videos lazy — only hero preloads, interlude uses
  `preload="none"` + observer-triggered load; images lazy + WebP; total page weight
  target ≤ 25MB (video-heavy by nature), first meaningful paint gated by preloader.
- **A11y:** semantic landmarks, single `h1` (hero headline), focus-visible styles (gold
  outline), form labels + `aria-live` on confirmation, alt text on all stills, decorative
  media `aria-hidden`, keyboard reachable nav/links/form, color contrast ≥ 4.5:1 for text
  (ivory on pine black passes easily).

## 8. Error Handling

| Failure | Behavior |
|---|---|
| Video fails to load/play | Poster image shown; sequence skips missing cut |
| Fonts fail | System serif/mono fallback stack in tokens |
| JS disabled | Content readable top-to-bottom (markup is semantic; CSS provides base layout); animations simply absent |
| Form invalid | Inline field messages, no submission |
| Small/odd viewports | Sections min-height clamps; no horizontal overflow outside section 03's track |

## 9. Testing & QA

- `vite build` clean; no console errors.
- Manual QA checklist: all 9 sections at 1440/1024/768/390 widths; scroll up AND down
  (scrub reversibility); reduced-motion mode; touch device pass; form validation paths;
  video pause/resume when tabbed away (`visibilitychange`) and off-screen.
- Lighthouse (desktop): Performance ≥ 80 (video-heavy page), Accessibility ≥ 95,
  Best Practices ≥ 95.
- Cross-browser: Chromium, Firefox, Safari (webkit `background-clip` and video autoplay
  quirks checked).

## 10. Out of Scope

- Real booking/backend, payments, CMS, i18n, blog, multi-page routing.
- Real agency identity: all contact details, prices, and testimonials are fictional
  placeholders for portfolio purposes.
- The GitHub repository creation/push is the final step after the site is approved
  locally (user request: "keep that for the end").

## 11. Milestones (implementation plan will detail)

1. Scaffold (Vite, fonts, tokens, base styles, grain/cursor/progress shell)
2. Asset pipeline (download, trim, compress, posters, credits)
3. Hero + preloader
4. Manifesto + destinations horizontal journey
5. Journeys + interlude + stories
6. Contact + footer
7. Responsive/reduced-motion/a11y pass, QA checklist, Lighthouse
8. GitHub repo + Pages deploy
