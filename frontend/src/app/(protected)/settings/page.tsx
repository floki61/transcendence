"use client";
import Settinput from "@/components/SettInput";
import Button from "@/components/Button";
import Image from "next/image";
import axios from "axios";
import { useEffect, useState, useRef } from "react";
import Link from "next/link";

export interface userType {
  id: string;
  email: string;
  picture: string;
  fullName: string;
  userName: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  country: string;
}

export default function page() {
  const [user, setUser] = useState<userType>();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("http://localhost:4000/getUser", {
          withCredentials: true,
        });
        console.log(res.data);
        setUser(res.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  
  const updateUser = async () => {
    try {
      await axios.post("http://localhost:4000/userSettings", user, {
        withCredentials: true,
      }); // backend API endpoint
      console.log(user);
    } catch (error) {
        console.error(error);
    }
  };
  
  const hnadleChange = (e: any) => {
    const { name, value } = e.target;
  
    if (name === "phoneNumber" && !Number(value) && value !== "" && value !== '0')
      return ;
  
    const newUser = { ...user, [name]: value };
    setUser(newUser as userType);
  };

  const hiddenFileInput = useRef<HTMLInputElement>(null);
  const handleClick = (e:any) => {
    if (hiddenFileInput.current)
      hiddenFileInput.current.click();
  };


  const [showDiv, setShowDiv] = useState(false);

  const handleQrCode = () => {
    console.log("first")
    setShowDiv(!showDiv);
  };

  let classes = "";

  if (user)
    user.fullName = user.firstName + " " + user.lastName;

  if (showDiv) {
    classes = "blur";
    console.log("blur-sm");
  }
  else {
    console.log("not blur");
    classes = "";
  }

  const [input, setInput] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Ensure that the value is a 6-digit number
    if (/^\d{0,9}$/.(value)) {
      setInput(value);
    }
  };

  return (
    <div className="h-full">
      {user && (
        <div className={`${classes} flex rounded-2xl bg-segundcl h-[90%] m-8`}>
          <div className="flex flex-col w-1/2 border-r-4 border-primecl justify-center items-center my-6 gap-6">
            <div className="flex flex-col items-center gap-3 h-1/2 w-full mt-4">
              <Image
                src={user.picture}
                alt={"profile pic"}
                width={100}
                height={100}
                className="rounded-full"
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
                    onChange={hnadleChange}
                    ref={hiddenFileInput}
                    name="picture"
                    placeholder="UPLOAD A PHOTO"
                    className="hidden"
                  />
                </button>
              </div>
            </div>
            <div className="w-2/3 border-t-4 border-primecl mt-4">
              <h3 className="my-4 text-lg">SECURITY</h3>
            </div>
            <div className="flex flex-col items-center gap-8 h-1/2 w-full">
              <Button
                text="ENABLE 2FA"
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
              value={user.fullName}
              name="fullName"
              onChange={hnadleChange}
              className="text-slate-400"
            />
            <Settinput
              holder="Username"
              type="text"
              value={user.userName}
              name="userName"
              onChange={hnadleChange}
            />
            <Settinput
              holder="Email"
              type="text"
              value={user.email}
              name="Email"
              onChange={hnadleChange}
              className="text-slate-400"
            />
            <Settinput
              holder="Country"
              type="text"
              value={user.country}
              name="country"
              onChange={hnadleChange}
            />
            <Settinput
              holder="Phone Number"
              type="text"
              value={user.phoneNumber}
              name="phoneNumber"
              onChange={hnadleChange}
            />
            <button
              className="border border-white text-center rounded-3xl w-[25%] h-12 my-auto opacity-95 cursor-pointer justify-self-end self-end bg-primecl shadow-[0px 4px 4px 0px rgba(0, 0, 0, 0.25)] transition ease-in-out delay-150 hover:scale-105 duration-300"
              onClick={updateUser}
            >
              Save
            </button>
          </div>
        </div>
      )}
      {showDiv && (
          <div className="flex debug flex-col justify-around items-center border-2 border-quatrocl absolute top-[20%] left-1/3 w-1/3 h-2/3 bg-segundcl rounded-lg text-primecl">
            <div>QR CODE</div>
            <div className="flex gap-2 justify-center items-center">
              <input className="text-center w-10 h-16 rounded-md" type="text" maxLength={1} onChange={handleInputChange}/>
              <input className="text-center w-10 h-16 rounded-md" type="text" maxLength={1} onChange={handleInputChange}/>
              <input className="text-center w-10 h-16 rounded-md" type="text" maxLength={1} onChange={handleInputChange}/>
              <input className="text-center w-10 h-16 rounded-md" type="text" maxLength={1} onChange={handleInputChange}/>
              <input className="text-center w-10 h-16 rounded-md" type="text" maxLength={1} onChange={handleInputChange}/>
              <input className="text-center w-10 h-16 rounded-md" type="text" maxLength={1} onChange={handleInputChange}/>
            </div>
          </div>
      )}
    </div>
  );
}
