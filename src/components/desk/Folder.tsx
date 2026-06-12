import { useTranslation } from 'react-i18next'

type FolderProps = {
  labelKey: string
  icon: string
  onOpen: () => void
}

export function Folder({ labelKey, icon, onOpen }: FolderProps) {
  const { t } = useTranslation()
  return (
    <button
      onClick={onOpen}
      className="flex flex-col items-center gap-2 rounded-lg p-4 hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-indigo-400"
    >
      <span className="text-5xl" aria-hidden="true">
        {icon}
      </span>
      <span className="text-sm">{t(labelKey)}</span>
    </button>
  )
}
