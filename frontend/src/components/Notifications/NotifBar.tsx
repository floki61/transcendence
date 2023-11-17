"use client"

import axios from 'axios';
import Image from 'next/image'

interface NotifBarProps {
	picture: string;
	userName: string;
	friendId: string;
}

export const NotifBar: React.FC<NotifBarProps> = ({
	picture,
	userName,
	friendId,
}) => {

	const AcceptRequest = async () => {
		try {
			const res = await axios.post("http://localhost:4000/acc", {friendId},{
				withCredentials: true,
			})
			console.log("success", res.data);
		} catch (error) {
			console.log("Accept Request.", error);
		}
	}

	const DeclineRequest = async () => {
		try {
			const res = await axios.post("http://localhost:4000/rejecte", {friendId},{
				withCredentials: true,
			})
			console.log("success", res.data);
		} catch (error) {
			console.log("Decline Request.", error);
		}
	}

  return (
	<div className='flex flex-col gap-2'>
		<div className='flex items-center gap-2'>
			<Image
				src={picture}
				alt="friend pic"
				height={30}
				width={30}
				className="rounded-full"
			/>
			<span>{userName} sent you a friend request</span>
		</div>
		<div className='flex gap-1'>
			<button className='rounded flex-1 bg-primecl' onClick={AcceptRequest}>accept</button>
			<button className='rounded flex-1 ' onClick={DeclineRequest}>decline</button>
		</div>
	</div>
  )
}
