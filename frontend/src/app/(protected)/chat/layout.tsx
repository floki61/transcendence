"use client";

import Chatbar from "@/components/Chatbar";
import { useState } from "react";

import { MdGroupAdd } from "react-icons/md";
import Link from "next/link";
import { useRooms } from "@/hooks/useRooms";


export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { friends, chatbar } = useRooms();
  const [roomDiv, SetRoomDiv] = useState(false);

  return (
    <div className="flex h-full text-white">
      <div className="h-full w-1/3 flex flex-col items-center border-r-2 border-primecl overflow-scroll">
        <div className="flex w-full justify-between items-center my-2 px-4">
          <Link
            href="/chat/createroom"
            className="flex gap-3 rounded-lg hover:bg-quatrocl p-2 items-center"
            onClick={() => SetRoomDiv(!roomDiv)}
          >
            <div className="">
              <MdGroupAdd size={22} />
            </div>
            Create Room
          </Link>
        </div>
        {friends &&
          friends.map((friend, index) => (
            <Link
              key={index}
              href={`/chat/${friend.id}`}
              className="block w-full pl-1"
            >
              <Chatbar
                name={friend.name}
                text={friend.lastMessage}
                time={friend.lastMessageDate}
                image={friend.picture}
                visible={friend.visibility}
                dm={friend.is_DM}
              />
            </Link>
          ))}
        {!chatbar && <p>Maendakch meamn tdwi ghyrha</p>}
      </div>
      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 w-2/3">{children}</div>
      </div>
    </div>
  );
}
