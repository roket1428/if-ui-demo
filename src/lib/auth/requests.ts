import { sendSignedRequest, sendRequest } from "@/lib/fetcher";
import { bytesToArray, bytesToBase64, normalizeString } from "@/lib/utils";
import {
	LoginResponseSchema,
	RegisterResponseSchema,
	SeedResponseSchema,
} from "@/lib/auth/schemas";

export async function sendRegisterRequest(
	name: string,
	email: string,
	seed: Uint8Array,
	mainPublicKey: Uint8Array,
	subPublicKey: Uint8Array
) {
	console.log("sendRegisterRequest", {
		name: normalizeString(name),
		mail: normalizeString(email),
		seed: bytesToArray(seed),
		mainPublicKey: bytesToArray(mainPublicKey),
		subPublicKey: bytesToArray(subPublicKey),
	});
	return sendRequest(
		"register",
		{
			name: normalizeString(name),
			mail: normalizeString(email),
			seed: bytesToArray(seed),
			main_pubkey: bytesToArray(mainPublicKey),
			sub_pubkey: bytesToArray(subPublicKey),
		},
		RegisterResponseSchema,
		true
	);
}

export async function sendSeedRequest(email: string) {
	const response = await sendRequest("auth/ask_seed", { mail: email }, SeedResponseSchema);
	return new Uint8Array(response.Ok.seed);
}

export async function sendNewSessionRequest(
	remember_me: boolean,
	subPublicKey: Uint8Array,
	mainSecretKey: Uint8Array,
	mainPublicKey: Uint8Array
) {
	return sendSignedRequest(
		"new_session",
		{
			sub_pubkey: bytesToArray(subPublicKey),
			remember_me: remember_me,
		},
		LoginResponseSchema,
		true,
		{ "if-mainkey": bytesToBase64(mainPublicKey) },
		false,
		mainSecretKey
	);
}

export async function sendLogoutRequest(subPublicKey: Uint8Array, userGenerated: boolean) {
	return sendSignedRequest(
		"del_session",
		{
			sub_pubkey: bytesToArray(subPublicKey),
		},
		null,
		true,
		userGenerated ? { "if-ug": "true" } : undefined,
		userGenerated
	);
}
