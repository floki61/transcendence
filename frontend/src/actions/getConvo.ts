import axios from "axios";
import { FriendType } from "@/app/(protected)/chat/layout";
import { useState } from "react";

const Convo = async () => {

	const [friends, SetFriends] = useState<FriendType[] | null>(null);


	try {
		const res = await axios.get("http://localhost:4000/chat/myRooms", {
			withCredentials: true
		});
		const data = res.data;
		console.log("data ", data)
		if (data.length > 0) {
			const updatedFriends = data.map((item: any) => item);
	  
			SetFriends(updatedFriends);
		}
	} catch (error) {
		console.log("fetching conversation failed");
	}
}