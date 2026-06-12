import { forwardRef } from 'react'
import { useTranslation } from 'react-i18next'

type FolderProps = {
  labelKey: string
  icon: string
  onOpen: () => void
}

export const Folder = forwardRef<HTMLButtonElement, FolderProps>(
  function Folder({ labelKey, icon, onOpen }, ref) {
    const { t } = useTranslation()
    return (
      <button
        ref={ref}
        onClick={onOpen}
        aria-haspopup="dialog"
        className="flex flex-col items-center gap-2 rounded-lg p-4 hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-indigo-400"
      >
        <span className="text-5xl" aria-hidden="true">
          {icon}
        </span>
        <span className="text-sm drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]">{t(labelKey)}</span>
      </button>
    )
  },
)
