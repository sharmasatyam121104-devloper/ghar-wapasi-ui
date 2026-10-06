import { useState, type ReactNode } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import LogoutDialog from '../components/common/LogoutDialog'
import { ROLE_HOME, ROLE_LABEL, signOut, useSession, type UserRole } from '../data/session'

/**
 * Role gate for the panel routes. No session -> login; wrong role -> a
 * logout dialog first (Logout ends the session and continues to the login
 * page, Cancel returns home), so a police officer can never open the admin
 * console silently.
 */
export function RequireRole({ role, children }: { role: UserRole; children: ReactNode }) {
  const session = useSession()
  const navigate = useNavigate()
  if (!session) return <Navigate to="/login" replace />
  if (session.role !== role) {
    return (
      <LogoutDialog
        message={`You are logged in as ${ROLE_LABEL[session.role]}, so this page is not available for your account. Logout first, then continue with the right account.`}
        onCancel={() => navigate(ROLE_HOME[session.role], { replace: true })}
        onConfirm={() => signOut()}
      />
    )
  }
  return children
}

/**
 * Registration forms open for guests only. A signed-in member (any role)
 * sees the logout dialog — after Logout the same page continues as a guest,
 * Cancel goes back to their own panel.
 */
export function RequireGuest({ children }: { children: ReactNode }) {
  const session = useSession()
  const navigate = useNavigate()
  const [blocked, setBlocked] = useState(() => session !== null)
  if (!session || !blocked) return children
  return (
    <LogoutDialog
      message={`You are already logged in as ${ROLE_LABEL[session.role]}. Logout first to open this registration form.`}
      onCancel={() => navigate(ROLE_HOME[session.role], { replace: true })}
      onConfirm={() => {
        signOut()
        setBlocked(false)
      }}
    />
  )
}

/** Signed-in members are bounced off the login and sign-up pages. */
export function RedirectIfAuthed({ children }: { children: ReactNode }) {
  const session = useSession()
  if (session) return <Navigate to={ROLE_HOME[session.role]} replace />
  return children
}
