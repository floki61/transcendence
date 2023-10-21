"use client"

import Image from "next/image"

interface ChatProps {
  // Other props specific to your component
  	name: string;
  	text: string;
	time: string;
	image: string;
}

const Chatbar:React.FC<ChatProps> = ({ name, text, time, image }) => {
	return (
	  <div className="w-5/6 flex justify-between border-b-2 border-primecl">
		  <div className="flex items-center gap-4 p-2">
			  <Image
				  src={image}
				  alt={"floki lherban"}
				  width={50}
				  height={50}
				  className="rounded-full"
			  />
			  <div className="flex flex-col justify-center">
				  <h2 className="text-xl">{name}</h2>
				  <p className="font-light">{text}</p>
			  </div>
		  </div>
		  <p className="text-sm font-light pt-3">{time}</p>
	  </div>
	)
}

export default Chatbar;