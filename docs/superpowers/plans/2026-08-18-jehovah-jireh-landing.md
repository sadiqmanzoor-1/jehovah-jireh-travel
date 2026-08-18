# Jehovah Jireh Landing Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the cinematic one-page Kashmir travel site per spec `docs/superpowers/specs/2026-08-18-jehovah-jireh-landing-design.md`.

**Architecture:** Static Vite site, vanilla ES modules. `index.html` holds all semantic markup; one JS module per section plus a shared `ui.js`; GSAP ScrollTrigger drives all scroll choreography, Lenis provides smooth scroll. Media is pre-compressed into `public/media/`.

**Tech Stack:** Vite 6, GSAP 3 (+ScrollTrigger, free tier only), Lenis, @fontsource (Cormorant Garamond, IBM Plex Mono), ffmpeg (asset prep only).

## Global Constraints

- Palette: bg `#070B09`, forest `#1E3A2F`, gold `#D4AF37`, ivory `#F0EAD6`. Gold is the only loud color.
- Fonts self-hosted via @fontsource only — no runtime font/CDN requests.
- No paid GSAP plugins (no SplitText — split text manually).
- Animate only `transform` and `opacity`.
- All videos: muted, `playsinline`, H.264 1080p CRF 26, no audio, `+faststart`, ≤6MB each.
- Every scroll animation must respect `prefers-reduced-motion: reduce` (guards via `REDUCED` from `constants.js`).
- `vite.config.js` uses `base: './'` (GitHub Pages).
- Working dir = repo root (`d:\Claude\trave agency website`). Windows: shell commands below are Git Bash.
- Copy (headlines, captions, prices, quotes) is exact — copy verbatim from this plan.
- Commit after every task; conventional-commit style messages ending with the Claude co-author trailer.

---

### Task 1: Scaffold — Vite, fonts, tokens, boot

**Files:**
- Create: `package.json`, `vite.config.js`, `index.html` (placeholder), `src/main.js`, `src/constants.js`, `src/styles/base.css`
- Modify: `.gitignore`

**Interfaces:**
- Produces: CSS custom props (`--c-bg`, `--c-forest`, `--c-gold`, `--c-ivory`, `--font-serif`, `--font-mono`, `--ease-out`), utility classes `.font-mono`, `.label`, `.visually-hidden`; `constants.js` exports `REDUCED` (boolean), `MQ_DESKTOP = '(min-width: 768px)'`, `isDesktop()`; `main.js` exports nothing but owns the Lenis instance + GSAP registration and calls each section's `init*()` as later tasks add them.

- [ ] **Step 1: Write package.json + vite.config.js**

`package.json`:
```json
{
  "name": "jehovah-jireh",
  "private": true,
  "version": "0.1.0",
  "type": "module",
  "scripts": { "dev": "vite", "build": "vite build", "preview": "vite preview" },
  "devDependencies": { "vite": "^6.0.0" },
  "dependencies": {
    "gsap": "^3.12.5",
    "lenis": "^1.1.14",
    "@fontsource/cormorant-garamond": "^5.1.0",
    "@fontsource/ibm-plex-mono": "^5.1.0"
  }
}
```

`vite.config.js`:
```js
import { defineConfig } from 'vite';
export default defineConfig({ base: './' });
```

Append to `.gitignore`: `assets-raw/`

- [ ] **Step 2: Placeholder index.html (replaced fully in Task 3)**

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Jehovah Jireh — Paradise, found. | Kashmir Travel</title>
</head>
<body>
  <main><h1 style="font-size:10vw">Jehovah Jireh</h1><div style="height:200vh"></div></main>
  <script type="module" src="/src/main.js"></script>
</body>
</html>
```

- [ ] **Step 3: Write src/constants.js**

```js
export const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
export const MQ_DESKTOP = '(min-width: 768px)';
export const isDesktop = () => window.matchMedia(MQ_DESKTOP).matches;
```

- [ ] **Step 4: Write src/styles/base.css**

```css
:root {
  --c-bg: #070B09; --c-forest: #1E3A2F; --c-gold: #D4AF37; --c-ivory: #F0EAD6;
  --font-serif: 'Cormorant Garamond', Georgia, 'Times New Roman', serif;
  --font-mono: 'IBM Plex Mono', 'Courier New', monospace;
  --ease-out: cubic-bezier(0.16, 1, 0.3, 1);
}
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html { scroll-behavior: auto; }
body {
  background: var(--c-bg); color: var(--c-ivory);
  font-family: var(--font-serif); font-size: 1.25rem; line-height: 1.55;
  -webkit-font-smoothing: antialiased; overflow-x: hidden;
}
img, video { display: block; max-width: 100%; }
a { color: inherit; text-decoration: none; }
button { font: inherit; color: inherit; background: none; border: 0; cursor: pointer; }
h1, h2, h3 { font-weight: 500; line-height: 1.05; }
em { color: var(--c-gold); font-style: italic; }
.font-mono { font-family: var(--font-mono); }
.label { font-family: var(--font-mono); font-size: 0.7rem; letter-spacing: 0.3em; color: var(--c-gold); text-transform: uppercase; }
.visually-hidden { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; }
:focus-visible { outline: 2px solid var(--c-gold); outline-offset: 3px; }
::selection { background: var(--c-gold); color: var(--c-bg); }
```

- [ ] **Step 5: Write src/main.js (boot)**

```js
import '@fontsource/cormorant-garamond/400.css';
import '@fontsource/cormorant-garamond/400-italic.css';
import '@fontsource/cormorant-garamond/500.css';
import '@fontsource/cormorant-garamond/600.css';
import '@fontsource/ibm-plex-mono/400.css';
import '@fontsource/ibm-plex-mono/500.css';
import './styles/base.css';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { REDUCED } from './constants.js';

gsap.registerPlugin(ScrollTrigger);

export const lenis = new Lenis({ lerp: 0.08 });
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => lenis.raf(time * 1000));
gsap.ticker.lagSmoothing(0);
if (REDUCED) lenis.destroy();

// Section inits appended here in later tasks.
```

- [ ] **Step 6: Install and verify**

Run: `npm install && npm run build`
Expected: build succeeds, `dist/` produced, no errors.
Run: `npm run dev` briefly — dark page, "Jehovah Jireh" in Cormorant serif (check devtools computed font).

- [ ] **Step 7: Commit**

```bash
git add package.json package-lock.json vite.config.js index.html src .gitignore
git commit -m "feat: scaffold Vite + GSAP/Lenis boot, tokens, fonts"
```

---

### Task 2: Asset pipeline — download, trim, compress, posters, credits

**Files:**
- Create: `public/media/*` (3 hero mp4 + poster, interlude mp4 + poster, 5 dest jpgs), `CREDITS.md`
- Working dir (gitignored): `assets-raw/`

**Interfaces:**
- Produces exact media paths used by Task 3 markup: `/media/hero-drive.mp4`, `/media/hero-aru.mp4`, `/media/hero-gulmarg.mp4`, `/media/hero-poster.jpg`, `/media/interlude-lake.mp4`, `/media/interlude-poster.jpg`, `/media/dest-gulmarg.jpg`, `/media/dest-sonamarg.jpg`, `/media/dest-aru.jpg`, `/media/dest-dallake.jpg`, `/media/dest-gurez.jpg`.

- [ ] **Step 1: Check ffmpeg**

Run: `ffmpeg -version`
If missing: `winget install -e --id Gyan.FFmpeg` then restart the shell (or use `npx --yes ffmpeg-static-cli` equivalents). Do not proceed without ffmpeg.

- [ ] **Step 2: Download raw videos**

```bash
mkdir -p assets-raw public/media
curl -L "https://www.pexels.com/download/video/7400102/"  -o assets-raw/raw-drive.mp4
curl -L "https://www.pexels.com/download/video/33333520/" -o assets-raw/raw-aru.mp4
curl -L "https://videos.pexels.com/video-files/10760752/10760752-uhd_2560_1440_24fps.mp4" -o assets-raw/raw-gulmarg.mp4
curl -L "https://www.pexels.com/download/video/28427353/" -o assets-raw/raw-lake.mp4
```
Each file must be >1MB (`ls -la assets-raw`); a tiny file means an HTML error page — re-check the URL. Fallback for the lake clip if 28427353 is unusable on view: `https://www.pexels.com/download/video/30785464/`.

- [ ] **Step 3: Trim + compress (pick the best ~8s of each; inspect first, adjust -ss)**

```bash
ffmpeg -y -ss 2 -t 8  -i assets-raw/raw-drive.mp4   -vf "scale=1920:-2" -c:v libx264 -crf 26 -preset slow -an -movflags +faststart public/media/hero-drive.mp4
ffmpeg -y -ss 1 -t 8  -i assets-raw/raw-aru.mp4     -vf "scale=1920:-2" -c:v libx264 -crf 26 -preset slow -an -movflags +faststart public/media/hero-aru.mp4
ffmpeg -y -ss 1 -t 8  -i assets-raw/raw-gulmarg.mp4 -vf "scale=1920:-2" -c:v libx264 -crf 26 -preset slow -an -movflags +faststart public/media/hero-gulmarg.mp4
ffmpeg -y -ss 0 -t 10 -i assets-raw/raw-lake.mp4    -vf "scale=1920:-2" -c:v libx264 -crf 26 -preset slow -an -movflags +faststart public/media/interlude-lake.mp4
ffmpeg -y -i public/media/hero-drive.mp4     -frames:v 1 -q:v 3 public/media/hero-poster.jpg
ffmpeg -y -i public/media/interlude-lake.mp4 -frames:v 1 -q:v 3 public/media/interlude-poster.jpg
```

- [ ] **Step 4: Download destination stills (Unsplash, free license)**

```bash
curl -L "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1600&q=80" -o public/media/dest-gulmarg.jpg
curl -L "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1600&q=80" -o public/media/dest-sonamarg.jpg
curl -L "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1600&q=80" -o public/media/dest-aru.jpg
curl -L "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=1600&q=80" -o public/media/dest-dallake.jpg
curl -L "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1600&q=80" -o public/media/dest-gurez.jpg
```

- [ ] **Step 5: Write CREDITS.md**

```markdown
# Media Credits
Free-license footage & photos. Not required by license, but credited with thanks.
- Hero "The Drive": Pexels video 7400102
- Hero "Aru Valley": Pexels video 33333520
- Hero "Gulmarg": Pexels video 10760752 (Imad Clicks)
- Interlude "Dal Lake": Pexels video 28427353
- Destination stills: Unsplash photos 1519681393784, 1506905925346, 1441974231531, 1476514525535, 1469474968028
```

- [ ] **Step 6: Verify**

```bash
ls -la public/media
```
Expected: 11 files; each mp4 ≤ ~6MB (CRF 26 at 8s normally lands 2–6MB; if one exceeds 8MB, raise CRF to 28 and re-run that line); both jpg posters > 20KB; 5 dest jpgs > 100KB.

- [ ] **Step 7: Commit**

```bash
git add public/media CREDITS.md .gitignore
git commit -m "feat: add compressed hero/interlude videos, posters, destination stills"
```

---

### Task 3: Full page markup + static layout styles

**Files:**
- Create: `src/styles/components.css`, `src/styles/sections.css`
- Modify: `index.html` (full replace), `src/main.js` (import the two new css files after base.css)

**Interfaces:**
- Produces the complete DOM contract every later task depends on. Key hooks: `.preloader` (+`__alt`, `__line`, `__mist--l/r`), `.cursor` (+`__label`), `.grain`, `.progress`, `.marker`, `.nav` (+`__brand`, `__links`, `__cta`), `#hero .hero__video ×3`, `.hero__shade`, `.hero__bar--top/bottom`, `.hero__title h1`, `.hero__cap ×3`, `.hero__tick ×3 > i`, `.hero__log-item ×3`, `#manifesto [data-split] ×2`, `.manifesto__mist`, `.manifesto__divider`, `#destinations .dest__viewport[data-cursor="drag"] > .dest__track > .dest__panel ×5` (each: `img`, `.dest__info`, `.dest__name`), `#journeys .jcard ×3 [data-price]` (each: `.jcard__amount`, `.jcard__toggle`, `.jcard__days`), `#interlude .interlude__video[data-src]`, `.interlude__quote`, `#stories .story ×4`, `.stories__dot ×4`, `.stories__bgimg ×3`, `#contact form.contact__form`, `.field ×4` (input/textarea + `.field__hint`), `.contact__submit`, `.contact__done[hidden]`, `.contact__live`, `footer.footer` (`.footer__rule`, `.footer__word`), `data-section="01".."08"` on sections.

- [ ] **Step 1: Replace index.html entirely**

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Jehovah Jireh — Paradise, found. | Kashmir Travel</title>
  <meta name="description" content="Jehovah Jireh is a Kashmir-based travel agency crafting cinematic journeys through the valley — Gulmarg, Sonamarg, Aru, Dal Lake and Gurez." />
</head>
<body>
  <div class="preloader" aria-hidden="true">
    <div class="preloader__inner">
      <div class="preloader__alt font-mono">0 M</div>
      <div class="preloader__line"></div>
    </div>
    <div class="preloader__mist preloader__mist--l"></div>
    <div class="preloader__mist preloader__mist--r"></div>
  </div>

  <div class="cursor" aria-hidden="true"><span class="cursor__label font-mono">DRAG</span></div>
  <div class="grain" aria-hidden="true"></div>
  <div class="progress" aria-hidden="true"></div>
  <div class="marker font-mono" aria-hidden="true">01</div>

  <header class="nav">
    <a class="nav__brand font-mono" href="#hero">JEHOVAH JIREH</a>
    <nav class="nav__links font-mono" aria-label="Primary">
      <a href="#destinations">DESTINATIONS</a>
      <a href="#journeys">JOURNEYS</a>
      <a href="#stories">STORIES</a>
      <a class="nav__cta" href="#contact">PLAN MY ESCAPE</a>
    </nav>
  </header>

  <main>
    <section class="hero" id="hero" data-section="01">
      <div class="hero__media" aria-hidden="true">
        <video class="hero__video is-active" src="/media/hero-drive.mp4" poster="/media/hero-poster.jpg" muted loop playsinline preload="auto"></video>
        <video class="hero__video" src="/media/hero-aru.mp4" muted loop playsinline preload="metadata"></video>
        <video class="hero__video" src="/media/hero-gulmarg.mp4" muted loop playsinline preload="metadata"></video>
        <div class="hero__shade"></div>
      </div>
      <div class="hero__bar hero__bar--top" aria-hidden="true"></div>
      <div class="hero__bar hero__bar--bottom" aria-hidden="true"></div>
      <div class="hero__title">
        <h1>Paradise, <em>found.</em></h1>
        <div class="hero__caps" aria-hidden="true">
          <p class="hero__cap is-active">THE JOURNEY BEGINS · MOUNTAIN PASS</p>
          <p class="hero__cap">ARU VALLEY · WHERE THE GREEN NEVER ENDS</p>
          <p class="hero__cap">GULMARG · KASHMIR · 2,650M</p>
        </div>
      </div>
      <div class="hero__ticks" aria-hidden="true">
        <span class="hero__tick"><i></i></span><span class="hero__tick"><i></i></span><span class="hero__tick"><i></i></span>
      </div>
      <div class="hero__log font-mono" aria-hidden="true">
        <p class="hero__log-item is-active">SHOT 01/03 — AERIAL FOLLOW</p>
        <p class="hero__log-item">SHOT 02/03 — THE VALLEY FLOOR</p>
        <p class="hero__log-item">SHOT 03/03 — HIMALAYAN AERIAL</p>
      </div>
      <p class="hero__scroll font-mono" aria-hidden="true">SCROLL TO BEGIN ⌄</p>
    </section>

    <section class="manifesto" id="manifesto" data-section="02">
      <div class="manifesto__mist" aria-hidden="true"></div>
      <p class="manifesto__line" data-split>Some places you visit.</p>
      <p class="manifesto__line manifesto__line--accent" data-split>This one, you feel.</p>
      <div class="manifesto__divider" aria-hidden="true"></div>
      <p class="manifesto__coords font-mono">34.0837°N — 74.7973°E</p>
    </section>

    <section class="dest" id="destinations" data-section="03">
      <div class="dest__head">
        <p class="label">01 — WHERE WE TAKE YOU</p>
        <h2>Five rooms of one paradise</h2>
      </div>
      <div class="dest__viewport" data-cursor="drag">
        <div class="dest__track">
          <article class="dest__panel">
            <img src="/media/dest-gulmarg.jpg" alt="Snow-covered peaks of Gulmarg under a starry sky" loading="lazy" />
            <div class="dest__info">
              <p class="dest__index font-mono">01 / 05</p>
              <h3 class="dest__name">Gulmarg</h3>
              <p class="dest__alt font-mono">ALT 2,650 M</p>
              <p class="dest__line">Meadows that end in glaciers.</p>
            </div>
          </article>
          <article class="dest__panel">
            <img src="/media/dest-sonamarg.jpg" alt="Misty mountain peak above Sonamarg" loading="lazy" />
            <div class="dest__info">
              <p class="dest__index font-mono">02 / 05</p>
              <h3 class="dest__name">Sonamarg</h3>
              <p class="dest__alt font-mono">ALT 2,730 M</p>
              <p class="dest__line">The meadow of gold.</p>
            </div>
          </article>
          <article class="dest__panel">
            <img src="/media/dest-aru.jpg" alt="Sunbeams through pine forest in Aru Valley" loading="lazy" />
            <div class="dest__info">
              <p class="dest__index font-mono">03 / 05</p>
              <h3 class="dest__name">Aru Valley</h3>
              <p class="dest__alt font-mono">ALT 2,414 M</p>
              <p class="dest__line">Where the green never ends.</p>
            </div>
          </article>
          <article class="dest__panel">
            <img src="/media/dest-dallake.jpg" alt="A lone boat on the still water of Dal Lake" loading="lazy" />
            <div class="dest__info">
              <p class="dest__index font-mono">04 / 05</p>
              <h3 class="dest__name">Dal Lake</h3>
              <p class="dest__alt font-mono">ALT 1,585 M</p>
              <p class="dest__line">A city that floats.</p>
            </div>
          </article>
          <article class="dest__panel">
            <img src="/media/dest-gurez.jpg" alt="Sunlit valley meadow in Gurez" loading="lazy" />
            <div class="dest__info">
              <p class="dest__index font-mono">05 / 05</p>
              <h3 class="dest__name">Gurez</h3>
              <p class="dest__alt font-mono">ALT 2,400 M</p>
              <p class="dest__line">The valley time forgot.</p>
            </div>
          </article>
        </div>
      </div>
    </section>

    <section class="journeys" id="journeys" data-section="04">
      <p class="label">02 — SIGNATURE JOURNEYS</p>
      <h2>Choose your story</h2>
      <div class="journeys__grid">
        <article class="jcard" data-price="48500">
          <h3>The Honeymoon</h3>
          <p class="jcard__route font-mono">7 DAYS · SRINAGAR – GULMARG – PAHALGAM</p>
          <p class="jcard__desc">Houseboat mornings, meadow picnics, a gondola above the clouds — slow days built for two.</p>
          <p class="jcard__price"><span class="jcard__amount font-mono">₹0</span><span class="jcard__per font-mono"> / PERSON</span></p>
          <button class="jcard__toggle font-mono" aria-expanded="false">ITINERARY +</button>
          <div class="jcard__days">
            <ul>
              <li><b>D1–2</b> Srinagar houseboat, shikara at dusk</li>
              <li><b>D3–4</b> Gulmarg gondola &amp; meadow walks</li>
              <li><b>D5–6</b> Pahalgam &amp; Betaab Valley</li>
              <li><b>D7</b> Old city, saffron farms, farewell</li>
            </ul>
          </div>
          <a class="jcard__reserve font-mono" href="#contact">RESERVE →</a>
        </article>
        <article class="jcard jcard--flagship" data-price="86000">
          <h3>The Grand Valley</h3>
          <p class="jcard__route font-mono">10 DAYS · THE FULL CIRCUIT</p>
          <p class="jcard__desc">Every room of paradise: lakes, meadows, glaciers, and the road to Gurez. Our flagship.</p>
          <p class="jcard__price"><span class="jcard__amount font-mono">₹0</span><span class="jcard__per font-mono"> / PERSON</span></p>
          <button class="jcard__toggle font-mono" aria-expanded="false">ITINERARY +</button>
          <div class="jcard__days">
            <ul>
              <li><b>D1–2</b> Srinagar, Dal Lake &amp; old city</li>
              <li><b>D3–4</b> Gulmarg heights</li>
              <li><b>D5–6</b> Sonamarg &amp; Thajiwas glacier</li>
              <li><b>D7–8</b> Pahalgam &amp; Aru Valley</li>
              <li><b>D9–10</b> Gurez — the valley time forgot</li>
            </ul>
          </div>
          <a class="jcard__reserve font-mono" href="#contact">RESERVE →</a>
        </article>
        <article class="jcard" data-price="32500">
          <h3>The Wanderer</h3>
          <p class="jcard__route font-mono">5 DAYS · GUREZ &amp; ARU · OFFBEAT</p>
          <p class="jcard__desc">No itinerary worship. Ridge walks, village teas, rivers with no names on maps.</p>
          <p class="jcard__price"><span class="jcard__amount font-mono">₹0</span><span class="jcard__per font-mono"> / PERSON</span></p>
          <button class="jcard__toggle font-mono" aria-expanded="false">ITINERARY +</button>
          <div class="jcard__days">
            <ul>
              <li><b>D1</b> Srinagar → Gurez over Razdan Pass</li>
              <li><b>D2–3</b> Habba Khatoon peak, Tulail villages</li>
              <li><b>D4</b> Aru Valley riverside camp</li>
              <li><b>D5</b> Slow road home</li>
            </ul>
          </div>
          <a class="jcard__reserve font-mono" href="#contact">RESERVE →</a>
        </article>
      </div>
    </section>

    <section class="interlude" id="interlude" data-section="05">
      <video class="interlude__video" data-src="/media/interlude-lake.mp4" poster="/media/interlude-poster.jpg" muted loop playsinline preload="none" aria-hidden="true"></video>
      <p class="interlude__quote">“And in the evening, the lake turns to glass.”</p>
    </section>

    <section class="stories" id="stories" data-section="06">
      <div class="stories__bg" aria-hidden="true">
        <img class="stories__bgimg" src="/media/dest-gulmarg.jpg" alt="" />
        <img class="stories__bgimg" src="/media/dest-aru.jpg" alt="" />
        <img class="stories__bgimg" src="/media/dest-dallake.jpg" alt="" />
      </div>
      <p class="label">03 — TRAVELERS' WORDS</p>
      <div class="stories__stage">
        <figure class="story is-active">
          <blockquote>“We came for the mountains. We left with a second home.”</blockquote>
          <figcaption class="font-mono">AARAV &amp; MEHER — THE HONEYMOON · MAY 2026</figcaption>
        </figure>
        <figure class="story">
          <blockquote>“I have never heard silence like Gurez at dawn.”</blockquote>
          <figcaption class="font-mono">IRFAN K. — THE WANDERER · SEPT 2025</figcaption>
        </figure>
        <figure class="story">
          <blockquote>“Ten days felt like one long, beautiful film.”</blockquote>
          <figcaption class="font-mono">THE D'SOUZAS — THE GRAND VALLEY · APR 2026</figcaption>
        </figure>
        <figure class="story">
          <blockquote>“Our kids still talk about the shikara man's songs.”</blockquote>
          <figcaption class="font-mono">PRIYA &amp; FAMILY — CUSTOM TRIP · JUNE 2025</figcaption>
        </figure>
      </div>
      <div class="stories__dots" role="tablist" aria-label="Testimonials">
        <button class="stories__dot is-active" aria-label="Story 1"></button>
        <button class="stories__dot" aria-label="Story 2"></button>
        <button class="stories__dot" aria-label="Story 3"></button>
        <button class="stories__dot" aria-label="Story 4"></button>
      </div>
    </section>

    <section class="contact" id="contact" data-section="07">
      <div class="contact__mist" aria-hidden="true"></div>
      <h2>The valley is <em>calling.</em></h2>
      <form class="contact__form" novalidate>
        <div class="field">
          <label class="font-mono" for="f-name">NAME</label>
          <input id="f-name" name="name" type="text" autocomplete="name" required />
          <span class="field__hint">Tell us who you are</span>
        </div>
        <div class="field">
          <label class="font-mono" for="f-email">EMAIL</label>
          <input id="f-email" name="email" type="email" autocomplete="email" required />
          <span class="field__hint">We need a real address to write back</span>
        </div>
        <div class="field">
          <label class="font-mono" for="f-when">WHEN?</label>
          <input id="f-when" name="when" type="text" placeholder="October 2026" />
          <span class="field__hint"></span>
        </div>
        <div class="field field--wide">
          <label class="font-mono" for="f-dream">YOUR DREAM TRIP</label>
          <textarea id="f-dream" name="dream" rows="3"></textarea>
          <span class="field__hint"></span>
        </div>
        <button class="contact__submit font-mono" type="submit">BEGIN YOUR JOURNEY</button>
      </form>
      <div class="contact__done" hidden>
        <p class="contact__done-line">The valley heard you. We'll write to you within a day.</p>
        <p class="font-mono contact__done-meta">INQUIRY LOGGED — 34.08°N</p>
      </div>
      <p class="visually-hidden contact__live" aria-live="polite"></p>
    </section>
  </main>

  <footer class="footer" data-section="08">
    <div class="footer__rule" aria-hidden="true"></div>
    <p class="footer__word" aria-hidden="true">Jehovah Jireh</p>
    <p class="footer__tag">Paradise, <em>found.</em></p>
    <div class="footer__cols">
      <div><p class="label">VISIT</p><p>Boulevard Road, Dal Gate<br />Srinagar, Jammu &amp; Kashmir 190001</p></div>
      <div><p class="label">WRITE</p><p>hello@jehovahjireh.travel<br />+91 194 000 0000</p></div>
      <div><p class="label">FOLLOW</p><p><a href="#">INSTAGRAM</a> · <a href="#">YOUTUBE</a> · <a href="#">WHATSAPP</a></p></div>
    </div>
    <p class="footer__credits font-mono">SHOT ON LOCATION · KASHMIR · 34.08°N 74.79°E · FOOTAGE: PEXELS ARTISTS · © 2026 JEHOVAH JIREH</p>
  </footer>

  <script type="module" src="/src/main.js"></script>
</body>
</html>
```

- [ ] **Step 2: Write src/styles/components.css**

```css
/* ---------- preloader ---------- */
.preloader { position: fixed; inset: 0; z-index: 100; background: #040806; display: flex; align-items: center; justify-content: center; }
.preloader__inner { text-align: center; }
.preloader__alt { font-size: 0.85rem; letter-spacing: 0.35em; color: var(--c-gold); }
.preloader__line { width: 180px; height: 1px; margin: 18px auto 0; background: linear-gradient(90deg, transparent, var(--c-gold), transparent); transform: scaleX(0); }
.preloader__mist { position: absolute; top: 0; bottom: 0; width: 60%; filter: blur(30px); background: radial-gradient(ellipse at center, rgba(230,235,230,0.14), transparent 70%); }
.preloader__mist--l { left: -10%; } .preloader__mist--r { right: -10%; }
/* ---------- cursor ---------- */
.cursor { position: fixed; top: 0; left: 0; z-index: 90; width: 8px; height: 8px; border-radius: 50%; background: var(--c-gold); pointer-events: none; display: flex; align-items: center; justify-content: center; transform: translate(-50%, -50%); transition: width 0.25s var(--ease-out), height 0.25s var(--ease-out), background-color 0.25s, border-color 0.25s; }
.cursor__label { font-size: 0.55rem; letter-spacing: 0.2em; color: var(--c-gold); opacity: 0; transition: opacity 0.2s; }
.cursor.is-link { width: 36px; height: 36px; background: transparent; border: 1px solid var(--c-gold); }
.cursor.is-drag { width: 64px; height: 64px; background: rgba(7,11,9,0.6); border: 1px solid var(--c-gold); }
.cursor.is-drag .cursor__label { opacity: 1; }
@media (pointer: coarse) { .cursor { display: none; } }
/* ---------- grain ---------- */
.grain { position: fixed; inset: -50%; width: 200%; height: 200%; z-index: 80; pointer-events: none; opacity: 0.035; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E"); animation: grain 8s steps(10) infinite; }
@keyframes grain { 0%,100% { transform: translate(0,0); } 20% { transform: translate(-3%,-6%); } 40% { transform: translate(-6%,2%); } 60% { transform: translate(4%,-4%); } 80% { transform: translate(2%,6%); } }
@media (prefers-reduced-motion: reduce) { .grain { animation: none; } }
/* ---------- progress + marker ---------- */
.progress { position: fixed; top: 0; left: 0; right: 0; height: 2px; z-index: 85; background: var(--c-gold); transform: scaleX(0); transform-origin: left; }
.marker { position: fixed; left: 22px; bottom: 20px; z-index: 85; font-size: 0.7rem; letter-spacing: 0.3em; color: rgba(240,234,214,0.45); }
/* ---------- nav ---------- */
.nav { position: fixed; top: 0; left: 0; right: 0; z-index: 86; display: flex; justify-content: space-between; align-items: center; padding: 22px 32px; transition: transform 0.45s var(--ease-out), background-color 0.35s, backdrop-filter 0.35s; }
.nav--hidden { transform: translateY(-110%); }
.nav--solid { background: rgba(7,11,9,0.55); backdrop-filter: blur(12px); }
.nav__brand { font-size: 0.8rem; letter-spacing: 0.3em; }
.nav__links { display: flex; gap: 26px; align-items: center; font-size: 0.65rem; letter-spacing: 0.25em; }
.nav__links a:not(.nav__cta) { opacity: 0.75; transition: opacity 0.25s; }
.nav__links a:hover { opacity: 1; }
.nav__cta { border: 1px solid rgba(212,175,55,0.6); color: var(--c-gold); padding: 8px 16px; transition: background-color 0.3s, color 0.3s; }
.nav__cta:hover { background: var(--c-gold); color: var(--c-bg); }
@media (max-width: 767px) { .nav__links a:not(.nav__cta) { display: none; } .nav { padding: 16px 20px; } }
/* ---------- form fields ---------- */
.field { position: relative; display: flex; flex-direction: column; gap: 8px; }
.field label { font-size: 0.65rem; letter-spacing: 0.3em; color: var(--c-gold); }
.field input, .field textarea { background: transparent; border: 0; border-bottom: 1px solid rgba(240,234,214,0.25); color: var(--c-ivory); font-family: var(--font-serif); font-size: 1.15rem; padding: 6px 2px; border-radius: 0; }
.field input:focus, .field textarea:focus { outline: none; }
.field::after { content: ""; position: absolute; left: 0; right: 0; bottom: 0; height: 1px; background: var(--c-gold); transform: scaleX(0); transform-origin: left; transition: transform 0.5s var(--ease-out); }
.field:focus-within::after { transform: scaleX(1); }
.field__hint { font-family: var(--font-mono); font-size: 0.6rem; letter-spacing: 0.1em; color: #c0392b; opacity: 0; transition: opacity 0.3s; min-height: 1em; }
.field.is-error input, .field.is-error textarea { border-bottom-color: #c0392b; }
.field.is-error .field__hint { opacity: 1; }
```

- [ ] **Step 3: Write src/styles/sections.css**

```css
/* ---------- hero ---------- */
.hero { position: relative; height: 100vh; overflow: hidden; }
.hero__media, .hero__video { position: absolute; inset: 0; width: 100%; height: 100%; }
.hero__video { object-fit: cover; opacity: 0; }
.hero__video.is-active { opacity: 1; }
.hero__shade { position: absolute; inset: 0; background: linear-gradient(180deg, rgba(4,8,6,0.5), transparent 30%, transparent 60%, rgba(4,8,6,0.78)); box-shadow: inset 0 0 140px rgba(0,0,0,0.55); }
.hero__bar { position: absolute; left: 0; right: 0; height: 5vh; background: #000; z-index: 3; }
.hero__bar--top { top: 0; } .hero__bar--bottom { bottom: 0; }
.hero__title { position: absolute; left: 0; right: 0; bottom: 22vh; text-align: center; z-index: 2; }
.hero__title h1 { font-size: clamp(3rem, 8vw, 7rem); }
.hero__caps { position: relative; height: 1.2em; margin-top: 18px; }
.hero__cap { position: absolute; left: 0; right: 0; font-size: 0.7rem; letter-spacing: 0.4em; color: rgba(240,234,214,0.75); opacity: 0; }
.hero__cap.is-active { opacity: 1; }
.hero__ticks { position: absolute; left: 0; right: 0; bottom: 13vh; display: flex; justify-content: center; gap: 8px; z-index: 2; }
.hero__tick { width: 28px; height: 2px; background: rgba(240,234,214,0.25); overflow: hidden; }
.hero__tick i { display: block; width: 100%; height: 100%; background: var(--c-gold); transform: scaleX(0); transform-origin: left; }
.hero__log { position: absolute; right: 26px; bottom: 8vh; z-index: 2; font-size: 0.6rem; letter-spacing: 0.15em; color: rgba(240,234,214,0.55); height: 1.2em; }
.hero__log-item { position: absolute; right: 0; bottom: 0; white-space: nowrap; opacity: 0; }
.hero__log-item.is-active { opacity: 1; }
.hero__scroll { position: absolute; left: 26px; bottom: 8vh; z-index: 2; font-size: 0.6rem; letter-spacing: 0.3em; color: rgba(240,234,214,0.5); }
/* ---------- manifesto ---------- */
.manifesto { position: relative; min-height: 100vh; display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center; padding: 20vh 6vw; overflow: hidden; }
.manifesto__mist { position: absolute; inset: -20% -10%; background: radial-gradient(ellipse at 30% 40%, rgba(230,235,230,0.06), transparent 55%), radial-gradient(ellipse at 75% 65%, rgba(230,235,230,0.05), transparent 55%); }
.manifesto__line { font-size: clamp(2.2rem, 6vw, 5rem); line-height: 1.2; position: relative; }
.manifesto__line .w { display: inline-block; }
.manifesto__line--accent { font-style: italic; color: var(--c-gold); }
.manifesto__divider { width: 90px; height: 1px; margin-top: 40px; background: linear-gradient(90deg, transparent, var(--c-gold), transparent); transform: scaleX(0); }
.manifesto__coords { position: absolute; right: 26px; bottom: 26px; font-size: 0.6rem; letter-spacing: 0.2em; color: rgba(240,234,214,0.35); }
/* ---------- destinations ---------- */
.dest { position: relative; overflow: hidden; }
.dest__head { position: absolute; top: 7vh; left: 6vw; z-index: 5; }
.dest__head h2 { font-size: clamp(1.6rem, 3vw, 2.6rem); margin-top: 10px; }
.dest__viewport { height: 100vh; overflow: hidden; }
.dest__track { display: flex; height: 100%; }
.dest__panel { position: relative; flex: 0 0 100vw; height: 100%; overflow: hidden; }
.dest__panel img { width: 100%; height: 100%; object-fit: cover; filter: saturate(0.85) brightness(0.75); }
.dest__panel::after { content: ""; position: absolute; inset: 0; background: linear-gradient(180deg, rgba(4,8,6,0.35), transparent 40%, rgba(4,8,6,0.8)); }
.dest__info { position: absolute; left: 6vw; bottom: 10vh; z-index: 2; }
.dest__index { font-size: 0.65rem; letter-spacing: 0.3em; color: var(--c-gold); }
.dest__name { font-size: clamp(3rem, 7vw, 6.5rem); line-height: 1; }
.dest__alt { margin-top: 8px; font-size: 0.65rem; letter-spacing: 0.25em; color: rgba(240,234,214,0.6); }
.dest__line { margin-top: 6px; font-size: 1.3rem; font-style: italic; color: rgba(240,234,214,0.85); }
@media (max-width: 767px) {
  .dest__viewport { overflow-x: auto; scroll-snap-type: x mandatory; -webkit-overflow-scrolling: touch; }
  .dest__panel { flex: 0 0 86vw; scroll-snap-align: center; }
}
/* ---------- journeys ---------- */
.journeys { padding: 18vh 6vw; }
.journeys h2 { font-size: clamp(1.8rem, 3.4vw, 3rem); margin: 12px 0 60px; }
.journeys__grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 26px; }
@media (max-width: 1023px) { .journeys__grid { grid-template-columns: 1fr; max-width: 560px; } }
.jcard { position: relative; background: rgba(30,58,47,0.25); border: 1px solid rgba(240,234,214,0.12); padding: 34px 28px; transform-style: preserve-3d; transition: border-color 0.35s; will-change: transform; }
.jcard:hover { border-color: rgba(212,175,55,0.7); }
.jcard--flagship { border-color: rgba(212,175,55,0.5); }
.jcard h3 { font-size: 1.9rem; }
.jcard__route { margin-top: 10px; font-size: 0.62rem; letter-spacing: 0.22em; color: var(--c-gold); }
.jcard__desc { margin-top: 16px; font-size: 1.05rem; color: rgba(240,234,214,0.8); }
.jcard__price { margin-top: 22px; }
.jcard__amount { font-size: 1.5rem; color: var(--c-ivory); }
.jcard__per { font-size: 0.6rem; letter-spacing: 0.2em; color: rgba(240,234,214,0.5); }
.jcard__toggle { margin-top: 18px; font-size: 0.62rem; letter-spacing: 0.25em; color: var(--c-gold); }
.jcard__days { display: grid; grid-template-rows: 0fr; transition: grid-template-rows 0.5s var(--ease-out); }
.jcard__days > ul { overflow: hidden; list-style: none; }
.jcard.is-open .jcard__days { grid-template-rows: 1fr; }
.jcard__days li { padding: 10px 0 0; font-size: 0.98rem; color: rgba(240,234,214,0.75); }
.jcard__days b { color: var(--c-gold); font-family: var(--font-mono); font-size: 0.7rem; letter-spacing: 0.1em; margin-right: 8px; }
.jcard__reserve { display: inline-block; margin-top: 24px; font-size: 0.62rem; letter-spacing: 0.25em; color: var(--c-ivory); border-bottom: 1px solid var(--c-gold); padding-bottom: 4px; }
/* ---------- interlude ---------- */
.interlude { position: relative; height: 72vh; overflow: hidden; }
.interlude__video { position: absolute; inset: -12% 0; width: 100%; height: 124%; object-fit: cover; filter: brightness(0.7); }
.interlude__quote { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; text-align: center; font-size: clamp(1.6rem, 4vw, 3.2rem); font-style: italic; padding: 0 8vw; text-shadow: 0 2px 30px rgba(0,0,0,0.6); }
/* ---------- stories ---------- */
.stories { position: relative; min-height: 90vh; display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center; padding: 16vh 8vw; overflow: hidden; }
.stories__bg { position: absolute; inset: 0; }
.stories__bgimg { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; opacity: 0; filter: brightness(0.25) saturate(0.7); transition: opacity 1.2s; }
.stories__bgimg.is-active { opacity: 1; animation: bgzoom 8s linear forwards; }
@keyframes bgzoom { from { transform: scale(1); } to { transform: scale(1.07); } }
@media (prefers-reduced-motion: reduce) { .stories__bgimg.is-active { animation: none; } }
.stories__stage { position: relative; margin-top: 40px; width: min(900px, 100%); min-height: 200px; }
.story { position: absolute; inset: 0; opacity: 0; transition: opacity 0.9s; display: flex; flex-direction: column; gap: 22px; justify-content: center; }
.story.is-active { opacity: 1; }
.story blockquote { font-size: clamp(1.5rem, 3.4vw, 2.6rem); font-style: italic; line-height: 1.3; }
.story figcaption { font-size: 0.62rem; letter-spacing: 0.25em; color: rgba(240,234,214,0.55); }
.stories__dots { display: flex; gap: 12px; margin-top: 46px; z-index: 2; }
.stories__dot { width: 8px; height: 8px; border-radius: 50%; background: rgba(240,234,214,0.25); transition: background-color 0.3s, transform 0.3s; }
.stories__dot.is-active { background: var(--c-gold); transform: scale(1.3); }
/* ---------- contact ---------- */
.contact { position: relative; min-height: 100vh; display: flex; flex-direction: column; justify-content: center; align-items: center; padding: 16vh 6vw; overflow: hidden; }
.contact__mist { position: absolute; inset: -20%; background: radial-gradient(ellipse at 50% 100%, rgba(212,175,55,0.07), transparent 55%), radial-gradient(ellipse at 20% 20%, rgba(230,235,230,0.05), transparent 50%); }
.contact h2 { font-size: clamp(2.4rem, 6vw, 5rem); text-align: center; }
.contact__form { position: relative; z-index: 2; margin-top: 60px; width: min(760px, 100%); display: grid; grid-template-columns: 1fr 1fr; gap: 34px 40px; }
.field--wide { grid-column: 1 / -1; }
@media (max-width: 767px) { .contact__form { grid-template-columns: 1fr; } }
.contact__submit { grid-column: 1 / -1; justify-self: center; margin-top: 10px; border: 1px solid var(--c-gold); color: var(--c-gold); letter-spacing: 0.3em; font-size: 0.7rem; padding: 16px 42px; position: relative; overflow: hidden; transition: color 0.3s, background-color 0.3s; }
.contact__submit:hover { background: var(--c-gold); color: var(--c-bg); }
.contact__submit::after { content: ""; position: absolute; top: 0; bottom: 0; width: 40%; left: -60%; background: linear-gradient(105deg, transparent, rgba(212,175,55,0.25), transparent); animation: shimmer 3.2s var(--ease-out) infinite; }
@keyframes shimmer { 0% { left: -60%; } 60%, 100% { left: 130%; } }
@media (prefers-reduced-motion: reduce) { .contact__submit::after { animation: none; } }
.contact__done { position: relative; z-index: 2; margin-top: 70px; text-align: center; }
.contact__done-line { font-size: clamp(1.4rem, 3vw, 2.2rem); font-style: italic; }
.contact__done-meta { margin-top: 16px; font-size: 0.65rem; letter-spacing: 0.25em; color: var(--c-gold); }
/* ---------- footer ---------- */
.footer { position: relative; padding: 12vh 6vw 40px; overflow: hidden; text-align: center; }
.footer__rule { height: 1px; background: linear-gradient(90deg, transparent, var(--c-gold), transparent); transform: scaleX(0); margin-bottom: 10vh; }
.footer__word { font-size: clamp(3.4rem, 11vw, 11rem); line-height: 1; white-space: nowrap; }
.footer__tag { margin-top: 10px; font-style: italic; font-size: 1.3rem; }
.footer__cols { display: flex; justify-content: center; gap: 8vw; margin-top: 8vh; text-align: left; flex-wrap: wrap; }
.footer__cols p:not(.label) { margin-top: 10px; font-size: 1rem; color: rgba(240,234,214,0.75); }
.footer__cols a { border-bottom: 1px solid rgba(212,175,55,0.5); }
.footer__credits { margin-top: 9vh; font-size: 0.58rem; letter-spacing: 0.2em; color: rgba(240,234,214,0.4); }
```

- [ ] **Step 4: Import css in main.js** — after `./styles/base.css` add:

```js
import './styles/components.css';
import './styles/sections.css';
```

- [ ] **Step 5: Verify**

Run: `npm run build` (clean), then `npm run dev`: whole page scrolls vertically; hero shows Cut 1 playing (autoplay muted); destinations show as 5 stacked-wide panels (track overflows horizontally — fine, JS pins later; on mobile width it swipes); form renders; preloader covers screen (it never hides yet — that's Task 5; temporarily verify layout by adding `style="display:none"` on `.preloader` in devtools only).

- [ ] **Step 6: Commit**

```bash
git add index.html src/styles src/main.js
git commit -m "feat: full page markup and static styles for all sections"
```

---

### Task 4: Shared UI — cursor, nav, progress, markers, autoPause

**Files:**
- Create: `src/modules/ui.js`
- Modify: `src/main.js`

**Interfaces:**
- Consumes: `lenis` export from `main.js`, `REDUCED` from `constants.js`, DOM hooks from Task 3.
- Produces: `initUI(lenis)` and `autoPause(video)` — later tasks import `autoPause` from `./modules/ui.js`.

- [ ] **Step 1: Write src/modules/ui.js**

```js
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { REDUCED } from '../constants.js';

export function autoPause(video) {
  const io = new IntersectionObserver(([e]) => {
    if (e.isIntersecting) video.play().catch(() => {});
    else video.pause();
  }, { threshold: 0 });
  io.observe(video);
}

export function initUI(lenis) {
  // --- custom cursor (fine pointers only)
  const cursor = document.querySelector('.cursor');
  if (window.matchMedia('(pointer: fine)').matches) {
    const pos = { x: innerWidth / 2, y: innerHeight / 2 };
    const target = { ...pos };
    addEventListener('mousemove', (e) => { target.x = e.clientX; target.y = e.clientY; });
    gsap.ticker.add(() => {
      pos.x += (target.x - pos.x) * 0.2;
      pos.y += (target.y - pos.y) * 0.2;
      cursor.style.transform = `translate(${pos.x}px, ${pos.y}px) translate(-50%,-50%)`;
    });
    document.querySelectorAll('a, button, input, textarea').forEach((el) => {
      el.addEventListener('mouseenter', () => cursor.classList.add('is-link'));
      el.addEventListener('mouseleave', () => cursor.classList.remove('is-link'));
    });
    document.querySelectorAll('[data-cursor="drag"]').forEach((el) => {
      el.addEventListener('mouseenter', () => cursor.classList.add('is-drag'));
      el.addEventListener('mouseleave', () => cursor.classList.remove('is-drag'));
    });
  } else cursor.remove();

  // --- nav hide/show + solid
  const nav = document.querySelector('.nav');
  let lastY = 0;
  const onScroll = (y) => {
    nav.classList.toggle('nav--hidden', y > lastY + 4 && y > 120);
    if (y < lastY - 4) nav.classList.remove('nav--hidden');
    nav.classList.toggle('nav--solid', y > innerHeight * 0.8);
    lastY = y;
    const max = document.documentElement.scrollHeight - innerHeight;
    document.querySelector('.progress').style.transform = `scaleX(${max ? y / max : 0})`;
  };
  if (lenis && !REDUCED) lenis.on('scroll', ({ scroll }) => onScroll(scroll));
  else addEventListener('scroll', () => onScroll(scrollY), { passive: true });

  // --- smooth anchors
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const el = document.querySelector(a.getAttribute('href'));
      if (!el) return;
      e.preventDefault();
      if (lenis && !REDUCED) lenis.scrollTo(el, { offset: 0 });
      else el.scrollIntoView();
    });
  });

  // --- section marker
  const marker = document.querySelector('.marker');
  document.querySelectorAll('[data-section]').forEach((sec) => {
    ScrollTrigger.create({
      trigger: sec, start: 'top 50%', end: 'bottom 50%',
      onToggle: (self) => {
        if (!self.isActive) return;
        gsap.fromTo(marker, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.4 });
        marker.textContent = sec.dataset.section;
      },
    });
  });
}
```

- [ ] **Step 2: Wire into main.js** (append):

```js
import { initUI } from './modules/ui.js';
initUI(REDUCED ? null : lenis);
```

- [ ] **Step 3: Verify**

`npm run dev` (hide preloader via devtools): gold dot follows mouse and becomes ring on links, DRAG pill over destinations; nav hides scrolling down, returns scrolling up, blurs past hero; progress line grows; marker number changes per section; nav links glide-scroll.

- [ ] **Step 4: Commit**

```bash
git add src/modules/ui.js src/main.js
git commit -m "feat: custom cursor, nav behavior, scroll progress, section markers"
```

---

### Task 5: Preloader — "The Ascent"

**Files:**
- Create: `src/modules/preloader.js`
- Modify: `src/main.js`

**Interfaces:**
- Consumes: `.preloader*` DOM, first `.hero__video` element, `REDUCED`.
- Produces: `initPreloader()`; adds `body.is-loaded` class when reveal completes (hero may listen but does not have to — hero timeline starts independently).

- [ ] **Step 1: Write src/modules/preloader.js**

```js
import gsap from 'gsap';
import { REDUCED } from '../constants.js';

export function initPreloader() {
  const root = document.querySelector('.preloader');
  const alt = root.querySelector('.preloader__alt');
  const line = root.querySelector('.preloader__line');
  const fmt = new Intl.NumberFormat('en-IN');

  const reveal = () => {
    const tl = gsap.timeline({ onComplete: () => { root.remove(); document.body.classList.add('is-loaded'); } });
    tl.to('.preloader__mist--l', { xPercent: -120, duration: 1.1, ease: 'power2.inOut' }, 0)
      .to('.preloader__mist--r', { xPercent: 120, duration: 1.1, ease: 'power2.inOut' }, 0)
      .to(root, { autoAlpha: 0, duration: 0.8, ease: 'power1.out' }, 0.35);
  };

  if (REDUCED) { root.remove(); document.body.classList.add('is-loaded'); return; }

  const video = document.querySelector('.hero__video');
  const ready = new Promise((res) => {
    if (video.readyState >= 3) return res();
    video.addEventListener('canplay', res, { once: true });
    setTimeout(res, 4000);
  });

  const count = { v: 0 };
  const counting = gsap.timeline()
    .to(line, { scaleX: 1, duration: 2.2, ease: 'power2.inOut' }, 0)
    .to(count, {
      v: 2650, duration: 2.2, ease: 'power2.inOut',
      onUpdate: () => { alt.textContent = `${fmt.format(Math.round(count.v))} M`; },
    }, 0);

  Promise.all([ready, new Promise((r) => counting.eventCallback('onComplete', r))]).then(reveal);
}
```

- [ ] **Step 2: Wire into main.js:** `import { initPreloader } from './modules/preloader.js'; initPreloader();`

- [ ] **Step 3: Verify**

Reload dev page: counter climbs 0 → 2,650 M with gold line; mist parts; hero revealed playing. With devtools "Emulate prefers-reduced-motion", page shows instantly with no counter.

- [ ] **Step 4: Commit**

```bash
git add src/modules/preloader.js src/main.js
git commit -m "feat: altitude-counter preloader with mist reveal"
```

---

### Task 6: Hero — three-shot film + scroll-out

**Files:**
- Create: `src/modules/hero.js`
- Modify: `src/main.js`

**Interfaces:**
- Consumes: hero DOM (Task 3), `autoPause` pattern via own IntersectionObserver, `REDUCED`.
- Produces: `initHero()`.

- [ ] **Step 1: Write src/modules/hero.js**

```js
import gsap from 'gsap';
import { REDUCED } from '../constants.js';

const CUT = 8, FADE = 1;

export function initHero() {
  const vids = gsap.utils.toArray('.hero__video');
  const caps = gsap.utils.toArray('.hero__cap');
  const logs = gsap.utils.toArray('.hero__log-item');
  const ticks = gsap.utils.toArray('.hero__tick i');
  vids[0].play().catch(() => {});

  if (!REDUCED) {
    const master = gsap.timeline({ repeat: -1 });
    vids.forEach((v, i) => {
      const at = i * CUT;
      master
        .to(v, { autoAlpha: 1, duration: FADE }, at)
        .fromTo(v, { scale: 1 }, { scale: 1.06, duration: CUT + FADE, ease: 'none' }, at)
        .to(caps[i], { autoAlpha: 1, duration: FADE * 0.6 }, at)
        .to(logs[i], { autoAlpha: 1, duration: FADE * 0.6 }, at)
        .fromTo(ticks[i], { scaleX: 0 }, { scaleX: 1, duration: CUT - FADE, ease: 'none' }, at + FADE * 0.5)
        .to(v, { autoAlpha: 0, duration: FADE }, at + CUT)
        .to(caps[i], { autoAlpha: 0, duration: FADE * 0.6 }, at + CUT)
        .to(logs[i], { autoAlpha: 0, duration: FADE * 0.6 }, at + CUT)
        .set(ticks[i], { scaleX: 0 }, at + CUT + FADE);
      v.addEventListener('canplay', () => v.play().catch(() => {}), { once: true });
    });
    // wrap crossfade: bring Cut 1 back up while Cut 3 fades, so the loop has no dark seam
    master.to(vids[0], { autoAlpha: 1, duration: FADE }, 3 * CUT);
    // remove initial is-active flags — timeline owns opacity now
    vids[0].classList.remove('is-active');
    gsap.set(vids[0], { autoAlpha: 1 });

    // pause everything when hero off-screen
    const hero = document.querySelector('#hero');
    new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { master.play(); vids.forEach((v) => v.play().catch(() => {})); }
      else { master.pause(); vids.forEach((v) => v.pause()); }
    }, { threshold: 0 }).observe(hero);

    // scroll-out scrub
    gsap.timeline({ scrollTrigger: { trigger: '#hero', start: 'top top', end: '+=80%', scrub: true } })
      .to('.hero__title', { yPercent: -35, autoAlpha: 0, ease: 'none' }, 0)
      .to('.hero__scroll', { autoAlpha: 0, ease: 'none' }, 0)
      .to('.hero__bar--top', { height: '7vh', ease: 'none' }, 0)
      .to('.hero__bar--bottom', { height: '7vh', ease: 'none' }, 0);
  }
  document.addEventListener('visibilitychange', () => {
    vids.forEach((v) => (document.hidden ? v.pause() : null));
  });
}
```

- [ ] **Step 2: Wire into main.js:** `import { initHero } from './modules/hero.js'; initHero();`

- [ ] **Step 3: Verify**

Full 24s loop: Drive → Aru → Gulmarg crossfades with slow zoom; captions/log swap; ticks fill sequentially and reset; scrolling away pauses videos (check devtools media panel) and title lifts/fades with bars closing; reduced-motion shows static Cut 1 only.

- [ ] **Step 4: Commit**

```bash
git add src/modules/hero.js src/main.js
git commit -m "feat: hero three-shot cinematic sequence with scroll-out"
```

---

### Task 7: Manifesto — word-by-word scrub

**Files:**
- Create: `src/modules/manifesto.js`
- Modify: `src/main.js`

**Interfaces:**
- Consumes: `#manifesto`, `[data-split]`, `.manifesto__mist`, `.manifesto__divider`; `REDUCED`.
- Produces: `initManifesto()`; also exports `splitWords(el)` (returns array of word spans) reused nowhere else but tested here.

- [ ] **Step 1: Write src/modules/manifesto.js**

```js
import gsap from 'gsap';
import { REDUCED } from '../constants.js';

export function splitWords(el) {
  const words = el.textContent.trim().split(/\s+/);
  el.textContent = '';
  return words.map((w, i) => {
    const s = document.createElement('span');
    s.className = 'w';
    s.textContent = w;
    el.appendChild(s);
    if (i < words.length - 1) el.appendChild(document.createTextNode(' '));
    return s;
  });
}

export function initManifesto() {
  const lines = gsap.utils.toArray('#manifesto [data-split]');
  const spans = lines.flatMap((l) => splitWords(l));
  if (REDUCED) return;
  gsap.timeline({
    scrollTrigger: { trigger: '#manifesto', start: 'top 75%', end: 'center 45%', scrub: true },
  })
    .fromTo(spans, { autoAlpha: 0, y: 34 }, { autoAlpha: 1, y: 0, stagger: 0.12, ease: 'none' })
    .to('.manifesto__divider', { scaleX: 1, duration: 0.6 });
  gsap.to('.manifesto__mist', {
    yPercent: -18, ease: 'none',
    scrollTrigger: { trigger: '#manifesto', start: 'top bottom', end: 'bottom top', scrub: true },
  });
}
```

- [ ] **Step 2: Wire into main.js:** `import { initManifesto } from './modules/manifesto.js'; initManifesto();`

- [ ] **Step 3: Verify**

Scrolling into manifesto reveals words one-by-one; scrolling back up rewinds them; divider draws at the end; mist drifts slower than page.

- [ ] **Step 4: Commit**

```bash
git add src/modules/manifesto.js src/main.js
git commit -m "feat: manifesto word-by-word scroll reveal"
```

---

### Task 8: Destinations — pinned horizontal journey

**Files:**
- Create: `src/modules/destinations.js`
- Modify: `src/main.js`

**Interfaces:**
- Consumes: `.dest`, `.dest__viewport`, `.dest__track`, `.dest__panel` (+ inner `img`, `.dest__name`); `REDUCED`, `isDesktop` from `constants.js`; the `lenis` instance passed as a parameter from `main.js`.
- Produces: `initDestinations(lenis)` — called as `initDestinations(REDUCED ? null : lenis)`.

- [ ] **Step 1: Write src/modules/destinations.js**

```js
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { REDUCED, isDesktop } from '../constants.js';

export function initDestinations(lenis) {
  if (REDUCED || !isDesktop()) return; // mobile: CSS snap strip

  const track = document.querySelector('.dest__track');
  const panels = gsap.utils.toArray('.dest__panel');
  const dist = () => track.scrollWidth - window.innerWidth;

  const scrollTween = gsap.to(track, {
    x: () => -dist(),
    ease: 'none',
    scrollTrigger: {
      trigger: '.dest', start: 'top top',
      end: () => `+=${dist()}`,
      scrub: 1, pin: true, invalidateOnRefresh: true, anticipatePin: 1,
    },
  });

  panels.forEach((panel) => {
    gsap.fromTo(panel.querySelector('img'), { scale: 1.18 }, {
      scale: 1, ease: 'none',
      scrollTrigger: { trigger: panel, containerAnimation: scrollTween, start: 'left right', end: 'right left', scrub: true },
    });
    gsap.fromTo(panel.querySelector('.dest__name'), { xPercent: 12 }, {
      xPercent: -6, ease: 'none',
      scrollTrigger: { trigger: panel, containerAnimation: scrollTween, start: 'left right', end: 'right left', scrub: true },
    });
  });

  // drag nicety: dragging the pinned gallery drives page scroll (scroll stays primary)
  if (lenis) {
    const viewport = document.querySelector('.dest__viewport');
    let dragging = false, startX = 0, startScroll = 0;
    viewport.addEventListener('pointerdown', (e) => {
      dragging = true; startX = e.clientX; startScroll = window.scrollY;
    });
    addEventListener('pointermove', (e) => {
      if (dragging) lenis.scrollTo(startScroll + (startX - e.clientX) * 1.5, { immediate: true });
    });
    addEventListener('pointerup', () => { dragging = false; });
  }
}
```

- [ ] **Step 2: Wire into main.js:** `import { initDestinations } from './modules/destinations.js'; initDestinations(REDUCED ? null : lenis);`

- [ ] **Step 3: Verify**

Desktop: section pins; vertical scroll slides 5 panels horizontally; images de-zoom while names drift (parallax); scroll-back reverses cleanly; after last panel the page releases. Narrow window (<768px, reload): no pin — native horizontal swipe with snap. No horizontal scrollbar on body at any width.

- [ ] **Step 4: Commit**

```bash
git add src/modules/destinations.js src/main.js
git commit -m "feat: pinned horizontal destinations journey with parallax"
```

---

### Task 9: Journeys — cards, price count-up, tilt, itinerary expand

**Files:**
- Create: `src/modules/journeys.js`
- Modify: `src/main.js`

**Interfaces:**
- Consumes: `.jcard[data-price]`, `.jcard__amount`, `.jcard__toggle`, `.jcard__days`, CSS class `is-open`; `REDUCED`.
- Produces: `initJourneys()`.

- [ ] **Step 1: Write src/modules/journeys.js**

```js
import gsap from 'gsap';
import { REDUCED } from '../constants.js';

export function initJourneys() {
  const cards = gsap.utils.toArray('.jcard');
  const fmt = new Intl.NumberFormat('en-IN');

  if (!REDUCED) {
    gsap.from(cards, {
      autoAlpha: 0, y: 60, stagger: 0.15, duration: 1, ease: 'power2.out',
      scrollTrigger: { trigger: '.journeys__grid', start: 'top 78%' },
    });
  }

  cards.forEach((card) => {
    const amount = card.querySelector('.jcard__amount');
    const target = Number(card.dataset.price);
    const setPrice = (v) => { amount.textContent = `₹${fmt.format(Math.round(v))}`; };
    if (REDUCED) setPrice(target);
    else {
      const obj = { v: 0 };
      gsap.to(obj, {
        v: target, duration: 1.6, ease: 'power2.out', onUpdate: () => setPrice(obj.v),
        scrollTrigger: { trigger: card, start: 'top 80%' },
      });
    }

    const toggle = card.querySelector('.jcard__toggle');
    toggle.addEventListener('click', () => {
      const open = card.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(open));
      toggle.textContent = open ? 'ITINERARY –' : 'ITINERARY +';
    });

    if (!REDUCED && window.matchMedia('(pointer: fine)').matches) {
      card.addEventListener('mousemove', (e) => {
        const r = card.getBoundingClientRect();
        const rx = ((e.clientY - r.top) / r.height - 0.5) * -6;
        const ry = ((e.clientX - r.left) / r.width - 0.5) * 6;
        gsap.to(card, { rotateX: rx, rotateY: ry, transformPerspective: 900, duration: 0.4, ease: 'power2.out' });
      });
      card.addEventListener('mouseleave', () => gsap.to(card, { rotateX: 0, rotateY: 0, duration: 0.6, ease: 'power2.out' }));
    }
  });
}
```

- [ ] **Step 2: Wire into main.js:** `import { initJourneys } from './modules/journeys.js'; initJourneys();`

- [ ] **Step 3: Verify**

Cards rise staggered on entry; prices count 0 → ₹48,500 / ₹86,000 / ₹32,500; hover tilts ≤6° and settles back; ITINERARY + expands day list smoothly (and toggles to –, aria-expanded true); works by keyboard (tab + enter).

- [ ] **Step 4: Commit**

```bash
git add src/modules/journeys.js src/main.js
git commit -m "feat: journey cards with count-up prices, tilt, expanding itineraries"
```

---

### Task 10: Interlude + Stories

**Files:**
- Create: `src/modules/interlude.js`, `src/modules/stories.js`
- Modify: `src/main.js`

**Interfaces:**
- Consumes: `.interlude__video[data-src]`, `.interlude__quote`; `.story`, `.stories__dot`, `.stories__bgimg`, class `is-active`; `autoPause` from `./ui.js`; `REDUCED`.
- Produces: `initInterlude()`, `initStories()`.

- [ ] **Step 1: Write src/modules/interlude.js**

```js
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { autoPause } from './ui.js';
import { REDUCED } from '../constants.js';

export function initInterlude() {
  const video = document.querySelector('.interlude__video');
  ScrollTrigger.create({
    trigger: '#interlude', start: 'top 120%', once: true,
    onEnter: () => { video.src = video.dataset.src; video.load(); autoPause(video); },
  });
  if (REDUCED) return;
  gsap.to(video, {
    yPercent: 10, ease: 'none',
    scrollTrigger: { trigger: '#interlude', start: 'top bottom', end: 'bottom top', scrub: true },
  });
  gsap.fromTo('.interlude__quote', { yPercent: 18 }, {
    yPercent: -18, ease: 'none',
    scrollTrigger: { trigger: '#interlude', start: 'top bottom', end: 'bottom top', scrub: true },
  });
}
```

- [ ] **Step 2: Write src/modules/stories.js**

```js
import { REDUCED } from '../constants.js';

export function initStories() {
  const stories = [...document.querySelectorAll('.story')];
  const dots = [...document.querySelectorAll('.stories__dot')];
  const bgs = [...document.querySelectorAll('.stories__bgimg')];
  let i = 0, timer = null;

  const show = (n) => {
    i = (n + stories.length) % stories.length;
    stories.forEach((s, k) => s.classList.toggle('is-active', k === i));
    dots.forEach((d, k) => d.classList.toggle('is-active', k === i));
    bgs.forEach((b, k) => b.classList.toggle('is-active', k === i % bgs.length));
  };
  const start = () => { if (!REDUCED) timer = setInterval(() => show(i + 1), 6000); };
  const stop = () => clearInterval(timer);

  dots.forEach((d, k) => d.addEventListener('click', () => { stop(); show(k); start(); }));
  const stage = document.querySelector('.stories__stage');
  stage.addEventListener('mouseenter', stop);
  stage.addEventListener('mouseleave', start);
  stage.addEventListener('focusin', stop);
  stage.addEventListener('focusout', start);
  show(0); start();
}
```

- [ ] **Step 3: Wire into main.js:**

```js
import { initInterlude } from './modules/interlude.js'; initInterlude();
import { initStories } from './modules/stories.js'; initStories();
```

- [ ] **Step 4: Verify**

Interlude video only requests its mp4 as you approach (network panel); parallax drift on video and quote; pauses off-screen. Stories rotate every 6s with crossfade + bg change; dots jump; hover pauses rotation; reduced-motion = static first story.

- [ ] **Step 5: Commit**

```bash
git add src/modules/interlude.js src/modules/stories.js src/main.js
git commit -m "feat: parallax lake interlude and rotating traveler stories"
```

---

### Task 11: Contact form + Footer

**Files:**
- Create: `src/modules/contact.js`, `src/modules/footer.js`
- Modify: `src/main.js`

**Interfaces:**
- Consumes: `.contact__form`, `.field`, `.field__hint`, `.contact__done`, `.contact__live`; `.footer__word`, `.footer__rule`; `REDUCED`.
- Produces: `initContact()`, `initFooter()`.

- [ ] **Step 1: Write src/modules/contact.js**

```js
import gsap from 'gsap';
import { REDUCED } from '../constants.js';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function initContact() {
  const form = document.querySelector('.contact__form');
  const done = document.querySelector('.contact__done');
  const live = document.querySelector('.contact__live');

  const setError = (input, msg) => {
    const field = input.closest('.field');
    field.classList.toggle('is-error', Boolean(msg));
    field.querySelector('.field__hint').textContent = msg || field.querySelector('.field__hint').textContent;
  };

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = form.elements.name;
    const email = form.elements.email;
    let ok = true;
    if (!name.value.trim()) { setError(name, 'Tell us who you are'); ok = false; } else setError(name, '');
    if (!EMAIL_RE.test(email.value)) { setError(email, 'We need a real address to write back'); ok = false; } else setError(email, '');
    if (!ok) return;
    done.hidden = false;
    live.textContent = 'Inquiry sent. The valley heard you.';
    if (REDUCED) { form.hidden = true; return; }
    gsap.to(form, { autoAlpha: 0, y: -20, duration: 0.6, ease: 'power2.in', onComplete: () => { form.hidden = true; } });
    gsap.from(done, { autoAlpha: 0, y: 24, duration: 0.9, delay: 0.5, ease: 'power2.out' });
  });
  ['name', 'email'].forEach((n) => form.elements[n].addEventListener('input', () => setError(form.elements[n], '')));
}
```

- [ ] **Step 2: Write src/modules/footer.js**

```js
import gsap from 'gsap';
import { REDUCED } from '../constants.js';

export function initFooter() {
  if (REDUCED) {
    document.querySelector('.footer__rule').style.transform = 'scaleX(1)';
    return;
  }
  gsap.to('.footer__rule', {
    scaleX: 1, duration: 1.2, ease: 'power2.out',
    scrollTrigger: { trigger: '.footer', start: 'top 85%' },
  });
  gsap.fromTo('.footer__word', { yPercent: 45, autoAlpha: 0 }, {
    yPercent: 0, autoAlpha: 1, ease: 'none',
    scrollTrigger: { trigger: '.footer', start: 'top 90%', end: 'bottom bottom', scrub: 1 },
  });
}
```

- [ ] **Step 3: Wire into main.js:**

```js
import { initContact } from './modules/contact.js'; initContact();
import { initFooter } from './modules/footer.js'; initFooter();
```

- [ ] **Step 4: Verify**

Empty submit: both underlines turn red with hints; typing clears errors; valid submit crossfades to "The valley heard you…" and screen-reader live region updates. Footer: gold rule draws, giant "Jehovah Jireh" rises as you reach the end.

- [ ] **Step 5: Commit**

```bash
git add src/modules/contact.js src/modules/footer.js src/main.js
git commit -m "feat: inquiry form validation flow and footer signature reveal"
```

---

### Task 12: Polish pass — favicon/meta, reduced-motion & responsive audit, QA

**Files:**
- Create: `public/favicon.svg`
- Modify: `index.html` (head), any files failing audit

- [ ] **Step 1: Favicon + meta**

`public/favicon.svg`:
```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" fill="#070B09"/><path d="M14 44 L28 20 L38 36 L44 28 L52 44 Z" fill="none" stroke="#D4AF37" stroke-width="3" stroke-linejoin="round"/><circle cx="32" cy="50" r="2" fill="#D4AF37"/></svg>
```
Add to `<head>`:
```html
<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
<meta property="og:title" content="Jehovah Jireh — Paradise, found." />
<meta property="og:description" content="Cinematic journeys through Kashmir — Gulmarg, Sonamarg, Aru, Dal Lake, Gurez." />
<meta property="og:type" content="website" />
<meta name="theme-color" content="#070B09" />
```

- [ ] **Step 2: Audit checklist (fix anything failing, in the file that owns it)**

1. Widths 1440 / 1024 / 768 / 390: no body horizontal overflow; hero type scales; journeys stack ≤1023; dest snap-strip <768.
2. Reduced-motion emulation: no preloader count, no pin, no parallax, static hero cut 1, static story, form still fully functional.
3. Keyboard: tab reaches nav links, jcard toggles, dots, form, footer links — gold focus ring visible.
4. Tab hidden (switch tabs): hero videos paused (`visibilitychange`).
5. Scroll to bottom and back at speed ×3: no ScrollTrigger mis-stacking (pin spacing correct after resize; call `ScrollTrigger.refresh()` on `load` in main.js if images shift layout).
6. `npm run build && npm run preview`: production run of everything above; console clean.

- [ ] **Step 3: Lighthouse (desktop) on preview build**

Expected: Accessibility ≥ 95, Best Practices ≥ 95, Performance ≥ 80. Common fixes if short: add `width`/`height` attrs to dest imgs, `fetchpriority="high"` on first hero video poster.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "chore: favicon, meta, accessibility and responsive polish"
```

---

### Task 13: GitHub repository + Pages deploy (FINAL — confirm with user first)

**Files:**
- Create: `.github/workflows/deploy.yml`, `README.md`

- [ ] **Step 0: Confirm with user:** repo name (`jehovah-jireh` suggested) and public visibility. Do not run `gh repo create` without explicit confirmation in-session.

- [ ] **Step 1: Write .github/workflows/deploy.yml**

```yaml
name: Deploy to GitHub Pages
on:
  push: { branches: [main] }
  workflow_dispatch:
permissions: { contents: read, pages: write, id-token: write }
concurrency: { group: pages, cancel-in-progress: true }
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20, cache: npm }
      - run: npm ci
      - run: npm run build
      - uses: actions/upload-pages-artifact@v3
        with: { path: dist }
  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment: { name: github-pages, url: "${{ steps.deployment.outputs.page_url }}" }
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

- [ ] **Step 2: Write README.md**

```markdown
# Jehovah Jireh — Paradise, found.
A cinematic one-page travel site for a (fictional) Kashmir travel agency. Portfolio piece.

**Stack:** Vite · vanilla JS · GSAP ScrollTrigger · Lenis · self-hosted Cormorant Garamond + IBM Plex Mono
**Highlights:** three-shot video hero, altitude preloader, pinned horizontal destinations journey, scroll-scrubbed typography, custom cursor, film grain.
Media: free-license footage/photos from Pexels & Unsplash — see CREDITS.md.

## Develop
npm install && npm run dev

## Build
npm run build
```

- [ ] **Step 3: Create repo, push, enable Pages**

```bash
git add .github README.md && git commit -m "chore: deploy workflow and readme"
gh repo create jehovah-jireh --public --source=. --remote=origin --push
gh api -X POST repos/{owner}/jehovah-jireh/pages -f build_type=workflow || true
gh run watch
```
If the `pages` API call 409s (already enabled) that's fine; if 404s, enable Pages → Source "GitHub Actions" in repo settings UI.

- [ ] **Step 4: Verify**

Open `https://<owner>.github.io/jehovah-jireh/` — full site works including media (paths are relative via `base: './'`).

- [ ] **Step 5: Commit** — (already pushed in Step 3; nothing further)
