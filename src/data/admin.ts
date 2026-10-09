import { useSyncExternalStore } from 'react'

export type MemberRole = 'police' | 'ngo'
export type MemberStatus = 'pending' | 'verified' | 'rejected'
export type CaseOutcome = 'found' | 'not-found' | 'open'
export type ReportStatus = 'open' | 'reviewing' | 'closed'
export type SuspensionStatus = 'active' | 'lifted'

export interface AdminAccount {
  id: string
  name: string
  email: string
  state: string
  createdAt: number
}

/** The role-specific service/organisation fields an admin reviews. */
export interface MemberProfileDetails {
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
  org_name?: string
  org_type?: string
  reg_number?: string
  address?: string
  city?: string
  contact_person?: string
  designation?: string
  contact_mobile?: string
  contact_email?: string
  website?: string
  contact_aadhaar?: string
}

export interface AdminMember {
  id: string
  assignedAdminId: string
  role: MemberRole
  name: string
  organisation: string
  roleLabel: string
  identifier: string
  state: string
  location: string
  mobile: string
  email: string
  /** Member's own Aadhaar, masked by the server. */
  aadhaar?: string
  /** Full submitted form - raw file paths are kept separately in `documents`. */
  profile?: MemberProfileDetails
  documents: string[]
  status: MemberStatus
  submittedAt: number
  verifiedAt: number
  callLink: string
  callTime: string
  callNote: string
  rejectionReason: string
  linkedPortal: 'police' | 'ngo' | ''
}

export interface OfficerCase {
  id: string
  memberId: string
  caseRef: string
  missingPerson: string
  city: string
  state: string
  firNumber: string
  openedAt: number
  outcome: CaseOutcome
  foundDays: number
  note: string
}

export interface UserReport {
  id: string
  targetMemberId: string
  targetName: string
  targetRole: string
  caseRef: string
  reportedByName: string
  reporterContact: string
  category: string
  details: string
  proof: string[]
  createdAt: number
  status: ReportStatus
  resolution: string
}

export interface Suspension {
  id: string
  memberId: string
  category: string
  reason: string
  proof: string[]
  reportIds: string[]
  suspendedAt: number
  durationDays: number
  endsAt: number
  status: SuspensionStatus
  liftedAt: number
  liftNote: string
  issuedBy: string
  issuedById: string
}

export interface AdminConsoleState {
  admins: AdminAccount[]
  members: AdminMember[]
  cases: OfficerCase[]
  reports: UserReport[]
  suspensions: Suspension[]
}

export const callSlots = [
  { value: '09:00', label: '09:00 – 10:00 AM' },
  { value: '10:00', label: '10:00 – 11:00 AM' },
  { value: '11:00', label: '11:00 AM – 12:00 PM' },
  { value: '12:00', label: '12:00 – 01:00 PM' },
  { value: '14:00', label: '02:00 – 03:00 PM' },
  { value: '15:00', label: '03:00 – 04:00 PM' },
  { value: '16:00', label: '04:00 – 05:00 PM' },
  { value: '17:00', label: '05:00 – 06:00 PM' },
]

export const reportCategories = [
  'Fake / fraudulent profile',
  'Misleading case information',
  'Harassment or abuse',
  'Inappropriate photos',
  'Identity misuse',
  'Fake sighting submitted',
  'Fee demanded from family',
  'Other',
]

export const suspensionReasons = [
  'Fake identity or forged documents',
  'Repeated fake sighting reports',
  'Harassment of a family member',
  'Misuse of the platform',
  'Data / document mismatch after verification call',
  'Requested by the family',
  'Other',
]

const STATE_KEY = 'gw-admin-console-v2'
const HOUR = 60 * 60 * 1000
const DAY = 24 * HOUR

function isoOnDayOffset(offsetDays: number): string {
  const date = new Date()
  date.setDate(date.getDate() + offsetDays)
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

export function slotToIso(date: string, slot: string): string {
  return `${date}T${slot}`
}

export function todayIso(): string {
  return isoOnDayOffset(0)
}

export function buildCallTime(date: string, slot: string): string {
  return slotToIso(date, slot)
}

function seed(): AdminConsoleState {
  const now = Date.now()
  const admins: AdminAccount[] = [
    { id: 'adm-priyanka', name: 'Priyanka Nair', email: 'priyanka.nair@admin.gharwapasi.gov.in', state: 'Delhi', createdAt: now - 90 * DAY },
    { id: 'adm-sanjay', name: 'Sanjay Iyer', email: 'sanjay.iyer@admin.gharwapasi.gov.in', state: 'Maharashtra', createdAt: now - 74 * DAY },
    { id: 'adm-farah', name: 'Farah Khan', email: 'farah.khan@admin.gharwapasi.gov.in', state: 'Uttar Pradesh', createdAt: now - 41 * DAY },
  ]
  const [priyanka, sanjay, farah] = admins.map((item) => item.id)

  return {
    admins,
    members: [
      {
        id: 'pol-101', assignedAdminId: priyanka, role: 'police', name: 'Devendra Singh',
        organisation: 'Chandni Chowk Police Station', roleLabel: 'Sub-Inspector', identifier: 'Badge 88214',
        state: 'Delhi', location: 'Chandni Chowk · Delhi', mobile: '9811045566', email: 'dev.singh@delhipolice.gov.in',
        documents: ['Service ID card.jpg', 'Appointment letter.pdf', 'Employee ID proof.jpg'],
        status: 'pending', submittedAt: now - 5 * HOUR, verifiedAt: 0,
        callLink: '', callTime: '', callNote: '', rejectionReason: '', linkedPortal: '',
      },
      {
        id: 'ngo-201', assignedAdminId: farah, role: 'ngo', name: 'Farhan Qureshi',
        organisation: 'Khaq-e-Rahmat Foundation', roleLabel: 'Trust · Programme Coordinator', identifier: 'Reg. UP/2019/44812',
        state: 'Uttar Pradesh', location: 'Lucknow · Uttar Pradesh', mobile: '9001122334', email: 'farhan@khaqerahmat.org',
        documents: ['Registration certificate.pdf', 'Organisation photo.jpg'],
        status: 'pending', submittedAt: now - 26 * HOUR, verifiedAt: 0,
        callLink: 'https://meet.google.com/gw-verify-ngo44812', callTime: slotToIso(isoOnDayOffset(1), '10:00'),
        callNote: 'Please keep your registration certificate ready.', rejectionReason: '', linkedPortal: '',
      },
      {
        id: 'ngo-202', assignedAdminId: sanjay, role: 'ngo', name: 'Priya Menon',
        organisation: 'Sanketha Missing Persons Cell', roleLabel: 'Society · Field Lead', identifier: 'Reg. KA/2021/10992',
        state: 'Karnataka', location: 'Bengaluru · Karnataka', mobile: '9845566778', email: 'priya@sanketha.org',
        documents: ['Registration certificate.pdf', '12A certificate.pdf'],
        status: 'pending', submittedAt: now - 40 * HOUR, verifiedAt: 0,
        callLink: '', callTime: '', callNote: '', rejectionReason: '', linkedPortal: '',
      },
      {
        id: 'pol-102', assignedAdminId: farah, role: 'police', name: 'Sunita Verma',
        organisation: 'Aminabad Police Station', roleLabel: 'Assistant Sub-Inspector', identifier: 'Badge 77410',
        state: 'Uttar Pradesh', location: 'Aminabad · Uttar Pradesh', mobile: '9450099887', email: 'sunita.verma@uppolice.gov.in',
        documents: ['Service ID card.jpg', 'Employee ID proof.jpg'],
        status: 'pending', submittedAt: now - 2 * DAY, verifiedAt: 0,
        callLink: '', callTime: '', callNote: '', rejectionReason: '', linkedPortal: '',
      },
      {
        id: 'pol-103', assignedAdminId: sanjay, role: 'police', name: 'Harpreet Singh',
        organisation: 'Nampally Police Station', roleLabel: 'Inspector', identifier: 'Badge 55120',
        state: 'Telangana', location: 'Nampally · Hyderabad', mobile: '9886776655', email: 'harpreet.singh@tspolice.gov.in',
        documents: ['Service ID card.jpg', 'Employee ID proof.jpg', 'Appointment proof.pdf'],
        status: 'verified', submittedAt: now - 9 * DAY, verifiedAt: now - 8 * DAY,
        callLink: 'https://meet.google.com/gw-verify-pol55120', callTime: slotToIso(isoOnDayOffset(-7), '11:00'),
        callNote: 'Service ID verified on the call.', rejectionReason: '', linkedPortal: '',
      },
      {
        id: 'pol-104', assignedAdminId: priyanka, role: 'police', name: 'Anita Sharma',
        organisation: 'Kashmere Gate Police Station', roleLabel: 'Head Constable', identifier: 'Badge 66301',
        state: 'Delhi', location: 'Kashmere Gate · Delhi', mobile: '9811223344', email: 'anita.sharma@delhipolice.gov.in',
        documents: ['Service ID card.jpg'],
        status: 'verified', submittedAt: now - 16 * DAY, verifiedAt: now - 15 * DAY,
        callLink: 'https://meet.google.com/gw-verify-pol66301', callTime: slotToIso(isoOnDayOffset(-14), '15:00'),
        callNote: '', rejectionReason: '', linkedPortal: '',
      },
      {
        id: 'ngo-203', assignedAdminId: priyanka, role: 'ngo', name: 'Rizwan Ali',
        organisation: 'Aasra Welfare Trust', roleLabel: 'Charitable NGO · Secretary', identifier: 'Reg. DL/2017/30219',
        state: 'Delhi', location: 'New Delhi · Delhi', mobile: '9899001122', email: 'rizwan@asraswelfare.in',
        documents: ['Registration certificate.pdf', 'Organisation photo.jpg', 'Audited report.pdf'],
        status: 'verified', submittedAt: now - 24 * DAY, verifiedAt: now - 22 * DAY,
        callLink: 'https://meet.google.com/gw-verify-ngo30219', callTime: slotToIso(isoOnDayOffset(-20), '12:00'),
        callNote: 'Viva call completed, registration confirmed.', rejectionReason: '', linkedPortal: '',
      },
      {
        id: 'ngo-204', assignedAdminId: sanjay, role: 'ngo', name: 'Mahesh Yadav',
        organisation: 'Mukti Sewa Samiti', roleLabel: 'Trust · District Coordinator', identifier: 'Reg. MH/2020/77431',
        state: 'Maharashtra', location: 'Nagpur · Maharashtra', mobile: '9970556677', email: 'mahesh@muktisewa.org',
        documents: ['Registration certificate.pdf'],
        status: 'rejected', submittedAt: now - 11 * DAY, verifiedAt: 0,
        callLink: 'https://meet.google.com/gw-verify-ngo77431', callTime: slotToIso(isoOnDayOffset(-9), '16:00'),
        callNote: '', rejectionReason: 'Registration certificate number did not match the state register during the viva call.', linkedPortal: '',
      },
    ],
    cases: [
      { id: 'cs-01', memberId: 'pol-103', caseRef: 'GW-2026-0112', missingPerson: 'Rohit Sharma', city: 'Delhi', state: 'Delhi', firNumber: 'FIR/2026/0456', openedAt: now - 6 * DAY, outcome: 'open', foundDays: 0, note: 'Search running. Alerts live within a 6 km radius of Old Delhi Railway Station.' },
      { id: 'cs-02', memberId: 'pol-103', caseRef: 'GW-2026-0087', missingPerson: 'Kavita Sharma', city: 'Lucknow', state: 'Uttar Pradesh', firNumber: 'FIR/2026/0312', openedAt: now - 11 * DAY, outcome: 'found', foundDays: 3, note: 'Sighting verified at Azad Market, custody handed to the brother.' },
      { id: 'cs-03', memberId: 'pol-103', caseRef: 'GW-2026-0064', missingPerson: 'Imran Khan', city: 'Hyderabad', state: 'Telangana', firNumber: 'FIR/2026/0401', openedAt: now - 14 * DAY, outcome: 'found', foundDays: 7, note: 'Traced from Nampally. Family status update still pending.' },
      { id: 'cs-04', memberId: 'pol-104', caseRef: 'GW-2026-0031', missingPerson: 'Meera Devi', city: 'Delhi', state: 'Delhi', firNumber: 'FIR/2026/0198', openedAt: now - 28 * DAY, outcome: 'found', foundDays: 12, note: 'Reunited at Kashmere Gate Bus Stop and handed to the son.' },
      { id: 'cs-05', memberId: 'ngo-203', caseRef: 'GW-2026-0044', missingPerson: 'Salma Begum', city: 'Lucknow', state: 'Uttar Pradesh', firNumber: 'FIR/2026/0355', openedAt: now - 19 * DAY, outcome: 'not-found', foundDays: 0, note: 'Sighting turned out to be a lookalike. Closed as not found after field verification.' },
      { id: 'cs-06', memberId: 'ngo-203', caseRef: 'GW-2026-0018', missingPerson: 'Deepak Rathore', city: 'Jaipur', state: 'Rajasthan', firNumber: 'FIR/2026/0121', openedAt: now - 30 * DAY, outcome: 'not-found', foundDays: 0, note: 'No verified sighting in 30 days. Family informed in writing.' },
      { id: 'cs-07', memberId: 'ngo-203', caseRef: 'GW-2026-0166', missingPerson: 'Nusrat Ali', city: 'Delhi', state: 'Delhi', firNumber: 'FIR/2026/0471', openedAt: now - 9 * DAY, outcome: 'found', foundDays: 5, note: 'Found at a shelter in Burari, reunited with the family the same evening.' },
    ],
    reports: [
      {
        id: 'rp-01', targetMemberId: 'ngo-203', targetName: 'Aasra Welfare Trust', targetRole: 'NGO account',
        caseRef: 'GW-2026-0112', reportedByName: 'Suresh Sharma', reporterContact: '9876543210',
        category: 'Fee demanded from family',
        details: 'Two volunteers visited the house and asked for ₹5,000 saying it is the "processing charge" for the search. No receipt was given.',
        proof: ['Screenshot-2026-09-18.png', 'Photo of demand note.jpg'], createdAt: now - 4 * HOUR, status: 'open', resolution: '',
      },
      {
        id: 'rp-02', targetMemberId: 'pol-104', targetName: 'Anita Sharma', targetRole: 'Police account',
        caseRef: 'GW-2026-0031', reportedByName: 'Sunita Devi', reporterContact: '9876500011',
        category: 'Misleading case information',
        details: 'The officer wrote a different last-seen place in the register than the one in the complaint.',
        proof: ['Register-page.pdf'], createdAt: now - 2 * DAY, status: 'reviewing', resolution: 'Called the station for clarification.',
      },
      {
        id: 'rp-03', targetMemberId: 'pol-103', targetName: 'Harpreet Singh', targetRole: 'Police account',
        caseRef: 'GW-2026-0064', reportedByName: 'Ayesha Khan', reporterContact: '9000054321',
        category: 'Other',
        details: 'Case was not updated for four days after the person was found. Wanted a timeline entry.',
        proof: [], createdAt: now - 6 * DAY, status: 'closed', resolution: 'Timeline updated by the station and the family was informed.',
      },
      {
        id: 'rp-04', targetMemberId: 'ngo-204', targetName: 'Mukti Sewa Samiti', targetRole: 'NGO account',
        caseRef: 'GW-2026-0098', reportedByName: 'Pooja Sharma', reporterContact: '9988776655',
        category: 'Fake sighting submitted',
        details: 'The organisation submitted three sightings with the same old photograph taken in 2019.',
        proof: ['Old-photo-1.jpg', 'Old-photo-2.jpg', 'Metadata-check.png'], createdAt: now - 12 * DAY, status: 'closed',
        resolution: 'Registration rejected and the account was permanently blocked.',
      },
      {
        id: 'rp-05', targetMemberId: 'ngo-201', targetName: 'Khaq-e-Rahmat Foundation', targetRole: 'NGO account',
        caseRef: 'GW-2026-0102', reportedByName: 'Kavita Sharma', reporterContact: '9123456780',
        category: 'Other',
        details: 'The volunteer refused to share the FIR copy with the family and kept the number private.',
        proof: ['Call-transcript-note.pdf'], createdAt: now - 3 * DAY, status: 'open', resolution: '',
      },
    ],
    suspensions: [
      {
        id: 'su-01', memberId: 'ngo-204', category: 'Fake sighting submitted',
        reason: 'Three sightings were submitted using a photograph from 2019, confirmed from the file metadata. The organisation was found to be operating with a non-verifiable registration number.',
        proof: ['Old-photo-1.jpg', 'Metadata-check.png', 'State register extract.pdf'], reportIds: ['rp-04'],
        suspendedAt: now - 12 * DAY, durationDays: 0, endsAt: 0, status: 'active', liftedAt: 0, liftNote: '',
        issuedBy: 'Sanjay Iyer', issuedById: sanjay,
      },
    ],
  }
}

function read(): AdminConsoleState {
  try {
    const raw = localStorage.getItem(STATE_KEY)
    if (!raw) return seed()
    const parsed = JSON.parse(raw) as AdminConsoleState
    if (!parsed.admins?.length || !parsed.members || !parsed.cases || !parsed.reports || !parsed.suspensions) return seed()
    return parsed
  } catch {
    return seed()
  }
}

let cached = read()
let listeners: Array<() => void> = []

function commit(next: AdminConsoleState) {
  cached = next
  localStorage.setItem(STATE_KEY, JSON.stringify(next))
  listeners.forEach((listener) => listener())
}

function refresh() {
  cached = read()
  listeners.forEach((listener) => listener())
}

function subscribeAdmin(listener: () => void) {
  listeners.push(listener)
  return () => {
    listeners = listeners.filter((item) => item !== listener)
  }
}

function getState(): AdminConsoleState {
  return cached
}

export function useAdminConsole(): AdminConsoleState {
  return useSyncExternalStore(subscribeAdmin, getState, getState)
}

export function resetAdminConsole() {
  localStorage.removeItem(STATE_KEY)
  refresh()
}

export function setCaseOutcome(caseId: string, outcome: CaseOutcome, note: string, foundDays: number) {
  const state = getState()
  commit({
    ...state,
    cases: state.cases.map((item) => (item.id === caseId ? { ...item, outcome, note, foundDays: outcome === 'found' ? foundDays : 0 } : item)),
  })
}

export function setReportStatus(reportId: string, status: ReportStatus, resolution: string) {
  const state = getState()
  commit({
    ...state,
    reports: state.reports.map((report) => (report.id === reportId ? { ...report, status, resolution } : report)),
  })
}

export function suspendMember(input: {
  memberId: string
  category: string
  reason: string
  proof: string[]
  reportIds: string[]
  durationDays: number
  issuedBy: AdminAccount
}) {
  const state = getState()
  const suspendedAt = Date.now()
  const suspension: Suspension = {
    id: `su-${Date.now()}`,
    memberId: input.memberId,
    category: input.category,
    reason: input.reason,
    proof: input.proof,
    reportIds: input.reportIds,
    suspendedAt,
    durationDays: input.durationDays,
    endsAt: input.durationDays > 0 ? suspendedAt + input.durationDays * DAY : 0,
    status: 'active',
    liftedAt: 0,
    liftNote: '',
    issuedBy: input.issuedBy.name,
    issuedById: input.issuedBy.id,
  }
  commit({ ...state, suspensions: [suspension, ...state.suspensions] })
}

export function liftSuspension(suspensionId: string, note: string) {
  const state = getState()
  commit({
    ...state,
    suspensions: state.suspensions.map((item) =>
      item.id === suspensionId ? { ...item, status: 'lifted', liftedAt: Date.now(), liftNote: note } : item,
    ),
  })
}

export function isMemberSuspended(state: AdminConsoleState, memberId: string): boolean {
  return state.suspensions.some((item) => item.memberId === memberId && item.status === 'active')
}

export function canAccess(admin: AdminAccount, member: AdminMember): boolean {
  return member.assignedAdminId === admin.id
}

export function scopedMembers(state: AdminConsoleState, admin: AdminAccount): AdminMember[] {
  return state.members.filter((member) => canAccess(admin, member))
}

export function scopedCases(state: AdminConsoleState, admin: AdminAccount): OfficerCase[] {
  const allowed = new Set(scopedMembers(state, admin).map((member) => member.id))
  return state.cases.filter((item) => allowed.has(item.memberId))
}

export function scopedReports(state: AdminConsoleState, admin: AdminAccount): UserReport[] {
  const allowed = new Set(scopedMembers(state, admin).map((member) => member.id))
  return state.reports.filter((report) => allowed.has(report.targetMemberId))
}

export function scopedSuspensions(state: AdminConsoleState, admin: AdminAccount): Suspension[] {
  const allowed = new Set(scopedMembers(state, admin).map((member) => member.id))
  return state.suspensions.filter((item) => allowed.has(item.memberId))
}

export interface CaseTally {
  total: number
  found: number
  notFound: number
  open: number
  successRate: number
  avgDays: number
}

export function tallyCases(rows: OfficerCase[]): CaseTally {
  const found = rows.filter((item) => item.outcome === 'found')
  const notFound = rows.filter((item) => item.outcome === 'not-found')
  const closed = found.length + notFound.length
  return {
    total: rows.length,
    found: found.length,
    notFound: notFound.length,
    open: rows.filter((item) => item.outcome === 'open').length,
    successRate: closed === 0 ? 0 : Math.round((found.length / closed) * 100),
    avgDays: found.length === 0 ? 0 : Math.round(found.reduce((sum, item) => sum + item.foundDays, 0) / found.length),
  }
}

export function timeAgo(timestamp: number): string {
  if (!timestamp) return '—'
  const diff = Date.now() - timestamp
  if (diff < HOUR) return `${Math.max(1, Math.floor(diff / 60000))} min ago`
  if (diff < DAY) return `${Math.floor(diff / HOUR)} hr ago`
  const days = Math.floor(diff / DAY)
  return days === 1 ? 'Yesterday' : `${days} days ago`
}

export function formatSlot(iso: string): string {
  if (!iso) return '—'
  const match = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/.exec(iso)
  if (!match) return iso
  const [, year, month, day, hour, minute] = match
  const date = new Date(Number(year), Number(month) - 1, Number(day), Number(hour), Number(minute))
  const slot = callSlots.find((item) => item.value === `${hour}:${minute}`)
  return `${date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}${slot ? ` · ${slot.label}` : ''}`
}
