import React, { useState } from 'react'
import Link from 'next/link';
import axios from 'axios';
import { userType } from '@/context/userContext';

interface ChatSettingsProps {
	role: string;
	id: string;
	dm?: boolean;
	friendId?: string;
}

export const ChatSettings: React.FC<ChatSettingsProps> = ({
	role,
	id,
	dm,
	friendId,
}
) => {

	const Challenge = async () => {
		try {
			const res = await axios.post("http://10.12.1.6:4000/sendPlaydRequest", {friendId}, {
				withCredentials: true,
			});
		} catch (error) {
		}
	}
	const Block = async () => {
		try {
			const res = axios.post("http://10.12.1.6:4000/blockUser", { friendId }, {
				withCredentials: true,
			})
		} catch (error) {
		}
	}

	if (role === "USER" && dm) {
		return (
			<div className="text-white text-sm font-light border-2 border-quatrocl absolute top-10 right-3 w-full h-28 rounded-md bg-terserocl flex flex-col">
			  <Link href={`/user/${friendId}`} as={`/user/${friendId}`} className="cursor-pointer hover:bg-segundcl rounded-t-md border-b-2 border-quatrocl w-full px-2 flex items-center h-1/3">View Profile</Link>
			  <p className="cursor-pointer hover:bg-segundcl border-b-2 border-quatrocl w-full px-2 flex items-center h-1/3" onClick={Block}>Block</p>
			  <p className="cursor-pointer hover:bg-segundcl rounded-b-md w-full px-2 flex items-center h-1/3" onClick={Challenge}>Invite</p>
		  </div>
		)
	}
	else if (role === "USER" && !dm) {
		return (
			<div className="text-white text-sm font-light border-2 border-quatrocl absolute top-10 right-3 w-full h-28 rounded-md bg-terserocl flex flex-col">
			  <Link href={`/chat/${id}/viewParticipants`} as={`/chat/${id}/viewParticipants`} className="cursor-pointer hover:bg-segundcl rounded-t-md border-b-2 border-quatrocl w-full px-2 flex items-center h-1/2">View Participants</Link>
			  <Link href={`/chat/${id}/leaveRoom`} as={`/chat/${id}/leaveRoom`} className="cursor-pointer hover:bg-segundcl w-full px-2 flex items-center h-1/2">Leave the room</Link>
		  	</div>
		)
	}
	else if (role === "ADMIN") {
		return (
			<div className="text-white text-sm font-light border-2 border-quatrocl absolute top-10 right-3 w-full h-48 rounded-md bg-terserocl flex flex-col">
				<Link href={`/chat/${id}/viewParticipants`} as={`/chat/${id}/viewParticipants`} className="cursor-pointer hover:bg-segundcl rounded-t-md border-b-2 border-quatrocl w-full px-2 flex items-center h-1/5">View Participants</Link>
				<Link href={`/chat/${id}/muteParticipant`} as={`/chat/${id}/muteParticipant`} className="cursor-pointer hover:bg-segundcl border-b-2 border-quatrocl w-full px-2 flex items-center h-1/5">Mute a Participant</Link>
				<Link href={`/chat/${id}/banParticipant`} as={`${id}/banParticipant`} className="cursor-pointer hover:bg-segundcl border-b-2 border-quatrocl w-full px-2 flex items-center h-1/5">Ban a Participant</Link>
				<Link href={`/chat/${id}/unbanParticipant`} as={`/chat/${id}/unbanParticipant`} className="cursor-pointer hover:bg-segundcl border-b-2 border-quatrocl w-full px-2 flex items-center h-1/5">UnBan a Participant</Link>
				<Link href={`/chat/${id}/kickParticipant`} as={`/chat/${id}/kickParticipant`} className="cursor-pointer hover:bg-segundcl border-b-2 border-quatrocl w-full px-2 flex items-center h-1/5">Kick a Participant</Link>
				<Link href={`/chat/${id}/leaveRoom`} as={`/chat/${id}/leaveRoom`} className="cursor-pointer hover:bg-segundcl rounded-b-md w-full px-2 flex items-center h-1/5">Leave the Room</Link>
			</div>
		  )
	}
	else if (role === "OWNER") {
		return (
			<div className="text-white text-sm font-light border-2 border-quatrocl absolute top-10 right-3 w-full h-[110] rounded-md bg-terserocl flex flex-col">
				<Link href={`/chat/${id}/viewParticipants`} as={`/chat/${id}/viewParticipants`} className="cursor-pointer hover:bg-segundcl rounded-t-md border-b-2 border-quatrocl w-full px-2 flex items-center h-[11%]">View Participants</Link>
				<Link href={`/chat/${id}/addParticipants`} as={`/chat/${id}/addParticipants`} className="cursor-pointer hover:bg-segundcl border-b-2 border-quatrocl w-full px-2 flex items-center h-[11%]">Add Participants</Link>
				<Link href={`/chat/${id}/muteParticipant`} as={`/chat/${id}/muteParticipant`}  className="cursor-pointer hover:bg-segundcl border-b-2 border-quatrocl w-full px-2 flex items-center h-[11%]">Mute a Participant</Link>
				<Link href={`/chat/${id}/banParticipant`} as={`/chat/${id}/banParticipant`} className="cursor-pointer hover:bg-segundcl border-b-2 border-quatrocl w-full px-2 flex items-center h-[11%]">Ban a Participant</Link>
				<Link href={`/chat/${id}/unbanParticipant`} as={`/chat/${id}/unbanParticipant`} className="cursor-pointer hover:bg-segundcl border-b-2 border-quatrocl w-full px-2 flex items-center h-[11%]">UnBan a Participant</Link>
				<Link href={`/chat/${id}/kickParticipant`} as={`/chat/${id}/kickParticipant`}  className="cursor-pointer hover:bg-segundcl border-b-2 border-quatrocl w-full px-2 flex items-center h-[11%]">Kick a Participant</Link>
				<Link href={`/chat/${id}/deleteRoom`} as={`/chat/${id}/deleteRoom`} className="cursor-pointer hover:bg-segundcl border-b-2 border-quatrocl w-full px-2 flex items-center h-[11%]">Delete the Room</Link>
				<Link href={`/chat/${id}/changeRoomName`} as={`/chat/${id}/changeRoomName`} className="cursor-pointer hover:bg-segundcl border-b-2 border-quatrocl w-full px-2 flex items-center h-[11%]">Change Room Name</Link>
				<Link href={`/chat/${id}/changeRoomVisibility`} as={`/chat/${id}/changeRoomVisibility`} className="cursor-pointer hover:bg-segundcl border-b-2 border-quatrocl w-full px-2 flex items-center h-[11%]">Change Room Visibility</Link>
				<Link href={`/chat/${id}/changeRoomPasswd`} as={`/chat/${id}/changeRoomPasswd`} className="cursor-pointer hover:bg-segundcl border-b-2 border-quatrocl w-full px-2 flex items-center h-[11%]">Change Password</Link>
				<Link href={`/chat/${id}/giveAdmin`} as={`/chat/${id}/giveAdmin`} className="cursor-pointer hover:bg-segundcl border-b-2 border-quatrocl w-full px-2 flex items-center h-[11%]">Give Admin</Link>
				<Link href={`/chat/${id}/leaveRoom`} as={`/chat/${id}/leaveRoom`} className="cursor-pointer hover:bg-segundcl rounded-b-md w-full px-2 flex items-center h-[11%]">Leave the Room</Link>
			</div>
		)
	}
}

