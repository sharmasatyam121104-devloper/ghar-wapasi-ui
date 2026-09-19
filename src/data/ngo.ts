import { useSyncExternalStore } from 'react'

export type NgoStatus = 'pending' | 'verified' | 'rejected'

export interface NgoProfile {
  orgName: string
  orgType: string
  regNumber: string
  state: string
  district: string
  city: string
  address: string
  contactPerson: string
  designation: string
  contactMobile: string
  contactEmail: string
  website: string
  contactAadhaar: string
  hasRegCertificate: boolean
  hasOrgPhoto: boolean
  status: NgoStatus
  submittedAt: number
  vivaCallLink: string
  vivaCallTime: string
  vivaCallNote: string
}

export type NgoFormInput = Omit<NgoProfile, 'status' | 'submittedAt' | 'vivaCallLink' | 'vivaCallTime' | 'vivaCallNote'>

const STORAGE_KEY = 'gw-ngo-profile'

export const UPDATE_WINDOW_MS = 6 * 60 * 60 * 1000

function read(): NgoProfile | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as NgoProfile) : null
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

export function subscribeNgo(listener: () => void) {
  listeners.push(listener)
  return () => {
    listeners = listeners.filter((item) => item !== listener)
  }
}

export function getNgoProfile(): NgoProfile | null {
  return cached
}

export function useNgoProfile(): NgoProfile | null {
  return useSyncExternalStore(subscribeNgo, getNgoProfile, getNgoProfile)
}

export function saveNgoProfile(profile: NgoProfile) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(profile))
  refresh()
}

export function submitNgoRegistration(input: NgoFormInput) {
  saveNgoProfile({ ...input, status: 'pending', submittedAt: Date.now(), vivaCallLink: '', vivaCallTime: '', vivaCallNote: '' })
}

export function updateNgoProfile(patch: Partial<NgoProfile>) {
  if (!cached) return
  saveNgoProfile({ ...cached, ...patch })
}

export function scheduleNgoViva(link: string, time: string, note: string) {
  if (!cached) return
  saveNgoProfile({ ...cached, vivaCallLink: link, vivaCallTime: time, vivaCallNote: note })
}

export function clearNgoProfile() {
  localStorage.removeItem(STORAGE_KEY)
  refresh()
}

export function updateWindowEndsAt(profile: NgoProfile): number {
  return profile.submittedAt + UPDATE_WINDOW_MS
}

export function formatVivaTime(value: string): string {
  if (!value) return '—'
  const match = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/.exec(value)
  if (!match) return value
  const [, year, month, day, hour, minute] = match
  const date = new Date(Number(year), Number(month) - 1, Number(day), Number(hour), Number(minute))
  return date.toLocaleString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric', hour: 'numeric', minute: '2-digit' })
}

export const ngoStatusLabel: Record<NgoStatus, string> = {
  pending: 'Pending admin approval',
  verified: 'Verified',
  rejected: 'Rejected',
}

export const ngoOrgTypes = ['Trust', 'Society', 'Section 8 Company', 'Charitable NGO', 'Religious Organisation', 'Other']