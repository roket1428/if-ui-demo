import { createAuthState } from "@/lib/auth/utils";
import { externalAPI } from "@/lib/fetcher";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
	const externalResponse = await fetch(externalAPI("auth/new_session"), {
		method: "POST",
		headers: {
			"Content-Type": request.headers.get("Content-Type") || "application/json",
			"if-sig": request.headers.get("if-sig") || "",
			"if-mainkey": request.headers.get("if-mainkey") || "",
		},
		body: request.body,
		// @ts-expect-error nodejs fetch requires duplex half for streaming body
		duplex: "half",
	});

	const response = new NextResponse(externalResponse.body, {
		status: externalResponse.status,
		headers: externalResponse.headers,
	});

	if (externalResponse.ok) {
		await createAuthState(response);
	}

	return response;
}
