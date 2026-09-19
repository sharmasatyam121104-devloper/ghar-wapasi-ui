import { Link } from 'react-router-dom'
import StatusBadge from '../../components/common/StatusBadge'
import { getInitials, myComplaints } from '../../data/myComplaints'
import { formatVivaTime, ngoStatusLabel, useNgoProfile } from '../../data/ngo'

function NgoDashboard() {
  const profile = useNgoProfile()

  if (!profile) {
    return (
      <section className="rounded-2xl border border-slate-200/80 bg-surface p-6 shadow-[0_8px_24px_rgba(15,23,42,0.05)] sm:p-8">
        <h1 className="mt-2 font-display text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">Register Your NGO</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500">
          The NGO panel helps community organisations coordinate the search and rescue work. Register with whatever information you have — only the organisation name, state, and a contact mobile are needed. The admin verifies you on a short viva call before the portal opens.
        </p>
        <Link to="/ngo/register" className="mt-5 inline-block rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-brand-700">
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
          <h1 className="mt-2 font-display text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">Welcome, {profile.orgName || 'Organisation'}</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500">
            Your registration status is <span className="font-bold text-slate-700">{ngoStatusLabel[profile.status]}</span>.{' '}
            {pending
              ? 'The admin is verifying your organisation over a viva call. You will be able to coordinate cases once approved.'
              : 'Please review your details and resubmit your registration.'}
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <Link to="/ngo/status" className="rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-brand-700">
              View Registration Status
            </Link>
            {!pending && (
              <Link to="/ngo/register" className="rounded-lg border border-slate-200 px-5 py-2.5 text-sm font-bold text-slate-700 hover:border-brand-400 dark:hover:text-brand-300">
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
    { label: 'Total Cases', value: counts.total.toString(), tone: 'text-brand-700 dark:text-brand-300' },
    { label: 'Active', value: counts.active.toString(), tone: 'text-amber-700 dark:text-amber-300' },
    { label: 'Matched', value: counts.matched.toString(), tone: 'text-brand-700 dark:text-brand-300' },
    { label: 'Resolved', value: counts.resolved.toString(), tone: 'text-slate-700' },
  ]

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="mt-2 font-display text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">{profile.orgName}</h1>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            {profile.orgType}
            {profile.state ? ` · ${profile.state}` : ''}
            {profile.city ? `, ${profile.city}` : ''}
          </p>
        </div>
        <span className="rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">Verified NGO</span>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {summary.map((item) => (
          <div key={item.label} className="rounded-2xl border border-slate-200/80 bg-surface p-5 shadow-[0_8px_24px_rgba(15,23,42,0.05)]">
            <p className={`font-display text-2xl font-extrabold ${item.tone}`}>{item.value}</p>
            <p className="mt-1 text-xs font-semibold text-slate-500">{item.label}</p>
          </div>
        ))}
      </div>

      {profile.vivaCallLink && (
        <div className="rounded-2xl border border-slate-200/80 bg-surface p-5">
          <p className="text-xs font-bold uppercase tracking-wide text-slate-400">Viva video call scheduled by admin</p>
          <p className="mt-1 break-all text-sm font-semibold text-brand-700 dark:text-brand-300">{profile.vivaCallLink}</p>
          {profile.vivaCallTime && <p className="mt-1 text-xs font-semibold text-slate-500">{formatVivaTime(profile.vivaCallTime)}</p>}
          {profile.vivaCallNote && <p className="mt-1 text-sm text-slate-500">{profile.vivaCallNote}</p>}
        </div>
      )}

      <div>
        <h2 className="mb-3 font-display text-lg font-extrabold tracking-tight text-slate-900">Community Cases</h2>
        <p className="mb-4 text-sm leading-6 text-slate-500">Track and coordinate cases with families, the community, and the police.</p>
        <div className="grid gap-5 md:grid-cols-2">
          {myComplaints.map((complaint) => (
            <Link
              key={complaint.id}
              to={`/ngo/complaints/${complaint.id}`}
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

export default NgoDashboard