import { clearAuthState } from "@/lib/auth/utils";
import { externalAPI } from "@/lib/fetcher";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
	console.log("Received del_session request");
	console.log("Request headers:", request.headers);
	console.log("Request body:", await request.clone().text());

	const userGenerated = request.headers.get("if-ug");
	if (userGenerated) {
		const forwardHeaders = {
			"Content-Type": request.headers.get("Content-Type") || "application/json",
			"if-sig": request.headers.get("if-sig") || "",
			"if-subkey": request.headers.get("if-subkey") || "",
		};
		console.log("Forwarding headers:", forwardHeaders);

		const externalResponse = await fetch(externalAPI("auth/del_session"), {
			method: "POST",
			headers: forwardHeaders,
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
			clearAuthState(response);
		}

		return response;
	} else {
		const response = new NextResponse(null, { status: 200 });
		clearAuthState(response);
		return response;
	}
}
