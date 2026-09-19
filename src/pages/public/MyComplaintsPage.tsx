import { Link } from 'react-router-dom'
import StatusBadge from '../../components/common/StatusBadge'
import { complaintSteps, doneCountFor, getInitials, matchDeadline, myComplaints } from '../../data/myComplaints'

function MyComplaintsPage() {
  const counts = {
    total: myComplaints.length,
    active: myComplaints.filter((c) => c.status === 'Active').length,
    matched: myComplaints.filter((c) => c.status === 'Matched').length,
    resolved: myComplaints.filter((c) => c.status === 'Resolved').length,
  }

  const summary = [
    { label: 'Total Complaints', value: counts.total.toString(), tone: 'text-brand-700 dark:text-brand-300' },
    { label: 'Active', value: counts.active.toString(), tone: 'text-amber-700 dark:text-amber-300' },
    { label: 'Matched', value: counts.matched.toString(), tone: 'text-brand-700 dark:text-brand-300' },
    { label: 'Resolved', value: counts.resolved.toString(), tone: 'text-slate-700' },
  ]

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-[0.16em] text-brand-700 dark:text-brand-300">Self-Service</span>
          <h1 className="mt-2 font-display text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">Your Complaints</h1>
          <p className="mt-2 text-sm leading-6 text-slate-500">All complaints registered from your account. Click any case to view its full details and timeline.</p>
        </div>
        <Link to="/public/register-complaint" className="w-full rounded-lg bg-brand-600 px-5 py-2.5 text-center text-sm font-bold text-white hover:bg-brand-700 sm:w-auto">Raise a New Complaint</Link>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {summary.map((item) => (
          <div key={item.label} className="rounded-2xl border border-slate-200/80 bg-surface p-5 shadow-[0_8px_24px_rgba(15,23,42,0.05)]">
            <p className={`font-display text-2xl font-extrabold ${item.tone}`}>{item.value}</p>
            <p className="mt-1 text-xs font-semibold text-slate-500">{item.label}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        {myComplaints.map((complaint) => {
          const doneCount = doneCountFor(complaint.status)
          const deadlineInfo = complaint.status === 'Matched' && complaint.matchedDaysAgo !== undefined ? matchDeadline(complaint.matchedDaysAgo) : null
          return (
            <Link
              key={complaint.id}
              to={`/public/my-complaints/${complaint.id}`}
              className="group rounded-2xl border border-slate-200/80 bg-surface p-5 shadow-[0_8px_24px_rgba(15,23,42,0.05)] transition hover:border-brand-400 dark:hover:border-brand-500/40"
            >
              <div className="flex items-start gap-4">
                <span className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-brand-100 font-display text-base font-extrabold text-brand-700 dark:bg-brand-950/40 dark:text-brand-300">{getInitials(complaint.name)}</span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="font-display text-base font-bold text-slate-900">
                      {complaint.name} <span className="text-xs font-semibold text-slate-400">({complaint.relation})</span>
                    </h2>
                    <StatusBadge status={complaint.status} />
                  </div>
                  <p className="mt-1 font-mono text-xs text-slate-400">{complaint.caseRef}</p>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{complaint.latest}</p>
                  {deadlineInfo &&
                    (deadlineInfo.daysLeft >= 0 ? (
                      <p className="mt-2 text-xs font-bold text-amber-700 dark:text-amber-300">
                        Update status within 2 days {deadlineInfo.daysLeft === 0 ? '(today)' : `· ${deadlineInfo.daysLeft} day(s) left`}
                      </p>
                    ) : (
                      <p className="mt-2 text-xs font-bold text-rose-600 dark:text-rose-400">Status update overdue by {Math.abs(deadlineInfo.daysLeft)} day(s)</p>
                    ))}
                  <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1">
                    {complaintSteps.map((step, index) => {
                      const done = index < doneCount
                      return (
                        <span key={step} className="flex items-center gap-1.5">
                          <span className={`h-2 w-2 rounded-full ${done ? 'bg-brand-500' : 'bg-slate-300'}`} />
                          <span className={`text-xs font-semibold ${done ? 'text-slate-700' : 'text-slate-400'}`}>{step}</span>
                        </span>
                      )
                    })}
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-xs text-slate-400">{complaint.updatedAt}</span>
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-brand-700 group-hover:gap-1.5 dark:text-brand-300">
                      View Case
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6" /></svg>
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}

export default MyComplaintsPage