import {
	ARGON2_ITERATIONS,
	ARGON2_MEMORY_COST,
	ARGON2_PARALLELISM,
	ED25519_KEY_LEN,
	SEED_LEN,
} from "@/lib/auth/consts";
import { base64ToBytes, bytesToBase64, normalizeString } from "@/lib/utils";
import { getItem, removeItem, setItem } from "@/lib/storage";
import { getPublicKeyAsync, keygenAsync, signAsync } from "@noble/ed25519";

// WASM load wrappper
async function loadArgonWasm() {
	if (process.env.NODE_ENV === "test") {
		const { nodeLoadWasm } = await import("@/lib/wasm/node-wasm");
		return nodeLoadWasm();
	} else {
		const { webLoadWasm } = await import("@/lib/wasm/web-wasm");
		return webLoadWasm();
	}
}

/**
 * Generates main key pair, sub key pair and seed (if not provided)
 * @param passphrase
 * @param customSeed 64 byte CSPRNG, optional
 * @returns seed 64, mainSecretKey 32, mainPublicKey 32, subSecretKey 32, subPublicKey 32
 */
export async function generateKeyPairs(passphrase: string, customSeed?: Uint8Array) {
	const { mainSecretKey, mainPublicKey, seed } = await generateMainKeyPair(
		passphrase,
		customSeed
	);
	const { subSecretKey, subPublicKey } = await generateSubKeyPair();
	return { seed, mainSecretKey, mainPublicKey, subSecretKey, subPublicKey };
}

async function generateMainKeyPair(passphrase: string, customSeed?: Uint8Array) {
	const passphraseBytes = new TextEncoder().encode(normalizeString(passphrase));
	const seed = customSeed ? customSeed : generateSeed();
	const argon2id = await loadArgonWasm();
	const salt = argon2id({
		password: passphraseBytes,
		salt: seed,
		parallelism: ARGON2_PARALLELISM,
		memorySize: ARGON2_MEMORY_COST,
		passes: ARGON2_ITERATIONS,
		tagLength: ED25519_KEY_LEN,
	});

	const mainSecretKey = argon2id({
		password: passphraseBytes,
		salt: salt,
		parallelism: ARGON2_PARALLELISM,
		memorySize: ARGON2_MEMORY_COST,
		passes: ARGON2_ITERATIONS,
		tagLength: ED25519_KEY_LEN,
	});

	passphraseBytes.fill(0);
	salt.fill(0);

	const mainPublicKey = (await getPublicKeyAsync(mainSecretKey)) as Uint8Array;
	return { mainSecretKey, mainPublicKey, seed };
}

async function generateSubKeyPair() {
	const { secretKey, publicKey } = await keygenAsync();
	return {
		subSecretKey: secretKey as Uint8Array,
		subPublicKey: publicKey as Uint8Array,
	};
}

function generateSeed() {
	const seedArray = new Uint8Array(SEED_LEN);
	return crypto.getRandomValues(seedArray);
}

/**
 * Signs given data with stored secret key (subkey) or with provided custom secret key
 * @param data
 * @param customSecretKey (ED25519)
 * @returns base64url signature
 */
export async function signData(data: Uint8Array, customSecretKey?: Uint8Array) {
	const secretKey = customSecretKey ? customSecretKey : retrieveSecretKey();
	const signature = await signAsync(data, secretKey);

	if (!customSecretKey) {
		// zeroing custom keys left to the caller
		secretKey.fill(0);
	}

	return bytesToBase64(signature);
}

// key storage operations
export function saveKeyPair(
	keyPair: { secretKey: Uint8Array; publicKey: Uint8Array },
	expiryInHours: number
) {
	setItem("sk", bytesToBase64(keyPair.secretKey), expiryInHours);
	setItem("pk", bytesToBase64(keyPair.publicKey), expiryInHours);
}

export function retrieveSecretKey() {
	const secretKey = getItem("sk");
	if (!secretKey) {
		throw new Error("secret key not found");
	}
	return base64ToBytes(secretKey);
}

export function retrievePublicKey() {
	const publicKey = getItem("pk");
	if (!publicKey) {
		throw new Error("public key not found");
	}
	return base64ToBytes(publicKey);
}

export function clearKeyPair() {
	removeItem("sk");
	removeItem("pk");
}
