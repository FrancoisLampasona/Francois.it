import { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Folder } from './Folder'
import { Window } from './Window'
import { ProjectsWindow } from './windows/ProjectsWindow'
import { CvWindow } from './windows/CvWindow'
import { LinksWindow } from './windows/LinksWindow'
import { ContactsWindow } from './windows/ContactsWindow'

const WINDOWS = {
  projects: { icon: '📁', Component: ProjectsWindow },
  cv: { icon: '📄', Component: CvWindow },
  links: { icon: '🔗', Component: LinksWindow },
  contacts: { icon: '✉️', Component: ContactsWindow },
} as const

type WindowId = keyof typeof WINDOWS

export function Desk() {
  const { t } = useTranslation()
  const [open, setOpen] = useState<WindowId | null>(null)
  const active = open ? WINDOWS[open] : null
  const closeWindow = useCallback(() => setOpen(null), [])

  return (
    <section
      aria-label={t('desk.title')}
      className="flex min-h-screen items-center justify-center bg-gradient-to-b from-indigo-950 via-slate-900 to-slate-950"
    >
      <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
        {(Object.keys(WINDOWS) as WindowId[]).map((id) => (
          <Folder
            key={id}
            labelKey={`desk.${id}`}
            icon={WINDOWS[id].icon}
            onOpen={() => setOpen(id)}
          />
        ))}
      </div>
      {active && open && (
        <Window titleKey={`desk.${open}`} onClose={closeWindow}>
          <active.Component />
        </Window>
      )}
    </section>
  )
}
