import LogoutWrapper from "@/components/auth/logout-wrapper";
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
        <h1>Profile</h1>
        <p>user data</p>
				<LogoutWrapper />
			</main>
			<footer></footer>
		</>
	);
}