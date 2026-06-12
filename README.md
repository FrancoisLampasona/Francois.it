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
