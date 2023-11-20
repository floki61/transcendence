import axios from "axios";
import type { NextApiRequest } from "next";
import { cookies } from 'next/headers'
import { NextResponse } from "next/server";

export async function POST(req: NextApiRequest, res: NextResponse) {
	let passedValue = await new Response(req.body).text();
	console.log(JSON.parse(passedValue).token);
	const cookieStore = cookies()
	cookieStore.delete("2fa");
	cookieStore.delete("access_token");
	cookieStore.set("access_token", JSON.parse(passedValue).token);
	return NextResponse.json({});
    // try {

	// 	let code = JSON.parse(passedValue);
	// 	// console.log("============> ", valueToJson);
	// 	// console.log("============> ", token);
	// 	const response = await axios.post(
	// 	  "http://localhost:4000/2fa/authenticate",
	// 		{ twoFactorAuthenticationCode: code }, {
	// 			headers: {
	// 			  "Content-Type": "application/json",
	// 			  Cookie: `access_token=${token}`,
	// 			},
	// 	  });
	// 	//   console.log(response.data);
	//   } catch (error) {
	// 	console.error("Login failed", error);
	//   }
}
