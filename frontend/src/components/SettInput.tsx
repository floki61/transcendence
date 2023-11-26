"use client";

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
        className={`${className} p-3 pl-4 2xl:p-5 2xl:text-2xl rounded-xl bg-primecl placeholder-slate-400 text-lg outline-none font-light w-full`}
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