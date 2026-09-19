import { Link } from 'react-router-dom'
import StatusBadge from '../../components/common/StatusBadge'
import { getInitials, myComplaints } from '../../data/myComplaints'
import { formatCallTime, policeStatusLabel, usePoliceProfile } from '../../data/police'

function PoliceDashboard() {
  const profile = usePoliceProfile()

  if (!profile) {
    return (
      <section className="rounded-2xl border border-slate-200/80 bg-surface p-6 shadow-[0_8px_24px_rgba(15,23,42,0.05)] sm:p-8">
        <h1 className="mt-2 font-display text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">Register as a Police Officer</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500">
          The police portal is available only to verified officers. Complete your registration with your service details and Aadhaar-linked mobile. The admin verifies your account before the portal opens.
        </p>
        <Link to="/police/register" className="mt-5 inline-block rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-brand-700">
          Start Registration
        </Link>
      </section>
    )
  }

  if (profile.status !== 'verified') {
    const pending = profile.status === 'pending'
    return (
      <section className="space-y-6">
        <div className="rounded-2xl border border-slate-200/80 bg-surface p-6 shadow-[0_8px_24px_rgba(15,23,42,0.05)] sm:p-8">
          <h1 className="mt-2 font-display text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">Welcome, {profile.fullName || 'Officer'}</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500">
            Your registration status is <span className="font-bold text-slate-700">{policeStatusLabel[profile.status]}</span>.{' '}
            {pending
              ? 'The admin is verifying your service details. You will be able to register and manage complaints once approved.'
              : 'Please review your details and resubmit your registration.'}
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <Link to="/police/status" className="rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-brand-700">
              View Registration Status
            </Link>
            {!pending && (
              <Link to="/police/register" className="rounded-lg border border-slate-200 px-5 py-2.5 text-sm font-bold text-slate-700 hover:border-brand-400 dark:hover:text-brand-300">
                Update &amp; Resubmit
              </Link>
            )}
          </div>
        </div>
      </section>
    )
  }

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
          <h1 className="mt-2 font-display text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">{profile.rank} {profile.fullName}</h1>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            {profile.stationName}
            {profile.district ? ` · ${profile.district}` : ''}
            {profile.state ? `, ${profile.state}` : ''}
          </p>
        </div>
        <Link to="/police/register-complaint" className="w-full rounded-lg bg-brand-600 px-5 py-2.5 text-center text-sm font-bold text-white hover:bg-brand-700 sm:w-auto">
          Register New Complaint
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {summary.map((item) => (
          <div key={item.label} className="rounded-2xl border border-slate-200/80 bg-surface p-5 shadow-[0_8px_24px_rgba(15,23,42,0.05)]">
            <p className={`font-display text-2xl font-extrabold ${item.tone}`}>{item.value}</p>
            <p className="mt-1 text-xs font-semibold text-slate-500">{item.label}</p>
          </div>
        ))}
      </div>

      {profile.verifyCallLink && (
        <div className="rounded-2xl border border-slate-200/80 bg-surface p-5">
          <p className="text-xs font-bold uppercase tracking-wide text-slate-400">Verification video call scheduled by admin</p>
          <p className="mt-1 break-all text-sm font-semibold text-brand-700 dark:text-brand-300">{profile.verifyCallLink}</p>
          {profile.verifyCallTime && <p className="mt-1 text-xs font-semibold text-slate-500">{formatCallTime(profile.verifyCallTime)}</p>}
          {profile.verifyCallNote && <p className="mt-1 text-sm text-slate-500">{profile.verifyCallNote}</p>}
        </div>
      )}

      <div>
        <h2 className="mb-3 font-display text-lg font-extrabold tracking-tight text-slate-900">Registered Complaints</h2>
        <div className="grid gap-5 md:grid-cols-2">
          {myComplaints.map((complaint) => (
            <Link
              key={complaint.id}
              to={`/police/complaints/${complaint.id}`}
              className="group rounded-2xl border border-slate-200/80 bg-surface p-5 shadow-[0_8px_24px_rgba(15,23,42,0.05)] transition hover:border-brand-400 dark:hover:border-brand-500/40"
            >
              <div className="flex items-start gap-4">
                <span className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-brand-100 font-display text-base font-extrabold text-brand-700 dark:bg-brand-950/40 dark:text-brand-300">{getInitials(complaint.name)}</span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-display text-base font-bold text-slate-900">
                      {complaint.name} <span className="text-xs font-semibold text-slate-400">({complaint.relation})</span>
                    </h3>
                    <StatusBadge status={complaint.status} />
                  </div>
                  <p className="mt-1 font-mono text-xs text-slate-400">{complaint.caseRef}</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {complaint.firNumber && (
                      <span className="rounded-full border border-slate-200 px-2.5 py-1 text-[11px] font-bold text-slate-600">FIR {complaint.firNumber}</span>
                    )}
                    <span className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${complaint.hasFirCopy ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300' : 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300'}`}>
                      {complaint.hasFirCopy ? 'FIR copy attached' : 'FIR copy missing'}
                    </span>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{complaint.latest}</p>
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
          ))}
        </div>
      </div>
    </div>
  )
}

export default PoliceDashboard
