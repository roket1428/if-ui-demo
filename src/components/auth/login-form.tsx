"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { LoginRequestSchema, LoginRequest } from "@/lib/auth/schemas";
import { generateKeyPairs, saveKeyPair } from "@/lib/auth/crypto";
import { sendSeedRequest, sendNewSessionRequest } from "@/lib/auth/requests";

import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

export default function LoginForm() {
	const form = useForm<LoginRequest>({
		resolver: zodResolver(LoginRequestSchema),
		defaultValues: {
			email: "john@example.com",
			passphrase: "testpassphrase",
			remember_me: false,
		},
	});

	function onSubmit(values: LoginRequest) {
		console.log(values);
		sendSeedRequest(values.email)
			.then((seed) => {
				generateKeyPairs(values.passphrase, seed)
					.then(({ seed, mainSecretKey, mainPublicKey, subSecretKey, subPublicKey }) => {
						sendNewSessionRequest(values.remember_me, subPublicKey, mainSecretKey, mainPublicKey)
							.then(() => {
								saveKeyPair(
									{ secretKey: subSecretKey, publicKey: subPublicKey },
									values.remember_me ? 24 * 30 : 1
								);

								// zeroing
								seed.fill(0);
								mainSecretKey.fill(0);
								mainPublicKey.fill(0);
								subSecretKey.fill(0);
								subPublicKey.fill(0);
							})
							.catch((error) => {
								console.error("login failed:", error);
							});
					})
					.catch((error) => {
						console.error("key generation failed:", error);
					});
			})
			.catch((error) => {
				console.error("seed request failed:", error);
			});
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 p-8">
				<FormField
					control={form.control}
					name="email"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Email</FormLabel>
							<FormControl>
								<Input
									type="email"
									placeholder="john@example.com"
									{...field}
									autoComplete="email"
								/>
							</FormControl>
							<FormDescription>desc placeholder</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="passphrase"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Passphrase</FormLabel>
							<FormControl>
								<Input type="password" {...field} autoComplete="current-password" />
							</FormControl>
							<FormDescription>desc placeholder</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="remember_me"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Remember Me</FormLabel>
							<FormControl>
								<Checkbox
									name="remember_me"
									checked={field.value}
									onCheckedChange={field.onChange}
								/>
							</FormControl>
							<FormDescription>desc placeholder</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>
				<Button type="submit">Login</Button>
			</form>
		</Form>
	);
}
