import { NextRequest } from "next/server";
import { ADMIN_SESSION_COOKIE } from "./admin-auth";

/** Returns true if the request carries a valid admin session cookie. */
export function hasAdminSession(request: NextRequest): boolean {
  return request.cookies.get(ADMIN_SESSION_COOKIE)?.value === "granted";
}
