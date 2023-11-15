"use client";

import Image from "next/image";
import Chatmsg from "@/components/Chatmsg";
import { useChat } from "@/hooks/useChat";
import { ChatSettings } from "@/components/ChatSettings";
import { IoSend } from "react-icons/io5";
import { useRooms } from "@/hooks/useRooms";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useLayoutEffect } from "react";
import JoinRooms from "@/components/JoinRooms";
import { useRoomInfo } from "@/hooks/useRoomInfo";

const Convo = ({ params }: { params: any }) => {
  const {
    showDiv,
    SetShowDiv,
    user,
    chat,
    SetChat,
    image,
    name,
    input,
    sendMsg,
    getMessages,
    socket,
    handleKeyDown,
  } = useChat(params.id);
  const { friends, chatbar } = useRooms();
  const {visible, id, role, r_name, r_id, dm} = useRoomInfo({friends: friends, rid: params.id, user: user.user});
  const lastMeassgeRef = useRef<any>(null);
  const pathName = usePathname();
  let friendId;

  useEffect(() => {
    getMessages(pathName.split("/").at(-1) as string);
  }, [pathName, socket]);

  useEffect(() => {
    if (!socket) return;
    const messageHandler = (data: any) => {
      SetChat((prevChat) => [...prevChat!, data]);
    };

    socket.on("message", messageHandler);

    // Clean up the event listener
    return () => {
      socket.off("message", messageHandler);
    };
  }, [socket]);

  useLayoutEffect(() => {
    if (lastMeassgeRef.current) {
      lastMeassgeRef.current.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "start",
      });
    }
  }, [pathName, socket, lastMeassgeRef.current]);

  if (chat) {
    chat.map((chatie) => {
      if (chatie.user?.uid !== user.user?.id)
        friendId = chatie.user?.uid;
    })
  }

  if (dm) {
    return (
      <div className="h-full w-full flex">
        <div className="h-full flex-1 flex flex-col justify-between">
          <div className="px-4 py-2 flex items-center justify-between bg-primecl">
            <div className="flex items-center gap-4">
              <Image
                src={(image as string) || "/placeholder.jpg"}
                alt={"friend pic"}
                width={40}
                height={40}
                className="rounded-full"
              />
              <div>
                <h2 className="text-xl">{name || r_name}</h2>
                <h3 className="text-sm font-light lowercase">{user.user?.status}</h3>
              </div>
            </div>
            <div className="flex gap-8 relative w-[17%] h-full items-center justify-end">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 32 32"
                fill="none"
                className="cursor-pointer hover:bg-slate-600 w-[21%] h-3/4 rounded-full"
                onClick={() => SetShowDiv(!showDiv)}
              >
                <path
                  d="M19 26C19 26.7956 18.6839 27.5587 18.1213 28.1213C17.5587 28.6839 16.7956 29 16 29C15.2044 29 14.4413 28.6839 13.8787 28.1213C13.3161 27.5587 13 26.7956 13 26C13 25.2044 13.3161 24.4413 13.8787 23.8787C14.4413 23.3161 15.2044 23 16 23C16.7956 23 17.5587 23.3161 18.1213 23.8787C18.6839 24.4413 19 25.2044 19 26ZM19 16C19 16.7956 18.6839 17.5587 18.1213 18.1213C17.5587 18.6839 16.7956 19 16 19C15.2044 19 14.4413 18.6839 13.8787 18.1213C13.3161 17.5587 13 16.7956 13 16C13 15.2044 13.3161 14.4413 13.8787 13.8787C14.4413 13.3161 15.2044 13 16 13C16.7956 13 17.5587 13.3161 18.1213 13.8787C18.6839 14.4413 19 15.2044 19 16ZM19 6C19 6.79565 18.6839 7.55871 18.1213 8.12132C17.5587 8.68393 16.7956 9 16 9C15.2044 9 14.4413 8.68393 13.8787 8.12132C13.3161 7.55871 13 6.79565 13 6C13 5.20435 13.3161 4.44129 13.8787 3.87868C14.4413 3.31607 15.2044 3 16 3C16.7956 3 17.5587 3.31607 18.1213 3.87868C18.6839 4.44129 19 5.20435 19 6Z"
                  fill="#CAD2D5"
                />
              </svg>
              {showDiv && <ChatSettings dm={dm} role={role} id={params.id} friendId={friendId}/>}
            </div>
          </div>
          <div className="flex flex-col flex-1 bg-segundcl py-2 overflow-scroll">
            {user.user &&
              chat &&
              chat.map((chatie, index) => (
                <div
                  className={`${
                    user.user?.id === chatie.user?.uid ||
                    user.user?.id === chatie.uid
                      ? "self-end my-1 mx-2"
                      : "my-1 mx-2 self-start"
                  } ${chatie.msg.length > 50 ? "w-[40%]" : ""}`}
                  key={index}
                >
                  <Chatmsg
                    text={chatie.msg}
                    time={chatie.msgTime.substring(11, 16)}
                    className={`flex justify-between ${
                      user.user?.id === chatie.user?.uid ||
                      user.user?.id === chatie.uid
                        ? "self-end bg-primecl rounded-s-lg rounded-br-lg"
                        : "bg-quatrocl rounded-e-lg rounded-bl-lg self-start"
                    }`}
                  />
                </div>
              ))}
            <div ref={lastMeassgeRef}></div>
          </div>
          <div className="py-4 bg-primecl w-full flex items-center justify-center gap-8">
            <input
              key={params.id}
              type="text"
              ref={input}
              onKeyDown={handleKeyDown}
              placeholder="Type a message"
              className="bg-terserocl rounded-md p-2 px-4 w-5/6 outline-none"
            />
            <button type="submit" onClick={sendMsg}>
              <IoSend />
            </button>
          </div>
        </div>
      </div>
    );
  }
  else if (!dm) {
    if (id) {
      return (
        <div
          className="h-full w-full flex"
          onClick={() => {
          if (showDiv) SetShowDiv(false);
        }}
      >
        <div className="h-full flex-1 flex flex-col justify-between">
          <div className="px-4 py-2 flex items-center justify-between bg-primecl">
            <div className="flex items-center gap-4">
              <Image
                src={"/placeholder.jpg"}
                alt={"friend pic"}
                width={40}
                height={40}
                className="rounded-full"
              />
              <div>
                <h2 className="text-xl">{r_name}</h2>
                <h3 className="text-sm font-light lowercase">{visible}</h3>
              </div>
            </div>
            <div className="flex gap-8 relative w-[17%] h-full items-center justify-end">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 32 32"
                fill="none"
                className="cursor-pointer hover:bg-slate-600 w-[21%] h-3/4 rounded-full"
                onClick={() => SetShowDiv(!showDiv)}
              >
                <path
                  d="M19 26C19 26.7956 18.6839 27.5587 18.1213 28.1213C17.5587 28.6839 16.7956 29 16 29C15.2044 29 14.4413 28.6839 13.8787 28.1213C13.3161 27.5587 13 26.7956 13 26C13 25.2044 13.3161 24.4413 13.8787 23.8787C14.4413 23.3161 15.2044 23 16 23C16.7956 23 17.5587 23.3161 18.1213 23.8787C18.6839 24.4413 19 25.2044 19 26ZM19 16C19 16.7956 18.6839 17.5587 18.1213 18.1213C17.5587 18.6839 16.7956 19 16 19C15.2044 19 14.4413 18.6839 13.8787 18.1213C13.3161 17.5587 13 16.7956 13 16C13 15.2044 13.3161 14.4413 13.8787 13.8787C14.4413 13.3161 15.2044 13 16 13C16.7956 13 17.5587 13.3161 18.1213 13.8787C18.6839 14.4413 19 15.2044 19 16ZM19 6C19 6.79565 18.6839 7.55871 18.1213 8.12132C17.5587 8.68393 16.7956 9 16 9C15.2044 9 14.4413 8.68393 13.8787 8.12132C13.3161 7.55871 13 6.79565 13 6C13 5.20435 13.3161 4.44129 13.8787 3.87868C14.4413 3.31607 15.2044 3 16 3C16.7956 3 17.5587 3.31607 18.1213 3.87868C18.6839 4.44129 19 5.20435 19 6Z"
                  fill="#CAD2D5"
                />
              </svg>
              {showDiv && <ChatSettings role={role} id={params.id} />}
            </div>
          </div>
          <div className="flex flex-col flex-1 bg-segundcl py-2 overflow-scroll">
            {user.user &&
              chat &&
              chat.map((chatie, index) => (
                <div
                  className={`${
                    user.user?.id === chatie.user?.uid ||
                    user.user?.id === chatie.uid
                      ? "self-end my-1 mx-2"
                      : "my-1 mx-2 self-start"
                  } ${chatie.msg.length > 50 ? "w-[40%]" : ""}`}
                  key={index}
                >
                  <Chatmsg
                    text={chatie.msg}
                    time={chatie.msgTime.substring(11, 16)}
                    className={`flex justify-between ${
                      user.user?.id === chatie.user?.uid ||
                      user.user?.id === chatie.uid
                        ? "self-end bg-primecl rounded-s-lg rounded-br-lg"
                        : "bg-quatrocl rounded-e-lg rounded-bl-lg self-start"
                    }`}
                  />
                </div>
              ))}
            <div ref={lastMeassgeRef}></div>
          </div>
          <div className="py-4 bg-primecl w-full flex items-center justify-center gap-8">
            <input
              key={params.id}
              type="text"
              ref={input}
              onKeyDown={handleKeyDown}
              placeholder="Type a message"
              className="bg-terserocl rounded-md p-2 px-4 w-5/6 outline-none"
            />
            <button type="submit" onClick={sendMsg}>
              <IoSend />
            </button>
          </div>
        </div>
        </div>
      )
    }
    else if (!id) {
      return (
        <JoinRooms
          picture={image as string}
          name={name}
          status="Online"
          chat={chat}
          visibility={visible as any}
          id={id as any}
          input={input}
          user={user.user}
          rid={r_id}
        />
      );
    }
  }
};

export default Convo;
