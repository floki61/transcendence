"use client";

import { faEye, faEyeDropper } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRef, useState } from "react";

interface LoginputProps {
  holder: string;
  type: string;
  className?: string;
}

const Loginput: React.FC<LoginputProps> = ({
  holder,
  type,
  className = "",
}) => {
  const [showPass, setshowPass] = useState(false);
  return (
    <div className={`relative ${className}`}>
      <input
	        type={showPass ? 'text' : type}

        className="border-b-2 w-full border-black text-xl outline-none"

        placeholder={holder}
      />
      {type === "password" && (
        <FontAwesomeIcon
		onClick={() => setshowPass(!showPass)}
          className={`w-4 absolute transition duration-400  hover:text-red-300 hover:scale-[1.1]  top-1/2 -translate-y-1/2 -right-0 cursor-pointer ${showPass ? "text-red-300" : ""}`}
          icon={faEye}
        />
      )}
    </div>
  );
};

export default Loginput;
