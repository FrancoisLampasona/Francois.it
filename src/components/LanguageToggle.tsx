import { useTranslation } from 'react-i18next'

export function LanguageToggle() {
  const { i18n } = useTranslation()
  const next = i18n.language.startsWith('it') ? 'en' : 'it'
  const label = next === 'en' ? 'Switch to English' : "Passa all'italiano"
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
