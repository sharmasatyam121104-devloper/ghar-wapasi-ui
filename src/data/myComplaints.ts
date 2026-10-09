export type MyComplaintStatus = 'Active' | 'Matched' | 'Resolved'

export interface CaseEvent {
  id: number
  title: string
  date: string
  detail: string
  state: 'done' | 'current' | 'pending'
}

export interface MyComplaint {
  id: string
  caseRef: string
  name: string
  age: number
  gender: string
  relation: string
  status: MyComplaintStatus
  height: string
  build: string
  marks: string
  clothing: string
  medicalNotes: string
  languages: string
  lastSeenDate: string
  lastSeenTime: string
  lastSeen: string
  area: string
  locality: string
  circumstances: string
  complainantName: string
  complainantRelation: string
  complainantAadhaar: string
  complainantMobile: string
  complainantAddress: string
  memberName: string
  memberRelation: string
  memberAadhaar: string
  memberMobile: string
  policeStation: string
  firNumber: string
  firDate: string
  personPhotos: number
  hasComplainantId: boolean
  hasMemberId: boolean
  hasFirCopy: boolean
  /** True when the caller is entitled to the full record, not just the summary. */
  full: boolean
  /** The filing account's id, so the detail view can spot the owner. */
  createdBy: string
  updatedAt: string
  latest: string
  matchedDaysAgo?: number
  timeline: CaseEvent[]
}

export const complaintSteps = ['Opened', 'Sighting', 'Resolved'] as const

export function getInitials(name: string): string {
  return name.split(' ').map((part) => part[0]).slice(0, 2).join('').toUpperCase()
}

export function doneCountFor(status: MyComplaintStatus): number {
  return status === 'Active' ? 1 : status === 'Matched' ? 2 : 3
}

export function maskAadhaar(value: string): string {
  if (value.length !== 12) return value
  return `XXXX XXXX ${value.slice(-4)}`
}

export function matchDeadline(matchedDaysAgo: number): { daysLeft: number; deadline: string } {
  const deadlineDate = new Date()
  deadlineDate.setDate(deadlineDate.getDate() + (2 - matchedDaysAgo))
  const deadline = deadlineDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
  return { daysLeft: 2 - matchedDaysAgo, deadline }
}
