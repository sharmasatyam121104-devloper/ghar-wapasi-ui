import { Link } from 'react-router-dom'
import { toast } from 'sonner'
import Logo from '../common/Logo'
import ThemeToggle from '../common/ThemeToggle'

function Header() {
  const showNotification = () => toast.success('Ghar Wapasi UI is working successfully.')

  return (
    <header className="border-b border-slate-200/80 bg-surface">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-5 py-4 sm:px-8">
        <Logo />
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