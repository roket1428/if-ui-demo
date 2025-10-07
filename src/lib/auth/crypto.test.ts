// @vitest-environment node
import { describe, expect, test } from "vitest";
import { hexToBytes, bytesToHex } from "@/lib/utils";
import { SEED_LEN, ED25519_KEY_LEN } from "@/lib/auth/consts";
import { generateKeyPairs } from "@/lib/auth/crypto";

// custom test vector created with nodejs argon2 api
const testVector = {
	passphrase: "testpassphrase",
	seed: "fa04540f82c9e2bde1506f479b1bab313d8cb2a2befc183312aac92e4a208952adc4778551cd42fb8b587147a9f9baccf86fe98c378b94deec154f27197009e7",
	secretKey: "eda99c918d2555c45060b531f3c91e9a3a49f4a0ef62a010de4cdb95a0636222",
};

describe("generateKeyPairs", () => {
	test("check output", async () => {
		const { seed, mainSecretKey, mainPublicKey, subSecretKey, subPublicKey } =
			await generateKeyPairs(testVector.passphrase);

		expect(seed).toBeInstanceOf(Uint8Array);
		expect(mainSecretKey).toBeInstanceOf(Uint8Array);
		expect(mainPublicKey).toBeInstanceOf(Uint8Array);
		expect(subSecretKey).toBeInstanceOf(Uint8Array);
		expect(subPublicKey).toBeInstanceOf(Uint8Array);
		expect(seed).toHaveLength(SEED_LEN);
		expect(mainSecretKey).toHaveLength(ED25519_KEY_LEN);
		expect(mainPublicKey).toHaveLength(ED25519_KEY_LEN);
		expect(subSecretKey).toHaveLength(ED25519_KEY_LEN);
		expect(subPublicKey).toHaveLength(ED25519_KEY_LEN);
	});

	test("check main key rederive", async () => {
		const { seed, mainSecretKey, mainPublicKey } = await generateKeyPairs(
			testVector.passphrase
		);

		const { mainSecretKey: msk, mainPublicKey: mpk } = await generateKeyPairs(
			testVector.passphrase,
			seed
		);

		expect(msk).toEqual(mainSecretKey);
		expect(mpk).toEqual(mainPublicKey);
	});

	test("compare main sk with test vector", async () => {
		const { mainSecretKey } = await generateKeyPairs(
			testVector.passphrase,
			hexToBytes(testVector.seed)
		);

		expect(bytesToHex(mainSecretKey)).toBe(testVector.secretKey);
	});
});
