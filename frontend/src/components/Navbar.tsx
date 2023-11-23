"use client";
import Link from "next/link";
import Image from "next/image";
import { FaBell, FaSearch } from "react-icons/fa";
import { useContext, useRef, useState } from "react";
import { UserContext } from "@/context/userContext";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

export default function Navbar() {
  const user = useContext(UserContext);
  const username = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const [error, SetError] = useState("");

  const handleKeyDown = (event: any) => {
    console.log("im here");
    if (event.key === "Enter") {
      event.preventDefault();
      handleClick();
    }
  };

  const handleClick = async () => {
    if (username && username.current) {
      try {
        const userName = username.current.value;
        const res = await axios.post(
          "http://localhost:4000/getFriendProfileWithUserName",
          { userName },
          {
            withCredentials: true,
          }
        );
        const data = res.data;
        SetError("");
        username.current.value = "";
        router.push(`/user/${data.user.id}`);
      } catch (error: any) {
        username.current.value = "";
        SetError("border border-red-600");
        toast.error("This username doesn't exist");
      }
    }
  };

  return (
    <div>
      <nav className="overflow-hidden flex justify-between items-center pt-2 px-2 border-b-primecl border-b-2">
        <div className="flex justify-between items-center gap-16">
          <Link href="/" className="ml-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="30"
              height="30"
              viewBox="0 0 48 48"
              fill="none"
            >
              <path
                d="M10.9123 26.2891C13.2529 33.9859 5.55449 37.0031 0.198242 42.3609C1.42949 46.4875 1.39199 46.5234 5.55606 47.7188C10.9139 42.3609 13.592 34.3266 21.6279 37.0047L10.9139 26.2906L10.9123 26.2891ZM43.2264 36.9016C43.2264 40.6031 40.1889 43.6063 36.4389 43.6063C32.6889 43.6063 29.6498 40.6063 29.6498 36.9031C29.6498 36.9016 29.6498 36.9016 29.6498 36.9C29.6498 33.1984 32.6873 30.1953 36.4373 30.1953C40.1873 30.1953 43.2264 33.1953 43.2264 36.8984C43.2264 36.9 43.2264 36.9 43.2264 36.9016ZM29.0186 36.5313C29.0186 36.5297 29.0186 36.5297 29.0186 36.5281C29.0186 32.6531 32.1982 29.5109 36.1217 29.5109C37.7186 29.5109 39.1936 30.0313 40.3795 30.9094C47.5045 24.7859 51.7342 15.4156 42.117 5.79844C23.367 -12.9516 5.55605 20.9328 10.9123 26.2891L21.6264 37.0016C22.8826 38.2578 25.7076 38.2391 29.0529 37.2344C29.0295 37.0031 29.017 36.7672 29.017 36.5297L29.0186 36.5313Z"
                fill="white"
              />
            </svg>
          </Link>
          <div
            className={`${error} rounded-2xl w-64 h-9 flex items-center justify-between p-3 mb-2 bg-primecl`}
          >
            <input
              type="text"
              onKeyDown={handleKeyDown}
              ref={username}
              placeholder="Search"
              className="bg-primecl outline-none"
            ></input>
            <div onClick={handleClick} className="cursor-pointer">
              <FaSearch />
            </div>
          </div>
        </div>
        <div className="flex justify-evenly items-center gap-8">
          <div className="flex justify-evenly items-center gap-2 p-2">
            <Link href={"/profile"}>
              <div>{user.user?.userName || "..."}</div>
            </Link>
            <Link
              href="/profile"
              className="rounded-full flex justify-center items-center overflow-hidden"
            >
              <Image
                loader={() => user.user?.picture || "/placeholder.jpg"}
                src={user.user?.picture || "/placeholder.jpg"}
                alt={"floki"}
                width={30}
                height={30}
                className="rounded-full aspect-square w-7 h-7 object-cover"
                unoptimized
              />
            </Link>
          </div>
        </div>
      </nav>
    </div>
  );
}
