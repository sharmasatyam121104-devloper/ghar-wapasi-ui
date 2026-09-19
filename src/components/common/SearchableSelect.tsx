import { useEffect, useMemo, useRef, useState } from 'react'
import { inputClass } from './formStyles'

interface SearchableSelectProps {
  value: string
  onChange: (value: string) => void
  options: string[]
  placeholder?: string
  searchPlaceholder?: string
}

function SearchableSelect({ value, onChange, options, placeholder = 'Select...', searchPlaceholder = 'Search...' }: SearchableSelectProps) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const handlePointerDown = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false)
        setQuery('')
      }
    }
    document.addEventListener('mousedown', handlePointerDown)
    return () => document.removeEventListener('mousedown', handlePointerDown)
  }, [open])

  const filtered = useMemo(() => {
    const search = query.trim().toLowerCase()
    if (!search) return options
    return options.filter((option) => option.toLowerCase().includes(search))
  }, [options, query])

  const choose = (option: string) => {
    onChange(option)
    setOpen(false)
    setQuery('')
  }

  return (
    <div className="relative" ref={containerRef}>
      <button type="button" onClick={() => setOpen((current) => !current)} className={`${inputClass} flex items-center justify-between gap-2 text-left`}>
        <span className={value ? '' : 'text-slate-400'}>{value || placeholder}</span>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0 text-slate-400" aria-hidden="true">
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>
      {open && (
        <div className="absolute z-30 mt-2 w-full rounded-xl border border-slate-200 bg-surface p-2 shadow-[0_18px_40px_-20px_rgba(15,23,42,0.45)]">
          <input autoFocus value={query} onChange={(event) => setQuery(event.target.value)} placeholder={searchPlaceholder} className={inputClass} />
          <ul className="mt-2 max-h-56 overflow-y-auto">
            {filtered.length === 0 && <li className="px-3 py-2 text-sm text-slate-400">No matches found</li>}
            {filtered.map((option) => (
              <li key={option}>
                <button
                  type="button"
                  onClick={() => choose(option)}
                  className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm font-medium hover:bg-slate-100 ${value === option ? 'text-brand-700 dark:text-brand-300' : 'text-slate-700'}`}
                >
                  {option}
                  {value === option && (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" aria-hidden="true">
                      <path d="m5 13 4 4L19 7" />
                    </svg>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export default SearchableSelect