"use client"

import axios from 'axios';
import { request } from 'http';
import { redirect } from 'next/dist/server/api-utils';
import Image from 'next/image'
import { useRouter } from 'next/router';

interface NotifBarProps {
	picture?: string;
	userName?: string;
	friendId?: string;
	requestType: 'friend' | 'play';
}

export const NotifBar: React.FC<NotifBarProps> = ({
	picture,
	userName,
	friendId,
	requestType,
}) => {
	// const router = useRouter(); // Initialize the useRouter hook
	const AcceptRequest = async () => {
		if (requestType === 'play'){
			try {
				const res = await axios.post("http://localhost:4000/acceptPlayRequest", {friendId},{
					withCredentials: true,
				})
			}
			catch (error) {
				console.log("Accept Request.", error);
			}
			window.location.href = `http://localhost:3000/game?type=Friend&mode=simple&playerId=${friendId}`;
		}
		else {
			try {
				const res = await axios.post("http://localhost:4000/acc", {friendId},{
					withCredentials: true,
				})
			} catch (error) {
				console.log("Accept Request.", error);
			}
		}
	}

	const DeclineRequest = async () => {
		if (requestType === 'play'){
			try {
				const res = await axios.post("http://localhost:4000/rejectPlayRequest", {friendId},{
					withCredentials: true,
				})
			}
			catch (error) {
				console.log("declinet Request.", error);
			}
		}
		else {
			try {
				const res = await axios.post("http://localhost:4000/rejecte", {friendId},{
					withCredentials: true,
				})
			}
			catch (error) {
				console.log("Decline Request.", error);
			}
		}
	}

  return (
	<div className='flex h-full flex-col gap-2'>
		<div className='flex items-center gap-2'>
			<Image
				src={picture || "placeholder.jpg"}
				alt="friend pic"
				height={30}
				width={30}
				className="rounded-full aspect-square w-8 h-8 object-cover"
			/>
			<span>{userName} sent you a {requestType} request</span>
		</div>
		<div className='flex gap-2'>
			<button className='rounded flex-1 bg-primecl cursor-pointer' onClick={AcceptRequest}>accept</button>
			<button className='rounded flex-1 cursor-pointer border' onClick={DeclineRequest}>decline</button>
		</div>
	</div>
  )
}
