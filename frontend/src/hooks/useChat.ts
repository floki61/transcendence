"use client"

import Audio from "@/components/Audio";
import axios from "axios";
import { useEffect, useState } from "react";
import { useChat as chatSocket } from "@/context/chatSocket";


import { useContext } from "react";
import { UserContext } from "@/context/userContext";
interface ChatType {
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

interface msgType {
  msg: string;
  uid: string;
  rid: string;
  msgTime: string;
}

export const useChat = (
  rid: any,
) => {
  const user = useContext(UserContext);
  // const [chat, SetChat] = useState<ChatType[]>();
  const [msg, SetMsg] = useState<msgType[]>();
  const [image, SetImage] = useState<string>();
  const [name, SetName] = useState<string>();
  const [showDiv, SetShowDiv] = useState(false);
  const [input, SetInput] = useState("");
  const { socket } = chatSocket();
  let updatedChat;

  useEffect(() => {
    if (!socket)
      return;
    const getMessages = async () => {
      try {
        const res = await axios.post("http://localhost:4000/chat/getMessages", rid, {
          withCredentials: true
        });
        const data = res.data;
        if (data.length > 0) {
          updatedChat = data.map((item: any) => item);
          // SetChat(updatedChat);
          SetMsg(updatedChat);
        }
      } catch (error) {
        console.log("getMessages failed");
      }
    }
    getMessages();

  }, []);

  useEffect(() => {
    if (!socket)
      return;
    socket.on('message', (data) => {
      console.log({ data, msg });
      SetMsg(p => [...p!, data]);
    });
  }, [socket]);

  const getName = async () => {
    if (msg && msg[0]) {
      console.log("msg : ", msg);
      try {
        const res = await axios.post("http://localhost:4000/getUserNameWithId", { id: msg[0].uid }, {
          withCredentials: true,
        })
        SetName(res.data);
      } catch (error) {
        console.log("error fetching username")
      }
      try {
        const res = await axios.post("http://localhost:4000/getPictureWithId", { id: msg[0].uid }, {
          withCredentials: true,
        })
        SetImage(res.data);
      } catch (error) {
        console.log("error fetching picture")
      }
    }
  }
  getName();

  const handleInput = (e: any) => {
    SetInput(e.target.value);
    console.log("input : ", input);
  }

  const sendMsg = (e: any) => {
    if (msg && msg[0])
      socket?.emit('createChat', {
        "rid": msg[0].rid,
        "uid": user.user?.id,
        "msg": input,
      });
    SetInput('');
  }

  return { sendMsg, handleInput, user, input, msg, image, name, showDiv, SetShowDiv }
}