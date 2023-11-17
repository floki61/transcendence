"use client";

import axios from "axios";
import { ChatType } from "@/hooks/useChat";
import { userType } from "@/context/userContext";
import { useRouter } from "next/navigation";

export interface ConvoProps {
  picture: string;
  name: string | undefined;
  status: string;
  chat: ChatType[] | undefined;
  visibility: string;
  input: any;
  user: userType | undefined | null;
  rid: string | undefined,
}

const JoinRooms: React.FC<ConvoProps> = ({ picture, name, status, chat, visibility, input, user, rid }) => {
  const router = useRouter()
  const joinGroup = async () => {
      let password;
      if (input && input.current)
        password = input.current.value;
      console.log(user?.id, rid, password);
      try {
        const res = await axios.post(
          "http://localhost:4000/chat/joinRoom",
          {
            password,
            uid: user?.id,
            rid,
          },
          {
            withCredentials: true,
          }
        );
        console.log(res.data);
        router.push("/chat");

      } catch (error) {
        console.log("Join group failed", error);
      }
  };

  const handleKeyDown = (event: any) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      joinGroup();
    }
  }

  if (visibility === "PROTECTED") {
      return (
        <div className="p-48 h-full w-full">
          <div className="bg-quatrocl rounded-xl h-full w-full p-4 flex flex-col gap-4 items-center justify-evenly">
            <h1 className="text-segundcl text-2xl text-center px-8">
              This room is protected, you need to enter the password in order to
              join the room
            </h1>
            <input
              placeholder="Password"
              type="text"
              className="p-3 pl-4 rounded-xl bg-terserocl placeholder-slate-400 text-lg outline-none border font-light w-3/4"
              ref={input}
              onKeyDown={handleKeyDown}
            />
            <button
              className="border-2 rounded-xl w-1/3 h-[15%] bg-segundcl cursor-pointer transition ease-in-out delay-150 hover:scale-105 duration-300"
              onClick={joinGroup}
            >
              JOIN
            </button>
          </div>
        </div>
      );
  }
  else if (visibility === "PUBLIC") {
      return (
        <div className="h-full w-full p-48">
          <div className="bg-quatrocl rounded-xl h-full w-full p-4 flex flex-col items-center justify-evenly">
            <h1 className="text-segundcl text-2xl text-center px-8">
              This room is public, Click on join to be part of the room
            </h1>
            <button
              className="border-2 rounded-xl w-1/3 h-[15%] bg-segundcl cursor-pointer transition ease-in-out delay-150 hover:scale-105 duration-300"
              onClick={joinGroup}
            >
              JOIN
            </button>
          </div>
        </div>
      )
  }

};

export default JoinRooms;
