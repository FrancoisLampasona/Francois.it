import { journeyScenes } from './scenes'
import { sceneIndexForProgress, useJourneyStore } from './store'

export function JourneyBackdrop() {
  const index = useJourneyStore((s) => sceneIndexForProgress(s.progress))
  return (
    <div className="absolute inset-0" aria-hidden="true">
      {journeyScenes.map((scene, i) => (
        <img
          key={scene.id}
          src={scene.backdrop}
          alt=""
          data-testid={`backdrop-${scene.id}`}
          data-backdrop={scene.id}
          loading={i === 0 ? 'eager' : 'lazy'}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ease-out ${
            i === index ? 'opacity-100' : 'opacity-0'
          }`}
        />
      ))}
    </div>
  )
}
