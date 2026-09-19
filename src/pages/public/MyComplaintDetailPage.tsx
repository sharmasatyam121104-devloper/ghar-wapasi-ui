import { Link, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import StatusBadge from '../../components/common/StatusBadge'
import { getInitials, matchDeadline, myComplaints } from '../../data/myComplaints'

function MyComplaintDetailPage() {
  const { id } = useParams()
  const notify = (feature: string) => toast.success(`${feature} — Demo only. Full flow coming soon.`)

  const complaint = myComplaints.find((c) => String(c.id) === id)

  if (!complaint) {
    return (
      <section className="rounded-2xl border border-slate-200/80 bg-surface p-10 text-center shadow-[0_8px_24px_rgba(15,23,42,0.05)]">
        <h1 className="font-display text-2xl font-extrabold tracking-tight text-slate-900">Case not found</h1>
        <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">We could not locate a complaint matching this reference.</p>
        <Link to="/public/my-complaints" className="mt-6 inline-block rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-brand-700">Back to My Complaints</Link>
      </section>
    )
  }

  const infoRows: [string, string][] = [
    ['Age & Gender', `${complaint.age} years · ${complaint.gender}`],
    ['Last Seen', `${complaint.lastSeen}, ${complaint.area}`],
    ['Address', complaint.address],
    ['Contact', complaint.contact],
    ['Wearing', complaint.clothing],
    ['Medical Notes', complaint.medicalNotes],
    ['Last Updated', complaint.updatedAt],
  ]

  const deadlineInfo = complaint.status === 'Matched' && complaint.matchedDaysAgo !== undefined ? matchDeadline(complaint.matchedDaysAgo) : null

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <Link to="/public/my-complaints" className="inline-flex items-center gap-1.5 text-sm font-bold text-brand-700 hover:text-brand-800 dark:text-brand-300">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M19 12H5m6-6-6 6 6 6" /></svg>
            All Complaints
          </Link>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <h1 className="font-display text-3xl font-extrabold tracking-tight text-slate-900">{complaint.name}</h1>
            <StatusBadge status={complaint.status} />
          </div>
          <p className="mt-1 font-mono text-sm text-slate-400">{complaint.caseRef} · {complaint.relation}</p>
        </div>
        <Link to="/public/register-complaint" className="rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-brand-700">Raise a New Complaint</Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div className="space-y-6">
          <section className="rounded-2xl border border-slate-200/80 bg-surface p-6 shadow-[0_8px_24px_rgba(15,23,42,0.05)]">
            <div className="flex items-center gap-4">
              <span className="grid h-16 w-16 shrink-0 place-items-center rounded-full bg-brand-100 font-display text-lg font-extrabold text-brand-700 dark:bg-brand-950/40 dark:text-brand-300">{getInitials(complaint.name)}</span>
              <div>
                <h2 className="font-display text-lg font-bold text-slate-900">{complaint.name}</h2>
                <p className="text-sm text-slate-500">Missing person · {complaint.relation}</p>
              </div>
            </div>
            <dl className="mt-6 divide-y divide-slate-200/80">
              {infoRows.map(([label, value]) => (
                <div key={label} className="grid grid-cols-[130px_1fr] gap-4 py-3">
                  <dt className="text-xs font-bold uppercase tracking-wide text-slate-400">{label}</dt>
                  <dd className="text-sm font-semibold text-slate-700">{value}</dd>
                </div>
              ))}
            </dl>
          </section>

          <section className="rounded-2xl border border-slate-200/80 bg-surface p-6 shadow-[0_8px_24px_rgba(15,23,42,0.05)]">
            <h2 className="font-display text-lg font-bold text-slate-900">Case Actions</h2>
            <p className="mt-1 text-sm leading-6 text-slate-500">Keep this complaint up to date so authorities and community members have the latest information.</p>
            {deadlineInfo &&
              (deadlineInfo.daysLeft >= 0 ? (
                <div className="mt-5 rounded-xl border border-amber-200/80 bg-amber-50 p-4 text-sm leading-6 text-amber-800 dark:border-amber-400/30 dark:bg-amber-950/40 dark:text-amber-200">
                  This person has been found. The case status must be updated within <span className="font-bold">2 days</span> — deadline <span className="font-bold">{deadlineInfo.deadline}</span>
                  {deadlineInfo.daysLeft === 0 ? ' (today).' : ` · ${deadlineInfo.daysLeft} day(s) left.`}
                </div>
              ) : (
                <div className="mt-5 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm leading-6 text-rose-700 dark:border-rose-400/30 dark:bg-rose-950/30 dark:text-rose-300">
                  Status update is <span className="font-bold">overdue</span> by {Math.abs(deadlineInfo.daysLeft)} day(s). A matched case must be updated within 2 days — please change the status now.
                </div>
              ))}
            <div className="mt-5 flex flex-wrap gap-3">
              <button type="button" onClick={() => notify('Case Update')} className="rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-brand-700">Update Case</button>
              {complaint.status !== 'Resolved' && (
                <button type="button" onClick={() => notify('Mark Resolved')} className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-bold text-slate-700 hover:border-brand-400 hover:text-brand-700 dark:hover:text-brand-300">Mark as Resolved</button>
              )}
              <button type="button" onClick={() => notify('Share With Police')} className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-bold text-slate-700 hover:border-brand-400 hover:text-brand-700 dark:hover:text-brand-300">Share with Police</button>
            </div>
          </section>
        </div>

        <section className="h-fit rounded-2xl border border-slate-200/80 bg-surface p-6 shadow-[0_8px_24px_rgba(15,23,42,0.05)]">
          <h2 className="font-display text-lg font-bold text-slate-900">Case Timeline</h2>
          <p className="mt-1 text-sm text-slate-500">Official events for {complaint.caseRef}.</p>
          <ol className="mt-6">
            {complaint.timeline.map((event, index) => (
              <li key={event.id} className="relative flex gap-4 pb-6 last:pb-0">
                {index < complaint.timeline.length - 1 && <span className="absolute left-[11px] top-7 h-full w-px bg-slate-200" aria-hidden="true" />}
                <span
                  className={`mt-1 h-6 w-6 shrink-0 rounded-full border-4 border-surface ${event.state === 'done' ? 'bg-brand-500' : event.state === 'current' ? 'bg-amber-500' : 'bg-slate-300'}`}
                />
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-bold text-slate-900">{event.title}</p>
                    {event.state === 'current' && <span className="rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-bold text-amber-700 dark:bg-amber-950/60 dark:text-amber-300">In progress</span>}
                    {event.state === 'done' && <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-bold text-slate-600">Completed</span>}
                  </div>
                  {event.date && <p className="mt-0.5 text-xs font-semibold text-slate-400">{event.date}</p>}
                  {event.detail && <p className="mt-1.5 text-sm leading-6 text-slate-600">{event.detail}</p>}
                </div>
              </li>
            ))}
          </ol>
        </section>
      </div>
    </div>
  )
}

export default MyComplaintDetailPage