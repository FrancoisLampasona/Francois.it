import { useTranslation } from 'react-i18next'
import { journeyScenes } from './scenes'

export function JourneyStatic() {
  const { t } = useTranslation()
  return (
    <div>
      {journeyScenes.map((scene) => (
        <section
          key={scene.id}
          className="flex min-h-screen flex-col items-center justify-center px-6 text-center"
          style={
            scene.planet
              ? { background: `radial-gradient(ellipse at bottom, ${scene.planet.color}22, #020617 70%)` }
              : { background: '#020617' }
          }
        >
          <h2 className="text-3xl font-semibold">{t(scene.titleKey)}</h2>
          <p className="mt-4 max-w-xl text-slate-300">{t(scene.textKey)}</p>
        </section>
      ))}
    </div>
  )
}
