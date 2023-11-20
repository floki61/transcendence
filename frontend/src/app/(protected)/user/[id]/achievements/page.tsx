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

export default function page({params}: {params: any}) {
  const [trophy, setTrophy] = useState<AwardType[]>([]);
  const user = useContext(UserContext);

  useEffect(() => {
    const getAwards = async () => {
      if (params) {
        try {
          const res = await axios.post(
            "http://localhost:4000/getAchievements",
            { id: params.id },
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
        <Award filled={trophy[0]?.alreadyAchieved} picture="/newcomer.png" name={trophy[0]?.achivementName}/>
        <Award filled={trophy[1]?.alreadyAchieved} picture="/3wins.png" name={trophy[1]?.achivementName}/>
        <Award filled={trophy[2]?.alreadyAchieved} picture="/cyborg.png" name={trophy[2]?.achivementName}/>
        <Award filled={trophy[3]?.alreadyAchieved} picture="/octopus.png" name={trophy[3]?.achivementName}/>
      </div>
      <div className="flex items-center justify-around h-1/2 px-4">
        <Award filled={trophy[4]?.alreadyAchieved} picture="/Ping_Pong-removebg-preview (1).png" name={trophy[4]?.achivementName}/>
        <Award filled={trophy[5]?.alreadyAchieved} picture="/champ.png" name={trophy[5]?.achivementName}/>
        <Award filled={trophy[6]?.alreadyAchieved} picture="/spider.png" name={trophy[6]?.achivementName}/>
      </div>
    </div>
  );
}
