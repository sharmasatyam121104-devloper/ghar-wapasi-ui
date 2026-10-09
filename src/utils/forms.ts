export const splitFullName = (value: string): { first_name: string; last_name: string } => {
  const words = value.trim().split(/\s+/).filter(Boolean)
  const first_name = words.slice(0, Math.max(words.length - 1, 1)).join(' ')
  const last_name = words[words.length - 1] ?? first_name
  return { first_name, last_name }
}

export const formatFieldErrors = (errors?: Record<string, unknown>): string[] => {
  const lines: string[] = []
  for (const [key, value] of Object.entries(errors ?? {})) {
    if (!value) continue
    const parts = key.split('.')
    const label = (parts.pop() ?? key).replace(/_/g, ' ')
    lines.push(`${label.charAt(0).toUpperCase()}${label.slice(1)}: ${value}`)
  }
  return [...new Set(lines)]
}