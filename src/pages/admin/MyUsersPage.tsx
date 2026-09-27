import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import AdminModal from '../../components/admin/AdminModal'
import { ActionButton, ConsoleStat, DetailRow, Pill, SectionCard } from '../../components/admin/AdminUi'
import { filterChipClass } from '../../components/admin/adminStyles'
import { inputClass } from '../../components/common/formStyles'
import {
  formatSlot,
  isMemberSuspended,
  scopedCases,
  scopedMembers,
  scopedReports,
  setCaseOutcome,
  tallyCases,
  timeAgo,
  useAdminConsole,
  type CaseOutcome,
} from '../../data/admin'
import { useCurrentAdmin } from '../../data/session'

const outcomeTone: Record<CaseOutcome, 'emerald' | 'rose' | 'amber'> = {
  found: 'emerald',
  'not-found': 'rose',
  open: 'amber',
}
const outcomeLabel: Record<CaseOutcome, string> = {
  found: 'Found',
  'not-found': 'Not found',
  open: 'Still searching',
}

function MyUsersPage() {
  const state = useAdminConsole()
  const admin = useCurrentAdmin()
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [role, setRole] = useState<'all' | 'police' | 'ngo'>('all')
  const [openId, setOpenId] = useState('')
  const [outcomeCase, setOutcomeCase] = useState('')
  const [outcome, setOutcome] = useState<CaseOutcome>('found')
  const [outcomeNote, setOutcomeNote] = useState('')
  const [foundDays, setFoundDays] = useState('5')

  if (!admin) return null

  const members = scopedMembers(state, admin)
  const cases = scopedCases(state, admin)

  const verified = members.filter((member) => member.status === 'verified')
  const rejected = members.filter((member) => member.status === 'rejected')
  const filtered = verified.filter((member) => {
    const matchesRole = role === 'all' || member.role === role
    const needle = query.trim().toLowerCase()
    const matchesQuery =
      needle === '' ||
      member.name.toLowerCase().includes(needle) ||
      member.organisation.toLowerCase().includes(needle) ||
      member.state.toLowerCase().includes(needle)
    return matchesRole && matchesQuery
  })

  const selected = members.find((member) => member.id === openId)
  const selectedCases = selected ? cases.filter((item) => item.memberId === selected.id) : []
  const selectedReports = selected ? scopedReports(state, admin).filter((report) => report.targetMemberId === selected.id) : []
  const selectedTally = tallyCases(selectedCases)
  const overall = tallyCases(cases)
  const editingCase = state.cases.find((item) => item.id === outcomeCase)

  return (
    <div className="space-y-5 sm:space-y-6">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <ConsoleStat label="Verified Users" value={String(verified.length)} detail="Verified by you" tone="admin" />
        <ConsoleStat label="Their Cases" value={String(overall.total)} detail="Every complaint they registered" />
        <ConsoleStat label="Found" value={String(overall.found)} detail="Person identified and handed over" tone="emerald" />
        <ConsoleStat label="Not Found" value={String(overall.notFound)} detail={`${overall.open} still searching`} tone="rose" />
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <input className={`${inputClass} w-full sm:max-w-xs`} value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search name, organisation, state..." />
        <div className="flex flex-wrap gap-2">
          {(['all', 'police', 'ngo'] as const).map((item) => (
            <button key={item} type="button" onClick={() => setRole(item)} className={`${filterChipClass(role === item)} flex-1 sm:flex-none`}>
              {item === 'all' ? 'All' : item === 'police' ? 'Police' : 'NGO'}
            </button>
          ))}
        </div>
      </div>

      <SectionCard title="My users" subtitle="Click any user to see the full record, all their cases and every report against them.">
        {filtered.length === 0 ? (
          <p className="text-sm text-slate-500">No verified account matches this search.</p>
        ) : (
          <ul className="space-y-2">
            {filtered.map((member) => {
              const row = tallyCases(cases.filter((item) => item.memberId === member.id))
              const suspended = isMemberSuspended(state, member.id)
              return (
                <li key={member.id}>
                  <button
                    type="button"
                    onClick={() => setOpenId(member.id)}
                    className="w-full rounded-lg border border-slate-200/80 bg-canvas p-4 text-left transition hover:border-admin-400"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-display text-sm font-extrabold text-slate-900">{member.name}</h3>
                          <Pill tone={member.role === 'police' ? 'admin' : 'amber'}>{member.role === 'police' ? 'Police' : 'NGO'}</Pill>
                          {suspended ? <Pill tone="rose">Suspended</Pill> : <Pill tone="emerald">Active</Pill>}
                        </div>
                        <p className="mt-1 text-xs text-slate-500">
                          {member.roleLabel} · {member.organisation} · {member.state || 'State not given'}
                        </p>
                        <p className="mt-0.5 text-xs text-slate-400">
                          {member.identifier} · verified {timeAgo(member.verifiedAt)}
                        </p>
                      </div>
                      <div className="flex flex-wrap items-center gap-1.5 text-[11px] font-bold">
                        <Pill tone="slate">{row.total} cases</Pill>
                        <Pill tone="emerald">{row.found} found</Pill>
                        <Pill tone="rose">{row.notFound} not found</Pill>
                        {row.open > 0 && <Pill tone="amber">{row.open} open</Pill>}
                      </div>
                    </div>
                  </button>
                </li>
              )
            })}
          </ul>
        )}
      </SectionCard>

      {rejected.length > 0 && (
        <SectionCard title="Rejected" subtitle="Kept so you can compare if the same person registers again.">
          <ul className="space-y-2">
            {rejected.map((member) => (
              <li key={member.id} className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 dark:border-rose-400/30 dark:bg-rose-950/20">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-sm font-bold text-slate-900">{member.name}</p>
                  <Pill tone="rose">{member.role === 'police' ? 'Police' : 'NGO'}</Pill>
                </div>
                <p className="mt-0.5 text-xs text-slate-500">{member.organisation}</p>
                <p className="mt-1 text-xs leading-5 text-slate-600">{member.rejectionReason}</p>
              </li>
            ))}
          </ul>
        </SectionCard>
      )}

      <AdminModal
        open={Boolean(selected)}
        onClose={() => setOpenId('')}
        title={selected ? selected.name : ''}
        description={selected ? `${selected.roleLabel} · ${selected.organisation}` : ''}
        footer={
          selected ? (
            <>
              <ActionButton variant="ghost" onClick={() => setOpenId('')}>
                Close
              </ActionButton>
              <ActionButton
                variant="rose"
                onClick={() => {
                  setOpenId('')
                  navigate('/admin/suspensions')
                }}
              >
                Suspend account
              </ActionButton>
            </>
          ) : null
        }
      >
        {selected && (
          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {[
                ['Cases', String(selectedTally.total)],
                ['Found', String(selectedTally.found)],
                ['Not found', String(selectedTally.notFound)],
                ['Recovery', selectedTally.total === 0 ? '—' : `${selectedTally.successRate}%`],
              ].map(([label, value]) => (
                <div key={label} className="rounded-lg border border-slate-200/80 bg-canvas px-3 py-2.5 text-center">
                  <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">{label}</p>
                  <p className="mt-0.5 font-display text-lg font-extrabold tabular-nums text-slate-800">{value}</p>
                </div>
              ))}
            </div>

            <dl className="space-y-3 rounded-xl border border-slate-200/80 bg-canvas p-4">
              <DetailRow label="Identifier" value={selected.identifier} />
              <DetailRow label="State / Location" value={`${selected.state || '—'} · ${selected.location}`} />
              <DetailRow label="Mobile" value={selected.mobile || '—'} />
              <DetailRow label="Email" value={selected.email || '—'} />
              <DetailRow label="Verification call" value={selected.callLink ? `${selected.callLink} · ${formatSlot(selected.callTime)}` : 'No call recorded'} />
              <DetailRow label="Documents" value={selected.documents.length === 0 ? 'None' : selected.documents.join(', ')} />
            </dl>

            <div>
              <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400">All cases of this user</p>
              {selectedCases.length === 0 ? (
                <p className="mt-2 text-sm text-slate-500">This account has not registered any case yet.</p>
              ) : (
                <ul className="mt-2 space-y-2">
                  {selectedCases.map((item) => (
                    <li key={item.id} className="rounded-lg border border-slate-200/80 bg-canvas p-3.5">
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-slate-800">{item.missingPerson}</p>
                          <p className="text-xs text-slate-500">
                            {item.caseRef} · {item.city} · {item.firNumber}
                          </p>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Pill tone={outcomeTone[item.outcome]}>{outcomeLabel[item.outcome]}</Pill>
                          <button
                            type="button"
                            onClick={() => {
                              setOutcomeCase(item.id)
                              setOutcome(item.outcome === 'open' ? 'found' : item.outcome)
                              setOutcomeNote(item.outcome === 'open' ? '' : item.note)
                            }}
                            className="rounded-lg border border-slate-200 px-2.5 py-1.5 text-[11px] font-bold text-slate-600 hover:border-admin-400 hover:text-admin-700 dark:hover:border-admin-400 dark:hover:text-admin-300"
                          >
                            Update
                          </button>
                        </div>
                      </div>
                      <p className="mt-1.5 text-xs leading-5 text-slate-600">{item.note}</p>
                      <p className="mt-1 text-[11px] text-slate-400">
                        Opened {timeAgo(item.openedAt)}
                        {item.outcome === 'found' && item.foundDays > 0 ? ` · found in ${item.foundDays} days` : ''}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div>
              <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400">Reports against this user</p>
              {selectedReports.length === 0 ? (
                <p className="mt-2 text-sm text-slate-500">No report has been filed against this account.</p>
              ) : (
                <ul className="mt-2 space-y-2">
                  {selectedReports.map((report) => (
                    <li key={report.id} className="rounded-lg border border-slate-200/80 bg-canvas p-3.5">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <p className="text-sm font-bold text-slate-800">{report.category}</p>
                        <Pill tone={report.status === 'open' ? 'rose' : report.status === 'reviewing' ? 'amber' : 'emerald'}>
                          {report.status === 'open' ? 'New' : report.status === 'reviewing' ? 'Under review' : 'Closed'}
                        </Pill>
                      </div>
                      <p className="mt-1 text-xs text-slate-500">
                        By {report.reportedByName} · {timeAgo(report.createdAt)} · {report.proof.length} proof file(s)
                      </p>
                      <p className="mt-1.5 text-xs leading-5 text-slate-600">{report.details}</p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}
      </AdminModal>

      <AdminModal
        open={Boolean(editingCase)}
        onClose={() => setOutcomeCase('')}
        title="Update case result"
        description={editingCase ? `${editingCase.caseRef} · ${editingCase.missingPerson}` : ''}
        footer={
          <>
            <ActionButton variant="ghost" onClick={() => setOutcomeCase('')}>
              Cancel
            </ActionButton>
            <ActionButton
              onClick={() => {
                if (!editingCase) return
                if (outcomeNote.trim().length < 5) {
                  toast.error('Write a short note for the record.')
                  return
                }
                setCaseOutcome(editingCase.id, outcome, outcomeNote.trim(), Math.max(0, Number(foundDays) || 0))
                toast.success('Case result updated.')
                setOutcomeCase('')
                setOutcomeNote('')
              }}
            >
              Save
            </ActionButton>
          </>
        }
      >
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {(['found', 'not-found', 'open'] as const).map((item) => (
              <button key={item} type="button" onClick={() => setOutcome(item)} className={`${filterChipClass(outcome === item)} flex-1 sm:flex-none`}>
                {outcomeLabel[item]}
              </button>
            ))}
          </div>
          {outcome === 'found' && (
            <label className="block">
              <span className="text-xs font-bold uppercase tracking-wide text-slate-500">Days taken to find the person</span>
              <input className={`${inputClass} mt-2`} type="number" min={0} value={foundDays} onChange={(event) => setFoundDays(event.target.value)} />
            </label>
          )}
          <label className="block">
            <span className="text-xs font-bold uppercase tracking-wide text-slate-500">Note</span>
            <textarea
              className={`${inputClass} mt-2 min-h-[90px] resize-y`}
              value={outcomeNote}
              onChange={(event) => setOutcomeNote(event.target.value)}
              placeholder="Where the person was found and who took custody, or why the case could not be closed."
            />
          </label>
        </div>
      </AdminModal>
    </div>
  )
}

export default MyUsersPage
