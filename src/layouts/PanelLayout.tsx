import { Outlet } from 'react-router-dom'
import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'

interface PanelLayoutProps {
  panelName: string
  panelDescription: string
}

function PanelLayout({ panelName, panelDescription }: PanelLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col bg-canvas">
      <Header />
      <main className="mx-auto w-full max-w-6xl flex-1 px-5 py-10 sm:px-8 sm:py-14">
        <div className="mb-10 max-w-2xl">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-brand-600 dark:text-brand-300">{panelName} Panel</p>
          <p className="text-base leading-7 text-slate-500">{panelDescription}</p>
        </div>
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

export default PanelLayout