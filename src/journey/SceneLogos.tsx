import { journeyScenes } from './scenes'
import { sceneIndexForProgress, useJourneyStore } from './store'

export function SceneLogos() {
  const active = useJourneyStore((s) => sceneIndexForProgress(s.progress))

  return (
    <>
      {journeyScenes.map((scene, sceneIdx) => {
        if (!scene.logos || scene.logos.length === 0) return null
        const isActive = active === sceneIdx

        const leftLogos = scene.logos.filter((_, i) => i % 2 === 0)
        const rightLogos = scene.logos.filter((_, i) => i % 2 === 1)

        return (
          <div
            key={scene.id}
            data-scene={scene.id}
            aria-hidden="true"
            className={`pointer-events-none absolute inset-0 transition-opacity duration-700 ${
              isActive ? 'opacity-100' : 'opacity-0'
            }`}
          >
            {/* Left column — even-index logos */}
            <div className="absolute left-6 top-1/2 flex -translate-y-1/2 flex-col gap-5 sm:left-12">
              {leftLogos.map((src, i) => {
                const globalIndex = i * 2
                return (
                  <div
                    key={src}
                    className="flex h-16 w-16 items-center justify-center rounded-2xl border border-white/15 bg-white/10 p-3 shadow-lg backdrop-blur-md"
                    style={{
                      animation: `logoFloat ${3 + globalIndex * 0.4}s ease-in-out ${globalIndex * 0.3}s infinite`,
                    }}
                  >
                    <img src={src} alt="" className="h-full w-full object-contain" loading="lazy" />
                  </div>
                )
              })}
            </div>

            {/* Right column — odd-index logos */}
            <div className="absolute right-6 top-1/2 flex -translate-y-1/2 flex-col gap-5 sm:right-12">
              {rightLogos.map((src, i) => {
                const globalIndex = i * 2 + 1
                return (
                  <div
                    key={src}
                    className="flex h-16 w-16 items-center justify-center rounded-2xl border border-white/15 bg-white/10 p-3 shadow-lg backdrop-blur-md"
                    style={{
                      animation: `logoFloat ${3 + globalIndex * 0.4}s ease-in-out ${globalIndex * 0.3}s infinite`,
                    }}
                  >
                    <img src={src} alt="" className="h-full w-full object-contain" loading="lazy" />
                  </div>
                )
              })}
            </div>
          </div>
        )
      })}
    </>
  )
}
