import { userType } from '@/context/userContext'
import React, { useRef } from 'react'
import { Participant } from './Participant';
import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useContext } from 'react';
import { UserContext } from '@/context/userContext';

interface ChatFeaturesProps {
	users: userType[] | undefined;
	title: string;
	button?: string;
	checkbox: boolean;
	selected: string[];
	SetSelected?(e: any): any;
	rid: string;
	mode: string;
}

export const ChatFeatures: React.FC<ChatFeaturesProps> = ({
	users,
	title,
	button,
	checkbox,
	selected,
	SetSelected,
	rid,
	mode,
}) => {

	const router = useRouter();
	const user = useContext(UserContext);
	const name = useRef<HTMLInputElement>(null);
	const password = useRef<HTMLInputElement>(null);
	const visible = useRef<HTMLSelectElement>(null);

	const handleSubmit = async () => {
		selected.shift();
		if (mode === "add") {
			try {
				const res = await axios.post("http://localhost:4000/chat/addParticipant", {uids: selected, rid,},{
					withCredentials: true,
				})
				console.log("success", res.data);
				router.push(`/chat/${rid}`);
			} catch (error) {
				console.log("addParticipants failed.", error);
			}
		}
		else if (mode === "kick") {
			try {
				console.log(selected[0]);
				const res = await axios.post("http://localhost:4000/chat/kickUser", {id: selected[0], rid}, {
					withCredentials: true,
				})
				console.log("success", res.data);
				router.push(`/chat/${rid}`);
			} catch (error) {
				console.log("kickuser failed.", error);
			}
		}
		else if (mode === "ban") {
			try {
				const res = await axios.post("http://localhost:4000/chat/banUser", {uid: selected[0], rid}, {
					withCredentials: true,
				})
				console.log("success", res.data);
				router.push(`/chat/${rid}`);
			} catch (error) {
				console.log("banuser failed.", error);
			}
		}
		else if (mode === "give") {
			try {
				const res = await axios.post("http://localhost:4000/chat/giveAdmin", {uid: selected[0], rid}, {
					withCredentials: true,
				})
				console.log("success", res.data);
				router.push(`/chat/${rid}`);
			} catch (error) {
				console.log("giveAdmin failed.", error);
			}
		}
		else if (mode === "delete") {
			try {
				const res = await axios.post("http://localhost:4000/chat/deleteRoom", {uid: selected[0], rid}, {
					withCredentials: true,
				})
				console.log("success", res.data);
				router.push("/");
			} catch (error) {
				console.log("deleteRoom failed.", error);
			}
		}
		else if (mode === "leave") {
			try {
				const res = await axios.post("http://localhost:4000/chat/leaveRoom", {uid: user.user?.id, rid}, {
					withCredentials: true,
				})
				console.log("success", res.data);
				router.push("/");
			} catch (error) {
				console.log("leaveRoom failed.", error);
			}
		}
		else if (mode === "changeName") {
			if (name) {
				try {
					const inputValue = name.current?.value;
					const res = await axios.post("http://localhost:4000/chat/changeRoomName", {name: inputValue, rid}, {
						withCredentials: true,
					})
					console.log("success", res.data);
					router.push(`/chat/${rid}`);
				} catch (error) {
					console.log("changeName failed.", error);
				}
			}
		}
		else if (mode === "changeVisible") {
			if (visible) {
				try {
					const inputValue = visible.current?.value;
					const res = await axios.post("http://localhost:4000/chat/changeVisibility", {visibility: inputValue, rid}, {
						withCredentials: true,
					})
					console.log("success", res.data);
					router.push(`/chat/${rid}`);
				} catch (error) {
					console.log("changeVisibility failed.", error);
				}
			}
		}
	};

	if (mode === "delete" || mode === "leave") {
		return (
			<div className='bg-segundcl rounded-lg h-full py-4 flex justify-center items-center'>
				<section className='h-1/2 w-2/3 flex flex-col items-center justify-evenly rounded-md bg-primecl'>
				<h2 className='px-4 text-center text-xl flex capitalize bg-primecl rounded-t-md'>{title}</h2>
				{button && (
					<div className='h-[30%] w-full flex justify-evenly items-center bg-primecl rounded-b-md'>
						<Link
							href={`/chat/${rid}/`}
							className='border w-1/3 h-1/2 flex items-center justify-center rounded-lg bg-quatrocl cursor-pointer transition ease-in-out delay-150 hover:scale-105 duration-300'
						>
							Cancel
						</Link>
						<button
							type='submit'
							className='border w-1/3 h-1/2 rounded-lg bg-red-700 cursor-pointer transition ease-in-out delay-150 hover:scale-105 duration-300'
							onClick={handleSubmit}
						>
							{button}
						</button>
					</div>
				)}
				</section>
			  </div>
		)
	}
	else if (mode === "changeName") {
		return (
			<div className='bg-segundcl rounded-lg h-full py-4 flex justify-center items-center'>
				<section className='h-1/2 w-2/3 flex flex-col rounded-md'>
					<h2 className='h-1/5 px-4 text-xl flex items-center justify-center capitalize bg-primecl rounded-t-md'>{title}</h2>
					<div className='flex-1 bg-terserocl flex items-center justify-center'>
						<input
							placeholder="New Room Name"
							type="text"
							className='p-3 pl-4 rounded-xl bg-quatrocl placeholder-slate-400 text-lg outline-none font-light w-3/4'
							ref={name}
						/>
					</div>
					<div className='bg-primecl flex items-center justify-center rounded-b-md h-1/5'>
			  		{button && (
				  		<button
							type='submit'
							className='border rounded-lg w-1/4 h-1/2 bg-segundcl cursor-pointer  transition ease-in-out delay-150 hover:scale-105 duration-300'
							onClick={handleSubmit}
				  		>
					  		{button}
				  		</button>
			  		)}
					</div>
				</section>
			  </div>
		)
	}
	else if (mode === "changeVisible") {
		return (
			<div className='bg-segundcl rounded-lg h-full py-4 flex justify-center items-center'>
				<section className='h-1/2 w-2/3 flex flex-col rounded-md'>
					<h2 className='h-1/5 px-4 text-xl flex items-center justify-center capitalize bg-primecl rounded-t-md'>{title}</h2>
					<div className='flex-1 bg-terserocl flex items-center justify-center'>
						<select
							className='p-3 pl-4 rounded-xl bg-quatrocl placeholder-slate-400 text-lg outline-none font-light w-3/4'
							name='visibility'
							ref={visible}
						>
							<option value="">Choose the visibility of the room</option>
							<option value="PUBLIC">Public</option>
							<option value="PROTECTED">Protected</option>
							<option value="PRIVATE">Private</option>
						</select>
						{visible.current?.value === "PROTECTED" && (
							<input
								placeholder="Room Password"
								type='text'
								ref={password}
								// value={password}
								// name='password'
							/>
						)}
					</div>
					<div className='bg-primecl flex items-center justify-center rounded-b-md h-1/5'>
			  		{button && (
				  		<button
							type='submit'
							className='border rounded-lg w-1/4 h-1/2 bg-segundcl cursor-pointer  transition ease-in-out delay-150 hover:scale-105 duration-300'
							onClick={handleSubmit}
				  		>
					  		{button}
				  		</button>
			  		)}
					</div>
				</section>
			  </div>
		)	
	}
	else {
		return (
		  <div className='bg-segundcl rounded-lg h-full py-4 flex justify-center'>
		  <section className='h-full w-1/2 flex flex-col rounded-md'>
			<h2 className='h-[10%] flex items-center justify-center capitalize bg-primecl rounded-t-md'>{title}</h2>
			<div className='flex-1 bg-terserocl overflow-scroll'>
			  {users && users.map((user, index) => 
				  <div key={index} className='h-[15%] border-b-2 border-primecl'>
					<Participant
					  name={user.userName}
					  picture={user.picture}
					  checkbox={checkbox}
					  selected={selected}
					  SetSelected={SetSelected}
					  id={user.id}
					/>
				  </div>
			  )}
			</div>
			<div className='h-[10%] flex justify-center items-center bg-primecl rounded-b-md'>
			  {button && (
				  <button
					  type='submit'
					  className='border w-1/3 h-1/2 rounded-lg bg-segundcl cursor-pointer  transition ease-in-out delay-150 hover:scale-105 duration-300'
					  onClick={handleSubmit}
				  >
					  {button}
				  </button>
			  )}
			</div>
		  </section>
			</div>
		)
	}
}
