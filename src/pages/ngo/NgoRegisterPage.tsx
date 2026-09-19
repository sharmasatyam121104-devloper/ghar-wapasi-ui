import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { ConsentCheckbox, Field, OtpBlock, PhotoUpload, SelectInput, TextAreaInput, TextInput } from '../../components/common/FormControls'
import SearchableSelect from '../../components/common/SearchableSelect'
import { ngoOrgTypes, saveNgoProfile, submitNgoRegistration, useNgoProfile, type NgoFormInput } from '../../data/ngo'
import { indianStates } from '../../data/options'

const DEMO_OTP = '123456'

const steps = [
  { id: 1, title: 'Organisation' },
  { id: 2, title: 'Contact Person' },
  { id: 3, title: 'KYC & Documents' },
  { id: 4, title: 'Login Security' },
  { id: 5, title: 'Review' },
]

interface NgoFormState {
  orgName: string
  orgType: string
  regNumber: string
  state: string
  district: string
  city: string
  address: string
  contactPerson: string
  designation: string
  contactMobile: string
  contactEmail: string
  website: string
  contactAadhaar: string
  password: string
  confirmPassword: string
  consent: boolean
}

const emptyForm: NgoFormState = {
  orgName: '',
  orgType: '',
  regNumber: '',
  state: '',
  district: '',
  city: '',
  address: '',
  contactPerson: '',
  designation: '',
  contactMobile: '',
  contactEmail: '',
  website: '',
  contactAadhaar: '',
  password: '',
  confirmPassword: '',
  consent: false,
}

function NgoRegisterPage() {
  const navigate = useNavigate()
  const profile = useNgoProfile()

  const [form, setForm] = useState<NgoFormState>(() => ({
    ...emptyForm,
    orgName: profile?.orgName ?? '',
    orgType: profile?.orgType ?? '',
    regNumber: profile?.regNumber ?? '',
    state: profile?.state ?? '',
    district: profile?.district ?? '',
    city: profile?.city ?? '',
    address: profile?.address ?? '',
    contactPerson: profile?.contactPerson ?? '',
    designation: profile?.designation ?? '',
    contactMobile: profile?.contactMobile ?? '',
    contactEmail: profile?.contactEmail ?? '',
    website: profile?.website ?? '',
    contactAadhaar: profile?.contactAadhaar ?? '',
  }))
  const [step, setStep] = useState(1)
  const [errors, setErrors] = useState<string[]>([])

  const [regCertificate, setRegCertificate] = useState<File[]>([])
  const [orgPhoto, setOrgPhoto] = useState<File[]>([])

  const [otpSent, setOtpSent] = useState(false)
  const [otp, setOtp] = useState('')
  const [verified, setVerified] = useState(Boolean(profile))

  const isEdit = Boolean(profile)
  const update = <K extends keyof NgoFormState>(key: K, value: NgoFormState[K]) => setForm((prev) => ({ ...prev, [key]: value }))

  const hasRegCertificate = regCertificate.length > 0 || Boolean(profile?.hasRegCertificate)
  const hasOrgPhoto = orgPhoto.length > 0 || Boolean(profile?.hasOrgPhoto)

  const validateStep = (current: number): string[] => {
    const list: string[] = []
    if (current === 1) {
      if (!form.orgName.trim()) list.push('Organisation / NGO name is required.')
      if (!form.state) list.push('State is required.')
    }
    if (current === 2) {
      if (!form.contactPerson.trim()) list.push('Contact person name is required.')
      if (form.contactMobile.length !== 10) list.push('Contact mobile number must be 10 digits.')
      if (form.contactEmail.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.contactEmail.trim())) list.push('Enter a valid email address.')
      if (!verified) list.push('Verify your mobile number with the OTP.')
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
    const allErrors = [1, 2, 4].flatMap((current) => validateStep(current))
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

    const input: NgoFormInput = {
      orgName: form.orgName.trim(),
      orgType: form.orgType,
      regNumber: form.regNumber.trim(),
      state: form.state,
      district: form.district.trim(),
      city: form.city.trim(),
      address: form.address.trim(),
      contactPerson: form.contactPerson.trim(),
      designation: form.designation.trim(),
      contactMobile: form.contactMobile,
      contactEmail: form.contactEmail.trim(),
      website: form.website.trim(),
      contactAadhaar: form.contactAadhaar,
      hasRegCertificate,
      hasOrgPhoto,
    }

    if (profile) {
      if (profile.status === 'rejected') {
        saveNgoProfile({ ...profile, ...input, status: 'pending', submittedAt: Date.now() })
        toast.success('Registration resubmitted for admin approval.')
      } else {
        saveNgoProfile({ ...profile, ...input })
        toast.success('Registration details updated successfully.')
      }
    } else {
      submitNgoRegistration(input)
      toast.success('Registration submitted. It has been sent to the admin for verification.')
    }
    navigate('/ngo/status')
  }

  const reviewSections: { title: string; rows: [string, string][] }[] = [
    {
      title: 'Organisation',
      rows: [
        ['Organisation Name', form.orgName || '—'],
        ['Type', form.orgType || '—'],
        ['Registration No.', form.regNumber || '—'],
        ['State / District', `${form.state || '—'}${form.district ? ` · ${form.district}` : ''}`],
        ['City', form.city || '—'],
      ],
    },
    {
      title: 'Contact Person',
      rows: [
        ['Full Name', form.contactPerson || '—'],
        ['Designation', form.designation || '—'],
        ['Mobile', `${form.contactMobile || '—'} ${verified ? '· verified' : ''}`.trim()],
        ['Email', form.contactEmail || '—'],
        ['Website', form.website || '—'],
      ],
    },
    {
      title: 'KYC & Documents',
      rows: [
        ['Contact Aadhaar', form.contactAadhaar ? 'Provided (optional)' : 'Not provided'],
        ['Address', form.address || '—'],
        ['Registration Certificate', hasRegCertificate ? 'Uploaded' : 'Not uploaded'],
        ['Organisation Photo', hasOrgPhoto ? 'Uploaded' : 'Not uploaded'],
      ],
    },
  ]

  return (
    <div className="space-y-8">
      <div>
        <Link to="/ngo/dashboard" className="inline-flex items-center gap-1.5 text-sm font-bold text-brand-700 hover:text-brand-800 dark:text-brand-300">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="M19 12H5m6-6-6 6 6 6" />
          </svg>
          Back to NGO Portal
        </Link>
        <h1 className="mt-3 font-display text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
          {isEdit ? 'Update NGO Registration' : 'NGO / Organisation Registration'}
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
          Only the marked fields are mandatory — everything else is optional, so register with whatever information you have. After you submit, the admin verifies your organisation over a short viva call.
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
            <Field label="Organisation / NGO name" required>
              <TextInput value={form.orgName} onChange={(value) => update('orgName', value)} placeholder="e.g. Nav Disha Seva Samiti" />
            </Field>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Organisation type">
                <SelectInput value={form.orgType} onChange={(value) => update('orgType', value)} options={ngoOrgTypes} placeholder="Select type (optional)" />
              </Field>
              <Field label="Registration / 12A number">
                <TextInput value={form.regNumber} onChange={(value) => update('regNumber', value)} placeholder="e.g. GR/2020/004512 (optional)" />
              </Field>
            </div>
            <div className="grid gap-5 sm:grid-cols-3">
              <Field label="State" required>
                <SearchableSelect value={form.state} onChange={(value) => update('state', value)} options={indianStates} placeholder="Select state" searchPlaceholder="Search state..." />
              </Field>
              <Field label="District">
                <TextInput value={form.district} onChange={(value) => update('district', value)} placeholder="District (optional)" />
              </Field>
              <Field label="City / Town">
                <TextInput value={form.city} onChange={(value) => update('city', value)} placeholder="City / town (optional)" />
              </Field>
            </div>
            <Field label="Office address">
              <TextAreaInput value={form.address} onChange={(value) => update('address', value)} placeholder="Full office address (optional)" />
            </Field>
            <p className="text-xs leading-5 text-slate-400">Only the name and state are mandatory — keep the rest blank if you don't have the details handy.</p>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Contact person full name" required>
                <TextInput value={form.contactPerson} onChange={(value) => update('contactPerson', value)} placeholder="e.g. Anita Sharma" />
              </Field>
              <Field label="Designation / role">
                <TextInput value={form.designation} onChange={(value) => update('designation', value)} placeholder="e.g. Secretary, Volunteer (optional)" />
              </Field>
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Contact mobile number" required hint="Verified with an OTP below.">
                <TextInput value={form.contactMobile} onChange={(value) => update('contactMobile', value.replace(/\D/g, ''))} placeholder="10-digit mobile" inputMode="numeric" maxLength={10} />
              </Field>
              <Field label="Email address">
                <TextInput value={form.contactEmail} onChange={(value) => update('contactEmail', value)} type="email" placeholder="Email (optional)" />
              </Field>
            </div>
            <Field label="Website / social page">
              <TextInput value={form.website} onChange={(value) => update('website', value)} placeholder="e.g. https://navdisha.org (optional)" />
            </Field>
            <OtpBlock
              aadhaar={form.contactAadhaar}
              mobile={form.contactMobile}
              sent={otpSent}
              code={otp}
              verified={verified}
              onSend={sendOtp}
              onCodeChange={setOtp}
              onVerify={verifyOtp}
              requireAadhaar={false}
            />
            <p className="text-xs leading-5 text-slate-400">No Aadhaar needed here — a mobile OTP is enough.</p>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-5">
            <Field label="Contact person Aadhaar (optional)" hint="Optional, but it speeds up admin verification.">
              <TextInput value={form.contactAadhaar} onChange={(value) => update('contactAadhaar', value.replace(/\D/g, ''))} placeholder="12-digit Aadhaar, if available" inputMode="numeric" maxLength={12} />
            </Field>
            <PhotoUpload label="Registration certificate" hint="Files like registration / 12A / 80G certificate. Optional." files={regCertificate} onChange={setRegCertificate} />
            <PhotoUpload label="Organisation / office photo" hint="Optional. A photo of office, volunteers, or a team photo." files={orgPhoto} onChange={setOrgPhoto} />
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
              I declare that I am authorised to register this organisation and all the details provided above are true and correct. I understand that false information will lead to removal from this platform.
            </ConsentCheckbox>
            <p className="text-xs leading-5 text-slate-400">
              After submission, your registration is sent to the admin. The admin schedules a short viva video call to verify your organisation. This is a demo build — no real data is stored or transmitted.
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

export default NgoRegisterPage