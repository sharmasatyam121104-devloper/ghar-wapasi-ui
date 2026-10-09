import { useCallback, useEffect, useState } from 'react'
import { apiFetch, errorMessage } from '../api/client'
import { uploadFiles } from '../api/files'
import type { CaseEvent, MyComplaint, MyComplaintStatus } from './myComplaints'

/** The server's snake_case complaint. Full-only fields are absent on a summary. */
export interface ApiComplaint {
  id: string
  case_ref: string
  status: 'active' | 'matched' | 'resolved'
  created_by: string
  created_by_role: 'public' | 'police' | 'ngo'

  person_name: string
  person_age: number
  person_gender: string
  person_height?: string
  person_build?: string
  person_marks?: string
  person_clothing?: string
  person_medical_notes?: string
  person_languages?: string
  person_photos?: string[]

  last_seen_date: string
  last_seen_time?: string
  last_seen_place: string
  last_seen_city: string
  last_seen_area?: string
  circumstances?: string

  fir_number?: string
  has_fir_copy?: boolean

  complainant_name?: string
  complainant_relation?: string
  complainant_aadhaar?: string
  complainant_mobile?: string
  complainant_address?: string

  member_name?: string
  member_relation?: string
  member_aadhaar?: string
  member_mobile?: string

  police_station?: string
  fir_date?: string
  location_photos?: string[]
  complainant_id_files?: string[]
  member_id_files?: string[]
  fir_copy_files?: string[]

  timeline?: { title: string; date: string; detail: string; state: CaseEvent['state'] }[]
  created_at?: string
  updated_at?: string
}

/** The server omits the contact/Aadhaar block on a summary, so its presence marks a full record. */
export const isFullComplaint = (complaint: ApiComplaint): boolean =>
  typeof complaint.complainant_mobile === 'string' || typeof complaint.member_name === 'string'

const formatDate = (value?: string): string => {
  if (!value) return '—'
  const parsed = Date.parse(value)
  if (Number.isNaN(parsed)) return value
  return new Date(parsed).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
}

const relativeUpdated = (value?: string): string => {
  if (!value) return ''
  const parsed = Date.parse(value)
  if (Number.isNaN(parsed)) return ''
  const minutes = Math.floor((Date.now() - parsed) / 60000)
  if (minutes < 1) return 'Updated just now'
  if (minutes < 60) return `Updated ${minutes} min ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `Updated ${hours} hour${hours === 1 ? '' : 's'} ago`
  const days = Math.floor(hours / 24)
  if (days < 30) return `Updated ${days} day${days === 1 ? '' : 's'} ago`
  return `Updated ${formatDate(value)}`
}

const statusMap: Record<ApiComplaint['status'], MyComplaintStatus> = {
  active: 'Active',
  matched: 'Matched',
  resolved: 'Resolved',
}

export const toMyComplaint = (api: ApiComplaint): MyComplaint => {
  const full = isFullComplaint(api)
  const last = api.timeline?.[api.timeline.length - 1]
  const matchedDaysAgo =
    api.status === 'matched' && api.updated_at
      ? Math.max(0, Math.floor((Date.now() - Date.parse(api.updated_at)) / 86_400_000))
      : undefined

  return {
    id: api.id,
    caseRef: api.case_ref || '—',
    name: api.person_name,
    age: api.person_age,
    gender: api.person_gender,
    relation: api.complainant_relation || '—',
    status: statusMap[api.status],
    height: api.person_height || 'Not provided',
    build: api.person_build || 'Not provided',
    marks: api.person_marks || 'Not provided',
    clothing: api.person_clothing || 'Not provided',
    medicalNotes: api.person_medical_notes || 'None.',
    languages: api.person_languages || 'Not provided',
    lastSeenDate: formatDate(api.last_seen_date),
    lastSeenTime: api.last_seen_time || '—',
    lastSeen: api.last_seen_place,
    area: api.last_seen_city,
    locality: api.last_seen_area || '—',
    circumstances: api.circumstances || 'Not provided',
    complainantName: api.complainant_name || 'Not shared',
    complainantRelation: api.complainant_relation || '—',
    complainantAadhaar: api.complainant_aadhaar || '',
    complainantMobile: api.complainant_mobile || '',
    complainantAddress: api.complainant_address || '—',
    memberName: api.member_name || 'Not shared',
    memberRelation: api.member_relation || '—',
    memberAadhaar: api.member_aadhaar || '',
    memberMobile: api.member_mobile || '',
    policeStation: api.police_station || '—',
    firNumber: api.fir_number || '',
    firDate: formatDate(api.fir_date),
    personPhotos: api.person_photos?.length ?? 0,
    hasComplainantId: (api.complainant_id_files?.length ?? 0) > 0,
    hasMemberId: (api.member_id_files?.length ?? 0) > 0,
    hasFirCopy: api.has_fir_copy ?? (api.fir_copy_files?.length ?? 0) > 0,
    full,
    createdBy: api.created_by,
    updatedAt: relativeUpdated(api.updated_at),
    latest: last?.detail || 'Complaint registered.',
    matchedDaysAgo,
    timeline: (api.timeline ?? []).map((event, index) => ({
      id: index + 1,
      title: event.title,
      date: event.date ? formatDate(event.date) : '',
      detail: event.detail,
      state: event.state,
    })),
  }
}

/* ------------------------------------------------------------------ */
/* Reads                                                               */
/* ------------------------------------------------------------------ */

export interface ComplaintsState {
  complaints: MyComplaint[]
  loading: boolean
  error: string | null
  reload: () => void
}

export function useComplaints(): ComplaintsState {
  const [complaints, setComplaints] = useState<MyComplaint[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [version, setVersion] = useState(0)

  useEffect(() => {
    let alive = true
    void (async () => {
      try {
        const data = await apiFetch<{ complaints?: ApiComplaint[] }>('/complaints')
        if (alive) {
          setComplaints((data.complaints ?? []).map(toMyComplaint))
          setError(null)
        }
      } catch (cause) {
        if (alive) {
          setComplaints([])
          setError(errorMessage(cause))
        }
      } finally {
        if (alive) setLoading(false)
      }
    })()
    return () => {
      alive = false
    }
  }, [version])

  const reload = useCallback(() => setVersion((value) => value + 1), [])
  return { complaints, loading, error, reload }
}

export interface ComplaintState {
  complaint: MyComplaint | null
  loading: boolean
  error: string | null
  reload: () => void
}

export function useComplaint(id?: string): ComplaintState {
  const [complaint, setComplaint] = useState<MyComplaint | null>(null)
  const [loading, setLoading] = useState(Boolean(id))
  const [error, setError] = useState<string | null>(id ? null : 'This case reference is missing.')
  const [version, setVersion] = useState(0)

  useEffect(() => {
    if (!id) return undefined
    let alive = true
    void (async () => {
      try {
        const data = await apiFetch<ApiComplaint>(`/complaints/${id}`)
        if (alive) {
          setComplaint(toMyComplaint(data))
          setError(null)
        }
      } catch (cause) {
        if (alive) {
          setComplaint(null)
          setError(errorMessage(cause))
        }
      } finally {
        if (alive) setLoading(false)
      }
    })()
    return () => {
      alive = false
    }
  }, [id, version])

  const reload = useCallback(() => setVersion((value) => value + 1), [])
  return { complaint, loading, error, reload }
}

/* ------------------------------------------------------------------ */
/* Writes                                                              */
/* ------------------------------------------------------------------ */

export type FilingRole = 'public' | 'police' | 'ngo'

export interface NewComplaintFiles {
  personPhotos: File[]
  locationPhotos: File[]
  complainantIdFiles: File[]
  memberIdFiles: File[]
  firCopyFiles: File[]
}

/**
 * Uploads each non-empty document group, then files the report with the
 * returned `tmp/*` references wired into the matching body keys.
 */
export async function submitComplaint(
  role: FilingRole,
  body: Record<string, unknown>,
  files: NewComplaintFiles,
): Promise<ApiComplaint> {
  const reference = async (list: File[]): Promise<string[]> =>
    list.length === 0 ? [] : (await uploadFiles(list)).map((file) => file.ref)

  const [personPhotos, locationPhotos, complainantIdFiles, memberIdFiles, firCopyFiles] = await Promise.all([
    reference(files.personPhotos),
    reference(files.locationPhotos),
    reference(files.complainantIdFiles),
    reference(files.memberIdFiles),
    reference(files.firCopyFiles),
  ])

  return apiFetch<ApiComplaint>(`/complaints/${role}`, {
    method: 'POST',
    body: { ...body, person_photos: personPhotos, location_photos: locationPhotos, complainant_id_files: complainantIdFiles, member_id_files: memberIdFiles, fir_copy_files: firCopyFiles },
  })
}

export const updateComplaint = (
  id: string,
  body: { status?: ApiComplaint['status'] },
): Promise<ApiComplaint> => apiFetch<ApiComplaint>(`/complaints/${id}`, { method: 'PATCH', body })
