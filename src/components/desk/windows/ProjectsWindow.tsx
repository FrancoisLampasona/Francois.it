import { useTranslation } from 'react-i18next'
import { projects } from '../../../data/projects'

export function ProjectsWindow() {
  const { t } = useTranslation()
  return (
    <ul className="grid gap-4 sm:grid-cols-2">
      {projects.map((p) => (
        <li key={p.id} className="rounded-lg border border-slate-700 p-4">
          <h3 className="font-semibold">{t(p.titleKey)}</h3>
          <p className="mt-1 text-sm text-slate-300">{t(p.descKey)}</p>
          <ul className="mt-3 flex flex-wrap gap-2">
            {p.tech.map((tech) => (
              <li key={tech} className="rounded bg-slate-800 px-2 py-0.5 text-xs text-slate-300">
                {tech}
              </li>
            ))}
          </ul>
        </li>
      ))}
    </ul>
  )
}
