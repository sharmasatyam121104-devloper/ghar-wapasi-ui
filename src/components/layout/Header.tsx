import { useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { toast } from 'sonner'
import Logo from '../common/Logo'
import ThemeToggle from '../common/ThemeToggle'

const portalInfo = [
  { prefix: '/police', label: 'Police', title: 'Police Portal' },
  { prefix: '/ngo', label: 'NGO', title: 'NGO Portal' },
  { prefix: '/admin', label: 'Admin', title: 'Admin Portal' },
]

function Header() {
  const location = useLocation()
  const portal = portalInfo.find((item) => location.pathname.startsWith(item.prefix))
  const showNotification = () => toast.success('Ghar Wapasi UI is working successfully.')

  useEffect(() => {
    document.title = portal ? `${portal.title} · Ghar Wapasi` : 'Ghar Wapasi'
  }, [portal])

  return (
    <header className="border-b border-slate-200/80 bg-surface">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-5 py-4 sm:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <Logo />
          {portal && (
            <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-slate-200 bg-canvas px-2.5 py-1 text-xs font-bold text-slate-700">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-600" />
              {portal.label}
            </span>
          )}
        </div>
        <nav className="flex items-center gap-1.5 sm:gap-2" aria-label="Main navigation">
          <Link to="/" className="rounded-lg px-2.5 py-2 text-sm font-semibold text-brand-700 hover:bg-brand-50 dark:text-brand-300 dark:hover:bg-brand-50">Home</Link>
          <ThemeToggle />
          <button type="button" onClick={showNotification} aria-label="Show notification" className="grid h-10 w-10 place-items-center rounded-lg border border-slate-200 text-slate-500 hover:border-brand-400 hover:text-brand-700 dark:hover:text-brand-300">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4" /></svg>
          </button>
        </nav>
      </div>
    </header>
  )
}

export default Header