# Piano 1: Fondamenta e Scrivania — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Costruire la base del portfolio (Vite + React + TS, i18n IT/EN, dati dal CV) e la Scrivania interattiva con cartelle Progetti/CV/Link/Contatti — un sito completo e deployabile.

**Architecture:** SPA Vite + React + TypeScript con Tailwind v4. Testi via react-i18next (dizionari JSON IT/EN). La Scrivania è DOM puro: cartelle-bottone che aprono una finestra modale "stile OS" alla volta. I dati (profilo, progetti) vivono in moduli TS tipizzati. Il viaggio 3D arriverà nel Piano 2 sopra questa base.

**Tech Stack:** Vite, React 19, TypeScript, Tailwind CSS v4 (@tailwindcss/vite), react-i18next, Vitest + Testing Library + jsdom.

**Spec di riferimento:** `docs/superpowers/specs/2026-06-12-portfolio-viaggio-cosmico-design.md`

**Piani successivi (non in questo documento):** Piano 2 = viaggio 3D (R3F, scroll, 8 scene); Piano 3 = asset Higgsfield, audio, performance, E2E Playwright, deploy su francoislampasona.it.

---

## Struttura file

```
/  (root del repo)
├── index.html                      — entry HTML, meta SEO
├── package.json / tsconfig.json / vite.config.ts
├── .gitignore
├── public/cv/Francois_Lampasona_CV.pdf
├── src/
│   ├── main.tsx                    — bootstrap React, importa i18n e css
│   ├── App.tsx                     — layout: header (nome + toggle lingua) + Desk
│   ├── index.css                   — import tailwind
│   ├── i18n/
│   │   ├── index.ts                — init i18next, persistenza lingua
│   │   ├── it.json / en.json       — dizionari
│   ├── data/
│   │   ├── profile.ts              — nome, email, link, percorso CV
│   │   └── projects.ts             — progetti tipizzati (chiavi i18n)
│   ├── components/
│   │   ├── LanguageToggle.tsx
│   │   └── desk/
│   │       ├── Desk.tsx            — griglia cartelle + finestra attiva
│   │       ├── Folder.tsx          — bottone cartella accessibile
│   │       ├── Window.tsx          — modale OS-style (Esc, aria)
│   │       └── windows/
│   │           ├── ProjectsWindow.tsx
│   │           ├── CvWindow.tsx
│   │           ├── LinksWindow.tsx
│   │           └── ContactsWindow.tsx
│   └── test/setup.ts               — jest-dom, init i18n, lingua fissa 'it'
└── src/**/*.test.ts(x)             — test accanto al codice
```

---

### Task 1: Scaffold del progetto

**Files:**
- Create: `package.json`, `tsconfig.json`, `vite.config.ts`, `index.html`, `.gitignore`, `src/main.tsx`, `src/App.tsx`, `src/index.css`

- [ ] **Step 1: Crea `.gitignore`**

```gitignore
node_modules
dist
.vercel
*.local
.DS_Store
```

- [ ] **Step 2: Crea `package.json`**

```json
{
  "name": "francoislampasona-portfolio",
  "private": true,
  "version": "0.1.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc --noEmit && vite build",
    "preview": "vite preview",
    "test": "vitest run",
    "test:watch": "vitest"
  }
}
```

- [ ] **Step 3: Installa le dipendenze**

```bash
npm install react react-dom i18next react-i18next
npm install -D typescript vite @vitejs/plugin-react tailwindcss @tailwindcss/vite vitest jsdom @testing-library/react @testing-library/user-event @testing-library/jest-dom @types/react @types/react-dom
```

Expected: entrambe terminano con `added N packages` senza errori.

- [ ] **Step 4: Crea `tsconfig.json`**

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "moduleResolution": "bundler",
    "jsx": "react-jsx",
    "strict": true,
    "skipLibCheck": true,
    "noEmit": true,
    "resolveJsonModule": true,
    "esModuleInterop": true,
    "types": ["vitest/globals", "@testing-library/jest-dom"]
  },
  "include": ["src"]
}
```

- [ ] **Step 5: Crea `vite.config.ts`**

```ts
/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.ts',
  },
})
```

- [ ] **Step 6: Crea `index.html`**

```html
<!doctype html>
<html lang="it">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Francois Lampasona — Full Stack Developer</title>
    <meta name="description" content="Portfolio di Francois Lampasona, Full Stack Developer e DevOps Enthusiast: un viaggio cosmico tra progetti, esperienze e competenze." />
    <meta property="og:title" content="Francois Lampasona — Full Stack Developer" />
    <meta property="og:description" content="Un viaggio cosmico tra progetti, esperienze e competenze." />
    <meta property="og:url" content="https://francoislampasona.it/" />
    <meta property="og:type" content="website" />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

- [ ] **Step 7: Crea `src/index.css`**

```css
@import "tailwindcss";
```

- [ ] **Step 8: Crea `src/App.tsx` (versione minima)**

```tsx
export default function App() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 text-slate-100">
      <h1 className="text-3xl font-semibold">Francois Lampasona</h1>
    </main>
  )
}
```

- [ ] **Step 9: Crea `src/main.tsx`**

```tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
```

(Nota: l'import di `./i18n` verrà aggiunto nel Task 3.)

- [ ] **Step 10: Verifica che la build passi**

Run: `npm run build`
Expected: `tsc` senza errori, poi `vite build` termina con `✓ built in …` e crea `dist/`.

- [ ] **Step 11: Commit**

```bash
git add .gitignore package.json package-lock.json tsconfig.json vite.config.ts index.html src/
git commit -m "feat: scaffold Vite + React + TS + Tailwind"
```

---

### Task 2: Setup Vitest e primo test

**Files:**
- Create: `src/test/setup.ts`, `src/App.test.tsx`

- [ ] **Step 1: Crea `src/test/setup.ts` (versione minima)**

```ts
import '@testing-library/jest-dom/vitest'
```

- [ ] **Step 2: Scrivi il test su App**

`src/App.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import App from './App'

test('mostra il nome di Francois', () => {
  render(<App />)
  expect(screen.getByRole('heading', { name: /francois lampasona/i })).toBeInTheDocument()
})
```

- [ ] **Step 3: Esegui il test e verifica che passi**

Run: `npx vitest run src/App.test.tsx`
Expected: `1 passed`.

- [ ] **Step 4: Commit**

```bash
git add src/test/setup.ts src/App.test.tsx
git commit -m "test: setup Vitest + smoke test su App"
```

---

### Task 3: i18n — dizionari IT/EN e inizializzazione

**Files:**
- Create: `src/i18n/it.json`, `src/i18n/en.json`, `src/i18n/index.ts`, `src/i18n/i18n.test.ts`
- Modify: `src/main.tsx`, `src/test/setup.ts`

- [ ] **Step 1: Crea `src/i18n/it.json`**

```json
{
  "common": { "close": "Chiudi" },
  "hero": { "role": "Full Stack Developer | DevOps Enthusiast" },
  "desk": {
    "title": "La mia scrivania",
    "projects": "Progetti",
    "cv": "CV",
    "links": "Link",
    "contacts": "Contatti"
  },
  "cv": {
    "download": "Scarica il CV (PDF)",
    "noPreview": "Anteprima non disponibile: scarica il PDF qui sotto."
  },
  "links": {
    "linkedin": "Profilo LinkedIn",
    "github": "Profilo GitHub"
  },
  "contacts": {
    "intro": "Hai un progetto in mente o una proposta? Scrivimi.",
    "email": "Scrivimi una email"
  },
  "projects": {
    "gym": {
      "title": "App gestionale palestra",
      "desc": "App mobile in Flutter per la gestione di allenamenti e trasporti, con backend e API REST integrate."
    },
    "ecommerce": {
      "title": "E-commerce su misura",
      "desc": "Negozi online con WooCommerce, Shopify e soluzioni enterprise Magento, ottimizzati per velocità e conversione."
    },
    "vetrina": {
      "title": "Siti web vetrina",
      "desc": "Siti vetrina personalizzati per attività e professionisti, curati dall'idea alla consegna."
    },
    "boop": {
      "title": "BoopStudio",
      "desc": "La mia startup per lo sviluppo completo di siti web: UX/UI, programmazione e distribuzione su hosting."
    }
  }
}
```

- [ ] **Step 2: Crea `src/i18n/en.json`**

```json
{
  "common": { "close": "Close" },
  "hero": { "role": "Full Stack Developer | DevOps Enthusiast" },
  "desk": {
    "title": "My desk",
    "projects": "Projects",
    "cv": "Resume",
    "links": "Links",
    "contacts": "Contact"
  },
  "cv": {
    "download": "Download resume (PDF)",
    "noPreview": "Preview not available: download the PDF below."
  },
  "links": {
    "linkedin": "LinkedIn profile",
    "github": "GitHub profile"
  },
  "contacts": {
    "intro": "Got a project in mind or an offer? Drop me a line.",
    "email": "Email me"
  },
  "projects": {
    "gym": {
      "title": "Gym management app",
      "desc": "Flutter mobile app for managing workouts and transport, with integrated backend and REST APIs."
    },
    "ecommerce": {
      "title": "Tailor-made e-commerce",
      "desc": "Online stores built with WooCommerce, Shopify and enterprise Magento, optimized for speed and conversion."
    },
    "vetrina": {
      "title": "Showcase websites",
      "desc": "Custom showcase websites for businesses and professionals, crafted from idea to delivery."
    },
    "boop": {
      "title": "BoopStudio",
      "desc": "My startup for end-to-end website development: UX/UI, coding and hosting deployment."
    }
  }
}
```

- [ ] **Step 3: Scrivi il test (fallirà: modulo inesistente)**

`src/i18n/i18n.test.ts`:

```ts
import i18n from './index'

test('traduce in italiano di default nei test', () => {
  expect(i18n.t('desk.projects')).toBe('Progetti')
})

test('cambia lingua in inglese', async () => {
  await i18n.changeLanguage('en')
  expect(i18n.t('desk.projects')).toBe('Projects')
})

test('persiste la lingua scelta in localStorage', async () => {
  await i18n.changeLanguage('en')
  expect(localStorage.getItem('lang')).toBe('en')
})
```

- [ ] **Step 4: Esegui il test e verifica che fallisca**

Run: `npx vitest run src/i18n/i18n.test.ts`
Expected: FAIL — `Cannot find module './index'` (o equivalente).

- [ ] **Step 5: Crea `src/i18n/index.ts`**

```ts
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import it from './it.json'
import en from './en.json'

function initialLanguage(): string {
  const saved = localStorage.getItem('lang')
  if (saved === 'it' || saved === 'en') return saved
  return navigator.language.toLowerCase().startsWith('it') ? 'it' : 'en'
}

i18n.use(initReactI18next).init({
  resources: {
    it: { translation: it },
    en: { translation: en },
  },
  lng: initialLanguage(),
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
})

i18n.on('languageChanged', (lng) => {
  localStorage.setItem('lang', lng)
})

export default i18n
```

- [ ] **Step 6: Aggiorna `src/test/setup.ts` per lingua deterministica**

```ts
import '@testing-library/jest-dom/vitest'
import { beforeEach } from 'vitest'
import i18n from '../i18n'

beforeEach(async () => {
  localStorage.clear()
  await i18n.changeLanguage('it')
})
```

- [ ] **Step 7: Aggiorna `src/main.tsx` (aggiungi l'import i18n)**

```tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './i18n'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
```

- [ ] **Step 8: Esegui i test e verifica che passino**

Run: `npx vitest run`
Expected: tutti PASS (App + i18n).

- [ ] **Step 9: Commit**

```bash
git add src/i18n/ src/test/setup.ts src/main.tsx
git commit -m "feat: i18n IT/EN con persistenza lingua"
```

---

### Task 4: LanguageToggle

**Files:**
- Create: `src/components/LanguageToggle.tsx`, `src/components/LanguageToggle.test.tsx`

- [ ] **Step 1: Scrivi il test (fallirà)**

`src/components/LanguageToggle.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import i18n from '../i18n'
import { LanguageToggle } from './LanguageToggle'

test('mostra EN quando la lingua è italiano e cambia lingua al click', async () => {
  render(<LanguageToggle />)
  const button = screen.getByRole('button', { name: /english/i })
  expect(button).toHaveTextContent('EN')
  await userEvent.click(button)
  expect(i18n.language).toBe('en')
  expect(localStorage.getItem('lang')).toBe('en')
  expect(screen.getByRole('button', { name: /italiano/i })).toHaveTextContent('IT')
})
```

- [ ] **Step 2: Esegui il test e verifica che fallisca**

Run: `npx vitest run src/components/LanguageToggle.test.tsx`
Expected: FAIL — `Cannot find module './LanguageToggle'`.

- [ ] **Step 3: Crea `src/components/LanguageToggle.tsx`**

```tsx
import { useTranslation } from 'react-i18next'

export function LanguageToggle() {
  const { i18n } = useTranslation()
  const next = i18n.language.startsWith('it') ? 'en' : 'it'
  const label = next === 'en' ? 'Switch to English' : 'Passa all’italiano'
  return (
    <button
      onClick={() => i18n.changeLanguage(next)}
      aria-label={label}
      className="rounded border border-slate-600 px-3 py-1 text-sm font-medium uppercase hover:bg-white/10"
    >
      {next.toUpperCase()}
    </button>
  )
}
```

- [ ] **Step 4: Esegui il test e verifica che passi**

Run: `npx vitest run src/components/LanguageToggle.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/LanguageToggle.tsx src/components/LanguageToggle.test.tsx
git commit -m "feat: toggle lingua IT/EN"
```

---

### Task 5: Dati (profilo, progetti) e PDF del CV

**Files:**
- Create: `src/data/profile.ts`, `src/data/projects.ts`, `src/data/projects.test.ts`, `public/cv/Francois_Lampasona_CV.pdf`

- [ ] **Step 1: Copia il CV in `public/`**

```bash
mkdir -p public/cv
cp Francois_CV_Due_Pagine.pdf public/cv/Francois_Lampasona_CV.pdf
```

- [ ] **Step 2: Crea `src/data/profile.ts`**

```ts
export const profile = {
  name: 'Francois Lampasona',
  email: 'lampasonafrancois@gmail.com',
  linkedin: 'https://www.linkedin.com/in/francoislampasona',
  github: 'https://github.com/francoislampasona',
  cvUrl: '/cv/Francois_Lampasona_CV.pdf',
} as const
```

- [ ] **Step 3: Scrivi il test sui progetti (fallirà)**

`src/data/projects.test.ts`:

```ts
import i18n from '../i18n'
import { projects } from './projects'

test('ogni progetto ha id univoco', () => {
  const ids = projects.map((p) => p.id)
  expect(new Set(ids).size).toBe(ids.length)
})

test('ogni chiave i18n dei progetti esiste in entrambe le lingue', () => {
  for (const p of projects) {
    for (const lng of ['it', 'en'] as const) {
      expect(i18n.exists(p.titleKey, { lng }), `${p.titleKey} (${lng})`).toBe(true)
      expect(i18n.exists(p.descKey, { lng }), `${p.descKey} (${lng})`).toBe(true)
    }
  }
})
```

- [ ] **Step 4: Esegui il test e verifica che fallisca**

Run: `npx vitest run src/data/projects.test.ts`
Expected: FAIL — `Cannot find module './projects'`.

- [ ] **Step 5: Crea `src/data/projects.ts`**

```ts
export type Project = {
  id: string
  titleKey: string
  descKey: string
  tech: string[]
  year: number
}

export const projects: Project[] = [
  {
    id: 'gym-app',
    titleKey: 'projects.gym.title',
    descKey: 'projects.gym.desc',
    tech: ['Flutter', 'Firebase', 'REST API'],
    year: 2024,
  },
  {
    id: 'ecommerce',
    titleKey: 'projects.ecommerce.title',
    descKey: 'projects.ecommerce.desc',
    tech: ['WooCommerce', 'Shopify', 'Magento'],
    year: 2023,
  },
  {
    id: 'vetrina',
    titleKey: 'projects.vetrina.title',
    descKey: 'projects.vetrina.desc',
    tech: ['React', 'WordPress', 'Tailwind'],
    year: 2023,
  },
  {
    id: 'boopstudio',
    titleKey: 'projects.boop.title',
    descKey: 'projects.boop.desc',
    tech: ['UX/UI', 'Design', 'Hosting'],
    year: 2024,
  },
]
```

- [ ] **Step 6: Esegui il test e verifica che passi**

Run: `npx vitest run src/data/projects.test.ts`
Expected: PASS (2 test).

- [ ] **Step 7: Commit**

```bash
git add public/cv/ src/data/
git commit -m "feat: dati profilo e progetti + PDF CV"
```

---

### Task 6: Componente Window (modale OS-style)

**Files:**
- Create: `src/components/desk/Window.tsx`, `src/components/desk/Window.test.tsx`

- [ ] **Step 1: Scrivi il test (fallirà)**

`src/components/desk/Window.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import { Window } from './Window'

test('mostra titolo tradotto e contenuto', () => {
  render(
    <Window titleKey="desk.projects" onClose={() => {}}>
      <p>contenuto finestra</p>
    </Window>,
  )
  expect(screen.getByRole('dialog', { name: 'Progetti' })).toBeInTheDocument()
  expect(screen.getByText('contenuto finestra')).toBeInTheDocument()
})

test('chiude con il bottone di chiusura', async () => {
  const onClose = vi.fn()
  render(
    <Window titleKey="desk.projects" onClose={onClose}>
      <p>x</p>
    </Window>,
  )
  await userEvent.click(screen.getByRole('button', { name: 'Chiudi' }))
  expect(onClose).toHaveBeenCalledTimes(1)
})

test('chiude con il tasto Escape', async () => {
  const onClose = vi.fn()
  render(
    <Window titleKey="desk.projects" onClose={onClose}>
      <p>x</p>
    </Window>,
  )
  await userEvent.keyboard('{Escape}')
  expect(onClose).toHaveBeenCalledTimes(1)
})
```

- [ ] **Step 2: Esegui il test e verifica che fallisca**

Run: `npx vitest run src/components/desk/Window.test.tsx`
Expected: FAIL — `Cannot find module './Window'`.

- [ ] **Step 3: Crea `src/components/desk/Window.tsx`**

```tsx
import { useEffect, useRef, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'

type WindowProps = {
  titleKey: string
  onClose: () => void
  children: ReactNode
}

export function Window({ titleKey, onClose, children }: WindowProps) {
  const { t } = useTranslation()
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    panelRef.current?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      onClick={onClose}
    >
      <div
        ref={panelRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-label={t(titleKey)}
        className="w-full max-w-2xl rounded-xl border border-slate-700 bg-slate-900 text-slate-100 shadow-2xl outline-none"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-slate-700 px-4 py-2">
          <div className="flex gap-1.5" aria-hidden="true">
            <span className="h-3 w-3 rounded-full bg-red-500" />
            <span className="h-3 w-3 rounded-full bg-yellow-500" />
            <span className="h-3 w-3 rounded-full bg-green-500" />
          </div>
          <h2 className="text-sm font-medium">{t(titleKey)}</h2>
          <button
            onClick={onClose}
            aria-label={t('common.close')}
            className="rounded px-2 py-0.5 text-slate-400 hover:bg-white/10 hover:text-white"
          >
            ✕
          </button>
        </div>
        <div className="max-h-[70vh] overflow-y-auto p-6">{children}</div>
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Esegui il test e verifica che passi**

Run: `npx vitest run src/components/desk/Window.test.tsx`
Expected: PASS (3 test).

- [ ] **Step 5: Commit**

```bash
git add src/components/desk/Window.tsx src/components/desk/Window.test.tsx
git commit -m "feat: finestra modale OS-style accessibile"
```

---

### Task 7: Finestre di contenuto (Progetti, CV, Link, Contatti)

**Files:**
- Create: `src/components/desk/windows/ProjectsWindow.tsx`, `CvWindow.tsx`, `LinksWindow.tsx`, `ContactsWindow.tsx`, `windows.test.tsx` (stessa cartella)

- [ ] **Step 1: Scrivi i test (falliranno)**

`src/components/desk/windows/windows.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import { projects } from '../../../data/projects'
import { profile } from '../../../data/profile'
import { ProjectsWindow } from './ProjectsWindow'
import { CvWindow } from './CvWindow'
import { LinksWindow } from './LinksWindow'
import { ContactsWindow } from './ContactsWindow'

test('ProjectsWindow elenca tutti i progetti', () => {
  render(<ProjectsWindow />)
  expect(screen.getByText('App gestionale palestra')).toBeInTheDocument()
  expect(screen.getAllByRole('listitem').length).toBeGreaterThanOrEqual(projects.length)
})

test('CvWindow ha il link di download del PDF', () => {
  render(<CvWindow />)
  const link = screen.getByRole('link', { name: 'Scarica il CV (PDF)' })
  expect(link).toHaveAttribute('href', profile.cvUrl)
  expect(link).toHaveAttribute('download')
})

test('LinksWindow punta a LinkedIn e GitHub', () => {
  render(<LinksWindow />)
  expect(screen.getByRole('link', { name: 'Profilo LinkedIn' })).toHaveAttribute('href', profile.linkedin)
  expect(screen.getByRole('link', { name: 'Profilo GitHub' })).toHaveAttribute('href', profile.github)
})

test('ContactsWindow ha il mailto', () => {
  render(<ContactsWindow />)
  expect(screen.getByRole('link', { name: 'Scrivimi una email' })).toHaveAttribute(
    'href',
    `mailto:${profile.email}`,
  )
})
```

- [ ] **Step 2: Esegui i test e verifica che falliscano**

Run: `npx vitest run src/components/desk/windows/windows.test.tsx`
Expected: FAIL — moduli inesistenti.

- [ ] **Step 3: Crea `src/components/desk/windows/ProjectsWindow.tsx`**

```tsx
import { useTranslation } from 'react-i18next'
import { projects } from '../../../data/projects'

export function ProjectsWindow() {
  const { t } = useTranslation()
  return (
    <ul className="grid gap-4 sm:grid-cols-2">
      {projects.map((p) => (
        <li key={p.id} className="rounded-lg border border-slate-700 p-4">
          <h3 className="font-semibold">{t(p.titleKey)}</h3>
          <p className="mt-1 text-sm text-slate-300">{t(p.descKey)}</p>
          <ul className="mt-3 flex flex-wrap gap-2">
            {p.tech.map((tech) => (
              <li key={tech} className="rounded bg-slate-800 px-2 py-0.5 text-xs text-slate-300">
                {tech}
              </li>
            ))}
          </ul>
        </li>
      ))}
    </ul>
  )
}
```

- [ ] **Step 4: Crea `src/components/desk/windows/CvWindow.tsx`**

```tsx
import { useTranslation } from 'react-i18next'
import { profile } from '../../../data/profile'

export function CvWindow() {
  const { t } = useTranslation()
  return (
    <div className="flex flex-col gap-4">
      <object
        data={profile.cvUrl}
        type="application/pdf"
        className="h-96 w-full rounded"
        aria-label={t('desk.cv')}
      >
        <p className="text-sm text-slate-300">{t('cv.noPreview')}</p>
      </object>
      <a
        href={profile.cvUrl}
        download
        className="self-center rounded-lg bg-indigo-600 px-6 py-2 font-medium text-white hover:bg-indigo-500"
      >
        {t('cv.download')}
      </a>
    </div>
  )
}
```

- [ ] **Step 5: Crea `src/components/desk/windows/LinksWindow.tsx`**

```tsx
import { useTranslation } from 'react-i18next'
import { profile } from '../../../data/profile'

export function LinksWindow() {
  const { t } = useTranslation()
  const linkClass =
    'block rounded-lg border border-slate-700 px-4 py-3 hover:bg-white/5 hover:border-slate-500'
  return (
    <ul className="flex flex-col gap-3">
      <li>
        <a className={linkClass} href={profile.linkedin} target="_blank" rel="noreferrer">
          {t('links.linkedin')}
        </a>
      </li>
      <li>
        <a className={linkClass} href={profile.github} target="_blank" rel="noreferrer">
          {t('links.github')}
        </a>
      </li>
    </ul>
  )
}
```

- [ ] **Step 6: Crea `src/components/desk/windows/ContactsWindow.tsx`**

```tsx
import { useTranslation } from 'react-i18next'
import { profile } from '../../../data/profile'

export function ContactsWindow() {
  const { t } = useTranslation()
  return (
    <div className="flex flex-col items-center gap-4 py-4 text-center">
      <p>{t('contacts.intro')}</p>
      <a
        href={`mailto:${profile.email}`}
        className="rounded-lg bg-indigo-600 px-6 py-2 font-medium text-white hover:bg-indigo-500"
      >
        {t('contacts.email')}
      </a>
      <p className="text-sm text-slate-400">{profile.email}</p>
    </div>
  )
}
```

- [ ] **Step 7: Esegui i test e verifica che passino**

Run: `npx vitest run src/components/desk/windows/windows.test.tsx`
Expected: PASS (4 test).

- [ ] **Step 8: Commit**

```bash
git add src/components/desk/windows/
git commit -m "feat: finestre Progetti, CV, Link e Contatti"
```

---

### Task 8: Folder e Desk

**Files:**
- Create: `src/components/desk/Folder.tsx`, `src/components/desk/Desk.tsx`, `src/components/desk/Desk.test.tsx`

- [ ] **Step 1: Scrivi i test (falliranno)**

`src/components/desk/Desk.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Desk } from './Desk'

test('mostra le quattro cartelle', () => {
  render(<Desk />)
  for (const name of ['Progetti', 'CV', 'Link', 'Contatti']) {
    expect(screen.getByRole('button', { name })).toBeInTheDocument()
  }
})

test('apre e chiude la finestra Progetti', async () => {
  render(<Desk />)
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  await userEvent.click(screen.getByRole('button', { name: 'Progetti' }))
  expect(screen.getByRole('dialog', { name: 'Progetti' })).toBeInTheDocument()
  expect(screen.getByText('App gestionale palestra')).toBeInTheDocument()
  await userEvent.click(screen.getByRole('button', { name: 'Chiudi' }))
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
})

test('apre una sola finestra alla volta', async () => {
  render(<Desk />)
  await userEvent.click(screen.getByRole('button', { name: 'Contatti' }))
  expect(screen.getAllByRole('dialog')).toHaveLength(1)
  expect(screen.getByRole('dialog', { name: 'Contatti' })).toBeInTheDocument()
})
```

- [ ] **Step 2: Esegui i test e verifica che falliscano**

Run: `npx vitest run src/components/desk/Desk.test.tsx`
Expected: FAIL — `Cannot find module './Desk'`.

- [ ] **Step 3: Crea `src/components/desk/Folder.tsx`**

```tsx
import { useTranslation } from 'react-i18next'

type FolderProps = {
  labelKey: string
  icon: string
  onOpen: () => void
}

export function Folder({ labelKey, icon, onOpen }: FolderProps) {
  const { t } = useTranslation()
  return (
    <button
      onClick={onOpen}
      className="flex flex-col items-center gap-2 rounded-lg p-4 hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-indigo-400"
    >
      <span className="text-5xl" aria-hidden="true">
        {icon}
      </span>
      <span className="text-sm">{t(labelKey)}</span>
    </button>
  )
}
```

(Le icone emoji sono placeholder: verranno sostituite dalle icone dipinte nel Piano 3.)

- [ ] **Step 4: Crea `src/components/desk/Desk.tsx`**

```tsx
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Folder } from './Folder'
import { Window } from './Window'
import { ProjectsWindow } from './windows/ProjectsWindow'
import { CvWindow } from './windows/CvWindow'
import { LinksWindow } from './windows/LinksWindow'
import { ContactsWindow } from './windows/ContactsWindow'

const WINDOWS = {
  projects: { icon: '📁', Component: ProjectsWindow },
  cv: { icon: '📄', Component: CvWindow },
  links: { icon: '🔗', Component: LinksWindow },
  contacts: { icon: '✉️', Component: ContactsWindow },
} as const

type WindowId = keyof typeof WINDOWS

export function Desk() {
  const { t } = useTranslation()
  const [open, setOpen] = useState<WindowId | null>(null)
  const active = open ? WINDOWS[open] : null

  return (
    <section
      aria-label={t('desk.title')}
      className="flex min-h-screen items-center justify-center bg-gradient-to-b from-indigo-950 via-slate-900 to-slate-950"
    >
      <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
        {(Object.keys(WINDOWS) as WindowId[]).map((id) => (
          <Folder
            key={id}
            labelKey={`desk.${id}`}
            icon={WINDOWS[id].icon}
            onOpen={() => setOpen(id)}
          />
        ))}
      </div>
      {active && open && (
        <Window titleKey={`desk.${open}`} onClose={() => setOpen(null)}>
          <active.Component />
        </Window>
      )}
    </section>
  )
}
```

(Lo sfondo gradiente è placeholder: nel Piano 3 diventerà l'immagine dipinta della scrivania.)

- [ ] **Step 5: Esegui i test e verifica che passino**

Run: `npx vitest run src/components/desk/Desk.test.tsx`
Expected: PASS (3 test).

- [ ] **Step 6: Commit**

```bash
git add src/components/desk/Folder.tsx src/components/desk/Desk.tsx src/components/desk/Desk.test.tsx
git commit -m "feat: scrivania con cartelle e gestione finestre"
```

---

### Task 9: Integrazione App (header + Desk)

**Files:**
- Modify: `src/App.tsx`, `src/App.test.tsx`

- [ ] **Step 1: Aggiorna il test di App (fallirà)**

`src/App.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import App from './App'

test('mostra nome, ruolo e toggle lingua', () => {
  render(<App />)
  expect(screen.getByText('Francois Lampasona')).toBeInTheDocument()
  expect(screen.getByText('Full Stack Developer | DevOps Enthusiast')).toBeInTheDocument()
  expect(screen.getByRole('button', { name: /english/i })).toBeInTheDocument()
})

test('mostra la scrivania con le cartelle', () => {
  render(<App />)
  expect(screen.getByRole('button', { name: 'Progetti' })).toBeInTheDocument()
})
```

- [ ] **Step 2: Esegui il test e verifica che fallisca**

Run: `npx vitest run src/App.test.tsx`
Expected: FAIL — il ruolo e le cartelle non esistono ancora in App.

- [ ] **Step 3: Aggiorna `src/App.tsx`**

```tsx
import { useTranslation } from 'react-i18next'
import { Desk } from './components/desk/Desk'
import { LanguageToggle } from './components/LanguageToggle'
import { profile } from './data/profile'

export default function App() {
  const { t } = useTranslation()
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="fixed top-0 z-40 flex w-full items-center justify-between px-6 py-4">
        <div>
          <p className="font-semibold">{profile.name}</p>
          <p className="text-xs text-slate-400">{t('hero.role')}</p>
        </div>
        <LanguageToggle />
      </header>
      <main>
        <Desk />
      </main>
    </div>
  )
}
```

- [ ] **Step 4: Esegui tutti i test e verifica che passino**

Run: `npx vitest run`
Expected: tutti PASS.

- [ ] **Step 5: Commit**

```bash
git add src/App.tsx src/App.test.tsx
git commit -m "feat: integra header e scrivania in App"
```

---

### Task 10: README, build finale e verifica completa

**Files:**
- Create: `README.md`

- [ ] **Step 1: Crea `README.md`**

````markdown
# francoislampasona.it — Portfolio "Viaggio Cosmico"

Portfolio personale di Francois Lampasona: un viaggio cosmico in 3D che si conclude
su una scrivania interattiva con progetti, CV e contatti.

## Sviluppo

```bash
npm install
npm run dev        # server di sviluppo
npm test           # unit test (Vitest)
npm run build      # type-check + build di produzione
npm run preview    # anteprima della build
```

## Struttura

- `src/components/desk/` — la Scrivania (hub contenuti: Progetti, CV, Link, Contatti)
- `src/i18n/` — dizionari IT/EN
- `src/data/` — profilo e progetti
- `docs/superpowers/` — spec di design e piani di implementazione

## Deploy

Su Vercel (framework preset: Vite). Dominio: https://francoislampasona.it
````

- [ ] **Step 2: Verifica completa**

Run: `npm run build && npm test`
Expected: build ok (`✓ built in …`), tutti i test PASS.

- [ ] **Step 3: Avvia il dev server e verifica a occhio**

Run: `npm run dev`
Verifica nel browser (http://localhost:5173): header con nome e toggle, 4 cartelle, finestre che si aprono/chiudono, toggle IT/EN che cambia i testi, download CV funzionante.

- [ ] **Step 4: Commit finale**

```bash
git add README.md
git commit -m "docs: README con istruzioni di sviluppo e deploy"
```

---

## Note per l'esecutore

- Lavora nella root del repo (`/Users/francoislampasona/Desktop/SitoWebPortofolio`).
- Il file `Francois_CV_Due_Pagine.pdf` nella root è la fonte del CV: NON eliminarlo, viene copiato in `public/cv/` nel Task 5.
- Se `npm install` propone versioni major diverse da quelle citate, accetta le ultime stabili: il codice non usa API deprecate.
- Ogni task termina con un commit: non accorparli.
