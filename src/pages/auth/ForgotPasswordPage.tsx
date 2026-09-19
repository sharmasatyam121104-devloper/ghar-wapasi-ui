import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import Logo from '../../components/common/Logo'

const OTP_LENGTH = 6

const inputBase = 'w-full rounded-xl border border-slate-200 bg-white px-4 py-3 pl-11 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-brand-400 focus:ring-2 focus:ring-brand-100'

function ForgotPasswordPage() {
  const navigate = useNavigate()
  const otpRefs = useRef<(HTMLInputElement | null)[]>([])

  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [aadhar, setAadhar] = useState('')
  const [mobile, setMobile] = useState('98765 43210')
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(''))
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})

  const goBack = () => {
    if (step === 2) {
      setStep(1)
      return
    }
    if (step === 3) {
      setStep(2)
      return
    }
    navigate(-1)
  }

  const sendOtp = () => {
    if (!/^\d{12}$/.test(aadhar)) {
      setErrors({ aadhar: 'Enter a valid 12-digit Aadhaar number.' })
      return
    }
    setErrors({})
    setMobile('98765 43210')
    setStep(2)
    toast.info(`OTP sent to your linked mobile number (+91 ${mobile})`)
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
    toast.success('OTP verified')
    setStep(3)
  }

  const resendOtp = () => toast.info('OTP resent (Demo). Check your mobile.')

  const setNewPassword = () => {
    const next: Record<string, string> = {}
    if (password.length < 6) next.password = 'Password must be at least 6 characters.'
    if (confirmPassword !== password) next.confirmPassword = 'Passwords do not match.'
    setErrors(next)
    if (Object.keys(next).length > 0) return
    toast.success('Password updated successfully (Demo). Please log in.')
    navigate('/login')
  }

  return (
    <div className="flex min-h-screen flex-col bg-canvas">
      <header className="border-b border-slate-200/70 bg-white/85 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 sm:px-8">
          <Logo />
          <button type="button" onClick={() => navigate('/login')} className="rounded-xl px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-brand-50 hover:text-brand-700">Log in</button>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-2xl flex-1 items-center px-5 py-10 sm:px-8">
        <div className="w-full overflow-hidden rounded-3xl border border-slate-200/70 bg-white p-6 shadow-[0_18px_50px_-30px_rgba(30,41,59,0.4)] sm:p-10">
          <div className="mb-8 flex items-center justify-between">
            <button type="button" onClick={goBack} className="flex items-center gap-1.5 text-sm font-semibold text-slate-500 transition-colors hover:text-brand-700">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M19 12H5m6 6-6-6 6-6" /></svg>
              Back
            </button>
            <div className="flex items-center gap-2">
              <span className={`h-1.5 w-6 rounded-full ${step >= 1 ? 'bg-brand-600' : 'bg-slate-200'}`} aria-hidden="true" />
              <span className={`h-1.5 w-6 rounded-full ${step >= 2 ? 'bg-brand-600' : 'bg-slate-200'}`} aria-hidden="true" />
              <span className={`h-1.5 w-6 rounded-full ${step >= 3 ? 'bg-brand-600' : 'bg-slate-200'}`} aria-hidden="true" />
            </div>
          </div>

          <div>
            <h1 className="font-display text-2xl font-extrabold tracking-tight text-slate-900">
              {step === 1 && 'Forgot your password?'}
              {step === 2 && 'Verify your identity'}
              {step === 3 && 'Set a new password'}
            </h1>
            <p className="mt-1.5 text-sm text-slate-500">
              {step === 1 && 'Enter your Aadhaar number. We’ll send an OTP to your linked mobile number.'}
              {step === 2 && `Enter the 6-digit code sent to +91 ${mobile}.`}
              {step === 3 && `Pick a new password for the account linked to +91 ${mobile}.`}
            </p>
          </div>

          {step === 1 && (
            <form className="mt-7 space-y-5" onSubmit={(e) => { e.preventDefault(); sendOtp() }}>
              <div>
                <label htmlFor="forgot-aadhar" className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-600">Aadhaar Number</label>
                <div className="relative">
                  <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><rect x="3" y="6" width="18" height="13" rx="2" /><path d="M7 10h4M7 13h7M16 15h2" /></svg>
                  </span>
                  <input id="forgot-aadhar" type="text" inputMode="numeric" value={aadhar} onChange={(e) => setAadhar(e.target.value.replace(/\D/g, '').slice(0, 12))} placeholder="0000 0000 0000" className={inputBase} />
                </div>
                {errors.aadhar && <p className="mt-1.5 text-xs font-semibold text-red-500">{errors.aadhar}</p>}
              </div>

              <button type="submit" className="group w-full rounded-xl bg-brand-600 px-6 py-3.5 text-sm font-bold text-white transition-colors hover:bg-brand-700">
                Send OTP
                <svg className="ml-2 inline-block h-3.5 w-3.5 transition-transform group-hover:translate-x-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6" /></svg>
              </button>

              <p className="text-center text-xs leading-5 text-slate-400">
                Remembered it after all?{' '}
                <button type="button" onClick={() => navigate('/login')} className="font-bold text-brand-700 hover:text-brand-800">Log in</button>
              </p>
            </form>
          )}

          {step === 2 && (
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
                    className="h-12 w-10 rounded-xl border border-slate-200 bg-white text-center font-display text-lg font-bold text-slate-900 outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-100 sm:h-14 sm:w-12"
                    aria-label={`OTP digit ${index + 1}`}
                  />
                ))}
              </div>

              <button type="button" onClick={() => verifyOtp()} className="group mt-7 w-full rounded-xl bg-brand-600 px-6 py-3.5 text-sm font-bold text-white transition-colors hover:bg-brand-700">
                Verify OTP
                <svg className="ml-2 inline-block h-3.5 w-3.5 transition-transform group-hover:translate-x-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6" /></svg>
              </button>

              <p className="mt-5 text-center text-xs text-slate-400">
                Didn’t get the code?{' '}
                <button type="button" onClick={resendOtp} className="font-bold text-brand-700 hover:text-brand-800">Resend OTP</button>
              </p>
            </div>
          )}

          {step === 3 && (
            <form className="mt-7 space-y-5" onSubmit={(e) => { e.preventDefault(); setNewPassword() }}>
              <div>
                <label htmlFor="new-password" className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-600">New Password</label>
                <div className="relative">
                  <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><rect x="5" y="11" width="14" height="10" rx="2" /><path d="M8 11V7a4 4 0 0 1 8 0v4" /></svg>
                  </span>
                  <input id="new-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="At least 6 characters" className={inputBase} />
                </div>
                {errors.password && <p className="mt-1.5 text-xs font-semibold text-red-500">{errors.password}</p>}
              </div>

              <div>
                <label htmlFor="confirm-password" className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-600">Confirm Password</label>
                <div className="relative">
                  <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><rect x="5" y="11" width="14" height="10" rx="2" /><path d="M8 11V7a4 4 0 0 1 8 0v4M8 15h8" /></svg>
                  </span>
                  <input id="confirm-password" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Re-enter your password" className={inputBase} />
                </div>
                {errors.confirmPassword && <p className="mt-1.5 text-xs font-semibold text-red-500">{errors.confirmPassword}</p>}
              </div>

              <button type="submit" className="group w-full rounded-xl bg-brand-600 px-6 py-3.5 text-sm font-bold text-white transition-colors hover:bg-brand-700">
                Set Password
                <svg className="ml-2 inline-block h-3.5 w-3.5 transition-transform group-hover:translate-x-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6" /></svg>
              </button>
            </form>
          )}
        </div>
      </main>
    </div>
  )
}

export default ForgotPasswordPage