import { Link } from 'react-router-dom'
import Logo from '../common/Logo'

interface FooterLink {
  label: string
  to: string
}

interface FooterLinkGroup {
  title: string
  links: FooterLink[]
}

const linkGroups: FooterLinkGroup[] = [
  {
    title: 'Portals',
    links: [
      { label: 'Public', to: '/public/dashboard' },
      { label: 'Family', to: '/family/dashboard' },
      { label: 'Police', to: '/police/dashboard' },
      { label: 'NGO', to: '/ngo/dashboard' },
      { label: 'Admin', to: '/admin/dashboard' },
    ],
  },
  {
    title: 'Get Involved',
    links: [
      { label: 'Raise a Complaint', to: '/public/dashboard' },
      { label: 'AI Photo Search', to: '/public/dashboard' },
      { label: 'Report a Sighting', to: '/public/dashboard' },
      { label: 'Volunteer With Us', to: '/ngo/dashboard' },
    ],
  },
  {
    title: 'Support',
    links: [
      { label: 'About Us', to: '/about' },
      { label: 'Guidelines', to: '/guidelines' },
      { label: 'Contact', to: '/contact' },
      { label: 'Privacy Policy', to: '/privacy-policy' },
    ],
  },
]

function Footer() {
  return (
    <footer className="border-t border-slate-200/80 bg-white/85 backdrop-blur">
      <div className="mx-auto max-w-6xl px-5 py-10 sm:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr_1fr]">
          <div>
            <Logo />
            <p className="mt-4 max-w-xs text-sm leading-6 text-slate-500">A community helping families find their way home.</p>
          </div>
          {linkGroups.map((group) => (
            <div key={group.title}>
              <h3 className="text-sm font-bold text-slate-900">{group.title}</h3>
              <ul className="mt-3 space-y-2">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <Link to={link.to} className="text-sm text-slate-500 hover:text-brand-700">{link.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-10 flex flex-col gap-2 border-t border-slate-200/80 pt-6 text-center sm:flex-row sm:items-center sm:justify-between sm:text-left">
          <p className="text-xs text-slate-400">© {new Date().getFullYear()} Ghar Wapasi. All rights reserved.</p>
          <p className="text-xs text-slate-400">Demo build — dummy links</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer