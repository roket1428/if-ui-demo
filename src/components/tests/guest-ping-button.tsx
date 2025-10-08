"use client";

import { sendRequest } from "@/lib/fetcher";
import { PingResponseSchema } from "@/lib/auth/schemas";

export default function GuestPingButton() {
	const handleOnClick = async () => {
		sendRequest("echo/guest", { ping: "hello guest" }, PingResponseSchema)
			.then((response) => {
				console.log("ping response:", response);
			})
			.catch((error) => {
				console.error("ping failed:", error);
			});
	};

	return (
		<button
			className="rounded-md px-3 py-2 bg-foreground text-background text-nowrap w-min"
			onClick={handleOnClick}
		>
			Ping (guest)
		</button>
	);
}
