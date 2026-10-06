import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import Logo from '../../components/common/Logo'
import ThemeToggle from '../../components/common/ThemeToggle'
import { ApiError } from '../../api/client'
import { registerPublicRequest } from '../../api/auth'
import { establishSession } from '../../data/session'

const benefits = [
  { title: 'Raise & track complaints', description: 'File a missing person report and follow its status anytime.' },
  { title: 'Get 6 km alerts', description: 'Be notified instantly about missing people near your location.' },
  { title: 'Verified & private', description: 'Identity verified with Aadhaar and mobile. Your data stays safe.' },
]

const inputBase = 'w-full rounded-xl border border-slate-200 bg-surface px-4 py-3 pl-11 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-brand-400 focus:ring-2 focus:ring-brand-100'

function SignupPage() {
  const navigate = useNavigate()

  const [form, setForm] = useState({ name: '', aadhar: '', mobile: '', password: '' })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [busy, setBusy] = useState(false)

  const setField = (field: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => ({ ...prev, [field]: '' }))
  }

  const validate = (): boolean => {
    const next: Record<string, string> = {}
    const [first, ...rest] = form.name.trim().split(/\s+/).filter(Boolean)
    if (!first || rest.length === 0) next.name = 'Enter your full name (first and last name).'
    if (!/^\d{12}$/.test(form.aadhar)) next.aadhar = 'Enter a valid 12-digit Aadhaar number.'
    if (!/^\d{10}$/.test(form.mobile)) next.mobile = 'Enter a valid 10-digit mobile number.'
    if (form.password.length < 6) next.password = 'Password must be at least 6 characters.'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSignup = async () => {
    if (!validate()) return
    const [first, ...rest] = form.name.trim().split(/\s+/).filter(Boolean)
    setBusy(true)
    try {
      const result = await registerPublicRequest({
        first_name: first,
        last_name: rest.join(' '),
        aadhaar: form.aadhar,
        mobile: form.mobile,
        password: form.password,
      })
      establishSession(result.user, form.mobile)
      toast.success('Account created successfully. Welcome to Ghar Wapasi!')
      navigate('/public/dashboard', { replace: true })
    } catch (error) {
      if (error instanceof ApiError && error.errors) {
        const mapped: Record<string, string> = { ...error.errors }
        const nameError = mapped.first_name ?? mapped.last_name
        setErrors({
          name: nameError ?? '',
          aadhar: mapped.aadhaar ?? '',
          mobile: mapped.mobile ?? '',
          password: mapped.password ?? '',
        })
        delete mapped.first_name
        delete mapped.last_name
        const remaining = Object.values(mapped).filter(Boolean)
        toast.error(remaining[0] || error.message)
      } else {
        toast.error(error instanceof Error ? error.message : 'Sign up failed.')
      }
    } finally {
      setBusy(false)
    }
  }

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
              <button type="button" onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-sm font-semibold text-slate-500 transition-colors hover:text-brand-700 dark:hover:text-brand-300">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M19 12H5m6 6-6-6 6-6" /></svg>
                Back
              </button>
            </div>

            <div>
              <h1 className="font-display text-2xl font-extrabold tracking-tight text-slate-900">Create your account</h1>
              <p className="mt-1.5 text-sm text-slate-500">We need Aadhaar and mobile to keep the community verified.</p>
            </div>

            <form className="mt-7 space-y-5" onSubmit={(e) => { e.preventDefault(); void handleSignup() }}>
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
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><rect x="7" y="4" width="10" height="20" rx="2" /><path d="M11 18h2" /></svg>
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

              <button type="submit" disabled={busy} className="group w-full rounded-xl bg-brand-600 px-6 py-3.5 text-sm font-bold text-white transition-colors hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60">
                {busy ? 'Creating account…' : 'Create account'}
                <svg className="ml-2 inline-block h-3.5 w-3.5 transition-transform group-hover:translate-x-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6" /></svg>
              </button>

              <p className="text-center text-xs leading-5 text-slate-400">
                Already have an account?{' '}
                <button type="button" onClick={() => navigate('/login')} className="font-bold text-brand-700 hover:text-brand-800 dark:text-brand-300 dark:hover:text-brand-200">Log in</button>
              </p>
            </form>
          </div>
        </div>
      </main>
    </div>
  )
}

export default SignupPage
