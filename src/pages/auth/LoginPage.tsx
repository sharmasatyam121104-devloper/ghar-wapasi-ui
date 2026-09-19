import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import Logo from '../../components/common/Logo'

const inputBase = 'w-full rounded-xl border border-slate-200 bg-white px-4 py-3 pl-11 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-brand-400 focus:ring-2 focus:ring-brand-100'

function LoginPage() {
  const navigate = useNavigate()
  const [aadhar, setAadhar] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleLogin = () => {
    const next: Record<string, string> = {}
    if (!/^\d{12}$/.test(aadhar)) next.aadhar = 'Enter a valid 12-digit Aadhaar number.'
    if (!password) next.password = 'Password is required.'
    setErrors(next)
    if (Object.keys(next).length > 0) return
    toast.success('Logged in successfully (Demo). Welcome back!')
    navigate('/public/dashboard')
  }

  const forgotPassword = () => navigate('/forgot-password')

  return (
    <div className="flex min-h-screen flex-col bg-canvas">
      <header className="border-b border-slate-200/70 bg-white/85 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 sm:px-8">
          <Logo />
          <button type="button" onClick={() => navigate('/signup')} className="rounded-xl bg-brand-600 px-4 py-2 text-sm font-bold text-white hover:bg-brand-700">Sign Up</button>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-4xl flex-1 items-center px-5 py-10 sm:px-8">
        <div className="w-full overflow-hidden rounded-3xl border border-slate-200/70 bg-white shadow-[0_18px_50px_-30px_rgba(30,41,59,0.4)] lg:grid lg:grid-cols-[1fr_1.1fr]">
          <aside className="hidden flex-col justify-between bg-gradient-to-br from-brand-600 to-brand-700 p-8 text-white lg:flex xl:p-10">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/70">Welcome back</p>
              <h2 className="mt-3 font-display text-2xl font-extrabold leading-tight">Log in to continue your journey</h2>
            </div>
            <ul className="space-y-5">
              <li className="flex items-start gap-3">
                <svg className="mt-0.5 shrink-0 text-brand-300" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M12 20h9M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" /></svg>
                <div>
                  <p className="text-sm font-bold">Track your complaint</p>
                  <p className="mt-0.5 text-xs leading-5 text-white/70">See the live status of every case you reported.</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <svg className="mt-0.5 shrink-0 text-brand-300" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M12 21s-7-4.6-9.5-9A5.5 5.5 0 0 1 12 6.5 5.5 5.5 0 0 1 21.5 12c-2.5 4.4-9.5 9-9.5 9Z" /><circle cx="12" cy="12" r="2.5" /></svg>
                <div>
                  <p className="text-sm font-bold">Get 6 km alerts</p>
                  <p className="mt-0.5 text-xs leading-5 text-white/70">Never miss a missing person alert near you.</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <svg className="mt-0.5 shrink-0 text-brand-300" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><rect x="5" y="11" width="14" height="10" rx="2" /><path d="M8 11V7a4 4 0 0 1 8 0v4M12 15v2" /></svg>
                <div>
                  <p className="text-sm font-bold">Your data is safe</p>
                  <p className="mt-0.5 text-xs leading-5 text-white/70">Secure, verified access for the whole community.</p>
                </div>
              </li>
            </ul>
            <p className="rounded-xl bg-white/10 px-4 py-3 text-xs leading-5 text-white/80">
              Use the Aadhaar number and password you chose during sign up.
            </p>
          </aside>

          <div className="p-6 sm:p-10">
            <div className="mb-8">
              <button type="button" onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-sm font-semibold text-slate-500 transition-colors hover:text-brand-700">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M19 12H5m6 6-6-6 6-6" /></svg>
                Back
              </button>
            </div>

            <div>
              <h1 className="font-display text-2xl font-extrabold tracking-tight text-slate-900">Log in</h1>
              <p className="mt-1.5 text-sm text-slate-500">Enter your Aadhaar number and password to continue.</p>
            </div>

            <form className="mt-7 space-y-5" onSubmit={(e) => { e.preventDefault(); handleLogin() }}>
              <div>
                <label htmlFor="login-aadhar" className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-600">Aadhaar Number</label>
                <div className="relative">
                  <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><rect x="3" y="6" width="18" height="13" rx="2" /><path d="M7 10h4M7 13h7M16 15h2" /></svg>
                  </span>
                  <input id="login-aadhar" type="text" inputMode="numeric" value={aadhar} onChange={(e) => setAadhar(e.target.value.replace(/\D/g, '').slice(0, 12))} placeholder="0000 0000 0000" className={inputBase} />
                </div>
                {errors.aadhar && <p className="mt-1.5 text-xs font-semibold text-red-500">{errors.aadhar}</p>}
              </div>

              <div>
                <div className="mb-1.5 flex items-center justify-between">
                  <label htmlFor="login-password" className="block text-xs font-bold uppercase tracking-wide text-slate-600">Password</label>
                  <button type="button" onClick={forgotPassword} className="text-xs font-bold text-brand-700 hover:text-brand-800">Forgot password?</button>
                </div>
                <div className="relative">
                  <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><rect x="5" y="11" width="14" height="10" rx="2" /><path d="M8 11V7a4 4 0 0 1 8 0v4" /></svg>
                  </span>
                  <input id="login-password" type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" className={inputBase} />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 transition-colors hover:text-brand-600"
                  >
                    {showPassword ? (
                      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M3 3l18 18M10.6 10.6a2 2 0 0 0 2.8 2.8M7.5 7.5C5.8 8.7 4.6 10.2 3.5 12c1.9 3 5.5 5 8.5 5 1.6 0 3-.5 4.3-1.3M10.4 5.6C11 5.5 11.6 5.5 12 5.5c3 0 6.6 2 8.5 5-.3.5-.7 1-1.2 1.5" /></svg>
                    ) : (
                      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M2.5 12s3.5-6.5 9.5-6.5S21.5 12 21.5 12s-3.5 6.5-9.5 6.5S2.5 12 2.5 12Z" /><circle cx="12" cy="12" r="2.5" /></svg>
                    )}
                  </button>
                </div>
                {errors.password && <p className="mt-1.5 text-xs font-semibold text-red-500">{errors.password}</p>}
              </div>

              <button type="submit" className="group w-full rounded-xl bg-brand-600 px-6 py-3.5 text-sm font-bold text-white transition-colors hover:bg-brand-700">
                Log in
                <svg className="ml-2 inline-block h-3.5 w-3.5 transition-transform group-hover:translate-x-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6" /></svg>
              </button>

              <p className="text-center text-sm text-slate-500">
                New to Ghar Wapasi?{' '}
                <button type="button" onClick={() => navigate('/signup')} className="font-bold text-brand-700 hover:text-brand-800">Create an account</button>
              </p>
            </form>
          </div>
        </div>
      </main>
    </div>
  )
}

export default LoginPage