"use client";

import { faEye, faEyeDropper } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";

interface SettinputProps {
  holder: string;
  type: string;
  value?: string;
  className?: string;
}

const Settinput: React.FC<SettinputProps> = ({
  holder,
  type,
  value,
  className = "",
}) => {
  return (
      <input
        className="p-3 pl-4 rounded-xl bg-primecl placeholder:text-white text-lg outline-none font-light w-full"
        placeholder={holder}
        value={value}
      />
  );
};

export default Settinput;
