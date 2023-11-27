"use client";
import React from "react";
import { useState, createContext, useContext, useEffect } from "react";
import { io, Socket } from "socket.io-client";

interface ChatSocketProp {
  socket: Socket | null;
}

const ChatContext = createContext<ChatSocketProp>({
  socket: null,
});

export const useChat = () => useContext(ChatContext);

export const ChatProvider = ({ children }: { children: React.ReactNode }) => {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const newSocket = io(process.env.NEXT_PUBLIC_SERVER_URL + "/chat", {
      withCredentials: true,
    });
    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, []);

  return (
    <ChatContext.Provider value={{ socket }}>{children}</ChatContext.Provider>
  );
};
