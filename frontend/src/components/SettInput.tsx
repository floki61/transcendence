"use client";

import { faEye, faEyeDropper } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import { useEffect, useState, useRef } from "react";
import { userType } from "@/app/(protected)/settings/page";

interface SettinputProps {
  holder: string;
  type: string;
  value?: string;
  className?: string;
  user: userType;
}

const Settinput: React.FC<SettinputProps> = ({
  holder,
  type,
  value,
  className = "",
  user,

}) => {

  const [inputValue, setinputValue] = useState(value);

  function handleValue(e:any) {

    if (holder === "Username") {
      setinputValue(e.target.value)
      user.userName = e.target.value;
    }
    if (holder === "Country") {
      setinputValue(e.target.value);
      user.country = e.target.value;
    }
    if (holder === "Phone Number") {
      const value = e.target.value;
      const regex = /^[0-9\b]+$/;

      if (value === '' || regex.test(value)) {
        setinputValue(value);
        user.phoneNumber = value;
      }
    }
  }
  return (
      <input
        className="p-3 pl-4 rounded-xl bg-primecl placeholder:text-white text-lg outline-none font-light w-full"
        placeholder={holder}
        value={inputValue !== null ? inputValue : value || ""}
        onChange={handleValue}
        type={type}
      />
    );
};

export default Settinput;