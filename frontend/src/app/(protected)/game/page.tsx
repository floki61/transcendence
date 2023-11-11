"use client"
import Game from '@/components/Game';
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
 