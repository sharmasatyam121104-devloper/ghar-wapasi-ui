import { Link } from 'react-router-dom'
import Header from '../../components/layout/Header'

function NotFoundPage() {
  return (
    <div className="min-h-screen bg-[#f4f8f7]">
      <Header />
      <main className="grid min-h-[calc(100vh-74px)] place-items-center px-5 py-16 text-center">
        <div>
          <p className="font-['Manrope'] text-7xl font-extrabold tracking-tight text-[#236b63]">404</p>
          <h1 className="mt-5 font-['Manrope'] text-3xl font-extrabold text-[#24323d]">Page Not Found</h1>
          <p className="mt-3 text-slate-500">The page you're looking for doesn't exist.</p>
          <Link to="/dashboard" className="mt-8 inline-flex rounded-lg bg-[#236b63] px-5 py-3 text-sm font-bold text-white hover:bg-[#1b554f]">Back to Dashboard</Link>
        </div>
      </main>
    </div>
  )
}

export default NotFoundPage