"use client"

import Chatbar from "@/components/Chatbar"
import { useEffect, useState } from "react"
import axios from "axios"
import {MdGroupAdd} from "react-icons/md"
import { getTime } from "@/components/getTime"
import Link from "next/link"
import { useRooms } from "@/hooks/useRooms"


export default function ChatLayout({
	children,
}: {
	children: React.ReactNode
}) {

	const { friends, chatbar } = useRooms();
	const [roomDiv, SetRoomDiv] = useState(false);

	console.log({friends});

	return (
		<div className="flex h-full text-white">
			<div className="h-full w-1/3 flex flex-col items-center py-4 px-8 border-r-2 border-primecl overflow-scroll">
				<div className="flex w-full justify-between items-center mb-2">
					<div className="cursor-pointer w-full flex justify-end">
						<Link
							href="/chat/createroom"
							className="flex gap-3 rounded-lg bg-quatrocl px-2 items-center"
							onClick={() => SetRoomDiv(!roomDiv)}
						>
							<p>Create Room</p>
							<div className="">
								<MdGroupAdd size={22} />
							</div>
						</Link>
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
			<div className="flex flex-1 overflow-hidden">
				<div className="flex-1 w-2/3">
					{children}
				</div>
			</div>
		</div>
	)
}