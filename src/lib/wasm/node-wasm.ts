import setupWasm from "argon2id/lib/setup";
import { readFileSync } from "node:fs";

const ARGON2_WASM_SIMD_PATH = "public/wasm/argon2-simd.wasm";
const ARGON2_WASM_NOSIMD_PATH = "public/wasm/argon2-no-simd.wasm";

export async function nodeLoadWasm() {
	return setupWasm(
		(importObject) =>
			WebAssembly.instantiate(readFileSync(ARGON2_WASM_SIMD_PATH), importObject),
		(importObject) =>
			WebAssembly.instantiate(readFileSync(ARGON2_WASM_NOSIMD_PATH), importObject)
	);
}
