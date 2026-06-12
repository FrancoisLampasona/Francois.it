export type Project = {
  id: string
  titleKey: string
  descKey: string
  tech: string[]
  year: number
}

export const projects: Project[] = [
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
    id: 'boopstudio',
    titleKey: 'projects.boop.title',
    descKey: 'projects.boop.desc',
    tech: ['UX/UI', 'Design', 'Hosting'],
    year: 2024,
  },
]
