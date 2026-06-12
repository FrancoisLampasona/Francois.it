# Piano 2: Il Viaggio 3D — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Aggiungere il viaggio cosmico scroll-driven sopra la Scrivania: 7 scene 3D (React Three Fiber) con testi narrativi IT/EN, camera che vola tra i pianeti, fallback statico per no-WebGL/reduced-motion, skip button e costellazione di progresso.

**Architecture:** Lo scroll guida tutto: un contenitore alto `7 × 100vh` con dentro un wrapper `sticky` a tutta viewport che ospita il canvas R3F e l'overlay DOM dei testi. GSAP ScrollTrigger mappa lo scroll del contenitore su un `progress` (0..1) in uno store Zustand; la camera segue una curva Catmull-Rom tra le posizioni delle scene; l'overlay mostra titolo/testo della scena attiva. Dopo il contenitore, in flusso normale, c'è la Scrivania (`id="desk"`) — la fine del viaggio ci arriva scorrendo. Il canvas è lazy-loaded (code splitting): chi non ha WebGL o preferisce reduced-motion riceve `JourneyStatic` (sezioni DOM semplici con gli stessi testi). La grafica è placeholder (sfere colorate, stelle drei): le texture dipinte arrivano nel Piano 3.

**Tech Stack:** three, @react-three/fiber, @react-three/drei, gsap (ScrollTrigger), zustand — sopra lo stack esistente (Vite, React 19, TS, Tailwind v4, Vitest).

**Spec di riferimento:** `docs/superpowers/specs/2026-06-12-portfolio-viaggio-cosmico-design.md`

**Nota test:** jsdom non ha WebGL: i componenti R3F (Canvas/Planet/CameraRig) NON hanno unit test — in jsdom `isWebGLSupported()` è false, quindi i test esercitano il fallback statico. La logica (dati scene, mapping progress→scena, store, overlay, fallback) è tutta testata. La verifica visiva del 3D avviene a fine piano col dev server; gli E2E arrivano nel Piano 3.

---

## Struttura file

```
src/journey/
├── scenes.ts               — dati delle 7 scene (id, chiavi i18n, cameraPos, pianeta)
├── scenes.test.ts
├── store.ts                — zustand: progress + sceneIndexForProgress
├── store.test.ts
├── capabilities.ts         — isWebGLSupported, prefersReducedMotion
├── capabilities.test.ts
├── JourneyOverlay.tsx      — testi scena attiva, costellazione, skip
├── JourneyOverlay.test.tsx
├── JourneyStatic.tsx       — fallback DOM (no WebGL / reduced motion)
├── JourneyStatic.test.tsx
├── Planet.tsx              — sfera placeholder
├── CameraRig.tsx           — camera lungo curva Catmull-Rom
├── JourneyCanvas.tsx       — Canvas R3F (lazy-loaded)
├── Journey.tsx             — orchestratore (scroll container + ScrollTrigger + gate)
└── Journey.test.tsx
src/i18n/it.json / en.json  — + chiavi journey.*
src/App.tsx                 — Journey sopra la Scrivania (id="desk")
```

---

### Task 1: Dipendenze 3D

**Files:**
- Modify: `package.json`, `package-lock.json`

- [ ] **Step 1: Installa le dipendenze**

```bash
npm install three @react-three/fiber @react-three/drei gsap zustand
npm install -D @types/three
```

Expected: `added N packages` senza errori. (Se `@types/three` risulta non necessario perché three porta i suoi tipi, npm lo installa comunque senza danni.)

- [ ] **Step 2: Verifica che build e test restino verdi**

Run: `npm run build && npx vitest run`
Expected: build ok, 26/26 PASS.

- [ ] **Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: dipendenze 3D (three, R3F, drei, gsap, zustand)"
```

---

### Task 2: Dati delle scene e testi narrativi IT/EN

**Files:**
- Create: `src/journey/scenes.ts`, `src/journey/scenes.test.ts`
- Modify: `src/i18n/it.json`, `src/i18n/en.json`

- [ ] **Step 1: Aggiungi le chiavi `journey` a `src/i18n/it.json`** (dentro l'oggetto radice, dopo `projects`):

```json
"journey": {
  "skip": "Salta alla scrivania",
  "progress": "Avanzamento del viaggio",
  "decollo": {
    "title": "Un viaggio tra i mondi che ho costruito",
    "text": "Allacciati: scorri e parti con me e il mio cane per un piccolo giro dell'universo. Ogni pianeta è un pezzo della mia storia."
  },
  "origini": {
    "title": "Origini — Salemi, Sicilia",
    "text": "Cresciuto tra il castello di Salemi e il liceo scientifico: matematica, fisica e la mania di smontare le cose per capire come funzionano. Rules are for fools: la tecnologia la esploro, la rompo, la ricostruisco meglio."
  },
  "frontend": {
    "title": "Il pianeta Frontend",
    "text": "React, Flutter, Tailwind: interfacce vive e reattive, curate fino al pixel. È qui che il codice diventa qualcosa che le persone toccano."
  },
  "backend": {
    "title": "Il pianeta Backend & DevOps",
    "text": "Spring Boot, Docker, AWS, CI/CD: la parte invisibile che regge tutto. Container in orbita e deploy che partono da soli."
  },
  "maserati": {
    "title": "Il pianeta Maserati",
    "text": "Nel Gruppo Stellantis gestisco i siti Maserati a livello globale con Adobe Experience Manager: team internazionali, sprint settimanali, brand che non ammette sbavature."
  },
  "boop": {
    "title": "Il pianeta BoopStudio",
    "text": "La mia startup: siti vetrina, e-commerce e app su misura, dall'idea alla consegna. Ogni cliente è un nuovo mondo da costruire."
  },
  "finale": {
    "title": "L'universo delle possibilità",
    "text": "Ogni progetto è un pianeta nuovo da esplorare. Il prossimo potrebbe essere il tuo: scendi alla mia scrivania e parliamone."
  }
}
```

- [ ] **Step 2: Aggiungi le chiavi `journey` a `src/i18n/en.json`**:

```json
"journey": {
  "skip": "Skip to the desk",
  "progress": "Journey progress",
  "decollo": {
    "title": "A journey through the worlds I've built",
    "text": "Buckle up: scroll and take off with me and my dog for a little tour of the universe. Every planet is a piece of my story."
  },
  "origini": {
    "title": "Origins — Salemi, Sicily",
    "text": "Raised between the castle of Salemi and a scientific high school: maths, physics and the urge to take things apart to see how they work. Rules are for fools: I explore technology, break it, and rebuild it better."
  },
  "frontend": {
    "title": "Planet Frontend",
    "text": "React, Flutter, Tailwind: living, reactive interfaces polished to the pixel. This is where code becomes something people touch."
  },
  "backend": {
    "title": "Planet Backend & DevOps",
    "text": "Spring Boot, Docker, AWS, CI/CD: the invisible part holding everything up. Containers in orbit and deploys that ship themselves."
  },
  "maserati": {
    "title": "Planet Maserati",
    "text": "At Stellantis Group I manage Maserati's global websites with Adobe Experience Manager: international teams, weekly sprints, a brand that allows no rough edges."
  },
  "boop": {
    "title": "Planet BoopStudio",
    "text": "My startup: showcase websites, e-commerce and tailor-made apps, from idea to delivery. Every client is a new world to build."
  },
  "finale": {
    "title": "A universe of possibilities",
    "text": "Every project is a new planet to explore. The next one could be yours: come down to my desk and let's talk."
  }
}
```

- [ ] **Step 3: Scrivi il test (fallirà)**

`src/journey/scenes.test.ts`:

```ts
import i18n from '../i18n'
import { journeyScenes } from './scenes'

test('ci sono 7 scene con id univoci', () => {
  expect(journeyScenes).toHaveLength(7)
  expect(new Set(journeyScenes.map((s) => s.id)).size).toBe(7)
})

test('ogni scena ha chiavi i18n esistenti in entrambe le lingue', () => {
  for (const s of journeyScenes) {
    for (const lng of ['it', 'en'] as const) {
      expect(i18n.exists(s.titleKey, { lng }), `${s.titleKey} (${lng})`).toBe(true)
      expect(i18n.exists(s.textKey, { lng }), `${s.textKey} (${lng})`).toBe(true)
    }
  }
})

test('le coordinate sono numeri finiti', () => {
  for (const s of journeyScenes) {
    for (const n of s.cameraPos) expect(Number.isFinite(n)).toBe(true)
    if (s.planet) {
      for (const n of s.planet.position) expect(Number.isFinite(n)).toBe(true)
      expect(s.planet.radius).toBeGreaterThan(0)
    }
  }
})

test('le scene dei capitoli hanno un pianeta', () => {
  const withPlanet = journeyScenes.filter((s) => s.planet)
  expect(withPlanet.length).toBeGreaterThanOrEqual(6)
})
```

- [ ] **Step 4: Esegui il test e verifica che fallisca**

Run: `npx vitest run src/journey/scenes.test.ts`
Expected: FAIL — `Cannot find module './scenes'`.

- [ ] **Step 5: Crea `src/journey/scenes.ts`**

```ts
export type Vec3 = readonly [number, number, number]

export type JourneyScene = {
  readonly id: string
  readonly titleKey: string
  readonly textKey: string
  readonly cameraPos: Vec3
  readonly planet?: {
    readonly position: Vec3
    readonly radius: number
    readonly color: string
  }
}

export const journeyScenes: readonly JourneyScene[] = [
  {
    id: 'decollo',
    titleKey: 'journey.decollo.title',
    textKey: 'journey.decollo.text',
    cameraPos: [0, 0, 10],
  },
  {
    id: 'origini',
    titleKey: 'journey.origini.title',
    textKey: 'journey.origini.text',
    cameraPos: [12, 2, -6],
    planet: { position: [12, 0, -14], radius: 3, color: '#EF9F27' },
  },
  {
    id: 'frontend',
    titleKey: 'journey.frontend.title',
    textKey: 'journey.frontend.text',
    cameraPos: [24, -2, -22],
    planet: { position: [24, -4, -30], radius: 2.5, color: '#5DCAA5' },
  },
  {
    id: 'backend',
    titleKey: 'journey.backend.title',
    textKey: 'journey.backend.text',
    cameraPos: [12, -6, -38],
    planet: { position: [10, -8, -46], radius: 2.8, color: '#378ADD' },
  },
  {
    id: 'maserati',
    titleKey: 'journey.maserati.title',
    textKey: 'journey.maserati.text',
    cameraPos: [-2, -2, -52],
    planet: { position: [-4, -4, -60], radius: 3.2, color: '#3C3489' },
  },
  {
    id: 'boop',
    titleKey: 'journey.boop.title',
    textKey: 'journey.boop.text',
    cameraPos: [-14, 2, -66],
    planet: { position: [-16, 0, -74], radius: 2.4, color: '#ED93B1' },
  },
  {
    id: 'finale',
    titleKey: 'journey.finale.title',
    textKey: 'journey.finale.text',
    cameraPos: [-10, 6, -82],
    planet: { position: [-10, 2, -92], radius: 4, color: '#D4537E' },
  },
]
```

- [ ] **Step 6: Esegui i test e verifica che passino**

Run: `npx vitest run src/journey/scenes.test.ts src/i18n/parity.test.ts`
Expected: PASS (il test di parità conferma che IT/EN restano allineati).

- [ ] **Step 7: Commit**

```bash
git add src/journey/scenes.ts src/journey/scenes.test.ts src/i18n/it.json src/i18n/en.json
git commit -m "feat: dati scene del viaggio e testi narrativi IT/EN"
```

---

### Task 3: Store del viaggio e mapping progress→scena

**Files:**
- Create: `src/journey/store.ts`, `src/journey/store.test.ts`

- [ ] **Step 1: Scrivi il test (fallirà)**

`src/journey/store.test.ts`:

```ts
import { journeyScenes } from './scenes'
import { sceneIndexForProgress, useJourneyStore } from './store'

beforeEach(() => {
  useJourneyStore.setState({ progress: 0 })
})

test('setProgress clampa tra 0 e 1', () => {
  useJourneyStore.getState().setProgress(-0.5)
  expect(useJourneyStore.getState().progress).toBe(0)
  useJourneyStore.getState().setProgress(1.7)
  expect(useJourneyStore.getState().progress).toBe(1)
  useJourneyStore.getState().setProgress(0.42)
  expect(useJourneyStore.getState().progress).toBe(0.42)
})

test('sceneIndexForProgress copre i confini', () => {
  const n = journeyScenes.length
  expect(sceneIndexForProgress(0)).toBe(0)
  expect(sceneIndexForProgress(1)).toBe(n - 1)
  expect(sceneIndexForProgress(0.5)).toBe(Math.min(n - 1, Math.floor(0.5 * n)))
  expect(sceneIndexForProgress(-1)).toBe(0)
  expect(sceneIndexForProgress(2)).toBe(n - 1)
})
```

- [ ] **Step 2: Esegui il test e verifica che fallisca**

Run: `npx vitest run src/journey/store.test.ts`
Expected: FAIL — `Cannot find module './store'`.

- [ ] **Step 3: Crea `src/journey/store.ts`**

```ts
import { create } from 'zustand'
import { journeyScenes } from './scenes'

type JourneyState = {
  progress: number
  setProgress: (p: number) => void
}

export const useJourneyStore = create<JourneyState>((set) => ({
  progress: 0,
  setProgress: (p) => set({ progress: Math.min(1, Math.max(0, p)) }),
}))

export function sceneIndexForProgress(
  progress: number,
  count: number = journeyScenes.length,
): number {
  if (count <= 0) return 0
  const clamped = Math.min(1, Math.max(0, progress))
  return Math.min(count - 1, Math.floor(clamped * count))
}
```

- [ ] **Step 4: Esegui il test e verifica che passi**

Run: `npx vitest run src/journey/store.test.ts`
Expected: PASS (2 test).

- [ ] **Step 5: Commit**

```bash
git add src/journey/store.ts src/journey/store.test.ts
git commit -m "feat: store del viaggio con progress e mapping scena"
```

---

### Task 4: Capability detection (WebGL, reduced motion)

**Files:**
- Create: `src/journey/capabilities.ts`, `src/journey/capabilities.test.ts`

- [ ] **Step 1: Scrivi il test (fallirà)**

`src/journey/capabilities.test.ts`:

```ts
import { vi } from 'vitest'
import { isWebGLSupported, prefersReducedMotion } from './capabilities'

test('in jsdom WebGL non è supportato', () => {
  expect(isWebGLSupported()).toBe(false)
})

test('prefersReducedMotion è false senza matchMedia', () => {
  expect(prefersReducedMotion()).toBe(false)
})

test('prefersReducedMotion legge matchMedia quando presente', () => {
  vi.stubGlobal('matchMedia', vi.fn().mockReturnValue({ matches: true }))
  expect(prefersReducedMotion()).toBe(true)
  vi.unstubAllGlobals()
})
```

- [ ] **Step 2: Esegui il test e verifica che fallisca**

Run: `npx vitest run src/journey/capabilities.test.ts`
Expected: FAIL — `Cannot find module './capabilities'`.

- [ ] **Step 3: Crea `src/journey/capabilities.ts`**

```ts
export function isWebGLSupported(): boolean {
  try {
    const canvas = document.createElement('canvas')
    return Boolean(canvas.getContext('webgl2') ?? canvas.getContext('webgl'))
  } catch {
    return false
  }
}

export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return false
  }
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}
```

Nota: in jsdom `canvas.getContext('webgl')` restituisce `null` (e può loggare un warning "not implemented" — innocuo).

- [ ] **Step 4: Esegui il test e verifica che passi**

Run: `npx vitest run src/journey/capabilities.test.ts`
Expected: PASS (3 test).

- [ ] **Step 5: Commit**

```bash
git add src/journey/capabilities.ts src/journey/capabilities.test.ts
git commit -m "feat: rilevamento WebGL e prefers-reduced-motion"
```

---

### Task 5: JourneyOverlay (testi, costellazione, skip)

**Files:**
- Create: `src/journey/JourneyOverlay.tsx`, `src/journey/JourneyOverlay.test.tsx`

- [ ] **Step 1: Scrivi il test (fallirà)**

`src/journey/JourneyOverlay.test.tsx`:

```tsx
import { act, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import { journeyScenes } from './scenes'
import { useJourneyStore } from './store'
import { JourneyOverlay } from './JourneyOverlay'

beforeEach(() => {
  useJourneyStore.setState({ progress: 0 })
})

test('mostra titolo e testo della scena attiva', () => {
  render(<JourneyOverlay />)
  expect(screen.getByText('Un viaggio tra i mondi che ho costruito')).toBeInTheDocument()
})

test('cambia testo quando il progress avanza', () => {
  render(<JourneyOverlay />)
  act(() => useJourneyStore.getState().setProgress(0.99))
  expect(screen.getByText("L'universo delle possibilità")).toBeInTheDocument()
})

test('la costellazione ha un punto per scena', () => {
  render(<JourneyOverlay />)
  const nav = screen.getByRole('navigation', { name: 'Avanzamento del viaggio' })
  expect(nav.querySelectorAll('[data-dot]')).toHaveLength(journeyScenes.length)
})

test('il bottone skip porta alla scrivania', async () => {
  const scrollIntoView = vi.fn()
  const desk = document.createElement('div')
  desk.id = 'desk'
  desk.scrollIntoView = scrollIntoView
  document.body.appendChild(desk)

  render(<JourneyOverlay />)
  await userEvent.click(screen.getByRole('button', { name: 'Salta alla scrivania' }))
  expect(scrollIntoView).toHaveBeenCalled()

  desk.remove()
})
```

- [ ] **Step 2: Esegui il test e verifica che fallisca**

Run: `npx vitest run src/journey/JourneyOverlay.test.tsx`
Expected: FAIL — `Cannot find module './JourneyOverlay'`.

- [ ] **Step 3: Crea `src/journey/JourneyOverlay.tsx`**

```tsx
import { useTranslation } from 'react-i18next'
import { journeyScenes } from './scenes'
import { sceneIndexForProgress, useJourneyStore } from './store'
import { prefersReducedMotion } from './capabilities'

export function JourneyOverlay() {
  const { t } = useTranslation()
  const progress = useJourneyStore((s) => s.progress)
  const index = sceneIndexForProgress(progress)
  const scene = journeyScenes[index]

  const skipToDesk = () => {
    document.getElementById('desk')?.scrollIntoView({
      behavior: prefersReducedMotion() ? 'auto' : 'smooth',
    })
  }

  return (
    <div className="pointer-events-none absolute inset-0 z-20 flex flex-col items-center justify-end pb-16">
      <div key={scene.id} className="max-w-xl px-6 text-center">
        <h2 className="text-2xl font-semibold sm:text-3xl">{t(scene.titleKey)}</h2>
        <p className="mt-3 text-sm text-slate-300 sm:text-base">{t(scene.textKey)}</p>
      </div>
      <nav aria-label={t('journey.progress')} className="mt-6 flex gap-2">
        {journeyScenes.map((s, i) => (
          <span
            key={s.id}
            data-dot
            aria-hidden="true"
            className={`h-2 w-2 rounded-full transition-colors ${
              i === index ? 'bg-amber-300' : 'bg-slate-600'
            }`}
          />
        ))}
      </nav>
      <button
        onClick={skipToDesk}
        className="pointer-events-auto mt-6 rounded-full border border-slate-600 px-4 py-1.5 text-sm text-slate-300 hover:bg-white/10 hover:text-white"
      >
        {t('journey.skip')}
      </button>
    </div>
  )
}
```

- [ ] **Step 4: Esegui il test e verifica che passi**

Run: `npx vitest run src/journey/JourneyOverlay.test.tsx`
Expected: PASS (4 test).

- [ ] **Step 5: Commit**

```bash
git add src/journey/JourneyOverlay.tsx src/journey/JourneyOverlay.test.tsx
git commit -m "feat: overlay del viaggio con testi, costellazione e skip"
```

---

### Task 6: JourneyStatic (fallback senza 3D)

**Files:**
- Create: `src/journey/JourneyStatic.tsx`, `src/journey/JourneyStatic.test.tsx`

- [ ] **Step 1: Scrivi il test (fallirà)**

`src/journey/JourneyStatic.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import { journeyScenes } from './scenes'
import { JourneyStatic } from './JourneyStatic'

test('mostra tutte le scene come sezioni testuali', () => {
  render(<JourneyStatic />)
  expect(screen.getByText('Un viaggio tra i mondi che ho costruito')).toBeInTheDocument()
  expect(screen.getByText('Il pianeta Maserati')).toBeInTheDocument()
  expect(screen.getAllByRole('heading', { level: 2 })).toHaveLength(journeyScenes.length)
})
```

- [ ] **Step 2: Esegui il test e verifica che fallisca**

Run: `npx vitest run src/journey/JourneyStatic.test.tsx`
Expected: FAIL — `Cannot find module './JourneyStatic'`.

- [ ] **Step 3: Crea `src/journey/JourneyStatic.tsx`**

```tsx
import { useTranslation } from 'react-i18next'
import { journeyScenes } from './scenes'

export function JourneyStatic() {
  const { t } = useTranslation()
  return (
    <div>
      {journeyScenes.map((scene) => (
        <section
          key={scene.id}
          className="flex min-h-screen flex-col items-center justify-center px-6 text-center"
          style={
            scene.planet
              ? { background: `radial-gradient(ellipse at bottom, ${scene.planet.color}22, #020617 70%)` }
              : { background: '#020617' }
          }
        >
          <h2 className="text-3xl font-semibold">{t(scene.titleKey)}</h2>
          <p className="mt-4 max-w-xl text-slate-300">{t(scene.textKey)}</p>
        </section>
      ))}
    </div>
  )
}
```

- [ ] **Step 4: Esegui il test e verifica che passi**

Run: `npx vitest run src/journey/JourneyStatic.test.tsx`
Expected: PASS (1 test).

- [ ] **Step 5: Commit**

```bash
git add src/journey/JourneyStatic.tsx src/journey/JourneyStatic.test.tsx
git commit -m "feat: fallback statico del viaggio"
```

---

### Task 7: Componenti 3D (Planet, CameraRig, JourneyCanvas)

**Files:**
- Create: `src/journey/Planet.tsx`, `src/journey/CameraRig.tsx`, `src/journey/JourneyCanvas.tsx`

Nessun unit test (jsdom non ha WebGL): la correttezza strutturale è coperta dal type-check (`npm run build`), il comportamento dal controllo visivo nel Task 10.

- [ ] **Step 1: Crea `src/journey/Planet.tsx`**

```tsx
import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import type { Mesh } from 'three'
import type { Vec3 } from './scenes'

type PlanetProps = {
  position: Vec3
  radius: number
  color: string
}

export function Planet({ position, radius, color }: PlanetProps) {
  const ref = useRef<Mesh>(null)
  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.1
  })
  return (
    <mesh ref={ref} position={[position[0], position[1], position[2]]}>
      <sphereGeometry args={[radius, 48, 48]} />
      <meshStandardMaterial color={color} roughness={0.85} metalness={0.1} />
    </mesh>
  )
}
```

- [ ] **Step 2: Crea `src/journey/CameraRig.tsx`**

```tsx
import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { CatmullRomCurve3, Vector3 } from 'three'
import { journeyScenes } from './scenes'
import { sceneIndexForProgress, useJourneyStore } from './store'

export function CameraRig() {
  const curve = useMemo(
    () =>
      new CatmullRomCurve3(
        journeyScenes.map((s) => new Vector3(...s.cameraPos)),
        false,
        'catmullrom',
        0.3,
      ),
    [],
  )
  const lookTarget = useRef(new Vector3(0, 0, -20))

  useFrame(({ camera }) => {
    const progress = useJourneyStore.getState().progress
    const point = curve.getPointAt(Math.min(progress, 0.9999))
    camera.position.lerp(point, 0.08)

    const scene = journeyScenes[sceneIndexForProgress(progress)]
    const desired = scene.planet
      ? new Vector3(...scene.planet.position)
      : curve.getPointAt(Math.min(progress + 0.05, 0.9999))
    lookTarget.current.lerp(desired, 0.06)
    camera.lookAt(lookTarget.current)
  })

  return null
}
```

- [ ] **Step 3: Crea `src/journey/JourneyCanvas.tsx`** (export default: serve per il lazy-load)

```tsx
import { Canvas } from '@react-three/fiber'
import { Stars } from '@react-three/drei'
import { journeyScenes } from './scenes'
import { Planet } from './Planet'
import { CameraRig } from './CameraRig'

export default function JourneyCanvas() {
  return (
    <Canvas camera={{ fov: 60, position: [0, 0, 10] }} dpr={[1, 2]}>
      <color attach="background" args={['#020617']} />
      <ambientLight intensity={0.5} />
      <directionalLight position={[8, 10, 6]} intensity={1.2} />
      <Stars radius={140} depth={90} count={4000} factor={4} saturation={0} fade speed={0.4} />
      {journeyScenes.map(
        (scene) =>
          scene.planet && (
            <Planet
              key={scene.id}
              position={scene.planet.position}
              radius={scene.planet.radius}
              color={scene.planet.color}
            />
          ),
      )}
      <CameraRig />
    </Canvas>
  )
}
```

- [ ] **Step 4: Verifica il type-check**

Run: `npm run build`
Expected: build verde (i componenti non sono ancora montati da nessuna parte — va bene).

- [ ] **Step 5: Commit**

```bash
git add src/journey/Planet.tsx src/journey/CameraRig.tsx src/journey/JourneyCanvas.tsx
git commit -m "feat: componenti 3D placeholder (pianeti, camera, canvas)"
```

---

### Task 8: Journey orchestratore con ScrollTrigger

**Files:**
- Create: `src/journey/Journey.tsx`, `src/journey/Journey.test.tsx`

- [ ] **Step 1: Scrivi il test (fallirà)**

`src/journey/Journey.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import { journeyScenes } from './scenes'
import { Journey } from './Journey'

test('in ambiente senza WebGL mostra il fallback statico con tutte le scene', () => {
  render(<Journey />)
  expect(screen.getAllByRole('heading', { level: 2 })).toHaveLength(journeyScenes.length)
  expect(screen.getByText('Un viaggio tra i mondi che ho costruito')).toBeInTheDocument()
})
```

- [ ] **Step 2: Esegui il test e verifica che fallisca**

Run: `npx vitest run src/journey/Journey.test.tsx`
Expected: FAIL — `Cannot find module './Journey'`.

- [ ] **Step 3: Crea `src/journey/Journey.tsx`**

```tsx
import { Suspense, lazy, useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { journeyScenes } from './scenes'
import { isWebGLSupported, prefersReducedMotion } from './capabilities'
import { useJourneyStore } from './store'
import { JourneyOverlay } from './JourneyOverlay'
import { JourneyStatic } from './JourneyStatic'

gsap.registerPlugin(ScrollTrigger)

const JourneyCanvas = lazy(() => import('./JourneyCanvas'))

export function Journey() {
  const containerRef = useRef<HTMLDivElement>(null)
  const setProgress = useJourneyStore((s) => s.setProgress)
  const [mode] = useState<'3d' | 'static'>(() =>
    isWebGLSupported() && !prefersReducedMotion() ? '3d' : 'static',
  )

  useEffect(() => {
    if (mode !== '3d' || !containerRef.current) return
    const trigger = ScrollTrigger.create({
      trigger: containerRef.current,
      start: 'top top',
      end: 'bottom bottom',
      scrub: true,
      onUpdate: (self) => setProgress(self.progress),
    })
    return () => trigger.kill()
  }, [mode, setProgress])

  if (mode === 'static') {
    return <JourneyStatic />
  }

  return (
    <div ref={containerRef} className="relative" style={{ height: `${journeyScenes.length * 100}vh` }}>
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <Suspense fallback={<div className="h-full w-full bg-[#020617]" />}>
          <JourneyCanvas />
        </Suspense>
        <JourneyOverlay />
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Esegui il test e verifica che passi**

Run: `npx vitest run src/journey/Journey.test.tsx`
Expected: PASS (in jsdom `isWebGLSupported()` è false → renderizza JourneyStatic).

- [ ] **Step 5: Commit**

```bash
git add src/journey/Journey.tsx src/journey/Journey.test.tsx
git commit -m "feat: orchestratore del viaggio con ScrollTrigger e gate 3D/statico"
```

---

### Task 9: Integrazione in App

**Files:**
- Modify: `src/App.tsx`, `src/App.test.tsx`

- [ ] **Step 1: Aggiorna il test di App (fallirà)**

Replace `src/App.test.tsx` with:

```tsx
import { render, screen } from '@testing-library/react'
import App from './App'

test('mostra nome, ruolo e toggle lingua', () => {
  render(<App />)
  expect(screen.getByText('Francois Lampasona')).toBeInTheDocument()
  expect(screen.getByText('Full Stack Developer | DevOps Enthusiast')).toBeInTheDocument()
  expect(screen.getByRole('button', { name: /english/i })).toBeInTheDocument()
})

test('mostra il viaggio prima della scrivania', () => {
  render(<App />)
  expect(screen.getByText('Un viaggio tra i mondi che ho costruito')).toBeInTheDocument()
  expect(screen.getByRole('button', { name: 'Progetti' })).toBeInTheDocument()
})

test('la scrivania è raggiungibile via anchor #desk', () => {
  render(<App />)
  const desk = document.getElementById('desk')
  expect(desk).not.toBeNull()
  expect(desk!.querySelector('[aria-label="La mia scrivania"]')).not.toBeNull()
})
```

- [ ] **Step 2: Esegui il test e verifica che fallisca**

Run: `npx vitest run src/App.test.tsx`
Expected: FAIL — il viaggio e l'anchor non esistono ancora.

- [ ] **Step 3: Aggiorna `src/App.tsx`**

```tsx
import { useTranslation } from 'react-i18next'
import { Journey } from './journey/Journey'
import { Desk } from './components/desk/Desk'
import { LanguageToggle } from './components/LanguageToggle'
import { profile } from './data/profile'

export default function App() {
  const { t } = useTranslation()
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="fixed top-0 z-40 flex w-full items-center justify-between bg-slate-950/80 px-6 py-4 backdrop-blur-sm">
        <div>
          <h1 className="text-base font-semibold">{profile.name}</h1>
          <p className="text-xs text-slate-400">{t('hero.role')}</p>
        </div>
        <LanguageToggle />
      </header>
      <main>
        <Journey />
        <div id="desk">
          <Desk />
        </div>
      </main>
    </div>
  )
}
```

- [ ] **Step 4: Esegui tutta la suite e la build**

Run: `npx vitest run && npm run build`
Expected: tutti PASS, build verde.

- [ ] **Step 5: Commit**

```bash
git add src/App.tsx src/App.test.tsx
git commit -m "feat: viaggio cosmico integrato sopra la scrivania"
```

---

### Task 10: Verifica finale e controllo bundle

- [ ] **Step 1: Suite completa e build**

Run: `npx vitest run && npm run build`
Expected: tutti PASS; build verde.

- [ ] **Step 2: Controlla il code splitting**

Run: `ls -lh dist/assets/ | sort -k5 -h`
Expected: il chunk principale (index-*.js) NON contiene three (deve restare sotto ~300 kB); esiste un chunk separato JourneyCanvas-*.js (grande, con three/R3F/drei) caricato solo in modalità 3D.

- [ ] **Step 3: Verifica visiva col dev server**

Run `npm run dev`, apri il browser e controlla: scrollando si vola tra i pianeti; i testi cambiano per scena; la costellazione avanza; "Salta alla scrivania" porta alla scrivania; le finestre funzionano ancora; il toggle IT/EN cambia anche i testi del viaggio.

- [ ] **Step 4: Commit di eventuali ritocchi e push**

```bash
git status   # se ci sono ritocchi dal passo 3, commit dedicato
git push
```

---

## Note per l'esecutore

- Lavora nella root del repo, branch dedicato `feature/piano-2-viaggio-3d` (crearlo dal `main` aggiornato).
- jsdom non ha WebGL: NON tentare di testare i componenti R3F in unit test; il gate `isWebGLSupported()` fa sì che i test esercitino sempre il fallback statico.
- Le versioni: React 19 richiede @react-three/fiber v9+; npm risolve da solo. Se `@types/three` genera conflitti, three include già i suoi tipi — rimuovilo.
- La grafica è volutamente placeholder (sfere colorate): NON aggiungere texture, shader o asset — arrivano nel Piano 3.
- Ogni task termina con un commit; non accorparli.
