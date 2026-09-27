import { Link } from 'react-router-dom'
import { ConsoleStat, Pill, SectionCard } from '../../components/admin/AdminUi'
import { adminLinkClass } from '../../components/admin/adminStyles'
import { scopedCases, scopedMembers, scopedReports, scopedSuspensions, tallyCases, timeAgo, useAdminConsole } from '../../data/admin'
import { useCurrentAdmin } from '../../data/session'

function AdminDashboard() {
  const state = useAdminConsole()
  const admin = useCurrentAdmin()
  if (!admin) return null

  const members = scopedMembers(state, admin)
  const cases = scopedCases(state, admin)
  const reports = scopedReports(state, admin)
  const suspensions = scopedSuspensions(state, admin)

  const pending = members.filter((member) => member.status === 'pending')
  const verified = members.filter((member) => member.status === 'verified')
  const openReports = reports.filter((report) => report.status !== 'closed')
  const activeSuspensions = suspensions.filter((item) => item.status === 'active')
  const tally = tallyCases(cases)

  return (
    <div className="space-y-5 sm:space-y-6">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <ConsoleStat label="Pending Requests" value={String(pending.length)} detail="Assigned to you, waiting for a decision" tone="amber" />
        <ConsoleStat label="My Users" value={String(verified.length)} detail="Accounts you verified" tone="admin" />
        <ConsoleStat label="Open Reports" value={String(openReports.length)} detail="Against your users" tone="rose" />
        <ConsoleStat label="Suspended" value={String(activeSuspensions.length)} detail="Blocked by you" />
      </div>

      <SectionCard
        title="Waiting in your queue"
        subtitle="Oldest first. You give the meeting link and time, then approve or reject."
        action={<Link to="/admin/requests" className={adminLinkClass}>Open queue</Link>}
      >
        {pending.length === 0 ? (
          <p className="text-sm text-slate-500">Nothing pending. Every request assigned to you has been decided.</p>
        ) : (
          <ul className="space-y-2">
            {pending
              .slice()
              .sort((a, b) => a.submittedAt - b.submittedAt)
              .map((member) => (
                <li key={member.id} className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-slate-200/80 bg-canvas px-4 py-3">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold text-slate-900">{member.name}</p>
                    <p className="truncate text-xs text-slate-500">
                      {member.role === 'police' ? 'Police' : 'NGO'} · {member.organisation} · {member.state || 'State not given'}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    {member.callLink && member.callTime ? <Pill tone="emerald">Call sent</Pill> : <Pill tone="amber">No call</Pill>}
                    <span className="whitespace-nowrap text-xs text-slate-400">{timeAgo(member.submittedAt)}</span>
                  </div>
                </li>
              ))}
          </ul>
        )}
      </SectionCard>

      <div className="grid gap-6 xl:grid-cols-2">
        <SectionCard title="Case results of your users" subtitle="Only cases belonging to the accounts you verified.">
          <div className="grid grid-cols-3 gap-2 sm:gap-3">
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-center dark:border-emerald-400/30 dark:bg-emerald-950/20 sm:p-4">
              <p className="font-display text-xl font-extrabold tabular-nums text-emerald-700 sm:text-2xl dark:text-emerald-300">{tally.found}</p>
              <p className="mt-0.5 text-[10px] font-bold uppercase tracking-wide text-emerald-700/80 sm:text-[11px] dark:text-emerald-300/80">Found</p>
            </div>
            <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-center dark:border-rose-400/30 dark:bg-rose-950/20 sm:p-4">
              <p className="font-display text-xl font-extrabold tabular-nums text-rose-700 sm:text-2xl dark:text-rose-300">{tally.notFound}</p>
              <p className="mt-0.5 text-[10px] font-bold uppercase tracking-wide text-rose-700/80 sm:text-[11px] dark:text-rose-300/80">Not found</p>
            </div>
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-center dark:border-amber-400/30 dark:bg-amber-950/20 sm:p-4">
              <p className="font-display text-xl font-extrabold tabular-nums text-amber-700 sm:text-2xl dark:text-amber-300">{tally.open}</p>
              <p className="mt-0.5 text-[10px] font-bold uppercase tracking-wide text-amber-700/80 sm:text-[11px] dark:text-amber-300/80">Still open</p>
            </div>
          </div>
          <p className="mt-3 text-xs leading-5 text-slate-500">
            {tally.total} cases in total · {tally.total === 0 ? 'no closed case yet' : `${tally.successRate}% recovery rate`}
            {tally.avgDays > 0 ? ` · average ${tally.avgDays} days to find the person` : ''}
          </p>
        </SectionCard>

        <SectionCard
          title="Latest reports"
          subtitle="A report is the starting point for any suspension."
          action={<Link to="/admin/reports" className={adminLinkClass}>All reports</Link>}
        >
          {openReports.length === 0 ? (
            <p className="text-sm text-slate-500">No open report against your users.</p>
          ) : (
            <ul className="space-y-2">
              {openReports
                .slice()
                .sort((a, b) => b.createdAt - a.createdAt)
                .slice(0, 4)
                .map((report) => (
                  <li key={report.id} className="rounded-lg border border-slate-200/80 bg-canvas px-4 py-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="text-sm font-bold text-slate-900">{report.targetName}</p>
                      <Pill tone={report.status === 'open' ? 'rose' : 'amber'}>{report.status === 'open' ? 'New' : 'Under review'}</Pill>
                    </div>
                    <p className="mt-0.5 text-xs font-semibold text-slate-500">{report.category}</p>
                    <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-500">{report.details}</p>
                  </li>
                ))}
            </ul>
          )}
        </SectionCard>
      </div>

      <SectionCard
        title="Your users"
        subtitle="Each row shows how many cases that account created and how many produced the person."
        action={<Link to="/admin/my-users" className={adminLinkClass}>Open list</Link>}
      >
        {verified.length === 0 ? (
          <p className="text-sm text-slate-500">You have not verified any account yet.</p>
        ) : (
          <ul className="space-y-2">
            {verified.map((member) => {
              const row = tallyCases(cases.filter((item) => item.memberId === member.id))
              return (
                <li key={member.id} className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-slate-200/80 bg-canvas px-4 py-3">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold text-slate-900">{member.name}</p>
                    <p className="truncate text-xs text-slate-500">
                      {member.role === 'police' ? 'Police' : 'NGO'} · {member.organisation}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 text-xs font-bold">
                    <Pill tone="slate">{row.total} cases</Pill>
                    <Pill tone="emerald">{row.found} found</Pill>
                    <Pill tone="rose">{row.notFound} not found</Pill>
                  </div>
                </li>
              )
            })}
          </ul>
        )}
      </SectionCard>
    </div>
  )
}

export default AdminDashboard
