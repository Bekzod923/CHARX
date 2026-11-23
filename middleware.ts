import { NextRequest, NextResponse } from "next/server";
import { ADMIN_SESSION_COOKIE } from "@/lib/utils/admin-auth";

export function middleware(request: NextRequest) {
  const hasSession = request.cookies.get(ADMIN_SESSION_COOKIE)?.value === "granted";
  if (!hasSession) {
    const loginUrl = new URL("/admin", request.url);
    return NextResponse.redirect(loginUrl);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/dashboard/:path*"],
};
