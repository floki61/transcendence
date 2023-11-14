"use client"

import Image from "next/image"

interface ChatProps {
	name: string;
	text: string;
	time: string;
	image: string;
	visible: string;
	dm: boolean;
}

const Chatbar: React.FC<ChatProps> = ({ name, text, time, image, visible, dm }) => {
	let msg;

	if (text && text.length > 25)
		msg = text.substring(0, 24) + "...";
	else
		msg = text;

	return (
		<div className="flex justify-between border-t border-primecl py-3 hover:bg-quatrocl/40 px-4">
			<div className="flex gap-3 flex-1">
				<Image
					src={image || "/placeholder.jpg"}
					alt={"floki lherban"}
					width={50}
					height={50}
					className="rounded-full aspect-square object-cover h-12 w-12"
				/>
				<div className="flex flex-col w-full max-w-[230px]">
					<h2 className="text-xl truncate break-all">{name}</h2>
					<p className="font-light truncate">{msg || "Send a text"}</p>
				</div>
			</div>
			<div className="flex flex-col text-white/60">
				<p className="text-sm font-light ">{time || ""}</p>
				<p className={`${dm === true ? "hidden" : ""} text-xs font-light lowercase self-end`} >{visible || ""}</p>
			</div>
		</div>
	)
}

export default Chatbar;
