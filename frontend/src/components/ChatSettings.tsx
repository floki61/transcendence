import React, { useState } from 'react'
import Link from 'next/link';
import axios from 'axios';
import { userType } from '@/context/userContext';

interface ChatSettingsProps {
	role: string;
	id: string;
}

export const ChatSettings: React.FC<ChatSettingsProps> = ({
	role,
	id,
}
) => {
	console.log(role);
	console.log(id);

	if (role === "USER") {
		return (
			<div className="text-white text-sm font-light border-2 border-quatrocl absolute top-10 right-3 w-full h-28 rounded-md bg-terserocl flex flex-col">
			  <p className="cursor-pointer hover:bg-segundcl rounded-t-md border-b-2 border-quatrocl w-full px-2 flex items-center h-1/3">View Profile</p>
			  <p className="cursor-pointer hover:bg-segundcl border-b-2 border-quatrocl w-full px-2 flex items-center h-1/3">Block</p>
			  <p className="cursor-pointer hover:bg-segundcl rounded-b-md w-full px-2 flex items-center h-1/3">Invite</p>
		  </div>
		)
	}
	else if (role === "ADMIN") {
		return (
			<div className="text-white text-sm font-light border-2 border-quatrocl absolute top-10 right-3 w-full h-48 rounded-md bg-terserocl flex flex-col">
				<Link href={`/chat/${id}/addParticipants`} className="cursor-pointer hover:bg-segundcl rounded-t-md border-b-2 border-quatrocl w-full px-2 flex items-center h-1/5">View Participants</Link>
				<Link href={`/chat/${id}/muteParticipant`} className="cursor-pointer hover:bg-segundcl border-b-2 border-quatrocl w-full px-2 flex items-center h-1/5">Mute a Participant</Link>
				<Link href={`/chat/${id}/banParticipant`} className="cursor-pointer hover:bg-segundcl border-b-2 border-quatrocl w-full px-2 flex items-center h-1/5">Ban a Participant</Link>
				<Link href={`/chat/${id}/kickParticipant`} className="cursor-pointer hover:bg-segundcl border-b-2 border-quatrocl w-full px-2 flex items-center h-1/5">Kick a Participant</Link>
				<p className="cursor-pointer hover:bg-segundcl rounded-b-md w-full px-2 flex items-center h-1/5">Leave the Room</p>
			</div>
		  )
	}
	else if (role === "OWNER") {
		return (
			<div className="text-white text-sm font-light border-2 border-quatrocl absolute top-10 right-3 w-full h-[110] rounded-md bg-terserocl flex flex-col">
				<Link href={`/chat/${id}/viewParticipants`} className="cursor-pointer hover:bg-segundcl rounded-t-md border-b-2 border-quatrocl w-full px-2 flex items-center h-[11%]">View Participants</Link>
				<Link href={`/chat/${id}/addParticipants`} className="cursor-pointer hover:bg-segundcl border-b-2 border-quatrocl w-full px-2 flex items-center h-[11%]">Add Participants</Link>
				<Link href={`/chat/${id}/muteParticipant`} className="cursor-pointer hover:bg-segundcl border-b-2 border-quatrocl w-full px-2 flex items-center h-[11%]">Mute a Participant</Link>
				<Link href={`/chat/${id}/banParticipant`} className="cursor-pointer hover:bg-segundcl border-b-2 border-quatrocl w-full px-2 flex items-center h-[11%]">Ban a Participant</Link>
				<Link href={`/chat/${id}/kickParticipant`} className="cursor-pointer hover:bg-segundcl border-b-2 border-quatrocl w-full px-2 flex items-center h-[11%]">Kick a Participant</Link>
				<p className="cursor-pointer hover:bg-segundcl border-b-2 border-quatrocl w-full px-2 flex items-center h-[11%]">Delete the Room</p>
				<p className="cursor-pointer hover:bg-segundcl border-b-2 border-quatrocl w-full px-2 flex items-center h-[11%]">Change Room Name</p>
				<p className="cursor-pointer hover:bg-segundcl border-b-2 border-quatrocl w-full px-2 flex items-center h-[11%]">Change Room Visibility</p>
				<p className="cursor-pointer hover:bg-segundcl border-b-2 border-quatrocl w-full px-2 flex items-center h-[11%]">Change Password</p>
				<p className="cursor-pointer hover:bg-segundcl border-b-2 border-quatrocl w-full px-2 flex items-center h-[11%]">Give Admin</p>
				<p className="cursor-pointer hover:bg-segundcl rounded-b-md w-full px-2 flex items-center h-[11%]">Leave the Room</p>
			</div>
		)
	}
}

