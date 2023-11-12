import React from 'react'
import { FriendType, useRooms } from './useRooms';
import { userType } from '@/context/userContext';

interface RoomInfoProps {
	friends: FriendType[] | null;
	rid: string;
	user: userType | null | undefined;
}

export const useRoomInfo = ({friends, rid, user}: RoomInfoProps) => {

	let visible, id = "", role = "USER", r_name, r_id, dm;

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
