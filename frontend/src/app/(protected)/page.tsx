"use client";

import Image from "next/image";
import { useContext, useEffect, useState } from "react";
import { InviteType } from "./user/[id]/layout";
import axios from "axios";
import Link from "next/link";
import { NotifBar } from "@/components/Notifications/NotifBar";
import { UserContext } from "@/context/userContext";
import { MdOutlineKeyboardDoubleArrowLeft } from "react-icons/md";
import { MdOutlineKeyboardDoubleArrowRight } from "react-icons/md";
import { HiArchiveBox } from "react-icons/hi2";
import { toast } from "react-toastify";


import SSS1 from "/public/reverse.png"
import SSS2 from "/public/livemode.png"
import SSS3 from "/public/blackhole.png"

export default function Home() {
  const [invites, SetInvite] = useState<InviteType[]>([]);
  const [anime, setAnime] = useState(true);
  const [slides, setSlides] = useState([
    {
      title: "REVERSE MODE",
      image: SSS1,
      text: "Bored of the default mode, why don't you try a game with different rules. Start a game to find out !!",
      link: "game?type=Live&mode=reverse",
      width: 180,
    },
    {
      title: "LIVE MODE",
      image: SSS2,
      text: "Face random players around the globe, and prove that you are the master of ping pong",
      link: "game?type=Live&mode=simple",
      width: 180,
    },
    {
      title: "HIDDEN MODE",
      image: SSS3,
      text: "If you can't see it, this doesn't mean that it doesn't exist. Let's see if you can handle a mode that challenge your senses",
      link: "game?type=Live&mode=hidden",
      width: 180,
    },
  ]);
  const user = useContext(UserContext);

  const MoveLeft = () => {
    const newSlides = [slides[2], slides[0], slides[1]];
    setSlides(newSlides);
    setAnime(true);
    setTimeout(() => {
      setAnime(false);
    }, 2000);
  };
  const MoveRight = () => {
    const newSlides = [slides[1], slides[2], slides[0]];
    setSlides(newSlides);
    setAnime(true);
    setTimeout(() => {
      setAnime(false);
    }, 2000);
  };

  useEffect(() => {
    const getFriendRequest = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/getFriendRequests`, {
          withCredentials: true,
        });
        SetInvite(res.data);
      } catch (error) {
        toast.error("Sending friend request failed");
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
              className="2xl:h-20 2xl:w-20"
            >
              <path
                d="M44.9999 33C48.7499 33 59.5311 23.8333 65.1561 34.8333C70.7811 45.8333 69.3749 60.5 65.6249 60.5C56.2499 60.5 61.8749 51.3333 44.9999 51.3333C28.1249 51.3333 33.7499 60.5 24.3749 60.5C20.6249 60.5 19.2187 45.8333 24.8437 34.8333C30.4687 23.8334 41.2499 33 44.9999 33ZM31.8749 37.125V40.3334H28.5936V44H31.8749V47.2084H35.6249V44H38.9062V40.3334H35.6249V37.125H31.8749ZM53.4374 39.4167C52.4018 39.4167 51.5623 40.2375 51.5623 41.25C51.5623 42.2626 52.4018 43.0834 53.4374 43.0834C54.4729 43.0834 55.3124 42.2626 55.3124 41.25C55.3124 40.2375 54.4729 39.4167 53.4374 39.4167ZM57.1874 36.2083C56.1518 36.2083 55.3124 37.0291 55.3124 38.0417C55.3124 39.0542 56.1518 39.875 57.1874 39.875C58.2229 39.875 59.0624 39.0542 59.0624 38.0417C59.0624 37.0291 58.2229 36.2083 57.1874 36.2083ZM57.1874 43.0833C56.1518 43.0833 55.3124 43.9041 55.3124 44.9167C55.3124 45.9292 56.1518 46.75 57.1874 46.75C58.2229 46.75 59.0624 45.9292 59.0624 44.9167C59.0624 43.9041 58.2229 43.0833 57.1874 43.0833ZM60.9374 39.4167C59.9019 39.4167 59.0624 40.2374 59.0624 41.25C59.0624 42.2626 59.9019 43.0833 60.9374 43.0833C61.973 43.0833 62.8124 42.2626 62.8124 41.25C62.8124 40.2374 61.973 39.4167 60.9374 39.4167Z"
                fill="#001E28"
                stroke="white"
                strokeWidth="2.10526"
                strokeLinejoin="round"
              />
            </svg>
            <h2 className="text-white text-xl 2xl:text-4xl">QUICK GAME</h2>
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
              <h3 className="text-3xl 2xl:text-6xl">START A GAME NOW</h3>
              <p className="text-xl px-8 2xl:text-4xl 2xl:px-10">
                If you want something challening, then try beating an incarnated
                Fan Zhendong
              </p>
              <Link
                href={"/game?type=Bot"}
                className="border flex items-center justify-center border-white text-center rounded-3xl w-[40%] h-12 2xl:h-14 2xl:text-2xl opacity-95 cursor-pointer bg-primecl shadow-[0px 4px 4px 0px rgba(0, 0, 0, 0.25)] transition ease-in-out delay-150 hover:scale-105 duration-300"
              >
                Play
              </Link>
            </div>
          </div>
        </div>
        <div className="w-[25%] flex flex-col rounded-2xl bg-[#020C0E]">
          <div className="h-[15%] flex items-center justify-center text-xl 2xl:text-3xl rounded-t-2xl bg-gradient-to-t from-[#0B2931] from-0% to-[#020C0E] to-20%">
            Notifications
          </div>
          <div className="overflow-scroll scrollbar-hide flex-1 flex flex-col w-full rounded-b-2xl bg-gradient-to-t from-[#0B2931] from-0% to-[#020C0E] to-10%">
            {user &&
              invites.length !== 0 &&
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
            {invites.length === 0 && (
              <div className="w-full h-full flex flex-col gap-3 items-center justify-center">
                <HiArchiveBox size={50} />
                <p className="text-white text-sm 2xl:text-xl">
                  You currently have no notifications
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="h-[38%] w-full px-4 flex justify-between gap-2 relative">
        <div
          className="flex items-center z-10 absolute top-[50%] bottom-[50%] h-[25px] cursor-pointer"
          onClick={MoveLeft}
        >
          <MdOutlineKeyboardDoubleArrowLeft size={50} />
        </div>
        <div className="w-1/3 h-full flex flex-col items-center justify-around rounded-xl bg-gradient-to-t from-[#0B2931] from-0% to-[#020C0E] to-20% absolute blur-sm pointer-events-none">
          <div className="flex justify-around w-full">
            <Image
              src={slides[0].image}
              alt="slide image"
              className="w-[30%]"
              priority
            />
            <div className="flex flex-col gap-2 2xl:gap-6 items-center justify-center w-1/2">
              <h2 className="text-xl text-quatrocl 2xl:text-3xl">
                {slides[0].title}
              </h2>
              <p className="text-sm 2xl:text-2xl">{slides[0].text}</p>
            </div>
          </div>
          <Link
            href={slides[0].link}
            className="border flex items-center justify-center border-white text-center rounded-3xl w-[30%] h-12 2xl:h-14 2xl:text-2xl opacity-95 cursor-pointer bg-primecl shadow-[0px 4px 4px 0px rgba(0, 0, 0, 0.25)] transition ease-in-out delay-150 hover:scale-105 duration-300"
          >
            Play
          </Link>
        </div>
        <div
          className={`w-[40%] h-full flex flex-col items-center justify-around rounded-xl bg-gradient-to-t from-[#0B2931] from-0% to-[#020C0E] to-20% z-10 absolute left-[30%] right-[30%] border border-quatrocl ${
            anime ? "animate-appear" : ""
          }`}
        >
          <div className="flex justify-around w-full">
            <Image
              src={slides[1].image}
              alt="slide image"
              className="w-[30%]"
              priority
            />
            <div className="flex flex-col gap-2 2xl:gap-6 items-center justify-center w-1/2">
              <h2 className="text-xl text-quatrocl 2xl:text-3xl">
                {slides[1].title}
              </h2>
              <p className="text-sm 2xl:text-2xl">{slides[1].text}</p>
            </div>
          </div>
          <Link
            href={slides[1].link}
            className="border flex items-center justify-center border-white text-center rounded-3xl w-[30%] h-12 2xl:h-14 2xl:text-2xl opacity-95 cursor-pointer bg-primecl shadow-[0px 4px 4px 0px rgba(0, 0, 0, 0.25)] transition ease-in-out delay-150 hover:scale-105 duration-300"
          >
            Play
          </Link>
        </div>
        <div className="w-1/3 h-full flex flex-col items-center justify-around rounded-xl bg-gradient-to-t from-[#0B2931] from-0% to-[#020C0E] to-20% absolute right-4 blur-sm pointer-events-none">
          <div className="flex justify-around w-full">
            <Image
              src={slides[2].image}
              alt="slide image"
              className="w-[30%]"
              priority
            />
            <div className="flex flex-col gap-2 2xl:gap-6 items-center justify-center w-1/2">
              <h2 className="text-xl text-quatrocl 2xl:text-2xl">
                {slides[2].title}
              </h2>
              <p className="text-sm 2xl:text-2xl">{slides[2].text}</p>
            </div>
          </div>
          <Link
            href={slides[2].link}
            className="border flex items-center justify-center border-white text-center rounded-3xl w-[30%] h-12 2xl:h-14 2xl:text-2xl opacity-95 cursor-pointer bg-primecl shadow-[0px 4px 4px 0px rgba(0, 0, 0, 0.25)] transition ease-in-out delay-150 hover:scale-105 duration-300"
          >
            Play
          </Link>
        </div>
        <div
          className="flex items-center z-10 absolute top-[50%] bottom-[50%] right-4 h-[25px] cursor-pointer"
          onClick={MoveRight}
        >
          <MdOutlineKeyboardDoubleArrowRight size={50} />
        </div>
      </div>
    </div>
  );
}
