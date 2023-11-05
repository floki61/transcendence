"use client"

import Image from "next/image"
import Chatmsg from "@/components/Chatmsg"
import Chatbar from "@/components/Chatbar"
import Audio from "@/components/Audio"
import Convo from "@/components/Convo"
import { useCallback, useEffect, useState } from "react"
import { ConvoProps } from "@/components/Convo"
import axios from "axios"
import { useContext } from "react"
import { UserContext } from "@/context/userContext"



export default function ChatLayout({
	children,
}: {
	children: React.ReactNode
}) {

	const [cnv, setCnv] = useState({
		name: "Floki",
		picture: "/oel-berh.jpeg",
		status: "online",
	});

	const user = useContext(UserContext)

	// const handleChange = (name: string, image: string, status: string) => {
	// 	setCnv({name: name, picture: image, status: status});
	//   };
	useEffect(() => {
		const getUsers = async () => {
			try {
				const res = await axios.get("http://localhost:4000/myRooms", {
					withCredentials: true
				});
				console.log(res.data);
			} catch (error) {
				console.log("hadchi baqi makhdamch");
			}
		}
		getUsers();
	}, []);

	// const handleClick = useCallback(() => {
	// 		// try {
	// 		const res = await axios.post("http://localhost:4000/getMyRooms", user.user?.id ,{
	// 			withCredentials: true,
	// 		});
	// 		.then((user) => {
				
	// 		})
	// 		console.log("In chat : ", res.data);


	// 	};

	// }, []);

	return (
		<div className="flex h-full text-white">
			<div className="h-full w-1/3 flex flex-col items-center gap-4 py-8 border-r-2 border-primecl overflow-scroll">
				<div className="w-full flex justify-center">
					<Chatbar
						name="Floki"
						text="3wej rwayda"
						time="20:40"
						image="/oel-berh.jpeg"
					/>
				</div>
				<div className="w-full flex justify-center">
					<Chatbar
						name="Achraf"
						text="hhhhhhhhhhh"
						time="14:20"
						image="/ael-fadi.jpeg"
					/>
				</div>
				<div className="w-full flex justify-center">
					<Chatbar
						name="Qli"
						text="Haslas o chefar"
						time="00:30"
						image="/abayar.jpeg"
					/>
				</div>
				<div className="w-full flex justify-center">
					<Chatbar
						name="Dopa"
						text="dir lkit"
						time="Yesterday"
						image="/mbaioumy.jpeg"
					/>
				</div>
				<div className="w-full flex justify-center">
					<Chatbar
						name="Leda"
						text="jib meak garo"
						time="Yesterday"
						image="/mamali.jpeg"
					/>
				</div>
				<div className="w-full flex justify-center">
					<Chatbar
						name="Jojo"
						text="chi smita ?"
						time="2 days ago"
						image="/mait-si-.jpeg"
					/>
				</div>
				<div className="w-full flex justify-center">
					<Chatbar
						name="Yayba"
						text="nwa9es"
						time="month ago"
						image="/melkarmi.jpeg"
					/>
				</div>
				<div className="w-full flex justify-center">
					<Chatbar
						name="Room"
						text="khrat"
						time="month ago"
						image="/quick game.jpeg"
					/>
				</div>
      		</div>
			<div className="flex flex-1 overflow-hidden">
				<div className="flex-1 overflow-x-hidden overflow-auto">
					{/* <Convo picture={cnv.picture} name={cnv.name} status="online"/> */}
					{children}
				</div>
			</div>
		</div>
	)
}