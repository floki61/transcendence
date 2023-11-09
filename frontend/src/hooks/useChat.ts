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

export const useChat = (
  rid: any,
) => {
  const user = useContext(UserContext);
  const [chat, SetChat] = useState<ChatType[]>();
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
          SetChat(updatedChat);
        }
      } catch (error) {
        console.log("getMessages failed");
      }
    }
    getMessages();

  }, []);

  useEffect(() => {
    if (!socket) return;
    const messageHandler = (data: any) => {
      SetChat((prevChat) => [...prevChat!, data]);
    };
  
    socket.on('message', messageHandler);
  
    // Clean up the event listener
    return () => {
      socket.off('message', messageHandler);
    };
  }, []);
  

  const getName = async () => {
    if (chat && chat[0]) {
      let id;
      chat.map((chatie) => {
        if (chatie.user?.uid != user.user?.id) 
          id = chatie.user?.uid;
      })
      console.log(id);
      try {
        const res = await axios.post("http://localhost:4000/getUserNameWithId", { id }, {
          withCredentials: true,
        })
        SetName(res.data);
      } catch (error) {
        console.log("error fetching username")
      }
      try {
        const res = await axios.post("http://localhost:4000/getPictureWithId", { id }, {
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
  }

  const sendMsg = (e: any) => {
    if (chat && chat[0])
      socket?.emit('createChat', {
        "rid": chat[0].rid,
        "uid": user.user?.id,
        "msg": input,
      });
    SetInput('');
  }

  return { sendMsg, handleInput, user, input, chat, image, name, showDiv, SetShowDiv }
}