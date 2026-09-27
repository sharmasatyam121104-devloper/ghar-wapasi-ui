export function filterChipClass(active: boolean): string {
  return `rounded-lg border px-3.5 py-2.5 text-sm font-bold transition sm:py-2 ${
    active
      ? 'border-admin-600 bg-admin-600 text-white'
      : 'border-slate-200 text-slate-700 hover:border-admin-400 hover:text-admin-700 dark:text-slate-300 dark:hover:border-admin-400 dark:hover:text-admin-300'
  }`
}

export const adminLinkClass =
  'rounded-lg border border-slate-200 px-3 py-2.5 text-xs font-bold text-slate-700 hover:border-admin-400 hover:text-admin-700 sm:py-2 dark:hover:border-admin-400 dark:hover:text-admin-300'
