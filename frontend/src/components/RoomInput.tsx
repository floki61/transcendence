import React from 'react'

interface RoomInputProps {
  classname?: string;
  holder: string;
  type: string;
  value?: string;
  name?: string;
  onChange(e: any): any;
}

const RoomInput: React.FC<RoomInputProps> = ({
  classname,
  holder,
  type,
  value,
  name,
  onChange,
}) => {
  return (
    <input
      className={`${classname} p-3 pl-4 rounded-xl bg-primecl placeholder-slate-400 text-lg outline-none font-light w-full`}
      placeholder={holder}
      type={type}
      value={value}
      onChange={(e) => {
        onChange(e);
      }}
      name={name}
    />
  )
}

export default RoomInput
