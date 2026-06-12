import { useTranslation } from 'react-i18next'
import { journeyScenes } from './scenes'
import { sceneIndexForProgress, useJourneyStore } from './store'
import { prefersReducedMotion } from './capabilities'

export function JourneyOverlay() {
  const { t } = useTranslation()
  const index = useJourneyStore((s) => sceneIndexForProgress(s.progress))
  const scene = journeyScenes[index]

  const skipToDesk = () => {
    document.getElementById('desk')?.scrollIntoView({
      behavior: prefersReducedMotion() ? 'auto' : 'smooth',
    })
  }

  return (
    <div className="pointer-events-none absolute inset-0 z-20 flex flex-col items-center justify-end pb-16">
      <div key={scene.id} aria-live="polite" className="max-w-xl px-6 text-center">
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
        <span className="sr-only">{`${index + 1} / ${journeyScenes.length}`}</span>
      </nav>
      <button
        type="button"
        onClick={skipToDesk}
        className="pointer-events-auto mt-6 rounded-full border border-slate-600 px-4 py-1.5 text-sm text-slate-300 hover:bg-white/10 hover:text-white"
      >
        {t('journey.skip')}
      </button>
    </div>
  )
}
