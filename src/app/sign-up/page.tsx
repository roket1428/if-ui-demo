import Image from "next/image";
import Link from "next/link";

export default function SignUp() {
	return (
		<>
			<header>
				<nav className="flex items-center w-full p-4 gap-x-3">
					<Link href={"/"} className="text-2xl font-bold">
						Interfacer
					</Link>
					<div className="grow"></div>
					<Link
						href={"/login"}
						className="inline-block rounded-md px-3 py-2 bg-green-600 text-foreground"
					>
						Login
					</Link>{" "}
					<Link
						href={"/sign-up"}
						className="inline-block rounded-md px-3 py-2 bg-foreground text-background"
					>
						Register
					</Link>
				</nav>
			</header>
			<main className="w-full grid grid-cols-1 md:grid-cols-2 min-h-[calc(100vh-72px)]">
				<Image src="next.svg" alt="" width={600} height={600} className="mx-auto my-auto p-4" />
				<section className="bg-background-dimmed">Sign Up</section>
			</main>
			<footer></footer>
		</>
	);
}
