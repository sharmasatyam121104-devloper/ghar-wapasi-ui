import { useEffect, useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import FilePreview from '../../components/common/FilePreview'
import { useMe } from '../../data/useMe'
import type { MeResult } from '../../api/auth'

function useCountdown(target: number) {
  const [now, setNow] = useState(() => Date.now())
  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 1000)
    return () => window.clearInterval(timer)
  }, [])
  return Math.max(0, target - now)
}

function formatRemaining(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000)
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}

function formatCallTime(value?: string): string {
  if (!value) return '—'
  const parsed = Date.parse(value)
  if (Number.isNaN(parsed)) return value
  return new Date(parsed).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })
}

const statusTheme: Record<string, { label: string; description: string; className: string }> = {
  pending: {
    label: 'Pending admin approval',
    description: 'Your registration has been received and is waiting for the admin to verify your service details.',
    className: 'border-amber-200 bg-amber-50 dark:border-amber-400/30 dark:bg-amber-950/30',
  },
  verified: {
    label: 'Verified',
    description: 'Your account is verified. The full police portal is now open for you.',
    className: 'border-emerald-200 bg-emerald-50 dark:border-emerald-400/30 dark:bg-emerald-950/30',
  },
  rejected: {
    label: 'Rejected',
    description: 'The admin could not verify your details. Please review your information and update your registration.',
    className: 'border-rose-200 bg-rose-50 dark:border-rose-400/30 dark:bg-rose-950/30',
  },
}

function StatusContent({ me }: { me: MeResult }) {
  const status = me.verification_status ?? me.user.verification_status
  const theme = statusTheme[status] ?? statusTheme.pending
  const endsAt = me.update_window_ends_at ? Date.parse(me.update_window_ends_at) : 0
  const remaining = useCountdown(endsAt)
  const withinWindow = endsAt > 0 && remaining > 0
  const call = me.verification_call
  const police = me.police ?? {}
  const documents = [...(police.id_card_files ?? []), ...(police.appointment_proof_files ?? [])]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">Registration Status</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
          Track your police account verification. You can edit your registration while the edit window is open.
        </p>
      </div>

      <div className={`rounded-2xl border p-5 sm:p-6 ${theme.className}`}>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">Status</p>
            <h2 className="mt-1 font-display text-xl font-extrabold tracking-tight text-slate-900">{theme.label}</h2>
            <p className="mt-1 max-w-xl text-sm leading-6 text-slate-600">{theme.description}</p>
          </div>
          <span className="inline-flex items-center gap-2 rounded-full bg-surface px-3 py-1.5 text-xs font-bold text-slate-700 shadow-sm">
            <span className={`h-2 w-2 rounded-full ${status === 'verified' ? 'bg-emerald-500' : status === 'pending' ? 'bg-amber-500' : 'bg-rose-500'}`} />
            {me.user.name || 'Police officer'}
          </span>
        </div>

        <dl className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {[
            ['Rank', police.rank || '—'],
            ['Badge No.', police.badge_number || '—'],
            ['Station', police.station_name || '—'],
            ['District / State', `${police.district || '—'} · ${police.state || '—'}`],
            ['Official Email', police.official_email || me.user.email || '—'],
            ['Mobile', me.user.mobile || '—'],
          ].map(([label, value]) => (
            <div key={label} className="rounded-xl bg-surface/70 px-4 py-3">
              <dt className="text-[11px] font-bold uppercase tracking-wide text-slate-400">{label}</dt>
              <dd className="mt-0.5 truncate text-sm font-semibold text-slate-800">{value}</dd>
            </div>
          ))}
        </dl>

        {status === 'rejected' && me.rejection_reason && (
          <div className="mt-5 rounded-xl bg-surface/70 px-4 py-3">
            <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400">Reason from the admin</p>
            <p className="mt-1 text-sm leading-6 font-semibold text-slate-800">{me.rejection_reason}</p>
          </div>
        )}

        {status === 'pending' && (
          <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-xl bg-surface/70 px-4 py-3">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400">Editable window closes in</p>
              <p className="mt-0.5 font-mono text-lg font-extrabold tabular-nums text-slate-900">{withinWindow ? formatRemaining(remaining) : 'Expired'}</p>
            </div>
            {withinWindow ? (
              <Link to="/police/edit" className="rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-brand-700">
                Update Registration
              </Link>
            ) : (
              <span className="text-xs font-semibold text-slate-500">Update window closed. Contact the admin if a correction is needed.</span>
            )}
          </div>
        )}

        <div className="mt-5 flex flex-wrap gap-2">
          {status === 'verified' && (
            <Link to="/police/dashboard" className="rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-brand-700">
              Open Police Portal
            </Link>
          )}
          {status === 'rejected' && me.can_edit !== false && (
            <Link to="/police/edit" className="rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-brand-700">
              Update &amp; Resubmit
            </Link>
          )}
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200/80 bg-surface p-5 shadow-[0_8px_24px_rgba(15,23,42,0.05)] sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <h3 className="font-display text-lg font-extrabold tracking-tight text-slate-900">Verification video call with the admin</h3>
          {call?.link ? (
            <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">Scheduled by admin</span>
          ) : (
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-500 dark:bg-slate-800">Not scheduled yet</span>
          )}
        </div>
        <p className="mt-1 text-sm leading-6 text-slate-500">
          The admin schedules this call to verify your police ID and service documents. You only need to join the call — no action required from you.
        </p>
        {call?.link ? (
          <dl className="mt-4 space-y-3">
            <div className="grid grid-cols-1 gap-1 sm:grid-cols-[160px_1fr] sm:gap-3">
              <dt className="text-xs font-bold uppercase tracking-wide text-slate-400">Video call link</dt>
              <dd>
                <a className="break-all text-sm font-semibold text-brand-700 underline decoration-brand-300 underline-offset-2 dark:text-brand-300" href={call.link} target="_blank" rel="noreferrer">
                  {call.link}
                </a>
              </dd>
            </div>
            <div className="grid grid-cols-1 gap-1 sm:grid-cols-[160px_1fr] sm:gap-3">
              <dt className="text-xs font-bold uppercase tracking-wide text-slate-400">Date &amp; Time</dt>
              <dd className="text-sm font-semibold text-slate-800">{formatCallTime(call.time)}</dd>
            </div>
            <div className="grid grid-cols-1 gap-1 sm:grid-cols-[160px_1fr] sm:gap-3">
              <dt className="text-xs font-bold uppercase tracking-wide text-slate-400">Note</dt>
              <dd className="text-sm font-semibold text-slate-800">{call.note || '—'}</dd>
            </div>
          </dl>
        ) : (
          <p className="mt-4 rounded-xl bg-canvas px-4 py-3 text-sm leading-6 text-slate-500">
            No verification call scheduled yet. The admin will schedule a link and time, and it will appear here.
          </p>
        )}
      </div>

      {documents.length > 0 && (
        <div className="rounded-2xl border border-slate-200/80 bg-surface p-5 shadow-[0_8px_24px_rgba(15,23,42,0.05)] sm:p-6">
          <h3 className="font-display text-lg font-extrabold tracking-tight text-slate-900">Documents you submitted</h3>
          <p className="mt-1 text-sm leading-6 text-slate-500">Only you and the reviewing admin can open these files.</p>
          <div className="mt-4 flex flex-wrap gap-3">
            {documents.map((doc) => (
              <FilePreview key={doc} path={doc} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function PoliceStatusPage() {
  const { me, loading, error } = useMe()

  if (loading) {
    return <p className="text-sm font-semibold text-slate-500">Loading your registration status…</p>
  }
  if (error || !me) {
    return <Navigate to="/police/register" replace />
  }
  return <StatusContent key={me.user.id} me={me} />
}

export default PoliceStatusPage
