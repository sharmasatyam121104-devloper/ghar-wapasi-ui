import { useSyncExternalStore } from 'react'

export type PoliceStatus = 'pending' | 'verified' | 'rejected'

export interface PoliceProfile {
  fullName: string
  rank: string
  badgeNumber: string
  stationName: string
  district: string
  state: string
  officialEmail: string
  aadhaar: string
  mobile: string
  employeeId: string
  joiningDate: string
  reportingOfficer: string
  reportingOfficerContact: string
  hasIdCard: boolean
  hasAppointmentProof: boolean
  status: PoliceStatus
  submittedAt: number
  verifyCallLink: string
  verifyCallTime: string
  verifyCallNote: string
}

export type PoliceFormInput = Omit<PoliceProfile, 'status' | 'submittedAt' | 'verifyCallLink' | 'verifyCallTime' | 'verifyCallNote'>

const STORAGE_KEY = 'gw-police-profile'

export const UPDATE_WINDOW_MS = 6 * 60 * 60 * 1000

function read(): PoliceProfile | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as PoliceProfile) : null
  } catch {
    return null
  }
}

let cached = read()
let listeners: Array<() => void> = []

function refresh() {
  cached = read()
  listeners.forEach((listener) => listener())
}

export function subscribePolice(listener: () => void) {
  listeners.push(listener)
  return () => {
    listeners = listeners.filter((item) => item !== listener)
  }
}

export function getPoliceProfile(): PoliceProfile | null {
  return cached
}

export function usePoliceProfile(): PoliceProfile | null {
  return useSyncExternalStore(subscribePolice, getPoliceProfile, getPoliceProfile)
}

export function savePoliceProfile(profile: PoliceProfile) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(profile))
  refresh()
}

export function submitPoliceRegistration(input: PoliceFormInput) {
  savePoliceProfile({ ...input, status: 'pending', submittedAt: Date.now(), verifyCallLink: '', verifyCallTime: '', verifyCallNote: '' })
}

export function updatePoliceProfile(patch: Partial<PoliceProfile>) {
  if (!cached) return
  savePoliceProfile({ ...cached, ...patch })
}

export function scheduleVerificationCall(link: string, time: string, note: string) {
  if (!cached) return
  savePoliceProfile({ ...cached, verifyCallLink: link, verifyCallTime: time, verifyCallNote: note })
}

export function formatCallTime(value: string): string {
  if (!value) return '—'
  const match = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/.exec(value)
  if (!match) return value
  const [, year, month, day, hour, minute] = match
  const date = new Date(Number(year), Number(month) - 1, Number(day), Number(hour), Number(minute))
  return date.toLocaleString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric', hour: 'numeric', minute: '2-digit' })
}

export function clearPoliceProfile() {
  localStorage.removeItem(STORAGE_KEY)
  refresh()
}

export function updateWindowEndsAt(profile: PoliceProfile): number {
  return profile.submittedAt + UPDATE_WINDOW_MS
}

export function isWithinUpdateWindow(profile: PoliceProfile): boolean {
  return Date.now() < updateWindowEndsAt(profile)
}

export const policeStatusLabel: Record<PoliceStatus, string> = {
  pending: 'Pending admin approval',
  verified: 'Verified',
  rejected: 'Rejected',
}
