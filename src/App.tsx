import { useTranslation } from 'react-i18next'
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
        <Desk />
      </main>
    </div>
  )
}
