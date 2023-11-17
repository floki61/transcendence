"use client";

import { HistoryPanel } from "@/components/HistoryPanel";
import { UserContext } from "@/context/userContext";
import { useStats } from "@/hooks/useStats";
import { useState, useEffect, useContext } from "react";

export default function page() {
  const user = useContext(UserContext);
  const {stats, SetStats, getStats } = useStats();

  useEffect(() => {
    if (user.user) {
      console.log(user.user.id);
      getStats(user.user.id);
    }
  }, [user.user]);

  if (stats)
    console.log("The stats we got : ", stats);
  else
    console.log("baqi walo");

    return (
      <div className="h-full w-full py-6 px-16">
        <div className="h-1/4 w-full ">
          {stats && stats.gamestats?.length > 0 && stats.gamestats.map((stat, index) => (
            <HistoryPanel
              user={user.user}
              mode={stat.mode}
              index={index}
              opp={stat.player2Id}
              userScore={stat.player1Score}
              oppScore={stat.player2Score}
              winner={stat.winnerId}
              loser={stat.loserId}
            />
          ))}
        </div>
        {!stats && (
          <p className="text-center">still loading...</p>
        )}
      </div>
    );
}
