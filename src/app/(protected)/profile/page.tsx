import LogoutWrapper from "@/components/auth/logout-wrapper";
import AuthedPingButton from "@/components/tests/authed-ping-button";
import GuestPingButton from "@/components/tests/guest-ping-button";
import MainAuthedPingButton from "@/components/tests/main-authed-ping-button";
import Link from "next/link";

export default function Profile() {
	return (
		<>
			<header>
				<nav className="flex items-center w-full p-4 gap-x-3">
					<Link href={"/"} className="text-2xl font-bold">
						Interfacer
					</Link>
				</nav>
			</header>
			<main className="w-full min-h-[calc(100vh-72px)]">
				<div className="flex flex-col px-4">
					<h1 className="text-xl font-bold">Profile</h1>
					<div className="flex flex-col gap-y-6">
						<div className="flex flex-col gap-y-3">
							<GuestPingButton />
							<AuthedPingButton />
							<hr />
							<MainAuthedPingButton />
						</div>
						<hr />
						<LogoutWrapper />
					</div>
				</div>
			</main>
			<footer></footer>
		</>
	);
}
