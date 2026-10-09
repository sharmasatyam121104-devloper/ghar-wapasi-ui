import { useState } from 'react'
import { fileUrl, isStoredFileReference } from '../../api/client'

interface FilePreviewProps {
  path: string
  label?: string
}

/**
 * Renders one submitted document. Stored files (`<role>/<userId>/<file>`) open
 * in a new tab as an image or a labelled PDF tile; anything else - seeded
 * placeholder names, or a file that fails to load - falls back to a plain chip.
 */
function FilePreview({ path, label }: FilePreviewProps) {
  const [broken, setBroken] = useState(false)
  const name = label ?? path.split('/').pop() ?? path
  const stored = isStoredFileReference(path)

  if (!stored || broken) {
    return (
      <span className="inline-flex max-w-48 items-center rounded-full border border-slate-200 bg-canvas px-3 py-1.5 text-xs font-semibold text-slate-600">
        <span className="truncate">{name}</span>
      </span>
    )
  }

  const url = fileUrl(path)

  if (/\.pdf$/i.test(path)) {
    return (
      <a
        href={url}
        target="_blank"
        rel="noreferrer"
        className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-canvas px-3 py-2 text-xs font-bold text-slate-700 hover:border-brand-400 hover:text-brand-700"
      >
        <span className="grid h-8 w-8 place-items-center rounded-md bg-rose-50 text-[10px] font-extrabold text-rose-600">PDF</span>
        <span className="max-w-40 truncate">{name}</span>
      </a>
    )
  }

  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer"
      title={name}
      className="block overflow-hidden rounded-lg border border-slate-200 bg-canvas hover:border-brand-400"
    >
      <img src={url} alt={name} onError={() => setBroken(true)} className="h-24 w-24 object-cover" />
    </a>
  )
}

export default FilePreview
