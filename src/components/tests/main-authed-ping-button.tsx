"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { sendSignedRequest } from "@/lib/fetcher";
import { PingResponseSchema } from "@/lib/auth/schemas";
import { sendSeedRequest } from "@/lib/auth/requests";

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { generateKeyPairs } from "@/lib/auth/crypto";
import { bytesToBase64 } from "@/lib/utils";

const MainAuthedPingFormSchema = z.object({
	email: z.email("email is required for fetching the seed"),
	passphrase: z.string().nonempty("Passphrase field is required"),
});

export default function MainAuthedPingButton() {
	const form = useForm<z.infer<typeof MainAuthedPingFormSchema>>({
		resolver: zodResolver(MainAuthedPingFormSchema),
		defaultValues: {
			email: "john@example.com",
			passphrase: "testpassphrase",
		},
	});

	function onSubmit(values: z.infer<typeof MainAuthedPingFormSchema>) {
		sendSeedRequest(values.email)
			.then((seed) => {
				generateKeyPairs(values.passphrase, seed)
					.then(({ seed, mainSecretKey, mainPublicKey, subSecretKey, subPublicKey }) => {
						sendSignedRequest(
							"echo/main_authed",
							{
								ping: "hello main authed",
							},
							PingResponseSchema,
							false,
							{ "if-mainkey": bytesToBase64(mainPublicKey) },
							false,
							mainSecretKey
						)
							.then((response) => {
								console.log("ping response:", response);
							})
							.catch((error) => {
								console.error("ping failed:", error);
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
			})
			.catch((error) => {
				console.error("seed request failed:", error);
			});
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="flex items-end gap-x-4">
				<FormField
					control={form.control}
					name="email"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Email</FormLabel>
							<FormControl>
								<Input type="email" placeholder="for the seed" {...field} autoComplete="email" />
							</FormControl>
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
								<Input
									type="password"
									placeholder="for main key derive"
									{...field}
									autoComplete="current-password"
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<button className="rounded-md px-3 py-2 bg-foreground text-background" type="submit">
					Ping (main authed)
				</button>
			</form>
		</Form>
	);
}
