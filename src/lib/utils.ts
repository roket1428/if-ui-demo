import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Base64 } from "js-base64";
import { bytesToHex as b2h, hexToBytes as h2b } from "@noble/hashes/utils.js";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function base64ToBytes(str: string) {
	return Base64.toUint8Array(str);
}

export function bytesToBase64(bytes: Uint8Array) {
	return Base64.fromUint8Array(bytes, true);
}

export function bytesToHex(bytes: Uint8Array) {
	return b2h(bytes);
}

export function hexToBytes(hex: string) {
	return h2b(hex);
}

export function bytesToArray(bytes: Uint8Array) {
	return Array.from(bytes);
}

export function arrayToBytes(array: number[]) {
	return new Uint8Array(array);
}

/**
 * https://nodejs.org/api/crypto.html#using-strings-as-inputs-to-cryptographic-apis
 * @param str
 * @returns
 */
export function normalizeString(str: string) {
	return str.normalize("NFC").trim();
}
