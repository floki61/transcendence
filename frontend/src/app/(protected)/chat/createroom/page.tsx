"use client";

import React from "react";
import Image from "next/image";
import RoomInput from "@/components/RoomInput";
import { useState, useContext } from "react";
import axios from "axios";
import { UserContext } from "@/context/userContext";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

interface roomType {
  name?: string;
  visibility: string;
  password?: string;
  id?: string;
}

export default function page() {
  const user = useContext(UserContext);
  const [success, setSuccess] = useState(false);
  const [showDiv, setShowDiv] = useState(false);
  const [loading, setLoading] = useState(false);
  const [room, SetRoom] = useState<roomType>();
  const router = useRouter();

  const createRoom = async (e: any) => {
    setLoading(true);
    e.preventDefault();
    try {
      if (room) {
        const res = await axios.post(
          "http://localhost:4000/chat/createRoom",
          room,
          {
            withCredentials: true,
          }
        );
        toast.success("Room Created");
		router.push("/chat");
      }
    } catch (error) {
      toast.error("An error occured while creating the room");
      setLoading(false);
    }
  };

  const handleChange = (e: any) => {
    const { name, value } = e.target;

    const newRoom = { ...room, [name]: value };
    SetRoom(newRoom as roomType);
  };
  if (room && user.user) {
    room.id = user.user.id;
  }
  return (
    <div className="flex flex-col items-center gap-16 w-full h-full p-4">
      <Image
        src="/placeholder.jpg"
        alt="Room"
        height={200}
        width={200}
        className="rounded-full"
        priority
      />
      <form className="flex-1 flex flex-col justify-around items-center w-[60%] gap-4 py-4">
        <RoomInput
          holder="Room Name"
          type="text"
          onChange={handleChange}
          value={room?.name}
          name="name"
        />
        <select
          className="p-3 pl-4 rounded-xl bg-primecl placeholder-slate-400 text-lg outline-none font-light w-full"
          name="visibility"
          onChange={handleChange}
        >
          <option value="">Choose the visibility of the room</option>
          <option value="PUBLIC">Public</option>
          <option value="PROTECTED">Protected</option>
          <option value="PRIVATE">Private</option>
        </select>
        {room?.visibility === "PROTECTED" && (
          <RoomInput
            holder="Room Password"
            type="text"
            onChange={handleChange}
            value={room.password}
            name="password"
          />
        )}
        <button
		  disabled={loading}
          className={`${loading ? "bg-slate-400" : "bg-primecl"} rounded-2xl border w-1/3 self-end mt-auto h-[10%]`}
          onClick={createRoom}
        >
          Save
        </button>
      </form>
    </div>
  );
}
