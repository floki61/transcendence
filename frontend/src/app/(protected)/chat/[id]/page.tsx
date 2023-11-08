"use client"

import Image from "next/image";
import Chatmsg from "@/components/Chatmsg";
import Audio from "@/components/Audio";
import axios from "axios";
import { useEffect, useState } from "react";
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
}

const Convo = ({ params } : {params: any}) => {

  console.log(params.id);

  const user = useContext(UserContext);
	const [chat, SetChat] = useState<ChatType[]>();
	const [image, SetImage] = useState<string>();
	const [name, SetName] = useState<string>();
	const [showDiv, SetShowDiv] = useState(false);
  
    useEffect(() => {
      const getMessages = async () => {
        try {
          const res = await axios.post("http://localhost:4000/chat/getMessages", {rid : params.id},{
            withCredentials: true
          });
          const data = res.data;
          if (data.length > 0) {
            const updatedChat = data.map((item: any) => item);
          
            SetChat(updatedChat);
          }   
        } catch (error) {
          console.log("getMessages failed");
        }
      }
      getMessages();
    }, []);
    
    const getName = async () => {
      if (chat && chat[0]) {
        try {
          const res = await axios.post("http://localhost:4000/getUserNameWithId", {id: chat[0].user.uid},{
            withCredentials: true,
          })
          console.log("res is : " , res.data);
          SetName(res.data);
        } catch (error) {
          console.log("error fetching username")
        }
        try {
          const res = await axios.post("http://localhost:4000/getPictureWithId", {id: chat[0].user.uid},{
            withCredentials: true,
          })
          console.log("res is : " , res.data);
          SetImage(res.data);
        } catch (error) {
          console.log("error fetching picture")
        }
      }  
    }
    getName();

  return (
    <div className="h-full w-full flex" onClick={() => SetShowDiv}>
      {user.user && chat && chat[0] && (
        <div className="h-full flex-1 flex flex-col justify-between">
          <div className="px-4 py-2 flex items-center justify-between bg-primecl">
            <div className="flex items-center gap-4">
              <Image
                src={image as string}
                alt={"friend pic"}
                width={40}
                height={40}
                className="rounded-full"
              />
              <div>
                <h2 className="text-xl">{name}</h2>
                <h3 className="text-sm font-light">{chat[0].user.isOnline ? "Online" : "Offline"}</h3>
              </div>
            </div>
            <div className="flex gap-8 relative w-[15%] h-full items-center justify-end">
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
              {showDiv && (
                <div className="text-white font-light border-2 border-quatrocl absolute top-10 right-3 w-full h-28 rounded-md bg-terserocl flex flex-col">
                  <p className="cursor-pointer hover:bg-segundcl rounded-t-md border-b-2 border-quatrocl w-full px-2 flex items-center h-1/3">Mute chat</p>
                  <p className="cursor-pointer hover:bg-segundcl border-b-2 border-quatrocl w-full px-2 flex items-center h-1/3">Block</p>
                  <p className="cursor-pointer hover:bg-segundcl rounded-b-md w-full px-2 flex items-center h-1/3">Invite</p>
                </div>
              )}
            </div>
          </div>
          <div className="flex flex-col place-content-end flex-1 bg-segundcl py-2 overflow-scroll">
            {user.user && chat && chat.map((chatie) => (
              <Chatmsg
                text={chatie.msg}
                time={chatie.msgTime.substring(11, 16)}
                className={`flex font-light justify-between ${user.user?.id === chatie.user.uid ? "self-end bg-primecl rounded-s-lg rounded-br-lg my-1 mx-4 w-96" : "bg-quatrocl rounded-e-lg rounded-bl-lg my-2 mx-4 w-96"}`}
              />
            ))}
          </div>
          <div className="py-4 bg-primecl w-full flex items-center justify-center gap-8">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
            >
              <g clipPath="url(#clip0_308_1197)">
                <path
                  d="M12 22.5C9.21523 22.5 6.54451 21.3938 4.57538 19.4246C2.60625 17.4555 1.5 14.7848 1.5 12C1.5 9.21523 2.60625 6.54451 4.57538 4.57538C6.54451 2.60625 9.21523 1.5 12 1.5C14.7848 1.5 17.4555 2.60625 19.4246 4.57538C21.3938 6.54451 22.5 9.21523 22.5 12C22.5 14.7848 21.3938 17.4555 19.4246 19.4246C17.4555 21.3938 14.7848 22.5 12 22.5ZM12 24C15.1826 24 18.2348 22.7357 20.4853 20.4853C22.7357 18.2348 24 15.1826 24 12C24 8.8174 22.7357 5.76516 20.4853 3.51472C18.2348 1.26428 15.1826 0 12 0C8.8174 0 5.76516 1.26428 3.51472 3.51472C1.26428 5.76516 0 8.8174 0 12C0 15.1826 1.26428 18.2348 3.51472 20.4853C5.76516 22.7357 8.8174 24 12 24Z"
                  fill="white"
                  fillOpacity="0.75"
                />
                <path
                  d="M6.42771 14.3505C6.59997 14.251 6.80468 14.2241 6.99681 14.2756C7.18894 14.3271 7.35275 14.4527 7.45221 14.625C7.91288 15.4235 8.57579 16.0866 9.37421 16.5474C10.1726 17.0082 11.0784 17.2505 12.0002 17.25C12.9221 17.2505 13.8278 17.0082 14.6262 16.5474C15.4246 16.0866 16.0875 15.4235 16.5482 14.625C16.5971 14.539 16.6625 14.4636 16.7407 14.4029C16.8189 14.3423 16.9082 14.2978 17.0037 14.2719C17.0991 14.246 17.1988 14.2392 17.2969 14.2519C17.395 14.2647 17.4896 14.2967 17.5752 14.3462C17.6609 14.3956 17.7359 14.4615 17.796 14.5401C17.8561 14.6187 17.9 14.7084 17.9253 14.804C17.9506 14.8996 17.9567 14.9993 17.9433 15.0973C17.9299 15.1953 17.8972 15.2897 17.8472 15.375C17.2549 16.4015 16.4026 17.2539 15.3762 17.8464C14.3498 18.4389 13.1854 18.7505 12.0002 18.75C10.8151 18.7505 9.65066 18.4389 8.62423 17.8464C7.59779 17.2539 6.74553 16.4015 6.15321 15.375C6.05376 15.2027 6.02681 14.998 6.07829 14.8059C6.12977 14.6138 6.25546 14.45 6.42771 14.3505ZM10.5002 9.75C10.5002 10.992 9.82821 12 9.00021 12C8.17221 12 7.50021 10.992 7.50021 9.75C7.50021 8.508 8.17221 7.5 9.00021 7.5C9.82821 7.5 10.5002 8.508 10.5002 9.75ZM16.5002 9.75C16.5002 10.992 15.8282 12 15.0002 12C14.1722 12 13.5002 10.992 13.5002 9.75C13.5002 8.508 14.1722 7.5 15.0002 7.5C15.8282 7.5 16.5002 8.508 16.5002 9.75Z"
                  fill="white"
                  fillOpacity="0.75"
                />
              </g>
              <defs>
                <clipPath id="clip0_308_1197">
                  <rect width="24" height="24" fill="white" />
                </clipPath>
              </defs>
            </svg>
            <input
              key={params.id}
              type="text"
              placeholder="Type a message"
              className="bg-terserocl rounded-md p-2 px-4 w-5/6 outline-none"
            />
            <Audio />
          </div>
        </div>
      )}
    </div>
  );
}

export default Convo;