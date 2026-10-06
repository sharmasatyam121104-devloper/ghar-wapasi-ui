import { useEffect } from 'react'

interface LogoutDialogProps {
  title?: string
  message: string
  onCancel: () => void
  onConfirm: () => void
}

function LogoutDialog({ title = 'Logout first', message, onCancel, onConfirm }: LogoutDialogProps) {
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onCancel()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onCancel])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label={title}>
      <button type="button" aria-label="Close dialog" onClick={onCancel} className="absolute inset-0 cursor-default" tabIndex={-1} />
      <div className="relative w-full max-w-sm rounded-2xl border border-slate-200/80 bg-surface p-6 shadow-[0_24px_60px_rgba(15,23,42,0.28)]">
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-rose-50 text-rose-600">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />
            </svg>
          </span>
          <h2 className="font-display text-lg font-extrabold tracking-tight text-slate-900">{title}</h2>
        </div>
        <p className="mt-3 text-sm leading-6 text-slate-600">{message}</p>
        <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end [&>*]:w-full sm:[&>*]:w-auto">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-bold text-slate-700 hover:border-brand-400 hover:text-brand-700 dark:hover:text-brand-300"
          >
            Cancel
          </button>
          <button type="button" onClick={onConfirm} className="rounded-xl bg-rose-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-rose-700">
            Logout
          </button>
        </div>
      </div>
    </div>
  )
}

export default LogoutDialog
