"use client";

import Image from "next/image";
import { useContext, useEffect, useState } from "react";
import { InviteType } from "./user/[id]/layout";
import axios from "axios";
import Link from "next/link";
import { NotifBar } from "@/components/Notifications/NotifBar";
import { UserContext } from "@/context/userContext";

export default function Home() {
  const [invites, SetInvite] = useState<InviteType[]>([]);
  const user = useContext(UserContext);

  useEffect(() => {
    const getFriendRequest = async () => {
      try {
        const res = await axios.get("http://localhost:4000/getFriendRequests", {
          withCredentials: true,
        });
        console.log("success", res.data);
        SetInvite(res.data);
      } catch (error) {
        console.log("error");
      }
    };
    getFriendRequest();
  }, []);

  return (
    <div className="text-center h-full w-full flex flex-col justify-between px-4 py-2">
      <div className=" h-[60%] flex justify-around">
        <div className="w-[70%] rounded-2xl flex flex-col bg-[#020C0E]">
          <div className="h-[15%] flex items-center bg-gradient-to-t from-[#0B2931] from-0% to-[#020C0E] to-20% rounded-t-xl">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="60"
              height="60"
              viewBox="0 0 90 88"
              fill="none"
            >
              <path
                d="M44.9999 33C48.7499 33 59.5311 23.8333 65.1561 34.8333C70.7811 45.8333 69.3749 60.5 65.6249 60.5C56.2499 60.5 61.8749 51.3333 44.9999 51.3333C28.1249 51.3333 33.7499 60.5 24.3749 60.5C20.6249 60.5 19.2187 45.8333 24.8437 34.8333C30.4687 23.8334 41.2499 33 44.9999 33ZM31.8749 37.125V40.3334H28.5936V44H31.8749V47.2084H35.6249V44H38.9062V40.3334H35.6249V37.125H31.8749ZM53.4374 39.4167C52.4018 39.4167 51.5623 40.2375 51.5623 41.25C51.5623 42.2626 52.4018 43.0834 53.4374 43.0834C54.4729 43.0834 55.3124 42.2626 55.3124 41.25C55.3124 40.2375 54.4729 39.4167 53.4374 39.4167ZM57.1874 36.2083C56.1518 36.2083 55.3124 37.0291 55.3124 38.0417C55.3124 39.0542 56.1518 39.875 57.1874 39.875C58.2229 39.875 59.0624 39.0542 59.0624 38.0417C59.0624 37.0291 58.2229 36.2083 57.1874 36.2083ZM57.1874 43.0833C56.1518 43.0833 55.3124 43.9041 55.3124 44.9167C55.3124 45.9292 56.1518 46.75 57.1874 46.75C58.2229 46.75 59.0624 45.9292 59.0624 44.9167C59.0624 43.9041 58.2229 43.0833 57.1874 43.0833ZM60.9374 39.4167C59.9019 39.4167 59.0624 40.2374 59.0624 41.25C59.0624 42.2626 59.9019 43.0833 60.9374 43.0833C61.973 43.0833 62.8124 42.2626 62.8124 41.25C62.8124 40.2374 61.973 39.4167 60.9374 39.4167Z"
                fill="#001E28"
                stroke="white"
                strokeWidth="2.10526"
                strokeLinejoin="round"
              />
            </svg>
            <h2 className="text-white text-xl">QUICK GAME</h2>
          </div>
          <div className="flex-1 flex w-full">
            <div className="w-[60%]">
              <Image
                src="/quick game.jpeg"
                alt="default mode"
                width={500}
                height={500}
                className="h-full w-full object-cover rounded-bl-xl"
                priority
              />
            </div>
            <div className="flex flex-col items-center justify-around px-4 w-[40%] bg-gradient-to-t from-[#0B2931] from-0% to-[#020C0E] to-10% rounded-br-xl border-l-4 border-segundcl">
              <h3 className="text-3xl">START A GAME NOW</h3>
              <p className="text-xl px-8">
                Play a quick game versus a random opponent on the default mode
              </p>
              <Link
                href={"/game?type=Bot"}
                className="border flex items-center justify-center border-white text-center rounded-3xl w-[40%] h-12 opacity-95 cursor-pointer bg-primecl shadow-[0px 4px 4px 0px rgba(0, 0, 0, 0.25)] transition ease-in-out delay-150 hover:scale-105 duration-300"
              >
                Play
              </Link>
            </div>
          </div>
        </div>
        <div className="w-[25%] flex flex-col rounded-2xl bg-[#020C0E]">
          <div className="h-[15%] flex items-center justify-center text-xl rounded-t-2xl bg-gradient-to-t from-[#0B2931] from-0% to-[#020C0E] to-20%">
            Notifications
          </div>
          <div className="overflow-scroll flex-1 flex flex-col w-full rounded-b-2xl bg-gradient-to-t from-[#0B2931] from-0% to-[#020C0E] to-10%">
            {user &&
              invites &&
              invites.map((invite, index) => (
                <div key={index} className="w-full h-1/5 p-2">
                  <NotifBar
                    picture={invite.user.picture}
                    requestType="friend"
                    userName={invite.user.userName}
                    friendId={
                      invite.friendId !== user.user?.id
                        ? invite.friendId
                        : invite.userId
                    }
                  />
                </div>
              ))}
          </div>
        </div>
      </div>
      <div className="h-[38%] w-full px-4 flex gap-2">
        <div className="w-1/3 flex flex-col items-center justify-around rounded-xl bg-gradient-to-t from-[#0B2931] from-0% to-[#020C0E] to-20%">
          <h2>LIVE MODE 1</h2>
          <Link
            href={"game?type=Live&mode=simple"}
            className="border flex items-center justify-center border-white text-center rounded-3xl w-[30%] h-12 opacity-95 cursor-pointer bg-primecl shadow-[0px 4px 4px 0px rgba(0, 0, 0, 0.25)] transition ease-in-out delay-150 hover:scale-105 duration-300"
          >
            Play
          </Link>
        </div>
        <div className="w-1/3 flex flex-col items-center justify-around rounded-xl bg-gradient-to-t from-[#0B2931] from-0% to-[#020C0E] to-20%">
          <h2>REVERSE MODE 2</h2>
          <Link
            href={"game?type=Live&mode=reverse"}
            className="border flex items-center justify-center border-white text-center rounded-3xl w-[30%] h-12 opacity-95 cursor-pointer bg-primecl shadow-[0px 4px 4px 0px rgba(0, 0, 0, 0.25)] transition ease-in-out delay-150 hover:scale-105 duration-300"
          >
            Play
          </Link>
        </div>
        <div className="w-1/3 flex flex-col items-center justify-around rounded-xl bg-gradient-to-t from-[#0B2931] from-0% to-[#020C0E] to-20%">
          <h2>HIDDEN MODE 3</h2>
          <Link
            href={"game?type=Live&mode=hidden"}
            className="border flex items-center justify-center border-white text-center rounded-3xl w-[30%] h-12 opacity-95 cursor-pointer bg-primecl shadow-[0px 4px 4px 0px rgba(0, 0, 0, 0.25)] transition ease-in-out delay-150 hover:scale-105 duration-300"
          >
            Play
          </Link>
        </div>
      </div>
    </div>
  );
}
