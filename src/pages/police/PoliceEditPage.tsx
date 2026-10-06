import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { Field, TextInput } from '../../components/common/FormControls'
import { ApiError } from '../../api/client'
import { updatePoliceRequest, type MeResult } from '../../api/auth'
import { useMe } from '../../data/useMe'

function ReadRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-1 gap-1 py-2 sm:grid-cols-[180px_1fr] sm:gap-3">
      <dt className="text-xs font-semibold text-slate-400">{label}</dt>
      <dd className="text-xs font-semibold text-slate-700">{value || '—'}</dd>
    </div>
  )
}

function EditForm({ me, reload }: { me: MeResult; reload: () => void }) {
  const navigate = useNavigate()
  const police = me.police ?? {}

  const [fullName, setFullName] = useState(me.user.name)
  const [district, setDistrict] = useState(police.district ?? '')
  const [contact, setContact] = useState(police.reporting_officer_contact ?? '')
  const [busy, setBusy] = useState(false)
  const [errors, setErrors] = useState<string[]>([])

  const canEdit = me.can_edit !== false

  const save = async () => {
    const [first, ...rest] = fullName.trim().split(/\s+/).filter(Boolean)
    if (!first || rest.length === 0) {
      setErrors(['Enter your full name (first and last name).'])
      return
    }

    const changes: Record<string, unknown> = {}
    if (first !== me.user.first_name) changes.first_name = first
    if (rest.join(' ') !== me.user.last_name) changes.last_name = rest.join(' ')

    const profile: Record<string, unknown> = {}
    const nextDistrict = district.trim()
    if (nextDistrict !== (police.district ?? '')) profile.district = nextDistrict
    const nextContact = contact.trim()
    if (nextContact !== (police.reporting_officer_contact ?? '')) profile.reporting_officer_contact = nextContact
    if (Object.keys(profile).length > 0) changes.police = profile

    if (Object.keys(changes).length === 0) {
      toast.info('No changes to save.')
      return
    }

    setBusy(true)
    setErrors([])
    try {
      await updatePoliceRequest(changes)
      toast.success('Profile updated. An admin has to review it before your portal opens again.')
      reload()
      navigate('/police/status', { replace: true })
    } catch (error) {
      if (error instanceof ApiError && error.errors) {
        setErrors([...new Set(Object.values(error.errors).filter(Boolean))])
      }
      toast.error(error instanceof Error ? error.message : 'Could not save the changes.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <Link to="/police/status" className="inline-flex items-center gap-1.5 text-sm font-bold text-brand-700 hover:text-brand-800 dark:text-brand-300">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="M19 12H5m6-6-6 6 6 6" />
          </svg>
          Back to Registration Status
        </Link>
        <h1 className="mt-3 font-display text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">Update Police Registration</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
          Details marked as checked by the admin are read-only here — ask the admin to correct those. Any change you save sends the account back for review.
        </p>
      </div>

      {!canEdit && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-800 dark:border-amber-400/30 dark:bg-amber-950/30 dark:text-amber-200">
          The edit window for this registration has closed. Contact the admin if a correction is needed.
        </div>
      )}

      {errors.length > 0 && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 dark:border-rose-400/30 dark:bg-rose-950/30">
          <p className="text-sm font-bold text-rose-700 dark:text-rose-300">Please fix the following:</p>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-rose-700 dark:text-rose-300">
            {errors.map((error) => (
              <li key={error}>{error}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="rounded-2xl border border-slate-200/80 bg-surface p-5 shadow-[0_8px_24px_rgba(15,23,42,0.05)] sm:p-8">
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-5">
            <h2 className="font-display text-lg font-extrabold tracking-tight text-slate-900">Editable details</h2>
            <Field label="Full name" required hint="A name change goes back to the admin for review.">
              <TextInput value={fullName} onChange={setFullName} placeholder="First and last name" />
            </Field>
            <Field label="District">
              <TextInput value={district} onChange={setDistrict} placeholder="e.g. Central Delhi" />
            </Field>
            <Field label="Reporting officer contact">
              <TextInput value={contact} onChange={(value) => setContact(value.replace(/\D/g, ''))} placeholder="10-digit mobile" inputMode="numeric" maxLength={10} />
            </Field>
          </div>

          <div className="rounded-xl border border-slate-200/80 bg-canvas p-5">
            <h2 className="font-display text-lg font-extrabold tracking-tight text-slate-900">Admin-checked details</h2>
            <dl className="mt-3 divide-y divide-slate-200/80">
              <ReadRow label="Rank" value={police.rank ?? ''} />
              <ReadRow label="Badge / Belt No." value={police.badge_number ?? ''} />
              <ReadRow label="Police Station" value={police.station_name ?? ''} />
              <ReadRow label="State" value={police.state ?? ''} />
              <ReadRow label="Official Email" value={police.official_email ?? ''} />
              <ReadRow label="Mobile" value={me.user.mobile} />
              <ReadRow label="Employee / Service No." value={police.employee_id ?? ''} />
              <ReadRow label="Date of Joining" value={police.joining_date ?? ''} />
              <ReadRow label="Reporting Officer" value={police.reporting_officer ?? ''} />
              <ReadRow label="ID Card" value={(police.id_card_files?.length ?? 0) > 0 ? 'Uploaded' : 'Not uploaded'} />
            </dl>
          </div>
        </div>

        <div className="mt-8 flex items-center justify-between gap-3 border-t border-slate-200/80 pt-6">
          <Link to="/police/status" className="flex-1 rounded-lg border border-slate-200 px-4 py-2.5 text-center text-sm font-bold text-slate-700 hover:border-brand-400 hover:text-brand-700 sm:flex-none dark:hover:text-brand-300">
            Cancel
          </Link>
          <button
            type="button"
            onClick={() => void save()}
            disabled={busy || !canEdit}
            className="flex-1 rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60 sm:flex-none"
          >
            {busy ? 'Saving…' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  )
}

function PoliceEditPage() {
  const { me, loading, error, reload } = useMe()

  if (loading) {
    return <p className="text-sm font-semibold text-slate-500">Loading your registration…</p>
  }
  if (error || !me) {
    return (
      <div className="rounded-2xl border border-rose-200 bg-rose-50 p-5 text-sm font-semibold text-rose-700 dark:border-rose-400/30 dark:bg-rose-950/30 dark:text-rose-300">
        {error ?? 'No account data found.'}
      </div>
    )
  }
  return <EditForm key={me.user.id} me={me} reload={reload} />
}

export default PoliceEditPage
