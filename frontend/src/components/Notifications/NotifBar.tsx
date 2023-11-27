"use client"

import axios from 'axios';
import { request } from 'http';
import { redirect } from 'next/dist/server/api-utils';
import Image from 'next/image'
import { useRouter } from 'next/router';
import { useState } from 'react';

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
	const [loading, setLoading] = useState(false);
	const AcceptRequest = async () => {
		setLoading(true);
		if (requestType === 'play') {
			try {
				const res = await axios.post("http://localhost:4000/acceptPlayRequest", { friendId }, {
					withCredentials: true,
				})
			}
			catch (error) {
				setLoading(false);
			}
			window.location.href = `http://localhost:3000/game?type=Friend&mode=simple&playerId=${friendId}`;
		}
		else {
			try {
				const res = await axios.post("http://localhost:4000/acc", { friendId }, {
					withCredentials: true,
				})
			} catch (error) {
				setLoading(false);
			}
		}
	}

	const DeclineRequest = async () => {
		setLoading(true);
		if (requestType === 'play') {
			try {
				const res = await axios.post("http://localhost:4000/rejectPlayRequest", { friendId }, {
					withCredentials: true,
				})
			}
			catch (error) {
				setLoading(false);
			}
		}
		else {
			try {
				const res = await axios.post("http://localhost:4000/rejecte", { friendId }, {
					withCredentials: true,
				})
			}
			catch (error) {
				setLoading(false);
			}
		}
	}

	return (
		<div className='flex h-full flex-col gap-2'>
			<div className='flex items-center gap-2'>
				<Image
					loader={() => picture || "placeholder.jpg"}
					src={picture || "placeholder.jpg"}
					alt="friend pic"
					height={30}
					width={30}
					className="rounded-full aspect-square w-8 h-8 object-cover"
					unoptimized
				/>
				<span>{userName} sent you a {requestType} request</span>
			</div>
			<div className='flex gap-2'>
				<button className='rounded flex-1 bg-primecl cursor-pointer' disabled={loading} onClick={AcceptRequest}>accept</button>
				<button className='rounded flex-1 cursor-pointer border' disabled={loading} onClick={DeclineRequest}>decline</button>
			</div>
		</div>
	)
}
