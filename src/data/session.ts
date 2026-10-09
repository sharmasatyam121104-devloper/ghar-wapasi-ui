import { useSyncExternalStore } from 'react'
import { errorMessage } from '../api/client'
import { loginRequest, logoutRequest, type ApiUser } from '../api/auth'
import type { AdminAccount } from './admin'

export type UserRole = 'public' | 'police' | 'ngo' | 'admin'

export interface Session {
  role: UserRole
  /** The signed-in account's Mongo id, used to tell "mine" from "someone else's". */
  id: string
  name: string
  identifier: string
  adminId: string
  /** Present only for admin sessions that came from the real API. */
  admin?: AdminAccount
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
    if (!parsed || !ROLE_HOME[parsed.role]) return null
    return { ...parsed, id: parsed.id ?? '' }
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
  void logoutRequest().catch(() => {})
  commit(null)
}

export function useCurrentAdmin(): AdminAccount | null {
  const active = useSession()
  if (!active || active.role !== 'admin') return null
  return active.admin ?? null
}

function toUserRole(role: string): UserRole {
  if (role === 'admin' || role === 'superadmin') return 'admin'
  if (role === 'police' || role === 'ngo' || role === 'public') return role
  return 'public'
}

function sessionFromUser(user: ApiUser, fallbackIdentifier: string): Session {
  const role = toUserRole(user.role)
  const next: Session = {
    role,
    id: user.id || '',
    name: user.name || fallbackIdentifier,
    identifier: user.identifier || fallbackIdentifier,
    adminId: user.adminId || '',
  }
  if (role === 'admin') {
    next.admin = {
      id: user.adminId || user.id,
      name: user.name,
      email: user.email,
      state: '',
      createdAt: Date.now(),
    }
  }
  return next
}

/** Opens the local session after the server accepted the credentials. */
export async function login(identifier: string, password: string): Promise<Session> {
  try {
    const result = await loginRequest(identifier, password)
    const next = sessionFromUser(result.user, identifier)
    commit(next)
    return next
  } catch (error) {
    throw new Error(errorMessage(error), { cause: error })
  }
}

/**
 * Opens the local session straight after a successful registration — the
 * server has already set the HttpOnly cookies in that same response.
 */
export function establishSession(user: ApiUser, fallbackIdentifier: string): Session {
  const next = sessionFromUser(user, fallbackIdentifier)
  commit(next)
  return next
}
