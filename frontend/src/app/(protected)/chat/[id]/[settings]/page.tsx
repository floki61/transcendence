"use client"

import React, { useEffect } from 'react'
import { useState } from 'react';
import axios from 'axios';
import { userType } from '@/context/userContext';
import Button from '@/components/Button';
import { Participant } from '@/components/Participant';
import { ChatFeatures } from '@/components/ChatFeatures';

export default function page({params} : {params: any}) {
	
  const [users, SetUsers] = useState<userType[]>();
  const [selected, SetSelected] = useState<string[]>([""]);
  const feature = params.settings;

  // console.log(feature);

  useEffect(() => {
    const getParticipants = async () => {
      try {
        const res = await axios.post("http://localhost:4000/chat/getParticipants", {rid: params.id},{
          withCredentials: true,
        })
        const data = res.data;
        console.log(res.data);
        SetUsers(data.map((user: any) => user));
      } catch (error) {
        console.log("add Participant failed");
      }
    }
    getParticipants();
  }, []);

  if (feature === "viewParticipants") {
    return (
      <div className='p-8 h-full w-full'>
        <ChatFeatures
          users={users}
          title="Room Participants"
          checkbox={false}
          selected={selected}
          rid={params.id}
        />
      </div>
    )
  }
  else if (feature === "addParticipants") {
    return (
      <div className='p-8 h-full w-full'>
        <ChatFeatures
          users={users}
          title = "Add Participants to the room"
          button='Invite'
          checkbox={true}
          selected={selected}
          rid={params.id}
          SetSelected={SetSelected}
        />
      </div>
    )
  }
  else if (feature === "muteParticipant") {
    return (
      <div className='p-8 h-full w-full'>
        <ChatFeatures
          users={users}
          title = "Mute participants in the room"
          button='Mute'
          checkbox={true}
          selected={selected}
          rid={params.id}
          SetSelected={SetSelected}
        />
      </div>
    )
  }
  else if (feature === "banParticipant") {
    return (
      <div className='p-8 h-full w-full'>
        <ChatFeatures
          users={users}
          title = "Ban Participants in the room"
          button='Ban'
          checkbox={true}
          selected={selected}
          rid={params.id}
          SetSelected={SetSelected}
        />
      </div>
    )
  }
  else if (feature === "kickParticipant") {
    return (
      <div className='p-8 h-full w-full'>
        <ChatFeatures
          users={users}
          title = "Kick Participants off the room"
          button='Kick'
          checkbox={true}
          selected={selected}
          rid={params.id}
          SetSelected={SetSelected}
        />
      </div>
    )
  }

}
