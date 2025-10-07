import setupWasm from "argon2id/lib/setup";

const ARGON2_WASM_SIMD_PATH = "/wasm/argon2-simd.wasm";
const ARGON2_WASM_NOSIMD_PATH = "/wasm/argon2-no-simd.wasm";

let argon2WasmInstance: Awaited<ReturnType<typeof setupWasm>> | null = null;

export async function webLoadWasm() {
	if (argon2WasmInstance) {
		return argon2WasmInstance;
	}

	argon2WasmInstance = await setupWasm(
		(instanceObject: WebAssembly.Imports) =>
			WebAssembly.instantiateStreaming(fetch(ARGON2_WASM_SIMD_PATH), instanceObject),
		(instanceObject: WebAssembly.Imports) =>
			WebAssembly.instantiateStreaming(fetch(ARGON2_WASM_NOSIMD_PATH), instanceObject)
	);

	return argon2WasmInstance;
}
