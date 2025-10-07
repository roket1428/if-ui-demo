import LogoutButton from "@/components/auth/logout-button";
import { getAuthState } from "@/lib/auth/utils";
import { cookies } from "next/headers";

export default async function LogoutWrapper() {
	const cookieStore = await cookies();
	const isAuth = getAuthState(cookieStore);

	if (!isAuth) {
		return null;
	}

	return <LogoutButton />;
}
