"use client";

import React from "react";
import { useState, useEffect } from "react";
import { FaEdit } from "react-icons/fa";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import axios from "axios";
import { InviteType, ProfileType } from "../user/[id]/layout";
import { userType } from "@/context/userContext";
import { ProfileButton } from "@/components/ProfileButton";
import { MdPeopleAlt } from "react-icons/md";

export interface ListType {
  friendRequests: {
    friendId: string;
    userId: string;
    status: string;
    user: userType;
    friend: userType;
  }[];
}

export interface BlockType {
  friendId: string;
  fid: string;
  status: string;
  friend: userType;
}

export default function Page(
  { children }: { children: React.ReactNode },
  { params }: { params: any }
) {
  const [user, SetUser] = useState<ProfileType>();
  const [followers, SetFollowers] = useState<ListType>();
  const [blocked, setBlocked] = useState<BlockType[]>();
  const [list, setList] = useState(false);
  const pathName = usePathname();
  const router = useRouter();

  useEffect(() => {
    const getFollwers = async () => {
      try {
        const res = await axios.get("http://localhost:4000/getFriends", {
          withCredentials: true,
        });
        SetFollowers(res.data);
      } catch (error) {}
    };
    getFollwers();
  }, []);

  useEffect(() => {
    const getBlockedList = async () => {
      try {
        const res = await axios.get("http://localhost:4000/getBlockedList", {
          withCredentials: true,
        });
        setBlocked(res.data);
      } catch (error) {}
    };
    getBlockedList();
  }, []);

  useEffect(() => {
    const getFriend = async () => {
      try {
        const res = await axios.get("http://localhost:4000/profile", {
          withCredentials: true,
        });
        SetUser(res.data);
      } catch (error) {}
    };
    getFriend();
  }, []);

  const UnblockFriend = async (friendId: string) => {
    try {
      const res = await axios.post(
        "http://localhost:4000/unblockUser",
        { friendId },
        {
          withCredentials: true,
        }
      );
      router.push("/profile");
    } catch (error) {}
  };

  if (user && user.user)
    user.user.fullName = user.user.firstName + " " + user.user.lastName;

  return (
    <div className="h-full w-full p-10 overflow-hidden">
      {user && (
        <div className="h-full w-full flex flex-col gap-16">
          <div className="flex gap-4 h-[22%]">
            <Image
              loader={() => user.user.picture || "/placeholder.jpg"}
              src={user.user.picture || "/placeholder.jpg"}
              alt={"profile pic"}
              height={140}
              width={140}
              className="rounded-full aspect-square w-36 h-36 object-cover 2xl:w-64 2xl:h-64"
              priority
              unoptimized
            />
            <div className="w-3/5 h-full flex flex-col justify-between px-4">
              <div className="flex flex-col gap-1 2xl:gap-4">
                <div className="flex justify-between">
                  <h2 className="text-3xl 2xl:text-5xl">
                    {user.user.fullName}
                  </h2>
                  <Link href="/settings" className="2xl:w-16">
                    <FaEdit size={30} className={"w-full h-full"} />
                  </Link>
                </div>
                <h3 className="text-xl 2xl:text-3xl">{user.user.userName}</h3>
              </div>
              <div className="w-full bg-[#6A6666] relative rounded-xl 2xl:rounded-2xl text-center text-black self-end 2xl:h-10">
                <div
                  className={`bg-quatrocl h-full rounded-xl 2xl:rounded-2xl absolute inset-0`}
                  style={{
                    width: `${String(Math.ceil(user.barPourcentage))}%`,
                  }}
                ></div>
                <p className="text-black text-center z-10 relative text-xl h-full font-medium flex items-center justify-center 2xl:text-2xl">
                  Level {user.level_P}
                </p>
              </div>
            </div>
            <div className="w-[25%] text-center h-full overflow-scroll scrollbar-hide rounded-md bg-primecl">
              <div className="flex items-center 2xl:h-[20%] 2xl:text-xl justify-around bg-segundcl border-b border-quatrocl">
                <h2
                  className="bg-segundcl w-1/2 2xl:h-full flex items-center justify-center border-r border-quatrocl cursor-pointer"
                  onClick={() => {
                    setList(false);
                  }}
                >
                  Friend List
                </h2>
                <h2
                  className="bg-segundcl w-1/2 cursor-pointer"
                  onClick={() => {
                    setList(true);
                  }}
                >
                  Block List
                </h2>
              </div>
              {!list &&
                followers &&
                followers.friendRequests &&
                followers.friendRequests.map((follower, index) => (
                  <div
                    key={index}
                    className="w-full bg-primecl h-1/3 flex items-center gap-2 2xl:gap-4 border-b border-segundcl px-2"
                  >
                    <Image
                      loader={() =>
                        follower.user.id !== user.user.id
                          ? follower.user.picture
                          : follower.friend.picture
                      }
                      src={
                        follower.user.id !== user.user.id
                          ? follower.user.picture
                          : follower.friend.picture
                      }
                      alt="friend pic"
                      height={30}
                      width={30}
                      className="rounded-full aspect-square w-8 h-8 object-cover 2xl:w-14 2xl:h-14"
                      unoptimized
                    />
                    <span className="2xl:text-2xl">
                      {follower.user.id !== user.user.id
                        ? follower.user.userName
                        : follower.friend.userName}
                    </span>
                    <span
                      className={`flex justify-end w-full 2xl:text-xl ${
                        follower.user.id !== user.user.id
                          ? follower.user.status !== "OFFLINE"
                            ? "text-[#00A83F]"
                            : "text-red-600"
                          : follower.friend.status !== "OFFLINE"
                          ? "text-[#00A83F]"
                          : "text-red-600"
                      }`}
                    >
                      ({" "}
                      {follower.user.id !== user.user.id
                        ? follower.user.status
                        : follower.friend.status}{" "}
                      )
                    </span>
                  </div>
                ))}
              {list &&
                blocked &&
                blocked.map((block, index) => (
                  <div
                    key={index}
                    className="w-full bg-primecl h-1/3 flex items-center gap-2 border-b border-segundcl px-2"
                  >
                    <Image
                      loader={() => block.friend.picture}
                      src={block.friend.picture}
                      alt="friend pic"
                      height={30}
                      width={30}
                      className="rounded-full aspect-square w-8 h-8 object-cover 2xl:w-14 2xl:h-14"
                      unoptimized
                    />
                    <span className="2xl:text-2xl">
                      {block.friend.userName}
                    </span>
                    <div
                      className="flex justify-end w-full 2xl:text-xl"
                      onClick={() => {
                        UnblockFriend(block.friend.id);
                      }}
                    >
                      <ProfileButton
                        color="bg-red-600"
                        text="Unblock"
                        icon={MdPeopleAlt}
                      ></ProfileButton>
                    </div>
                  </div>
                ))}
            </div>
          </div>
          <div className="flex-1 flex flex-col items-center relative">
            {pathName === "/profile" && (
              <Image
                src="/paddle.png"
                alt="paddle"
                width={170}
                height={170}
                className="absolute place-self-end"
                priority
              />
            )}
            {pathName === "/profile/achievements" && (
              <Image
                src="/trophy.png"
                alt="trophy"
                width={170}
                height={170}
                className="absolute place-self-end z-10 animate-pulse"
                priority
              />
            )}
            {pathName === "/profile/history" && (
              <Image
                src="/table.png"
                alt="table"
                width={170}
                height={170}
                className="absolute place-self-end opacity-70 aspect-square"
                priority
              />
            )}
            <div className="w-[60%] h-[12%] rounded-t-xl bg-primecl flex items-center">
              <Link
                href="/profile"
                className={`${
                  pathName === "/profile"
                    ? "bg-gradient-to-t from-[#000000] from-0% to-segundcl to-100% rounded-tl-xl"
                    : ""
                } hover:bg-gradient-to-t hover:from-[#000000] hover:from-0% hover:to-segundcl hover:to-100% hover:rounded-tl-xl w-1/3 text-2xl text-center h-full flex justify-center items-center border-r border-segundcl 2xl:text-5xl`}
              >
                Stats
              </Link>
              <Link
                href="/profile/achievements"
                className={`${
                  pathName === "/profile/achievements"
                    ? "bg-gradient-to-t from-[#000000] from-0% to-segundcl to-100% "
                    : ""
                } hover:bg-gradient-to-t hover:from-[#000000] hover:from-0% hover:to-segundcl hover:to-100% w-1/3 text-2xl text-center h-full flex justify-center items-center border-r border-segundcl 2xl:text-5xl`}
              >
                Achievements
              </Link>
              <Link
                href="/profile/history"
                className={`${
                  pathName === "/profile/history"
                    ? "bg-gradient-to-t from-[#000000] from-0% to-segundcl to-100% rounded-tr-xl"
                    : ""
                } hover:bg-gradient-to-t hover:from-[#000000] hover:from-0% hover:to-segundcl hover:to-100% hover:rounded-tr-xl w-1/3 text-2xl text-center h-full flex justify-center items-center 2xl:text-5xl`}
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
