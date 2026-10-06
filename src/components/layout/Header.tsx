import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import Logo from '../common/Logo'
import ThemeToggle from '../common/ThemeToggle'
import { ROLE_LABEL, signOut, useSession } from '../../data/session'

const portalInfo = [
  { prefix: '/police', label: 'Police', title: 'Police Portal' },
  { prefix: '/ngo', label: 'NGO', title: 'NGO Portal' },
  { prefix: '/admin', label: 'Admin', title: 'Admin Portal' },
]

function Header() {
  const location = useLocation()
  const navigate = useNavigate()
  const session = useSession()
  const [menuOpen, setMenuOpen] = useState(false)
  const portal = portalInfo.find((item) => location.pathname.startsWith(item.prefix))
  const showNotification = () => toast.success('Ghar Wapasi UI is working successfully.')
  const isAdminArea = location.pathname.startsWith('/admin')

  useEffect(() => {
    document.title = portal ? `${portal.title} · Ghar Wapasi` : 'Ghar Wapasi'
  }, [portal])

  const handleSignOut = () => {
    signOut()
    setMenuOpen(false)
    toast.success('Signed out.')
    navigate('/login', { replace: true })
  }

  return (
    <header className="border-b border-slate-200/80 bg-surface">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-4 sm:px-8">
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
          <Link to="/" className="hidden rounded-lg px-2.5 py-2 text-sm font-semibold text-brand-700 hover:bg-brand-50 dark:text-brand-300 dark:hover:bg-brand-50 sm:block">Home</Link>

          {session ? (
            <div className="relative">
              <button
                type="button"
                onClick={() => setMenuOpen((open) => !open)}
                aria-expanded={menuOpen}
                aria-haspopup="menu"
                className="flex items-center gap-2 rounded-lg border border-slate-200 px-2.5 py-2 text-sm font-semibold text-slate-700 hover:border-brand-400 sm:px-3"
              >
                <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-brand-600 text-[10px] font-bold text-white">
                  {session.name.slice(0, 1).toUpperCase()}
                </span>
                <span className="hidden max-w-[9rem] truncate sm:block">{session.name}</span>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true"><path d="m6 9 6 6 6-6" /></svg>
              </button>

              {menuOpen && (
                <>
                  <span className="fixed inset-0 z-10 cursor-default" onClick={() => setMenuOpen(false)} aria-hidden="true" />
                  <div className="absolute right-0 z-20 mt-2 w-60 overflow-hidden rounded-xl border border-slate-200 bg-surface shadow-lg" role="menu">
                    <div className="border-b border-slate-100 px-4 py-3">
                      <p className="truncate text-sm font-bold text-slate-800">{session.name}</p>
                      <p className="mt-0.5 text-xs font-semibold text-brand-600 dark:text-brand-300">{ROLE_LABEL[session.role]}</p>
                      <p className="mt-0.5 truncate text-[11px] text-slate-400">{session.identifier}</p>
                    </div>
                    <Link
                      to={session.role === 'admin' ? '/admin/dashboard' : session.role === 'police' ? '/police/dashboard' : session.role === 'ngo' ? '/ngo/dashboard' : '/public/dashboard'}
                      className="block px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-brand-50 dark:hover:bg-brand-50"
                      role="menuitem"
                      onClick={() => setMenuOpen(false)}
                    >
                      Go to my panel
                    </Link>
                    <button
                      type="button"
                      onClick={handleSignOut}
                      className="block w-full px-4 py-2.5 text-left text-sm font-bold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-50"
                      role="menuitem"
                    >
                      Sign out
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : !isAdminArea ? (
            <>
              <Link to="/police/register" className="hidden rounded-lg px-2.5 py-2 text-sm font-semibold text-slate-700 hover:bg-brand-50 hover:text-brand-700 sm:block dark:hover:bg-brand-50 dark:hover:text-brand-300">Police</Link>
              <Link to="/ngo/register" className="hidden rounded-lg px-2.5 py-2 text-sm font-semibold text-slate-700 hover:bg-brand-50 hover:text-brand-700 sm:block dark:hover:bg-brand-50 dark:hover:text-brand-300">NGO</Link>
              <Link to="/login" className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-bold text-slate-700 hover:border-brand-400 hover:text-brand-700">
                Log in
              </Link>
            </>
          ) : null}

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
