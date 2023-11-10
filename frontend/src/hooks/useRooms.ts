import { useState, useEffect } from 'react';
import axios from 'axios';
import { getTime } from '@/components/getTime';

export interface FriendType {
	id: string;
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
	const [friends, SetFriends] = useState<FriendType[] | null>(null);
	const [chatbar, SetChatbar] = useState(false);


	useEffect(() => {
		const getUsers = async () => {
			try {
				const res = await axios.get("http://localhost:4000/chat/myRooms", {
					withCredentials: true
				});
				const data = res.data;
				console.log("data ", data)
				if (data.length > 0) {
					const updatedFriends = data.map((item: any) => item);
			  
					SetFriends(updatedFriends);
					SetChatbar(true);
				}

			} catch (error) {
				console.log("hadchi baqi makhdamch");
			}
			try {
				const res = await axios.get("http://localhost:4000/chat/getAllRooms", {
					withCredentials: true,
				})
				const data = res.data;

				if (data.length > 0) {			  
					SetFriends((prevChat) => [...prevChat!, ...data]);
					SetChatbar(true);
				}
			} catch(error) {
				console.log("getallrooms failed");
			}
		}
		getUsers();
	}, []);
	// console.log({friends});
	if (friends) {
		friends.forEach((friend) => {
				if (!friend.lastMessageDate)
					friend.lastMessageDate = "just created"
				else {
					const Date1 = new Date(friend.lastMessageDate);
					const Date2 = new Date();
					const time = getTime(Date1, Date2);
	
					if (time.minutes < 1)
						friend.lastMessageDate = "few seconds ago";
					else if (time.hours < 1) {
						if (time.minutes == 1)
							friend.lastMessageDate = String(time.minutes) + " minute ago";
						else
							friend.lastMessageDate = String(time.minutes) + " minutes ago";
					}
					else if (time.days < 1) {
						if (time.hours == 1)
							friend.lastMessageDate = String(time.hours) + " hour ago";
						else
							friend.lastMessageDate = String(time.hours) + " hours ago";
					}
					else if (time.weeks < 1) {
						if (time.days == 1)
							friend.lastMessageDate = "yesterday";
						else
							friend.lastMessageDate = String(time.days) + " days ago";
					}
					else if (time.months < 1) {
						if (time.weeks == 1)
							friend.lastMessageDate = String(time.weeks) + " week ago";
						else
							friend.lastMessageDate = String(time.weeks) + " weeks ago";
					}
					else if (time.months > 1) {
						if (time.months == 1)
							friend.lastMessageDate = String(time.months) + " month ago";
						else
							friend.lastMessageDate = String(time.months) + " months ago";
					}
				}
			})
		}

  return { friends, chatbar }
}
