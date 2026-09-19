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
    height: '5 ft 9 in',
    build: 'Medium',
    marks: 'Scar on left eyebrow',
    clothing: 'Blue denim jacket, black trousers, white sneakers',
    medicalNotes: 'Needs daily medication for diabetes — no supply left from 14 Sep.',
    languages: 'Hindi, English',
    lastSeenDate: '2026-09-15',
    lastSeenTime: '18:30',
    lastSeen: 'Old Delhi Railway Station',
    area: 'Delhi',
    locality: 'Chandni Chowk',
    circumstances: 'Left home to buy medicines and did not return.',
    complainantName: 'Suresh Sharma',
    complainantRelation: 'Brother',
    complainantAadhaar: '123456789012',
    complainantMobile: '9876543210',
    complainantAddress: 'H-12, Rajendra Nagar, New Delhi - 110060',
    memberName: 'Anita Sharma',
    memberRelation: 'Sister',
    memberAadhaar: '234567890123',
    memberMobile: '9123456780',
    policeStation: 'Rajendra Nagar Police Station',
    firNumber: 'FIR/2026/0456',
    firDate: '2026-09-15',
    personPhotos: 2,
    hasComplainantId: true,
    hasMemberId: true,
    hasFirCopy: true,
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
    height: '5 ft 4 in',
    build: 'Slim',
    marks: 'Small mole on right cheek',
    clothing: 'Green kurta, black leggings, silver slippers',
    medicalNotes: 'None.',
    languages: 'Hindi',
    lastSeenDate: '2026-09-02',
    lastSeenTime: '11:15',
    lastSeen: 'Azad Market',
    area: 'Lucknow',
    locality: 'Aminabad',
    circumstances: 'Went to the market and did not return.',
    complainantName: 'Rakesh Sharma',
    complainantRelation: 'Brother',
    complainantAadhaar: '345678901234',
    complainantMobile: '9123456780',
    complainantAddress: 'B-4, Vikas Nagar, Lucknow - 226022',
    memberName: 'Pooja Sharma',
    memberRelation: 'Sister',
    memberAadhaar: '456789012345',
    memberMobile: '9988776655',
    policeStation: 'Aminabad Police Station',
    firNumber: 'FIR/2026/0312',
    firDate: '2026-09-03',
    personPhotos: 3,
    hasComplainantId: true,
    hasMemberId: true,
    hasFirCopy: true,
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
    height: '5 ft 2 in',
    build: 'Slim',
    marks: 'Silver bangle with name engraved',
    clothing: 'Red saree, brown shawl',
    medicalNotes: 'Mild hearing loss. Wears a silver bangle with name engraved.',
    languages: 'Hindi, Bhojpuri',
    lastSeenDate: '2026-08-18',
    lastSeenTime: '09:00',
    lastSeen: 'Kashmere Gate Bus Stop',
    area: 'Delhi',
    locality: 'Kashmere Gate',
    circumstances: 'Boarded a bus to visit a relative and did not reach.',
    complainantName: 'Anil Verma',
    complainantRelation: 'Son',
    complainantAadhaar: '567890123456',
    complainantMobile: '9811122334',
    complainantAddress: 'C-8, Sarita Vihar, New Delhi - 110076',
    memberName: 'Sunita Devi',
    memberRelation: 'Daughter',
    memberAadhaar: '678901234567',
    memberMobile: '9876500011',
    policeStation: 'Kashmere Gate Police Station',
    firNumber: 'FIR/2026/0198',
    firDate: '2026-08-19',
    personPhotos: 2,
    hasComplainantId: true,
    hasMemberId: true,
    hasFirCopy: true,
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
    height: '5 ft 10 in',
    build: 'Athletic',
    marks: 'Tattoo on right forearm',
    clothing: 'White shirt, blue jeans',
    medicalNotes: 'None.',
    languages: 'Telugu, Hindi, English',
    lastSeenDate: '2026-09-05',
    lastSeenTime: '20:45',
    lastSeen: 'Nampally Railway Station',
    area: 'Hyderabad',
    locality: 'Nampally',
    circumstances: 'Did not return after boarding a train.',
    complainantName: 'Sohail Khan',
    complainantRelation: 'Brother',
    complainantAadhaar: '789012345678',
    complainantMobile: '9000012345',
    complainantAddress: '12-3-456, Nampally, Hyderabad - 500001',
    memberName: 'Ayesha Khan',
    memberRelation: 'Sister',
    memberAadhaar: '890123456789',
    memberMobile: '9000054321',
    policeStation: 'Nampally Police Station',
    firNumber: 'FIR/2026/0401',
    firDate: '2026-09-06',
    personPhotos: 1,
    hasComplainantId: true,
    hasMemberId: true,
    hasFirCopy: true,
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

export interface NewComplaintInput {
  personName: string
  age: number
  gender: string
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
    relation: input.complainantRelation,
    status: 'Active',
    height: input.height || 'Not provided',
    build: input.build || 'Not provided',
    marks: input.marks || 'Not provided',
    clothing: input.clothing || 'Not provided',
    medicalNotes: input.medicalNotes || 'None.',
    languages: input.languages || 'Not provided',
    lastSeenDate: input.lastSeenDate,
    lastSeenTime: input.lastSeenTime,
    lastSeen: input.lastSeen,
    area: input.area,
    locality: input.locality || '—',
    circumstances: input.circumstances || 'Not provided',
    complainantName: input.complainantName,
    complainantRelation: input.complainantRelation,
    complainantAadhaar: input.complainantAadhaar,
    complainantMobile: input.complainantMobile,
    complainantAddress: input.complainantAddress,
    memberName: input.memberName,
    memberRelation: input.memberRelation,
    memberAadhaar: input.memberAadhaar,
    memberMobile: input.memberMobile,
    policeStation: input.policeStation,
    firNumber: input.firNumber,
    firDate: input.firDate,
    personPhotos: input.personPhotos,
    hasComplainantId: input.hasComplainantId,
    hasMemberId: input.hasMemberId,
    hasFirCopy: input.hasFirCopy,
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

export function matchDeadline(matchedDaysAgo: number): { daysLeft: number; deadline: string } {
  const deadlineDate = new Date()
  deadlineDate.setDate(deadlineDate.getDate() + (2 - matchedDaysAgo))
  const deadline = deadlineDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
  return { daysLeft: 2 - matchedDaysAgo, deadline }
}