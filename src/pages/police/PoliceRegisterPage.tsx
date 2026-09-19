import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { ConsentCheckbox, Field, OtpBlock, PhotoUpload, TextInput } from '../../components/common/FormControls'
import SearchableSelect from '../../components/common/SearchableSelect'
import { indianStates, policeRanks } from '../../data/options'
import { savePoliceProfile, submitPoliceRegistration, usePoliceProfile, type PoliceFormInput } from '../../data/police'

const DEMO_OTP = '123456'

const steps = [
  { id: 1, title: 'Officer Identity' },
  { id: 2, title: 'Contact & Aadhaar' },
  { id: 3, title: 'Service Proof' },
  { id: 4, title: 'Login Security' },
  { id: 5, title: 'Review' },
]

interface PoliceFormState {
  fullName: string
  rank: string
  badgeNumber: string
  stationName: string
  district: string
  state: string
  officialEmail: string
  aadhaar: string
  mobile: string
  employeeId: string
  joiningDate: string
  reportingOfficer: string
  reportingOfficerContact: string
  password: string
  confirmPassword: string
  consent: boolean
}

const emptyForm: PoliceFormState = {
  fullName: '',
  rank: '',
  badgeNumber: '',
  stationName: '',
  district: '',
  state: '',
  officialEmail: '',
  aadhaar: '',
  mobile: '',
  employeeId: '',
  joiningDate: '',
  reportingOfficer: '',
  reportingOfficerContact: '',
  password: '',
  confirmPassword: '',
  consent: false,
}

function PoliceRegisterPage() {
  const navigate = useNavigate()
  const profile = usePoliceProfile()

  const [form, setForm] = useState<PoliceFormState>(() => ({
    ...emptyForm,
    fullName: profile?.fullName ?? '',
    rank: profile?.rank ?? '',
    badgeNumber: profile?.badgeNumber ?? '',
    stationName: profile?.stationName ?? '',
    district: profile?.district ?? '',
    state: profile?.state ?? '',
    officialEmail: profile?.officialEmail ?? '',
    aadhaar: profile?.aadhaar ?? '',
    mobile: profile?.mobile ?? '',
    employeeId: profile?.employeeId ?? '',
    joiningDate: profile?.joiningDate ?? '',
    reportingOfficer: profile?.reportingOfficer ?? '',
    reportingOfficerContact: profile?.reportingOfficerContact ?? '',
  }))
  const [step, setStep] = useState(1)
  const [errors, setErrors] = useState<string[]>([])

  const [idCard, setIdCard] = useState<File[]>([])
  const [appointmentProof, setAppointmentProof] = useState<File[]>([])

  const [otpSent, setOtpSent] = useState(false)
  const [otp, setOtp] = useState('')
  const [verified, setVerified] = useState(Boolean(profile))

  const isEdit = Boolean(profile)
  const update = <K extends keyof PoliceFormState>(key: K, value: PoliceFormState[K]) => setForm((prev) => ({ ...prev, [key]: value }))

  const hasIdCard = idCard.length > 0 || Boolean(profile?.hasIdCard)
  const hasAppointmentProof = appointmentProof.length > 0 || Boolean(profile?.hasAppointmentProof)

  const validateStep = (current: number): string[] => {
    const list: string[] = []
    if (current === 1) {
      if (!form.fullName.trim()) list.push('Officer full name is required.')
      if (!form.rank) list.push('Rank / designation is required.')
      if (!form.badgeNumber.trim()) list.push('Badge / belt number is required.')
      if (!form.stationName.trim()) list.push('Police station name is required.')
      if (!form.state) list.push('State is required.')
    }
    if (current === 2) {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.officialEmail.trim())) list.push('Enter a valid official email address.')
      if (form.aadhaar.length !== 12) list.push('Aadhaar number must be 12 digits.')
      if (form.mobile.length !== 10) list.push('Official mobile number must be 10 digits.')
      if (!verified) list.push('Verify your Aadhaar-linked mobile with the OTP.')
    }
    if (current === 3) {
      if (!form.employeeId.trim()) list.push('Employee / service number is required.')
      if (!form.joiningDate) list.push('Date of joining is required.')
      if (!form.reportingOfficer.trim()) list.push('Reporting officer name is required.')
      if (!hasIdCard) list.push('Upload a photo of your police ID card — it is mandatory.')
    }
    if (current === 4) {
      if (!isEdit && form.password.length < 6) list.push('Password must be at least 6 characters.')
      if (isEdit && form.password && form.password.length < 6) list.push('New password must be at least 6 characters.')
      if (form.password !== form.confirmPassword) list.push('Passwords do not match.')
    }
    return list
  }

  const scrollTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

  const goNext = () => {
    const stepErrors = validateStep(step)
    if (stepErrors.length > 0) {
      setErrors(stepErrors)
      toast.error('Please complete the required fields.')
      return
    }
    setErrors([])
    setStep((value) => Math.min(steps.length, value + 1))
    scrollTop()
  }

  const goBack = () => {
    setErrors([])
    setStep((value) => Math.max(1, value - 1))
    scrollTop()
  }

  const sendOtp = () => {
    setOtpSent(true)
    toast.success(`OTP sent to the registered mobile (demo OTP: ${DEMO_OTP}).`)
  }

  const verifyOtp = () => {
    if (otp.trim() === DEMO_OTP) {
      setVerified(true)
      toast.success('Mobile number verified.')
    } else {
      toast.error(`Invalid OTP. Use the demo OTP ${DEMO_OTP}.`)
    }
  }

  const submit = () => {
    const allErrors = [1, 2, 3, 4].flatMap((current) => validateStep(current))
    const uniqueErrors = [...new Set(allErrors)]
    if (uniqueErrors.length > 0) {
      setErrors(uniqueErrors)
      setStep(1)
      scrollTop()
      toast.error('Some required details are missing.')
      return
    }
    if (!form.consent) {
      setErrors(['You must declare that the details provided are true and correct.'])
      toast.error('Please accept the declaration before submitting.')
      return
    }

    const input: PoliceFormInput = {
      fullName: form.fullName.trim(),
      rank: form.rank,
      badgeNumber: form.badgeNumber.trim(),
      stationName: form.stationName.trim(),
      district: form.district.trim(),
      state: form.state,
      officialEmail: form.officialEmail.trim(),
      aadhaar: form.aadhaar,
      mobile: form.mobile,
      employeeId: form.employeeId.trim(),
      joiningDate: form.joiningDate,
      reportingOfficer: form.reportingOfficer.trim(),
      reportingOfficerContact: form.reportingOfficerContact.trim(),
      hasIdCard,
      hasAppointmentProof,
    }

    if (profile) {
      if (profile.status === 'rejected') {
        savePoliceProfile({ ...profile, ...input, status: 'pending', submittedAt: Date.now() })
        toast.success('Registration resubmitted for admin approval.')
      } else {
        savePoliceProfile({ ...profile, ...input })
        toast.success('Registration details updated successfully.')
      }
    } else {
      submitPoliceRegistration(input)
      toast.success('Registration submitted. It has been sent to the admin for verification.')
    }
    navigate('/police/status')
  }

  const reviewSections: { title: string; rows: [string, string][] }[] = [
    {
      title: 'Officer Identity',
      rows: [
        ['Full Name', form.fullName || '—'],
        ['Rank', form.rank || '—'],
        ['Badge / Belt No.', form.badgeNumber || '—'],
        ['Police Station', form.stationName || '—'],
        ['District / State', `${form.district || '—'} · ${form.state || '—'}`],
      ],
    },
    {
      title: 'Contact & Verification',
      rows: [
        ['Official Email', form.officialEmail || '—'],
        ['Aadhaar', form.aadhaar || '—'],
        ['Mobile', `${form.mobile || '—'} ${verified ? '· verified' : ''}`.trim()],
      ],
    },
    {
      title: 'Service Proof',
      rows: [
        ['Employee / Service No.', form.employeeId || '—'],
        ['Date of Joining', form.joiningDate || '—'],
        ['Reporting Officer', form.reportingOfficer || '—'],
        ['Officer Contact', form.reportingOfficerContact || '—'],
        ['ID Card', hasIdCard ? 'Uploaded' : 'Not uploaded'],
        ['Appointment Proof', hasAppointmentProof ? 'Uploaded' : 'Optional'],
      ],
    },
  ]

  return (
    <div className="space-y-8">
      <div>
        <Link to="/police/dashboard" className="inline-flex items-center gap-1.5 text-sm font-bold text-brand-700 hover:text-brand-800 dark:text-brand-300">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="M19 12H5m6-6-6 6 6 6" />
          </svg>
          Back to Police Portal
        </Link>
        <h1 className="mt-3 font-display text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
          {isEdit ? 'Update Police Registration' : 'Police Officer Registration'}
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
          {isEdit
            ? 'You can update your details within 6 hours of submission. Changes are re-checked by the admin.'
            : 'Register with your service details and Aadhaar-linked mobile. After you submit, the admin verifies your account and opens the police portal.'}
        </p>
      </div>

      <div className="rounded-2xl border border-slate-200/80 bg-surface p-4 sm:p-5">
        <div className="flex flex-wrap gap-2">
          {steps.map((item) => {
            const active = item.id === step
            const done = item.id < step
            return (
              <button
                key={item.id}
                type="button"
                disabled={item.id > step}
                onClick={() => item.id < step && setStep(item.id)}
                className={`inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-bold transition ${
                  active
                    ? 'border-brand-500 bg-brand-50 text-brand-700 dark:bg-brand-950/40 dark:text-brand-300'
                    : done
                      ? 'border-slate-200 text-slate-600 hover:border-brand-400'
                      : 'border-slate-200 text-slate-400 opacity-60'
                }`}
              >
                <span className={`grid h-5 w-5 place-items-center rounded-full text-[11px] ${active ? 'bg-brand-600 text-white' : done ? 'bg-brand-500 text-white' : 'bg-slate-200 text-slate-500'}`}>
                  {done ? '✓' : item.id}
                </span>
                {item.title}
              </button>
            )
          })}
        </div>
        <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
          <div className="h-full rounded-full bg-brand-500 transition-all" style={{ width: `${(step / steps.length) * 100}%` }} />
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200/80 bg-surface p-5 shadow-[0_8px_24px_rgba(15,23,42,0.05)] sm:p-8">
        <div className="mb-6">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-brand-700 dark:text-brand-300">Step {step} of {steps.length}</p>
          <h2 className="mt-1 font-display text-2xl font-extrabold tracking-tight text-slate-900">{steps[step - 1].title}</h2>
        </div>

        {errors.length > 0 && (
          <div className="mb-6 rounded-xl border border-rose-200 bg-rose-50 p-4 dark:border-rose-400/30 dark:bg-rose-950/30">
            <p className="text-sm font-bold text-rose-700 dark:text-rose-300">Please fix the following:</p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-rose-700 dark:text-rose-300">
              {errors.map((error) => (
                <li key={error}>{error}</li>
              ))}
            </ul>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-5">
            <Field label="Officer full name" required>
              <TextInput value={form.fullName} onChange={(value) => update('fullName', value)} placeholder="e.g. Inspector Rajesh Kumar" />
            </Field>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Rank / designation" required>
                <SearchableSelect value={form.rank} onChange={(value) => update('rank', value)} options={policeRanks} placeholder="Select rank" searchPlaceholder="Search rank..." />
              </Field>
              <Field label="Badge / belt number" required>
                <TextInput value={form.badgeNumber} onChange={(value) => update('badgeNumber', value)} placeholder="e.g. DL-4821" />
              </Field>
            </div>
            <Field label="Police station name" required>
              <TextInput value={form.stationName} onChange={(value) => update('stationName', value)} placeholder="e.g. Rajendra Nagar Police Station" />
            </Field>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="District">
                <TextInput value={form.district} onChange={(value) => update('district', value)} placeholder="e.g. Central Delhi" />
              </Field>
              <Field label="State" required>
                <SearchableSelect value={form.state} onChange={(value) => update('state', value)} options={indianStates} placeholder="Select state" searchPlaceholder="Search state..." />
              </Field>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-5">
            <Field label="Official email" required hint="Use your department email where possible.">
              <TextInput value={form.officialEmail} onChange={(value) => update('officialEmail', value)} type="email" placeholder="e.g. rajesh.kumar@police.gov.in" />
            </Field>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Aadhaar number" required>
                <TextInput value={form.aadhaar} onChange={(value) => update('aadhaar', value.replace(/\D/g, ''))} placeholder="12-digit Aadhaar" inputMode="numeric" maxLength={12} />
              </Field>
              <Field label="Official mobile number" required hint="Must be linked with your Aadhaar.">
                <TextInput value={form.mobile} onChange={(value) => update('mobile', value.replace(/\D/g, ''))} placeholder="10-digit mobile" inputMode="numeric" maxLength={10} />
              </Field>
            </div>
            <OtpBlock
              aadhaar={form.aadhaar}
              mobile={form.mobile}
              sent={otpSent}
              code={otp}
              verified={verified}
              onSend={sendOtp}
              onCodeChange={setOtp}
              onVerify={verifyOtp}
            />
          </div>
        )}

        {step === 3 && (
          <div className="space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Employee / service number" required>
                <TextInput value={form.employeeId} onChange={(value) => update('employeeId', value)} placeholder="e.g. EMP-2019-4471" />
              </Field>
              <Field label="Date of joining" required>
                <TextInput value={form.joiningDate} onChange={(value) => update('joiningDate', value)} type="date" />
              </Field>
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Reporting officer name" required>
                <TextInput value={form.reportingOfficer} onChange={(value) => update('reportingOfficer', value)} placeholder="e.g. ACP Meena Joshi" />
              </Field>
              <Field label="Reporting officer contact">
                <TextInput value={form.reportingOfficerContact} onChange={(value) => update('reportingOfficerContact', value.replace(/\D/g, ''))} placeholder="10-digit mobile" inputMode="numeric" maxLength={10} />
              </Field>
            </div>
            <PhotoUpload label="Police ID card" hint="Clear photo of your identity card. Mandatory." required files={idCard} onChange={setIdCard} />
            <PhotoUpload label="Appointment / duty proof" hint="Optional, but speeds up admin verification." files={appointmentProof} onChange={setAppointmentProof} />
          </div>
        )}

        {step === 4 && (
          <div className="space-y-5">
            {isEdit && (
              <div className="rounded-xl border border-brand-200/70 bg-brand-50 p-4 text-sm leading-6 text-brand-800 dark:border-brand-500/30 dark:bg-brand-950/40 dark:text-brand-200">
                Leave the password fields blank to keep your current password.
              </div>
            )}
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label={isEdit ? 'New password' : 'Password'} required={!isEdit}>
                <TextInput value={form.password} onChange={(value) => update('password', value)} type="password" placeholder="At least 6 characters" />
              </Field>
              <Field label="Confirm password" required={!isEdit}>
                <TextInput value={form.confirmPassword} onChange={(value) => update('confirmPassword', value)} type="password" placeholder="Re-enter password" />
              </Field>
            </div>
          </div>
        )}

        {step === 5 && (
          <div className="space-y-6">
            <div className="grid gap-5 md:grid-cols-2">
              {reviewSections.map((section) => (
                <div key={section.title} className="rounded-xl border border-slate-200/80 bg-canvas p-5">
                  <h3 className="font-display text-sm font-extrabold uppercase tracking-wide text-slate-700">{section.title}</h3>
                  <dl className="mt-3 divide-y divide-slate-200/80">
                    {section.rows.map(([label, value]) => (
                      <div key={label} className="grid grid-cols-1 gap-1 py-2 sm:grid-cols-[140px_1fr] sm:gap-3">
                        <dt className="text-xs font-semibold text-slate-400">{label}</dt>
                        <dd className="text-xs font-semibold text-slate-700">{value}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              ))}
            </div>
            <ConsentCheckbox checked={form.consent} onChange={(value) => update('consent', value)}>
              I declare that I am a serving police officer and all the details provided above are true and correct. I understand that false information will lead to legal action and permanent removal from this platform.
            </ConsentCheckbox>
            <p className="text-xs leading-5 text-slate-400">
              After submission, your registration is sent to the admin for verification. This is a demo build — no real data is stored or transmitted.
            </p>
          </div>
        )}

        <div className="mt-8 flex items-center justify-between gap-3 border-t border-slate-200/80 pt-6">
          <button
            type="button"
            onClick={goBack}
            disabled={step === 1}
            className="flex-1 rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-bold text-slate-700 hover:border-brand-400 hover:text-brand-700 disabled:cursor-not-allowed disabled:opacity-40 sm:flex-none dark:hover:text-brand-300"
          >
            Back
          </button>
          {step < steps.length ? (
            <button type="button" onClick={goNext} className="flex-1 rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-brand-700 sm:flex-none">
              Continue
            </button>
          ) : (
            <button type="button" onClick={submit} className="flex-1 rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-brand-700 sm:flex-none">
              {isEdit ? 'Save Changes' : 'Submit Registration'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default PoliceRegisterPage
