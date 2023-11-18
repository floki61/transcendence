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
			// if (data.type === "friendRequest")
			toast(
		<NotifBar
			picture={data.user.picture}
			userName={data.user.userName}
			friendId={data.user.id}
			requestType="friend"
		/>
			);
			
			// else if (data.type === "PlayRequest")
			// 	toast(<div>
			// 	<Image
			// 		src={data.user.picture}
			// 		alt="friend pic"
			// 		height={30}
			// 		width={30}
			// 		className="rounded-full"
			// 	/>
			// 	<span>{data.user.userName} sent you a friend request</span>
			// 	</div>)
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
		socket.off("PlayRequestAccepted").on("PlayRequestAccepted", (data) => {
			window.location.href = `http://localhost:3000/game?type=Friend&mode=simple&playerId=${data}`;
		});
		
	}, [socket]);

	return (
		<NotifContext.Provider value={{ socket }}>{children}</NotifContext.Provider>
	);
};
