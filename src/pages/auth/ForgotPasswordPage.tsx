import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import Logo from '../../components/common/Logo'
import ThemeToggle from '../../components/common/ThemeToggle'
import { forgotPasswordRequest } from '../../api/auth'
import { errorMessage } from '../../api/client'

const inputBase = 'w-full rounded-xl border border-slate-200 bg-surface px-4 py-3 pl-11 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-brand-400 focus:ring-2 focus:ring-brand-100'

function ForgotPasswordPage() {
  const navigate = useNavigate()

  const [identifier, setIdentifier] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const submit = async () => {
    const value = identifier.trim()
    if (!value) {
      setError('Enter the email, mobile or Aadhaar linked to your account.')
      return
    }
    setError('')
    setBusy(true)
    try {
      const result = await forgotPasswordRequest(value)
      toast.success(result.message || 'If that account exists, a reset link has been sent.')
      navigate('/login', { replace: true })
    } catch (caught) {
      toast.error(errorMessage(caught))
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
            <button type="button" onClick={() => navigate('/login')} className="rounded-xl px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-brand-50 hover:text-brand-700 dark:hover:text-brand-300">Log in</button>
          </div>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-2xl flex-1 items-center px-5 py-10 sm:px-8">
        <div className="w-full overflow-hidden rounded-3xl border border-slate-200/70 bg-surface p-6 shadow-[0_18px_50px_-30px_rgba(30,41,59,0.4)] sm:p-10">
          <div>
            <h1 className="font-display text-2xl font-extrabold tracking-tight text-slate-900">Forgot your password?</h1>
            <p className="mt-1.5 text-sm text-slate-500">
              Enter the email, mobile number or Aadhaar linked to your account and we’ll send a reset link.
            </p>
          </div>

          <form className="mt-7 space-y-5" onSubmit={(e) => { e.preventDefault(); void submit() }}>
            <div>
              <label htmlFor="forgot-identifier" className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-600">Account identifier</label>
              <div className="relative">
                <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><rect x="3" y="6" width="18" height="13" rx="2" /><path d="M7 10h4M7 13h7M16 15h2" /></svg>
                </span>
                <input
                  id="forgot-identifier"
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="you@example.com or 0000 0000 0000"
                  className={inputBase}
                />
              </div>
              {error && <p className="mt-1.5 text-xs font-semibold text-red-500">{error}</p>}
            </div>

            <button type="submit" disabled={busy} className="group w-full rounded-xl bg-brand-600 px-6 py-3.5 text-sm font-bold text-white transition-colors hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60">
              {busy ? 'Sending…' : 'Send reset link'}
              <svg className="ml-2 inline-block h-3.5 w-3.5 transition-transform group-hover:translate-x-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6" /></svg>
            </button>

            <p className="text-center text-xs leading-5 text-slate-400">
              Remembered it after all?{' '}
              <button type="button" onClick={() => navigate('/login')} className="font-bold text-brand-700 hover:text-brand-800 dark:text-brand-300 dark:hover:text-brand-200">Log in</button>
            </p>
          </form>
        </div>
      </main>
    </div>
  )
}

export default ForgotPasswordPage
