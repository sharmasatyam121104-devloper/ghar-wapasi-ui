import { Outlet } from 'react-router-dom'
import Header from '../components/layout/Header'

interface PanelLayoutProps {
  panelName: string
  panelDescription: string
}

function PanelLayout({ panelName, panelDescription }: PanelLayoutProps) {
  return (
    <div className="min-h-screen bg-[#f4f8f7]">
      <Header />
      <main className="mx-auto max-w-6xl px-5 py-10 sm:px-8 sm:py-14">
        <div className="mb-10 max-w-2xl">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-[#236b63]">{panelName} Panel</p>
          <p className="text-base leading-7 text-slate-500">{panelDescription}</p>
        </div>
        <Outlet />
      </main>
    </div>
  )
}

export default PanelLayout