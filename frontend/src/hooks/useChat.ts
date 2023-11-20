"use client";

import Audio from "@/components/Audio";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useChat as chatSocket } from "@/context/chatSocket";
import { useContext } from "react";
import { UserContext } from "@/context/userContext";

export interface ChatType {
  user: {
    createdAt: string;
    id: string;
    isBanned: boolean;
    isMuted: boolean;
    isOnline: boolean;
    rid: string;
    role: string;
    uid: string;
    updateAt: string;
    picture: string;
  };
  createdAt: string;
  id: string;
  msg: string;
  msgTime: string;
  rid: string;
  updatedAt: string;
  userId: string;
  uid: string;
}

export const useChat = (id : string) => {
  const user = useContext(UserContext);
  const [chat, SetChat] = useState<ChatType[]>([]);
  const [image, SetImage] = useState<string>();
  const [name, SetName] = useState<string>();
  const [showDiv, SetShowDiv] = useState(false);
  const input = useRef<HTMLInputElement>(null);
  const { socket } = chatSocket();
  let rid = id;

  const getMessages = async (roomId: string) => {
    if (!socket) return;
    if (roomId) {
      try {
        console.log("calling get mesages for ", roomId);
        const res = await axios.post(
          "http://localhost:4000/chat/getMessages",
          {
            rid: roomId,
          },
          {
            withCredentials: true,
          }
        );
        const data = res.data;
        console.log("oki", data);
        // if (data.length > 0) {
          // updatedChat = data.map((item: any) => item);
          SetChat(data.map((item: any) => item));
        // }
      } catch (error) {
        console.log("getMessages failed");
      }
    }
  };

  const getName = async () => {
    if (chat && chat[0]) {
      let id;
      chat.map((chatie) => {
        if (chatie.user) {
          if (chatie.user.uid != user.user?.id) id = chatie.user.uid;
        } else if (chatie.uid != user.user?.id) id = chatie.uid;
      });
      // console.log(id);
      try {
        const res = await axios.post(
          "http://localhost:4000/getUserNameWithId",
          { id },
          {
            withCredentials: true,
          }
        );
        SetName(res.data);
      } catch (error) {
        console.log("error fetching username");
      }
      try {
        const res = await axios.post(
          "http://localhost:4000/getPictureWithId",
          { id },
          {
            withCredentials: true,
          }
        );
        SetImage(res.data);
      } catch (error) {
        console.log("error fetching picture");
      }
    }
  };
  getName();

  const handleKeyDown = (event: any) => {
      if (event.key === 'Enter') {
        event.preventDefault();
        sendMsg();
      }
  }

  const sendMsg = () => {
    console.log("ggfd : ", rid);
    if (input.current) {
      socket?.emit("createChat", {
        rid,
        uid: user.user?.id,
        msg: input.current.value,
      });
      input.current.value = '';
    }
  };

  return {
    sendMsg,
    user,
    input,
    chat,
    SetChat,
    image,
    name,
    showDiv,
    SetShowDiv,
    getMessages,
    socket,
    handleKeyDown,
  };
};