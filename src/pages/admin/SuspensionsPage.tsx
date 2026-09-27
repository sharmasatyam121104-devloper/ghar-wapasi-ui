import { useRef, useState } from 'react'
import { toast } from 'sonner'
import AdminModal from '../../components/admin/AdminModal'
import { ActionButton, ConsoleStat, DetailRow, Pill, SectionCard } from '../../components/admin/AdminUi'
import { inputClass } from '../../components/common/formStyles'
import { isMemberSuspended, liftSuspension, scopedMembers, scopedReports, scopedSuspensions, suspensionReasons, suspendMember, timeAgo, useAdminConsole } from '../../data/admin'
import { useCurrentAdmin } from '../../data/session'

const durations = [
  { value: '0', label: 'Permanent (until lifted manually)' },
  { value: '7', label: '7 days' },
  { value: '15', label: '15 days' },
  { value: '30', label: '30 days' },
  { value: '90', label: '90 days' },
]

function SuspensionsPage() {
  const state = useAdminConsole()
  const admin = useCurrentAdmin()
  const [targetId, setTargetId] = useState('')
  const [category, setCategory] = useState(suspensionReasons[0])
  const [reason, setReason] = useState('')
  const [duration, setDuration] = useState('0')
  const [proofFiles, setProofFiles] = useState<File[]>([])
  const [linkedReports, setLinkedReports] = useState<string[]>([])
  const [liftId, setLiftId] = useState('')
  const [liftNote, setLiftNote] = useState('')
  const proofInput = useRef<HTMLInputElement>(null)

  if (!admin) return null

  const members = scopedMembers(state, admin).filter((member) => member.status !== 'rejected')
  const reports = scopedReports(state, admin)
  const suspensions = scopedSuspensions(state, admin)
  const active = suspensions.filter((item) => item.status === 'active')
  const lifted = suspensions.filter((item) => item.status === 'lifted')
  const target = members.find((member) => member.id === targetId)
  const lifting = suspensions.find((item) => item.id === liftId)

  const openSuspend = (memberId: string) => {
    setTargetId(memberId)
    setCategory(suspensionReasons[0])
    setReason('')
    setDuration('0')
    setProofFiles([])
    setLinkedReports([])
  }

  const submitSuspension = () => {
    if (!target) {
      toast.error('Choose the account you want to suspend.')
      return
    }
    if (reason.trim().length < 25) {
      toast.error('Write a proper reason of at least 25 characters. It stays on record.')
      return
    }
    if (proofFiles.length === 0) {
      toast.error('Attach at least one proof file. A suspension without proof is not valid.')
      return
    }
    suspendMember({
      memberId: target.id,
      category,
      reason: reason.trim(),
      proof: proofFiles.map((file) => file.name),
      reportIds: linkedReports,
      durationDays: Number(duration),
      issuedBy: admin,
    })
    toast.success(`${target.name} suspended. Portal access is blocked.`)
    setTargetId('')
  }

  return (
    <div className="space-y-5 sm:space-y-6">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <ConsoleStat label="Active" value={String(active.length)} detail="Accounts blocked right now" tone="rose" />
        <ConsoleStat label="Lifted" value={String(lifted.length)} detail="Reversed, kept for audit" tone="emerald" />
        <ConsoleStat label="Proof Files" value={String(suspensions.reduce((sum, item) => sum + item.proof.length, 0))} detail="Stored with each suspension" />
      </div>

      <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-4 sm:px-5 dark:border-amber-400/30 dark:bg-amber-950/20">
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-amber-800 dark:text-amber-300">Before you suspend anyone</p>
        <p className="mt-1 text-sm leading-6 text-slate-700 dark:text-slate-300">
          Three things are mandatory — the right account, a written reason, and at least one proof file. Both stay on record and the account holder can ask for a
          review later.
        </p>
      </div>

      <SectionCard title="Your accounts" subtitle="Only the police and NGO accounts you verified can be suspended by you.">
        {members.length === 0 ? (
          <p className="text-sm text-slate-500">You have not verified any account yet.</p>
        ) : (
          <ul className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
            {members.map((member) => {
              const blocked = isMemberSuspended(state, member.id)
              return (
                <li key={member.id} className="flex flex-col gap-3 rounded-lg border border-slate-200/80 bg-canvas p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold text-slate-900">{member.name}</p>
                    <p className="truncate text-xs text-slate-500">{member.organisation}</p>
                    <div className="mt-1.5 flex flex-wrap gap-1.5">
                      <Pill tone={member.role === 'police' ? 'admin' : 'amber'}>{member.role === 'police' ? 'Police' : 'NGO'}</Pill>
                      {blocked && <Pill tone="rose">Suspended</Pill>}
                    </div>
                  </div>
                  {blocked ? (
                    <span className="shrink-0 text-xs font-bold text-rose-600">Blocked</span>
                  ) : (
                    <ActionButton variant="rose" onClick={() => openSuspend(member.id)} className="w-full sm:w-auto">
                      Suspend
                    </ActionButton>
                  )}
                </li>
              )
            })}
          </ul>
        )}
      </SectionCard>

      <SectionCard title="Active suspensions" subtitle="These accounts cannot log in or take a case.">
        {active.length === 0 ? (
          <p className="text-sm text-slate-500">No account is suspended right now.</p>
        ) : (
          <ul className="space-y-2">
            {active.map((item) => {
              const member = state.members.find((row) => row.id === item.memberId)
              return (
                <li key={item.id} className="rounded-lg border border-rose-200 bg-rose-50 p-4 dark:border-rose-400/30 dark:bg-rose-950/20">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-display text-sm font-extrabold text-slate-900">{member?.name ?? 'Unknown account'}</h3>
                        <Pill tone="rose">{item.durationDays === 0 ? 'Permanent' : `${item.durationDays} days`}</Pill>
                      </div>
                      <p className="mt-1 text-xs font-bold text-slate-600">
                        {item.category} · {member?.organisation ?? '—'}
                      </p>
                      <p className="mt-1.5 text-sm leading-6 text-slate-700">{item.reason}</p>
                      <p className="mt-1.5 text-xs text-slate-500">
                        Suspended {timeAgo(item.suspendedAt)} by {item.issuedBy}
                        {item.endsAt > 0 ? ` · ends ${timeAgo(item.endsAt).replace(' ago', ' from now')}` : ' · no end date'}
                      </p>
                      {item.proof.length > 0 && (
                        <ul className="mt-2 flex flex-wrap gap-1.5">
                          {item.proof.map((file) => (
                            <li key={file} className="inline-flex max-w-full rounded-full border border-slate-200 bg-surface px-2.5 py-1 text-[11px] font-semibold text-slate-600">
                              <span className="truncate">{file}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                    <ActionButton
                      variant="ghost"
                      onClick={() => {
                        setLiftId(item.id)
                        setLiftNote('')
                      }}
                      className="w-full shrink-0 sm:w-auto"
                    >
                      Lift
                    </ActionButton>
                  </div>
                </li>
              )
            })}
          </ul>
        )}
      </SectionCard>

      {lifted.length > 0 && (
        <SectionCard title="Lifted suspensions" subtitle="Reversed actions, kept for the record.">
          <ul className="space-y-2">
            {lifted.map((item) => {
              const member = state.members.find((row) => row.id === item.memberId)
              return (
                <li key={item.id} className="rounded-lg border border-slate-200/80 bg-canvas p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-sm font-bold text-slate-900">{member?.name ?? 'Unknown account'}</p>
                    <Pill tone="emerald">Lifted {timeAgo(item.liftedAt)}</Pill>
                  </div>
                  <p className="mt-1 text-xs text-slate-500">Original reason: {item.reason}</p>
                  {item.liftNote && <p className="mt-1 text-xs leading-5 text-slate-500">Lift note: {item.liftNote}</p>}
                </li>
              )
            })}
          </ul>
        </SectionCard>
      )}

      <AdminModal
        open={Boolean(target)}
        onClose={() => setTargetId('')}
        title="Suspend this account"
        description={target ? `${target.name} · ${target.organisation}` : ''}
        footer={
          <>
            <ActionButton variant="ghost" onClick={() => setTargetId('')}>
              Cancel
            </ActionButton>
            <ActionButton variant="rose" onClick={submitSuspension}>
              Confirm suspension
            </ActionButton>
          </>
        }
      >
        {target && (
          <div className="space-y-4">
            <dl className="space-y-3 rounded-xl border border-slate-200/80 bg-canvas p-4">
              <DetailRow label="Account" value={`${target.name} (${target.role === 'police' ? 'Police' : 'NGO'})`} />
              <DetailRow label="Organisation" value={target.organisation} />
              <DetailRow label="Identifier" value={target.identifier} />
              <DetailRow label="Mobile" value={target.mobile || '—'} />
            </dl>

            <label className="block">
              <span className="text-xs font-bold uppercase tracking-wide text-slate-500">Reason category</span>
              <select className={`${inputClass} mt-2`} value={category} onChange={(event) => setCategory(event.target.value)}>
                {suspensionReasons.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="text-xs font-bold uppercase tracking-wide text-slate-500">
                Written reason <span className="text-rose-500">*</span>
              </span>
              <textarea
                className={`${inputClass} mt-2 min-h-[110px] resize-y`}
                value={reason}
                onChange={(event) => setReason(event.target.value)}
                placeholder="What happened, when, and how it was confirmed. Minimum 25 characters."
              />
              <span className="mt-1 block text-xs text-slate-400">{reason.trim().length} characters</span>
            </label>

            <div>
              <span className="text-xs font-bold uppercase tracking-wide text-slate-500">
                Proof <span className="text-rose-500">*</span>
              </span>
              <button
                type="button"
                onClick={() => proofInput.current?.click()}
                className="mt-2 flex w-full flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 px-4 py-5 text-center hover:border-admin-400"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="text-slate-400" aria-hidden="true">
                  <path d="M14.5 4h-5L8 6H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-4l-1.5-2Z" />
                  <circle cx="12" cy="13" r="3.5" />
                </svg>
                <span className="mt-1.5 text-sm font-semibold text-slate-700">Click to attach proof</span>
                <span className="mt-0.5 text-xs text-slate-400">Screenshots, chat records, FIR copy, register extract</span>
              </button>
              <input
                ref={proofInput}
                type="file"
                multiple
                className="hidden"
                onChange={(event) => {
                  const files = event.target.files
                  if (!files) return
                  setProofFiles((current) => [...current, ...Array.from(files)])
                }}
              />
              {proofFiles.length > 0 && (
                <ul className="mt-3 flex flex-wrap gap-2">
                  {proofFiles.map((file, index) => (
                    <li key={`${file.name}-${index}`} className="inline-flex max-w-full items-center gap-2 rounded-full border border-slate-200 bg-canvas px-3 py-1.5 text-xs font-semibold text-slate-600">
                      <span className="truncate">{file.name}</span>
                      <button type="button" onClick={() => setProofFiles((current) => current.filter((_, i) => i !== index))} className="text-slate-400 hover:text-rose-500" aria-label="Remove proof file">
                        ×
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <label className="block">
              <span className="text-xs font-bold uppercase tracking-wide text-slate-500">Duration</span>
              <select className={`${inputClass} mt-2`} value={duration} onChange={(event) => setDuration(event.target.value)}>
                {durations.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
            </label>

            <div>
              <span className="text-xs font-bold uppercase tracking-wide text-slate-500">Link reports against this account</span>
              {reports.filter((report) => report.targetMemberId === target.id).length === 0 ? (
                <p className="mt-2 text-xs text-slate-500">No report is filed against this account.</p>
              ) : (
                <ul className="mt-2 space-y-2">
                  {reports
                    .filter((report) => report.targetMemberId === target.id)
                    .map((report) => (
                      <li key={report.id}>
                        <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-slate-200 bg-canvas p-3">
                          <input
                            type="checkbox"
                            className="mt-0.5 h-4 w-4 accent-admin-600"
                            checked={linkedReports.includes(report.id)}
                            onChange={(event) => setLinkedReports((current) => (event.target.checked ? [...current, report.id] : current.filter((id) => id !== report.id)))}
                          />
                          <span className="text-sm leading-6 text-slate-600">
                            <span className="font-bold text-slate-800">{report.category}</span> · {timeAgo(report.createdAt)} · {report.proof.length} proof file(s)
                          </span>
                        </label>
                      </li>
                    ))}
                </ul>
              )}
            </div>
          </div>
        )}
      </AdminModal>

      <AdminModal
        open={Boolean(lifting)}
        onClose={() => setLiftId('')}
        title="Lift this suspension"
        description="The account gets portal access back. The original reason and proof stay on record."
        footer={
          <>
            <ActionButton variant="ghost" onClick={() => setLiftId('')}>
              Cancel
            </ActionButton>
            <ActionButton
              variant="emerald"
              onClick={() => {
                if (!lifting) return
                if (liftNote.trim().length < 10) {
                  toast.error('Write why the suspension is being lifted (at least 10 characters).')
                  return
                }
                liftSuspension(lifting.id, liftNote.trim())
                toast.success('Suspension lifted. The account can use the portal again.')
                setLiftId('')
                setLiftNote('')
              }}
            >
              Confirm lift
            </ActionButton>
          </>
        }
      >
        {lifting && (
          <div className="space-y-4">
            <div className="rounded-xl border border-slate-200/80 bg-canvas p-4">
              <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400">Original reason</p>
              <p className="mt-1.5 text-sm leading-6 text-slate-700">{lifting.reason}</p>
            </div>
            <label className="block">
              <span className="text-xs font-bold uppercase tracking-wide text-slate-500">Why is it being lifted</span>
              <textarea
                className={`${inputClass} mt-2 min-h-[100px] resize-y`}
                value={liftNote}
                onChange={(event) => setLiftNote(event.target.value)}
                placeholder="Example: warning issued, the family confirmed the demand note was a miscommunication, and the account cleared a re-verification call."
              />
            </label>
          </div>
        )}
      </AdminModal>
    </div>
  )
}

export default SuspensionsPage
