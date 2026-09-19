import { Link } from 'react-router-dom'
import { toast } from 'sonner'
import StatusBadge from '../../components/common/StatusBadge'
import { complaintSteps, doneCountFor, getInitials, myComplaints } from '../../data/myComplaints'

interface MissingReport {
  id: number
  name: string
  age: number
  gender: string
  lastSeen: string
  area: string
  status: 'Active' | 'Matched' | 'Resolved'
  priority: 'high' | 'normal'
}

interface Stat {
  label: string
  value: string
}

const stats: Stat[] = [
  { label: 'Active Missing Cases', value: '232' },
  { label: 'Reunited Families', value: '86' },
  { label: 'Active Alert Radius', value: '6 km' },
]

const reports: MissingReport[] = [
  { id: 1, name: 'Sunita Devi', age: 64, gender: 'Senior Citizen', lastSeen: 'Old Delhi Railway Station', area: 'Delhi', status: 'Active', priority: 'high' },
  { id: 2, name: 'Arjun Kumar', age: 9, gender: 'Child', lastSeen: 'City Park, Zone 4', area: 'Indore', status: 'Active', priority: 'high' },
  { id: 3, name: 'Meera Joshi', age: 28, gender: 'Female', lastSeen: 'Azad Market', area: 'Lucknow', status: 'Active', priority: 'high' },
  { id: 4, name: 'Ram Singh', age: 45, gender: 'Male', lastSeen: 'Kashmere Gate Bus Stop', area: 'Delhi', status: 'Resolved', priority: 'normal' },
]

function PublicDashboard() {
  const notify = (feature: string) => toast.success(`${feature} — Demo only. Full flow coming soon.`)

  return (
    <div className="space-y-8">
      <section className="rounded-2xl bg-gradient-to-br from-brand-600 to-brand-700 p-6 text-white shadow-[0_8px_24px_rgba(36,45,120,0.18)] sm:p-10 dark:from-[#0e1424] dark:to-[#080a12] dark:shadow-none">
        <div className="mb-8 grid gap-6 md:grid-cols-[1.6fr_1fr] md:items-center">
          <div>
            <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-bold uppercase tracking-[0.14em]">Community Help Network</span>
            <h1 className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">Help someone find their way home</h1>
            <p className="mt-4 max-w-xl text-sm leading-6 text-white/80">Report a missing person, search with a photo using AI, or share a sighting so families can reconnect — every alert reaches your community.</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link to="/public/register-complaint" className="rounded-lg bg-white px-5 py-2.5 text-sm font-bold text-brand-700 hover:bg-brand-50">Raise a Complaint</Link>
              <button type="button" onClick={() => notify('AI Photo Search')} className="rounded-lg border border-white/40 px-5 py-2.5 text-sm font-bold text-white hover:bg-white/10">Search by Photo</button>
              <button type="button" onClick={() => notify('Go to your portal')} className="rounded-lg border border-white/40 px-5 py-2.5 text-sm font-bold text-white hover:bg-white/10">Go to Your Portal</button>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2 sm:gap-3 md:grid-cols-1 md:gap-4">
            {stats.map((stat) => (
              <div key={stat.label} className="rounded-xl bg-white/10 p-3 sm:p-4">
                <p className="font-display text-xl font-extrabold sm:text-2xl md:text-3xl">{stat.value}</p>
                <p className="mt-1 text-[11px] font-semibold text-white/70 sm:text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-5 md:grid-cols-3">
        <article className="flex flex-col rounded-2xl border border-slate-200/80 bg-surface p-6 shadow-[0_8px_24px_rgba(15,23,42,0.05)]">
          <span className="grid h-11 w-11 place-items-center rounded-xl bg-brand-50 text-brand-600 dark:text-brand-300">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M12 20h9M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" /></svg>
          </span>
          <h2 className="mt-4 font-display text-lg font-bold text-slate-900">Report a Missing Person</h2>
          <p className="mt-2 flex-1 text-sm leading-6 text-slate-500">File a detailed complaint with photo and last seen location. A registered account is needed to track its status.</p>
          <Link to="/public/register-complaint" className="mt-5 rounded-lg bg-brand-600 px-4 py-2.5 text-center text-sm font-bold text-white hover:bg-brand-700">Raise a Complaint</Link>
        </article>
        <article className="flex flex-col rounded-2xl border border-slate-200/80 bg-surface p-6 shadow-[0_8px_24px_rgba(15,23,42,0.05)]">
          <span className="grid h-11 w-11 place-items-center rounded-xl bg-brand-50 text-brand-600 dark:text-brand-300">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3M14.5 8.5a3.5 3.5 0 0 0-2.5-5.1" /></svg>
          </span>
          <h2 className="mt-4 font-display text-lg font-bold text-slate-900">AI Photo Search</h2>
          <p className="mt-2 flex-1 text-sm leading-6 text-slate-500">Upload a photo — AI finds where the person is and instantly alerts every registered user within a 6 km radius.</p>
          <button type="button" onClick={() => notify('AI Photo Search')} className="mt-5 rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-bold text-slate-700 hover:border-brand-400 hover:text-brand-700 dark:hover:text-brand-300">Search by Photo</button>
        </article>
        <article className="flex flex-col rounded-2xl border border-slate-200/80 bg-surface p-6 shadow-[0_8px_24px_rgba(15,23,42,0.05)]">
          <span className="grid h-11 w-11 place-items-center rounded-xl bg-brand-50 text-brand-600 dark:text-brand-300">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M12 21s-7-4.6-9.5-9A5.5 5.5 0 0 1 12 6.5 5.5 5.5 0 0 1 21.5 12c-2.5 4.4-9.5 9-9.5 9Z" /></svg>
          </span>
          <h2 className="mt-4 font-display text-lg font-bold text-slate-900">Report a Sighting</h2>
          <p className="mt-2 flex-1 text-sm leading-6 text-slate-500">Spotted someone from a missing report? Share the photo and details so their family and nearby users can be notified.</p>
          <button type="button" onClick={() => notify('Sighting Report')} className="mt-5 rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-bold text-slate-700 hover:border-brand-400 hover:text-brand-700 dark:hover:text-brand-300">Submit Sighting</button>
        </article>
      </section>

      <section>
        <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="font-display text-xl font-extrabold tracking-tight text-slate-900">Your Complaints</h2>
            <p className="mt-1 text-sm text-slate-500">Complaints registered from your account — track status and manage them here.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link to="/public/my-complaints" className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-bold text-slate-700 hover:border-brand-400 hover:text-brand-700 dark:hover:text-brand-300">View All Complaints</Link>
            <Link to="/public/register-complaint" className="rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-brand-700">Raise a New Complaint</Link>
          </div>
        </div>
        <div className="grid gap-5 md:grid-cols-2">
          {myComplaints.map((complaint) => {
            const doneCount = doneCountFor(complaint.status)
            return (
              <article key={complaint.id} className="rounded-2xl border border-slate-200/80 bg-surface p-5 shadow-[0_8px_24px_rgba(15,23,42,0.05)]">
                <div className="flex items-start gap-4">
                  <span className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-brand-100 font-display text-base font-extrabold text-brand-700 dark:text-brand-300">{getInitials(complaint.name)}</span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-display text-base font-bold text-slate-900">
                        {complaint.name} <span className="text-xs font-semibold text-slate-400">({complaint.relation})</span>
                      </h3>
                      <StatusBadge status={complaint.status} />
                    </div>
                    <p className="mt-1 font-mono text-xs text-slate-400">{complaint.caseRef}</p>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{complaint.latest}</p>
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
                    <div className="mt-5 flex flex-wrap items-center gap-2">
                      <Link to={`/public/my-complaints/${complaint.id}`} className="inline-flex items-center gap-1 text-xs font-bold text-brand-700 hover:gap-1.5 dark:text-brand-300">
                        View Case
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6" /></svg>
                      </Link>
                      <button type="button" onClick={() => notify('Case Update')} className="rounded-lg border border-slate-200 px-3.5 py-2 text-xs font-bold text-slate-700 hover:border-brand-400 hover:text-brand-700 dark:hover:text-brand-300">Update Case</button>
                      {complaint.status !== 'Resolved' && (
                        <button type="button" onClick={() => notify('Mark Resolved')} className="rounded-lg px-3.5 py-2 text-xs font-bold text-brand-700 hover:bg-brand-50 dark:text-brand-300 dark:hover:bg-brand-950/40">Mark as Resolved</button>
                      )}
                    </div>
                    <p className="mt-3 text-xs text-slate-400">{complaint.updatedAt}</p>
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      </section>

      <section className="rounded-2xl border border-amber-200/80 bg-amber-50 p-5 sm:p-6 dark:border-amber-400/30 dark:bg-amber-950/40">
        <div className="flex items-start gap-4">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-amber-100 text-amber-700 dark:bg-amber-400/20 dark:text-amber-300">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4" /></svg>
          </span>
          <div>
            <h2 className="font-display text-base font-bold text-slate-900">Priority Alerts</h2>
            <p className="mt-1 text-sm leading-6 text-slate-600">Cases involving a <span className="font-semibold text-amber-700 dark:text-amber-300">female, senior citizen, or child</span> are broadcast instantly to <span className="font-semibold text-amber-700 dark:text-amber-300">every registered user</span> within a 6 km radius of the last seen location.</p>
          </div>
        </div>
      </section>

      <section>
        <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="font-display text-xl font-extrabold tracking-tight text-slate-900">Recent Missing Reports</h2>
            <p className="mt-1 text-sm text-slate-500">Latest updates from families across the community.</p>
          </div>
          <span className="rounded-full bg-brand-50 px-3 py-1 text-xs font-bold text-brand-700 dark:text-brand-300">{reports.length} Reports</span>
        </div>
        <div className="grid gap-5 md:grid-cols-2">
          {reports.map((report) => (
            <article key={report.id} className="rounded-2xl border border-slate-200/80 bg-surface p-5 shadow-[0_8px_24px_rgba(15,23,42,0.05)]">
              <div className="flex items-start gap-4">
                <span className={`grid h-14 w-14 shrink-0 place-items-center rounded-full ${report.priority === 'high' ? 'bg-amber-100 text-amber-700' : 'bg-brand-100 text-brand-700 dark:text-brand-300'}`}>
                  <span className="font-display text-base font-extrabold">{getInitials(report.name)}</span>
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-display text-base font-bold text-slate-900">{report.name}</h3>
                    {report.status === 'Active' ? (
                      <span className="rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-bold text-amber-700 dark:bg-amber-950/60 dark:text-amber-300">Active</span>
                    ) : (
                      <span className="rounded-full bg-brand-50 px-2.5 py-0.5 text-xs font-bold text-brand-700 dark:text-brand-300">{report.status}</span>
                    )}
                  </div>
                  <p className="mt-1 text-sm font-semibold text-slate-700">{report.age} years · {report.gender}</p>
                  <p className="mt-2 flex items-center gap-1.5 text-xs text-slate-500">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M12 21s-7-4.6-9.5-9A5.5 5.5 0 0 1 12 6.5 5.5 5.5 0 0 1 21.5 12c-2.5 4.4-9.5 9-9.5 9Z" /><circle cx="12" cy="12" r="2.5" /></svg>
                    Last seen at {report.lastSeen}, {report.area}
                  </p>
                </div>
                {report.priority === 'high' && (
                  <span className="shrink-0 rounded-full bg-amber-100 px-2.5 py-1 text-[11px] font-bold text-amber-800 dark:bg-amber-950/60 dark:text-amber-300">Priority Alert</span>
                )}
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}

export default PublicDashboard