import { NavLink } from 'react-router-dom'

export interface AdminNavCounts {
  pendingRequests: number
  myUsers: number
  openReports: number
  activeSuspensions: number
}

const navItems: { to: string; label: string; icon: string; badge?: keyof AdminNavCounts }[] = [
  { to: '/admin/dashboard', label: 'Overview', icon: 'grid' },
  { to: '/admin/requests', label: 'Requests', icon: 'inbox', badge: 'pendingRequests' },
  { to: '/admin/my-users', label: 'My Users', icon: 'users', badge: 'myUsers' },
  { to: '/admin/reports', label: 'Reports', icon: 'flag', badge: 'openReports' },
  { to: '/admin/suspensions', label: 'Suspensions', icon: 'ban', badge: 'activeSuspensions' },
]

const iconPaths: Record<string, string> = {
  grid: 'M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z',
  inbox: 'M3 13h5l1.5 3h5L16 13h5M4 5h16l1 8v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-5z',
  users: 'M16 19v-1.5a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4V19M9 9.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM22 19v-1.5a4 4 0 0 0-3-3.87M16 2.6a4 4 0 0 1 0 7.75',
  flag: 'M5 21V4m0 0h11l-1.5 4L16 12H5',
  ban: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM5.6 5.6l12.8 12.8',
}

interface AdminSidebarProps {
  counts: AdminNavCounts
  onNavigate?: () => void
}

function AdminSidebar({ counts, onNavigate }: AdminSidebarProps) {
  return (
    <nav className="space-y-1" aria-label="Admin sections">
      {navItems.map((item) => {
        const count = item.badge ? counts[item.badge] : 0
        return (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={onNavigate}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-semibold transition sm:py-2.5 ${
                isActive
                  ? 'bg-admin-600 text-white shadow-[0_6px_16px_-8px_rgba(124,58,237,0.8)]'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-500 dark:hover:bg-slate-800/60 dark:hover:text-slate-200'
              }`
            }
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="shrink-0">
              <path d={iconPaths[item.icon]} />
            </svg>
            <span className="min-w-0 flex-1 truncate">{item.label}</span>
            {count > 0 && <span className="shrink-0 rounded-full bg-rose-500 px-1.5 py-0.5 text-[10px] font-extrabold text-white">{count}</span>}
          </NavLink>
        )
      })}
    </nav>
  )
}

export default AdminSidebar
