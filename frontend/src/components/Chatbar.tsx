"use client"

import Image from "next/image"

interface ChatProps {
  	name: string;
  	text: string;
	time: string;
	image: string;
	OnClick?(name: string, image: string, status: string): void;
}

const Chatbar:React.FC<ChatProps> = ({name, text, time, image, OnClick }) => {

	// const changeDisplay = () => {
	// 	// OnClick(name, image, "online");
	// 	console.log(name);
	// 	console.log(image);
	// }
	let msg;

	if (text && text.length > 25)
		msg = text.substring(0, 24) + "...";
	else
		msg = text;

	return (
	  <div className="w-full h-full flex justify-between items-center border-t-2 border-primecl">
		  <div className="flex gap-4 h-3/4">
			  <Image
				  src={image}
				  alt={"floki lherban"}
				  width={50}
				  height={50}
				  className="rounded-full"
			  />
			  <div className="flex flex-col">
				  <h2 className="text-xl">{name}</h2>
				  <p className="font-light">{msg}</p>
			  </div>
		  </div>
		  <p className="text-sm font-light pt-3 self-start">{time}</p>
	  </div>
	)
}

export default Chatbar;
