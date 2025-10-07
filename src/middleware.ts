import { NextRequest, NextResponse } from "next/server";
import { getAuthStateMW, isAuthRoute, isProtectedRoute, isPublicRoute } from "@/lib/middleware/utils";

export default async function middleware(request: NextRequest) {
	console.log("middleware running for:", request.nextUrl.pathname);
	if (isPublicRoute(request.nextUrl.pathname)) {
		return NextResponse.next();
	}

	const auth = getAuthStateMW(request);
	if (isAuthRoute(request.nextUrl.pathname) && auth) {
		// if user is authenticated, prevent access to auth routes
		return NextResponse.redirect(new URL("/", request.nextUrl));
	}

	if (isProtectedRoute(request.nextUrl.pathname) && !auth) {
		// if user is not authenticated, prevent access to protected routes
		return NextResponse.redirect(new URL("/login", request.nextUrl));
	}

	return NextResponse.next();
}

// routes middleware should not run on (default)
export const config = {
	matcher: ["/((?!api|_next/static|_next/image|.*\\.png$|.*\\.svg$|.*\\.json$|.*\\.ico$|.*\\.wasm$).*)"],
};
