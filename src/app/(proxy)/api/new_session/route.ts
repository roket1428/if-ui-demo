import { LoginRequestSchemaInternalAPI } from "@/lib/auth/schemas";
import { createAuthState } from "@/lib/auth/utils";
import { externalAPI, filterForwardedHeaders, parseRequest } from "@/lib/fetcher";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
	console.log("Received new_session request");
	console.log("Request headers:", request.headers);
	console.log("Request body:", await request.clone().text());

	const remember_me = (await parseRequest(request.clone(), LoginRequestSchemaInternalAPI))
		.remember_me;
	const forwardedHeaders = filterForwardedHeaders(request.headers);
	console.log("Forwarding headers:", forwardedHeaders);

	const externalResponse = await fetch(externalAPI("auth/new_session"), {
		method: "POST",
		headers: forwardedHeaders,
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
		await createAuthState(response, remember_me ? 24 * 30 : 1);
	}

	return response;
}
