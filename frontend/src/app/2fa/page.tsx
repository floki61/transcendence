"use client";

import Image from "next/image";
import Link from "next/link";
import Button from "@/components/Button";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

export default function Forgotps() {
  const router = useRouter();

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Ensure that the value is a 6-digit number
    if (Number(value) || value === "" || value === "0") {
      setInput(value);
    }
  };

  const send2fa = async (e: any) => {
    setLoading(true);
    e.preventDefault();
    try {
      const response = await axios.post(
        process.env.NEXT_PUBLIC_SERVER_URL + "/2fa/authenticate",
        { twoFactorAuthenticationCode: input },
        {
          withCredentials: true,
        }
      );
      if (response.data.statusCode === 200) {
        await axios.post("/api/2fa", { token: response.data.jwt }).then(() => {
          router.push("/");
        });
      } else toast.error("Wrong authentication code");
    } catch (error) {
      toast.error("Login failed");
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-white text-black">
      <div className="h-screen w-[35%] relative">
        <Image
          src={"/forgot.jpeg"}
          alt={"forgot"}
          fill
          sizes="100%"
          className="object-cover max-md:hidden 2xl:w-[35%]"
          priority
        />
      </div>
      <form
        className="flex flex-1 py-8 px-40 flex-col items-center gap-6 overflow-hidden max-xl:px-4 max-xl:gap-4"
        onSubmit={send2fa}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="48"
          height="48"
          viewBox="0 0 75 75"
          fill="none"
        >
          <path
            d="M17.8688 40.9336C21.3797 52.4789 9.83204 57.0047 1.79767 65.0414C3.64454 71.2313 3.58829 71.2852 9.83439 73.0781C17.8711 65.0414 21.8883 52.9899 33.9422 57.007L17.8711 40.936L17.8688 40.9336ZM66.3399 56.8524C66.3399 62.4047 61.7836 66.9094 56.1586 66.9094C50.5336 66.9094 45.975 62.4094 45.975 56.8547C45.975 56.8524 45.975 56.8524 45.975 56.85C45.975 51.2977 50.5313 46.793 56.1563 46.793C61.7813 46.793 66.3399 51.293 66.3399 56.8477C66.3399 56.85 66.3399 56.85 66.3399 56.8524ZM45.0281 56.2969C45.0281 56.2945 45.0281 56.2945 45.0281 56.2922C45.0281 50.4797 49.7977 45.7664 55.6828 45.7664C58.0781 45.7664 60.2906 46.5469 62.0695 47.8641C72.757 38.6789 79.1016 24.6234 64.6758 10.1977C36.5508 -17.9273 9.83439 32.8992 17.8688 40.9336L33.9399 57.0024C35.8242 58.8867 40.0617 58.8586 45.0797 57.3516C45.0445 57.0047 45.0258 56.6508 45.0258 56.2945L45.0281 56.2969Z"
            fill="black"
          />
        </svg>
        <h1 className="text-4xl text-center font-bold my-2 max-xl:text-3xl">
          TWO FACTOR AUTHENTICATION
        </h1>
        <div className="text-2xl flex flex-col items-center justify-center gap-20 my-16 w-4/6 max-xl:text-xl">
          <p className="font-light w-full">
            Please confirm your account by entering the authorization code sent
            to you.
          </p>
          <input
            className="text-center py-3 w-full h-12 rounded-md bg-slate-100 outline-quatrocl"
            type="text"
            maxLength={6}
            onChange={handleInputChange}
            value={input}
          />
          <Button
            disabled={loading}
            text={loading ? "Sending..." : "Send"}
            className="bg-black text-white rounded-3xl w-3/4 max-xl:w-[70%]  h-14 cursor-pointer"
          />
        </div>
      </form>
    </div>
  );
}
