import Image from "next/image";
import Link from "next/link";

export default function Home() {
	return (
		<>
			<main className="w-full">
				<section className="w-full bg-background-dimmed">
					<div className="flex items-center py-10 gap-x-12 container mx-auto">
						<div className="flex flex-col py-12 px-8 gap-y-4">
							<h1 className="text-4xl font-bold">
								Empowering the Open Source
								<br />
								Hardware Community
							</h1>
							<p>
								Innovative federated open source platform for sharing and collaborating on Open
								Source Hardware projects. Find and share open source hardware projects, collaborate
								with others and discover new products and services. Import your projects to allow
								access to the community and grow your reputation.
							</p>
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
						</div>
						<Image
							src="globe.svg"
							alt=""
							width={600}
							height={600}
							loading="eager"
							className="mx-auto"
						/>
					</div>
				</section>
				<section className="w-full bg-background">
					<div className="container mx-auto py-10 px-8">
						<h2 className="text-2xl font-bold">Latest Projects</h2>
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mt-6">
							{[...Array(10)].map((_, i) => (
								<div key={i} className="border border-foreground rounded-lg p-4 flex flex-col">
									<div className="h-40 bg-background-dimmed mb-4 flex items-center justify-center">
										<span className="text-foreground-dimmed">project image</span>
									</div>
									<h3 className="text-lg font-semibold mb-2">project title</h3>
									<p className="text-sm text-foreground flex-grow">desc</p>
								</div>
							))}
						</div>
					</div>
				</section>
			</main>
			<footer></footer>
		</>
	);
}
