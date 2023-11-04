"use client";
import Settinput from "@/components/SettInput";
import Button from "@/components/Button";
import Image from "next/image";
import axios from "axios";
import { useEffect, useState, useRef, useContext } from "react";
import Link from "next/link";
import QrcodeDiv from "@/components/QrcodeDiv";
import Disable2fa from "@/components/Disable2fa";
import { UserContext } from "@/context/userContext";
import { userType } from "@/context/userContext";

export interface qrcodeType {
  url: string;
}

export default function page() {
  
  const user = useContext(UserContext);

  const updateUser = async () => {
    try {
      await axios.post("http://localhost:4000/userSettings", user, {
        withCredentials: true,
      }); // backend API endpoint
      console.log("saved with : ", user.user?.picture);
      handleSucces();
    } catch (error) {
        console.error(error);
    }
  };

  const updateProfilePic = async () => {
    try {
      if (user) {
        console.log("ha ach ansift : ", user.user?.picture);
        await axios.post("http://localhost:4000/upload", {avatar :user.user?.picture}, {
          withCredentials: true,
        }); // backend API endpoint
      }
    } catch (error) {
        console.error(error);
    }
  };

  const hnadleChange = (e: any) => {
    const { name, value } = e.target;
  
    if (name === "phoneNumber" && !Number(value) && value !== "" && value !== '0')
      return ;
  
    const newUser = { ...user.user, [name]: value };
    user.setUser(newUser as userType);
  };

  const [imageUrl, setImageUrl] = useState<string | undefined>(user.user?.picture);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("first");
    if (e.target.files && e.target.files.length === 1 && user) {
      setImageUrl(URL.createObjectURL(e.target.files[0]));
      console.log("3chiri : " , URL.createObjectURL(e.target.files[0]));
      if (user.user)
        user.user.picture = URL.createObjectURL(e.target.files[0]);
      updateProfilePic();
    }
  };

  const hiddenFileInput = useRef<HTMLInputElement>(null);
  const handleClick = (e:any) => {
    if (hiddenFileInput.current)
      hiddenFileInput.current.click();
  };


  const [showDiv, setShowDiv] = useState(false);

  const handleQrCode = () => {
    console.log(showDiv);
    setShowDiv(true);
  };

  const [success, setSuccess] = useState(false);

  const handleSucces = () => {
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
    }, 3000);
  }

  let classes = "";

  if (showDiv)
    classes = "blur pointer-events-none";
  else 
    classes = "";

  let butText = "";

  if (user) {
    if (user.user?.isTwoFactorAuthenticationEnabled === true)
      butText = "DISABLE 2FA";
    else
      butText = "ENABLE 2FA";
  }

  return (
    <div className="h-full">
      {user.user && (
        <div className={`${classes} flex rounded-2xl bg-segundcl h-[90%] m-8`}>
          <div className="flex flex-col w-1/2 border-r-4 border-primecl justify-center items-center my-6 gap-6">
            <div className="flex flex-col items-center gap-3 h-1/2 w-full mt-4">
              <Image
                src={user.user.picture}
                alt={"profile pic"}
                width={100}
                height={100}
                className="rounded-full"
                priority
              />
              <div className="flex flex-col h-full w-full items-center gap-8 justify-center mt-4">
                <Button
                  text="CHOOSE AN AVATAR"
                  className="border border-white rounded-3xl w-2/5 p-2 h-12 opacity-80 cursor-pointer bg-primecl shadow-[0px 4px 4px 0px rgba(0, 0, 0, 0.25)]  transition ease-in-out delay-150 hover:scale-105 duration-300"
                />
                <button
                  type="submit"
                  className="border border-white rounded-3xl w-2/5 p-3 h-12 opacity-80 cursor-pointer bg-primecl shadow-[0px 4px 4px 0px rgba(0, 0, 0, 0.25)]  transition ease-in-out delay-150 hover:scale-105 duration-300"
                  onClick={handleClick}
                >
                  UPLOAD A PICTURE
                  <input
                    type="file"
                    onChange={handleImageChange}
                    ref={hiddenFileInput}
                    name="picture"
                    placeholder="UPLOAD A PHOTO"
                    className="hidden"
                    accept="image/png, image/jpg, image/jpeg, image/gif"
                  />
                </button>
              </div>
            </div>
            <div className="w-2/3 border-t-4 border-primecl mt-4">
              <h3 className="my-4 text-lg">SECURITY</h3>
            </div>
            <div className="flex flex-col items-center gap-8 h-1/2 w-full">
              <Button
                text={butText}
                className="border border-white rounded-3xl w-2/5 p-3 text-center h-12 opacity-80 cursor-pointer bg-primecl shadow-[0px 4px 4px 0px rgba(0, 0, 0, 0.25)] transition ease-in-out delay-150 hover:scale-105 duration-300"
                onClick={handleQrCode}
              />
              <Button
                text="DELETE THE ACCOUNT"
                className="rounded-3xl w-2/5 p-2 h-12 opacity-80 cursor-pointer bg-red-700  transition ease-in-out delay-150 hover:scale-105 duration-300"
              />
            </div>
          </div>
          <div className="flex flex-col w-1/2 items-center gap-6 mt-16 px-10">
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
              className="border border-white text-center rounded-3xl w-[25%] h-12 my-14 opacity-95 cursor-pointer justify-self-end self-end bg-primecl shadow-[0px 4px 4px 0px rgba(0, 0, 0, 0.25)] transition ease-in-out delay-150 hover:scale-105 duration-300"
              onClick={updateUser}
            >
              Save
            </button>
            {success && (
              <div className="relative place-self-end w-[50%] flex items-center justify-self-end gap-3 justify-center bg-slate-200 rounded-t-md animate-bounce">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 16 16" fill="none" className="border-2 rounded-full border-segundcl">
                  <g clipPath="url(#clip0_804_3)">
                    <path d="M16 8C16 10.1217 15.1571 12.1566 13.6569 13.6569C12.1566 15.1571 10.1217 16 8 16C5.87827 16 3.84344 15.1571 2.34315 13.6569C0.842855 12.1566 0 10.1217 0 8C0 5.87827 0.842855 3.84344 2.34315 2.34315C3.84344 0.842855 5.87827 0 8 0C10.1217 0 12.1566 0.842855 13.6569 2.34315C15.1571 3.84344 16 5.87827 16 8ZM12.03 4.97C11.9586 4.89882 11.8735 4.84277 11.7799 4.80522C11.6863 4.76766 11.5861 4.74936 11.4853 4.75141C11.3845 4.75347 11.2851 4.77583 11.1932 4.81717C11.1012 4.85851 11.0185 4.91797 10.95 4.992L7.477 9.417L5.384 7.323C5.24182 7.19052 5.05378 7.1184 4.85948 7.12183C4.66518 7.12525 4.47979 7.20397 4.34238 7.34138C4.20497 7.47879 4.12625 7.66418 4.12283 7.85848C4.1194 8.05278 4.19152 8.24083 4.324 8.383L6.97 11.03C7.04128 11.1012 7.12616 11.1572 7.21958 11.1949C7.313 11.2325 7.41305 11.2509 7.51375 11.2491C7.61444 11.2472 7.71374 11.2251 7.8057 11.184C7.89766 11.1429 7.9804 11.0837 8.049 11.01L12.041 6.02C12.1771 5.8785 12.2523 5.68928 12.2504 5.49296C12.2485 5.29664 12.1698 5.10888 12.031 4.97H12.03Z" fill="#2B4E59"/>
                  </g>
                  <defs>
                    <clipPath id="clip0_804_3">
                      <rect width="16" height="16" fill="white"/>
                    </clipPath>
                  </defs>
                </svg>
                <a className="text-segundcl">Changes saved successfully</a>
              </div>
            )}
          </div>
        </div>
      )}
      {showDiv && user.user?.isTwoFactorAuthenticationEnabled === false && (
        <QrcodeDiv state={showDiv} OnClick={setShowDiv}/>
      )}
      {showDiv && user.user?.isTwoFactorAuthenticationEnabled === true && (
          <Disable2fa state={showDiv} OnClick={setShowDiv}/>
      )}
    </div>
  );
}
