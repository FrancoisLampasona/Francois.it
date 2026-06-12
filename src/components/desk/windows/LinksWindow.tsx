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
