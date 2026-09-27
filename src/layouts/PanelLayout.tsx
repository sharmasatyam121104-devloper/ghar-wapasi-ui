import { Outlet } from 'react-router-dom'
import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'
import { ROLE_LABEL, useSession } from '../data/session'

interface PanelLayoutProps {
  panelName: string
  panelDescription: string
  showSignOut?: boolean
}

function PanelLayout({ panelName, panelDescription, showSignOut = false }: PanelLayoutProps) {
  const session = useSession()

  return (
    <div className="flex min-h-screen flex-col bg-canvas">
      <Header />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-8 sm:py-10 lg:py-14">
        <div className="mb-8 max-w-2xl sm:mb-10">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-brand-600 dark:text-brand-300">{panelName} Panel</p>
          <p className="text-sm leading-7 text-slate-500 sm:text-base">{panelDescription}</p>
          {showSignOut && session && (
            <p className="mt-3 text-xs leading-5 text-slate-500">
              Signed in as <span className="font-bold text-slate-700 dark:text-slate-200">{session.name}</span> · {ROLE_LABEL[session.role]}
            </p>
          )}
        </div>
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

export default PanelLayout
