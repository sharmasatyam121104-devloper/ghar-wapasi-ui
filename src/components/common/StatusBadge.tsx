import type { MyComplaintStatus } from '../../data/myComplaints'

interface StatusBadgeProps {
  status: MyComplaintStatus
}

function StatusBadge({ status }: StatusBadgeProps) {
  const classes =
    status === 'Active'
      ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'
      : status === 'Matched'
        ? 'bg-brand-50 text-brand-700 dark:text-brand-300'
        : 'bg-slate-100 text-slate-600'
  return <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${classes}`}>{status}</span>
}

export default StatusBadge