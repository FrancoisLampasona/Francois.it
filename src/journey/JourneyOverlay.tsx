import { useTranslation } from 'react-i18next'
import { journeyScenes } from './scenes'
import { sceneIndexForProgress, useJourneyStore } from './store'
import { scrollToDesk } from './smoothScroll'

export function JourneyOverlay() {
  const { t } = useTranslation()
  const index = useJourneyStore((s) => sceneIndexForProgress(s.progress))
  const nearEnd = useJourneyStore((s) => s.progress >= 0.95)
  const scene = journeyScenes[index]

  return (
    <div className="pointer-events-none absolute inset-0 z-20 flex flex-col items-center justify-end pb-16">
      <div aria-live="polite" aria-atomic="true" className="max-w-xl px-6 text-center">
        <div key={scene.id}>
          <h2
            className="journey-shadow text-4xl font-bold tracking-tight sm:text-6xl"
            style={{ fontFamily: '"Space Grotesk", sans-serif' }}
          >
            {t(scene.titleKey)}
          </h2>
          <p className="journey-shadow mt-3 text-base text-white sm:text-lg">{t(scene.textKey)}</p>
        </div>
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
        onClick={scrollToDesk}
        tabIndex={nearEnd ? -1 : 0}
        className={`pointer-events-auto mt-6 rounded-full border border-slate-600 px-4 py-1.5 text-sm text-slate-300 hover:bg-white/10 hover:text-white ${nearEnd ? 'invisible' : ''}`}
      >
        {t('journey.skip')}
      </button>
    </div>
  )
}
