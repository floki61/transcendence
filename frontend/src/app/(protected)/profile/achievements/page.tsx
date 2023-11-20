"use client";
import { UserContext } from "@/context/userContext";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import Image from "next/image";
import { Award } from "@/components/Award";

interface AwardType {
  id: string;
  uid: string;
  achivementName: string;
  alreadyAchieved: boolean;
}

export default function page() {
  const [trophy, setTrophy] = useState<AwardType[]>([]);
  const user = useContext(UserContext);

  useEffect(() => {
    const getAwards = async () => {
      if (user.user) {
        try {
          const res = await axios.post(
            "http://localhost:4000/getAchievements",
            { id: user.user.id },
            {
              withCredentials: true,
            }
          );
          console.log("success ", res.data);
          setTrophy(res.data);
        } catch (error) {
          console.log("getAwards failed");
        }
      }
    };
    getAwards();
  }, []);

  return (
    <div className="w-full h-full">
      <div className="flex items-center justify-around h-1/2 px-4">
        <Award filled={trophy[0]?.alreadyAchieved} picture="/padd.png" className="top-[22%] left-[15%]" height={120} width={120}/>
        <Award filled={trophy[1]?.alreadyAchieved} picture="/medal.png" className="top-[18%] left-[19%]" height={100} width={100}/>
        <Award filled={trophy[2]?.alreadyAchieved} picture="/bot.png" className="top-[25%] left-[25%]" height={70} width={70}/>
        <Award filled={trophy[3]?.alreadyAchieved} picture="/octopus.png" className="top-[22%] left-[20%]" height={100} width={100}/>
      </div>
      <div className="flex items-center justify-around h-1/2 px-4">
        <Award filled={trophy[4]?.alreadyAchieved} picture="/donkey.png" className="top-[26%] left-[24%]" height={80} width={80}/>
        <Award filled={trophy[5]?.alreadyAchieved} picture="/ring.png" className="top-[25%] left-[28%]" height={70} width={70}/>
        <Award filled={trophy[6]?.alreadyAchieved} picture="/spider.png" className="top-[18%] left-[31%]" height={50} width={50}/>
      </div>
      <div className="flex items-center justify-around px-4"></div>
    </div>
  );
}
