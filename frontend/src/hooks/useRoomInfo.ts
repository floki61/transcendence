import React from 'react'
import { FriendType, useRooms } from './useRooms';
import { userType } from '@/context/userContext';
import { useState, useEffect } from 'react';

interface RoomInfoProps {
	rid: string;
	user: userType | null | undefined;
}

export const useRoomInfo = ({rid, user}: RoomInfoProps) => {
	const [friends, setFriends] = useState<FriendType[]>([]);
	const { getUsers, getRooms } = useRooms();
	let visible, id = "", role = "USER", r_name, r_id, dm;
	console.log("Hello from room info");

	useEffect(() => {
		const fetchData = async () => {
		  await getUsers(friends, setFriends);
		  await getRooms(friends, setFriends);
		}
		fetchData();
	  }, [rid]);

	if (friends) {
		friends.map((room: any) => {
			if (room.id === rid) {
				if (room.participants) {
				for (let member of room.participants) {
					if (member.uid === user?.id) {
						id = member.uid;
						role = member.role;
					}
				}
			}
			dm = room.is_DM;
			visible = room.visibility;
			r_name = room.name;
			r_id = room.id;
		}
		});
	}
	return {visible, dm, r_name, r_id, role, id};
}
