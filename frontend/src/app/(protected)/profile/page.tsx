"use client"

import React from 'react'
import { useContext } from 'react'
import { UserContext } from '@/context/userContext';
import Image from 'next/image';

export default function page() {

  const user = useContext(UserContext);

  return (
    <div className='h-full w-full p-10 overflow-hidden'>
      {user.user && (
        <div className='h-full w-full flex flex-col gap-8'>
          <div className='flex gap-4 h-[25%]'>
            <Image
              src={"/oel-berh.jpeg"}
              alt={"profile pic"}
              height={150}
              width={150}
              className='rounded-full'
            />
            <div className='w-3/5 flex flex-col justify-evenly px-4'>
              <h2 className='text-2xl'>{user.user.fullName}</h2>
              <h3 className='text-xl'>{user.user.userName}</h3>
              <div className='w-full bg-[#6A6666] rounded-xl text-center text-black self-end'>Level 5</div>
            </div>
            <div className='w-[25%] text-center'>chart</div>
          </div>
          <div className='flex-1 flex flex-col items-center'>
            <div className='w-3/4 h-[12%] rounded-t-xl bg-primecl flex items-center'>
              <h3 className='w-1/3 text-2xl text-center h-full flex justify-center items-center border-r-2 border-segundcl'>Stats</h3>
              <h3 className='w-1/3 text-2xl text-center h-full flex justify-center items-center border-r-2 border-segundcl'>Achievements</h3>
              <h3 className='w-1/3 text-2xl text-center h-full flex justify-center items-center'>History</h3>
            </div>
            <div className='flex-1 w-full rounded-xl bg-segundcl'>
              <div>
                <h4>Mode</h4>
                <h4>MP</h4>
                <h4>W</h4>
                <h4>L</h4>
                <h4>GS</h4>
                <h4>GC</h4>
                <h4>Form</h4>
              </div>
              <div></div>
              <div></div>
              <div></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
