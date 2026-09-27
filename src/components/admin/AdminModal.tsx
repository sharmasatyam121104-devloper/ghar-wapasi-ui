import type { ReactNode } from 'react'

interface AdminModalProps {
  open: boolean
  title: string
  description?: string
  onClose: () => void
  children: ReactNode
  footer?: ReactNode
}

function AdminModal({ open, title, description, onClose, children, footer }: AdminModalProps) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/60 p-0 backdrop-blur-sm sm:items-center sm:p-6" role="dialog" aria-modal="true" aria-label={title}>
      <button type="button" aria-label="Close dialog" onClick={onClose} className="absolute inset-0 cursor-default" tabIndex={-1} />
      <div className="relative flex max-h-[92dvh] w-full max-w-2xl flex-col overflow-hidden rounded-t-2xl border border-slate-200/80 bg-surface shadow-[0_24px_60px_rgba(15,23,42,0.28)] sm:max-h-[88dvh] sm:rounded-2xl">
        <div className="flex items-start justify-between gap-3 border-b border-slate-200/80 px-4 py-3.5 sm:px-6 sm:py-4">
          <div className="min-w-0">
            <h2 className="font-display text-base font-extrabold tracking-tight text-slate-900 sm:text-lg">{title}</h2>
            {description && <p className="mt-1 text-xs leading-5 text-slate-500 sm:text-sm sm:leading-6">{description}</p>}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-slate-200 text-slate-500 hover:border-admin-400 hover:text-admin-700 dark:hover:border-admin-400 dark:hover:text-admin-300"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              <path d="M6 6l12 12M18 6 6 18" />
            </svg>
          </button>
        </div>
        <div className="flex-1 overflow-y-auto overscroll-contain px-4 py-4 sm:px-6 sm:py-5">{children}</div>
        {footer && <div className="flex shrink-0 flex-col-reverse gap-2 border-t border-slate-200/80 bg-surface px-4 py-3.5 sm:flex-row sm:flex-wrap sm:justify-end sm:px-6 sm:py-4 [&>*]:w-full sm:[&>*]:w-auto">{footer}</div>}
      </div>
    </div>
  )
}

export default AdminModal
