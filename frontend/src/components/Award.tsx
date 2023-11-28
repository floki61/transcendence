import Image from "next/image";
import { useState } from "react";

interface AwardProps {
  picture?: string;
  name?: string;
  filled?: boolean;
  date: string;
}

export const Award: React.FC<AwardProps> = ({ picture, filled, name, date }) => {
  const [card, setCard] = useState(false);

  return (
    <div className={`transition duration-1000 w-[15%] h-full`} style={card ? { transform: "rotateY(180deg)" } : {}}>
      <div className={`${filled ? "" : "opacity-75 blur-sm"} w-full h-full shadow-xl flex flex-col items-center justify-center border-4 border-yellow-950 rounded-lg bg-primecl cursor-pointer`} onClick={() => { if (filled) setCard(!card) }}>
        {!card && picture && (
          <div className="flex flex-col items-center">
            <Image
              src={picture}
              alt="award"
              height={160}
              width={160}
              title={"Award earned after " + (name ? name : "???")}
              priority
            />
            <p>{name}</p>
          </div>
          )}
        {card && filled && date && (
          <div className="flex flex-col items-center justify-evenly w-full h-full" style={card ? {transform: "rotateY(180deg)"} : {}}>
            <div className="flex flex-col items-center w-1/2">
              <p className="text-xl tracking-wider text-yellow-800">TITLE</p>
              <p className="text-sm">{name}</p>
            </div>
            <div className="flex flex-col items-center w-1/2">
              <p className="text-xl tracking-wider text-yellow-800">DATE</p>
              <p className="text-sm">{date.substring(0, 10)}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
