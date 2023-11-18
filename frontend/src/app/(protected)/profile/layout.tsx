"use client";

import React from "react";
import { useState, useEffect } from "react";
import { FaEdit } from "react-icons/fa";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import axios from "axios";
import { InviteType, ProfileType } from "../[id]/layout";

export default function page(
  { children }: { children: React.ReactNode },
  { params }: { params: any }
) {
  const [user, SetUser] = useState<ProfileType>();
  const [followers, SetFollowers] = useState<InviteType[]>([]);
  const pathName = usePathname();

  useEffect(() => {
    const getFollwers = async () => {
      try {
        const res = await axios.get("http://localhost:4000/getFriends", {
          withCredentials: true,
        });
        console.log("success", res.data);
        SetFollowers(res.data);
      } catch (error) {
        console.log("get Friend profile failed.", error);
      }
    };
    getFollwers();
  }, []);

  useEffect(() => {
    const getFriend = async () => {
      try {
        const res = await axios.get("http://localhost:4000/profile", {
          withCredentials: true,
        });
        console.log("success", res.data);
        SetUser(res.data);
      } catch (error) {
        console.log("get Friend profile failed.", error);
      }
    };
    getFriend();
  }, []);

  if (user && user.user)
    user.user.fullName = user.user.firstName + " " + user.user.lastName;

  return (
    <div className="h-full w-full p-10 overflow-hidden">
      {user && (
        <div className="h-full w-full flex flex-col gap-16">
          <div className="flex gap-4 h-[22%]">
            <Image
              src={user.user.picture}
              alt={"profile pic"}
              height={140}
              width={140}
              className="rounded-full aspect-square w-36 h-36 object-cover"
            />
            <div className="w-3/5 h-full flex flex-col justify-between px-4">
              <div className="flex flex-col gap-1">
                <div className="flex justify-between">
                  <h2 className="text-3xl">{user.user.fullName}</h2>
                  <Link href="/settings">
                    <FaEdit size={30}/>
                  </Link>
                </div>
                <h3 className="text-xl">{user.user.userName}</h3>
              </div>
              <div className="w-full bg-[#6A6666] relative rounded-xl text-center text-black self-end">
                <div
                  className={`bg-quatrocl w-[${user.barPourcentage}%] h-full rounded-xl absolute top-0 left-0`}
                ></div>
                <p className="text-black text-center z-10 relative text-xl font-medium">
                  Level {user.level_P}
                </p>
              </div>
            </div>
            {/* <div className="w-[25%] text-center">
              {followers && followers.map((follower, index) => (
                <div key={index} className="w-full bg-primecl debug h-full flex items-center gap-2">
                    <Image
                      src={follower.user.picture}
                      alt="friend pic"
                      height={30}
                      width={30}
                      className="rounded-full aspect-square w-8 h-8 object-cover"
                    />
                    <span>{follower.user.userName}</span>
                    <span className={`${follower.user.status === "OFFLINE" ? "text-red-600" : "text-[#00A83F]"}`}>( {follower.user.status} )</span>
                </div>
              ))}
            </div> */}
          </div>
          <div className="flex-1 flex flex-col items-center relative">
            <Image
              src="/paddle.png"
              alt="paddle"
              width={170}
              height={170}
              className="absolute place-self-end"
              priority
            />
            <div className="w-[60%] h-[12%] rounded-t-xl bg-primecl flex items-center">
              <Link
                href="/profile"
                className={`${
                  pathName === "/profile"
                    ? "bg-gradient-to-t from-[#000000] from-0% to-segundcl to-100% rounded-tl-xl"
                    : ""
                } hover:bg-gradient-to-t hover:from-[#000000] hover:from-0% hover:to-segundcl hover:to-100% hover:rounded-tl-xl w-1/3 text-2xl text-center h-full flex justify-center items-center border-r border-segundcl`}
              >
                Stats
              </Link>
              <Link
                href="/profile/achievements"
                className={`${
                  pathName === "/profile/achievements"
                    ? "bg-gradient-to-t from-[#000000] from-0% to-segundcl to-100% "
                    : ""
                } hover:bg-gradient-to-t hover:from-[#000000] hover:from-0% hover:to-segundcl hover:to-100% w-1/3 text-2xl text-center h-full flex justify-center items-center border-r border-segundcl`}
              >
                Achievements
              </Link>
              <Link
                href="/profile/history"
                className={`${
                  pathName === "/profile/history"
                    ? "bg-gradient-to-t from-[#000000] from-0% to-segundcl to-100% rounded-tr-xl"
                    : ""
                } hover:bg-gradient-to-t hover:from-[#000000] hover:from-0% hover:to-segundcl hover:to-100% hover:rounded-tr-xl w-1/3 text-2xl text-center h-full flex justify-center items-center`}
              >
                History
              </Link>
            </div>
            <div className="px-16 w-full flex-1 rounded-xl">
              <div className="h-full w-full rounded-xl bg-segundcl">
                {children}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
