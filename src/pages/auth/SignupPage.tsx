import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import Logo from '../../components/common/Logo'
import ThemeToggle from '../../components/common/ThemeToggle'

const OTP_LENGTH = 6

const benefits = [
  { title: 'Raise & track complaints', description: 'File a missing person report and follow its status anytime.' },
  { title: 'Get 6 km alerts', description: 'Be notified instantly about missing people near your location.' },
  { title: 'Verified & private', description: 'Identity verified with Aadhaar and mobile. Your data stays safe.' },
]

const inputBase = 'w-full rounded-xl border border-slate-200 bg-surface px-4 py-3 pl-11 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-brand-400 focus:ring-2 focus:ring-brand-100'

function SignupPage() {
  const navigate = useNavigate()
  const otpRefs = useRef<(HTMLInputElement | null)[]>([])

  const [step, setStep] = useState<1 | 2>(1)
  const [form, setForm] = useState({ name: '', aadhar: '', mobile: '', password: '' })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(''))

  const setField = (field: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => ({ ...prev, [field]: '' }))
  }

  const goBack = () => {
    if (step === 2) {
      setStep(1)
      return
    }
    navigate(-1)
  }

  const validateDetails = () => {
    const next: Record<string, string> = {}
    if (!form.name.trim()) next.name = 'Name is required.'
    if (!/^\d{12}$/.test(form.aadhar)) next.aadhar = 'Enter a valid 12-digit Aadhaar number.'
    if (!/^\d{10}$/.test(form.mobile)) next.mobile = 'Enter a valid 10-digit mobile number.'
    if (form.password.length < 6) next.password = 'Password must be at least 6 characters.'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const continueToOtp = () => {
    if (!validateDetails()) return
    setStep(2)
    toast.info(`OTP sent to +91 ${form.mobile}`)
    window.setTimeout(() => otpRefs.current[0]?.focus(), 100)
  }

  const handleOtpChange = (index: number, raw: string) => {
    const value = raw.replace(/\D/g, '').slice(-1)
    const next = [...otp]
    next[index] = value
    setOtp(next)
    if (value && index < OTP_LENGTH - 1) otpRefs.current[index + 1]?.focus()
    if (next.every((digit) => digit !== '')) verifyOtp(next.join(''))
  }

  const handleOtpKeyDown = (index: number, key: string) => {
    if (key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus()
    }
  }

  const verifyOtp = (code?: string) => {
    const value = code ?? otp.join('')
    if (value.length !== OTP_LENGTH) {
      toast.error('Please enter the 6-digit OTP')
      return
    }
    toast.success('Account created successfully (Demo). Welcome to Ghar Wapasi!')
    navigate('/public/dashboard')
  }

  const resendOtp = () => toast.info('OTP resent (Demo). Check your mobile.')

  const verifyDigiLocker = () => toast.info('DigiLocker verification — coming soon (Demo).')

  return (
    <div className="flex min-h-screen flex-col bg-canvas">
      <header className="border-b border-slate-200/70 bg-surface">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 sm:px-8">
          <Logo />
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <button type="button" onClick={() => navigate('/login')} className="rounded-xl px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-brand-50 hover:text-brand-700 dark:hover:text-brand-300">Login</button>
          </div>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-4xl flex-1 items-center px-5 py-10 sm:px-8">
        <div className="w-full overflow-hidden rounded-3xl border border-slate-200/70 bg-surface shadow-[0_18px_50px_-30px_rgba(30,41,59,0.4)] lg:grid lg:grid-cols-[1fr_1.1fr]">
          <aside className="hidden flex-col justify-between bg-linear-to-br from-brand-600 to-brand-700 p-8 text-white lg:flex xl:p-10 dark:from-[#0e1424] dark:to-[#080a12]">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/70">Join Ghar Wapasi</p>
              <h2 className="mt-3 font-display text-2xl font-extrabold leading-tight">One account, for the whole community</h2>
            </div>
            <ul className="space-y-5">
              {benefits.map((benefit) => (
                <li key={benefit.title} className="flex items-start gap-3">
                  <svg className="mt-0.5 shrink-0 text-brand-300" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M12 2 4 5.5v5.1c0 5 3.4 9.6 8 11.4 4.6-1.8 8-6.4 8-11.4V5.5Z" /><path d="m8.5 12 2.3 2.3 4.7-4.7" /></svg>
                  <div>
                    <p className="text-sm font-bold">{benefit.title}</p>
                    <p className="mt-0.5 text-xs leading-5 text-white/70">{benefit.description}</p>
                  </div>
                </li>
              ))}
            </ul>
            <p className="rounded-xl bg-white/10 px-4 py-3 text-xs leading-5 text-white/80">
              Aadhaar + mobile number verification keeps the community safe and trustworthy.
            </p>
          </aside>

          <div className="p-6 sm:p-10">
            <div className="mb-8 flex items-center justify-between">
              <button type="button" onClick={goBack} className="flex items-center gap-1.5 text-sm font-semibold text-slate-500 transition-colors hover:text-brand-700 dark:hover:text-brand-300">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M19 12H5m6 6-6-6 6-6" /></svg>
                Back
              </button>
              <div className="flex items-center gap-2">
                <span className={`h-1.5 w-6 rounded-full ${step === 1 ? 'bg-brand-600' : 'bg-slate-200'}`} aria-hidden="true" />
                <span className={`h-1.5 w-6 rounded-full ${step === 2 ? 'bg-brand-600' : 'bg-slate-200'}`} aria-hidden="true" />
              </div>
            </div>

            <div>
              <h1 className="font-display text-2xl font-extrabold tracking-tight text-slate-900">
                {step === 1 ? 'Create your account' : 'Verify your identity'}
              </h1>
              <p className="mt-1.5 text-sm text-slate-500">
                {step === 1
                  ? 'We need Aadhaar and mobile to keep the community verified.'
                  : `Enter the 6-digit code sent to +91 ${form.mobile}.`}
              </p>
            </div>

            {step === 1 ? (
              <form className="mt-7 space-y-5" onSubmit={(e) => { e.preventDefault(); continueToOtp() }}>
                <div>
                  <label htmlFor="signup-name" className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-600">Full Name</label>
                  <div className="relative">
                    <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><circle cx="12" cy="8" r="4" /><path d="M4 21c0-4 3.6-6 8-6s8 2 8 6" /></svg>
                    </span>
                    <input id="signup-name" type="text" value={form.name} onChange={(e) => setField('name', e.target.value)} placeholder="e.g. Priya Sharma" className={inputBase} />
                  </div>
                  {errors.name && <p className="mt-1.5 text-xs font-semibold text-red-500">{errors.name}</p>}
                </div>

                <div>
                  <label htmlFor="signup-aadhar" className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-600">Aadhaar Number</label>
                  <div className="relative">
                    <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><rect x="3" y="6" width="18" height="13" rx="2" /><path d="M7 10h4M7 13h7M16 15h2" /></svg>
                    </span>
                    <input id="signup-aadhar" type="text" inputMode="numeric" value={form.aadhar} onChange={(e) => setField('aadhar', e.target.value.replace(/\D/g, '').slice(0, 12))} placeholder="0000 0000 0000" className={inputBase} />
                  </div>
                  {errors.aadhar && <p className="mt-1.5 text-xs font-semibold text-red-500">{errors.aadhar}</p>}
                </div>

                <div>
                  <label htmlFor="signup-mobile" className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-600">Mobile Number</label>
                  <div className="relative">
                    <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><rect x="7" y="2" width="10" height="20" rx="2" /><path d="M11 18h2" /></svg>
                    </span>
                    <input id="signup-mobile" type="tel" inputMode="numeric" value={form.mobile} onChange={(e) => setField('mobile', e.target.value.replace(/\D/g, '').slice(0, 10))} placeholder="10-digit mobile" className={inputBase} />
                  </div>
                  {errors.mobile && <p className="mt-1.5 text-xs font-semibold text-red-500">{errors.mobile}</p>}
                </div>

                <div>
                  <label htmlFor="signup-password" className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-600">Password</label>
                  <div className="relative">
                    <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><rect x="5" y="11" width="14" height="10" rx="2" /><path d="M8 11V7a4 4 0 0 1 8 0v4" /></svg>
                    </span>
                    <input id="signup-password" type="password" value={form.password} onChange={(e) => setField('password', e.target.value)} placeholder="At least 6 characters" className={inputBase} />
                  </div>
                  {errors.password && <p className="mt-1.5 text-xs font-semibold text-red-500">{errors.password}</p>}
                </div>

                <button type="submit" className="group w-full rounded-xl bg-brand-600 px-6 py-3.5 text-sm font-bold text-white transition-colors hover:bg-brand-700">
                  Continue
                  <svg className="ml-2 inline-block h-3.5 w-3.5 transition-transform group-hover:translate-x-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6" /></svg>
                </button>

                <div className="flex items-center gap-3">
                  <span className="h-px flex-1 bg-slate-200" aria-hidden="true" />
                  <span className="text-[11px] font-bold uppercase tracking-wide text-slate-400">or</span>
                  <span className="h-px flex-1 bg-slate-200" aria-hidden="true" />
                </div>

                <button type="button" onClick={verifyDigiLocker} className="flex w-full items-center justify-center gap-2.5 rounded-xl border border-slate-200 px-6 py-3 text-sm font-bold text-slate-700 transition-colors hover:border-brand-400 hover:text-brand-700 dark:hover:text-brand-300">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><rect x="3" y="6" width="18" height="13" rx="2" /><path d="M7 10h4M7 13h7M16 15h2" /></svg>
                  Verify with DigiLocker
                </button>

                <p className="text-center text-xs leading-5 text-slate-400">
                  Already have an account?{' '}
                  <button type="button" onClick={() => navigate('/login')} className="font-bold text-brand-700 hover:text-brand-800 dark:text-brand-300 dark:hover:text-brand-200">Log in</button>
                </p>
              </form>
            ) : (
              <div className="mt-7">
                <div className="flex justify-center gap-2.5 sm:gap-3">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      ref={(el) => { otpRefs.current[index] = el }}
                      value={digit}
                      inputMode="numeric"
                      maxLength={1}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(index, e.key)}
                      className="h-12 w-10 rounded-xl border border-slate-200 bg-surface text-center font-display text-lg font-bold text-slate-900 outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-100 sm:h-14 sm:w-12"
                      aria-label={`OTP digit ${index + 1}`}
                    />
                  ))}
                </div>

                <button type="button" onClick={() => verifyOtp()} className="group mt-7 w-full rounded-xl bg-brand-600 px-6 py-3.5 text-sm font-bold text-white transition-colors hover:bg-brand-700">
                  Verify & Create Account
                  <svg className="ml-2 inline-block h-3.5 w-3.5 transition-transform group-hover:translate-x-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6" /></svg>
                </button>

                <div className="mt-5 flex items-center gap-3">
                  <span className="h-px flex-1 bg-slate-200" aria-hidden="true" />
                  <span className="text-[11px] font-bold uppercase tracking-wide text-slate-400">alternative</span>
                  <span className="h-px flex-1 bg-slate-200" aria-hidden="true" />
                </div>

                <button type="button" onClick={verifyDigiLocker} className="mt-5 flex w-full items-center justify-center gap-2.5 rounded-xl border border-slate-200 px-6 py-3 text-sm font-bold text-slate-700 transition-colors hover:border-brand-400 hover:text-brand-700">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><rect x="3" y="6" width="18" height="13" rx="2" /><path d="M7 10h4M7 13h7M16 15h2" /></svg>
                  Verify with DigiLocker
                </button>

                <p className="mt-5 text-center text-xs text-slate-400">
                  Didn’t get the code?{' '}
                  <button type="button" onClick={resendOtp} className="font-bold text-brand-700 hover:text-brand-800 dark:text-brand-300 dark:hover:text-brand-200">Resend OTP</button>
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

export default SignupPage