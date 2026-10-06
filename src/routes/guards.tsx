import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { ROLE_HOME, useSession, type UserRole } from '../data/session'

/**
 * Role gate for the panel routes. No session -> login; wrong role -> the
 * caller's own panel, so a police officer can never open the admin console.
 */
export function RequireRole({ role, children }: { role: UserRole; children: ReactNode }) {
  const session = useSession()
  if (!session) return <Navigate to="/login" replace />
  if (session.role !== role) return <Navigate to={ROLE_HOME[session.role]} replace />
  return children
}

/** Signed-in members are bounced off the login and sign-up pages. */
export function RedirectIfAuthed({ children }: { children: ReactNode }) {
  const session = useSession()
  if (session) return <Navigate to={ROLE_HOME[session.role]} replace />
  return children
}
