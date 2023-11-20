"use client";

import Chatbar from "@/components/Chatbar";
import { useEffect, useState } from "react";
import { FriendType } from "@/hooks/useRooms";
import { MdGroupAdd } from "react-icons/md";
import Link from "next/link";
import { useRooms } from "@/hooks/useRooms";
import { getTime } from '@/components/getTime';


export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [roomDiv, SetRoomDiv] = useState(false);
	const [friends, setFriends] = useState<FriendType[]>([]);
  const { chatbar, getUsers, getRooms } = useRooms();

  useEffect(() => {
    const fetchData = async () => {
      await getUsers(friends, setFriends);
      await getRooms(friends, setFriends);
    }
    fetchData();
  }, []);
	if (friends) {
		friends.forEach((friend) => {
			if (!friend.lastMessageDate)
				friend.lastMessageDate = "just created"
			else {
				const Date1 = new Date(friend.lastMessageDate);
				const Date2 = new Date();
				const time = getTime(Date1, Date2);

				if (time.minutes < 1)
					friend.lastMessageDate = "few seconds ago";
				else if (time.hours < 1) {
					if (time.minutes == 1)
						friend.lastMessageDate = String(time.minutes) + " minute ago";
					else
						friend.lastMessageDate = String(time.minutes) + " minutes ago";
				}
				else if (time.days < 1) {
					if (time.hours == 1)
						friend.lastMessageDate = String(time.hours) + " hour ago";
					else
						friend.lastMessageDate = String(time.hours) + " hours ago";
				}
				else if (time.weeks < 1) {
					if (time.days == 1)
						friend.lastMessageDate = "yesterday";
					else
						friend.lastMessageDate = String(time.days) + " days ago";
				}
				else if (time.months < 1) {
					if (time.weeks == 1)
						friend.lastMessageDate = String(time.weeks) + " week ago";
					else
						friend.lastMessageDate = String(time.weeks) + " weeks ago";
				}
				else if (time.months > 1) {
					if (time.months == 1)
						friend.lastMessageDate = String(time.months) + " month ago";
					else
						friend.lastMessageDate = String(time.months) + " months ago";
				}
			}
		})
	}

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
        {friends && friends.length > 0 &&
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
