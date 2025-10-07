import Image from "next/image";
import Link from "next/link";

export default function AuthLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<>
			<header>
				<nav className="flex items-center justify-between w-full p-4 gap-x-3">
					<Link href={"/"} className="text-2xl font-bold">
						Interfacer
					</Link>
					<div>
						<Link
							href={"/login"}
							className="inline-block rounded-md px-3 py-2 bg-green-600 text-foreground"
						>
							Login
						</Link>{" "}
						<Link
							href={"/register"}
							className="inline-block rounded-md px-3 py-2 bg-foreground text-background"
						>
							Register
						</Link>
					</div>
				</nav>
			</header>
			<main className="w-full grid grid-cols-1 md:grid-cols-2 min-h-[calc(100vh-72px)]">
				<Image src="globe.svg" alt="" width={600} height={600} loading="eager" className="mx-auto my-auto p-4" />
				<section className="bg-background-dimmed">{children}</section>
			</main>
			<footer></footer>
		</>
	);
}
