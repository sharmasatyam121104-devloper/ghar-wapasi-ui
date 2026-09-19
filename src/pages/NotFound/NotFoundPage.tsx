import { Link } from 'react-router-dom'
import Header from '../../components/layout/Header'

function NotFoundPage() {
  return (
    <div className="min-h-screen bg-canvas">
      <Header />
      <main className="grid min-h-[calc(100vh-74px)] place-items-center px-5 py-16 text-center">
        <div>
          <p className="font-display text-7xl font-extrabold tracking-tight text-brand-600">404</p>
          <h1 className="mt-5 font-display text-3xl font-extrabold text-slate-900">Page Not Found</h1>
          <p className="mt-3 text-slate-500">The page you're looking for doesn't exist.</p>
          <Link to="/dashboard" className="mt-8 inline-flex rounded-lg bg-brand-600 px-5 py-3 text-sm font-bold text-white hover:bg-brand-700">Back to Dashboard</Link>
        </div>
      </main>
    </div>
  )
}

export default NotFoundPage