import { NextRequest } from "next/server";
import { AUTH_ROUTES, PROTECTED_ROUTES, PUBLIC_ROUTES } from "@/lib/middleware/consts";
import { verifyCookie } from "@/lib/cookies";

/**
 * middleware only
 */
export function getAuthStateMW(request: NextRequest) {
	return request.cookies.has("auth") && verifyCookie(request.cookies.get("auth")!.value);
}

// helpers
export function isProtectedRoute(pathname: string) {
	return PROTECTED_ROUTES.some((route) => pathname.startsWith(route));
}

export function isAuthRoute(pathname: string) {
	return AUTH_ROUTES.some((route) => pathname === route);
}

export function isPublicRoute(pathname: string) {
	return PUBLIC_ROUTES.some((route) => pathname === route);
}
