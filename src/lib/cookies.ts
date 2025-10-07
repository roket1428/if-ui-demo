import { bytesToBase64 } from "@/lib/utils";
import { hmac } from "@noble/hashes/hmac.js";
import { sha256 } from "@noble/hashes/sha2.js";

/**
 * server-side only
 */
export async function generateAuthCookie() {
	const cookie = new Uint8Array(32);
	crypto.getRandomValues(cookie);
	const cookieStr = bytesToBase64(cookie);
	return `${cookieStr}.${signCookie(cookieStr)}`;
}

/**
 * server-side only
 */
export function verifyCookie(cookie: string) {
	const parts = cookie.split(".");
	if (parts.length !== 2) {
		return false;
	}
	const value = parts[0];
	const signature = parts[1];
	const expectedSignature = signCookie(value);

	// TODO: timingSafeEqual not available in outside node
	// maybe implement an alternative in the future
	return signature === expectedSignature;
}

function signCookie(value: string) {
	const serverSecret = process.env.SERVER_SECRET;
	if (!serverSecret) {
		throw new Error("SERVER_SECRET is not defined");
	}

	const encoder = new TextEncoder();
	const signature = hmac(sha256, encoder.encode(serverSecret), encoder.encode(value));
	return bytesToBase64(signature);
}
