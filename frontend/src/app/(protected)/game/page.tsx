import Game from '@/components/Game';
import { GameProvider } from "@/context/gameSocket"

export default function Page() {
   return (
      <GameProvider>
         <div style={{ overflow: 'hidden', height: '100%', width: '100vw', margin: 0, padding: 0 }}>
            <Game />
         </div>
      </GameProvider>
   );
}
