"use client"
import Game from '@/components/Game';
import { GameProvider } from "@/context/gameSocket"

export default function page() {


   return (
      <GameProvider>
         <div className="overflow-hidden">
            <Game />
         </div>
      </GameProvider>
   );
}
