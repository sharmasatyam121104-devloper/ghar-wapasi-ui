import { apiUpload } from './client'

export interface UploadedFile {
  /** `tmp/<name>` reference to pass into the registration body. */
  ref: string
  name: string
  size: number
  mime: string
}

/**
 * Uploads registration documents and returns the `tmp/*` references the
 * sign-up payload carries. Files only move into the member's folder once the
 * registration is accepted on the server.
 */
export const uploadFiles = async (files: File[]): Promise<UploadedFile[]> => {
  const form = new FormData()
  files.forEach((file) => form.append('files', file))
  const data = await apiUpload<{ files?: UploadedFile[] }>('/files', form)
  return data.files ?? []
}
