"use client";

import { useState, createContext, useContext, useEffect } from "react";
import { io, Socket } from "socket.io-client";
import { toast } from "react-toastify";
import Image from "next/image";
import { NotifBar } from "@/components/Notifications/NotifBar";

interface NotifSocketProp {
	socket: Socket | null;
}

const NotifContext = createContext<NotifSocketProp>({
	socket: null,
});

export const useNotif = () => useContext(NotifContext);

export const NotifProvider = ({ children }: { children: React.ReactNode }) => {
	const [socket, setSocket] = useState<Socket | null>(null);

	useEffect(() => {
		const newSocket = io("http://localhost:4000/users", {
			withCredentials: true,
		});
		setSocket(newSocket);

		return () => {
			newSocket.close();
		};
	}, []);

	useEffect(() => {
		if (!socket) return;

		socket.off("friendRequest").on("friendRequest", (data) => {
			toast(
				<NotifBar
					picture={data.user.picture}
					userName={data.user.userName}
					friendId={data.user.id}
					requestType="friend"
				/>
			);
		});
		socket.off("PlayRequest").on("PlayRequest", (data) => {
			toast(
					<NotifBar
						picture={data.picture}
						userName={data.userName}
						friendId={data.id}
						requestType="play"
					/>
			);
		});
		socket.off("PlayRequestAccepted").on("PlayRequestAccepted", (friendId) => {
			window.location.href = `http://localhost:3000/game?type=Friend&mode=simple&playerId=${friendId}`;
		});
		socket.off("PlayRequestRejected").on("PlayRequestRejected", (friendData) => {
			toast(
				<span>{friendData.userName} rejecte your play request</span>
			);
		});
		
	}, [socket]);

	return (
		<NotifContext.Provider value={{ socket }}>{children}</NotifContext.Provider>
	);
};
