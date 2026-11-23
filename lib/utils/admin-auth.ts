// ============================================================================
// Minimal session helper for the demo admin panel. Not meant to model a
// production auth system — just enough to gate /admin/dashboard behind a
// password, matching the brief's "password protected" requirement.
// ============================================================================

export const ADMIN_SESSION_COOKIE = "carproof_admin_session";

export function getAdminPassword(): string {
  return process.env.ADMIN_PASSWORD || "charx2026";
}

export function isValidAdminPassword(candidate: string): boolean {
  return candidate === getAdminPassword();
}
