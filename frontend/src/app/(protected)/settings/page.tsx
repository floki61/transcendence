"use client";
import Settinput from "@/components/SettInput";
import Button from "@/components/Button";
import Image from "next/image";
import axios from "axios";
import { useEffect, useState, useRef, useContext } from "react";
import QrcodeDiv from "@/components/QrcodeDiv";
import Disable2fa from "@/components/Disable2fa";
import { UserContext } from "@/context/userContext";
import { userType } from "@/context/userContext";
import { toast } from "react-toastify";

export interface qrcodeType {
  url: string;
}

export default function Page() {
  const user = useContext(UserContext);

  const updateUser = async () => {
    try {
      const res = await axios.post(
        process.env.NEXT_PUBLIC_SERVER_URL + "/userSettings",
        user.user,
        {
          withCredentials: true,
        }
      );
      if (res.data === "Username already exists")
        toast.error("Username already exists");
      else if (res.data === "done") toast.success("Changes saved successfully");
      else toast.success("Changes saved successfully");
    } catch (error: any) {}
  };

  const hnadleChange = (e: any) => {
    const { name, value } = e.target;

    if (
      name === "phoneNumber" &&
      !Number(value) &&
      value !== "" &&
      value !== "0"
    )
      return;

    const newUser = { ...user.user, [name]: value };
    user.setUser(newUser as userType);
  };

  const [imageUrl, setImageUrl] = useState<string>(
    user.user ? user.user.picture : "/placeholder.jpg"
  );

  useEffect(() => {
    if (user && user.user && user.user.picture) {
      setImageUrl(user.user.picture);
    }
  }, [user]);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length === 1 && user && user.user) {
      // check file size
      if (e.target.files[0].size > 1024 * 1024) {
        toast.error("Image size must be less than 1MB");
        return;
      }
      // check file type (only images allowed)
      if (!e.target.files[0].type.startsWith("image")) {
        toast.error("Only images are allowed");
        return;
      }
      try {
        const formData = new FormData();
        formData.append("avatar", e.target.files[0]);
          (await axios.post(process.env.NEXT_PUBLIC_SERVER_URL + "/upload", formData, {
            withCredentials: true,
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }));
        setImageUrl(URL.createObjectURL(e.target.files[0]));
        // user.user.picture = URL.createObjectURL(e.target.files[0]);
        toast.success("Image uploaded successfully");
      } catch (error: any) {
        toast.error(error?.response?.data.message);
      }
    }
  };

  const [showDiv, setShowDiv] = useState(false);

  const handleQrCode = () => {
    setShowDiv(true);
  };

  const handleDeleteAccount = async () => {
    try {
      const res = await axios.post(
        process.env.NEXT_PUBLIC_SERVER_URL + "/deleteAccount",
        { id: user.user?.id },
        {
          withCredentials: true,
        }
      );
      window.location.href = process.env.NEXT_PUBLIC_CLIENT_URL + "/login";
    } catch (error) {}
  };

  return (
    <div className="h-full">
      {user && user.user && (
        <div
          className={`${
            showDiv ? "blur pointer-events-none" : ""
          } flex rounded-2xl bg-segundcl h-[90%] m-8`}
        >
          <div className="flex flex-col w-1/2 border-r-4 border-primecl justify-center items-center my-6 gap-6">
            <div className="flex flex-col items-center gap-3 2xl:gap-1 h-1/2 w-full mt-4 2xl:py-4">
              <Image
                loader={() => imageUrl}
                src={imageUrl}
                alt={"profile pic"}
                width={128}
                height={128}
                className="rounded-full aspect-square w-32 h-32 object-cover 2xl:w-48 2xl:h-48"
                unoptimized
                priority
              />
              <div className="flex flex-col h-full w-full items-center justify-center mt-4">
                <label
                  htmlFor="picture"
                  className="border flex items-center justify-center border-white rounded-3xl w-2/5 p-3 h-12 2xl:h-16 2xl:text-2xl opacity-80 cursor-pointer bg-primecl shadow-[0px 4px 4px 0px rgba(0, 0, 0, 0.25)]  transition ease-in-out delay-150 hover:scale-105 duration-300"
                >
                  UPLOAD A PICTURE
                </label>
                <input
                  type="file"
                  onChange={handleImageChange}
                  name="picture"
                  id="picture"
                  className="hidden"
                  accept="image/png, image/jpg, image/jpeg, image/gif"
                />
              </div>
            </div>
            <div className="w-2/3 border-t-4 border-primecl mt-4">
              <h3 className="my-4 text-lg 2xl:text-3xl 2xl:my-8">SECURITY</h3>
            </div>
            <div className="flex flex-col items-center gap-8 h-1/2 w-full 2xl:justify-center 2xl:gap-16">
              <Button
                text={
                  user.user?.isTwoFactorAuthenticationEnabled === true
                    ? "DISABLE 2FA"
                    : "ENABLE 2FA"
                }
                className="border border-white rounded-3xl w-2/5 p-3 text-center h-12 2xl:h-16 2xl:text-2xl opacity-80 cursor-pointer bg-primecl shadow-[0px 4px 4px 0px rgba(0, 0, 0, 0.25)] transition ease-in-out delay-150 hover:scale-105 duration-300"
                onClick={handleQrCode}
              />
              <Button
                text="DELETE THE ACCOUNT"
                className="rounded-3xl w-2/5 p-2 h-12 2xl:h-16 2xl:text-2xl opacity-80 cursor-pointer bg-red-700  transition ease-in-out delay-150 hover:scale-105 duration-300"
                onClick={handleDeleteAccount}
              />
            </div>
          </div>
          <div className="flex flex-col w-1/2 items-center gap-6 mt-16 px-10 2xl:justify-center 2xl:gap-10">
            <Settinput
              holder="Full Name"
              type="text"
              value={user.user.fullName}
              name="fullName"
              onChange={hnadleChange}
              className="text-slate-400"
            />
            <Settinput
              holder="Username"
              type="text"
              value={user.user.userName}
              name="userName"
              onChange={hnadleChange}
            />
            <Settinput
              holder="Email"
              type="text"
              value={user.user.email}
              name="Email"
              onChange={hnadleChange}
              className="text-slate-400"
            />
            <Settinput
              holder="Country"
              type="text"
              value={user.user.country}
              name="country"
              onChange={hnadleChange}
            />
            <Settinput
              holder="Phone Number"
              type="text"
              value={user.user.phoneNumber}
              name="phoneNumber"
              onChange={hnadleChange}
            />
            <button
              className="border border-white text-center rounded-3xl w-[25%] h-12 2xl:h-16 2xl:text-2xl my-14 opacity-95 cursor-pointer justify-self-end self-end bg-primecl shadow-[0px 4px 4px 0px rgba(0, 0, 0, 0.25)] transition ease-in-out delay-150 hover:scale-105 duration-300"
              onClick={updateUser}
            >
              Save
            </button>
          </div>
        </div>
      )}
      {showDiv && user.user?.isTwoFactorAuthenticationEnabled === false && (
        <QrcodeDiv
          state={showDiv}
          OnClick={setShowDiv}
          twofactor={user.user.isTwoFactorAuthenticationEnabled}
        />
      )}
      {showDiv && user.user?.isTwoFactorAuthenticationEnabled === true && (
        <Disable2fa state={showDiv} OnClick={setShowDiv} />
      )}
    </div>
  );
}
