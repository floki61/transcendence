"use client";

import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { userType } from "@/context/userContext";

export interface ProfileType {
  user: userType;
  level_P: number;
  barPourcentage: number;
  isfriend: string;
}

export const useFriend = (id: string) => {
  const [friend, SetFriend] = useState<ProfileType>();

  useEffect(() => {
    const getFriend = async () => {
      try {
        const res = await axios.post(
          process.env.NEXT_PUBLIC_SERVER_URL + "/getFriendProfile",
          { id },
          {
            withCredentials: true,
          }
        );
        SetFriend(res.data);
      } catch (error) {}
    };
    getFriend();
  }, [id]);

  return { friend, SetFriend };
};
