import { Link, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import StatusBadge from '../../components/common/StatusBadge'
import { getInitials, maskAadhaar, matchDeadline, myComplaints } from '../../data/myComplaints'

function Card({ title, subtitle, children }: { title?: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-slate-200/80 bg-surface p-5 shadow-[0_8px_24px_rgba(15,23,42,0.05)] sm:p-6">
      {title && <h2 className="font-display text-lg font-bold text-slate-900">{title}</h2>}
      {subtitle && <p className="mt-1 text-sm leading-6 text-slate-500">{subtitle}</p>}
      {children}
    </section>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-1 gap-1 py-3 sm:grid-cols-[150px_1fr] sm:gap-4">
      <dt className="text-xs font-bold uppercase tracking-wide text-slate-400">{label}</dt>
      <dd className="text-sm font-semibold text-slate-700">{value}</dd>
    </div>
  )
}

interface MyComplaintDetailPageProps {
  backTo?: string
  backLabel?: string
  newComplaintTo?: string
  showNewComplaint?: boolean
}

function MyComplaintDetailPage({
  backTo = '/public/my-complaints',
  backLabel = 'All Complaints',
  newComplaintTo = '/public/register-complaint',
  showNewComplaint = true,
}: MyComplaintDetailPageProps) {
  const { id } = useParams()
  const notify = (feature: string) => toast.success(`${feature} — Demo only. Full flow coming soon.`)

  const complaint = myComplaints.find((c) => String(c.id) === id)

  if (!complaint) {
    return (
      <section className="rounded-2xl border border-slate-200/80 bg-surface p-10 text-center shadow-[0_8px_24px_rgba(15,23,42,0.05)]">
        <h1 className="font-display text-2xl font-extrabold tracking-tight text-slate-900">Case not found</h1>
        <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">We could not locate a complaint matching this reference.</p>
        <Link to={backTo} className="mt-6 inline-block rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-brand-700">Back to My Complaints</Link>
      </section>
    )
  }

  const personsLabel = complaint.age > 0 ? `${complaint.age} years · ${complaint.gender}` : complaint.gender
  const deadlineInfo = complaint.status === 'Matched' && complaint.matchedDaysAgo !== undefined ? matchDeadline(complaint.matchedDaysAgo) : null

  const documents = [
    { label: 'Missing person photos', value: complaint.personPhotos > 0 ? `${complaint.personPhotos} uploaded` : 'Not uploaded', ok: complaint.personPhotos > 0 },
    { label: 'Complainant ID proof', value: complaint.hasComplainantId ? 'Uploaded' : 'Not uploaded', ok: complaint.hasComplainantId },
    { label: 'Family member ID proof', value: complaint.hasMemberId ? 'Uploaded' : 'Not uploaded', ok: complaint.hasMemberId },
    { label: 'Police complaint / FIR copy', value: complaint.hasFirCopy ? 'Attached' : 'Not attached', ok: complaint.hasFirCopy },
  ]

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <Link to={backTo} className="inline-flex items-center gap-1.5 text-sm font-bold text-brand-700 hover:text-brand-800 dark:text-brand-300">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M19 12H5m6-6-6 6 6 6" /></svg>
            {backLabel}
          </Link>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <h1 className="font-display text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">{complaint.name}</h1>
            <StatusBadge status={complaint.status} />
          </div>
          <p className="mt-1 font-mono text-sm text-slate-400">{complaint.caseRef} · {complaint.relation}</p>
        </div>
        {showNewComplaint && (
          <Link to={newComplaintTo} className="w-full rounded-lg bg-brand-600 px-5 py-2.5 text-center text-sm font-bold text-white hover:bg-brand-700 sm:w-auto">Raise a New Complaint</Link>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div className="space-y-6">
          <Card>
            <div className="flex items-center gap-4">
              <span className="grid h-16 w-16 shrink-0 place-items-center rounded-full bg-brand-100 font-display text-lg font-extrabold text-brand-700 dark:bg-brand-950/40 dark:text-brand-300">{getInitials(complaint.name)}</span>
              <div>
                <h2 className="font-display text-lg font-bold text-slate-900">{complaint.name}</h2>
                <p className="text-sm text-slate-500">Missing person · {complaint.relation}</p>
              </div>
            </div>
            <dl className="mt-6 divide-y divide-slate-200/80">
              <Row label="Full Name" value={complaint.name} />
              <Row label="Age / Gender" value={personsLabel} />
              <Row label="Height" value={complaint.height} />
              <Row label="Build" value={complaint.build} />
              <Row label="Identifying Marks" value={complaint.marks} />
              <Row label="Clothing" value={complaint.clothing} />
              <Row label="Medical Notes" value={complaint.medicalNotes} />
              <Row label="Languages" value={complaint.languages} />
            </dl>
          </Card>

          <Card title="Last Seen">
            <dl className="mt-4 divide-y divide-slate-200/80">
              <Row label="Date" value={complaint.lastSeenDate} />
              <Row label="Time" value={complaint.lastSeenTime} />
              <Row label="Place" value={complaint.lastSeen} />
              <Row label="City" value={complaint.area} />
              <Row label="Area / Locality" value={complaint.locality} />
              <Row label="Circumstances" value={complaint.circumstances} />
            </dl>
          </Card>

          <Card title="Complainant (You)">
            <dl className="mt-4 divide-y divide-slate-200/80">
              <Row label="Full Name" value={complaint.complainantName} />
              <Row label="Relation" value={complaint.complainantRelation} />
              <Row label="Aadhaar" value={maskAadhaar(complaint.complainantAadhaar)} />
              <Row label="Mobile" value={`+91 ${complaint.complainantMobile}`} />
              <Row label="Address" value={complaint.complainantAddress} />
            </dl>
          </Card>

          <Card title="Second Family Member" subtitle="An alternate contact who can act on this case.">
            <dl className="mt-4 divide-y divide-slate-200/80">
              <Row label="Full Name" value={complaint.memberName} />
              <Row label="Relation" value={complaint.memberRelation} />
              <Row label="Aadhaar" value={maskAadhaar(complaint.memberAadhaar)} />
              <Row label="Mobile" value={`+91 ${complaint.memberMobile}`} />
            </dl>
          </Card>

          <Card title="Police Complaint">
            <dl className="mt-4 divide-y divide-slate-200/80">
              <Row label="Police Station" value={complaint.policeStation} />
              <Row label="FIR / Complaint No." value={complaint.firNumber} />
              <Row label="FIR Date" value={complaint.firDate} />
            </dl>
          </Card>

          <Card title="Documents" subtitle="Proofs submitted with this complaint.">
            <ul className="mt-4 space-y-2">
              {documents.map((doc) => (
                <li key={doc.label} className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 rounded-xl border border-slate-200 bg-canvas px-4 py-3">
                  <span className="inline-flex items-center gap-2.5 text-sm font-semibold text-slate-700">
                    <span className={`grid h-5 w-5 place-items-center rounded-full text-white ${doc.ok ? 'bg-emerald-500' : 'bg-slate-300'}`} aria-hidden="true">
                      {doc.ok ? (
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="m5 13 4 4L19 7" /></svg>
                      ) : (
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M18 6 6 18M6 6l12 12" /></svg>
                      )}
                    </span>
                    {doc.label}
                  </span>
                  <span className={`text-xs font-bold ${doc.ok ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'}`}>{doc.value}</span>
                </li>
              ))}
            </ul>
          </Card>

          <Card title="Case Actions" subtitle="Keep this complaint up to date so authorities and community members have the latest information.">
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
          </Card>
        </div>

        <section className="h-fit rounded-2xl border border-slate-200/80 bg-surface p-5 shadow-[0_8px_24px_rgba(15,23,42,0.05)] sm:p-6">
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
