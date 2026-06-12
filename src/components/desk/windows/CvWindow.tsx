import { useTranslation } from 'react-i18next'
import { profile } from '../../../data/profile'

export function CvWindow() {
  const { t } = useTranslation()
  return (
    <div className="flex flex-col gap-4">
      <object
        data={profile.cvUrl}
        type="application/pdf"
        className="h-[50vh] w-full rounded"
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
