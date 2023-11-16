"use client"
import { useState, createContext, useContext, useEffect, use } from 'react';
import {io, Socket} from 'socket.io-client';
import { useSearchParams } from 'next/navigation';
   
interface GameSocket {
    socket: Socket | null
}

const GameContext = createContext<GameSocket>({
    socket: null
});

export const useGame = () => useContext(GameContext);

export const GameProvider = ({ children }:{children: React.ReactNode}) => {
    const [socket, setSocket] = useState<Socket | null>(null);
    const query = useSearchParams();
    const type = query.get('type');
    const mode = query.get('mode');
 
    useEffect(() => {
        const newSocket = io('http://localhost:4000/game', {
            withCredentials: true,
        });
        setSocket(newSocket);

        return () => {
            newSocket.close()
        };
    }, []);

    useEffect(() => {
        if(!socket) return
        const game = {
            type,
            mode,
        }
        socket.on('connect', () => {
            socket.emit('gameMode', game);
        });
        socket.on('redirect', (url) => {
            window.location.href = url;
        });
        return () => {
            socket.close()
        }
    }, [socket]);

    
    return (
        <GameContext.Provider value={{socket}}>
            {children}
        </GameContext.Provider>
    );
}