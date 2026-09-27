import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import Logo from '../../components/common/Logo'
import ThemeToggle from '../../components/common/ThemeToggle'
import { useAdminConsole } from '../../data/admin'
import { continueAsPublic, demoIdentities, login, ROLE_HOME, ROLE_LABEL, signOut, useSession } from '../../data/session'

const inputBase = 'w-full rounded-xl border border-slate-200 bg-surface px-4 py-3 pl-11 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-brand-400 focus:ring-2 focus:ring-brand-100'

const roleDot: Record<string, string> = {
  public: 'bg-slate-400',
  police: 'bg-brand-600',
  ngo: 'bg-amber-500',
  admin: 'bg-admin-600',
}

function LoginPage() {
  const navigate = useNavigate()
  const state = useAdminConsole()
  const session = useSession()
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const rows = demoIdentities(state.admins)

  const handleLogin = () => {
    const next: Record<string, string> = {}
    if (!identifier.trim()) next.identifier = 'Enter your email or 12-digit Aadhaar number.'
    if (!password) next.password = 'Password is required.'
    setErrors(next)
    if (Object.keys(next).length > 0) return

    const active = login(identifier, password, state.admins)
    toast.success(`Logged in as ${ROLE_LABEL[active.role]}.`)
    navigate(ROLE_HOME[active.role], { replace: true })
  }

  const fillDemo = (value: string) => {
    setIdentifier(value)
    setPassword('demo@1234')
    setErrors({})
  }

  const forgotPassword = () => navigate('/forgot-password')

  if (session) {
    return (
      <div className="flex min-h-screen flex-col bg-canvas">
        <header className="border-b border-slate-200/70 bg-surface">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 sm:px-8">
            <Logo />
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <button
                type="button"
                onClick={() => {
                  signOut()
                  setIdentifier('')
                  setPassword('')
                  toast.success('Signed out.')
                }}
                className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-bold text-slate-600 hover:border-rose-300 hover:text-rose-600 sm:py-2"
              >
                Sign out
              </button>
            </div>
          </div>
        </header>

        <main className="mx-auto flex w-full max-w-4xl flex-1 items-center px-4 py-8 sm:px-8 sm:py-10">
          <div className="w-full rounded-3xl border border-slate-200/70 bg-surface p-6 shadow-[0_18px_50px_-30px_rgba(30,41,59,0.4)] sm:p-10">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-600 dark:text-brand-300">Already signed in</p>
            <h1 className="mt-3 font-display text-xl font-extrabold tracking-tight text-slate-900 sm:text-2xl">Continue to your {ROLE_LABEL[session.role]} panel</h1>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Signed in as <span className="font-bold text-slate-700 dark:text-slate-200">{session.name}</span> ({session.identifier}).
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <button
                type="button"
                onClick={() => navigate(ROLE_HOME[session.role], { replace: true })}
                className="w-full rounded-xl bg-brand-600 px-5 py-3 text-sm font-bold text-white hover:bg-brand-700 sm:w-auto"
              >
                Open panel
              </button>
              <button
                type="button"
                onClick={() => navigate('/')}
                className="w-full rounded-xl border border-slate-200 px-5 py-3 text-sm font-bold text-slate-600 hover:border-brand-400 hover:text-brand-700 sm:w-auto"
              >
                Go to home
              </button>
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col bg-canvas">
      <header className="border-b border-slate-200/70 bg-surface">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 sm:px-8">
          <Logo />
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <button type="button" onClick={() => navigate('/signup')} className="rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-brand-700 sm:py-2">Sign Up</button>
            </div>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-6xl flex-1 items-start px-4 py-8 sm:px-8 sm:py-10 lg:items-center">
        <div className="grid w-full gap-5 sm:gap-6 lg:grid-cols-[1fr_1.05fr]">
          <div className="w-full overflow-hidden rounded-3xl border border-slate-200/70 bg-surface shadow-[0_18px_50px_-30px_rgba(30,41,59,0.4)]">
            <div className="hidden flex-col justify-between bg-gradient-to-br from-brand-600 to-brand-700 p-8 text-white lg:flex xl:p-10 dark:from-[#0e1424] dark:to-[#080a12]">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/70">One login for everyone</p>
                <h2 className="mt-3 font-display text-2xl font-extrabold leading-tight">Enter your ID — we open the right panel</h2>
                <p className="mt-2 text-sm leading-6 text-white/75">
                  Citizen, police officer, NGO member or verification admin. The role comes from the server, so you never pick it yourself.
                </p>
              </div>
              <ul className="mt-6 space-y-2 text-sm text-white/85">
                <li className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-slate-300" />Public user → citizen dashboard</li>
                <li className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-brand-300" />Police officer → police dashboard</li>
                <li className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-amber-300" />NGO member → NGO dashboard</li>
                <li className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-admin-300" />Admin → verification panel</li>
              </ul>
            </div>

            <div className="p-5 sm:p-8">
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-brand-600 lg:hidden dark:text-brand-300">One login for everyone</p>
              <h1 className="mt-1 font-display text-xl font-extrabold tracking-tight text-slate-900 sm:text-2xl lg:mt-0">Log in</h1>
              <p className="mt-1.5 text-sm leading-6 text-slate-500">Use the email or Aadhaar number linked to your account.</p>

              <form className="mt-6 space-y-5" onSubmit={(e) => { e.preventDefault(); handleLogin() }}>
                <div>
                  <label htmlFor="login-identifier" className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-600">Email or Aadhaar Number</label>
                  <div className="relative">
                    <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><rect x="3" y="6" width="18" height="13" rx="2" /><path d="M7 10h4M7 13h7M16 15h2" /></svg>
                    </span>
                    <input
                      id="login-identifier"
                      type="text"
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      placeholder="you@example.com or 0000 0000 0000"
                      className={inputBase}
                    />
                  </div>
                  {errors.identifier && <p className="mt-1.5 text-xs font-semibold text-red-500">{errors.identifier}</p>}
                </div>

                <div>
                  <div className="mb-1.5 flex items-center justify-between">
                    <label htmlFor="login-password" className="block text-xs font-bold uppercase tracking-wide text-slate-600">Password</label>
                    <button type="button" onClick={forgotPassword} className="text-xs font-bold text-brand-700 hover:text-brand-800 dark:text-brand-300 dark:hover:text-brand-200">Forgot password?</button>
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

                <div className="flex items-center gap-3 pt-1">
                  <span className="h-px flex-1 bg-slate-200" />
                  <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-400">or</span>
                  <span className="h-px flex-1 bg-slate-200" />
                </div>

                <button
                  type="button"
                  onClick={() => {
                    continueAsPublic()
                    toast.success('Continuing as a public user.')
                    navigate(ROLE_HOME.public, { replace: true })
                  }}
                  className="flex w-full items-center justify-center gap-2.5 rounded-xl border border-slate-200 bg-canvas px-6 py-3.5 text-sm font-bold text-slate-700 transition hover:border-brand-400 hover:text-brand-700"
                >
                  <span className="h-2 w-2 rounded-full bg-slate-400" />
                  Continue as a public user
                </button>
                <p className="-mt-2 text-center text-xs leading-5 text-slate-500">
                  No account needed to browse the site, raise a missing-person complaint or track a case.
                </p>

                <p className="text-center text-sm text-slate-500">
                  New to Ghar Wapasi?{' '}
                  <button type="button" onClick={() => navigate('/signup')} className="font-bold text-brand-700 hover:text-brand-800 dark:text-brand-300 dark:hover:text-brand-200">Create an account</button>
                </p>
              </form>
            </div>
          </div>

          <div className="w-full rounded-3xl border border-slate-200/70 bg-surface p-5 shadow-[0_18px_50px_-30px_rgba(30,41,59,0.4)] sm:p-8">
            <h2 className="font-display text-lg font-extrabold tracking-tight text-slate-900">Demo logins</h2>
            <p className="mt-1.5 text-sm leading-6 text-slate-500">Tap any row to fill the form. Password auto-fills.</p>
            <ul className="mt-5 space-y-2 lg:max-h-[26rem] lg:overflow-y-auto lg:pr-1">
              {rows.map((row) => (
                <li key={`${row.role}-${row.identifier}`}>
                  <button
                    type="button"
                    onClick={() => fillDemo(row.identifier)}
                    className="flex w-full items-center gap-3 rounded-xl border border-slate-200 bg-canvas px-4 py-3 text-left transition hover:border-brand-400 hover:bg-brand-50/60 dark:hover:bg-brand-950/30"
                  >
                    <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${roleDot[row.role]}`} />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-bold text-slate-900">{row.label}</span>
                      <span className="block truncate text-xs text-slate-500">{row.identifier} · {row.detail}</span>
                    </span>
                    <span className="hidden shrink-0 text-[10px] font-extrabold uppercase tracking-wide text-slate-400 sm:block">{ROLE_LABEL[row.role]}</span>
                  </button>
                </li>
              ))}
            </ul>
            <p className="mt-5 rounded-xl border border-slate-200 bg-canvas px-4 py-3 text-xs leading-5 text-slate-500">
              Demo mode: the role is resolved locally. In production this comes from the server response, so the same form never changes — only the panel behind it.
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}

export default LoginPage
