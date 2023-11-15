"use client"

import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { userType } from "@/context/userContext";

export interface ProfileType {
	user: userType;
	level_P: number;
	barPourcentage: number;
}

export const useFriend = (id: string) => {
	const [friend, SetFriend] = useState<ProfileType>();

	useEffect(() => {
		const getFriend = async () => {
			try {
				const res = await axios.post("http://localhost:4000/getFriendProfile", {id},{
					withCredentials: true,
				})
				console.log("success", res.data);
				SetFriend(res.data);
			} catch (error) {
				console.log("get Friend profile failed.", error);
			}
		}
		getFriend();
	}, []);
	
	return {friend, SetFriend}
}
