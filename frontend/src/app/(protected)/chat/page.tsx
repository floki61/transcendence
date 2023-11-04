"use client"

import Image from "next/image"
import Chatmsg from "@/components/Chatmsg"
import Chatbar from "@/components/Chatbar"
import Audio from "@/components/Audio"
import Convo from "@/components/Convo"
import { useState } from "react"
import { ConvoProps } from "@/components/Convo"



export default function page() {

	const [cnv, setCnv] = useState({
		name: "Floki",
		picture: "/oel-berh.jpeg",
		status: "online",
	});

	const handleChange = (name: string, image: string, status: string) => {
		setCnv({name: name, picture: image, status: status});
	  };

	return (
		<div className="flex h-full text-white">
			<div className="h-full w-1/3 flex flex-col items-center gap-4 py-8 border-r-2 border-primecl overflow-scroll">
				<Chatbar
					name="Floki"
					text="3wej rwayda"
					time="20:40"
					image="/oel-berh.jpeg"
					OnClick={handleChange}
				/>
				<Chatbar
					name="Achraf"
					text="hhhhhhhhhhh"
					time="14:20"
					image="/ael-fadi.jpeg"
					OnClick={handleChange}
				/>
				<Chatbar
					name="Qli"
					text="Haslas o chefar"
					time="00:30"
					image="/abayar.jpeg"
					OnClick={handleChange}
				/>
				<Chatbar
					name="Dopa"
					text="dir lkit"
					time="Yesterday"
					image="/mbaioumy.jpeg"
					OnClick={handleChange}
				/>
				<Chatbar
					name="Leda"
					text="jib meak garo"
					time="Yesterday"
					image="/mamali.jpeg"
					OnClick={handleChange}
				/>
				<Chatbar
					name="Jojo"
					text="chi smita ?"
					time="2 days ago"
					image="/mait-si-.jpeg"
					OnClick={handleChange}
				/>
				<Chatbar
					name="Yayba"
					text="nwa9es"
					time="month ago"
					image="/melkarmi.jpeg"
					OnClick={handleChange}
				/>
				<Chatbar
					name="Room"
					text="khrat"
					time="month ago"
					image="/quick game.jpeg"
					OnClick={handleChange}
				/>
      		</div>
			<div className="flex flex-1 overflow-hidden">
				<div className="flex-1 overflow-x-hidden overflow-auto">
					<Convo picture={cnv.picture} name={cnv.name} status="online"/>
				</div>
			</div>
		</div>
	)
}