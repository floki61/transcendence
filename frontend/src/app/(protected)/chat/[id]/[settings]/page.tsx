"use client"

import React, { useEffect } from 'react'
import { useState } from 'react';
import axios from 'axios';
import { userType } from '@/context/userContext';
import Button from '@/components/Button';
import { Participant } from '@/components/Participant';

export default function page() {
	
  const [users, SetUsers] = useState<userType[]>();

  useEffect(() => {
    const getParticipants = async () => {
      try {
        const res = await axios.get("http://localhost:4000/getAllUsers", {
          withCredentials: true,
        });
        const data = res.data;
        SetUsers(data.map((user: any) => user));
      } catch (error) {
        console.log("add Participant failed");
      }
    }
    getParticipants();
  }, []);


  return (
	  <div className='p-8 h-full w-full'>
      <div className='bg-segundcl rounded-lg h-full py-4 flex justify-center'>
        <section className='h-full w-1/2 flex flex-col rounded-md'>
          <h2 className='h-[10%] flex items-center justify-center capitalize bg-primecl rounded-t-md'>Add Participants to the room</h2>
          <div className='flex-1 bg-terserocl overflow-scroll'>
            {users && users.map((user, index) => 
                <div key={index} className='h-[15%] border-b-2 border-primecl'>
                  <Participant
                    name={user.userName}
                    picture={user.picture}
                  />
                </div>
            )}
          </div>
          <div className='h-[10%] flex justify-center items-center bg-primecl rounded-b-md'>
            <button type='submit' className='border w-1/3 h-1/2 rounded-lg bg-segundcl cursor-pointer  transition ease-in-out delay-150 hover:scale-105 duration-300'>
              Invite
            </button>

          </div>
        </section>
      </div>
    </div>
  )
}
