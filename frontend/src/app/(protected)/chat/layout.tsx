"use client"

import Chatbar from "@/components/Chatbar"
import { useEffect, useState } from "react"
import axios from "axios"
import {MdGroups} from "react-icons/md"
import { getTime } from "@/components/getTime"
import Link from "next/link"
import { useChat } from "@/hooks/useChat";


export interface FriendType {
	id: string;
	lastMessage: string;
	lastMessageDate: string;
	name: string;
	picture: string;
}


export default function ChatLayout({
	children,
}: {
	children: React.ReactNode
}) {

	// const user = useContext(UserContext);
	const { showDiv, SetShowDiv, user, chat, image, name, input, handleInput, sendMsg } = useChat({ });
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
		}
		getUsers();
	}, []);

	if (friends) {
		friends.forEach((friend) => {
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
			})
		}

	return (
		<div className="flex h-full text-white">
			<div className="h-full w-1/3 flex flex-col items-center py-4 px-8 border-r-2 border-primecl overflow-scroll">
				<div className="flex w-full justify-between items-center mb-1">
					<p>Create Room</p>
					<div className="cursor-pointer">
						<MdGroups size={25} />
					</div>
				</div>
				{friends && friends.map((friend) => (
					<Link key={friend.id} href={`/chat/${friend.id}`} className="w-full h-[10%] flex justify-center mt-1">
						<Chatbar
							name={friend.name}
							text={friend.lastMessage}
							time={friend.lastMessageDate}
							image={friend.picture}
						/>
					</Link>
				))}
				{!chatbar && (
					<p>Maendakch meamn tdwi ghyrha</p>
				)}
			</div>
			<div className="flex flex-1">
				<div className="flex-1">
					{children}
				</div>
			</div>
		</div>
	)
}