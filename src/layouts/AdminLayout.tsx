import { useEffect, useState } from 'react'
import { Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import Header from '../components/layout/Header'
import AdminSidebar from '../components/admin/AdminSidebar'
import { ApiError } from '../api/client'
import { fetchMe } from '../api/auth'
import { listRequests } from '../api/verification'
import { scopedCases, scopedReports, scopedSuspensions, useAdminConsole } from '../data/admin'
import { signOut, useCurrentAdmin } from '../data/session'

const pageMeta: Record<string, { title: string; description: string }> = {
  '/admin/dashboard': { title: 'Overview', description: 'Your queue, your verified users and how their cases ended up.' },
  '/admin/requests': { title: 'Requests', description: 'Registrations assigned to you. You give the meeting link and time yourself, then approve or reject.' },
  '/admin/my-users': { title: 'My Users', description: 'Only the accounts you verified. Open any user to see all their cases and reports.' },
  '/admin/reports': { title: 'Reports', description: 'Complaints received against the accounts you verified.' },
  '/admin/suspensions': { title: 'Suspensions', description: 'Block an account with a written reason and proof, or lift an earlier suspension.' },
}

function AdminLayout() {
  const location = useLocation()
  const navigate = useNavigate()
  const state = useAdminConsole()
  const admin = useCurrentAdmin()
  const [menuOpen, setMenuOpen] = useState(false)
  const [queueCounts, setQueueCounts] = useState({ pendingRequests: 0, myUsers: 0 })

  // Sidebar badges for the two API-backed pages.
  useEffect(() => {
    let alive = true
    void (async () => {
      try {
        const [pending, verified] = await Promise.all([
          listRequests('pending', { limit: 1 }),
          listRequests('verified', { limit: 1 }),
        ])
        if (alive) setQueueCounts({ pendingRequests: pending.total, myUsers: verified.total })
      } catch {
        // The pages surface their own API errors; the sidebar just stays at 0.
      }
    })()
    return () => {
      alive = false
    }
  }, [])

  // The session in localStorage is only a cache — the cookie decides.
  useEffect(() => {
    let alive = true
    void (async () => {
      try {
        await fetchMe()
      } catch (error) {
        if (!alive) return
        if (error instanceof ApiError && (error.status === 401 || error.status === 403)) {
          signOut()
          navigate('/login', { replace: true })
        }
      }
    })()
    return () => {
      alive = false
    }
  }, [navigate])

  if (!admin) return <Navigate to="/login" replace />

  const counts = {
    pendingRequests: queueCounts.pendingRequests,
    myUsers: queueCounts.myUsers,
    openReports: scopedReports(state, admin).filter((report) => report.status !== 'closed').length,
    activeSuspensions: scopedSuspensions(state, admin).filter((item) => item.status === 'active').length,
  }
  const meta = pageMeta[location.pathname] ?? pageMeta['/admin/dashboard']
  const caseTotal = scopedCases(state, admin).length

  return (
    <div className="admin-surface flex min-h-screen flex-col bg-canvas">
      <Header />
      <div className="mx-auto flex w-full max-w-[1500px] flex-1 flex-col px-4 py-5 sm:px-8 sm:py-8">
        <div className="flex items-center justify-between gap-3 border-b border-slate-200/80 pb-3 sm:hidden">
          <div className="min-w-0">
            <p className="truncate text-[10px] font-bold uppercase tracking-[0.16em] text-admin-600 dark:text-admin-300">Admin panel</p>
            <p className="truncate text-sm font-extrabold text-slate-900">{meta.title}</p>
          </div>
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-label="Toggle admin menu"
            className="inline-flex shrink-0 items-center gap-2 rounded-lg border border-slate-200 px-3 py-2.5 text-xs font-bold text-slate-700"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              <path d="M4 7h16M4 12h16M4 17h16" />
            </svg>
            Menu
          </button>
        </div>

        <div className="flex flex-1 flex-col pt-5 sm:flex-row sm:gap-8 sm:pt-0">
          <aside className={`${menuOpen ? 'block' : 'hidden'} shrink-0 border-b border-slate-200/80 pb-5 sm:block sm:w-60 sm:border-b-0 sm:border-r sm:pb-0 sm:pr-6 lg:w-64`}>
            <div className="sm:sticky sm:top-6">
              <div className="rounded-xl border border-slate-200/80 bg-surface p-4">
                <div className="flex items-center gap-3">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-admin-600 text-xs font-extrabold text-white">
                    {admin.name.split(' ').map((part) => part[0]).slice(0, 2).join('')}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold text-slate-900">{admin.name}</p>
                    <p className="truncate text-[11px] font-semibold text-slate-500">Verification admin · {admin.state || 'All India'}</p>
                  </div>
                </div>
              </div>

              <div className="mt-5">
                <AdminSidebar counts={counts} onNavigate={() => setMenuOpen(false)} />
              </div>

              <div className="mt-6 border-t border-slate-200/80 pt-4">
                <p className="text-[11px] leading-5 text-slate-500">
                  You can see only what you verified — {counts.myUsers} users, {caseTotal} cases.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    signOut()
                    toast.success('Signed out.')
                    navigate('/login', { replace: true })
                  }}
                  className="mt-3 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-xs font-bold text-slate-600 hover:border-rose-300 hover:text-rose-600"
                >
                  Sign out
                </button>
              </div>
            </div>
          </aside>

          <main className="min-w-0 flex-1 pt-6 sm:pt-0">
            <div className="mb-5 border-b border-slate-200/80 pb-4 sm:mb-6 sm:pb-5">
              <h1 className="font-display text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">{meta.title}</h1>
              <p className="mt-1.5 max-w-3xl text-sm leading-6 text-slate-500">{meta.description}</p>
            </div>
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  )
}

export default AdminLayout
