"use client"
import Game from '@/components/Game';
import { GameProvider } from "@/context/gameSocket"

export default function page() {


   return (
      <GameProvider>
         <div style={{ overflow: 'hidden', height: '100vh', width: '100vw', margin: 0, padding: 0 }}>
            <Game />
         </div>
      </GameProvider>
   );
}
