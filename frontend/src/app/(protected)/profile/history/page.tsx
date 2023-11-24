"use client";

import { HistoryPanel } from "@/components/HistoryPanel";
import { UserContext } from "@/context/userContext";
import { useStats } from "@/hooks/useStats";
import { useState, useEffect, useContext } from "react";

export default function Page() {
  const user = useContext(UserContext);
  const {stats, SetStats, getStats } = useStats();

  useEffect(() => {
    if (user.user) {
      getStats(user.user.id);
    }
  }, [user.user]);

    return (
      <div className="h-full w-full py-6 px-16">
        <div className="h-1/4 w-full">
          {stats && stats.gamestats?.length > 0 && stats.gamestats.map((stat, index) => (
            <div key={index} className="w-full h-full">
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
            </div>
          ))}
        </div>
        {!stats && (
          <p className="text-center">still loading...</p>
        )}
      </div>
    );
}
