interface DashboardStat {
  title: string
  value: number
  detail: string
}

interface StatCardProps {
  stat: DashboardStat
  accent: string
}

function StatCard({ stat, accent }: StatCardProps) {
  return (
    <article className="rounded-2xl border border-slate-200/80 bg-surface p-5 shadow-[0_8px_24px_rgba(15,23,42,0.05)]">
      <div className="mb-8 flex items-center justify-between">
        <span className={`h-2.5 w-2.5 rounded-full ${accent}`} aria-hidden="true" />
        <span className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">Today</span>
      </div>
      <p className="text-sm font-medium text-slate-500">{stat.title}</p>
      <p className="mt-1 font-display text-3xl font-bold text-slate-900">{stat.value}</p>
      <p className="mt-2 text-xs text-slate-400">{stat.detail}</p>
    </article>
  )
}

export type { DashboardStat }
export default StatCard