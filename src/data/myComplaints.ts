export type MyComplaintStatus = 'Active' | 'Matched' | 'Resolved'

export interface CaseEvent {
  id: number
  title: string
  date: string
  detail: string
  state: 'done' | 'current' | 'pending'
}

export interface MyComplaint {
  id: number
  caseRef: string
  name: string
  age: number
  gender: string
  relation: string
  status: MyComplaintStatus
  lastSeen: string
  area: string
  address: string
  contact: string
  clothing: string
  medicalNotes: string
  updatedAt: string
  latest: string
  matchedDaysAgo?: number
  timeline: CaseEvent[]
}

export const complaintSteps = ['Opened', 'Sighting', 'Resolved'] as const

export const myComplaints: MyComplaint[] = [
  {
    id: 101,
    caseRef: 'GW-2026-0112',
    name: 'Rohit Sharma',
    age: 34,
    gender: 'Male',
    relation: 'Brother',
    status: 'Active',
    lastSeen: 'Old Delhi Railway Station',
    area: 'Delhi',
    address: 'H-12, Rajendra Nagar, New Delhi',
    contact: 'Family Helpline: +91 98765 43210',
    clothing: 'Blue denim jacket, black trousers, white sneakers',
    medicalNotes: 'Needs daily medication for diabetes — no supply left from 14 Sep.',
    updatedAt: 'Updated 2 days ago',
    latest: 'Report filed. Search in progress with alerts active within a 6 km radius of the last seen location.',
    timeline: [
      { id: 1, title: 'Complaint Opened', date: '15 Sep 2026', detail: 'Filed with photo. Last seen at Old Delhi Railway Station, Delhi. 6 km alert radius activated.', state: 'done' },
      { id: 2, title: 'Search in Progress', date: '17 Sep 2026', detail: 'Alerts live across the community. Local police station and volunteers notified.', state: 'current' },
      { id: 3, title: 'Awaiting a Sighted Match', date: '', detail: 'When a community member reports a matching sighting, it lands here for verification.', state: 'pending' },
    ],
  },
  {
    id: 102,
    caseRef: 'GW-2026-0087',
    name: 'Kavita Sharma',
    age: 28,
    gender: 'Female',
    relation: 'Sister',
    status: 'Matched',
    lastSeen: 'Azad Market',
    area: 'Lucknow',
    address: 'B-4, Vikas Nagar, Lucknow',
    contact: 'Family Helpline: +91 91234 56780',
    clothing: 'Green kurta, black leggings, silver slippers',
    medicalNotes: 'None.',
    updatedAt: 'Updated today',
    latest: 'Possible sighting shared at Azad Market. Verification with the authorities in progress.',
    matchedDaysAgo: 1,
    timeline: [
      { id: 1, title: 'Complaint Opened', date: '02 Sep 2026', detail: 'Filed with photo. Last seen at Azad Market, Lucknow.', state: 'done' },
      { id: 2, title: 'Sighting Shared', date: '19 Sep 2026', detail: 'A community member shared a matching sighting at Azad Market.', state: 'done' },
      { id: 3, title: 'Verification in Progress', date: '20 Sep 2026', detail: 'Authorities verifying the sighting with the family before confirmation.', state: 'current' },
    ],
  },
  {
    id: 103,
    caseRef: 'GW-2026-0031',
    name: 'Meera Devi',
    age: 67,
    gender: 'Senior Citizen',
    relation: 'Mother',
    status: 'Resolved',
    lastSeen: 'Kashmere Gate Bus Stop',
    area: 'Delhi',
    address: 'C-8, Sarita Vihar, New Delhi',
    contact: 'Family Helpline: +91 98111 22334',
    clothing: 'Red saree, brown shawl',
    medicalNotes: 'Mild hearing loss. Wears a silver bangle with name engraved.',
    updatedAt: 'Updated 1 month ago',
    latest: 'Safely reunited with the family. Case closed by the complainant.',
    timeline: [
      { id: 1, title: 'Complaint Opened', date: '18 Aug 2026', detail: 'Filed with photo. Last seen at Kashmere Gate Bus Stop, Delhi.', state: 'done' },
      { id: 2, title: 'Sighting Shared', date: '29 Aug 2026', detail: 'A sighting was reported a few streets from the family home.', state: 'done' },
      { id: 3, title: 'Reunited', date: '30 Aug 2026', detail: 'Person safely reunited with the family. Case closed.', state: 'done' },
    ],
  },
  {
    id: 104,
    caseRef: 'GW-2026-0064',
    name: 'Imran Khan',
    age: 19,
    gender: 'Male',
    relation: 'Brother',
    status: 'Matched',
    lastSeen: 'Nampally Railway Station',
    area: 'Hyderabad',
    address: '12-3-456, Nampally, Hyderabad',
    contact: 'Family Helpline: +91 90000 12345',
    clothing: 'White shirt, blue jeans',
    medicalNotes: 'None.',
    updatedAt: 'Updated 4 days ago',
    latest: 'Sighting shared near Nampally. Status update is pending with the family.',
    matchedDaysAgo: 3,
    timeline: [
      { id: 1, title: 'Complaint Opened', date: '05 Sep 2026', detail: 'Filed with photo. Last seen at Nampally Railway Station, Hyderabad.', state: 'done' },
      { id: 2, title: 'Sighting Shared', date: '12 Sep 2026', detail: 'A community member shared a matching sighting near Nampally.', state: 'done' },
      { id: 3, title: 'Update Overdue', date: '16 Sep 2026', detail: 'The person has been found, but the family has not updated the status within 2 days.', state: 'current' },
    ],
  },
]

export function matchDeadline(matchedDaysAgo: number): { daysLeft: number; deadline: string } {
  const deadlineDate = new Date()
  deadlineDate.setDate(deadlineDate.getDate() + (2 - matchedDaysAgo))
  const deadline = deadlineDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
  return { daysLeft: 2 - matchedDaysAgo, deadline }
}

export function getInitials(name: string): string {
  return name.split(' ').map((part) => part[0]).slice(0, 2).join('').toUpperCase()
}

export function doneCountFor(status: MyComplaintStatus): number {
  return status === 'Active' ? 1 : status === 'Matched' ? 2 : 3
}

export interface NewComplaintInput {
  personName: string
  age: number
  gender: string
  relation: string
  lastSeen: string
  area: string
  address: string
  contact: string
  clothing: string
  medicalNotes: string
  firNumber: string
}

let nextComplaintId = 200

export function registerComplaint(input: NewComplaintInput): number {
  nextComplaintId += 1
  const id = nextComplaintId
  const today = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
  const complaint: MyComplaint = {
    id,
    caseRef: `GW-2026-${String(id).padStart(4, '0')}`,
    name: input.personName,
    age: input.age,
    gender: input.gender,
    relation: input.relation,
    status: 'Active',
    lastSeen: input.lastSeen,
    area: input.area,
    address: input.address,
    contact: input.contact,
    clothing: input.clothing || 'Not provided',
    medicalNotes: input.medicalNotes || 'None.',
    updatedAt: 'Just now',
    latest: 'Complaint registered. Alerts are active within a 6 km radius of the last seen location.',
    timeline: [
      { id: 1, title: 'Complaint Opened', date: today, detail: `Filed with photo. Last seen at ${input.lastSeen}, ${input.area}. Police complaint ${input.firNumber} attached.`, state: 'done' },
      { id: 2, title: 'Search in Progress', date: '', detail: 'Alerts live across the community. Local police station and volunteers notified.', state: 'current' },
      { id: 3, title: 'Awaiting a Sighted Match', date: '', detail: 'When a community member reports a matching sighting, it lands here for verification.', state: 'pending' },
    ],
  }
  myComplaints.unshift(complaint)
  return id
}