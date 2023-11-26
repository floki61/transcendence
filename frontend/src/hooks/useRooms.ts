import { useState, useEffect } from 'react';
import axios from 'axios';

export interface FriendType {
	id: string;
	is_DM: boolean;
	lastMessage: string;
	lastMessageDate: string;
	name: string;
	picture: string;
	visibility: string;
	participants: {
		uid: string;
		role: string;
	}[];
}

export const useRooms = () => {
	const [chatbar, setChatbar] = useState(false);

		const getUsers = async (friends: FriendType[], setFriends: any) => {
			try {
				const res = await axios.get("http://10.12.1.6:4000/chat/myRooms", {
					withCredentials: true
				});
				const data = res.data;
				if (data.length > 0) {
					setFriends(data);
					setChatbar(true);
				}
			} catch (error) {
			}
		}

		const getRooms = async (friends: FriendType[], setFriends: any) => {
			try {
				const res = await axios.get("http://10.12.1.6:4000/chat/getAllRooms", {
					withCredentials: true,
				})
				const data = res.data;
				if (data && data.length > 0) {
					setFriends((prev: any) => {
						const uniqueRooms = data.filter((room: any) => !prev.some((prevRoom: any) => prevRoom.id === room.id));
						return [...prev, ...uniqueRooms]
					});
					setChatbar(true);
				}
			} catch (error) {
			}
		}

	return { chatbar, getUsers, getRooms }
}
