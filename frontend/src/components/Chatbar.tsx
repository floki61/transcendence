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

const Chatbar:React.FC<ChatProps> = ({name, text, time, image, visible, dm }) => {

	let msg;

	if (text && text.length > 25)
		msg = text.substring(0, 24) + "...";
	else
		msg = text;

	return (
	  <div className="w-full h-full flex justify-between items-center border-t-2 border-primecl">
		  <div className="flex gap-4 h-3/4">
			  <Image
				  src={image || "/placeholder.jpg"} 
				  alt={"floki lherban"}
				  width={50}
				  height={50}
				  className="rounded-full"
			  />
			  <div className="flex flex-col">
				  <h2 className="text-xl">{name}</h2>
				  <p className="font-light">{msg || "Send a text"}</p>
			  </div>
		  </div>
		  <div className="flex flex-col justify-between h-full">
			<p className="text-sm font-light pt-2">{time || ""}</p>
			<p className={`${dm === true ? "hidden" : ""} text-xs font-light lowercase self-end pb-1`} >{visible || ""}</p>
		  </div>
	  </div>
	)
}

export default Chatbar;
