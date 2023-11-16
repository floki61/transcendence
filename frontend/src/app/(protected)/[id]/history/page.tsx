"use client";

import { HistoryPanel } from "@/components/HistoryPanel";
import { UserContext } from "@/context/userContext";
import { useStats } from "@/hooks/useStats";
import { useState, useEffect, useContext } from "react";
import { useFriend } from "@/hooks/useFriend";

export default function page({params}: {params: any}) {
  const user = useContext(UserContext);
  const {stats, SetStats, getStats } = useStats();
  const [iter, SetIter] = useState(0);
	const {friend, SetFriend} = useFriend(params.id);


  useEffect(() => {
    if (params) {
      console.log(params.id);
      getStats(params.id);
    }
  }, [params]);

  if (stats)
    console.log("The stats we got : ", stats);
  else
    console.log("baqi walo");

    return (
      <div className="h-full w-full py-6 px-16">
        <div className="h-1/4 w-full ">
          {stats && stats.gamestats?.length > 0 && iter < 4 && stats.gamestats.map((stat, index) => (
            <HistoryPanel
              user={friend?.user}
              mode={stat.mode}
              index={index}
              opp={stat.player1Id}
              userScore={stat.player2Score}
              oppScore={stat.player1Score}
              winner={stat.winnerId}
              iter={iter}
              SetIter={SetIter}
            />
          ))}
        </div>
        {!stats && (
          <p className="text-center">still loading...</p>
        )}
      </div>
    );
}
