"use client"

import Chatbar from "@/components/Chatbar"
import { useEffect, useState } from "react"
import axios from "axios"
import { useContext } from "react"
import { UserContext } from "@/context/userContext"
import { getTime } from "@/components/getTime"
import Link from "next/link"

interface FriendType {
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

	const user = useContext(UserContext);
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
				console.log("this is friend : ", friend);
				console.log("name is : ", friend.name)
				const Date1 = new Date(friend.lastMessageDate);
				const Date2 = new Date();
				const time = getTime(Date1, Date2);
				console.log("time in hours : " , time.hours)
				console.log("time in days : " , time.days)
				if (time.days < 1) {
					if (time.hours == 1)
						friend.lastMessageDate = String(time.hours) + " hour ago";
					else
						friend.lastMessageDate = String(time.hours) + " hours ago";
				}
				else if (time.weeks < 1) {
					if (time.days == 1)
						friend.lastMessageDate = String(time.days) + " day ago";
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
			<div className="h-full w-1/3 flex flex-col items-center gap-4 py-8 border-r-2 border-primecl overflow-scroll">
				{friends && friends.map((friend) => (
						<div className="w-full flex justify-center">
							<Link href={`/chat/${friend.id}`} className="w-full flex justify-center">
								<Chatbar
									key= {friend.id}
									name={friend.name}
									text={friend.lastMessage}
									time={friend.lastMessageDate}
									image={friend.picture}
								/>
							</Link>
						</div>
				))}
				{!chatbar && (
					<p>Maendakch meamn tdwi ghyrha</p>
				)}
			</div>
			<div className="flex flex-1 overflow-hidden">
				<div className="flex-1 overflow-x-hidden overflow-auto">
					{children}
				</div>
			</div>
		</div>
	)
}