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

- `node scripts/optimize-assets.mjs` rigenera gli asset WebP da `asset-src/` (cartella locale non versionata)

## Struttura

- `src/components/desk/` — la Scrivania (hub contenuti: Progetti, CV, Link, Contatti)
- `src/i18n/` — dizionari IT/EN
- `src/data/` — profilo e progetti
- `src/journey/` — il viaggio 3D (scene, store, canvas R3F, overlay, fallback statico)
- `public/journey/` — asset dipinti generati con Higgsfield (ottimizzati WebP)
- `docs/superpowers/` — spec di design e piani di implementazione
- `e2e/` — smoke test Playwright (`npm run test:e2e`)

## Deploy

Su Vercel (framework preset: Vite). Dominio: https://francoislampasona.it
