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
  id: string | undefined;
  blockSender:{
    uid: string;
    fid: string;
  }[];
  blockReceiver:{
    uid: string;
    fid: string;
  }[];
}

const Chatmsg: React.FC<MsgProps> = ({
  picture,
  text,
  time,
  room,
  id,
  className,
  blockReceiver,
  blockSender,
}) => {
  const classes = `${className}`;
  // console.log(text ," || ", id );

  const result = blockReceiver?.filter((block) => block.uid === id)
  const result2 = blockSender?.filter((block) => block.fid === id)
  // console.log({result});
  // console.log({result2});

  return (
    <div className="flex gap-2">
      {room && (
        <Image
          loader={() => picture || "/placeholder.jpg"}
          src={picture || "/placeholder.jpg"}
          alt="friend pic"
          height={30}
          width={30}
          className={`rounded-full aspect-square w-8 h-8 object-cover ${(result?.length > 0 || result2?.length > 0) ? " hidden " : ""}`}
          unoptimized
        />
      )}
      <div className={`${classes} ${(result?.length > 0 || result2?.length > 0) ? " hidden " : ""}`}>
        <p className="py-1 px-2 break-all">{text}</p>
        <p className="self-end px-1 pt-1 text-[10px] text-slate-300">{time}</p>
      </div>
    </div>
  );
};

export default Chatmsg;
