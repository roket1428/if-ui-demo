import { generateAuthCookie, verifyCookie } from "@/lib/cookies";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

/**
 * server-side only
 */
export function getAuthState(cookieStore: Awaited<ReturnType<typeof cookies>>) {
	return cookieStore.has("auth") && verifyCookie(cookieStore.get("auth")!.value);
}

/**
 * server-side only
 */
export async function createAuthState(response: NextResponse) {
	const cookieValue = await generateAuthCookie();
	response.cookies.set("auth", cookieValue, {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
	});
}

/**
 * server-side only
 */
export function clearAuthState(response: NextResponse) {
	response.cookies.delete("auth");
}
