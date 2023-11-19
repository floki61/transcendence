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
        <Award filled={true} picture="/spider.png"/>
        <Award filled={false}/>
        <Award filled={false}/>
        <Award filled={false}/>
      </div>
      <div className="flex items-center justify-around h-1/2 px-4">
        <Award filled={false}/>
        <Award filled={false}/>
        <Award filled={false}/>
        <Award filled={false}/>
      </div>
      <div className="flex items-center justify-around px-4"></div>
    </div>
  );
}
