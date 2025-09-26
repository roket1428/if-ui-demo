import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
	title: "Interfacer Next",
	description: "interfacer next demo ui",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body className="w-full min-h-screen">{children}</body>
		</html>
	);
}
