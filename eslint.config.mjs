import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
	baseDirectory: __dirname,
});

const eslintConfig = [
	...compat.config({
		extends: ["next/core-web-vitals", "next/typescript", "prettier"],
		ignorePatterns: ["node_modules/**", ".next/**", "out/**", "build/**", "next-env.d.ts"],
		rules: {
			curly: ["error", "multi-line"],
		}
	}),
];

export default eslintConfig;
