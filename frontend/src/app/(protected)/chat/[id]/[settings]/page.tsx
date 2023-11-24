"use client"

import React, { useEffect } from 'react'
import { useState } from 'react';
import axios from 'axios';
import { userType } from '@/context/userContext';
import { ChatFeatures } from '@/components/ChatFeatures';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

export default function Page({params} : {params: any}) {
	
  const [users, SetUsers] = useState<userType[]>();
  const [participants, SetParticipants] = useState<userType[]>();
  const [selected, SetSelected] = useState<string[]>([""]);
  const router = useRouter();
  const feature = params.settings;

  useEffect(() => {
    const getParticipants = async () => {
      try {
        const res = await axios.post("http://localhost:4000/chat/getParticipants", {rid: params.id},{
          withCredentials: true,
        })
        const data = res.data;
        SetParticipants(data.map((user: any) => user));
      } catch (error) {
        toast.error("An error occured, make a quick refresh");
      }
    }
    getParticipants();
  }, [params.id]);

  useEffect(() => {
    const getAllUsers = async () => {
      try {
        const res = await axios.post("http://localhost:4000/chat/participantNotInRoom", {rid: params.id},{
          withCredentials: true,
        })
        const data = res.data;
        SetUsers(data.map((user: any) => user));
      } catch (error) {
        toast.error("An error occured, make a quick refresh");
      }
    }
    getAllUsers();
  }, [params.id]);

  if (feature === "viewParticipants") {
    return (
      <div className='p-8 h-full w-full'>
        <ChatFeatures
          users={participants}
          title="Room Participants"
          checkbox={false}
          selected={selected}
          rid={params.id}
          mode="view"
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
          mode="add"
        />
      </div>
    )
  }
  else if (feature === "muteParticipant") {
    return (
      <div className='p-8 h-full w-full'>
        <ChatFeatures
          users={participants}
          title = "Mute participants in the room"
          button='Mute'
          checkbox={true}
          selected={selected}
          rid={params.id}
          SetSelected={SetSelected}
          mode="mute"
        />
      </div>
    )
  }
  else if (feature === "banParticipant") {
    return (
      <div className='p-8 h-full w-full'>
        <ChatFeatures
          users={participants}
          title = "Ban Participants in the room"
          button='Ban'
          checkbox={true}
          selected={selected}
          rid={params.id}
          SetSelected={SetSelected}
          mode="ban"
        />
      </div>
    )
  }
  else if (feature === "unbanParticipant") {
    return (
      <div className='p-8 h-full w-full'>
        <ChatFeatures
          users={participants}
          title = "UnBan Participants in the room"
          button='UnBan'
          checkbox={true}
          selected={selected}
          rid={params.id}
          SetSelected={SetSelected}
          mode="unban"
        />
      </div>
    )
  }
  else if (feature === "kickParticipant") {
    return (
      <div className='p-8 h-full w-full'>
        <ChatFeatures
          users={participants}
          title = "Kick Participants off the room"
          button='Kick'
          checkbox={true}
          selected={selected}
          rid={params.id}
          SetSelected={SetSelected}
          mode="kick"
        />
      </div>
    )
  }
  else if (feature === "changeRoomName") {
    return (
      <div className='p-8 h-full w-full'>
        <ChatFeatures
          users={participants}
          title = "Type in the new room name"
          button='Change'
          checkbox={false}
          selected={selected}
          rid={params.id}
          SetSelected={SetSelected}
          mode="changeName"
        />
      </div>
    )
  }
  else if (feature === "changeRoomVisibility") {
    return (
      <div className='p-8 h-full w-full'>
        <ChatFeatures
          users={participants}
          title = "Change the visibility of the room"
          button='Change'
          checkbox={false}
          selected={selected}
          rid={params.id}
          SetSelected={SetSelected}
          mode="changeVisible"
        />
      </div>
    )
  }
  else if (feature === "changeRoomPasswd") {
    return (
      <div className='p-8 h-full w-full'>
        <ChatFeatures
          users={participants}
          title = "Change the password of the room"
          button='Change'
          checkbox={false}
          selected={selected}
          rid={params.id}
          SetSelected={SetSelected}
          mode="changePasswd"
        />
      </div>
    )
  }
  else if (feature === "giveAdmin") {
    return (
      <div className='p-8 h-full w-full'>
        <ChatFeatures
          users={participants}
          title = "Give Admin to a Participant in the room"
          button='Give'
          checkbox={true}
          selected={selected}
          rid={params.id}
          SetSelected={SetSelected}
          mode="give"
        />
      </div>
    )
  }
  else if (feature === "deleteRoom") {
    return (
      <div className='p-8 h-full w-full'>
        <ChatFeatures
          users={participants}
          title = "Are you sure that you want to delete this room ? this action will remove it permanently !"
          button='Delete'
          checkbox={true}
          selected={selected}
          rid={params.id}
          SetSelected={SetSelected}
          mode="delete"
        />
      </div>
    )
  }
  else if (feature === "leaveRoom") {
    return (
      <div className='p-8 h-full w-full'>
        <ChatFeatures
          users={participants}
          title = "Are you sure that you want to leave this room ? this action will prohibit you from reaching this room !"
          button='Leave'
          checkbox={true}
          selected={selected}
          rid={params.id}
          SetSelected={SetSelected}
          mode="leave"
        />
      </div>
    )
  }
  else {
    router.push("/not-found");
  }
}
