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
      className="relative min-h-screen bg-cover bg-center"
      style={{ backgroundImage: 'url(/journey/scrivania.webp)' }}
    >
      {/* Desktop icons — top-right, macOS style */}
      <div className="absolute right-8 top-24 grid grid-cols-2 gap-6">
        {(Object.keys(WINDOWS) as WindowId[]).map((id) => (
          <Folder
            key={id}
            labelKey={`desk.${id}`}
            icon={WINDOWS[id].icon}
            onOpen={() => setOpen(id)}
          />
        ))}
      </div>

      {/* macOS dock — bottom center */}
      <nav
        aria-label="Dock"
        className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 rounded-2xl border border-white/20 bg-white/10 px-4 py-2 backdrop-blur-xl shadow-2xl"
      >
        {(Object.keys(WINDOWS) as WindowId[]).map((id) => (
          <button
            key={id}
            aria-haspopup="dialog"
            onClick={() => setOpen(id)}
            className="flex flex-col items-center transition-transform hover:scale-125 focus-visible:outline focus-visible:outline-2 focus-visible:outline-indigo-400"
          >
            <span className="text-3xl" aria-hidden="true">{WINDOWS[id].icon}</span>
            <span className="sr-only">{t(`desk.${id}`)}</span>
          </button>
        ))}
      </nav>

      {active && open && (
        <Window titleKey={`desk.${open}`} onClose={closeWindow}>
          <active.Component />
        </Window>
      )}
    </section>
  )
}
