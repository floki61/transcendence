import React from 'react'

export const ChatSettings = (
	role: any,
) => {
	console.log(role.role);
	if (role.role === "USER") {
		return (
		  <div className="text-white text-sm font-light border-2 border-quatrocl absolute top-10 right-3 w-full h-28 rounded-md bg-terserocl flex flex-col">
			  <p className="cursor-pointer hover:bg-segundcl rounded-t-md border-b-2 border-quatrocl w-full px-2 flex items-center h-1/3">View Profile</p>
			  <p className="cursor-pointer hover:bg-segundcl border-b-2 border-quatrocl w-full px-2 flex items-center h-1/3">Block</p>
			  <p className="cursor-pointer hover:bg-segundcl rounded-b-md w-full px-2 flex items-center h-1/3">Invite</p>
		  </div>
		)
	}
	else if (role.role === "ADMIN") {
		return (
			<div className="text-white text-sm font-light border-2 border-quatrocl absolute top-10 right-3 w-full h-48 rounded-md bg-terserocl flex flex-col">
				<p className="cursor-pointer hover:bg-segundcl rounded-t-md border-b-2 border-quatrocl w-full px-2 flex items-center h-1/5">View Participants</p>
				<p className="cursor-pointer hover:bg-segundcl border-b-2 border-quatrocl w-full px-2 flex items-center h-1/5">Mute a Participant</p>
				<p className="cursor-pointer hover:bg-segundcl border-b-2 border-quatrocl w-full px-2 flex items-center h-1/5">Ban a Participant</p>
				<p className="cursor-pointer hover:bg-segundcl border-b-2 border-quatrocl w-full px-2 flex items-center h-1/5">Kick a Participant</p>
				<p className="cursor-pointer hover:bg-segundcl rounded-b-md w-full px-2 flex items-center h-1/5">Leave the Room</p>
			</div>
		  )	
	}
	else if (role.role === "OWNER") {
		return (
			<div className="text-white text-sm font-light border-2 border-quatrocl absolute top-10 right-3 w-full h-96 rounded-md bg-terserocl flex flex-col">
				<p className="cursor-pointer hover:bg-segundcl rounded-t-md border-b-2 border-quatrocl w-full px-2 flex items-center h-[10%]">View Participants</p>
				<p className="cursor-pointer hover:bg-segundcl border-b-2 border-quatrocl w-full px-2 flex items-center h-[10%]">Mute a Participant</p>
				<p className="cursor-pointer hover:bg-segundcl border-b-2 border-quatrocl w-full px-2 flex items-center h-[10%]">Ban a Participant</p>
				<p className="cursor-pointer hover:bg-segundcl border-b-2 border-quatrocl w-full px-2 flex items-center h-[10%]">Kick a Participant</p>
				<p className="cursor-pointer hover:bg-segundcl border-b-2 border-quatrocl w-full px-2 flex items-center h-[10%]">Delete the Room</p>
				<p className="cursor-pointer hover:bg-segundcl border-b-2 border-quatrocl w-full px-2 flex items-center h-[10%]">Change Room Name</p>
				<p className="cursor-pointer hover:bg-segundcl border-b-2 border-quatrocl w-full px-2 flex items-center h-[10%]">Change Room Visibility</p>
				<p className="cursor-pointer hover:bg-segundcl border-b-2 border-quatrocl w-full px-2 flex items-center h-[10%]">Change Password</p>
				<p className="cursor-pointer hover:bg-segundcl border-b-2 border-quatrocl w-full px-2 flex items-center h-[10%]">Give Admin</p>
				<p className="cursor-pointer hover:bg-segundcl rounded-b-md w-full px-2 flex items-center h-[10%]">Leave the Room</p>
			</div>
		  )	
	}
}

