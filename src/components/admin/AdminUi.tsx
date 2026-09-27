import type { ReactNode } from 'react'

export type StatTone = 'default' | 'admin' | 'amber' | 'rose' | 'emerald'
export type PillTone = 'slate' | 'admin' | 'amber' | 'rose' | 'emerald'

export function ConsoleStat({ label, value, detail, tone = 'default' }: { label: string; value: string; detail: string; tone?: StatTone }) {
  const tones: Record<StatTone, string> = {
    default: 'text-slate-900',
    admin: 'text-admin-700 dark:text-admin-300',
    amber: 'text-amber-700 dark:text-amber-300',
    rose: 'text-rose-700 dark:text-rose-300',
    emerald: 'text-emerald-700 dark:text-emerald-300',
  }
  return (
    <div className="min-w-0 rounded-2xl border border-slate-200/80 bg-surface p-4 shadow-[0_8px_24px_rgba(15,23,42,0.05)] sm:p-5">
      <p className="truncate text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400 sm:text-[11px]">{label}</p>
      <p className={`mt-1.5 font-display text-2xl font-extrabold tabular-nums sm:mt-2 sm:text-3xl ${tones[tone]}`}>{value}</p>
      <p className="mt-1 text-[11px] leading-4 text-slate-500 sm:text-xs sm:leading-5">{detail}</p>
    </div>
  )
}

export function SectionCard({ title, subtitle, action, children }: { title: string; subtitle?: string; action?: ReactNode; children: ReactNode }) {
  return (
    <section className="min-w-0 rounded-2xl border border-slate-200/80 bg-surface shadow-[0_8px_24px_rgba(15,23,42,0.05)]">
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-200/80 px-4 py-3.5 sm:items-center sm:px-5 sm:py-4">
        <div className="min-w-0 flex-1">
          <h2 className="font-display text-sm font-extrabold tracking-tight text-slate-900 sm:text-base">{title}</h2>
          {subtitle && <p className="mt-0.5 text-xs leading-5 text-slate-500">{subtitle}</p>}
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </div>
      <div className="p-4 sm:p-5">{children}</div>
    </section>
  )
}

export function Pill({ children, tone = 'slate' }: { children: ReactNode; tone?: PillTone }) {
  const tones: Record<PillTone, string> = {
    slate: 'bg-slate-100 text-slate-600 dark:bg-slate-800/70 dark:text-slate-300',
    admin: 'bg-admin-50 text-admin-700 dark:bg-admin-950/50 dark:text-admin-300',
    amber: 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300',
    rose: 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300',
    emerald: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300',
  }
  return <span className={`inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-[11px] font-bold ${tones[tone]}`}>{children}</span>
}

export function DetailRow({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="grid grid-cols-1 gap-0.5 sm:grid-cols-[150px_1fr] sm:gap-3">
      <dt className="text-[11px] font-bold uppercase tracking-wide text-slate-400">{label}</dt>
      <dd className="min-w-0 break-words text-sm font-semibold text-slate-800">{value}</dd>
    </div>
  )
}

export function ActionButton({
  children,
  onClick,
  variant = 'admin',
  type = 'button',
  className = '',
  disabled = false,
}: {
  children: ReactNode
  onClick?: () => void
  variant?: 'admin' | 'ghost' | 'emerald' | 'rose' | 'amber'
  type?: 'button' | 'submit'
  className?: string
  disabled?: boolean
}) {
  const variants: Record<string, string> = {
    admin: 'bg-admin-600 text-white hover:bg-admin-700',
    ghost: 'border border-slate-200 text-slate-700 hover:border-admin-400 hover:text-admin-700 dark:hover:border-admin-400 dark:hover:text-admin-300',
    emerald: 'bg-emerald-600 text-white hover:bg-emerald-700',
    rose: 'bg-rose-600 text-white hover:bg-rose-700',
    amber: 'bg-amber-500 text-white hover:bg-amber-600',
  }
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`rounded-lg px-3.5 py-2.5 text-sm font-bold transition disabled:cursor-not-allowed disabled:opacity-50 sm:px-4 ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  )
}
