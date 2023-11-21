"use client";

import Image from "next/image";

interface StylingProps {
  className?: string;
}

interface MsgProps extends StylingProps {
  picture?: string;
  text: string;
  time: string;
  room?: boolean;
}

const Chatmsg: React.FC<MsgProps> = ({
  picture,
  text,
  time,
  room,
  className,
}) => {
  const classes = `${className}`;

  return (
    <div className="flex gap-2">
      {room && (
        <Image
          src={picture || "/placeholder.jpg"}
          alt="friend pic"
          height={30}
          width={30}
          className="rounded-full aspect-square w-8 h-8 object-cover"
        />
      )}
      <div className={`${classes}`}>
        <p className="py-1 px-2 break-all">{text}</p>
        <p className="self-end px-1 pt-1 text-[10px] text-slate-300">{time}</p>
      </div>
    </div>
  );
};

export default Chatmsg;
