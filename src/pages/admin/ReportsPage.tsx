import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import AdminModal from '../../components/admin/AdminModal'
import { ActionButton, ConsoleStat, DetailRow, Pill, SectionCard } from '../../components/admin/AdminUi'
import { filterChipClass } from '../../components/admin/adminStyles'
import { inputClass } from '../../components/common/formStyles'
import { scopedReports, setReportStatus, timeAgo, useAdminConsole, type ReportStatus } from '../../data/admin'
import { useCurrentAdmin } from '../../data/session'

const statusTone: Record<ReportStatus, 'rose' | 'amber' | 'emerald'> = {
  open: 'rose',
  reviewing: 'amber',
  closed: 'emerald',
}
const statusLabel: Record<ReportStatus, string> = {
  open: 'New',
  reviewing: 'Under review',
  closed: 'Closed',
}

function ReportsPage() {
  const state = useAdminConsole()
  const admin = useCurrentAdmin()
  const navigate = useNavigate()
  const [filter, setFilter] = useState<'all' | ReportStatus>('all')
  const [openId, setOpenId] = useState('')
  const [resolution, setResolution] = useState('')
  const [nextStatus, setNextStatus] = useState<ReportStatus>('reviewing')

  if (!admin) return null

  const reports = scopedReports(state, admin)
  const list = reports.filter((report) => filter === 'all' || report.status === filter)
  const selected = reports.find((report) => report.id === openId)
  const proofCount = reports.reduce((sum, report) => sum + report.proof.length, 0)

  const saveReport = () => {
    if (!selected) return
    if (resolution.trim().length < 5) {
      toast.error('Write what action was taken on this report.')
      return
    }
    setReportStatus(selected.id, nextStatus, resolution.trim())
    toast.success('Report updated.')
    setOpenId('')
    setResolution('')
  }

  const filters: { key: 'all' | ReportStatus; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'open', label: 'New' },
    { key: 'reviewing', label: 'Under review' },
    { key: 'closed', label: 'Closed' },
  ]

  return (
    <div className="space-y-5 sm:space-y-6">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <ConsoleStat label="Total Reports" value={String(reports.length)} detail="Against the accounts you verified" tone="admin" />
        <ConsoleStat label="New" value={String(reports.filter((item) => item.status === 'open').length)} detail="No action taken yet" tone="rose" />
        <ConsoleStat label="Closed" value={String(reports.filter((item) => item.status === 'closed').length)} detail="Action finished" tone="emerald" />
        <ConsoleStat label="Proof Files" value={String(proofCount)} detail="Screenshots and documents" />
      </div>

      <div className="flex flex-wrap gap-2">
        {filters.map((item) => (
          <button key={item.key} type="button" onClick={() => setFilter(item.key)} className={filterChipClass(filter === item.key)}>
            {item.label}
          </button>
        ))}
      </div>

      <SectionCard title="Reported accounts" subtitle="Open a report to read the complaint, check the proof, then close it or suspend the account.">
        {list.length === 0 ? (
          <p className="text-sm text-slate-500">No report in this filter.</p>
        ) : (
          <ul className="space-y-2">
            {list
              .slice()
              .sort((a, b) => b.createdAt - a.createdAt)
              .map((report) => (
                <li key={report.id} className="rounded-lg border border-slate-200/80 bg-canvas p-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-display text-sm font-extrabold text-slate-900">{report.targetName}</h3>
                        <Pill tone={statusTone[report.status]}>{statusLabel[report.status]}</Pill>
                        <Pill tone="slate">{report.targetRole}</Pill>
                      </div>
                      <p className="mt-1 text-xs font-bold text-slate-600">{report.category}</p>
                      <p className="mt-0.5 text-xs text-slate-500">
                        Case {report.caseRef} · by {report.reportedByName} ({report.reporterContact}) · {timeAgo(report.createdAt)}
                      </p>
                      <p className="mt-1.5 line-clamp-2 text-sm leading-6 text-slate-600">{report.details}</p>
                    </div>
                    <ActionButton
                      variant="ghost"
                      onClick={() => {
                        setOpenId(report.id)
                        setNextStatus(report.status === 'open' ? 'reviewing' : 'closed')
                        setResolution(report.resolution)
                      }}
                      className="w-full sm:w-auto"
                    >
                      Open
                    </ActionButton>
                  </div>
                </li>
              ))}
          </ul>
        )}
      </SectionCard>

      <AdminModal
        open={Boolean(selected)}
        onClose={() => setOpenId('')}
        title={selected ? `Report on ${selected.targetName}` : ''}
        description="Read the complaint and the proof before taking any action."
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
              <ActionButton onClick={saveReport}>Save action</ActionButton>
            </>
          ) : null
        }
      >
        {selected && (
          <div className="space-y-5">
            <dl className="space-y-3 rounded-xl border border-slate-200/80 bg-canvas p-4">
              <DetailRow label="Reported account" value={`${selected.targetName} (${selected.targetRole})`} />
              <DetailRow label="Case" value={selected.caseRef} />
              <DetailRow label="Category" value={selected.category} />
              <DetailRow label="Reported by" value={`${selected.reportedByName} · ${selected.reporterContact}`} />
              <DetailRow label="Filed" value={timeAgo(selected.createdAt)} />
              <DetailRow label="Status" value={statusLabel[selected.status]} />
            </dl>

            <div>
              <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400">What was reported</p>
              <p className="mt-1.5 text-sm leading-6 text-slate-700">{selected.details}</p>
            </div>

            <div>
              <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400">Proof from the reporter</p>
              {selected.proof.length === 0 ? (
                <p className="mt-2 rounded-lg bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-700 dark:bg-amber-950/30 dark:text-amber-300">
                  No proof attached. Ask the family for a screenshot before suspending anyone.
                </p>
              ) : (
                <ul className="mt-2 flex flex-wrap gap-2">
                  {selected.proof.map((file) => (
                    <li key={file} className="rounded-full border border-slate-200 bg-canvas px-3 py-1.5 text-xs font-semibold text-slate-600">
                      {file}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="rounded-xl border border-slate-200/80 bg-canvas p-4">
              <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Take action</p>
              <div className="mt-2 grid gap-2 sm:flex sm:flex-wrap">
                {(['reviewing', 'closed'] as const).map((item) => (
                  <button key={item} type="button" onClick={() => setNextStatus(item)} className={filterChipClass(nextStatus === item)}>
                    {item === 'reviewing' ? 'Mark under review' : 'Mark resolved'}
                  </button>
                ))}
              </div>
              <textarea
                className={`${inputClass} mt-3 min-h-[90px] resize-y`}
                value={resolution}
                onChange={(event) => setResolution(event.target.value)}
                placeholder="What did you do? Called the station, warned the account, or passed it to the suspension tab."
              />
              {selected.resolution && <p className="mt-2 text-xs leading-5 text-slate-500">Previous note: {selected.resolution}</p>}
            </div>
          </div>
        )}
      </AdminModal>
    </div>
  )
}

export default ReportsPage
