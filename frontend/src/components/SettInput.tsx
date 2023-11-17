"use client";

import { faEye, faEyeDropper } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState, useRef } from "react";

interface SettinputProps {
  holder: string;
  type: string;
  value: string | undefined;
  className?: string;
  name: string;
  onChange(e: any): any;
}

const Settinput: React.FC<SettinputProps> = ({
  holder,
  type,
  value,
  className = "",
  onChange,
  name,
}) => {

  return (
      <input
        className={`${className} p-3 pl-4 rounded-xl bg-primecl placeholder-slate-400 text-lg outline-none font-light w-full`}
        placeholder={holder}
        value={value}
        onChange={(e) => {
          onChange(e);
        }}
        type={type}
        name={name}
      />
    );
};

export default Settinput;