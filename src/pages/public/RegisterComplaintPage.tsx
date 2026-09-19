import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { ConsentCheckbox, Field, OtpBlock, PhotoUpload, SelectInput, TextAreaInput, TextInput } from '../../components/common/FormControls'
import SearchableSelect from '../../components/common/SearchableSelect'
import { genderOptions, indianCities, indianLanguages, relationOptions } from '../../data/options'
import { registerComplaint } from '../../data/myComplaints'

const DEMO_OTP = '123456'

interface FormState {
  personName: string
  personAge: string
  personGender: string
  personHeight: string
  personBuild: string
  personMarks: string
  personClothing: string
  personMedical: string
  personLanguages: string
  lastSeenDate: string
  lastSeenTime: string
  lastSeenPlace: string
  lastSeenCity: string
  lastSeenArea: string
  circumstances: string
  complainantName: string
  complainantRelation: string
  complainantAadhaar: string
  complainantMobile: string
  complainantAddress: string
  memberName: string
  memberRelation: string
  memberAadhaar: string
  memberMobile: string
  policeStation: string
  firNumber: string
  firDate: string
  consentTruth: boolean
  consentShare: boolean
  consentPolice: boolean
}

const emptyForm: FormState = {
  personName: '',
  personAge: '',
  personGender: '',
  personHeight: '',
  personBuild: '',
  personMarks: '',
  personClothing: '',
  personMedical: '',
  personLanguages: '',
  lastSeenDate: '',
  lastSeenTime: '',
  lastSeenPlace: '',
  lastSeenCity: '',
  lastSeenArea: '',
  circumstances: '',
  complainantName: '',
  complainantRelation: '',
  complainantAadhaar: '',
  complainantMobile: '',
  complainantAddress: '',
  memberName: '',
  memberRelation: '',
  memberAadhaar: '',
  memberMobile: '',
  policeStation: '',
  firNumber: '',
  firDate: '',
  consentTruth: false,
  consentShare: false,
  consentPolice: false,
}

const steps = [
  { id: 1, title: 'Missing Person' },
  { id: 2, title: 'Last Seen' },
  { id: 3, title: 'Your Details' },
  { id: 4, title: 'Family Member' },
  { id: 5, title: 'Police & Consent' },
  { id: 6, title: 'Review' },
]

function priorityLabels(form: FormState): string[] {
  const tags: string[] = []
  const age = Number(form.personAge)
  if (form.personGender === 'Female') tags.push('Female')
  if (!Number.isNaN(age) && age > 0 && age < 12) tags.push('Child')
  if (!Number.isNaN(age) && age >= 60) tags.push('Senior Citizen')
  return tags
}

interface RegisterComplaintPageProps {
  backTo?: string
  backLabel?: string
  redirectTo?: string
  heading?: string
  description?: string
}

function RegisterComplaintPage({
  backTo = '/public/dashboard',
  backLabel = 'Back to Dashboard',
  redirectTo,
  heading = 'Register a Missing Person Complaint',
  description = 'Please fill every section carefully in simple English. A police complaint (FIR) copy is mandatory — without it this complaint cannot be accepted.',
}: RegisterComplaintPageProps) {
  const [form, setForm] = useState<FormState>(emptyForm)
  const [step, setStep] = useState(1)
  const [errors, setErrors] = useState<string[]>([])

  const [personPhotos, setPersonPhotos] = useState<File[]>([])
  const [locationPhotos, setLocationPhotos] = useState<File[]>([])
  const [complainantIdFile, setComplainantIdFile] = useState<File[]>([])
  const [memberIdFile, setMemberIdFile] = useState<File[]>([])
  const [firCopy, setFirCopy] = useState<File[]>([])

  const [complainantOtpSent, setComplainantOtpSent] = useState(false)
  const [complainantOtp, setComplainantOtp] = useState('')
  const [complainantVerified, setComplainantVerified] = useState(false)

  const [memberOtpSent, setMemberOtpSent] = useState(false)
  const [memberOtp, setMemberOtp] = useState('')
  const [memberVerified, setMemberVerified] = useState(false)

  const navigate = useNavigate()

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) => setForm((prev) => ({ ...prev, [key]: value }))

  const validateStep = (current: number): string[] => {
    const list: string[] = []
    if (current === 1) {
      if (!form.personName.trim()) list.push("Missing person's full name is required.")
      if (!form.personAge.trim()) list.push('Age is required.')
      if (!form.personGender) list.push('Gender is required.')
      if (personPhotos.length < 1) list.push('Upload at least one recent photo of the missing person.')
    }
    if (current === 2) {
      if (!form.lastSeenDate) list.push('Date last seen is required.')
      if (!form.lastSeenTime) list.push('Time last seen is required.')
      if (!form.lastSeenPlace.trim()) list.push('Last seen location is required.')
      if (!form.lastSeenCity.trim()) list.push('City / town is required.')
    }
    if (current === 3) {
      if (!form.complainantName.trim()) list.push('Your full name is required.')
      if (!form.complainantRelation) list.push('Your relation to the missing person is required.')
      if (form.complainantAadhaar.length !== 12) list.push('Your Aadhaar number must be 12 digits.')
      if (form.complainantMobile.length !== 10) list.push('Your mobile number must be 10 digits.')
      if (!complainantVerified) list.push('Verify your Aadhaar-linked mobile with OTP.')
      if (!form.complainantAddress.trim()) list.push('Your address is required.')
      if (complainantIdFile.length < 1) list.push('Upload at least one photo of your ID proof.')
    }
    if (current === 4) {
      if (!form.memberName.trim()) list.push("Second family member's full name is required.")
      if (!form.memberRelation) list.push('Relation of the second family member is required.')
      if (form.memberAadhaar.length !== 12) list.push("Second family member's Aadhaar must be 12 digits.")
      if (form.memberMobile.length !== 10) list.push("Second family member's mobile must be 10 digits.")
      if (!memberVerified) list.push('Verify the second family member with OTP.')
      if (memberIdFile.length < 1) list.push('Upload at least one photo of the family member ID proof.')
    }
    if (current === 5) {
      if (!form.policeStation.trim()) list.push('Police station name is required.')
      if (!form.firNumber.trim()) list.push('Police complaint / FIR number is required.')
      if (!form.firDate) list.push('Police complaint / FIR date is required.')
      if (firCopy.length < 1) list.push('Attach the police complaint / FIR copy — it is mandatory.')
      if (!form.consentTruth) list.push('You must accept the truthfulness declaration.')
      if (!form.consentShare) list.push('You must consent to sharing details with police and NGOs.')
      if (!form.consentPolice) list.push('You must confirm a police complaint has been filed.')
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

  const sendComplainantOtp = () => {
    setComplainantOtpSent(true)
    toast.success(`OTP sent to your Aadhaar-linked mobile (demo OTP: ${DEMO_OTP}).`)
  }

  const verifyComplainantOtp = () => {
    if (complainantOtp.trim() === DEMO_OTP) {
      setComplainantVerified(true)
      toast.success('Your mobile number verified.')
    } else {
      toast.error(`Invalid OTP. Use the demo OTP ${DEMO_OTP}.`)
    }
  }

  const sendMemberOtp = () => {
    setMemberOtpSent(true)
    toast.success(`OTP sent to the family member's mobile (demo OTP: ${DEMO_OTP}).`)
  }

  const verifyMemberOtp = () => {
    if (memberOtp.trim() === DEMO_OTP) {
      setMemberVerified(true)
      toast.success('Family member verified.')
    } else {
      toast.error(`Invalid OTP. Use the demo OTP ${DEMO_OTP}.`)
    }
  }

  const submit = () => {
    const allErrors = [1, 2, 3, 4, 5].flatMap((current) => validateStep(current))
    const uniqueErrors = [...new Set(allErrors)]
    if (uniqueErrors.length > 0) {
      setErrors(uniqueErrors)
      setStep(1)
      scrollTop()
      toast.error('Some required details are missing.')
      return
    }
    const newId = registerComplaint({
      personName: form.personName,
      age: Number(form.personAge) || 0,
      gender: form.personGender,
      height: form.personHeight,
      build: form.personBuild,
      marks: form.personMarks,
      clothing: form.personClothing,
      medicalNotes: form.personMedical,
      languages: form.personLanguages,
      lastSeenDate: form.lastSeenDate,
      lastSeenTime: form.lastSeenTime,
      lastSeen: form.lastSeenPlace,
      area: form.lastSeenCity,
      locality: form.lastSeenArea,
      circumstances: form.circumstances,
      complainantName: form.complainantName,
      complainantRelation: form.complainantRelation,
      complainantAadhaar: form.complainantAadhaar,
      complainantMobile: form.complainantMobile,
      complainantAddress: form.complainantAddress,
      memberName: form.memberName,
      memberRelation: form.memberRelation,
      memberAadhaar: form.memberAadhaar,
      memberMobile: form.memberMobile,
      policeStation: form.policeStation,
      firNumber: form.firNumber,
      firDate: form.firDate,
      personPhotos: personPhotos.length,
      hasComplainantId: complainantIdFile.length > 0,
      hasMemberId: memberIdFile.length > 0,
      hasFirCopy: firCopy.length > 0,
    })
    toast.success('Complaint registered successfully.')
    navigate(redirectTo ?? `/public/my-complaints/${newId}`)
  }

  const priority = priorityLabels(form)

  const reviewSections: { title: string; rows: [string, string][] }[] = [
    {
      title: 'Missing Person',
      rows: [
        ['Full Name', form.personName || '—'],
        ['Age / Gender', `${form.personAge || '—'} years · ${form.personGender || '—'}`],
        ['Height / Build', `${form.personHeight || '—'} / ${form.personBuild || '—'}`],
        ['Identifying Marks', form.personMarks || '—'],
        ['Clothing Last Worn', form.personClothing || '—'],
        ['Medical Notes', form.personMedical || '—'],
        ['Languages', form.personLanguages || '—'],
        ['Photos', `${personPhotos.length} uploaded`],
      ],
    },
    {
      title: 'Last Seen',
      rows: [
        ['Date / Time', `${form.lastSeenDate || '—'} ${form.lastSeenTime || ''}`.trim()],
        ['Location', form.lastSeenPlace || '—'],
        ['City / Area', `${form.lastSeenCity || '—'} · ${form.lastSeenArea || '—'}`],
        ['Circumstances', form.circumstances || '—'],
        ['Location Photos', `${locationPhotos.length} uploaded`],
      ],
    },
    {
      title: 'Complainant (You)',
      rows: [
        ['Full Name', form.complainantName || '—'],
        ['Relation', form.complainantRelation || '—'],
        ['Aadhaar', form.complainantAadhaar || '—'],
        ['Mobile (verified)', `${form.complainantMobile || '—'} ${complainantVerified ? '· verified' : ''}`.trim()],
        ['Address', form.complainantAddress || '—'],
        ['ID Proof Photos', `${complainantIdFile.length} uploaded`],
      ],
    },
    {
      title: 'Second Family Member',
      rows: [
        ['Full Name', form.memberName || '—'],
        ['Relation', form.memberRelation || '—'],
        ['Aadhaar', form.memberAadhaar || '—'],
        ['Mobile (verified)', `${form.memberMobile || '—'} ${memberVerified ? '· verified' : ''}`.trim()],
        ['ID Proof Photos', `${memberIdFile.length} uploaded`],
      ],
    },
    {
      title: 'Police Complaint',
      rows: [
        ['Police Station', form.policeStation || '—'],
        ['FIR Number', form.firNumber || '—'],
        ['FIR Date', form.firDate || '—'],
        ['FIR Copy', `${firCopy.length} file(s) attached`],
      ],
    },
  ]

  return (
    <div className="space-y-8">
      <div>
        <Link to={backTo} className="inline-flex items-center gap-1.5 text-sm font-bold text-brand-700 hover:text-brand-800 dark:text-brand-300">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="M19 12H5m6-6-6 6 6 6" />
          </svg>
          {backLabel}
        </Link>
        <h1 className="mt-3 font-display text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">{heading}</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">{description}</p>
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
            <Field label="Full name of missing person" required>
              <TextInput value={form.personName} onChange={(value) => update('personName', value)} placeholder="e.g. Rohit Sharma" />
            </Field>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Age" required>
                <TextInput value={form.personAge} onChange={(value) => update('personAge', value)} placeholder="e.g. 34" inputMode="numeric" maxLength={3} />
              </Field>
              <Field label="Gender" required>
                <SelectInput value={form.personGender} onChange={(value) => update('personGender', value)} options={genderOptions} />
              </Field>
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Height">
                <TextInput value={form.personHeight} onChange={(value) => update('personHeight', value)} placeholder="e.g. 5 ft 7 in" />
              </Field>
              <Field label="Build">
                <TextInput value={form.personBuild} onChange={(value) => update('personBuild', value)} placeholder="e.g. Slim / Medium" />
              </Field>
            </div>
            <Field label="Identifying marks" hint="Scars, tattoos, birthmarks, spectacles, walking aid, etc.">
              <TextInput value={form.personMarks} onChange={(value) => update('personMarks', value)} placeholder="e.g. Scar on left eyebrow" />
            </Field>
            <Field label="Clothing last worn">
              <TextInput value={form.personClothing} onChange={(value) => update('personClothing', value)} placeholder="e.g. Blue jacket, black trousers" />
            </Field>
            <Field label="Medical conditions / medication" hint="Very important for children and senior citizens.">
              <TextAreaInput value={form.personMedical} onChange={(value) => update('personMedical', value)} placeholder="e.g. Needs insulin daily, speaks little" />
            </Field>
            <Field label="Languages spoken">
              <SearchableSelect value={form.personLanguages} onChange={(value) => update('personLanguages', value)} options={indianLanguages} placeholder="Select language" searchPlaceholder="Search language..." />
            </Field>
            <PhotoUpload label="Photos of the missing person" hint="Recent, clear, face visible. At least one photo is required." required files={personPhotos} onChange={setPersonPhotos} />
            {priority.length > 0 && (
              <div className="rounded-xl border border-amber-200/80 bg-amber-50 p-4 text-sm leading-6 text-amber-800 dark:border-amber-400/30 dark:bg-amber-950/40 dark:text-amber-200">
                Priority alert: this case involves a <span className="font-bold">{priority.join(', ')}</span>. It will be broadcast instantly to every registered user within a 6 km radius.
              </div>
            )}
          </div>
        )}

        {step === 2 && (
          <div className="space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Date last seen" required>
                <TextInput value={form.lastSeenDate} onChange={(value) => update('lastSeenDate', value)} type="date" />
              </Field>
              <Field label="Time last seen" required>
                <TextInput value={form.lastSeenTime} onChange={(value) => update('lastSeenTime', value)} type="time" />
              </Field>
            </div>
            <Field label="Last seen location" required hint="Landmark, bus stop, market or building name.">
              <TextInput value={form.lastSeenPlace} onChange={(value) => update('lastSeenPlace', value)} placeholder="e.g. Old Delhi Railway Station" />
            </Field>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="City / town" required>
                <SearchableSelect value={form.lastSeenCity} onChange={(value) => update('lastSeenCity', value)} options={indianCities} placeholder="Select city" searchPlaceholder="Search city..." />
              </Field>
              <Field label="Area / locality">
                <TextInput value={form.lastSeenArea} onChange={(value) => update('lastSeenArea', value)} placeholder="e.g. Chandni Chowk" />
              </Field>
            </div>
            <Field label="What happened?" hint="Briefly describe the circumstances of the disappearance.">
              <TextAreaInput value={form.circumstances} onChange={(value) => update('circumstances', value)} placeholder="e.g. Left home to buy medicines and did not return" />
            </Field>
            <PhotoUpload label="Photos of the last seen location" hint="Optional, but helpful for search teams." files={locationPhotos} onChange={setLocationPhotos} />
          </div>
        )}

        {step === 3 && (
          <div className="space-y-5">
            <Field label="Your full name" required>
              <TextInput value={form.complainantName} onChange={(value) => update('complainantName', value)} placeholder="e.g. Suresh Sharma" />
            </Field>
            <Field label="Your relation to the missing person" required>
              <SearchableSelect value={form.complainantRelation} onChange={(value) => update('complainantRelation', value)} options={relationOptions} placeholder="Select relation" searchPlaceholder="Search relation..." />
            </Field>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Your Aadhaar number" required>
                <TextInput value={form.complainantAadhaar} onChange={(value) => update('complainantAadhaar', value.replace(/\D/g, ''))} placeholder="12-digit Aadhaar" inputMode="numeric" maxLength={12} />
              </Field>
              <Field label="Your mobile number" required hint="Must be the number linked with your Aadhaar.">
                <TextInput value={form.complainantMobile} onChange={(value) => update('complainantMobile', value.replace(/\D/g, ''))} placeholder="10-digit mobile" inputMode="numeric" maxLength={10} />
              </Field>
            </div>
            <OtpBlock
              aadhaar={form.complainantAadhaar}
              mobile={form.complainantMobile}
              sent={complainantOtpSent}
              code={complainantOtp}
              verified={complainantVerified}
              onSend={sendComplainantOtp}
              onCodeChange={setComplainantOtp}
              onVerify={verifyComplainantOtp}
            />
            <Field label="Your full address" required>
              <TextAreaInput value={form.complainantAddress} onChange={(value) => update('complainantAddress', value)} placeholder="House, street, city, PIN code" />
            </Field>
            <PhotoUpload label="Your ID proof" hint="Aadhaar, voter ID or any government photo ID. At least one photo is required." required files={complainantIdFile} onChange={setComplainantIdFile} />
          </div>
        )}

        {step === 4 && (
          <div className="space-y-5">
            <div className="rounded-xl border border-brand-200/70 bg-brand-50 p-4 text-sm leading-6 text-brand-800 dark:border-brand-500/30 dark:bg-brand-950/40 dark:text-brand-200">
              A second family member is mandatory. Their Aadhaar details and mobile number will be verified with an OTP to confirm this complaint is genuine.
            </div>
            <Field label="Family member's full name" required>
              <TextInput value={form.memberName} onChange={(value) => update('memberName', value)} placeholder="e.g. Anita Sharma" />
            </Field>
            <Field label="Their relation to the missing person" required>
              <SearchableSelect value={form.memberRelation} onChange={(value) => update('memberRelation', value)} options={relationOptions} placeholder="Select relation" searchPlaceholder="Search relation..." />
            </Field>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Their Aadhaar number" required>
                <TextInput value={form.memberAadhaar} onChange={(value) => update('memberAadhaar', value.replace(/\D/g, ''))} placeholder="12-digit Aadhaar" inputMode="numeric" maxLength={12} />
              </Field>
              <Field label="Their mobile number" required>
                <TextInput value={form.memberMobile} onChange={(value) => update('memberMobile', value.replace(/\D/g, ''))} placeholder="10-digit mobile" inputMode="numeric" maxLength={10} />
              </Field>
            </div>
            <OtpBlock
              aadhaar={form.memberAadhaar}
              mobile={form.memberMobile}
              sent={memberOtpSent}
              code={memberOtp}
              verified={memberVerified}
              onSend={sendMemberOtp}
              onCodeChange={setMemberOtp}
              onVerify={verifyMemberOtp}
            />
            <PhotoUpload label="Family member's ID proof" hint="Aadhaar, voter ID or any government photo ID. At least one photo is required." required files={memberIdFile} onChange={setMemberIdFile} />
          </div>
        )}

        {step === 5 && (
          <div className="space-y-5">
            <div className="rounded-xl border border-amber-200/80 bg-amber-50 p-4 text-sm leading-6 text-amber-800 dark:border-amber-400/30 dark:bg-amber-950/40 dark:text-amber-200">
              A police complaint (FIR) copy is <span className="font-bold">mandatory</span>. Without a filed police complaint, this complaint cannot be accepted on Ghar Wapasi.
            </div>
            <Field label="Police station name" required>
              <TextInput value={form.policeStation} onChange={(value) => update('policeStation', value)} placeholder="e.g. Rajendra Nagar Police Station" />
            </Field>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Police complaint / FIR number" required>
                <TextInput value={form.firNumber} onChange={(value) => update('firNumber', value)} placeholder="e.g. FIR/2026/0456" />
              </Field>
              <Field label="Police complaint / FIR date" required>
                <TextInput value={form.firDate} onChange={(value) => update('firDate', value)} type="date" />
              </Field>
            </div>
            <PhotoUpload label="Police complaint / FIR copy" hint="Clear photo or scan of the filed complaint. Mandatory." required files={firCopy} onChange={setFirCopy} />
            <div className="space-y-3 pt-2">
              <ConsentCheckbox checked={form.consentTruth} onChange={(value) => update('consentTruth', value)}>
                I confirm that all the information provided above is true and correct. If any information is found false or fake, I understand that I will bear the legal consequences myself.
              </ConsentCheckbox>
              <ConsentCheckbox checked={form.consentShare} onChange={(value) => update('consentShare', value)}>
                I consent to sharing these details with the police and verified NGO partners for search and rescue purposes.
              </ConsentCheckbox>
              <ConsentCheckbox checked={form.consentPolice} onChange={(value) => update('consentPolice', value)}>
                I confirm that a police complaint has been filed and the attached copy is genuine.
              </ConsentCheckbox>
            </div>
          </div>
        )}

        {step === 6 && (
          <div className="space-y-6">
            {priority.length > 0 && (
              <div className="rounded-xl border border-amber-200/80 bg-amber-50 p-4 text-sm leading-6 text-amber-800 dark:border-amber-400/30 dark:bg-amber-950/40 dark:text-amber-200">
                Priority alert will be sent: <span className="font-bold">{priority.join(', ')}</span>.
              </div>
            )}
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
            <p className="text-xs leading-5 text-slate-400">
              By submitting, you confirm the declaration accepted in the previous step. This is a demo build — no real data is stored or transmitted.
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
              Submit Complaint
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default RegisterComplaintPage