// Admin email constant and helper functions

export const ADMIN_EMAIL = "zaprint.official@gmail.com"

export function isAdminEmail(email: string | undefined | null): boolean {
  if (!email) return false
  return email.toLowerCase() === ADMIN_EMAIL.toLowerCase()
}
