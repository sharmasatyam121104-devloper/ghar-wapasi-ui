import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import AdminModal from '../../components/admin/AdminModal'
import { ActionButton, ConsoleStat, DetailRow, Pill, SectionCard } from '../../components/admin/AdminUi'
import { filterChipClass } from '../../components/admin/adminStyles'
import { inputClass } from '../../components/common/formStyles'
import { errorMessage, ApiError } from '../../api/client'
import {
  approveRequest,
  clearCall,
  listRequests,
  rejectRequest,
  scheduleCall,
  toAdminMember,
  type VerificationRecord,
  type VerificationStatus,
} from '../../api/verification'
import { buildCallTime, callSlots, formatSlot, timeAgo, todayIso, type AdminMember } from '../../data/admin'
import { useCurrentAdmin } from '../../data/session'

type Filter = VerificationStatus

const ZERO_COUNTS: Record<Filter, number> = { pending: 0, verified: 0, rejected: 0 }

function nowMs() {
  return Date.now()
}

function VerificationRequestsPage() {
  const admin = useCurrentAdmin()
  const [filter, setFilter] = useState<Filter>('pending')
  const [openId, setOpenId] = useState('')
  const [link, setLink] = useState('')
  const [date, setDate] = useState(todayIso())
  const [slot, setSlot] = useState(callSlots[1].value)
  const [note, setNote] = useState('')
  const [rejecting, setRejecting] = useState(false)
  const [rejectReason, setRejectReason] = useState('')
  const [records, setRecords] = useState<AdminMember[]>([])
  const [counts, setCounts] = useState<Record<Filter, number>>(ZERO_COUNTS)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    let alive = true
    void (async () => {
      try {
        const [pending, verified, rejected] = await Promise.all([
          listRequests('pending'),
          listRequests('verified'),
          listRequests('rejected'),
        ])
        if (!alive) return
        setCounts({ pending: pending.total, verified: verified.total, rejected: rejected.total })
        setRecords([...pending.users, ...verified.users, ...rejected.users].map(toAdminMember))
      } catch (error) {
        if (!alive) return
        setRecords([])
        setCounts(ZERO_COUNTS)
        toast.error(errorMessage(error))
      } finally {
        if (alive) setLoading(false)
      }
    })()
    return () => {
      alive = false
    }
  }, [])

  if (!admin) return null

  const list = records.filter((member) => member.status === filter)
  const selected = records.find((member) => member.id === openId)

  const applyUpdate = (previous: AdminMember, record: VerificationRecord) => {
    const next = toAdminMember(record)
    setRecords((items) => items.map((item) => (item.id === next.id ? next : item)))
    if (next.status !== previous.status) {
      setCounts((current) => ({
        ...current,
        [previous.status]: Math.max(0, current[previous.status] - 1),
        [next.status]: current[next.status] + 1,
      }))
    }
  }

  const saveCall = async () => {
    if (!selected || saving) return
    if (!link.trim()) {
      toast.error('You have to give the meeting link yourself.')
      return
    }
    if (!/^https?:\/\/\S+$/i.test(link.trim())) {
      toast.error('Meeting link must start with http:// or https://')
      return
    }
    if (!date) {
      toast.error('Pick the date of the call.')
      return
    }
    const when = new Date(buildCallTime(date, slot))
    if (Number.isNaN(when.getTime())) {
      toast.error('That date and time slot could not be read.')
      return
    }
    if (when.getTime() < nowMs()) {
      toast.error('Pick a future date and time for the call.')
      return
    }
    setSaving(true)
    try {
      const updated = await scheduleCall(selected.id, {
        link: link.trim(),
        time: buildCallTime(date, slot),
        note: note.trim(),
      })
      applyUpdate(selected, updated)
      toast.success('Video call scheduled. The user can now see the link and time you set.')
      setLink('')
      setNote('')
    } catch (error) {
      toast.error(errorMessage(error))
    } finally {
      setSaving(false)
    }
  }

  const removeCall = async () => {
    if (!selected || saving) return
    setSaving(true)
    try {
      const updated = await clearCall(selected.id)
      applyUpdate(selected, updated)
      toast.success('Call removed from the user\'s page.')
    } catch (error) {
      toast.error(errorMessage(error))
    } finally {
      setSaving(false)
    }
  }

  const verifyMember = async (member: AdminMember) => {
    if (saving) return
    if (!member.callLink || !member.callTime) {
      toast.error('Give the meeting link and time first - the user never picks their own slot.')
      setOpenId(member.id)
      return
    }
    setSaving(true)
    try {
      const updated = await approveRequest(member.id)
      applyUpdate(member, updated)
      toast.success(`${member.name} verified.`)
    } catch (error) {
      if (error instanceof ApiError && (error.status === 422 || error.status === 409)) {
        toast.error(error.message)
        setOpenId(member.id)
      } else {
        toast.error(errorMessage(error))
      }
    } finally {
      setSaving(false)
    }
  }

  const confirmRejection = async () => {
    if (!selected || saving) return
    if (rejectReason.trim().length < 10) {
      toast.error('Write a clear reason of at least 10 characters.')
      return
    }
    setSaving(true)
    try {
      const updated = await rejectRequest(selected.id, rejectReason.trim())
      applyUpdate(selected, updated)
      setRejecting(false)
      setRejectReason('')
      toast.success('Request rejected with a written reason.')
    } catch (error) {
      toast.error(errorMessage(error))
    } finally {
      setSaving(false)
    }
  }

  const tabs: { key: Filter; label: string; count: number }[] = [
    { key: 'pending', label: 'Pending', count: counts.pending },
    { key: 'verified', label: 'Verified', count: counts.verified },
    { key: 'rejected', label: 'Rejected', count: counts.rejected },
  ]

  return (
    <div className="space-y-5 sm:space-y-6">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <ConsoleStat label="Pending" value={String(counts.pending)} detail="Waiting for a call and a decision" tone="amber" />
        <ConsoleStat label="Verified" value={String(counts.verified)} detail="Verified by you" tone="emerald" />
        <ConsoleStat label="Rejected" value={String(counts.rejected)} detail="Not verified, can be resubmitted" tone="rose" />
      </div>

      <div className="flex flex-wrap gap-2">
        {tabs.map((tab) => (
          <button key={tab.key} type="button" onClick={() => setFilter(tab.key)} className={filterChipClass(filter === tab.key)}>
            {tab.label} <span className="tabular-nums opacity-70">({tab.count})</span>
          </button>
        ))}
      </div>

      <SectionCard title={filter === 'pending' ? 'Pending requests' : filter === 'verified' ? 'Verified accounts' : 'Rejected requests'} subtitle="Open one to read the full form and schedule the verification video call.">
        {loading ? (
          <p className="text-sm text-slate-500">Loading requests…</p>
        ) : list.length === 0 ? (
          <p className="text-sm text-slate-500">Nothing in this list.</p>
        ) : (
          <ul className="space-y-2">
            {list
              .slice()
              .sort((a, b) => b.submittedAt - a.submittedAt)
              .map((member) => (
                <li key={member.id} className="rounded-lg border border-slate-200/80 bg-canvas p-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-display text-sm font-extrabold text-slate-900">{member.name}</h3>
                        <Pill tone={member.role === 'police' ? 'admin' : 'amber'}>{member.role === 'police' ? 'Police' : 'NGO'}</Pill>
                        <Pill tone={member.callLink && member.callTime ? 'emerald' : 'slate'}>
                          {member.callLink && member.callTime ? 'Call sent' : 'No call'}
                        </Pill>
                      </div>
                      <p className="mt-1 text-xs text-slate-500">
                        {member.roleLabel} · {member.organisation} · {member.state || 'State not given'}
                      </p>
                      <p className="mt-0.5 text-xs text-slate-400">
                        {member.identifier} · applied {timeAgo(member.submittedAt)}
                      </p>
                    </div>
                    <div className="flex w-full flex-wrap gap-2 sm:w-auto">
                      <ActionButton variant="ghost" onClick={() => setOpenId(member.id)} className="flex-1 sm:flex-none">
                        Review
                      </ActionButton>
                      {member.status === 'pending' && (
                        <ActionButton variant="emerald" onClick={() => void verifyMember(member)} disabled={saving} className="flex-1 sm:flex-none">
                          Approve
                        </ActionButton>
                      )}
                    </div>
                  </div>
                  {member.callLink && member.callTime && (
                    <p className="mt-2 break-all rounded-lg bg-surface px-3 py-2 text-xs font-semibold text-admin-700 dark:text-admin-300">
                      {member.callLink} · {formatSlot(member.callTime)}
                    </p>
                  )}
                  {member.status === 'rejected' && member.rejectionReason && (
                    <p className="mt-2 rounded-lg bg-rose-50 px-3 py-2 text-xs leading-5 text-rose-700 dark:bg-rose-950/30 dark:text-rose-300">Rejected: {member.rejectionReason}</p>
                  )}
                </li>
              ))}
          </ul>
        )}
      </SectionCard>

      <AdminModal
        open={Boolean(selected)}
        onClose={() => {
          setOpenId('')
          setRejecting(false)
          setRejectReason('')
        }}
        title={selected ? `${selected.name} · ${selected.role === 'police' ? 'Police' : 'NGO'}` : ''}
        description="Check every field against the uploaded documents before you approve."
        footer={
          selected ? (
            <>
              <ActionButton variant="ghost" onClick={() => setOpenId('')}>
                Close
              </ActionButton>
              {selected.status === 'pending' && (
                <>
                  <ActionButton
                    variant="rose"
                    onClick={() => {
                      setRejecting(true)
                      setRejectReason('')
                    }}
                  >
                    Reject
                  </ActionButton>
                  <ActionButton
                    variant="emerald"
                    onClick={() => {
                      void verifyMember(selected).then(() => setOpenId(''))
                    }}
                    disabled={saving}
                    className="sm:w-auto"
                  >
                    Approve account
                  </ActionButton>
                </>
              )}
            </>
          ) : null
        }
      >
        {selected && (
          <div className="space-y-5">
            <dl className="space-y-3 rounded-xl border border-slate-200/80 bg-canvas p-4">
              <DetailRow label="Organisation" value={selected.organisation} />
              <DetailRow label="Role" value={selected.roleLabel} />
              <DetailRow label="Identifier" value={selected.identifier} />
              <DetailRow label="State" value={selected.state || 'Not provided'} />
              <DetailRow label="Location" value={selected.location} />
              <DetailRow label="Mobile" value={selected.mobile || '—'} />
              <DetailRow label="Email" value={selected.email || '—'} />
              <DetailRow label="Applied" value={timeAgo(selected.submittedAt)} />
            </dl>

            <div>
              <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400">Documents submitted</p>
              {selected.documents.length === 0 ? (
                <p className="mt-2 text-sm text-slate-500">No document was uploaded with this request.</p>
              ) : (
                <ul className="mt-2 flex flex-wrap gap-2">
                  {selected.documents.map((doc) => (
                    <li key={doc} className="rounded-full border border-slate-200 bg-canvas px-3 py-1.5 text-xs font-semibold text-slate-600">
                      {doc}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="rounded-xl border border-admin-200 bg-admin-50 p-4 dark:border-admin-400/30 dark:bg-admin-950/30">
              <p className="text-xs font-bold uppercase tracking-wide text-admin-700 dark:text-admin-300">Meeting link &amp; time — you provide both</p>
              <p className="mt-1 text-xs leading-5 text-slate-600">
                The user never picks a slot and never creates the link. You give the meeting link and the time, and it appears on their status page. Approval stays locked
                until a call is scheduled.
              </p>
              {selected.callLink ? (
                <div className="mt-3 rounded-lg bg-surface px-3 py-2.5">
                  <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">Already sent to the user</p>
                  <p className="mt-0.5 break-all text-xs font-semibold text-admin-700 dark:text-admin-300">{selected.callLink}</p>
                  <p className="mt-0.5 text-xs font-semibold text-slate-600">{formatSlot(selected.callTime)}</p>
                </div>
              ) : (
                <p className="mt-3 rounded-lg bg-surface px-3 py-2 text-xs font-semibold text-amber-700 dark:text-amber-300">No call scheduled yet.</p>
              )}
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <input className={inputClass} value={link} onChange={(event) => setLink(event.target.value)} placeholder="https://meet.google.com/..." />
                <input className={inputClass} type="date" min={todayIso()} value={date} onChange={(event) => setDate(event.target.value)} />
                <select className={inputClass} value={slot} onChange={(event) => setSlot(event.target.value)}>
                  {callSlots.map((item) => (
                    <option key={item.value} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </select>
                <input className={inputClass} value={note} onChange={(event) => setNote(event.target.value)} placeholder="Note for the user (optional)" />
              </div>
              <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
                <ActionButton onClick={() => void saveCall()} disabled={saving} className="sm:w-auto">
                  {selected.callLink ? 'Update schedule' : 'Schedule call'}
                </ActionButton>
                {selected.callLink && (
                  <ActionButton variant="ghost" onClick={() => void removeCall()} disabled={saving} className="sm:w-auto">
                    Clear
                  </ActionButton>
                )}
              </div>
            </div>

            {rejecting && (
              <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 dark:border-rose-400/30 dark:bg-rose-950/20">
                <p className="text-xs font-bold uppercase tracking-wide text-rose-700 dark:text-rose-300">Reason for rejection</p>
                <textarea
                  className={`${inputClass} mt-2 min-h-[80px] resize-y`}
                  value={rejectReason}
                  onChange={(event) => setRejectReason(event.target.value)}
                  placeholder="Which field could not be verified? The user sees this message."
                />
                <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
                  <ActionButton variant="rose" onClick={() => void confirmRejection()} disabled={saving} className="sm:w-auto">
                    Confirm rejection
                  </ActionButton>
                  <ActionButton variant="ghost" onClick={() => setRejecting(false)} className="sm:w-auto">
                    Cancel
                  </ActionButton>
                </div>
              </div>
            )}
          </div>
        )}
      </AdminModal>
    </div>
  )
}

export default VerificationRequestsPage
