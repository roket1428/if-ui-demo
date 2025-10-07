"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { RegisterRequestSchema, RegisterRequest } from "@/lib/auth/schemas";
import { generateKeyPairs, saveKeyPair } from "@/lib/auth/crypto";
import { sendRegisterRequest } from "@/lib/auth/requests";

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

export default function RegisterForm() {
	const router = useRouter();
	const form = useForm<RegisterRequest>({
		resolver: zodResolver(RegisterRequestSchema),
		defaultValues: {
			name: "john",
			email: "john@example.com",
			passphrase: "testpassphrase",
		},
	});

	function onSubmit(values: RegisterRequest) {
		console.log(values);
		generateKeyPairs(values.passphrase)
			.then(({ seed, mainSecretKey, mainPublicKey, subSecretKey, subPublicKey }) => {
				sendRegisterRequest(values.name, values.email, seed, mainPublicKey, subPublicKey)
					.then(() => {
						saveKeyPair({ secretKey: subSecretKey, publicKey: subPublicKey }, 1);
						console.log("registration successful");
						router.replace("/profile");
					})
					.catch((error) => {
						console.error("registration failed:", error);
					})
					.finally(() => {
						seed.fill(0);
						mainSecretKey.fill(0);
						mainPublicKey.fill(0);
						subSecretKey.fill(0);
						subPublicKey.fill(0);
					});
			})
			.catch((error) => {
				console.error("key generation failed:", error);
			});
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 p-8">
				<FormField
					control={form.control}
					name="name"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Name</FormLabel>
							<FormControl>
								<Input type="text" placeholder="john" {...field} autoComplete="name" />
							</FormControl>
							<FormDescription>desc placeholder</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>
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
								<Input type="password" {...field} autoComplete="new-password" />
							</FormControl>
							<FormDescription>desc placeholder</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>
				<Button type="submit">Register</Button>
			</form>
		</Form>
	);
}
