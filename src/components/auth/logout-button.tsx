"use client";

import { sendLogoutRequest } from "@/lib/auth/requests";
import { clearKeyPair, retrievePublicKey } from "@/lib/auth/crypto";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
	const router = useRouter();

	const handleLogout = async () => {
		sendLogoutRequest(retrievePublicKey(), true)
			.then(() => {
				clearKeyPair();
				router.replace("/login");
			})
			.catch((error) => {
				console.error("logout failed:", error);
			});
	};

	return (
		<button
			className="rounded-md px-3 py-2 bg-foreground text-background text-nowrap w-min"
			onClick={handleLogout}
		>
			Log out
		</button>
	);
}
