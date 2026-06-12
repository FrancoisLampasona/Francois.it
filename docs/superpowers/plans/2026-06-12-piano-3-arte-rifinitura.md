# Piano 3: Arte e Rifinitura — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development or superpowers:executing-plans. NOTA: il Task 1 (generazione asset) è eseguito dal controller con il CLI Higgsfield previa conferma dell'utente sui crediti; i task di integrazione visiva (3-6) prevedono checkpoint visivi nel browser e tuning iterativo — i valori esatti (posizioni, scale, opacità) si calibrano sul risultato reale.

**Goal:** Sostituire la grafica placeholder con arte dipinta generata via Higgsfield (fondali nebulosa per scena, castello di Salemi, Francois+cane, scrivania), rifinire la transizione viaggio→scrivania, applicare i carry-over di performance/a11y del Piano 2, aggiungere E2E Playwright, favicon e og:image.

**Architecture:** I fondali dipinti vivono in un layer DOM dietro il canvas R3F (canvas trasparente), con crossfade pilotato dalla scena attiva — atmosfera dipinta + profondità 3D reale. Castello e personaggio sono billboard PNG trasparenti dentro la scena 3D (drei). La scrivania diventa un'illustrazione top-down con le cartelle sovrapposte. Gli asset sono ottimizzati in WebP con uno script sharp.

**Tech Stack:** esistente + sharp (devDep, script di ottimizzazione), @playwright/test (E2E), drei useTexture/Billboard.

**Spec:** `docs/superpowers/specs/2026-06-12-portfolio-viaggio-cosmico-design.md`

**Carry-over dal Piano 2 (review finale):** damp camera con delta, frameloop spento fuori viewport, aria-live sui testi scena, costante JOURNEY_BG, README aggiornato, unstub in afterEach.

**Fuori scope / aperto:** musica d'ambiente (il toggle arriverà quando l'utente sceglie/fornisce una traccia — generarla non è affidabile e le librerie CC0 vanno scelte a orecchio); morph fotorealistico finale→scrivania (facciamo zoom+crossfade, non un morph 3D della scena).

---

## Task 1 — Generazione asset (CONTROLLER + Higgsfield CLI, previa conferma utente)

Modello: `gpt_image_2`, `--resolution 2k`, `--wait`. Stile comune (suffisso di ogni prompt):
`"dreamy painted illustration, digital gouache, glowing nebula clouds, soft brush strokes, rich colors, cosmic storybook mood, no text, no watermark"`

| # | File | AR | Prompt (nucleo) |
|---|------|----|-----------------|
| 1 | bg-decollo | 16:9 | deep night sky full of stars, faint indigo and violet nebula at the bottom edge, vast calm space |
| 2 | bg-origini | 16:9 | warm amber and golden nebula clouds rising from the lower right, honey-colored starlight |
| 3 | bg-frontend | 16:9 | teal and emerald aurora ribbons flowing across a dark starfield |
| 4 | bg-backend | 16:9 | deep blue cosmic clouds with geometric star clusters, calm and structured |
| 5 | bg-maserati | 16:9 | midnight indigo sky with sleek diagonal streaks of light suggesting speed |
| 6 | bg-boop | 16:9 | playful pink and magenta nebula bloom with sparkling stars |
| 7 | bg-finale | 16:9 | spectacular colorful nebula sky: purple, blue, pink and orange clouds, two crescent moons, dense glittering stars (mood dell'immagine di riferimento dell'utente) |
| 8 | castello-salemi | 1:1 | medieval stone castle of Salemi Sicily (square Norman keep) on a small hill, Italian tricolor flag and Sicilian Trinacria flag waving on poles, **transparent background** |
| 9 | francois-cane | 1:1 | young man seen from behind standing next to a small dog, looking up at the sky, painted silhouette with warm rim light, **transparent background** |
| 10 | scrivania | 16:9 | breathtaking macOS-style desktop wallpaper, painted cosmic scene: deep starry sky with colorful nebulae, a small glowing planet low on the horizon, clean composition with calm dark areas where desktop icons can sit |
| 11 | og-image | 16:9 | tiny figure with a dog standing on a small pink planet watching an immense colorful nebula sky, epic and tender |
| 12 | favicon | 1:1 | single cute ringed planet, bold simple shapes, readable when tiny, dark background |

Procedura: `higgsfield generate create gpt_image_2 --prompt "..." --aspect_ratio ... --resolution 2k --wait` per ciascuna → scaricare gli URL in `asset-src/` (originali, gitignorata) → Task 2 li ottimizza. Budget atteso ≈ 84 crediti + eventuali rigenerazioni (~120 max). Immagini non soddisfacenti: max 1 retry con prompt corretto, poi si tiene la migliore.

- [ ] Conferma utente sui crediti ricevuta
- [ ] 12 immagini generate e scaricate in `asset-src/`
- [ ] Revisione visiva: coerenza di stile tra i fondali (rigenerare gli outlier)

## Task 2 — Ottimizzazione asset (subagent)

- [ ] `npm i -D sharp`; script `scripts/optimize-assets.mjs`: legge `asset-src/`, produce `public/journey/*.webp` (fondali max 1920w q80, sprite 1024w lossless-alpha, scrivania 1920w, og-image → `public/og.jpg` 1200×630 q85, favicon → `public/favicon.png` 512 + `public/favicon-32.png`)
- [ ] `asset-src/` in `.gitignore`; i WebP ottimizzati SONO committati
- [ ] Test: esiste un file per ogni chiave attesa (test su `public/journey/` con fs, come `profile.test.ts`)

## Task 3 — Fondali dipinti nel viaggio (subagent + checkpoint visivo)

- [ ] `scenes.ts`: aggiungi `backdrop: string` per scena (percorso WebP) e costante `JOURNEY_BG = '#020617'`
- [ ] Nuovo `JourneyBackdrop.tsx`: layer `absolute inset-0 -z-10` dentro lo sticky wrapper; tutte le immagini montate con `opacity-0`, quella attiva `opacity-100`, `transition-opacity duration-1000`; `loading="lazy"` tranne la prima
- [ ] `JourneyCanvas`: canvas trasparente (`gl={{ alpha: true }}`, rimuovi `<color attach="background">`)
- [ ] `JourneyStatic`: usa i backdrop come `background-image` delle sezioni (al posto dei radial-gradient)
- [ ] Test: backdrop attivo segue l'indice scena (jsdom: classi opacity); checkpoint visivo browser

## Task 4 — Castello, personaggio e texture d'atmosfera (subagent + checkpoint visivo)

- [ ] `SceneSprite.tsx`: drei `<Billboard>` + `useTexture` per PNG trasparenti, props {url, position, scale}
- [ ] Castello sul pianeta Origini (poggiato sulla sommità, scala da calibrare); Francois+cane davanti al pianeta Finale
- [ ] Lazy: le texture si caricano col chunk 3D (`useTexture.preload` per le due immagini)
- [ ] Checkpoint visivo: scala/posizione corrette a 60fps

## Task 5 — Scrivania "desktop macOS cosmico" (subagent + checkpoint visivo)

- [ ] `Desk.tsx`: sostituisci il gradiente col wallpaper dipinto (`bg-[url(/journey/scrivania.webp)] bg-cover bg-center`)
- [ ] Look macOS: cartelle come icone desktop (griglia in alto a destra, label con ombra leggera per leggibilità) **+ dock translucido in basso** (`bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20`) con le stesse 4 voci — entrambe le vie aprono le finestre
- [ ] Le finestre OS-style esistenti (semafori, barra titolo) restano: già coerenti col tema
- [ ] Test: aggiorna i test della Desk se i ruoli/nomi cambiano (le voci dock e icone hanno lo stesso accessible name: usare `getAllByRole`); semantica di apertura/chiusura invariata

## Task 6 — Transizione finale→scrivania + carry-over Piano 2 (subagent)

- [ ] CameraRig: lerp → damp con delta (`THREE.MathUtils.damp(...)` o fattore `1 - Math.exp(-k*delta)`, k≈5); scratch vectors per `getPointAt`
- [ ] Zoom finale: nell'ultimo 8% di progress la camera accelera verso il pianeta finale e un overlay scuro (`JourneyBackdrop`) sale a opacity 1 → si atterra sulla scrivania già "al buio" e la scrivania dipinta appare scrollando (crossfade percettivo)
- [ ] Frameloop: IntersectionObserver sullo sticky wrapper → store `journeyVisible`; `<Canvas frameloop={journeyVisible ? 'always' : 'never'}>`
- [ ] `aria-live="polite"` sul contenitore testi dell'overlay
- [ ] `capabilities.test.ts`: `vi.unstubAllGlobals()` in `afterEach`
- [ ] Test: store flag, damp non regredisce i test esistenti; checkpoint visivo

## Task 7 — Favicon, og:image, SEO e README (subagent)

- [ ] `index.html`: `<link rel="icon" href="/favicon-32.png">` + apple-touch, `og:image` → `https://francoislampasona.it/og.jpg`, `twitter:card summary_large_image`
- [ ] README: sezione Struttura aggiornata con `src/journey/`
- [ ] Test: nessuno (markup statico); verifica build

## Task 8 — E2E Playwright (subagent)

- [ ] `npm i -D @playwright/test`; `playwright.config.ts` (chromium, baseURL preview, webServer `npm run preview`)
- [ ] `e2e/smoke.spec.ts`: il sito carica col titolo giusto; "Salta alla scrivania" porta a #desk; le 4 cartelle aprono le finestre; il link CV ha href e download; il toggle IT/EN cambia i testi; (viewport ridotto) la pagina resta navigabile
- [ ] Script `test:e2e`; run verde in locale
- [ ] NOTA: niente CI in questo piano (si può aggiungere GitHub Actions dopo)

## Task 9 — Verifica finale, merge, deploy

- [ ] Suite unit + E2E + build verdi; bundle check (chunk 3D separato; fondali lazy)
- [ ] Verifica visiva completa nel browser reale (viaggio, transizione, scrivania, mobile emulato)
- [ ] Review finale di branch (subagent) → fix → merge su main → push (auto-deploy Vercel)
- [ ] Lighthouse sul deployment: performance ≥ 85 mobile / 90 desktop sulla landing

## Note per l'esecutore

- Branch dedicato `feature/piano-3-arte-rifinitura` da `main`.
- I checkpoint visivi (task 3-6) sono del controller (preview/Chrome): il subagent implementa, il controller guarda e chiede ritocchi mirati (posizioni/scale/opacità) — è tuning, non spec drift.
- Le immagini ottimizzate si committano; gli originali `asset-src/` no.
- Ogni task termina con commit; reviews come nei piani precedenti.
