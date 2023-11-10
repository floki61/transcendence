"use client"

import React from 'react'
import Image from 'next/image'
import RoomInput from '@/components/RoomInput'
import { useState, useContext } from 'react'
import axios from 'axios'
import { UserContext } from '@/context/userContext'

interface roomType {
	name?: string;
	visibility: string;
	password?: string;
	id?: string;
}

export default function page() {

  const user = useContext(UserContext);
  const [success, setSuccess] = useState(false);
  const [showDiv, setShowDiv] = useState(false);
  const [room, SetRoom] = useState<roomType>();

  const createRoom = async (e: any) => {
	e.preventDefault();
	try {
		if (room) {
			console.log(room);
			const res = await axios.post("http://localhost:4000/chat/createRoom", room, {
				withCredentials: true,
			});
		}
		} catch (error) {
			console.log("Error creating the room", error);
		}
  }
	const handleSave = () => {
		console.log(showDiv);
		setShowDiv(true);
	};

	const handleSucces = () => {
		setSuccess(true);
		setTimeout(() => {
			setSuccess(false);
		}, 3000);
	}

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    
    const newRoom = { ...room, [name]: value };
    SetRoom(newRoom as roomType);
  };
  if (room && user.user) {
  	room.id = user.user.id;
  }
  return (
	<div className='flex flex-col items-center gap-16 w-full h-full p-4'>
		<Image
			src="/placeholder.jpg"
			alt="Room"
			height={200}
			width={200}
			className='rounded-full'
			priority
		/>
		{/* {room && ( */}
			<form className='flex-1 flex flex-col justify-around items-center w-[60%] gap-4 py-4'>				
				<RoomInput
					holder="Room Name"
					type='text'
					onChange={handleChange}
					value={room?.name}
					name='name'
				/>
				<select
					className='p-3 pl-4 rounded-xl bg-primecl placeholder-slate-400 text-lg outline-none font-light w-full'
					name='visibility'
					onChange={handleChange}
				>
					<option value="">Choose the visibility of the room</option>
					<option value="Public">Public</option>
					<option value="Protected">Protected</option>
					<option value="Private">Private</option>
				</select>
				{room?.visibility === "Protected" && (
					<RoomInput
						holder="Room Password"
						type='text'
						onChange={handleChange}
						value={room.password}
						name='password'
					/>
				)}
				<button
					className='bg-primecl rounded-2xl border w-1/3 self-end mt-auto h-[10%]'
					onClick={createRoom}	
				>
					Save
				</button>
			</form>
		{/* )} */}
	</div>
  )
}
