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
  createdAt: string;
}

export default function Page() {
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
          setTrophy(res.data);
        } catch (error) {}
      }
    };
    getAwards();
  }, [user.user]);
  console.log(trophy);
  const award0 = trophy?.filter((award) => award.achivementName === "1 win");
  const award1 = trophy?.filter((award) => award.achivementName === "3 wins");
  const award2 = trophy?.filter((award) => award.achivementName === "5 wins");
  const award4 = trophy?.filter((award) => award.achivementName === "Perfect win");
  const award5 = trophy?.filter((award) => award.achivementName === "kho lbhaym");
  return (
    <div className="w-full h-full">
      <div className="flex items-center justify-around h-1/2 px-4">
        <Award
          filled={award0[0]?.alreadyAchieved}
          picture="/newcomer.png"
          name={award0[0]?.achivementName}
          date={award0[0]?.createdAt}
        />
        <Award
          filled={award1[0]?.alreadyAchieved}
          picture="/3wins.png"
          name={award1[0]?.achivementName}
          date={award1[0]?.createdAt}
        />
        <Award
          filled={award2[0]?.alreadyAchieved}
          picture="/cyborg.png"
          name={award2[0]?.achivementName}
          date={award2[0]?.createdAt}
        />
        <Award
          filled={award4[0]?.alreadyAchieved}
          picture="/octopus.png"
          name={award4[0]?.achivementName}
          date={award4[0]?.createdAt}
        />
      </div>
      <div className="flex items-center justify-around h-1/2 px-4">
        <Award
          filled={award5[0]?.alreadyAchieved}
          picture="/Ping_Pong-removebg-preview (1).png"
          name={award5[0]?.achivementName}
          date={award5[0]?.createdAt}
        />
        <Award
          filled={trophy[5]?.alreadyAchieved}
          picture="/champ.png"
          name={trophy[5]?.achivementName}
          date={trophy[5]?.createdAt}
        />
        <Award
          filled={trophy[6]?.alreadyAchieved}
          picture="/spider.png"
          name={trophy[6]?.achivementName}
          date={trophy[6]?.createdAt}
        />
      </div>
    </div>
  );
}
