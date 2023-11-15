"use client"

import React from 'react'
import { useState, useEffect } from 'react';
import { userType } from '@/context/userContext';
import axios from 'axios';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useFriend } from '@/hooks/useFriend';

export interface ProfileType {
	user: userType;
	level_P: number;
	barPourcentage: number;
}

export default function layout({params, children}: {params: any; children: React.ReactNode}) {
	const {friend, SetFriend} = useFriend(params.id);
	const pathName = usePathname();
	
	console.log(friend?.barPourcentage);
	console.log(params);
	if (friend && friend.user)
		friend.user.fullName = friend.user.firstName + " " + friend.user.lastName;

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
				  className='rounded-full'
				/>
				<div className='w-3/5 h-full flex flex-col justify-between px-4'>
				  <h2 className='text-2xl'>{friend.user.fullName}</h2>
				  <h3 className='text-xl'>{friend.user.userName}</h3>
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
				  <Link href={`/${params.id}`} className={`${pathName === "/" + params.id ? 'bg-gradient-to-t from-[#000000] from-0% to-segundcl to-100% ' : ''} hover:bg-gradient-to-t hover:from-[#000000] hover:from-0% hover:to-segundcl hover:to-100% hover:rounded-tl-xl w-1/3 text-2xl text-center h-full flex justify-center items-center border-r border-segundcl`}>Stats</Link>
				  <Link href={`/${params.id}/achievements`} className={`${pathName === "/" + params.id + "/achievements" ? 'bg-gradient-to-t from-[#000000] from-0% to-segundcl to-100% ' : ''} hover:bg-gradient-to-t hover:from-[#000000] hover:from-0% hover:to-segundcl hover:to-100% w-1/3 text-2xl text-center h-full flex justify-center items-center border-r border-segundcl`}>Achievements</Link>
				  <Link href={`/${params.id}/history`} className={`${pathName === "/" + params.id + "/history" ? 'bg-gradient-to-t from-[#000000] from-0% to-segundcl to-100% ' : ''} hover:bg-gradient-to-t hover:from-[#000000] hover:from-0% hover:to-segundcl hover:to-100% hover:rounded-tr-xl w-1/3 text-2xl text-center h-full flex justify-center items-center`}>History</Link>
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
