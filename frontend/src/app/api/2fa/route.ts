import axios from "axios";
// import { NextApiRequest } from "next";
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, res: NextResponse) {
	let passedValue = await new Response(req.body).text();
	console.log(JSON.parse(passedValue).token);
	const cookieStore = cookies();
	cookieStore.delete("2fa");
	cookieStore.delete("access_token");
	cookieStore.set("access_token", JSON.parse(passedValue).token);
	return NextResponse.json({});
}
