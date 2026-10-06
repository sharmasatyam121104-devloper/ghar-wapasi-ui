import { apiFetch } from './client'
import type { AdminMember, MemberStatus } from '../data/admin'

export type VerificationStatus = MemberStatus

/** Shape returned by the server's verification serializer (see users.serializers.ts). */
export interface VerificationRecord {
  id: string
  name: string
  role: string
  identifier: string
  email: string
  mobile: string
  adminId: string
  verification_status: VerificationStatus
  state: string
  location: string
  organisation: string
  roleLabel: string
  status: VerificationStatus
  documents: string[]
  submitted_at?: string
  rejection_reason?: string
  reviewed_at?: string
  assigned_admin_id: string | null
  verification_call: {
    link?: string
    time?: string
    note?: string
    scheduled_by?: string
    scheduled_at?: string
  } | null
}

export interface VerificationList {
  users: VerificationRecord[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface ScheduleCallInput {
  link: string
  time: string
  note?: string
}

export function listRequests(
  status: VerificationStatus,
  options: { search?: string; page?: number; limit?: number } = {},
): Promise<VerificationList> {
  const params = new URLSearchParams({
    verificationStatus: status,
    page: String(options.page ?? 1),
    limit: String(options.limit ?? 100),
  })
  if (options.search) params.set('search', options.search)
  return apiFetch<VerificationList>(`/verification/requests?${params.toString()}`)
}

export const scheduleCall = (id: string, input: ScheduleCallInput): Promise<VerificationRecord> =>
  apiFetch<VerificationRecord>(`/verification/requests/${id}/call`, {
    method: 'POST',
    body: input,
  })

export const clearCall = (id: string): Promise<VerificationRecord> =>
  apiFetch<VerificationRecord>(`/verification/requests/${id}/call`, { method: 'DELETE' })

export const approveRequest = (id: string): Promise<VerificationRecord> =>
  apiFetch<VerificationRecord>(`/verification/requests/${id}/approve`, {
    method: 'POST',
    body: {},
  })

export const rejectRequest = (id: string, reason: string): Promise<VerificationRecord> =>
  apiFetch<VerificationRecord>(`/verification/requests/${id}/reject`, {
    method: 'POST',
    body: { reason },
  })

/** Maps the server record onto the shape the admin pages already render. */
export function toAdminMember(record: VerificationRecord): AdminMember {
  const call = record.verification_call
  return {
    id: record.id,
    assignedAdminId: record.assigned_admin_id ?? '',
    role: record.role === 'ngo' ? 'ngo' : 'police',
    name: record.name,
    organisation: record.organisation,
    roleLabel: record.roleLabel,
    identifier: record.identifier,
    state: record.state,
    location: record.location,
    mobile: record.mobile,
    email: record.email,
    documents: record.documents ?? [],
    status: record.status,
    submittedAt: record.submitted_at ? Date.parse(record.submitted_at) || Date.now() : Date.now(),
    verifiedAt: record.reviewed_at ? Date.parse(record.reviewed_at) || 0 : 0,
    callLink: call?.link ?? '',
    callTime: call?.time ?? '',
    callNote: call?.note ?? '',
    rejectionReason: record.rejection_reason ?? '',
    linkedPortal: record.role === 'ngo' ? 'ngo' : 'police',
  }
}
