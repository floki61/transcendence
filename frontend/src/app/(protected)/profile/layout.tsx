"use client"

import React from 'react'
import { useContext } from 'react'
import { UserContext } from '@/context/userContext';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function page({children}: {children: React.ReactNode}, {params}: {params: any}) {

  const user = useContext(UserContext);
  const pathName = usePathname();

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
              <div className='w-full bg-[#6A6666] rounded-xl text-center text-black self-end'>
                Level {user.user.level}
                <div className={`bg-[#CD7F32] w-[%${user.level_P}]`}></div>
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
              <Link href="/profile" className={`${pathName === "/profile" ? 'bg-gradient-to-t from-[#000000] from-0% to-segundcl to-100% ' : ''} hover:bg-gradient-to-t hover:from-[#000000] hover:from-0% hover:to-segundcl hover:to-100% hover:rounded-tl-xl w-1/3 text-2xl text-center h-full flex justify-center items-center border-r border-segundcl`}>Stats</Link>
              <Link href="/profile/achievements" className={`${pathName === '/profile/achievements' ? 'bg-gradient-to-t from-[#000000] from-0% to-segundcl to-100% ' : ''} hover:bg-gradient-to-t hover:from-[#000000] hover:from-0% hover:to-segundcl hover:to-100% w-1/3 text-2xl text-center h-full flex justify-center items-center border-r border-segundcl`}>Achievements</Link>
              <Link href="/profile/history" className={`${pathName === '/profile/history' ? 'bg-gradient-to-t from-[#000000] from-0% to-segundcl to-100% ' : ''} hover:bg-gradient-to-t hover:from-[#000000] hover:from-0% hover:to-segundcl hover:to-100% hover:rounded-tr-xl w-1/3 text-2xl text-center h-full flex justify-center items-center`}>History</Link>
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
