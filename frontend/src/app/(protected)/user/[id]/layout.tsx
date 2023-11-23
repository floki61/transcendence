"use client";

import React, { useContext } from "react";
import { useState, useEffect } from "react";
import { HiDotsVertical } from "react-icons/hi";
import { UserContext, userType } from "@/context/userContext";
import { MdPeopleAlt, MdGroupAdd, MdOutlineCancel } from "react-icons/md";
import { FaUserMinus } from "react-icons/fa";
import { ImBlocked } from "react-icons/im";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useFriend } from "@/hooks/useFriend";
import axios from "axios";
import { ProfileButton } from "@/components/ProfileButton";

export interface ProfileType {
  user: userType;
  level_P: number;
  barPourcentage: number;
  isfriend: string;
  ifBlocked: boolean;
}

export interface InviteType {
  friendId: string;
  userId: string;
  status: string;
  user: userType;
  friend: userType;
}

export default function layout({
  params,
  children,
}: {
  params: any;
  children: React.ReactNode;
}) {
  const user = useContext(UserContext);
  const [request, SetRequest] = useState(false);
  const [accept, SetAccept] = useState(false);
  const [options, SetOptions] = useState(false);
  const [invites, SetInvite] = useState<InviteType[]>([]);
  const pathName = usePathname();
  const [friend, SetFriend] = useState<ProfileType>();
  const router = useRouter();

  useEffect(() => {
    const getFriendRequest = async () => {
      try {
        const res = await axios.get("http://localhost:4000/getFriendRequests", {
          withCredentials: true,
        });
        SetInvite(res.data);
      } catch (error) {
        console.log("error");
      }
    };
    getFriendRequest();
  }, []);

  const SendRequest = async () => {
    try {
      const res = axios.post(
        "http://localhost:4000/sendFriendRequest",
        { friendId: params.id },
        {
          withCredentials: true,
        }
      );
      SetRequest(true);
      if (friend) friend.isfriend = "cancel";
    } catch (error) {
      console.log("SendRequest failed", error);
    }
  };
  const CancelRequest = async () => {
    try {
      const res = axios.post(
        "http://localhost:4000/cancelFriendRequest",
        { friendId: params.id },
        {
          withCredentials: true,
        }
      );
      SetRequest(false);
      if (friend) friend.isfriend = "notfriend";
    } catch (error) {
      console.log("CancelRequest failed", error);
    }
  };
  const DeclineRequest = async () => {
    try {
      const res = axios.post(
        "http://localhost:4000/rejecte",
        { friendId: params.id },
        {
          withCredentials: true,
        }
      );
      SetAccept(false);
      SetRequest(false);
      if (friend) friend.isfriend = "notfriend";
    } catch (error) {
      console.log("DeclineRequest failed", error);
    }
  };
  const AcceptRequest = async () => {
    try {
      const res = axios.post(
        "http://localhost:4000/acc",
        { friendId: params.id },
        {
          withCredentials: true,
        }
      );
      SetAccept(false);
      SetRequest(false);
      if (friend) friend.isfriend = "friend";
    } catch (error) {
      console.log("AcceptRequest failed", error);
    }
  };
  const Unfriend = async () => {
    try {
      const res = axios.post(
        "http://localhost:4000/unfriend",
        { friendId: params.id },
        {
          withCredentials: true,
        }
      );
      SetAccept(false);
      SetRequest(false);
      if (friend) friend.isfriend = "notfriend";
      getFriend();
    } catch (error) {
      console.log("Unfriend failed", error);
    }
  };
  const Block = async () => {
    try {
      const res = axios.post(
        "http://localhost:4000/blockUser",
        { friendId: params.id },
        {
          withCredentials: true,
        }
      );
      router.push("/");
      // SetAccept(false);
      // SetRequest(false);
    } catch (error) {
      console.log("Block failed", error);
    }
  };

  const getFriend = async () => {
    try {
      const res = await axios.post(
        "http://localhost:4000/getFriendProfile",
        { id: params.id },
        {
          withCredentials: true,
        }
      );
      if (res.data.ifBlocked) router.push("/not-found");
      else SetFriend(res.data);
    } catch (error) {
      console.log("get Friend profile failed.", error);
    }
  };
  useEffect(() => {
    getFriend();
  }, [params.id]);

  if (friend && friend.user)
    friend.user.fullName = friend.user.firstName + " " + friend.user.lastName;

  useEffect(() => {
    if (invites) {
      invites.map((invite) => {
        if (
          (invite.userId === params.id || invite.friendId === params.id) &&
          invite.status === "PENDING"
        ) {
          SetAccept(true);
          SetRequest(true);
        }
      });
    }
  }, [invites]);

  if (friend)
    console.log((Math.ceil(friend.barPourcentage)));

  return (
    <div className="h-full w-full p-10 overflow-hidden">
      {friend && friend.user && (
        <div className="h-full w-full flex flex-col gap-16">
          <div className="flex gap-4 h-[22%]">
            <Image
              loader={() => friend.user.picture || "/placeholder.jpg"}
              src={friend.user.picture || "/placeholder.jpg"}
              alt={"profile pic"}
              height={140}
              width={140}
              className="rounded-full aspect-square w-36 h-36 object-cover"
              priority
              unoptimized
            />
            <div className="w-3/5 h-full flex flex-col justify-between px-4">
              <div className="flex flex-col gap-1">
                <div className="flex justify-between">
                  <h2 className="text-3xl">{friend.user.fullName}</h2>
                  <div className="cursos-pointer w-[42%]">
                    {params.id !== user.user?.id &&
                      friend.isfriend === "friend" && (
                        <div
                          className="flex justify-end w-full"
                          onClick={() => {
                            SetOptions(!options);
                          }}
                        >
                          {!options && <HiDotsVertical size={30} />}
                          {options && (
                            <div className="flex w-full justify-between">
                              <ProfileButton
                                color="bg-red-600"
                                text="Block"
                                icon={ImBlocked}
                                classname="w-[48%]"
                                action={Block}
                              />
                              <div
                                onClick={() => {
                                  SetOptions(!options);
                                }}
                              >
                                <HiDotsVertical size={30} />
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <h3 className="text-xl lowercase">{friend.user.userName}</h3>
                  <h3
                    className={`${friend.user.status === "OFFLINE"
                      ? "text-red-600"
                      : "text-[#00A83F]"
                      }`}
                  >
                    ( {friend.user.status} )
                  </h3>
                </div>
              </div>
              {params.id !== user.user?.id &&
                friend.isfriend === "notfriend" &&
                !request && (
                  <div className="flex justify-end">
                    <ProfileButton
                      color="bg-primecl"
                      text="Add Friend"
                      icon={MdGroupAdd}
                      action={SendRequest}
                      classname="w-1/5 mb-2"
                    />
                  </div>
                )}
              {params.id !== user.user?.id &&
                friend.isfriend === "cancel" &&
                !accept && (
                  <div className="flex justify-end">
                    <ProfileButton
                      color="bg-[#6A6666]"
                      text="Cancel"
                      icon={MdOutlineCancel}
                      action={CancelRequest}
                      classname="w-1/5 mb-2"
                    />
                  </div>
                )}
              {params.id !== user.user?.id && accept && request && (
                <div className="flex justify-end gap-3">
                  <ProfileButton
                    color="bg-primecl"
                    text="Accept"
                    icon={MdPeopleAlt}
                    action={AcceptRequest}
                    classname="w-1/5 mb-2"
                  />
                  <ProfileButton
                    color="bg-[#6A6666]"
                    text="Decline"
                    icon={MdOutlineCancel}
                    action={DeclineRequest}
                    classname="w-1/5 mb-2"
                  />
                </div>
              )}
              {params.id !== user.user?.id &&
                friend.isfriend === "friend" && (
                  <div className="flex justify-end gap-3">
                    <ProfileButton
                      color="bg-primecl"
                      text="Friends"
                      icon={MdPeopleAlt}
                      classname="w-1/5 mb-2"
                    />
                    <ProfileButton
                      color="bg-[#6A6666]"
                      text="Unfriend"
                      icon={FaUserMinus}
                      action={Unfriend}
                      classname="w-1/5 mb-2"
                    />
                  </div>
                )}
              <div className="relative w-full bg-[#6A6666] rounded-xl text-center text-black self-end">
                {friend && (
                  <div
                    className={`bg-quatrocl h-full rounded-xl absolute inset-0`}
                    style={{
                      width: `${String(Math.ceil(friend.barPourcentage))}%`,
                    }}
                  ></div>
                )}
                <p className="text-black text-center z-10 relative text-xl font-medium">
                  Level {friend.level_P}
                </p>
              </div>
            </div>
            <div className="w-[25%] text-center">chart</div>
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
            {pathName === "/user/" + params.id + "/achievements" && (
              <Image
                src="/trophy.png"
                alt="trophy"
                width={170}
                height={170}
                className="absolute z-10 place-self-end"
                priority
              />
            )}
            {pathName === "/user/" + params.id + "/history" && (
              <Image
                src="/table.png"
                alt="table"
                width={170}
                height={170}
                className="absolute place-self-end"
                priority
              />
            )}
            <div className="w-[60%] h-[12%] rounded-t-xl bg-primecl flex items-center">
              <Link
                href={`/user/${params.id}`}
                className={`${pathName === "/user/" + params.id
                  ? "bg-gradient-to-t from-[#000000] from-0% to-segundcl to-100% rounded-tl-xl"
                  : ""
                  } hover:bg-gradient-to-t hover:from-[#000000] hover:from-0% hover:to-segundcl hover:to-100% hover:rounded-tl-xl w-1/3 text-2xl text-center h-full flex justify-center items-center border-r border-segundcl`}
              >
                Stats
              </Link>
              <Link
                href={`/user/${params.id}/achievements`}
                className={`${pathName === "/user/" + params.id + "/achievements"
                  ? "bg-gradient-to-t from-[#000000] from-0% to-segundcl to-100% "
                  : ""
                  } hover:bg-gradient-to-t hover:from-[#000000] hover:from-0% hover:to-segundcl hover:to-100% w-1/3 text-2xl text-center h-full flex justify-center items-center border-r border-segundcl`}
              >
                Achievements
              </Link>
              <Link
                href={`/user/${params.id}/history`}
                className={`${pathName === "/user/" + params.id + "/history"
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
