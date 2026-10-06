import { apiFetch, apiFetchEnvelope } from './client'

export interface ApiUser {
  id: string
  name: string
  first_name: string
  last_name: string
  role: string
  identifier: string
  email: string
  aadhaar_masked: string
  mobile: string
  adminId: string
  verification_status: string
  is_active: boolean
}

export interface LoginResult {
  user: ApiUser
  pendingVerification?: boolean
  rejectionReason?: string
  updateWindowEndsAt?: string
}

export interface RegisterResult {
  user: ApiUser
}

export interface MeResult {
  user: ApiUser
  police?: PoliceProfile | null
  ngo?: NgoProfile | null
  pending_contact?: unknown
  verification_call?: { link?: string; time?: string; note?: string } | null
  verification_status?: string
  rejection_reason?: string | null
  submitted_at?: string | null
  update_window_ends_at?: string | null
  can_edit?: boolean
  last_login?: string | null
  created_at?: string
}

export interface PoliceProfile {
  rank?: string
  badge_number?: string
  station_name?: string
  district?: string
  state?: string
  official_email?: string
  employee_id?: string
  joining_date?: string
  reporting_officer?: string
  reporting_officer_contact?: string
  id_card_files?: string[]
  appointment_proof_files?: string[]
}

export interface NgoProfile {
  org_name?: string
  org_type?: string
  reg_number?: string
  state?: string
  district?: string
  city?: string
  address?: string
  contact_person?: string
  designation?: string
  contact_mobile?: string
  contact_email?: string
  website?: string
  contact_aadhaar?: string
  reg_certificate_files?: string[]
  org_photo_files?: string[]
}

export interface RegisterInput {
  first_name: string
  last_name: string
  aadhaar: string
  mobile: string
  email?: string
  password: string
  police?: Record<string, unknown>
  ngo?: Record<string, unknown>
}

export const loginRequest = (identifier: string, password: string): Promise<LoginResult> =>
  apiFetch<LoginResult>('/auth/login', {
    method: 'POST',
    body: { identifier, password },
  })

export const logoutRequest = (): Promise<void> => apiFetch<void>('/auth/logout', { method: 'POST' })

export const fetchMe = (): Promise<MeResult> => apiFetch<MeResult>('/users/me')

export const registerPublicRequest = (input: RegisterInput): Promise<RegisterResult> =>
  apiFetch<RegisterResult>('/register', { method: 'POST', body: input })

export const registerPoliceRequest = (input: RegisterInput): Promise<RegisterResult> =>
  apiFetch<RegisterResult>('/register/police', { method: 'POST', body: input })

export const registerNgoRequest = (input: RegisterInput): Promise<RegisterResult> =>
  apiFetch<RegisterResult>('/register/ngo', { method: 'POST', body: input })

export const updatePoliceRequest = (body: Record<string, unknown>): Promise<MeResult> =>
  apiFetch<MeResult>('/users/me/police', { method: 'PATCH', body })

export const updateNgoRequest = (body: Record<string, unknown>): Promise<MeResult> =>
  apiFetch<MeResult>('/users/me/ngo', { method: 'PATCH', body })

export const forgotPasswordRequest = (identifier: string): Promise<{ message?: string }> =>
  apiFetchEnvelope<undefined>('/auth/forgot-password', { method: 'POST', body: { identifier } }).then(
    (envelope) => ({ message: envelope.message }),
  )
