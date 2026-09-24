import type { Role } from "@/types/user";

const TOKEN_COOKIE = "quickfix_token";
const ROLE_COOKIE = "quickfix_role";
const COOKIE_MAX_AGE_DAYS = 7;

function readCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

function writeCookie(name: string, value: string) {
  if (typeof document === "undefined") return;
  const maxAge = COOKIE_MAX_AGE_DAYS * 24 * 60 * 60;
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${maxAge}; SameSite=Lax`;
}

function removeCookie(name: string) {
  if (typeof document === "undefined") return;
  document.cookie = `${name}=; path=/; max-age=0`;
}

export function getAccessToken(): string | null {
  return readCookie(TOKEN_COOKIE);
}

export function setAccessToken(token: string) {
  writeCookie(TOKEN_COOKIE, token);
}

export function clearAccessToken() {
  removeCookie(TOKEN_COOKIE);
}

export function getStoredRole(): Role | null {
  return readCookie(ROLE_COOKIE) as Role | null;
}

export function setStoredRole(role: Role) {
  writeCookie(ROLE_COOKIE, role);
}

export function clearStoredRole() {
  removeCookie(ROLE_COOKIE);
}

export function clearSession() {
  clearAccessToken();
  clearStoredRole();
}
