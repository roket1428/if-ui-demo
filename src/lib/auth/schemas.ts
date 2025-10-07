import { z } from "zod";
import { MIN_HUMAN_NAME_LEN, MAX_HUMAN_NAME_LEN, MAX_EMAIL_LEN, SEED_LEN } from "./consts";

export const RegisterRequestSchema = z.object({
	name: z
		.string()
		.nonempty("Name field is required")
		.min(MIN_HUMAN_NAME_LEN, `Name must be at least ${MIN_HUMAN_NAME_LEN} characters long`)
		.max(MAX_HUMAN_NAME_LEN, `Name can be at most ${MAX_HUMAN_NAME_LEN} characters long`),
	email: z
		.email("Email field is required")
		.max(MAX_EMAIL_LEN, `Email can be at most ${MAX_EMAIL_LEN} characters long`),
	passphrase: z.string().nonempty("Passphrase field is required"),
});

export const RegisterResponseSchema = z.object({
	Ok: z.object({ id: z.number() }),
});

export const LoginRequestSchema = z.object({
	email: z
		.email("Email field is required")
		.max(MAX_EMAIL_LEN, `Email can be at most ${MAX_EMAIL_LEN} characters long`),
	passphrase: z.string().nonempty("Passphrase field is required"),
	remember_me: z.boolean(),
});

export const LoginResponseSchema = z.object({
	Ok: z.object({ id: z.number() }),
});

export const SeedRequestSchema = z.object({
	mail: z
		.email("Email field is required")
		.max(MAX_EMAIL_LEN, `Email can be at most ${MAX_EMAIL_LEN} characters long`),
});

export const SeedResponseSchema = z.object({
	Ok: z.object({
		seed: z.array(z.number().min(0).max(255)).length(SEED_LEN),
	}),
});

export type RegisterRequest = z.infer<typeof RegisterRequestSchema>;
export type RegisterResponse = z.infer<typeof RegisterResponseSchema>;
export type LoginRequest = z.infer<typeof LoginRequestSchema>;
export type LoginResponse = z.infer<typeof LoginResponseSchema>;
export type SeedRequest = z.infer<typeof SeedRequestSchema>;
export type SeedResponse = z.infer<typeof SeedResponseSchema>;
