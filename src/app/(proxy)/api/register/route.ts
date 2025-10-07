import { createAuthState } from "@/lib/auth/utils";
import { externalAPI } from "@/lib/fetcher";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
	console.log("Received registration request");
	console.log("Request headers:", request.headers);
	console.log("Request body:", await request.clone().text());

	const externalResponse = await fetch(externalAPI("auth/register"), {
		method: "POST",
		headers: {
			"Content-Type": request.headers.get("Content-Type") || "application/json",
		},
		body: request.body,
		// @ts-expect-error nodejs fetch requires duplex half for streaming body
		duplex: "half",
	});
	console.log("External response status:", externalResponse.status);
	console.log("External response headers:", externalResponse.headers);
	console.log("External response body:", await externalResponse.clone().text());

	const response = new NextResponse(externalResponse.body, {
		status: externalResponse.status,
		headers: externalResponse.headers,
	});

	if (externalResponse.ok) {
		console.log("Registration successful, creating auth state...");
		await createAuthState(response);
	}

	return response;
}
