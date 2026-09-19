import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import Logo from '../../components/common/Logo'
import Footer from '../../components/layout/Footer'
import ThemeToggle from '../../components/common/ThemeToggle'

interface RecentReport {
  id: number
  name: string
  age: number
  gender: string
  lastSeen: string
  area: string
  time: string
  status: 'Active' | 'Resolved'
  priority: 'high' | 'normal'
}

interface Step {
  step: string
  title: string
  description: string
}

interface Feature {
  title: string
  description: string
  icon: React.ReactNode
}

interface Stat {
  label: string
  value: string
  note: string
}

interface TrustItem {
  label: string
  icon: React.ReactNode
}

const stats: Stat[] = [
  { label: 'Registered Users', value: '12,480', note: '+312 this week' },
  { label: 'Active Cases', value: '232', note: '8 with priority alerts' },
  { label: 'Reunited', value: '86', note: '5 today' },
  { label: 'Alert Radius', value: '6 km', note: 'around last seen spot' },
]

const trust: TrustItem[] = [
  {
    label: 'Verified by police & NGOs',
    icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M12 2 4 5.5v5.1c0 5 3.4 9.6 8 11.4 4.6-1.8 8-6.4 8-11.4V5.5Z" /><path d="m8.5 12 2.3 2.3 4.7-4.7" /></svg>,
  },
  {
    label: 'Location-aware alerts',
    icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M12 21s-7-4.6-9.5-9A5.5 5.5 0 0 1 12 6.5 5.5 5.5 0 0 1 21.5 12c-2.5 4.4-9.5 9-9.5 9Z" /><circle cx="12" cy="12" r="2.5" /></svg>,
  },
  {
    label: 'Your privacy first',
    icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><rect x="5" y="11" width="14" height="10" rx="2" /><path d="M8 11V7a4 4 0 0 1 8 0v4M12 15v2" /></svg>,
  },
]

const steps: Step[] = [
  { step: '01', title: 'Report', description: 'A family files a complaint with the person\u2019s photo and last known location.' },
  { step: '02', title: 'Search & Alert', description: 'AI finds the person and instantly alerts every registered user within a 6 km radius.' },
  { step: '03', title: 'Reunite', description: 'Police, NGOs and the community work together to help them reach home.' },
]

const features: Feature[] = [
  {
    title: 'Raise a Complaint',
    description: 'File a detailed missing person report with a photo and last seen location in a few simple steps.',
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M12 20h9M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" /></svg>,
  },
  {
    title: 'AI Photo Search',
    description: 'Upload a photo and let AI help locate the person in the area around you.',
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3M14.5 8.5a3.5 3.5 0 0 0-2.5-5.1" /></svg>,
  },
  {
    title: 'Report a Sighting',
    description: 'Spotted someone from a missing report? Share the photo and details to alert their family.',
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M12 21s-7-4.6-9.5-9A5.5 5.5 0 0 1 12 6.5 5.5 5.5 0 0 1 21.5 12c-2.5 4.4-9.5 9-9.5 9Z" /></svg>,
  },
  {
    title: 'Priority Alerts',
    description: 'Cases of women, children and senior citizens reach every registered user instantly.',
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4" /></svg>,
  },
]

const recentReports: RecentReport[] = [
  { id: 1, name: 'Sunita Devi', age: 64, gender: 'Senior Citizen', lastSeen: 'Old Delhi Railway Station', area: 'Delhi', time: '2h ago', status: 'Active', priority: 'high' },
  { id: 2, name: 'Arjun Kumar', age: 9, gender: 'Child', lastSeen: 'City Park, Zone 4', area: 'Indore', time: 'today', status: 'Active', priority: 'high' },
  { id: 3, name: 'Meera Joshi', age: 28, gender: 'Female', lastSeen: 'Azad Market', area: 'Lucknow', time: '1h ago', status: 'Active', priority: 'high' },
  { id: 4, name: 'Ram Singh', age: 45, gender: 'Male', lastSeen: 'Kashmere Gate Bus Stop', area: 'Delhi', time: 'yesterday', status: 'Resolved', priority: 'normal' },
]

const helpers = ['Amit Singh', 'Pooja Verma', 'Ravi Kumar', 'Simran Kaur']

const avatarTones = ['bg-brand-100 text-brand-700 dark:text-brand-300', 'bg-amber-100 text-amber-700', 'bg-slate-200 text-slate-600', 'bg-brand-200 text-brand-800 dark:text-brand-300']

function getInitials(name: string): string {
  return name.split(' ').map((part) => part[0]).slice(0, 2).join('').toUpperCase()
}

function LandingPage() {
  const navigate = useNavigate()
  const notify = (label: string) => toast.success(`${label} — coming in the next step.`)

  return (
    <div className="flex min-h-screen flex-col bg-canvas">
      <header className="sticky top-0 z-20 border-b border-slate-200/70 bg-surface">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 sm:px-8">
          <Logo />
          <nav className="flex items-center gap-2 sm:gap-3" aria-label="Main navigation">
            <button type="button" onClick={() => navigate('/login')} className="hidden rounded-xl px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-brand-50 hover:text-brand-700 sm:inline-flex dark:hover:text-brand-300">Login</button>
            <button type="button" onClick={() => navigate('/signup')} className="rounded-xl bg-brand-600 px-3 py-2 text-sm font-bold text-white hover:bg-brand-700 sm:px-5">Sign Up</button>
            <ThemeToggle />
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <section className="relative mx-auto max-w-6xl px-5 pb-14 pt-12 sm:px-8 sm:pb-20 sm:pt-20">
          <div className="pointer-events-none absolute inset-x-0 -top-10 -z-10 overflow-hidden dark:opacity-40" aria-hidden="true">
            <div className="absolute left-[-8%] top-[-30%] h-80 w-80 rounded-full bg-brand-100/50 blur-3xl" />
            <div className="absolute right-[-5%] top-[10%] h-64 w-64 rounded-full bg-amber-100/40 blur-3xl" />
            <div className="absolute inset-x-0 top-0 h-[26rem] opacity-[0.05]" style={{ backgroundImage: 'radial-gradient(circle, #1e3a8a 1px, transparent 1px)', backgroundSize: '22px 22px' }} />
          </div>

          <div className="grid items-center gap-12 lg:grid-cols-[1.4fr_1fr]">
            <div>
              <p className="mb-6 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.18em] text-brand-600 dark:text-brand-300">
                <span className="h-px w-8 bg-brand-600" aria-hidden="true" />
                Community Help Network
              </p>
              <h1 className="font-display text-4xl font-extrabold leading-[1.05] tracking-tight text-slate-900 sm:text-6xl">
                Help a missing person find their
                <span className="relative inline-block px-1 font-serif font-semibold italic text-brand-600 dark:text-brand-300">
                  way home
                  <svg className="absolute -bottom-1.5 left-0 w-full" viewBox="0 0 120 8" fill="none" preserveAspectRatio="none" aria-hidden="true">
                    <path d="M2 6C35 2 85 1 118 4" stroke="currentColor" strokeWidth="3" strokeLinecap="round" opacity="0.35" />
                  </svg>
                </span>
              </h1>
              <p className="mt-6 max-w-xl text-base leading-7 text-slate-500">
                Report a missing person, search with a photo, or share a sighting. Families, police, NGOs and neighbours — all working together to bring people home.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <button type="button" onClick={() => navigate('/signup')} className="group rounded-xl bg-brand-600 px-6 py-3 text-sm font-bold text-white hover:bg-brand-700">
                  Get Started — It's Free
                  <svg className="ml-2 inline-block h-3.5 w-3.5 transition-transform group-hover:translate-x-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6" /></svg>
                </button>
                <button type="button" onClick={() => notify('AI Photo Search')} className="rounded-xl border border-slate-200 bg-surface px-6 py-3 text-sm font-bold text-slate-700 hover:border-brand-400 hover:text-brand-700 dark:hover:text-brand-300">Try Photo Search</button>
              </div>
              <div className="mt-8 flex items-center gap-4">
                <div className="flex -space-x-2">
                  {helpers.map((name, index) => (
                    <span key={name} className={`grid h-8 w-8 place-items-center rounded-full border-2 border-white text-[10px] font-bold ${avatarTones[index % avatarTones.length]}`}>
                      {getInitials(name)}
                    </span>
                  ))}
                </div>
                <p className="text-xs text-slate-500">
                  <span className="font-bold text-slate-700">12,480 helpers</span> registered around you
                </p>
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-md pt-8">
              <div className="absolute -top-1 left-6 right-16 h-20 -rotate-2 rounded-2xl border border-brand-100/80 bg-brand-50 dark:bg-transparent dark:border-brand-300/10" aria-hidden="true" />
              <div className="absolute right-4 left-12 top-4 h-20 rotate-1 rounded-2xl border border-slate-200/70 bg-slate-50 dark:bg-transparent dark:border-white/10" aria-hidden="true" />
              <div className="relative rounded-2xl border border-slate-200/70 bg-surface p-5 shadow-[0_18px_50px_-24px_rgba(30,41,59,0.25)]">
                <div className="flex items-center gap-3 border-b border-slate-100 pb-4 dark:border-slate-200/70">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-60" />
                    <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-amber-500" />
                  </span>
                  <p className="text-sm font-bold text-slate-900">Live alerts</p>
                  <p className="ml-auto text-xs font-semibold text-slate-400">radius · 6 km</p>
                </div>
                <div className="py-3">
                  <div className="flex items-center gap-3">
                    <span className="grid h-10 w-10 place-items-center rounded-full bg-amber-100 text-amber-700">
                      <span className="font-display text-xs font-extrabold">MJ</span>
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-slate-900">Meera Joshi · 28 · Female</p>
                      <p className="mt-0.5 text-xs text-slate-500">Last seen at Azad Market, Lucknow</p>
                    </div>
                    <span className="ml-auto shrink-0 rounded-md bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-800">2m</span>
                  </div>
                </div>
                <div className="border-t border-slate-100 py-3 dark:border-slate-200/70">
                  <div className="flex items-center gap-3">
                    <span className="grid h-10 w-10 place-items-center rounded-full bg-brand-100 text-brand-700 dark:text-brand-300">
                      <span className="font-display text-xs font-extrabold">AK</span>
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-slate-900">Arjun Kumar · 9 · Child</p>
                      <p className="mt-0.5 text-xs text-slate-500">Last seen at City Park, Zone 4</p>
                    </div>
                    <span className="ml-auto shrink-0 rounded-md bg-brand-100 px-2 py-0.5 text-[10px] font-bold text-brand-700 dark:bg-brand-300/15 dark:text-brand-300">18m</span>
                  </div>
                </div>
                <div className="mt-2 rounded-xl bg-amber-50 px-4 py-3 text-xs font-semibold leading-5 text-amber-800">
                  Every registered user within 6 km of the last seen location is notified instantly.
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="border-y border-slate-200/70 bg-surface">
          <div className="mx-auto grid max-w-6xl grid-cols-2 gap-px bg-slate-200/70 px-px py-px lg:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="bg-surface px-6 py-8 sm:py-10">
                <p className="font-display text-3xl font-extrabold text-brand-600 sm:text-4xl dark:text-brand-300">{stat.value}</p>
                <p className="mt-1 text-xs uppercase tracking-[0.12em] text-slate-500">{stat.label}</p>
                <p className="mt-2 text-[11px] font-semibold text-slate-400">{stat.note}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-surface">
          <div className="mx-auto flex max-w-6xl flex-col gap-3 px-5 py-6 sm:flex-row sm:flex-wrap sm:items-center sm:gap-6 sm:px-8">
            {trust.map((item) => (
              <div key={item.label} className="flex items-center gap-2.5">
                <span className="grid h-7 w-7 place-items-center rounded-lg bg-brand-50 text-brand-600 dark:text-brand-300">{item.icon}</span>
                <span className="text-sm text-slate-600">{item.label}</span>
              </div>
            ))}
            <span className="hidden h-4 w-px bg-slate-200 sm:block" aria-hidden="true" />
            <button type="button" onClick={() => notify('Guidelines')} className="text-sm font-semibold text-brand-700 hover:text-brand-800 dark:text-brand-300 dark:hover:text-brand-200">Read our guidelines →</button>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-5 py-14 sm:px-8 sm:py-20">
          <div className="mb-10 grid gap-6 lg:grid-cols-[1.3fr_1fr] lg:items-end">
            <div>
              <p className="mb-3 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.18em] text-brand-600 dark:text-brand-300">
                <span className="h-px w-8 bg-brand-600" aria-hidden="true" />
                How It Works
              </p>
              <h2 className="font-display text-3xl font-extrabold tracking-tight text-slate-900">Three steps to bring someone home</h2>
            </div>
            <p className="text-sm leading-6 text-slate-500 lg:pb-1">Designed to be simple — anyone in the community can take part, from filing a report to spotting a familiar face.</p>
          </div>
          <div className="grid overflow-hidden rounded-2xl border border-slate-200/70 bg-surface md:grid-cols-3">
            {steps.map((step) => (
              <div key={step.step} className="group border-b border-slate-200/70 p-7 transition-colors last:border-b-0 hover:bg-brand-50/40 md:border-b-0 md:border-r md:last:border-r-0">
                <p className="font-serif text-4xl font-semibold italic text-brand-200 transition-colors group-hover:text-brand-600 dark:text-brand-300 dark:group-hover:text-brand-300">{step.step}</p>
                <h3 className="mt-5 font-display text-xl font-bold text-slate-900">{step.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-500">{step.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-surface">
          <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 sm:px-8 sm:py-20 lg:grid-cols-[1fr_1.6fr]">
            <div className="lg:sticky lg:top-24 lg:self-start">
              <p className="mb-3 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.18em] text-brand-600 dark:text-brand-300">
                <span className="h-px w-8 bg-brand-600" aria-hidden="true" />
                Features
              </p>
              <h2 className="font-display text-3xl font-extrabold tracking-tight text-slate-900">Everything you need, in one place</h2>
              <p className="mt-4 max-w-sm text-sm leading-6 text-slate-500">
                No training needed. Every tool is built for one goal — getting someone home quickly and safely.
              </p>
              <button type="button" onClick={() => notify('AI Photo Search')} className="mt-7 rounded-xl border border-slate-200 bg-surface px-5 py-2.5 text-sm font-bold text-slate-700 hover:border-brand-400 hover:text-brand-700 dark:hover:text-brand-300">Explore the features</button>
            </div>
            <div className="divide-y divide-slate-200/70 overflow-hidden rounded-2xl border border-slate-200/70 bg-surface">
              {features.map((feature) => (
                <div key={feature.title} className="group flex items-start gap-4 p-6 transition-colors hover:bg-brand-50/60 sm:items-center sm:gap-6 sm:p-7">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-600 transition-colors group-hover:bg-brand-600 group-hover:text-white dark:text-brand-300">{feature.icon}</span>
                  <div className="min-w-0">
                    <h3 className="font-display text-base font-bold text-slate-900">{feature.title}</h3>
                    <p className="mt-1 text-sm leading-6 text-slate-500">{feature.description}</p>
                  </div>
                  <svg className="ml-auto hidden shrink-0 text-slate-300 transition-all group-hover:translate-x-1 group-hover:text-brand-600 sm:block" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6" /></svg>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-5 py-14 sm:px-8 sm:py-20">
          <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="mb-3 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.18em] text-brand-600 dark:text-brand-300">
                <span className="h-px w-8 bg-brand-600" aria-hidden="true" />
                Recent Reports
              </p>
              <h2 className="font-display text-3xl font-extrabold tracking-tight text-slate-900">Recently reported missing persons</h2>
            </div>
            <button type="button" onClick={() => notify('All Reports')} className="group self-start rounded-xl border border-slate-200 bg-surface px-4 py-2 text-sm font-bold text-slate-700 hover:border-brand-400 hover:text-brand-700 dark:hover:text-brand-300 sm:self-auto">
              View all reports
              <svg className="ml-1.5 inline-block h-3.5 w-3.5 transition-transform group-hover:translate-x-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6" /></svg>
            </button>
          </div>
          <div className="divide-y divide-slate-200/70 overflow-hidden rounded-2xl border border-slate-200/70 bg-surface">
            {recentReports.map((report) => (
              <div key={report.id} className="group flex items-center gap-4 p-5 transition-colors hover:bg-brand-50/60 sm:gap-5 sm:p-6">
                <span className={`grid h-12 w-12 shrink-0 place-items-center rounded-full ${report.priority === 'high' ? 'bg-amber-100 text-amber-700' : 'bg-brand-100 text-brand-700 dark:text-brand-300'}`}>
                  <span className="font-display text-sm font-extrabold">{getInitials(report.name)}</span>
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-display text-base font-bold text-slate-900">{report.name}</h3>
                    {report.status === 'Active' ? (
                      <span className="rounded-md bg-amber-50 px-2 py-0.5 text-[11px] font-bold text-amber-700">Active</span>
                    ) : (
                      <span className="rounded-md bg-brand-50 px-2 py-0.5 text-[11px] font-bold text-brand-700 dark:text-brand-300">{report.status}</span>
                    )}
                  </div>
                  <p className="mt-1 flex flex-wrap items-center gap-x-1.5 text-xs leading-6 text-slate-500">
                    <span>{report.age} years · {report.gender}</span>
                    <span className="text-slate-300" aria-hidden="true">·</span>
                    <span className="flex items-center gap-1">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M12 21s-7-4.6-9.5-9A5.5 5.5 0 0 1 12 6.5 5.5 5.5 0 0 1 21.5 12c-2.5 4.4-9.5 9-9.5 9Z" /><circle cx="12" cy="12" r="2.5" /></svg>
                      {report.lastSeen}, {report.area}
                    </span>
                  </p>
                </div>
                <span className="hidden shrink-0 text-xs font-medium text-slate-400 sm:block">{report.time}</span>
                <svg className="hidden shrink-0 text-slate-300 transition-all group-hover:translate-x-1 group-hover:text-brand-600 sm:block" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6" /></svg>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-5 pb-16 sm:px-8 sm:pb-24">
          <div className="relative overflow-hidden rounded-3xl border border-slate-200/70 bg-surface px-6 py-14 text-center sm:px-16 sm:py-20">
            <div className="pointer-events-none absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'radial-gradient(circle, #1e3a8a 1px, transparent 1px)', backgroundSize: '20px 20px' }} aria-hidden="true" />
            <div className="relative">
              <p className="mx-auto mb-6 flex items-center justify-center gap-3 text-xs font-bold uppercase tracking-[0.18em] text-brand-600 dark:text-brand-300">
                <span className="h-px w-8 bg-brand-600" aria-hidden="true" />
                Join the network
                <span className="h-px w-8 bg-brand-600" aria-hidden="true" />
              </p>
              <h2 className="mx-auto max-w-2xl font-display text-3xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-4xl">
                Be the reason a family
                <span className="font-serif font-semibold italic text-brand-600 dark:text-brand-300"> reunites</span>
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-slate-500">
                Join the community. Get instant alerts about missing people near you and be the reason a family reunites.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <button type="button" onClick={() => navigate('/signup')} className="group rounded-xl bg-brand-600 px-6 py-3 text-sm font-bold text-white hover:bg-brand-700">
                  Create Your Account
                  <svg className="ml-2 inline-block h-3.5 w-3.5 transition-transform group-hover:translate-x-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6" /></svg>
                </button>
                <button type="button" onClick={() => notify('Photo Search')} className="rounded-xl border border-slate-200 px-6 py-3 text-sm font-bold text-slate-700 hover:border-brand-400 hover:text-brand-700 dark:hover:text-brand-300">Search by Photo</button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

export default LandingPage