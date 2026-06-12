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
