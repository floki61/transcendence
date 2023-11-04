"use client"
import Game from '@/components/Game';
import Botgame from '@/components/Botgame';
import {GameProvider} from "@/context/gameSocket"

export default function App() {

   return (
      <GameProvider>
     <div className="flex justify-center">
        <Game />
     </div>
      </GameProvider>
   );
}
