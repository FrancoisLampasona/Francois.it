import { act, render } from '@testing-library/react'
import { beforeEach, expect, test } from 'vitest'
import { journeyScenes } from './scenes'
import { useJourneyStore } from './store'
import { SceneLogos } from './SceneLogos'

beforeEach(() => {
  useJourneyStore.setState({ progress: 0 })
})

function getSceneGroup(container: HTMLElement, sceneId: string) {
  return container.querySelector(`[data-scene="${sceneId}"]`) as HTMLElement
}

// progress helper: scene index i out of 7 scenes
function progressFor(index: number) {
  return index / (journeyScenes.length - 1)
}

test('il container della scena attiva ha opacity-100, le altre opacity-0', () => {
  // Set progress to origini (scene index 1)
  act(() => {
    useJourneyStore.getState().setProgress(progressFor(1))
  })
  const { container } = render(<SceneLogos />)

  const originiContainer = getSceneGroup(container, 'origini')
  expect(originiContainer.className).toContain('opacity-100')

  const frontendContainer = getSceneGroup(container, 'frontend')
  expect(frontendContainer.className).toContain('opacity-0')
})

test('ogni logo della scena attiva è renderizzato come img', () => {
  act(() => {
    useJourneyStore.getState().setProgress(progressFor(1)) // origini
  })
  const { container } = render(<SceneLogos />)

  const originiScene = journeyScenes.find((s) => s.id === 'origini')!
  const originiGroup = getSceneGroup(container, 'origini')
  const imgs = originiGroup.querySelectorAll('img')
  expect(imgs).toHaveLength(originiScene.logos!.length)
})

test('cambiando progress la scena attiva diventa un altra', () => {
  const { container } = render(<SceneLogos />)

  // Switch to frontend (index 2)
  act(() => {
    useJourneyStore.getState().setProgress(progressFor(2))
  })

  const frontendContainer = getSceneGroup(container, 'frontend')
  expect(frontendContainer.className).toContain('opacity-100')

  const originiContainer = getSceneGroup(container, 'origini')
  expect(originiContainer.className).toContain('opacity-0')
})
