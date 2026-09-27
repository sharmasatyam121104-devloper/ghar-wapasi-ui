import { useSyncExternalStore } from 'react'
import { useAdminConsole, type AdminAccount } from './admin'
import { getNgoProfile } from './ngo'
import { getPoliceProfile } from './police'

export type UserRole = 'public' | 'police' | 'ngo' | 'admin'

export interface Session {
  role: UserRole
  name: string
  identifier: string
  adminId: string
}

export const ROLE_HOME: Record<UserRole, string> = {
  public: '/public/dashboard',
  police: '/police/dashboard',
  ngo: '/ngo/dashboard',
  admin: '/admin/dashboard',
}

export const ROLE_LABEL: Record<UserRole, string> = {
  public: 'Public user',
  police: 'Police officer',
  ngo: 'NGO member',
  admin: 'Verification admin',
}

const SESSION_KEY = 'gw-session'

function read(): Session | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as Session
    return parsed && ROLE_HOME[parsed.role] ? parsed : null
  } catch {
    return null
  }
}

let session = read()
const listeners: Array<() => void> = []

function commit(next: Session | null) {
  session = next
  if (next) localStorage.setItem(SESSION_KEY, JSON.stringify(next))
  else localStorage.removeItem(SESSION_KEY)
  listeners.forEach((listener) => listener())
}

function subscribe(listener: () => void) {
  listeners.push(listener)
  return () => {
    const index = listeners.indexOf(listener)
    if (index >= 0) listeners.splice(index, 1)
  }
}

function getSnapshot(): Session | null {
  return session
}

export function useSession(): Session | null {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot)
}

export function signOut() {
  commit(null)
}

export function useCurrentAdmin(): AdminAccount | null {
  const active = useSession()
  const state = useAdminConsole()
  if (!active || active.role !== 'admin') return null
  return state.admins.find((admin) => admin.id === active.adminId) ?? null
}

function policeSession(): Session | null {
  const police = getPoliceProfile()
  if (!police) return null
  const identifier = police.officialEmail || police.aadhaar
  if (!identifier) return null
  return { role: 'police', name: police.fullName || 'Police officer', identifier, adminId: '' }
}

function ngoSession(): Session | null {
  const ngo = getNgoProfile()
  if (!ngo?.contactEmail) return null
  return { role: 'ngo', name: ngo.contactPerson || ngo.orgName || 'NGO member', identifier: ngo.contactEmail, adminId: '' }
}

export function resolveAccount(identifier: string, admins: AdminAccount[]): Session {
  const value = identifier.trim()
  const lower = value.toLowerCase()

  if (/^\d{12}$/.test(value.replace(/\s/g, ''))) {
    const digits = value.replace(/\s/g, '')
    const police = getPoliceProfile()
    if (police?.aadhaar === digits) {
      return { role: 'police', name: police.fullName || 'Police officer', identifier: police.officialEmail || digits, adminId: '' }
    }
    return { role: 'public', name: 'Public user', identifier: digits, adminId: '' }
  }

  const admin = admins.find((item) => item.email.toLowerCase() === lower)
  if (admin) return { role: 'admin', name: admin.name, identifier: admin.email, adminId: admin.id }

  const police = policeSession()
  if (police && police.identifier.toLowerCase() === lower) return police

  const ngo = ngoSession()
  if (ngo && ngo.identifier.toLowerCase() === lower) return ngo

  return { role: 'public', name: 'Public user', identifier: value, adminId: '' }
}

export function login(identifier: string, password: string, admins: AdminAccount[]): Session {
  void password
  const next = resolveAccount(identifier, admins)
  commit(next)
  return next
}

export function continueAsPublic(): Session {
  const next: Session = { role: 'public', name: 'Public user', identifier: 'guest', adminId: '' }
  commit(next)
  return next
}

export interface DemoIdentity {
  role: UserRole
  label: string
  identifier: string
  detail: string
}

export function demoIdentities(admins: AdminAccount[]): DemoIdentity[] {
  const rows: DemoIdentity[] = admins.map((admin) => ({
    role: 'admin' as UserRole,
    label: admin.name,
    identifier: admin.email,
    detail: `${admin.state} · admin panel`,
  }))

  const police = policeSession()
  if (police) {
    rows.push({ role: 'police', label: police.name, identifier: police.identifier, detail: 'Police portal' })
  }

  const ngo = ngoSession()
  if (ngo) {
    rows.push({ role: 'ngo', label: ngo.name, identifier: ngo.identifier, detail: 'NGO portal' })
  }

  rows.push({ role: 'public', label: 'Public user', identifier: '9876543210', detail: 'Citizen portal' })
  return rows
}
