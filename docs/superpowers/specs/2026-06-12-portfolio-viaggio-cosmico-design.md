# Portfolio "Viaggio Cosmico" — Design Doc

**Data:** 2026-06-12
**Autore:** Francois Lampasona (con Claude)
**Stato:** In revisione

## Visione

Un sito portfolio personale per Francois Lampasona (Full Stack Developer | DevOps Enthusiast) strutturato come un viaggio cosmico fiabesco in stile "Piccolo Principe": il visitatore scorre attraverso pianeti che raccontano competenze ed esperienze, fino a un finale dipinto (Francois e il suo cane davanti a un universo di nebulose colorate) che si trasforma in una scrivania interattiva con i contenuti pratici (progetti, CV, link, contatti).

Riferimento d'ispirazione: albinotonnina.com (narrativa scroll-driven) + immagine di riferimento fornita dall'utente (arte dipinta cosmica, uomo e cane su un piccolo pianeta).

## Obiettivi e pubblico

- **Pubblico:** sia recruiter/aziende che potenziali clienti freelance.
- **Obiettivo:** impressionare con l'esperienza ("molto figo, moderno, 3D") ma far trovare i contenuti concreti in pochi secondi a chi ha fretta.
- **Lingue:** Italiano + Inglese (toggle IT/EN).

## Approccio scelto

**Ibrido 3D + arte dipinta** (opzione C tra le tre valutate):
- Pianeti, particelle, stelle e camera in vero 3D real-time (React Three Fiber).
- Fondali, nebulose, cieli e scene chiave come immagini dipinte generate con Higgsfield, usate come skybox/billboard nel mondo 3D.
- Motivazione: il 3D puro non riproduce bene il look "dipinto" dell'immagine di riferimento; il 2.5D puro non dà la profondità e l'effetto wow richiesti.

Approcci scartati: (A) 3D puro Three.js — look dipinto difficile da ottenere; (B) illustrato 2.5D parallasse stile albinotonnina — manca il vero 3D richiesto esplicitamente.

## Esperienza utente — le 8 scene

Lo scroll guida la camera 3D lungo un percorso curvo tra i pianeti. Ogni pianeta aggancia dolcemente la camera (snap), il testo del capitolo appare animato. Il protagonista (figura stilizzata di Francois + cane) è presente in ogni scena come filo conduttore.

1. **Decollo (hero):** cielo stellato, nome e titolo, invito a scrollare. Francois e il cane su una cometa.
2. **Origini:** pianeta caldo/ambra — Salemi, Sicilia. Il **Castello di Salemi** in stile dipinto con **bandiera italiana e bandiera siciliana (Trinacria)**. Chi è Francois, la citazione "Rules are for fools. Non mi limito a usare la tecnologia: la esploro, la rompo, la ricostruisco meglio."
3. **Frontend:** pianeta cristallino — React, Flutter, HTML5/CSS, Tailwind; frammenti di UI che prendono vita nella scena.
4. **Backend & DevOps:** pianeta industriale — Spring/Spring Boot, Docker, AWS, CI/CD, PostgreSQL; container e ingranaggi in orbita.
5. **Maserati:** pianeta elegante blu notte, scie di velocità — esperienza Web Content Specialist in Maserati/Gruppo Stellantis, AEM, team internazionali, metodo Agile.
6. **BoopStudio:** pianeta officina creativa — fondazione di BoopStudio, lavoro freelance, siti vetrina/e-commerce (WordPress, WooCommerce, Shopify, Magento), app gestionale palestra in Flutter.
7. **Finale cosmico:** la scena dell'immagine di riferimento — Francois e il cane su un piccolo pianeta davanti all'universo di nebulose colorate (le possibilità future).
8. **La Scrivania:** continuando a scrollare, zoom sulla figura e dissolvenza: la scena diventa una scrivania vista dall'alto con cartelle cliccabili.

### La Scrivania (hub dei contenuti)

Cartelle che aprono finestre in stile "sistema operativo":
- **Progetti** — schede dei lavori principali (e-commerce, app palestra, siti vetrina, progetti personali).
- **CV** — anteprima + download del PDF.
- **Link** — LinkedIn, GitHub.
- **Contatti** — email (mailto) ed eventuale form.

### Accorgimenti UX

- **Pulsante "Salta alla scrivania"** sempre visibile: accesso immediato ai contenuti per chi ha fretta.
- **Costellazione di progresso:** indicatore della posizione nel viaggio.
- **Toggle IT/EN** persistente.
- **Musica d'ambiente opzionale:** off di default, attivabile dall'utente.

## Architettura tecnica

### Stack

| Componente | Scelta | Ruolo |
|---|---|---|
| Build | Vite + React + TypeScript | Base del progetto |
| 3D | React Three Fiber + drei (Three.js) | Pianeti, stelle, particelle, camera |
| Animazione scroll | GSAP ScrollTrigger | Scroll → posizione camera sul percorso curvo |
| Stato | Zustand | Scena attiva, lingua, audio |
| i18n | react-i18next | Dizionari JSON IT/EN |
| UI DOM | HTML/CSS (Tailwind) | Scrivania, finestre, overlay testo |

### Struttura

- Ogni scena/pianeta è un componente React isolato con i propri asset, montato lungo il percorso della camera (curva Catmull-Rom parametrizzata dal progresso di scroll).
- Il testo narrativo è DOM in overlay sincronizzato con lo scroll (non testo 3D), per accessibilità e SEO.
- **La Scrivania è DOM puro** sotto/oltre il canvas 3D: la transizione finale è zoom camera + crossfade. Le finestre OS-style sono componenti React normali — accessibili, indicizzabili, facili da estendere con nuovi progetti.

### Pipeline asset (Higgsfield)

- Claude scrive prompt dettagliati per ogni immagine: fondali nebulosa per scena, texture/elementi dei pianeti, castello di Salemi dipinto, Francois + cane, scrivania.
- Generazione: Claude guida il Chrome dell'utente (estensione Claude in Chrome) sull'account Higgsfield dell'utente, **con conferma dell'utente prima di ogni generazione che consuma crediti**.
- Le immagini vengono ottimizzate (compressione, ridimensionamento) e usate come skybox/billboard/texture.
- Stile coerente: palette e atmosfera dell'immagine di riferimento (nebulose viola/blu/rosa, dettagli ambra, look dipinto).

### Fallback e accessibilità

- **No WebGL / dispositivo debole:** versione statica elegante con le stesse immagini dipinte, scroll normale, tutti i contenuti presenti.
- **`prefers-reduced-motion`:** animazioni ridotte/disattivate.
- **Mobile:** meno particelle, texture compresse, target 30+ fps.
- Testo reale nel DOM (screen reader, SEO); alt text su tutte le immagini; navigazione da tastiera nella scrivania.

### Performance

- Lazy loading degli asset per scena (il sito parte subito, i pianeti si caricano durante il viaggio).
- Texture compresse (WebP/KTX2), code splitting.
- Target: 60 fps desktop, 30+ fps mobile; Lighthouse performance ≥ 90 sulla versione statica.

### Deploy

- Vercel (gratuito, HTTPS, preview deploy). Dominio personalizzato collegabile in seguito (da decidere, es. francoislampasona.dev).

## Testing

- **Unit test:** logica di mapping scroll→scena, i18n, stato Zustand (Vitest).
- **Smoke test E2E (Playwright):** il sito carica, lo skip porta alla scrivania, le cartelle si aprono, i link e il download CV funzionano, il toggle lingua funziona.
- **Verifica manuale per scena** durante lo sviluppo + budget performance (Lighthouse).

## Fuori scope (per ora)

- Blog/articoli.
- CMS o backend: il sito è statico, i contenuti dei progetti vivono in file di dati (JSON/TS).
- Analytics avanzate (eventualmente Vercel Analytics in seguito).
- Form contatti con backend (si parte con mailto; form valutabile dopo).

## Domande aperte

- Dominio definitivo (si può decidere al momento del deploy).
- Lista definitiva dei progetti da mostrare nella cartella Progetti (da raccogliere prima dell'implementazione della scrivania).
