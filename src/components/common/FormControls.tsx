import type { ReactNode } from 'react'
import { inputClass } from './formStyles'

export function Field({ label, required, hint, children }: { label: string; required?: boolean; hint?: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="text-xs font-bold uppercase tracking-wide text-slate-500">
        {label}
        {required && <span className="text-rose-500"> *</span>}
      </span>
      <div className="mt-2">{children}</div>
      {hint && <p className="mt-1.5 text-xs leading-5 text-slate-400">{hint}</p>}
    </label>
  )
}

export function TextInput({
  value,
  onChange,
  placeholder,
  type = 'text',
  inputMode,
  maxLength,
}: {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  type?: string
  inputMode?: 'text' | 'numeric' | 'tel'
  maxLength?: number
}) {
  return (
    <input
      className={inputClass}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      type={type}
      inputMode={inputMode}
      maxLength={maxLength}
    />
  )
}

export function TextAreaInput({ value, onChange, placeholder }: { value: string; onChange: (value: string) => void; placeholder?: string }) {
  return <textarea className={`${inputClass} min-h-[92px] resize-y`} value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} />
}

export function SelectInput({ value, onChange, options, placeholder = 'Select...' }: { value: string; onChange: (value: string) => void; options: string[]; placeholder?: string }) {
  return (
    <select className={inputClass} value={value} onChange={(event) => onChange(event.target.value)}>
      <option value="">{placeholder}</option>
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  )
}

export function PhotoUpload({ label, hint, required, files, onChange }: { label: string; hint: string; required?: boolean; files: File[]; onChange: (files: File[]) => void }) {
  const addFiles = (incoming: FileList | null) => {
    if (!incoming) return
    onChange([...files, ...Array.from(incoming)])
  }
  return (
    <div>
      <span className="text-xs font-bold uppercase tracking-wide text-slate-500">
        {label}
        {required && <span className="text-rose-500"> *</span>}
      </span>
      <label className="mt-2 flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 px-4 py-6 text-center hover:border-brand-400">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="text-slate-400" aria-hidden="true">
          <path d="M14.5 4h-5L8 6H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-4l-1.5-2Z" />
          <circle cx="12" cy="13" r="3.5" />
        </svg>
        <span className="mt-2 text-sm font-semibold text-slate-700">Click to upload photos</span>
        <span className="mt-0.5 text-xs text-slate-400">{hint}</span>
        <input type="file" accept="image/*" multiple className="hidden" onChange={(event) => addFiles(event.target.files)} />
      </label>
      {files.length > 0 && (
        <ul className="mt-3 flex flex-wrap gap-2">
          {files.map((file, index) => (
            <li key={`${file.name}-${index}`} className="inline-flex max-w-full items-center gap-2 rounded-full border border-slate-200 bg-canvas px-3 py-1 text-xs font-semibold text-slate-600">
              <span className="truncate">{file.name}</span>
              <button type="button" onClick={() => onChange(files.filter((_, i) => i !== index))} className="text-slate-400 hover:text-rose-500" aria-label="Remove">
                ×
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export function OtpBlock({
  aadhaar,
  mobile,
  sent,
  code,
  verified,
  onSend,
  onCodeChange,
  onVerify,
  requireAadhaar = true,
}: {
  aadhaar: string
  mobile: string
  sent: boolean
  code: string
  verified: boolean
  onSend: () => void
  onCodeChange: (value: string) => void
  onVerify: () => void
  requireAadhaar?: boolean
}) {
  if (verified) {
    return (
      <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3.5 py-3 text-sm font-semibold text-emerald-700 dark:border-emerald-400/30 dark:bg-emerald-950/30 dark:text-emerald-300">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true">
          <path d="m5 13 4 4L19 7" />
        </svg>
        {requireAadhaar ? 'Aadhaar-linked mobile verified' : 'Mobile number verified'}
      </div>
    )
  }
  const canSend = (requireAadhaar ? aadhaar.length === 12 : true) && mobile.length === 10
  return (
    <div className="rounded-xl border border-slate-200 bg-canvas p-4">
      <p className="text-xs font-semibold leading-5 text-slate-500">
        {requireAadhaar ? 'This Aadhaar-linked mobile number must be verified with an OTP before you can continue.' : 'This mobile number must be verified with an OTP before you can continue.'}
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        <button
          type="button"
          disabled={!canSend}
          onClick={onSend}
          className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-bold text-white hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {sent ? 'Resend OTP' : 'Send OTP'}
        </button>
        {sent && (
          <div className="flex flex-1 flex-wrap gap-2">
            <input
              className={`${inputClass} min-w-[160px] flex-1`}
              value={code}
              onChange={(event) => onCodeChange(event.target.value)}
              inputMode="numeric"
              maxLength={6}
              placeholder="Enter 6-digit OTP"
            />
            <button type="button" onClick={onVerify} className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-bold text-slate-700 hover:border-brand-400 hover:text-brand-700 dark:hover:text-brand-300">
              Verify
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export function ConsentCheckbox({ checked, onChange, children }: { checked: boolean; onChange: (value: boolean) => void; children: ReactNode }) {
  return (
    <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-slate-200 bg-canvas p-4">
      <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} className="mt-0.5 h-4 w-4 accent-brand-600" />
      <span className="text-sm leading-6 text-slate-600">{children}</span>
    </label>
  )
}
