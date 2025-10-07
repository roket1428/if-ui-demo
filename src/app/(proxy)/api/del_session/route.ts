import { clearAuthState } from "@/lib/auth/utils";
import { externalAPI } from "@/lib/fetcher";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
	const userGenerated = request.headers.get("if-ug");
	if (userGenerated) {
		const externalResponse = await fetch(externalAPI("auth/del_session"), {
			method: "POST",
			headers: {
				"Content-Type": request.headers.get("Content-Type") || "application/json",
				"if-sig": request.headers.get("if-sig") || "",
				"if-subkey": request.headers.get("if-subkey") || "",
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
			clearAuthState(response);
		}

		return response;
	} else {
		const response = new NextResponse(null, { status: 200 });
		clearAuthState(response);
		return response;
	}
}
