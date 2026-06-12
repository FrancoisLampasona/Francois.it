export type Vec3 = readonly [number, number, number]

export type JourneyScene = {
  readonly id: string
  readonly titleKey: string
  readonly textKey: string
  readonly cameraPos: Vec3
  readonly backdrop: string
  readonly planet?: {
    readonly position: Vec3
    readonly radius: number
    readonly color: string
    readonly texture: string
    readonly ring?: boolean
  }
}

export const JOURNEY_BG = '#020617'

export const journeyScenes: readonly JourneyScene[] = [
  {
    id: 'decollo',
    titleKey: 'journey.decollo.title',
    textKey: 'journey.decollo.text',
    cameraPos: [0, 0, 10],
    backdrop: '/journey/bg-decollo.webp',
  },
  {
    id: 'origini',
    titleKey: 'journey.origini.title',
    textKey: 'journey.origini.text',
    cameraPos: [16, 2, -5],
    backdrop: '/journey/bg-origini.webp',
    planet: {
      position: [14, 0, -16],
      radius: 3,
      color: '#EF9F27',
      texture: '/journey/tex-origini.webp',
    },
  },
  {
    id: 'frontend',
    titleKey: 'journey.frontend.title',
    textKey: 'journey.frontend.text',
    cameraPos: [32, -1, -29],
    backdrop: '/journey/bg-frontend.webp',
    planet: {
      position: [30, -3, -40],
      radius: 2.8,
      color: '#5DCAA5',
      texture: '/journey/tex-frontend.webp',
    },
  },
  {
    id: 'backend',
    titleKey: 'journey.backend.title',
    textKey: 'journey.backend.text',
    cameraPos: [16, -8, -53],
    backdrop: '/journey/bg-backend.webp',
    planet: {
      position: [14, -10, -64],
      radius: 3,
      color: '#378ADD',
      texture: '/journey/tex-backend.webp',
    },
  },
  {
    id: 'maserati',
    titleKey: 'journey.maserati.title',
    textKey: 'journey.maserati.text',
    cameraPos: [-4, -3, -75],
    backdrop: '/journey/bg-maserati.webp',
    planet: {
      position: [-6, -5, -86],
      radius: 3.4,
      color: '#3C3489',
      texture: '/journey/tex-maserati.webp',
    },
  },
  {
    id: 'boop',
    titleKey: 'journey.boop.title',
    textKey: 'journey.boop.text',
    cameraPos: [-24, 5, -97],
    backdrop: '/journey/bg-boop.webp',
    planet: {
      position: [-26, 3, -108],
      radius: 2.6,
      color: '#ED93B1',
      texture: '/journey/tex-boop.webp',
    },
  },
  {
    id: 'finale',
    titleKey: 'journey.finale.title',
    textKey: 'journey.finale.text',
    cameraPos: [-14, 6, -121],
    backdrop: '/journey/bg-finale.webp',
    planet: {
      position: [-16, 4, -132],
      radius: 4.5,
      color: '#D4537E',
      texture: '/journey/tex-finale.webp',
      ring: true,
    },
  },
]
