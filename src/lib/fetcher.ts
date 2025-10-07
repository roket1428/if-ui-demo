import { retrievePublicKey, signData } from "@/lib/auth/crypto";
import { bytesToBase64 } from "@/lib/utils";
import { z } from "zod";

// TODO: write tests
type CommunicationMedium = "json" | "binary";

export async function sendRequest(
	endpoint: string,
	body: object,
	responseSchema: null,
	useInternalAPI?: boolean,
	communicationMedium?: CommunicationMedium
): Promise<void>;

export async function sendRequest<T>(
	endpoint: string,
	body: object,
	responseSchema: z.ZodSchema<T>,
	useInternalAPI?: boolean,
	communicationMedium?: CommunicationMedium
): Promise<T>;

export async function sendRequest<T>(
	endpoint: string,
	body: object,
	responseSchema: z.ZodSchema<T> | null,
	useInternalAPI?: boolean,
	customCommunicationMedium?: CommunicationMedium
): Promise<T | void> {
	if (!process.env.NEXT_PUBLIC_COMM_MEDIUM && !customCommunicationMedium) {
		throw new Error("NEXT_PUBLIC_COMM_MEDIUM not set");
	}

	const communicationMedium: CommunicationMedium =
		customCommunicationMedium || (process.env.NEXT_PUBLIC_COMM_MEDIUM as CommunicationMedium);

	if (communicationMedium === "json") {
		if (!responseSchema) {
			return sendJSONRequest(endpoint, body, null, useInternalAPI);
		} else {
			return sendJSONRequest(endpoint, body, responseSchema, useInternalAPI);
		}
	} else if (communicationMedium === "binary") {
		throw new Error("binary communication not implemented");
	} else {
		throw new Error("invalid comm medium: " + communicationMedium);
	}
}

export async function sendSignedRequest(
	endpoint: string,
	body: object,
	responseSchema: null,
	useInternalAPI?: boolean,
	customHeader?: { [key: string]: string },
	extendHeader?: boolean,
	customSecretKey?: Uint8Array,
	communicationMedium?: CommunicationMedium
): Promise<void>;

export async function sendSignedRequest<T>(
	endpoint: string,
	body: object,
	responseSchema: z.ZodSchema<T>,
	useInternalAPI?: boolean,
	customHeader?: { [key: string]: string },
	extendHeader?: boolean,
	customSecretKey?: Uint8Array,
	communicationMedium?: CommunicationMedium
): Promise<T>;

export async function sendSignedRequest<T>(
	endpoint: string,
	body: object,
	responseSchema: z.ZodSchema<T> | null,
	useInternalAPI?: boolean,
	customHeader?: { [key: string]: string },
	extendHeader?: boolean,
	customSecretKey?: Uint8Array,
	customCommunicationMedium?: CommunicationMedium
): Promise<T | void> {
	if (!process.env.NEXT_PUBLIC_COMM_MEDIUM && !customCommunicationMedium) {
		throw new Error("NEXT_PUBLIC_COMM_MEDIUM not set");
	}

	const communicationMedium: CommunicationMedium =
		customCommunicationMedium || (process.env.NEXT_PUBLIC_COMM_MEDIUM as CommunicationMedium);

	if (communicationMedium === "json") {
		if (!responseSchema) {
			return sendSignedJSONRequest(
				endpoint,
				body,
				null,
				useInternalAPI,
				customHeader,
				extendHeader,
				customSecretKey
			);
		} else {
			return sendSignedJSONRequest(
				endpoint,
				body,
				responseSchema,
				useInternalAPI,
				customHeader,
				extendHeader,
				customSecretKey
			);
		}
	} else if (communicationMedium === "binary") {
		throw new Error("binary communication not implemented");
	} else {
		throw new Error("invalid comm medium: " + communicationMedium);
	}
}

// json request abstractions

async function sendJSONRequest<T>(
	endpoint: string,
	body: object,
	responseSchema: z.ZodSchema<T>,
	useInternalAPI?: boolean
): Promise<T>;

async function sendJSONRequest(
	endpoint: string,
	body: object,
	responseSchema: null,
	useInternalAPI?: boolean
): Promise<void>;

async function sendJSONRequest<T>(
	endpoint: string,
	body: object,
	responseSchema: z.ZodSchema<T> | null,
	useInternalAPI?: boolean
): Promise<T | void> {
	const url = useInternalAPI ? internalAPI(endpoint) : externalAPI(endpoint);
	const response = await fetch(url, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(body),
	});

	validateJSONResponse(response);

	if (responseSchema) {
		const responseText = await response.clone().text();
		const responseData = await response.json();
		console.log("Response text:", responseText);
		console.log("Response json:", responseData);
		return responseSchema.parse(responseData);
	}
}

async function sendSignedJSONRequest(
	endpoint: string,
	body: object,
	responseSchema: null,
	useInternalAPI?: boolean,
	customHeader?: { [key: string]: string },
	extendHeader?: boolean,
	customSecretKey?: Uint8Array
): Promise<void>;

async function sendSignedJSONRequest<T>(
	endpoint: string,
	body: object,
	responseSchema: z.ZodSchema<T>,
	useInternalAPI?: boolean,
	customHeader?: { [key: string]: string },
	extendHeader?: boolean,
	customSecretKey?: Uint8Array
): Promise<T>;

async function sendSignedJSONRequest<T>(
	endpoint: string,
	body: object,
	responseSchema: z.ZodSchema<T> | null,
	useInternalAPI?: boolean,
	customHeader?: { [key: string]: string },
	extendHeader?: boolean,
	customSecretKey?: Uint8Array
): Promise<T | void> {
	const bodyJSON = JSON.stringify(body);
	const bodySignature = customSecretKey
		? await signData(new TextEncoder().encode(bodyJSON), customSecretKey)
		: await signData(new TextEncoder().encode(bodyJSON)); // default to sub secret key

	const dynamicHeaders = customHeader
		? extendHeader
			? { ...getSubPublicKeyHeader(), ...customHeader }
			: customHeader
		: getSubPublicKeyHeader();

	const url = useInternalAPI ? internalAPI(endpoint) : externalAPI(endpoint);
	const response = await fetch(url, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			"if-sig": bodySignature,
			...dynamicHeaders,
		},
		body: bodyJSON,
	});

	validateSignedJSONResponse(response);

	if (responseSchema) {
		const responseText = await response.clone().text();
		const responseData = await response.json();
		console.log("Response text:", responseText);
		console.log("Response json:", responseData);
		return responseSchema.parse(responseData);
	}
}

// TODO: implement binary request abstractions
// async function sendBinaryRequest() {}
// async function sendSignedBinaryRequest() {}

//response validation
function validateJSONResponse(response: Response) {
	checkResponseRange(response);
	checkContentType(response);
}

function validateSignedJSONResponse(response: Response) {
	checkSignedResponseRange(response);
	checkContentType(response);
}

function checkContentType(msg: Request | Response) {
	const contentType = msg.headers.get("Content-Type");
	if (
		!contentType ||
		(!contentType.includes("application/json") &&
			!contentType.includes("application/octet-stream"))
	) {
		throw new TypeError("Unexpected content type: " + contentType);
	}
}

function checkResponseRange(response: Response) {
	if (!response.ok) {
		throw new Error("Response status: " + response.status);
	}
}

function checkSignedResponseRange(response: Response) {
	if (!response.ok) {
		// TODO: handle 4xx by triggering log out and client side cleanup
		// if (response.status >= 400 && response.status <= 499) { }
		throw new Error("Response status: " + response.status);
	}
}

// helpers
export function externalAPI(endpoint: string) {
	return `${process.env.NEXT_PUBLIC_API_URL}/api/${endpoint}`;
}

export function internalAPI(endpoint: string) {
	return `/api/${endpoint}`;
}

function getSubPublicKeyHeader() {
	return { "if-subkey": bytesToBase64(retrievePublicKey()) };
}
