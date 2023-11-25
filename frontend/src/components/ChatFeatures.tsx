import { userType } from '@/context/userContext'
import React, { useEffect, useRef, useState } from 'react'
import { Participant } from './Participant';
import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useContext } from 'react';
import { UserContext } from '@/context/userContext';
import { FriendType } from '@/hooks/useRooms';
import { toast } from 'react-toastify';

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
	const [visible, SetVisible] = useState("");
	const [time, SetTimer] = useState("");
	const [checked, setChecked] = useState("");
	const [room, SetRoom] = useState<FriendType>();

	useEffect(() => {
		const getRoom = async () => {
			try {
				const res = await axios.post("http://localhost:4000/chat/getRoomById", {rid}, {
					withCredentials: true,
				})
				SetRoom(res.data);
			} catch (error) {
			}
		}
		getRoom();
	}, [rid]);

	const handleCheckboxChange = (participantId: string) => {
	  setChecked(participantId);
	};

	const handleSubmit = async () => {
		if (selected.length > 1)
			selected.shift();
		if (mode === "add") {
			try {
				const res = await axios.post("http://localhost:4000/chat/addParticipant", { uids: selected, rid, }, {
					withCredentials: true,
				})
				router.push(`/chat/${rid}`);
			} catch (error) {
			}
		}
		else if (mode === "kick") {
			try {
				const res = await axios.post("http://localhost:4000/chat/kickUser", { id: selected[0], rid }, {
					withCredentials: true,
				})
				router.push(`/chat/${rid}`);
			} catch (error) {
				toast.error("You can't kick an owner");
			}
		}
		else if (mode === "mute") {
			try {
				const res = await axios.post("http://localhost:4000/chat/muteUser", {duration: time, uid: selected[0], rid }, {
					withCredentials: true,
				})
				router.push(`/chat/${rid}`);
			} catch (error) {
			}
		}
		else if (mode === "ban") {
			try {
				const res = await axios.post("http://localhost:4000/chat/banUser", { uid: selected[0], rid }, {
					withCredentials: true,
				})
				router.push(`/chat/${rid}`);
			} catch (error) {
			}
		}
		else if (mode === "unban") {
			try {
				const res = await axios.post("http://localhost:4000/chat/unbanUser", { uid: selected[0], rid }, {
					withCredentials: true,
				})
				router.push(`/chat/${rid}`);
			} catch (error) {
			}
		}
		else if (mode === "give") {
			try {
				const res = await axios.post("http://localhost:4000/chat/giveAdmin", { uid: selected[0], rid }, {
					withCredentials: true,
				})
				router.push(`/chat/${rid}`);
			} catch (error) {
			}
		}
		else if (mode === "delete") {
			try {
				const res = await axios.post("http://localhost:4000/chat/deleteRoom", { uid: selected[0], rid }, {
					withCredentials: true,
				})
				router.push("/");
			} catch (error) {
			}
		}
		else if (mode === "leave") {
			try {
				const res = await axios.post("http://localhost:4000/chat/leaveRoom", { uid: user.user?.id, rid }, {
					withCredentials: true,
				})
				router.push("/");
			} catch (error) {
			}
		}
		else if (mode === "changeName") {
			if (name) {
				try {
					const inputValue = name.current?.value;
					const res = await axios.post("http://localhost:4000/chat/changeRoomName", { name: inputValue, rid }, {
						withCredentials: true,
					})
					router.push(`/chat/${rid}`);
				} catch (error) {
				}
			}
		}
		else if (mode === "changeVisible") {
			let pass;
			if (password) {
				pass = password.current?.value;
			}
			try {
				const res = await axios.post("http://localhost:4000/chat/changeVisibility", {password: pass, visibility: visible, rid }, {
					withCredentials: true,
				})
				router.push(`/chat/${rid}`);
			} catch (error) {
			}
		}
		else if (mode === "changePasswd") {
			let pass;
			if (password) {
				pass = password.current?.value;
			}
			try {
				const res = await axios.post("http://localhost:4000/chat/changePassword", {password: pass, rid }, {
					withCredentials: true,
				})
				router.push(`/chat/${rid}`);
			} catch (error) {
			}
		}
	}

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
				{room && (
					<section className='h-1/2 w-2/3 flex flex-col rounded-md'>
						<h2 className='h-1/5 px-4 text-xl flex items-center justify-center capitalize bg-primecl rounded-t-md'>{title}</h2>
						<div className='flex-1 bg-terserocl flex flex-col items-center justify-center gap-6'>
							<select
								className='p-3 pl-4 rounded-xl bg-quatrocl placeholder-slate-400 text-lg outline-none font-light w-3/4'
								name='visibility'
								onChange={(e: any) => {SetVisible(e.target.value)}}
							>
								<option value="">Choose the visibility of the room</option>
								<option value="PUBLIC">Public</option>
								<option value="PROTECTED">Protected</option>
								<option value="PRIVATE">Private</option>
							</select>
							{visible === room.visibility && (
								<p className='text-red-600 text-sm'>This action wont apply as the room visibility is no different that the previous</p>
							)}
							{visible !== room.visibility && visible !== "" && room.visibility === "PROTECTED" && (
								<input
									placeholder="Room Password"
									type='text'
									ref={password}
									className='p-2 pl-4 rounded-xl bg-quatrocl placeholder-slate-400 text-lg outline-none font-light w-3/4'
								/>
							)}
							{visible === "PROTECTED" && room.visibility !== visible && (
								<input
									placeholder="Room Password"
									type='text'
									ref={password}
									className='p-2 pl-4 rounded-xl bg-quatrocl placeholder-slate-400 text-lg outline-none font-light w-3/4'
								/>
							)}
						</div>
						<div className='bg-primecl flex items-center justify-center rounded-b-md h-1/5'>
							{visible !== room.visibility && visible !== "" && button && (
								<button
									type='submit'
									className='border rounded-lg w-1/4 h-1/2 bg-segundcl cursor-pointer  transition ease-in-out delay-150 hover:scale-105 duration-300'
									onClick={handleSubmit}
								>
									{button}
								</button>
							)}
							{(visible === room.visibility) && button && (
								<button
									type='submit'
									className='border rounded-lg w-1/4 h-1/2 bg-slate-400 cursor-pointer'
								>
									{button}
								</button>
							)}
						</div>
					</section>
				)}
			</div>
		)
	}
	else if (mode === "changePasswd") {
		return (
			<div className='bg-segundcl rounded-lg h-full py-4 flex justify-center items-center'>
				{room && (
					<section className='h-1/2 w-2/3 flex flex-col rounded-md'>
						<h2 className='h-1/5 px-4 text-xl flex items-center justify-center capitalize bg-primecl rounded-t-md'>{title}</h2>
						<div className='flex-1 bg-terserocl flex items-center justify-center'>
							{room.visibility !== "PROTECTED" && (
								<p className='text-red-600 text-sm'>This action is not available as the room visibility is no protected</p>
							)}
							{room.visibility === "PROTECTED" && (
								<input
									placeholder="New Room Password"
									type='text'
									ref={password}
									className='p-2 pl-4 rounded-xl bg-quatrocl placeholder-slate-400 text-lg outline-none font-light w-3/4'
								/>
							)}
						</div>
						<div className='bg-primecl flex items-center justify-center rounded-b-md h-1/5'>
							{button && room.visibility === "PROTECTED" && (
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
				)}
			</div>
		)
	}
	else if (mode === "add") {
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
								many={true}
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
	else if (mode === "mute") {
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
									many={false}
									checked={checked === user.id}
									SetChecked={handleCheckboxChange}
								/>
							</div>
						)}
					</div>
					<div className='h-[20%] flex flex-col justify-center items-center gap-4 bg-primecl rounded-b-md'>
						<select
							className='p-2 pl-4 rounded-xl bg-quatrocl placeholder-slate-400 text-lg outline-none font-light w-3/4'
							onChange={(e: any) => {SetTimer(e.target.value)}}
						>
							<option value="">Set the timer</option>
							<option value="1min">One Minute</option>
							<option value="2min">Two Minutes</option>
							<option value="5min">Five Minutes</option>
							<option value="10min">Ten Minutes</option>
						</select>
						{button && time === "" && (
							<button
								type='submit'
								className='border w-1/3 h-1/3 rounded-lg bg-slate-400 cursor-pointer'
							>
								{button}
							</button>
						)}
						{button && time !== "" && (
							<button
								type='submit'
								className='border w-1/3 h-1/3 rounded-lg bg-segundcl cursor-pointer  transition ease-in-out delay-150 hover:scale-105 duration-300'
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
	else if (mode === "view") {
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
									many={false}
									checked={checked === user.id}
									SetChecked={handleCheckboxChange}
									button={true}
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
									many={false}
									checked={checked === user.id}
									SetChecked={handleCheckboxChange}
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
