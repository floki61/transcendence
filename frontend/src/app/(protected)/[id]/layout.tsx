"use client"

import React from 'react'
import { useState, useEffect } from 'react';
import { HiDotsVertical } from "react-icons/hi";
import { userType } from '@/context/userContext';
import { MdPeopleAlt, MdGroupAdd, MdOutlineCancel } from "react-icons/md";
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useFriend } from '@/hooks/useFriend';
import axios from 'axios';
import { ProfileButton } from '@/components/ProfileButton';

export interface ProfileType {
	user: userType;
	level_P: number;
	barPourcentage: number;
}

interface InviteType {
	friendId: string;
	userId: string;
	status: string;
}

export default function layout({ params, children }: { params: any; children: React.ReactNode }) {
	const { friend, SetFriend } = useFriend(params.id);
	const [request, SetRequest] = useState(false);
	const [accept, SetAccept] = useState(false);
	const [invites, SetInvite] = useState<InviteType[]>([]);
	const pathName = usePathname();

	console.log({ friend });
	console.log(params);
	if (friend && friend.user)
		friend.user.fullName = friend.user.firstName + " " + friend.user.lastName;

	useEffect(() => {
		const getFriendRequest = async () => {
			try {
				const res = await axios.get("http://localhost:4000/getFriendRequests", {
					withCredentials: true,
				});
				console.log("success", res.data);
				SetInvite(res.data);
			} catch (error) {
				console.log("error");
			}
		}
		getFriendRequest();
	}, []);

	const SendRequest = async () => {
		try {
			const res = axios.post("http://localhost:4000/sendFriendRequest", { friendId: params.id }, {
				withCredentials: true,
			})
			console.log("success FriendRequest");
			SetRequest(true);
		} catch (error) {
			console.log("SendRequest failed", error);
		}
	}
	const CancelRequest = async () => {
		try {
			const res = axios.post("http://localhost:4000/cancelFriendRequest", { friendId: params.id }, {
				withCredentials: true,
			})
			console.log("success CancelRequest");
			SetRequest(false);
		} catch (error) {
			console.log("CancelRequest failed", error);
		}
	}
	const DeclineRequest = async () => {
		try {
			const res = axios.post("http://localhost:4000/rejecte", { friendId: params.id }, {
				withCredentials: true,
			})
			console.log("success DeclineRequest");
			SetAccept(false);
			SetRequest(false);
		} catch (error) {
			console.log("DeclineRequest failed", error);
		}
	}
	const AcceptRequest = async () => {
		try {
			const res = axios.post("http://localhost:4000/acc", { friendId: params.id }, {
				withCredentials: true,
			})
			console.log("success AcceptRequest");
			SetAccept(false);
			SetRequest(false);
		} catch (error) {
			console.log("DeclineRequest failed", error);
		}
	}

	const handleRequest = async (action: string) => {
		if (action === "Add")
			await SendRequest();
		else if (action === "Cancel")
			await CancelRequest();
		else if (action === "Decline")
			await DeclineRequest();
		else if (action === "accept")
			await AcceptRequest();
	}

	useEffect(() => {
		if (invites) {
			invites.map((invite) => {
				if ((invite.userId === params.id || invite.friendId === params.id) && invite.status === "PENDING") {
					SetAccept(true);
					SetRequest(true);
				}
			})
		}
	}, [invites])

	console.log(friend?.isfriend, " ", accept, " ", request);

	return (
		<div className='h-full w-full p-10 overflow-hidden'>
			{friend && friend.user && (
				<div className='h-full w-full flex flex-col gap-16'>
					<div className='flex gap-4 h-[22%]'>
						<Image
							src={friend.user.picture || "/placeholder.jpg"}
							alt={"profile pic"}
							height={140}
							width={140}
							className="rounded-full aspect-square w-36 h-36 object-cover"
						/>
						<div className='w-3/5 h-full flex flex-col justify-between px-4'>
							<div className='flex flex-col gap-1'>
								<div className='flex justify-between'>
									<h2 className='text-3xl'>{friend.user.fullName}</h2>
									<div>
										<HiDotsVertical size={30} />
									</div>
								</div>
								<h3 className='text-xl'>{friend.user.userName}</h3>
							</div>
							{!friend.isfriend && !request && !accept && (
								<div className='flex justify-end'>
									<ProfileButton color="bg-primecl" text="Add Friend" icon={MdGroupAdd} action={SendRequest} />
								</div>
							)}
							{!friend.isfriend && request && !accept && (
								<div className='flex justify-end'>
									<ProfileButton color="bg-[#6A6666]" text="Cancel" icon={MdOutlineCancel} action={CancelRequest} />
								</div>
							)}
							{accept && request && (
								<div className='flex justify-end gap-3'>
									<ProfileButton color="bg-primecl" text="Accept" icon={MdPeopleAlt} action={AcceptRequest} />
									<ProfileButton color="bg-[#6A6666]" text="Decline" icon={MdOutlineCancel} action={DeclineRequest} />
								</div>
							)}
							{friend.isfriend && !request && !accept && (
								<div className='flex justify-end'>
									<ProfileButton color="bg-primecl" text="Friends" icon={MdPeopleAlt} />
								</div>
							)}
							<div className='relative w-full bg-[#6A6666] rounded-xl text-center text-black self-end'>
								{friend && (
									<div className={`bg-quatrocl w-[${friend.barPourcentage}%] h-full rounded-xl absolute top-0 left-0`}></div>
								)}
								<p className='text-black text-center z-10 relative text-xl font-medium'>Level {friend.level_P}</p>
							</div>
						</div>
						<div className='w-[25%] text-center'>chart</div>
					</div>
					<div className='flex-1 flex flex-col items-center relative'>
						<Image
							src="/paddle.png"
							alt="paddle"
							width={170}
							height={170}
							className='absolute place-self-end'
						/>
						<div className='w-[60%] h-[12%] rounded-t-xl bg-primecl flex items-center'>
							<Link href={`/${params.id}`} className={`${pathName === "/" + params.id ? 'bg-gradient-to-t from-[#000000] from-0% to-segundcl to-100% rounded-tl-xl' : ''} hover:bg-gradient-to-t hover:from-[#000000] hover:from-0% hover:to-segundcl hover:to-100% hover:rounded-tl-xl w-1/3 text-2xl text-center h-full flex justify-center items-center border-r border-segundcl`}>Stats</Link>
							<Link href={`/${params.id}/achievements`} className={`${pathName === "/" + params.id + "/achievements" ? 'bg-gradient-to-t from-[#000000] from-0% to-segundcl to-100% ' : ''} hover:bg-gradient-to-t hover:from-[#000000] hover:from-0% hover:to-segundcl hover:to-100% w-1/3 text-2xl text-center h-full flex justify-center items-center border-r border-segundcl`}>Achievements</Link>
							<Link href={`/${params.id}/history`} className={`${pathName === "/" + params.id + "/history" ? 'bg-gradient-to-t from-[#000000] from-0% to-segundcl to-100% rounded-tr-xl' : ''} hover:bg-gradient-to-t hover:from-[#000000] hover:from-0% hover:to-segundcl hover:to-100% hover:rounded-tr-xl w-1/3 text-2xl text-center h-full flex justify-center items-center`}>History</Link>
						</div>
						<div className='px-16 w-full flex-1 rounded-xl'>
							<div className='h-full w-full rounded-xl bg-segundcl'>
								{children}
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
