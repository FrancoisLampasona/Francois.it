export type Project = {
  readonly id: string
  readonly titleKey: string
  readonly descKey: string
  readonly tech: readonly string[]
  readonly year: number
}

export const projects: readonly Project[] = [
  {
    id: 'gym-app',
    titleKey: 'projects.gym.title',
    descKey: 'projects.gym.desc',
    tech: ['Flutter', 'Firebase', 'REST API'],
    year: 2024,
  },
  {
    id: 'ecommerce',
    titleKey: 'projects.ecommerce.title',
    descKey: 'projects.ecommerce.desc',
    tech: ['WooCommerce', 'Shopify', 'Magento'],
    year: 2023,
  },
  {
    id: 'vetrina',
    titleKey: 'projects.vetrina.title',
    descKey: 'projects.vetrina.desc',
    tech: ['React', 'WordPress', 'Tailwind'],
    year: 2023,
  },
  {
    id: 'boop',
    titleKey: 'projects.boop.title',
    descKey: 'projects.boop.desc',
    tech: ['UX/UI', 'Design', 'Hosting'],
    year: 2024,
  },
]
