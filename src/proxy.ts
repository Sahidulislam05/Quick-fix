import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { ROLE_HOME } from "@/constants/navigation";
import type { Role } from "@/types/user";

const TOKEN_COOKIE = "quickfix_token";
const ROLE_COOKIE = "quickfix_role";
const AUTH_ROUTES = ["/auth/login", "/auth/register"];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(TOKEN_COOKIE)?.value;
  const role = request.cookies.get(ROLE_COOKIE)?.value as Role | undefined;

  const isAuthRoute = AUTH_ROUTES.some((route) => pathname.startsWith(route));
  const isDashboardRoute = pathname.startsWith("/dashboard");

  if (isDashboardRoute && !token) {
    const loginUrl = new URL("/auth/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isAuthRoute && token) {
    const home = (role && ROLE_HOME[role]) || "/";
    return NextResponse.redirect(new URL(home, request.url));
  }

  if (isDashboardRoute && token && role) {
    const ownHome = ROLE_HOME[role];
    if (ownHome && !pathname.startsWith(ownHome)) {
      return NextResponse.redirect(new URL(ownHome, request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/auth/:path*"],
};
