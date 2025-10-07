"use client";

import { Button } from "@/components/ui/button";
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

	return <Button onClick={handleLogout}>Log out</Button>;
}
