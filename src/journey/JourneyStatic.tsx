import { useTranslation } from 'react-i18next'
import { journeyScenes } from './scenes'

export function JourneyStatic() {
  const { t } = useTranslation()
  return (
    <div>
      {journeyScenes.map((scene) => (
        <section
          key={scene.id}
          className="relative flex min-h-screen flex-col items-center justify-center px-6 text-center bg-cover bg-center"
          style={{ backgroundImage: `url(${scene.backdrop})` }}
        >
          <div className="bg-black/40 rounded-xl px-6 py-4 backdrop-blur-[2px]">
            <h2 className="text-3xl font-semibold">{t(scene.titleKey)}</h2>
            <p className="mt-4 max-w-xl text-slate-300">{t(scene.textKey)}</p>
          </div>
        </section>
      ))}
    </div>
  )
}
