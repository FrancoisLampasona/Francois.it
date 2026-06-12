export type Vec3 = readonly [number, number, number]

export type JourneyScene = {
  readonly id: string
  readonly titleKey: string
  readonly textKey: string
  readonly cameraPos: Vec3
  readonly planet?: {
    readonly position: Vec3
    readonly radius: number
    readonly color: string
  }
}

export const journeyScenes: readonly JourneyScene[] = [
  {
    id: 'decollo',
    titleKey: 'journey.decollo.title',
    textKey: 'journey.decollo.text',
    cameraPos: [0, 0, 10],
  },
  {
    id: 'origini',
    titleKey: 'journey.origini.title',
    textKey: 'journey.origini.text',
    cameraPos: [12, 2, -6],
    planet: { position: [12, 0, -14], radius: 3, color: '#EF9F27' },
  },
  {
    id: 'frontend',
    titleKey: 'journey.frontend.title',
    textKey: 'journey.frontend.text',
    cameraPos: [24, -2, -22],
    planet: { position: [24, -4, -30], radius: 2.5, color: '#5DCAA5' },
  },
  {
    id: 'backend',
    titleKey: 'journey.backend.title',
    textKey: 'journey.backend.text',
    cameraPos: [12, -6, -38],
    planet: { position: [10, -8, -46], radius: 2.8, color: '#378ADD' },
  },
  {
    id: 'maserati',
    titleKey: 'journey.maserati.title',
    textKey: 'journey.maserati.text',
    cameraPos: [-2, -2, -52],
    planet: { position: [-4, -4, -60], radius: 3.2, color: '#3C3489' },
  },
  {
    id: 'boop',
    titleKey: 'journey.boop.title',
    textKey: 'journey.boop.text',
    cameraPos: [-14, 2, -66],
    planet: { position: [-16, 0, -74], radius: 2.4, color: '#ED93B1' },
  },
  {
    id: 'finale',
    titleKey: 'journey.finale.title',
    textKey: 'journey.finale.text',
    cameraPos: [-10, 6, -82],
    planet: { position: [-10, 2, -92], radius: 4, color: '#D4537E' },
  },
]
