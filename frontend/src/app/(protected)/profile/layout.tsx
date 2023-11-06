"use client"

import React from 'react'
import { useContext } from 'react'
import { UserContext } from '@/context/userContext';
import Image from 'next/image';
import Link from 'next/link';

export default function page({
	children,
}: {
	children: React.ReactNode
}) {

  const user = useContext(UserContext);

  return (
    <div className='h-full w-full p-10 overflow-hidden'>
      {user.user && (
        <div className='h-full w-full flex flex-col gap-16'>
          <div className='flex gap-4 h-[22%]'>
            <Image
              src={user.user.picture}
              alt={"profile pic"}
              height={140}
              width={140}
              className='rounded-full'
            />
            <div className='w-3/5 h-full flex flex-col justify-between px-4'>
              <h2 className='text-2xl'>{user.user.fullName}</h2>
              <h3 className='text-xl'>{user.user.userName}</h3>
              <div className='w-full bg-[#6A6666] rounded-xl text-center text-black self-end'>Level 5</div>
            </div>
            <div className='w-[25%] text-center'>chart</div>
          </div>
          <div className='flex-1 flex flex-col items-center'>
            <div className='w-3/4 h-[12%] rounded-t-xl bg-primecl flex items-center'>
              <Link href="/profile" className='w-1/3 text-2xl text-center h-full flex justify-center items-center border-r-2 border-segundcl'>Stats</Link>
              <Link href="/profile/achievements" className='w-1/3 text-2xl text-center h-full flex justify-center items-center border-r-2 border-segundcl'>Achievements</Link>
              <Link href="/profile/history" className='w-1/3 text-2xl text-center h-full flex justify-center items-center'>History</Link>
            </div>
            <div className='flex-1 w-full rounded-xl bg-segundcl'>
              {children}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
