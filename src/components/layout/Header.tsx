import { Link } from 'react-router-dom'
import { toast } from 'sonner'

function Header() {
  const showNotification = () => toast.success('Ghar Wapasi UI is working successfully.')

  return (
    <header className="border-b border-slate-200/80 bg-white/85 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 sm:px-8">
        <Link to="/" className="flex items-center gap-3" aria-label="Ghar Wapasi home">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-[#236b63] text-sm font-bold text-white">GW</span>
          <span className="font-['Manrope'] text-base font-extrabold tracking-tight text-[#24323d]">Ghar Wapasi</span>
        </Link>
        <nav className="flex items-center gap-2" aria-label="Main navigation">
          <Link to="/" className="rounded-lg px-3 py-2 text-sm font-semibold text-[#236b63] hover:bg-[#edf6f4]">Home</Link>
          <button type="button" onClick={showNotification} aria-label="Show notification" className="grid h-10 w-10 place-items-center rounded-lg border border-slate-200 text-slate-500 hover:border-[#236b63] hover:text-[#236b63]">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4" /></svg>
          </button>
        </nav>
      </div>
    </header>
  )
}

export default Header